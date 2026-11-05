// FRONTEND DATA CONTRACT implementation. Shapes are fixed by
// FRONTEND-DATA-CONTRACT.md; this is the mock adapter. The live adapter will read
// the same shapes from Arc (app/lib/arc.ts + app/lib/contracts.ts) and the UI
// swaps by changing the `adapter` export at the bottom. No field changes.

export type Star = 1 | 2 | 3;
export type Tagline = "Worth a stay" | "Worth a detour" | "Worth the journey";

// Lower accepted return earns a higher star. ★★★ = 2.5%, ★★ = 3%, ★ = 3.5%.
export const RETURN_BY_STAR: Record<Star, 2.5 | 3 | 3.5> = { 3: 2.5, 2: 3, 1: 3.5 };
export const TAGLINE_BY_STAR: Record<Star, Tagline> = {
  1: "Worth a stay",
  2: "Worth a detour",
  3: "Worth the journey",
};

// A Host is a place a traveller can book. On-chain it is an operator address
// holding a certificate; the display fields are off-chain metadata.
export interface Host {
  id: string; // operator address
  name: string;
  ensName?: string;
  city: string;
  territory: string;
  genre: string;
  photos: string[];
  story: string;
  pricePerNight?: number;
  star: Star; // chain: ImpactCertificate.tierOf(operator)
  tagline: Tagline; // derived from star
  returnRate: 2.5 | 3 | 3.5; // chain: accepted-return band
  homesFunded: number; // chain: delivered homes across funded commons
  capitalCommittedEURC: number; // chain: operator position in the pool
  fundedCommons: string[]; // chain: commons ids this host funded
  stamps?: string[];
}

// A Commons is cooperative housing/land the fund builds and locks off the market.
export interface Commons {
  id: string; // registry tokenId
  name: string;
  ensName?: string;
  city: string;
  territory: string;
  geohash: string;
  homes: number;
  sqm: number;
  steward: string;
  stewardName?: string;
  legalWrapperURI: string;
  status: "Registered" | "Delivered";
  attestedHomes: number;
  attestedSqm: number;
}

export interface Ledger {
  poolValueEURC: number; // TourismImpactPool.totalPoolValue()
  creditExtendedEURC: number; // TourismImpactPool.creditExtended()
  returnRateByTier: { 3: 2.5; 2: 3; 1: 3.5 };
  commonsCount: number;
  homesInCommonsTotal: number;
  tierDistribution: { 1: number; 2: number; 3: number };
  contracts: { label: string; address: string; arcscanUrl: string }[];
}

export interface Adapter {
  listHosts(): Promise<Host[]>; // Guide
  getHost(id: string): Promise<Host>; // Stay / operator detail
  getCommons(id: string): Promise<Commons>; // Commons detail
  getLedger(): Promise<Ledger>; // Transparency
  // Studio (write, wallet-connected) — each returns a tx hash
  contribute(amountEURC: number): Promise<string>;
  lend(commonsId: string, amountEURC: number): Promise<string>; // governor
  attest(commonsId: string, homes: number, sqm: number): Promise<string>; // steward
}

export function host(partial: Omit<Host, "tagline" | "returnRate">): Host {
  return { ...partial, tagline: TAGLINE_BY_STAR[partial.star], returnRate: RETURN_BY_STAR[partial.star] };
}

// --- Mock data (matches the re-seeded chain state: La Balma + Can Batlló
// delivered, La Morada fresh for the live lend) ---

const STEWARD = "0x87EcF29aE7655244D728C9D48832E331fFE596B3";

