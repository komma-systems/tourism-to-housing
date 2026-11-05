// Seed the live Arc deployment with demo commons and attestations.
// Registering + attesting + status needs only gas. The EURC contribution is
// skipped automatically if the deployer holds no EURC (fund via faucet.circle.com).
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8"));

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, provider);
  const me = w.address;

  const registry = new ethers.Contract(d.registry, art("HousingCommonsRegistry").abi, w);
  const proof = new ethers.Contract(d.proof, art("ProofOfImpact").abi, w);
  const pool = new ethers.Contract(d.pool, art("TourismImpactPool").abi, w);
  const eurc = new ethers.Contract(d.eurc, art("MockEURC").abi, w); // ERC20 surface

  // Only seed if the registry is empty, so re-runs are safe.
  const next = await registry.nextId();
  if (next === 1n) {
    const commons = [
      ["La Borda", "sp3e2r", "coop:la-borda · cessió d'ús", 28, 2100, true],
      ["Can Batlló", "sp3e2p", "coop:can-batllo · cessió d'ús", 12, 900, true],
      ["Cal Ganxo", "sp9k4m", "clt:cal-ganxo · community land trust", 6, 480, false],
    ];
    for (const [name, geo, wrap, homes, sqm] of commons) {
      const tx = await registry.register(me, name, geo, wrap, homes, sqm, me);
      await tx.wait();
      console.log("registered", name);
    }
    // Attest + mark delivered for the two completed commons
    for (const [id, homes, sqm] of [[1, 28, 2100], [2, 12, 900]]) {
      await (await proof.attest(id, homes, sqm, `ipfs://evidence-${id}`)).wait();
      await (await registry.setStatus(id, 2)).wait(); // Delivered
      console.log("attested + delivered commons", id);
    }
    // Cal Ganxo is funded-in-progress
    await (await registry.setStatus(3, 1)).wait(); // Funded
    console.log("marked commons 3 Funded");
  } else {
    console.log("registry already seeded (nextId =", next.toString(), ")");
  }

  // Testnet-sized tier thresholds so a faucet-sized contribution earns a star:
  // 2 / 5 / 10 EURC for ★ / ★★ / ★★★. (Owner-only; no redeploy needed.)
  await (await pool.setThresholds(2_000_000n, 5_000_000n, 10_000_000n)).wait();
  console.log("thresholds set to 2 / 5 / 10 EURC");

  // Contribution so a certificate tier shows, only if we hold EURC.
  const bal = await eurc.balanceOf(me);
  console.log("deployer EURC balance:", ethers.formatUnits(bal, 6));
  if (bal >= 15_000_000n) {
    const amount = 15_000_000n; // 15 EURC -> ★★★, leaves some for a live lend/contribution
    await (await eurc.approve(d.pool, amount)).wait();
    await (await pool.deposit(amount, me)).wait();
    console.log("deposited 15 EURC → ★★★ certificate tier set");
  } else if (bal > 0n) {
    await (await eurc.approve(d.pool, bal)).wait();
    await (await pool.deposit(bal, me)).wait();
    console.log("deposited", ethers.formatUnits(bal, 6), "EURC → certificate tier set");
  } else {
    console.log("no EURC held; skipping contribution. Fund at faucet.circle.com then re-run.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
