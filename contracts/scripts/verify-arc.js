// Verify the deployed contracts on the Arc explorer (Blockscout) via a
// standard-JSON-input upload. Resolves the full OpenZeppelin dependency tree so
// the verifier can compile standalone. No API key needed.
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const ROOT = path.join(__dirname, "..");
const CONTRACTS = path.join(ROOT, "contracts");
const NM = path.join(ROOT, "node_modules");
const d = JSON.parse(fs.readFileSync(path.join(ROOT, "deployed.arc.json"), "utf8"));

const COMPILER = "v0.8.24+commit.e11b9ed9";
const EXPLORER = "https://explorer.testnet.arc.io";

// Collect every source (ours + transitive OZ imports) keyed by solc source name.
const sources = {};
const importRe = /import\s+(?:[^"']*?\sfrom\s+)?["']([^"']+)["']/g;

function keyToFsPath(key) {
  if (key.startsWith("contracts/")) return path.join(CONTRACTS, key.slice("contracts/".length));
  return path.join(NM, key);
}
function resolveImport(importerKey, imp) {
  if (imp.startsWith(".")) {
    return path.posix.normalize(path.posix.join(path.posix.dirname(importerKey), imp));
  }
  return imp;
}
function add(key) {
  if (sources[key]) return;
  const content = fs.readFileSync(keyToFsPath(key), "utf8");
  sources[key] = { content };
  let m;
  while ((m = importRe.exec(content)) !== null) add(resolveImport(key, m[1]));
}

["HousingCommonsRegistry", "ImpactCertificate", "ProofOfImpact", "TourismImpactPool", "MockEURC"].forEach(
  (n) => add(`contracts/${n}.sol`)
);

const standardJson = {
  language: "Solidity",
  sources,
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "cancun",
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

const abi = ethers.AbiCoder.defaultAbiCoder();
const deployer = d.deployer;
const enc = (types, vals) => abi.encode(types, vals).slice(2);

const targets = [
  [
    "TourismImpactPool",
    d.pool,
    enc(
      ["address", "address", "address", "address", "address", "uint256", "uint256", "uint256"],
      [d.eurc, d.certificate, d.registry, d.proof, deployer, 25_000_000_000n, 100_000_000_000n, 250_000_000_000n]
    ),
  ],
  ["HousingCommonsRegistry", d.registry, enc(["address"], [deployer])],
  ["ImpactCertificate", d.certificate, enc(["address"], [deployer])],
  ["ProofOfImpact", d.proof, enc(["address"], [d.registry])],
];

async function verify(name, address, ctorArgs) {
  const form = new FormData();
  form.append("compiler_version", COMPILER);
  form.append("autodetect_constructor_args", "false");
  form.append("constructor_args", ctorArgs);
  form.append("license_type", "mit");
  form.append(
    "files[0]",
    new Blob([JSON.stringify(standardJson)], { type: "application/json" }),
    "standard-input.json"
  );
  const res = await fetch(
    `${EXPLORER}/api/v2/smart-contracts/${address}/verification/via/standard-input`,
    { method: "POST", body: form }
  );
  const text = await res.text();
  console.log(`${name} (${address}): HTTP ${res.status} ${text.slice(0, 200)}`);
}

(async () => {
  console.log(`Prepared standard JSON with ${Object.keys(sources).length} source files.\n`);
  for (const [name, addr, ctorArgs] of targets) {
    try {
      await verify(name, addr, ctorArgs);
    } catch (e) {
      console.log(`${name}: error ${e.message}`);
    }
  }
})();
