// Deploy the stack to Arc testnet with ethers (no hardhat compile step).
// One fixed-rate lending pool at 3%; the star is impact-driven (homes funded).
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const art = (name) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${name}.json`), "utf8"));

async function deploy(wallet, name, args = []) {
  const { abi, bytecode } = art(name);
  const c = await new ethers.ContractFactory(abi, bytecode, wallet).deploy(...args);
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log(`  ${name}: ${addr}`);
  return c;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance :", ethers.formatEther(await provider.getBalance(wallet.address)), "USDC (gas)");
  const eurc = process.env.EURC_ADDRESS;
  if (!eurc) throw new Error("EURC_ADDRESS not set");
  console.log("EURC    :", eurc, "\nDeploying...");

  const registry = await deploy(wallet, "HousingCommonsRegistry", [wallet.address]);
  const certificate = await deploy(wallet, "ImpactCertificate", [wallet.address]);
  const proof = await deploy(wallet, "ProofOfImpact", [await registry.getAddress()]);
  const pool = await deploy(wallet, "TourismImpactPool", [
    eurc, await certificate.getAddress(), await registry.getAddress(), await proof.getAddress(),
    wallet.address, 300, // 3%
  ]);
  await (await certificate.setMinter(await pool.getAddress(), true)).wait();
  await (await registry.setPool(await pool.getAddress(), true)).wait();

  const deployed = {
    network: "arcTestnet",
    chainId: 5042002,
    rateBps: 300,
    eurc,
    registry: await registry.getAddress(),
    certificate: await certificate.getAddress(),
    proof: await proof.getAddress(),
    pool: await pool.getAddress(),
    deployer: wallet.address,
  };
  fs.writeFileSync(path.join(ROOT, "deployed.arc.json"), JSON.stringify(deployed, null, 2));
  console.log("\nSaved deployed.arc.json:\n", JSON.stringify(deployed, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
