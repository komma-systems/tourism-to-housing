// In-memory test run for the lending-vault model: deploys the wasm-compiled
// artifacts to an ephemeral ganache chain and asserts the core behaviours.
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
  const host = await provider.getSigner(1);
  const steward = await provider.getSigner(2);
  const coop = await provider.getSigner(3);
  const host2 = await provider.getSigner(4);
  const [govA, hostA, stA, coA, host2A] = await Promise.all(
    [gov, host, steward, coop, host2].map((s) => s.getAddress())
  );

  const eurc = await deploy(gov, "MockEURC");
  const registry = await deploy(gov, "HousingCommonsRegistry", [govA]);
  const certificate = await deploy(gov, "ImpactCertificate", [govA]);
  const proof = await deploy(gov, "ProofOfImpact", [await registry.getAddress()]);

  // ★★★ pool at 2.5% and ★ pool at 3.5%
  const pool3 = await deploy(gov, "TourismImpactPool", [
    await eurc.getAddress(), await certificate.getAddress(), await registry.getAddress(),
    await proof.getAddress(), govA, 250, 3,
  ]);
  const pool1 = await deploy(gov, "TourismImpactPool", [
    await eurc.getAddress(), await certificate.getAddress(), await registry.getAddress(),
    await proof.getAddress(), govA, 350, 1,
  ]);
  for (const p of [pool3, pool1]) {
    await (await certificate.setMinter(await p.getAddress(), true)).wait();
    await (await registry.setPool(await p.getAddress(), true)).wait();
  }

  console.log("\nDeposit sets the pool's star, certificate is soulbound");
  await (await eurc.mint(hostA, 1_000_000_000n)).wait(); // 1000 EURC
  await (await eurc.connect(host).approve(await pool3.getAddress(), 1_000_000_000n)).wait();
  await (await pool3.connect(host).deposit(1_000_000_000n, hostA)).wait();
  ok((await certificate.starOf(hostA)) === 3n, "deposit into the 2.5% pool sets ★★★");
  const tokenId = await certificate.tokenOf(hostA);
  await reverts(
    certificate.connect(host).transferFrom(hostA, govA, tokenId),
    "certificate is soulbound (transfer reverts)"
  );
  ok((await certificate.starOf(host2A)) === 0n, "a host with no certificate reads ★0");

  console.log("\nLending is value-neutral, interest accrues to share value");
  await (await registry.connect(gov).register(coA, "Poblenou", "sp3e2x", "coop", 20, 1300, stA)).wait();
  const before = await pool3.totalAssets();
  await (await pool3.connect(gov).disburseCredit(1, coA, 400_000_000n)).wait(); // lend 400
  ok(near(await pool3.totalAssets(), before, 2n), "totalAssets unchanged by lending (receivable)");
  ok((await pool3.creditExtended()) === 400_000_000n, "creditExtended tracks principal out");

  // advance one year; interest = 400 * 2.5% = 10 EURC
  await provider.send("evm_increaseTime", [31_536_000]);
  await provider.send("evm_mine", []);
  const accrued = await pool3.accruedInterest();
  ok(near(accrued, 10_000_000n, 50_000n), "~2.5% interest accrues over a year (≈10 EURC)");
  ok((await pool3.totalAssets()) > before, "share value rises as interest accrues");

  console.log("\nRepay principal + interest; interest stays as yield");
  const due = await pool3.amountDue(1);
  ok(near(due, 410_000_000n, 50_000n), "amount due ≈ principal + interest (≈410 EURC)");
  await (await proof.connect(steward).attest(1, 20, 1300, "ipfs://e")).wait();
  await (await eurc.mint(coA, due)).wait();
  await (await eurc.connect(coop).approve(await pool3.getAddress(), due)).wait();
  await (await pool3.connect(coop).repayInFull(1)).wait();
  ok((await pool3.creditExtended()) === 0n, "loan cleared after repay");
  ok((await registry.commons(1)).status === 2n, "commons Delivered after repay + proof");
  ok((await pool3.totalAssets()) >= 1_009_000_000n, "pool now holds principal + earned interest");

  console.log("\nAccess control + multi-pool stars");
  await (await registry.connect(gov).register(coA, "Sants", "sp3e2p", "coop", 28, 1600, hostA)).wait();
  await reverts(proof.connect(coop).attest(2, 28, 1600, "ipfs://x"), "non-steward cannot attest");
  await (await eurc.mint(host2A, 500_000_000n)).wait();
  await (await eurc.connect(host2).approve(await pool1.getAddress(), 500_000_000n)).wait();
  await (await pool1.connect(host2).deposit(500_000_000n, host2A)).wait();
  ok((await certificate.starOf(host2A)) === 1n, "deposit into the 3.5% pool sets ★");

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
