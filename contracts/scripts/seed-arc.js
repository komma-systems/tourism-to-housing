// Seed the live Arc deployment for the demo (three-pool lending model).
// Registers three anonymised commons, deposits into the ★★★ pool, lends to two
// of them, attests + delivers them, and leaves Roquetes fresh for the live lend.
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
  const pool = new ethers.Contract(d.pools.star3, art("TourismImpactPool"), w);
  const eurc = new ethers.Contract(d.eurc, art("MockEURC"), w); // ERC20 surface

  // Register three anonymised commons (neighbourhood level, realistic magnitudes).
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

  const bal = await eurc.balanceOf(me);
  console.log("deployer EURC balance:", ethers.formatUnits(bal, 6));
  if (bal === 0n) {
    console.log("no EURC; fund the deployer at faucet.circle.com then re-run.");
    return;
  }

  // Deposit into the ★★★ (2.5%) pool → deployer earns ★★★.
  await (await eurc.approve(d.pools.star3, bal)).wait();
  await (await pool.deposit(bal, me)).wait();
  console.log("deposited", ethers.formatUnits(bal, 6), "EURC into the 2.5% pool → ★★★");

  // Lend 1 EURC to Poblenou (1) and Sants (2); leave idle cash for the live lend.
  const loan = 1_000_000n;
  for (const id of [1, 2]) {
    await (await pool.disburseCredit(id, me, loan)).wait();
    console.log("lent 1 EURC to commons", id);
  }

  // Attest delivery and mark Delivered (homes built; loan can stay outstanding).
  for (const [id, homes, sqm] of [[1, 20, 1300], [2, 28, 1600]]) {
    await (await proof.attest(id, homes, sqm, `ipfs://evidence-${id}`)).wait();
    await (await registry.setStatus(id, 2)).wait(); // Delivered
    console.log("attested + delivered commons", id);
  }
  console.log("Roquetes (3) left fresh for the live governor-lend.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
