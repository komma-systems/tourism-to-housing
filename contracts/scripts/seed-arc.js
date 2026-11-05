// Seed the live Arc deployment (single 3% pool, proportional star).
// Registers three anonymised commons, sets the host's yearly base, and (if the
// deployer holds EURC) contributes to earn the proportional star, lends to two
// commons, attests + recognises delivery. Roquetes is left fresh for the live lend.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8")).abi;

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const me = w.address;

  const registry = new ethers.Contract(d.registry, art("HousingCommonsRegistry"), w);
  const proof = new ethers.Contract(d.proof, art("ProofOfImpact"), w);
  const pool = new ethers.Contract(d.pool, art("TourismImpactPool"), w);
  const eurc = new ethers.Contract(d.eurc, art("MockEURC"), w);

  if ((await registry.nextId()) === 1n) {
    const commons = [
      ["Poblenou", "sp3e2x", "coop · cessió d'ús", 20, 1300],
      ["Sants", "sp3e2p", "coop · cessió d'ús", 28, 1600],
      ["Roquetes", "sp3e2m", "coop · cessió d'ús", 12, 720],
    ];
    for (const [name, geo, wrap, homes, sqm] of commons) {
      await (await registry.register(me, name, geo, wrap, homes, sqm, me)).wait();
      console.log("registered", name);
    }
  } else {
    console.log("registry already seeded (nextId =", (await registry.nextId()).toString(), ")");
  }

  // Set the host's yearly base so a contribution earns the proportional star.
  // Base 5 EURC: any contribution >= 1.75 EURC (35%) reaches ★★★ on testnet scale.
  await (await pool.setYearlyBase(me, 5_000_000n)).wait();
  console.log("set host yearly base to 5 EURC (testnet scale)");

  const bal = await eurc.balanceOf(me);
  console.log("deployer EURC balance:", ethers.formatUnits(bal, 6));
  if (bal === 0n) {
    console.log("no EURC: registry + base seeded. Fund the deployer and run the live contribute to earn the star.");
    return;
  }

  await (await eurc.approve(d.pool, bal)).wait();
  await (await pool.deposit(bal, me)).wait();
  const bps = await pool.contributionBps(me);
  const star = await pool.starFor(me);
  console.log(`deposited ${ethers.formatUnits(bal, 6)} EURC → ${Number(bps) / 100}% of base → ★${star}`);

  const idleAfter = await eurc.balanceOf(d.pool);
  const loan = idleAfter >= 2_000_000n ? 1_000_000n : idleAfter / 2n;
  if (loan > 0n) {
    for (const id of [1, 2]) {
      await (await pool.disburseCredit(id, me, loan, me)).wait();
      await (await proof.attest(id, id === 1 ? 20 : 28, id === 1 ? 1300 : 1600, `ipfs://evidence-${id}`)).wait();
      await (await pool.recognizeDelivery(id)).wait();
      console.log("funded + attested + delivered commons", id);
    }
    console.log("homes funded by host:", (await pool.homesFundedBy(me)).toString());
  }
  console.log("Roquetes (3) left fresh for the live governor-lend.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
