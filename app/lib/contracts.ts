// Live Arc testnet deployment (from contracts/deployed.arc.json).
export const addresses = {
  eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
  registry: "0x8571bda95fd8df81D96BBE018D26dA64Dc2b4756",
  certificate: "0xC38C5e898cc20F29C27b8fe07E0322337bC42A99",
  proof: "0x409BF2333d5786DEA3652AaeE2265b24c2185F04",
  pool: "0x87cbFE380D9Ec357085d3F2896aBCd273c8f33c4",
} as const;

export const EURC_DECIMALS = 6;

// Minimal ABIs, just the surface the frontend uses.
export const poolAbi = [
  { type: "function", name: "totalPoolValue", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "creditExtended", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "couponBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint16" }] },
  { type: "function", name: "asset", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "contributed", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "disburseCredit", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
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
  { type: "function", name: "nextId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "tierOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint8" }] },
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
