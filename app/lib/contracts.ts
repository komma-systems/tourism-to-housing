// Live Arc testnet deployment (from contracts/deployed.arc.json).
// Single 3% lending pool; the star is proportional (share of the host's yearly base).
export const addresses = {
  eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
  registry: "0xcB18A2efc62A3Ff4821E319Fec16291908861C28",
  certificate: "0xe78C3C1C8FDd6E07107d1d2A6AE113734A0010DA",
  proof: "0xD1AA2dfA028a44BC6b145ADF43251B56306972F7",
  pool: "0x714272F6cB38A74a6A78464406a5b0d5199024Dd",
} as const;

// Alias kept for the existing pages.
export const flagshipPool = addresses.pool;

export const EURC_DECIMALS = 6;
export const RATE = "3%"; // flat return

export const poolAbi = [
  { type: "function", name: "rateBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint16" }] },
  { type: "function", name: "totalAssets", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "accruedInterest", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "creditExtended", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "contributionBps", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "starFor", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint8" }] },
  { type: "function", name: "yearlyBase", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "homesFundedBy", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint32" }] },
  { type: "function", name: "amountDue", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "setYearlyBase", stateMutability: "nonpayable", inputs: [{ name: "host", type: "address" }, { name: "base", type: "uint256" }], outputs: [] },
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "disburseCredit", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }, { name: "host", type: "address" }], outputs: [] },
  { type: "function", name: "recognizeDelivery", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }], outputs: [] },
  { type: "function", name: "repayInFull", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }], outputs: [] },
] as const;

export const registryAbi = [
  { type: "function", name: "nextId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function",
    name: "commons",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      { name: "name", type: "string" },
      { name: "geohash", type: "string" },
      { name: "legalWrapper", type: "string" },
      { name: "homes", type: "uint32" },
      { name: "squareMetres", type: "uint32" },
      { name: "status", type: "uint8" },
      { name: "steward", type: "address" },
    ],
  },
  { type: "function", name: "register", stateMutability: "nonpayable", inputs: [{ name: "holder", type: "address" }, { name: "name", type: "string" }, { name: "geohash", type: "string" }, { name: "legalWrapper", type: "string" }, { name: "homes", type: "uint32" }, { name: "squareMetres", type: "uint32" }, { name: "steward", type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export const certificateAbi = [
  { type: "function", name: "starOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint8" }] },
  { type: "function", name: "tokenOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
] as const;

export const proofAbi = [
  {
    type: "function",
    name: "attestationOf",
    stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      { name: "homesDelivered", type: "uint32" },
      { name: "squareMetresDelivered", type: "uint32" },
      { name: "timestamp", type: "uint64" },
      { name: "evidenceURI", type: "string" },
      { name: "exists", type: "bool" },
    ],
  },
  { type: "function", name: "attest", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }, { name: "homesDelivered", type: "uint32" }, { name: "squareMetresDelivered", type: "uint32" }, { name: "evidenceURI", type: "string" }], outputs: [] },
] as const;

export const erc20Abi = [
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
] as const;

export const STATUS_LABEL = ["Proposed", "Funded", "Delivered"] as const;
