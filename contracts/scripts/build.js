// Compile with the npm wasm solc and emit artifacts (abi + bytecode) to build/.
// Used instead of `hardhat compile` because the native solc won't download here.
const fs = require("fs");
const path = require("path");
const solc = require("solc");

const ROOT = path.join(__dirname, "..");
const CONTRACTS = path.join(ROOT, "contracts");
const OUT = path.join(ROOT, "build");

const names = ["HousingCommonsRegistry", "ImpactCertificate", "ProofOfImpact", "TourismImpactPool", "MockEURC", "RetornResolver"];
const sources = {};
for (const n of names) sources[`contracts/${n}.sol`] = { content: fs.readFileSync(path.join(CONTRACTS, `${n}.sol`), "utf8") };

function findImport(importPath) {
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
if (errors.length) {
  for (const e of errors) console.error(e.formattedMessage);
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
for (const n of names) {
  const c = out.contracts[`contracts/${n}.sol`][n];
  fs.writeFileSync(
    path.join(OUT, `${n}.json`),
    JSON.stringify({ abi: c.abi, bytecode: "0x" + c.evm.bytecode.object }, null, 2)
  );
}
console.log("Artifacts written to build/ for:", names.join(", "));
