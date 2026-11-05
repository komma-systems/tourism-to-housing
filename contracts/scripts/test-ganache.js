// In-memory test run: deploys the wasm-compiled artifacts to an ephemeral ganache
// chain and asserts the core behaviours. Used because the native solc that
// `hardhat test` needs won't download in this environment.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
const ganache = require("ganache");

const BUILD = path.join(__dirname, "..", "build");
const art = (n) => JSON.parse(fs.readFileSync(path.join(BUILD, `${n}.json`), "utf8"));

let passed = 0,
  failed = 0;
function ok(cond, msg) {
  if (cond) {
    passed++;
    console.log("  ✓", msg);
  } else {
    failed++;
    console.log("  ✗", msg);
  }
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
  const f = new ethers.ContractFactory(abi, bytecode, signer);
  const c = await f.deploy(...args);
  await c.waitForDeployment();
  return c;
}

async function main() {
  const provider = new ethers.BrowserProvider(
    ganache.provider({ logging: { quiet: true }, wallet: { deterministic: true } })
  );
  const gov = await provider.getSigner(0);
  const operator = await provider.getSigner(1);
  const steward = await provider.getSigner(2);
  const coop = await provider.getSigner(3);
  const govA = await gov.getAddress();
  const opA = await operator.getAddress();
  const stA = await steward.getAddress();
  const coA = await coop.getAddress();

  const eurc = await deploy(gov, "MockEURC");
  const registry = await deploy(gov, "HousingCommonsRegistry", [govA]);
  const certificate = await deploy(gov, "ImpactCertificate", [govA]);
  const proof = await deploy(gov, "ProofOfImpact", [await registry.getAddress()]);
  const pool = await deploy(gov, "TourismImpactPool", [
    await eurc.getAddress(),
    await certificate.getAddress(),
    await registry.getAddress(),
    await proof.getAddress(),
    govA,
    25_000_000_000n,
    100_000_000_000n,
    250_000_000_000n,
  ]);
  await (await certificate.transferOwnership(await pool.getAddress())).wait();
  await (await registry.setPool(await pool.getAddress())).wait();

  console.log("\nContribution + soulbound certificate");
  const amount = 120_000_000_000n; // 120k EURC -> tier 2
  await (await eurc.mint(opA, amount)).wait();
  await (await eurc.connect(operator).approve(await pool.getAddress(), amount)).wait();
  await (await pool.connect(operator).deposit(amount, opA)).wait();
  ok((await certificate.tierOf(opA)) === 2n, "deposit of 120k EURC sets certificate tier 2");
  const tokenId = await certificate.tokenOf(opA);
  await reverts(
    certificate.connect(operator).transferFrom(opA, govA, tokenId),
    "certificate is soulbound (transfer reverts)"
  );

  console.log("\nLend to a commons + proof of impact");
  await (await registry.connect(gov).register(coA, "La Borda", "sp3e2r", "coop:la-borda", 8, 600, stA)).wait();
  const loan = 50_000_000_000n;
  await (await pool.connect(gov).disburseCredit(1, coA, loan)).wait();
  ok((await pool.creditExtended()) === loan, "disburseCredit increases creditExtended");
  ok((await registry.commons(1)).status === 1n, "commons marked Funded");
  await (await proof.connect(steward).attest(1, 8, 600, "ipfs://evidence")).wait();
  ok(await proof.isDelivered(1), "steward attestation records delivery");
  await (await eurc.mint(coA, loan)).wait();
  await (await eurc.connect(coop).approve(await pool.getAddress(), loan)).wait();
  await (await pool.connect(coop).repayUseFee(1, loan)).wait();
  ok((await pool.creditExtended()) === 0n, "repayUseFee clears credit");
  ok((await registry.commons(1)).status === 2n, "commons moves to Delivered after repay + proof");

  console.log("\nAccess control");
  await (await registry.connect(gov).register(coA, "Can Batlló", "sp3e2p", "coop:cb", 12, 900, opA)).wait();
  await reverts(proof.connect(coop).attest(2, 12, 900, "ipfs://x"), "non-steward cannot attest");

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
