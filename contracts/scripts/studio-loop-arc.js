// Replay the Studio's three governor/steward actions on one commons, with the
// same arguments the Studio forms send: lend -> attest -> recognise delivery.
// Usage: node scripts/studio-loop-arc.js <commonsId> <amountEURC> <homes> <sqm>
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8")).abi;
const eur = (v) => ethers.formatUnits(v, 6);

async function main() {
  const [id, amount, homes, sqm] = process.argv.slice(2);
  if (!id || !amount || !homes || !sqm) throw new Error("usage: <commonsId> <amountEURC> <homes> <sqm>");
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const me = w.address;
  const pool = new ethers.Contract(d.pool, art("TourismImpactPool"), w);
  const registry = new ethers.Contract(d.registry, art("HousingCommonsRegistry"), w);
  const proof = new ethers.Contract(d.proof, art("ProofOfImpact"), w);
  const status = async () => (await registry.commons(id)).status.toString();

  console.log(`commons ${id} (${(await registry.commons(id)).name}) status before: ${await status()} (0 Proposed)`);
  console.log("host homes before:", (await pool.homesFundedBy(me)).toString());

  let tx = await pool.disburseCredit(id, me, ethers.parseUnits(amount, 6), me);
  console.log(`1. lend ${amount} EURC:`, (await tx.wait()).hash, "status", await status());
  tx = await proof.attest(id, Number(homes), Number(sqm), `ipfs://evidence-${id}`);
  console.log(`2. attest ${homes} homes / ${sqm} m2:`, (await tx.wait()).hash);
  tx = await pool.recognizeDelivery(id);
  console.log("3. recognise delivery:", (await tx.wait()).hash, "status", await status());

  console.log("host homes after:", (await pool.homesFundedBy(me)).toString(), "star", (await pool.starFor(me)).toString());
  console.log("pool value:", eur(await pool.totalAssets()), "credit extended:", eur(await pool.creditExtended()));
}

main().catch((e) => {
  console.error(e.shortMessage || e.message);
  process.exit(1);
});
