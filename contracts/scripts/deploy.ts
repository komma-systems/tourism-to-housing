import { ethers } from "hardhat";

// Deploys the full Tourism-to-Housing stack. On Arc, pass the native EURC address
// via EURC_ADDRESS; otherwise a MockEURC is deployed for the demo.
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // 1. EURC (native on Arc, mock elsewhere)
  let eurcAddress = process.env.EURC_ADDRESS;
  if (!eurcAddress) {
    const MockEURC = await ethers.getContractFactory("MockEURC");
    const mock = await MockEURC.deploy();
    await mock.waitForDeployment();
    eurcAddress = await mock.getAddress();
    console.log("MockEURC:", eurcAddress);
  }

  // 2. Registry, certificate, proof
  const Registry = await ethers.getContractFactory("HousingCommonsRegistry");
  const registry = await Registry.deploy(deployer.address);
  await registry.waitForDeployment();

  const Certificate = await ethers.getContractFactory("ImpactCertificate");
  const certificate = await Certificate.deploy(deployer.address);
  await certificate.waitForDeployment();

  const Proof = await ethers.getContractFactory("ProofOfImpact");
  const proof = await Proof.deploy(await registry.getAddress());
  await proof.waitForDeployment();

  // 3. Pool. Tier thresholds in EURC (6 decimals): 25k / 100k / 250k.
  const t1 = 25_000_000_000n;
  const t2 = 100_000_000_000n;
  const t3 = 250_000_000_000n;
  const Pool = await ethers.getContractFactory("TourismImpactPool");
  const pool = await Pool.deploy(
    eurcAddress,
    await certificate.getAddress(),
    await registry.getAddress(),
    await proof.getAddress(),
    deployer.address,
    t1,
    t2,
    t3
  );
  await pool.waitForDeployment();

  // The pool owns the certificate (to set tiers). The registry stays with the
  // governor (to register commons) but authorises the pool to move status.
  await (await certificate.transferOwnership(await pool.getAddress())).wait();
  await (await registry.setPool(await pool.getAddress())).wait();

  console.log("Registry:   ", await registry.getAddress());
  console.log("Certificate:", await certificate.getAddress());
  console.log("Proof:      ", await proof.getAddress());
  console.log("Pool:       ", await pool.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
