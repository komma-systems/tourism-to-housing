// Sync ENS records under retorn.eth (Sepolia) from the live fund state on Arc.
// One batched transaction on the RetornResolver. Re-run any time the Arc state
// changes (a new contribution, a delivered commons) to keep the names current.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const ROOT = path.join(__dirname, "..");
const arc = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));
const sep = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.sepolia.json"), "utf8"));
const art = (n) => JSON.parse(fs.readFileSync(path.join(ROOT, "build", `${n}.json`), "utf8")).abi;

const ARC_COIN_TYPE = (0x80000000 | arc.chainId) >>> 0; // ENSIP-11 coin type for Arc testnet
const SITE = "https://tourism-to-housing.pages.dev";
const STATUS = ["Proposed", "Funded", "Delivered"];

async function main() {
  const arcP = new ethers.JsonRpcProvider(process.env.ARC_RPC_URL || "https://rpc.testnet.arc.io");
  const sepP = new ethers.JsonRpcProvider(
    process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com",
    11155111,
    { staticNetwork: true }
  );
  const w = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY, sepP);

  const pool = new ethers.Contract(arc.pool, art("TourismImpactPool"), arcP);
  const registry = new ethers.Contract(arc.registry, art("HousingCommonsRegistry"), arcP);
  const resolver = new ethers.Contract(sep.resolver, art("RetornResolver"), w);
  const iface = resolver.interface;

  const calls = [];
  const addr = (name, a) => {
    const node = ethers.namehash(name);
    calls.push(iface.encodeFunctionData("setAddr(bytes32,address)", [node, a]));
    calls.push(iface.encodeFunctionData("setAddr(bytes32,uint256,bytes)", [node, ARC_COIN_TYPE, a]));
  };
  const text = (name, key, value) =>
    calls.push(iface.encodeFunctionData("setText", [ethers.namehash(name), key, String(value)]));

  // The fund
  addr("retorn.eth", arc.pool);
  text("retorn.eth", "description", "Tourism-to-Housing Impact Fund: tourism capital lent to housing commons at a fair 3%, verified on Arc.");
  text("retorn.eth", "url", SITE);
  text("retorn.eth", "impact.role", "fund");
  text("retorn.eth", "impact.chain", `Arc testnet (${arc.chainId})`);
  text("retorn.eth", "impact.rate", `${Number(arc.rateBps) / 100}%`);
  text("retorn.eth", "impact.value", `${ethers.formatUnits(await pool.totalAssets(), 6)} EURC`);

  // The host (the demo's on-chain host is the deployer)
  const host = arc.deployer;
  const star = await pool.starFor(host);
  const share = await pool.contributionBps(host);
  const homes = await pool.homesFundedBy(host);
  addr("gracia.retorn.eth", host);
  text("gracia.retorn.eth", "impact.role", "host");
  text("gracia.retorn.eth", "impact.star", star);
  text("gracia.retorn.eth", "impact.share", `${Number(share) / 100}%`);
  text("gracia.retorn.eth", "impact.homes", homes);
  text("gracia.retorn.eth", "impact.city", "Barcelona");
  text("gracia.retorn.eth", "url", SITE);

  // The commons
  const count = Number(await registry.nextId()) - 1;
  for (let id = 1; id <= count; id++) {
    const c = await registry.commons(id);
    const name = `${c.name.toLowerCase()}.retorn.eth`;
    addr(name, arc.registry);
    text(name, "impact.role", "commons");
    text(name, "impact.commonsId", id);
    text(name, "impact.homes", c.homes);
    text(name, "impact.sqm", c.squareMetres);
    text(name, "impact.status", STATUS[Number(c.status)]);
    text(name, "impact.city", "Barcelona");
    console.log(`  ${name}: ${c.homes} homes, ${c.squareMetres} m², ${STATUS[Number(c.status)]}`);
  }
  console.log(`  gracia.retorn.eth: ★${star}, ${Number(share) / 100}% of base, ${homes} homes`);

  const rc = await (await resolver.setRecords(calls)).wait();
  console.log(`synced ${calls.length} records in one tx:`, rc.hash);
}

main().catch((e) => {
  console.error(e.shortMessage || e.message);
  process.exit(1);
});
