// Run the full loop on Roquetes (commons 3) end to end with real EURC on Arc:
// contribute -> lend -> attest -> recognise delivery. Each step is a real tx.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8")).abi;
const eur = (v) => ethers.formatUnits(v, 6);

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const me = w.address;
  const eurc = new ethers.Contract(d.eurc, art("MockEURC"), w);
  const pool = new ethers.Contract(d.pool, art("TourismImpactPool"), w);
  const registry = new ethers.Contract(d.registry, art("HousingCommonsRegistry"), w);
  const proof = new ethers.Contract(d.proof, art("ProofOfImpact"), w);

  const ROQUETES = 3;

  // 1. Contribute: deposit idle EURC into the pool so there is cash to lend.
  let idle = await eurc.balanceOf(d.pool);
  const bal = await eurc.balanceOf(me);
  if (idle < 1_000_000n && bal > 0n) {
    await (await eurc.approve(d.pool, bal)).wait();
    const tx = await pool.deposit(bal, me);
    console.log("1. contribute:", eur(bal), "EURC deposited —", (await tx.wait()).hash);
    idle = await eurc.balanceOf(d.pool);
  } else {
    console.log("1. contribute: pool already has idle cash", eur(idle));
  }
  console.log("   host contribution share:", Number(await pool.contributionBps(me)) / 100, "% → ★" + (await pool.starFor(me)));

  // 2. Lend to Roquetes on behalf of the host.
  const loan = idle >= 1_000_000n ? 1_000_000n : idle;
  let tx = await pool.disburseCredit(ROQUETES, me, loan, me);
  console.log("2. lend:", eur(loan), "EURC to Roquetes —", (await tx.wait()).hash);
  console.log("   Roquetes status:", (await registry.commons(ROQUETES)).status.toString(), "(1 = Funded)");

  // 3. Steward attests delivery.
  tx = await proof.attest(ROQUETES, 12, 720, "ipfs://evidence-3");
  console.log("3. attest: 12 homes / 720 m² —", (await tx.wait()).hash);

  // 4. Governor recognises delivery: credits homes, marks Delivered.
  tx = await pool.recognizeDelivery(ROQUETES);
  console.log("4. recognise delivery —", (await tx.wait()).hash);

  // Final state
  console.log("\n--- loop complete ---");
  console.log("Roquetes status:", (await registry.commons(ROQUETES)).status.toString(), "(2 = Delivered)");
  console.log("host homes funded:", (await pool.homesFundedBy(me)).toString());
  console.log("host star: ★" + (await pool.starFor(me)));
  console.log("pool total value:", eur(await pool.totalAssets()), "EURC");
  console.log("credit extended:", eur(await pool.creditExtended()), "EURC");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
