# Frontend data contract

The stable shape the UI binds to, so Clara's UX and the chain work proceed in
parallel. The UI imports a single `adapter` with these methods; a **mock adapter**
returns this exact shape today, a **live adapter** reads Arc tomorrow with no field
changes. If a field name changes, update this doc in the same commit.

Status: mock adapter implemented at `app/lib/adapter.ts` (import `{ adapter }`).
ABI function names filled below; shapes unchanged. Live adapter swaps in by
changing the `adapter` export, no field changes.

## Chain + contracts (Arc testnet, chainId 5042002, explorer testnet.arcscan.app)

| Contract | Address |
|---|---|
| TourismImpactPool (ERC-4626) | 0x87cbFE380D9Ec357085d3F2896aBCd273c8f33c4 |
| ImpactCertificate (soulbound) | 0xC38C5e898cc20F29C27b8fe07E0322337bC42A99 |
| HousingCommonsRegistry | 0x8571bda95fd8df81D96BBE018D26dA64Dc2b4756 |
| ProofOfImpact | 0x409BF2333d5786DEA3652AaeE2265b24c2185F04 |
| EURC (Circle testnet) | 0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a |

## On-chain vs off-chain

- **On-chain** (read live, source of truth): star tier, return rate, homes + m²,
  steward, status, pool balances, ENS names.
- **Off-chain metadata** (a `metadata.json` keyed by host address / commons id):
  display name, photos, story, city/territory text, genre, price, stamps. Tech and
  Clara co-own this file; the UI merges it with the chain read.

## Types

```ts
type Star = 1 | 2 | 3
type Tagline = 'Worth a stay' | 'Worth a detour' | 'Worth the journey'

// A Host is a place Ajay can book (boutique hotel, cooperative guesthouse,
// foundation space). On-chain it is an operator address holding a certificate.
interface Host {
  id: string                 // operator address
  name: string               // metadata
  ensName?: string           // ENS, e.g. host.barcelona.retorn.eth
  city: string               // metadata (flagship: Barcelona)
  territory: string          // metadata
  genre: string              // metadata: Outliers / boutique / cooperative / foundation
  photos: string[]           // metadata
  story: string              // metadata
  pricePerNight?: number     // metadata
  star: Star                 // chain: tier from impact (homes delivered) [tech]
  tagline: Tagline           // derived from star
  homesFunded: number        // chain: sum of delivered homes in funded commons (drives star)
  returnRate: number         // chain: concessionary coupon ~2.5%, SECONDARY, not the star
  capitalCommittedEURC: number // chain: operator position in the pool
  fundedCommons: string[]    // chain: commons ids this host has funded
  stamps?: string[]          // metadata, detail page only: Cooperative, Km0, Train-friendly
}

// A Commons is a cooperative home/land the fund builds and locks off the market.
interface Commons {
  id: string                 // registry tokenId
  name: string               // metadata/label (La Balma, Can Batlló, La Morada)
  ensName?: string           // e.g. labalma.barcelona.retorn.eth
  city: string
  territory: string
  geohash: string            // chain
  homes: number              // chain
  sqm: number                // chain
  steward: string            // chain: steward address
  stewardName?: string       // metadata
  legalWrapperURI: string    // chain: pointer to the legal wrapper
  status: 'Registered' | 'Delivered'  // chain
  attestedHomes: number      // chain via ProofOfImpact
  attestedSqm: number        // chain via ProofOfImpact
}

// The transparency panel (Ledger), all live from chain.
interface Ledger {
  poolValueEURC: number          // TourismImpactPool.totalPoolValue()
  creditExtendedEURC: number     // TourismImpactPool.creditExtended()
  returnRate: number             // flat concessionary coupon, ~2.5% (secondary)
  commonsCount: number
  homesInCommonsTotal: number
  tierDistribution: { 1: number; 2: number; 3: number }
  contracts: { label: string; address: string; arcscanUrl: string }[]
}

interface Adapter {
  listHosts(): Promise<Host[]>            // Guide
  getHost(id: string): Promise<Host>      // Stay / operator detail
  getCommons(id: string): Promise<Commons>// Commons detail
  getLedger(): Promise<Ledger>            // Transparency
  // Studio (write, wallet-connected): each returns a tx hash
  contribute(amountEURC: number): Promise<string>
  lend(commonsId: string, amountEURC: number): Promise<string>  // governor
  attest(commonsId: string, homes: number, sqm: number): Promise<string> // steward
}
```

## The five surfaces → which methods

1. **Guide** (home): `listHosts()` → cards with star + tagline + returnRate +
   homesFunded + capitalCommitted, filter by star.
2. **Stay / operator detail**: `getHost(id)` + each `getCommons(id)` in `fundedCommons`.
3. **Commons detail**: `getCommons(id)`.
4. **Ledger** (transparency): `getLedger()`, every contract linked to Arcscan.
5. **Studio**: `contribute` / `lend` / `attest`; the governor `lend` on the fresh
   commons (La Morada) is the live-proof moment, after which `listHosts`/`getCommons`
   reflect the new state.

## Mock adapter seed (matches the re-seeded chain state)

Commons are anonymised to neighbourhood level (areas, not named projects) with
realistic magnitudes. Implemented in `app/lib/adapter.ts`.

```json
{
  "hosts": [
    { "id":"0xHOST1","name":"Pensió Cooperativa Gràcia","city":"Barcelona",
      "territory":"Barcelona","genre":"Cooperative","star":3,"tagline":"Worth the journey",
      "returnRate":2.5,"homesFunded":20,"capitalCommittedEURC":1400000,
      "fundedCommons":["1"],"stamps":["Cooperative","Km0"],"photos":[],"story":"" },
    { "id":"0xHOST2","name":"Hostal del Pont","city":"Barcelona",
      "territory":"Barcelona","genre":"Boutique","star":2,"tagline":"Worth a detour",
      "returnRate":3,"homesFunded":28,"capitalCommittedEURC":2100000,
      "fundedCommons":["2"],"photos":[],"story":"" }
  ],
  "commons": [
    { "id":"1","name":"Poblenou","ensName":"poblenou.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Barcelona","geohash":"sp3e2x","homes":20,"sqm":1300,
      "steward":"0xSTEWARD","legalWrapperURI":"coop · cessió d'ús","status":"Delivered",
      "attestedHomes":20,"attestedSqm":1300 },
    { "id":"2","name":"Sants","ensName":"sants.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Barcelona","geohash":"sp3e2p","homes":28,"sqm":1600,
      "steward":"0xSTEWARD","legalWrapperURI":"coop · cessió d'ús","status":"Delivered",
      "attestedHomes":28,"attestedSqm":1600 },
    { "id":"3","name":"Roquetes","ensName":"roquetes.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Barcelona","geohash":"sp3e2m","homes":0,"sqm":0,
      "steward":"0xSTEWARD","legalWrapperURI":"coop · cessió d'ús","status":"Registered",
      "attestedHomes":0,"attestedSqm":0 }
  ]
}
```

Roquetes starts empty (status Registered) so the live governor-lend in the demo
fills it and a new stay appears.
