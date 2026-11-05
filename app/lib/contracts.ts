// Live Arc testnet deployment (from contracts/deployed.arc.json).
// Three single-rate lending pools: star3 = 2.5%, star2 = 3%, star1 = 3.5%.
export const addresses = {
  eurc: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
  registry: "0xbCa2cd74D8C1052a8B31DFBd22A0367e316f206F",
  certificate: "0x8d77e19043Ae08f31297B8608D1d037EE1C65696",
  proof: "0x83d6CB567C6297a304727B6c1d4010b60Bb6a566",
  pools: {
    star3: "0x2acc003d23481717eB6AF9014Fb22368055F3D20", // 2.5%
    star2: "0x6414873882F054FF55429B0b9644d1B58Fcb7358", // 3%
    star1: "0xa227002DA92b5B37E20808c3dDcF0f2c986917B3", // 3.5%
  },
} as const;

// Convenience alias: the flagship ★★★ pool.
export const flagshipPool = addresses.pools.star3;

export const EURC_DECIMALS = 6;

export const poolAbi = [
  { type: "function", name: "rateBps", stateMutability: "view", inputs: [], outputs: [{ type: "uint16" }] },
  { type: "function", name: "star", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalAssets", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "accruedInterest", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "creditExtended", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "amountDue", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "convertToAssets", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "deposit", stateMutability: "nonpayable", inputs: [{ name: "assets", type: "uint256" }, { name: "receiver", type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "disburseCredit", stateMutability: "nonpayable", inputs: [{ name: "commonsId", type: "uint256" }, { name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [] },
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
  { type: "function", name: "nextId", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "starOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint8" }] },
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

// The three pools as a list, for the Studio pool selector and the Ledger.
export const POOLS = [
  { key: "star3", address: addresses.pools.star3, star: 3, rate: "2.5%", tagline: "Worth the journey" },
  { key: "star2", address: addresses.pools.star2, star: 2, rate: "3%", tagline: "Worth a detour" },
  { key: "star1", address: addresses.pools.star1, star: 1, rate: "3.5%", tagline: "Worth a stay" },
] as const;