// Commons are anonymised to neighbourhood level (areas, not named projects), with
// realistic magnitudes. Two delivered, one fresh (the live-lend target).
const mockCommons: Commons[] = [
  {
    id: "1",
    name: "Poblenou",
    ensName: "poblenou.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    geohash: "sp3e2x",
    homes: 20,
    sqm: 1300,
    steward: STEWARD,
    stewardName: "Resident stewards",
    legalWrapperURI: "coop · cessió d'ús (75-yr municipal land)",
    status: "Delivered",
    attestedHomes: 20,
    attestedSqm: 1300,
  },
  {
    id: "2",
    name: "Sants",
    ensName: "sants.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    geohash: "sp3e2p",
    homes: 28,
    sqm: 1600,
    steward: STEWARD,
    stewardName: "Resident stewards",
    legalWrapperURI: "coop · cessió d'ús",
    status: "Delivered",
    attestedHomes: 28,
    attestedSqm: 1600,
  },
  {
    id: "3",
    name: "Roquetes",
    ensName: "roquetes.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    geohash: "sp3e2m",
    homes: 0,
    sqm: 0,
    steward: STEWARD,
    stewardName: "Resident stewards",
    legalWrapperURI: "coop · cessió d'ús (foundation land)",
    status: "Registered",
    attestedHomes: 0,
    attestedSqm: 0,
  },
];

const mockHosts: Host[] = [
  host({
    id: "0xHOST1",
    name: "Pensió Cooperativa Gràcia",
    ensName: "gracia.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    genre: "Cooperative",
    photos: [],
    story: "",
    star: 3,
    homesFunded: 20,
    capitalCommittedEURC: 1_400_000,
    fundedCommons: ["1"],
    stamps: ["Cooperative", "Km0"],
  }),
  host({
    id: "0xHOST2",
    name: "Hostal del Pont",
    ensName: "hostaldelpont.barcelona.retorn.eth",
    city: "Barcelona",
    territory: "Barcelona",
    genre: "Boutique",
    photos: [],
    story: "",
    star: 2,
    homesFunded: 28,
    capitalCommittedEURC: 2_100_000,
    fundedCommons: ["2"],
    stamps: ["Train-friendly"],
  }),
];

export const mockAdapter: Adapter = {
  async listHosts() {
    return mockHosts;
  },
  async getHost(id) {
    const h = mockHosts.find((x) => x.id === id);
    if (!h) throw new Error(`unknown host ${id}`);
    return h;
  },
  async getCommons(id) {
    const c = mockCommons.find((x) => x.id === id);
    if (!c) throw new Error(`unknown commons ${id}`);
    return c;
  },
  async getLedger() {
    const delivered = mockCommons.filter((c) => c.status === "Delivered");
    return {
      poolValueEURC: 15,
      creditExtendedEURC: 0,
      returnRateByTier: { 3: 2.5, 2: 3, 1: 3.5 },
      commonsCount: mockCommons.length,
      homesInCommonsTotal: delivered.reduce((n, c) => n + c.homes, 0),
      tierDistribution: {
        1: mockHosts.filter((h) => h.star === 1).length,
        2: mockHosts.filter((h) => h.star === 2).length,
        3: mockHosts.filter((h) => h.star === 3).length,
      },
      contracts: [
        { label: "TourismImpactPool", address: "0x2acc003d23481717eB6AF9014Fb22368055F3D20", arcscanUrl: "https://testnet.arcscan.app/address/0x2acc003d23481717eB6AF9014Fb22368055F3D20" },
        { label: "ImpactCertificate", address: "0x8d77e19043Ae08f31297B8608D1d037EE1C65696", arcscanUrl: "https://testnet.arcscan.app/address/0x8d77e19043Ae08f31297B8608D1d037EE1C65696" },
        { label: "HousingCommonsRegistry", address: "0xbCa2cd74D8C1052a8B31DFBd22A0367e316f206F", arcscanUrl: "https://testnet.arcscan.app/address/0xbCa2cd74D8C1052a8B31DFBd22A0367e316f206F" },
        { label: "ProofOfImpact", address: "0x83d6CB567C6297a304727B6c1d4010b60Bb6a566", arcscanUrl: "https://testnet.arcscan.app/address/0x83d6CB567C6297a304727B6c1d4010b60Bb6a566" },
      ],
    };
  },
  async contribute() {
    throw new Error("mock adapter: use the live adapter / Studio for writes");
  },
  async lend() {
    throw new Error("mock adapter: use the live adapter / Studio for writes");
  },
  async attest() {
    throw new Error("mock adapter: use the live adapter / Studio for writes");
  },
};

// The UI imports `adapter`. Swap to the live adapter later with no field changes.
export const adapter: Adapter = mockAdapter;
