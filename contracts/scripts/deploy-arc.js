// Deploy the stack to Arc testnet with ethers (no hardhat compile step).
// Reads artifacts from build/, the deployer key + EURC address from .env.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");

function art(name) {
  return JSON.parse(fs.readFileSync(path.join(BUILD, `${name}.json`), "utf8"));
}

async function deploy(wallet, name, args = []) {
  const { abi, bytecode } = art(name);
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const c = await factory.deploy(...args);
  await c.waitForDeployment();
  const addr = await c.getAddress();
  console.log(`  ${name}: ${addr}`);
  return c;
}

async function main() {
  const rpc = process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io";
  const provider = new ethers.JsonRpcProvider(rpc);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  console.log("Deployer:", wallet.address);
  console.log("Balance :", ethers.formatEther(await provider.getBalance(wallet.address)), "USDC (gas)");

  const eurc = process.env.EURC_ADDRESS;
  if (!eurc) throw new Error("EURC_ADDRESS not set");
  console.log("EURC    :", eurc, "\nDeploying...");

  const registry = await deploy(wallet, "HousingCommonsRegistry", [wallet.address]);
  const certificate = await deploy(wallet, "ImpactCertificate", [wallet.address]);
  const proof = await deploy(wallet, "ProofOfImpact", [await registry.getAddress()]);

  // Tier thresholds in EURC (6 decimals): 25k / 100k / 250k
  const pool = await deploy(wallet, "TourismImpactPool", [
    eurc,
    await certificate.getAddress(),
    await registry.getAddress(),
    await proof.getAddress(),
    wallet.address,
    25_000_000_000n,
    100_000_000_000n,
    250_000_000_000n,
  ]);

  console.log("Wiring ownership...");
  await (await certificate.transferOwnership(await pool.getAddress())).wait();
  await (await registry.setPool(await pool.getAddress())).wait();

  const deployed = {
    network: "arcTestnet",
    chainId: 5042002,
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
