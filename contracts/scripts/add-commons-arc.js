// Register one new housing commons on Arc and leave it open (Proposed), ready
// for the live governor-lend in the demo.
// Usage: node scripts/add-commons-arc.js <Name> <geohash> <homes> <sqm>
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const abi = JSON.parse(fs.readFileSync(path.join(ROOT, "build", "HousingCommonsRegistry.json"), "utf8")).abi;

async function main() {
  const [name, geohash, homes, sqm] = process.argv.slice(2);
  if (!name || !geohash || !homes || !sqm) throw new Error("usage: <Name> <geohash> <homes> <sqm>");
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const registry = new ethers.Contract(d.registry, abi, w);

  const existing = Number(await registry.nextId()) - 1;
  for (let id = 1; id <= existing; id++) {
    if ((await registry.commons(id)).name === name) {
      console.log(`${name} already registered as commons ${id}`);
      return;
    }
  }
  const tx = await registry.register(w.address, name, geohash, "coop · cessió d'ús", Number(homes), Number(sqm), w.address);
  const rc = await tx.wait();
  const id = Number(await registry.nextId()) - 1;
  const c = await registry.commons(id);
  console.log(`registered ${name} as commons ${id}: ${c.homes} homes, ${c.squareMetres} m², status ${c.status} (0 = Proposed)`);
  console.log("tx:", rc.hash);
}

main().catch((e) => {
  console.error(e.shortMessage || e.message);
  process.exit(1);
});
