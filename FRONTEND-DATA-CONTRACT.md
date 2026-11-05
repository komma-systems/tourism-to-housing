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
| TourismImpactPool (ERC-4626) | 0x714272F6cB38A74a6A78464406a5b0d5199024Dd |
| ImpactCertificate (soulbound) | 0xe78C3C1C8FDd6E07107d1d2A6AE113734A0010DA |
| HousingCommonsRegistry | 0xcB18A2efc62A3Ff4821E319Fec16291908861C28 |
| ProofOfImpact | 0xD1AA2dfA028a44BC6b145ADF43251B56306972F7 |
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
  name: string               // metadata/label (La 111, Vida Inclusiva, La Corrala)
  developer: string          // metadata (La Dinamo / Perviure+TEB / Sostre Cívic)
  ensName?: string           // e.g. la111.barcelona.retorn.eth
  city: string
  territory: string          // neighbourhood (Poblenou / Trinitat Nova / Poble-sec)
  geohash: string            // chain
  homesTotal: number         // chain: planned homes in the project (29 / 35 / 8)
  homesFunded: number        // chain: funded so far (drives the progress bar)
  sqm: number                // chain
  steward: string            // chain: steward address
  stewardName?: string       // metadata
  legalWrapperURI: string    // chain: pointer to the legal wrapper
  status: 'Funding' | 'Delivered'  // chain; WIP projects are Funding
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

1. **Guide** (home): `listHosts()` → cards with star + tagline + the hero stat
   "X of Y homes funded" (progress bar), filter by star. returnRate is a small
   secondary line, not the headline.
2. **Stay / operator detail**: `getHost(id)` + each `getCommons(id)` in `fundedCommons`.
3. **Commons detail**: `getCommons(id)`.
4. **Ledger** (transparency): `getLedger()`, every contract linked to Arcscan.
5. **Studio**: `contribute` / `lend` / `attest`; the governor `lend` on the fresh
   commons (La Corrala, 0 of 8) is the live-proof moment, after which
   `listHosts`/`getCommons` reflect the new state and its progress bar moves.

## Mock adapter seed (matches the re-seeded chain state)

Three real Barcelona co-op projects, all in progress and seeking funds now. Magnitudes
illustrative; the projects are real. Implemented in `app/lib/adapter.ts`.

```json
{
  "hosts": [
    { "id":"0xHOST1","name":"Pensió Cooperativa Gràcia","city":"Barcelona",
      "territory":"Gràcia","genre":"Cooperative","star":3,"tagline":"Worth the journey",
      "returnRate":2.5,"homesFunded":18,"capitalCommittedEURC":1400000,
      "fundedCommons":["la111"],"stamps":["Cooperative","Km0"],"photos":[],"story":"" },
    { "id":"0xHOST2","name":"Hostal Trinitat","city":"Barcelona",
      "territory":"Trinitat Nova","genre":"Boutique","star":2,"tagline":"Worth a detour",
      "returnRate":2.5,"homesFunded":22,"capitalCommittedEURC":2100000,
      "fundedCommons":["vidainclusiva"],"photos":[],"story":"" }
  ],
  "commons": [
    { "id":"la111","name":"La 111","developer":"La Dinamo","ensName":"la111.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Poblenou","geohash":"sp3e2x","homesTotal":29,"homesFunded":18,
      "sqm":2100,"steward":"0xSTEWARD","legalWrapperURI":"cessió d'ús · surface right","status":"Funding",
      "attestedHomes":18,"attestedSqm":1300 },
    { "id":"vidainclusiva","name":"Vida Inclusiva","developer":"Perviure + TEB","ensName":"vidainclusiva.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Trinitat Nova","geohash":"sp3e2p","homesTotal":35,"homesFunded":22,
      "sqm":2600,"steward":"0xSTEWARD","legalWrapperURI":"cessió d'ús · 99y surface right","status":"Funding",
      "attestedHomes":22,"attestedSqm":1600 },
    { "id":"lacorrala","name":"La Corrala","developer":"Sostre Cívic","ensName":"lacorrala.barcelona.retorn.eth",
      "city":"Barcelona","territory":"Poble-sec","geohash":"sp3e2m","homesTotal":8,"homesFunded":0,
      "sqm":600,"steward":"0xSTEWARD","legalWrapperURI":"cessió d'ús · surface right","status":"Funding",
      "attestedHomes":0,"attestedSqm":0 }
  ]
}
```

La Corrala starts at 0 of 8 so the live governor-lend in the demo
fills it and a new stay appears.
