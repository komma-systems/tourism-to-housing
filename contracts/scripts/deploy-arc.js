// Deploy the stack to Arc testnet with ethers (no hardhat compile step).
// Three single-rate pools: 2.5% (★★★), 3% (★★), 3.5% (★).
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const BUILD = path.join(ROOT, "build");
const art = (name) => JSON.parse(fs.readFileSync(path.join(BUILD, `${name}.json`), "utf8"));

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

  const tiers = [
    { key: "star3", rate: 250, star: 3 },
    { key: "star2", rate: 300, star: 2 },
    { key: "star1", rate: 350, star: 1 },
  ];
  const pools = {};
  for (const t of tiers) {
    const p = await deploy(wallet, "TourismImpactPool", [
      eurc, await certificate.getAddress(), await registry.getAddress(), await proof.getAddress(),
      wallet.address, t.rate, t.star,
    ]);
    pools[t.key] = await p.getAddress();
    await (await certificate.setMinter(pools[t.key], true)).wait();
    await (await registry.setPool(pools[t.key], true)).wait();
  }

  const deployed = {
    network: "arcTestnet",
    chainId: 5042002,
    eurc,
    registry: await registry.getAddress(),
    certificate: await certificate.getAddress(),
    proof: await proof.getAddress(),
    pools, // star3 = 2.5%, star2 = 3%, star1 = 3.5%
    deployer: wallet.address,
  };
  fs.writeFileSync(path.join(ROOT, "deployed.arc.json"), JSON.stringify(deployed, null, 2));
  console.log("\nSaved deployed.arc.json:\n", JSON.stringify(deployed, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
