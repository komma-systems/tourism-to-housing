// In-memory test run for the proportional-star model (star = share of yearly base).
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const ganache = require("ganache");

const BUILD = path.join(__dirname, "..", "build");
const art = (n) => JSON.parse(fs.readFileSync(path.join(BUILD, `${n}.json`), "utf8"));

let passed = 0,
  failed = 0;
function ok(cond, msg) {
  cond ? (passed++, console.log("  ✓", msg)) : (failed++, console.log("  ✗", msg));
}
async function reverts(p, msg) {
  try {
    await p;
    failed++;
    console.log("  ✗", msg, "(did not revert)");
  } catch {
    passed++;
    console.log("  ✓", msg);
  }
}
async function deploy(signer, name, args = []) {
  const { abi, bytecode } = art(name);
  const c = await new ethers.ContractFactory(abi, bytecode, signer).deploy(...args);
  await c.waitForDeployment();
  return c;
}
const near = (a, b, tol) => (a > b ? a - b : b - a) <= tol;

async function main() {
  const provider = new ethers.BrowserProvider(
    ganache.provider({ logging: { quiet: true }, wallet: { deterministic: true } })
  );
  const gov = await provider.getSigner(0);
  const small = await provider.getSigner(1); // a tiny host
  const big = await provider.getSigner(2); // a large host
  const steward = await provider.getSigner(3);
  const coop = await provider.getSigner(4);
  const [govA, smallA, bigA, stA, coA] = await Promise.all(
    [gov, small, big, steward, coop].map((s) => s.getAddress())
  );

  const eurc = await deploy(gov, "MockEURC");
  const registry = await deploy(gov, "HousingCommonsRegistry", [govA]);
  const certificate = await deploy(gov, "ImpactCertificate", [govA]);
  const proof = await deploy(gov, "ProofOfImpact", [await registry.getAddress()]);
  const pool = await deploy(gov, "TourismImpactPool", [
    await eurc.getAddress(), await certificate.getAddress(), await registry.getAddress(),
    await proof.getAddress(), govA, 300,
  ]);
  await (await certificate.setMinter(await pool.getAddress(), true)).wait();
  await (await registry.setPool(await pool.getAddress(), true)).wait();

  console.log("\nStar is proportional: small and big host, same share, same star");
  // Small host: base 10 EURC, contributes 3.5 → 35% → ★★★
  await (await pool.setYearlyBase(smallA, 10_000_000n)).wait();
  await (await eurc.mint(smallA, 3_500_000n)).wait();
  await (await eurc.connect(small).approve(await pool.getAddress(), 3_500_000n)).wait();
  await (await pool.connect(small).deposit(3_500_000n, smallA)).wait();
  ok((await certificate.starOf(smallA)) === 3n, "small host giving 35% of base → ★★★");

  // Big host: base 1,000,000 EURC, contributes 100,000 → 10% → ★
  await (await pool.setYearlyBase(bigA, 1_000_000_000_000n)).wait();
  await (await eurc.mint(bigA, 100_000_000_000n)).wait();
  await (await eurc.connect(big).approve(await pool.getAddress(), 100_000_000_000n)).wait();
  await (await pool.connect(big).deposit(100_000_000_000n, bigA)).wait();
  ok((await certificate.starOf(bigA)) === 1n, "big host giving only 10% of base → ★ (size-neutral)");
  ok((await pool.contributionBps(smallA)) === 3500n, "contribution share read in bps (35%)");

  console.log("\nYearly re-rating (Michelin-style)");
  await (await pool.rollYear(smallA)).wait();
  ok((await certificate.starOf(smallA)) === 0n, "rolling the year resets the star to be re-earned");

  console.log("\nLending is value-neutral; interest accrues at 3%");
  await (await registry.connect(gov).register(coA, "Poblenou", "sp3e2x", "coop", 20, 1300, stA)).wait();
  const before = await pool.totalAssets();
  await (await pool.connect(gov).disburseCredit(1, coA, 400_000_000n, bigA)).wait();
  ok(near(await pool.totalAssets(), before, 2n), "totalAssets unchanged by lending (receivable)");
  await provider.send("evm_increaseTime", [31_536_000]);
  await provider.send("evm_mine", []);
  ok(near(await pool.accruedInterest(), 12_000_000n, 60_000n), "~3% interest accrues over a year");

  console.log("\nHomes funded tracked for display; access control");
  await (await proof.connect(steward).attest(1, 20, 1300, "ipfs://e")).wait();
  await (await pool.connect(gov).recognizeDelivery(1)).wait();
  ok((await pool.homesFundedBy(bigA)) === 20n, "delivered homes credited to the funding host (display)");
  ok((await registry.commons(1)).status === 2n, "commons marked Delivered");
  const tokenId = await certificate.tokenOf(bigA);
  await reverts(certificate.connect(big).transferFrom(bigA, govA, tokenId), "certificate is soulbound");
  await reverts(pool.connect(small).recognizeDelivery(1), "non-governor cannot recognise delivery");
  await reverts(pool.connect(small).setYearlyBase(smallA, 1), "non-governor cannot set a base");

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
