// Standalone solc (wasm) compile check that resolves @openzeppelin imports.
// Used because this environment can't fetch the native solc Hardhat wants.
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const ROOT = path.join(__dirname, "..");
const CONTRACTS = path.join(ROOT, "contracts");

function readLocal(file) {
  const names = ["HousingCommonsRegistry", "ImpactCertificate", "ProofOfImpact", "TourismImpactPool", "MockEURC"];
  return names.map((n) => [`contracts/${n}.sol`, fs.readFileSync(path.join(CONTRACTS, `${n}.sol`), "utf8")]);
}

const sources = {};
for (const [key, content] of readLocal()) sources[key] = { content };

function findImport(importPath) {
  // Resolve node_modules imports (OpenZeppelin).
  const full = path.join(ROOT, "node_modules", importPath);
  if (fs.existsSync(full)) return { contents: fs.readFileSync(full, "utf8") };
  return { error: "File not found: " + importPath };
}

const input = {
  language: "Solidity",
  sources,
  settings: {
    optimizer: { enabled: true, runs: 200 },
    evmVersion: "cancun",
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

const out = JSON.parse(solc.compile(JSON.stringify(input), { import: findImport }));

const errors = (out.errors || []).filter((e) => e.severity === "error");
const warnings = (out.errors || []).filter((e) => e.severity === "warning");

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log("  -", w.formattedMessage.split("\n")[0]);
}

if (errors.length) {
  console.error(`\n${errors.length} ERROR(s):`);
  for (const e of errors) console.error(e.formattedMessage);
  process.exit(1);
}

console.log("\nsolc version:", solc.version());
console.log("Compiled OK. Contracts:");
for (const file of Object.keys(out.contracts || {})) {
  for (const name of Object.keys(out.contracts[file])) {
    const bc = out.contracts[file][name].evm.bytecode.object;
    console.log(`  ${name}: ${bc.length / 2} bytes`);
  }
}
