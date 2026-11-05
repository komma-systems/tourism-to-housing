import { expect } from "chai";
import { ethers } from "hardhat";

describe("Tourism-to-Housing Impact Pool", () => {
  async function deploy() {
    const [gov, operator, steward, coop] = await ethers.getSigners();

    const MockEURC = await ethers.getContractFactory("MockEURC");
    const eurc = await MockEURC.deploy();

    const Registry = await ethers.getContractFactory("HousingCommonsRegistry");
    const registry = await Registry.deploy(gov.address);

    const Certificate = await ethers.getContractFactory("ImpactCertificate");
    const certificate = await Certificate.deploy(gov.address);

    const Proof = await ethers.getContractFactory("ProofOfImpact");
    const proof = await Proof.deploy(await registry.getAddress());

    const Pool = await ethers.getContractFactory("TourismImpactPool");
    const pool = await Pool.deploy(
      await eurc.getAddress(),
      await certificate.getAddress(),
      await registry.getAddress(),
      await proof.getAddress(),
      gov.address,
      25_000_000_000n,
      100_000_000_000n,
      250_000_000_000n
    );

    await certificate.transferOwnership(await pool.getAddress());
    await registry.setPool(await pool.getAddress());

    return { gov, operator, steward, coop, eurc, registry, certificate, proof, pool };
  }

  it("issues a tiered soulbound certificate on contribution", async () => {
    const { operator, eurc, certificate, pool } = await deploy();
    const amount = 120_000_000_000n; // 120k EURC -> tier 2

    await eurc.mint(operator.address, amount);
    await eurc.connect(operator).approve(await pool.getAddress(), amount);
    await pool.connect(operator).deposit(amount, operator.address);

    expect(await certificate.tierOf(operator.address)).to.equal(2);
    const tokenId = await certificate.tokenOf(operator.address);
    await expect(
      certificate.connect(operator).transferFrom(operator.address, ethers.ZeroAddress, tokenId)
    ).to.be.reverted; // soulbound
  });

  it("lends to a commons and recycles use fees with proof of impact", async () => {
    const { gov, operator, steward, coop, eurc, registry, proof, pool } = await deploy();

    // operator contributes 200k EURC into the pool
    const contribution = 200_000_000_000n;
    await eurc.mint(operator.address, contribution);
    await eurc.connect(operator).approve(await pool.getAddress(), contribution);
    await pool.connect(operator).deposit(contribution, operator.address);

    // governor registers a commons with a steward
    await registry
      .connect(gov)
      .register(coop.address, "La Borda, Barcelona", "sp3e3", "otoco:swiss-assoc", 8, 600, steward.address);
    const commonsId = 1n;

    // pool lends 50k to the co-op
    const loan = 50_000_000_000n;
    await pool.connect(gov).disburseCredit(commonsId, coop.address, loan);
    expect(await pool.creditExtended()).to.equal(loan);
    expect((await registry.commons(commonsId)).status).to.equal(1); // Funded

    // steward attests delivery; co-op repays the use fee in full
    await proof.connect(steward).attest(commonsId, 8, 600, "ipfs://evidence");
    expect(await proof.isDelivered(commonsId)).to.equal(true);

    await eurc.mint(coop.address, loan);
    await eurc.connect(coop).approve(await pool.getAddress(), loan);
    await pool.connect(coop).repayUseFee(commonsId, loan);

    expect(await pool.creditExtended()).to.equal(0n);
    expect((await registry.commons(commonsId)).status).to.equal(2); // Delivered
  });

  it("blocks attestation from anyone but the steward", async () => {
    const { gov, operator, coop, registry, proof } = await deploy();
    await registry
      .connect(gov)
      .register(coop.address, "Can Batlló", "sp3e2", "otoco:swiss-assoc", 12, 900, operator.address);
    await expect(proof.connect(coop).attest(1, 12, 900, "ipfs://x")).to.be.revertedWith(
      "not the steward"
    );
  });
});
