# Tourism-to-Housing Impact Pool

**ETHGlobal Mumbai submission by [KOMMA](https://www.komma.systems/en/tourism-to-housing).**
A curated guide where travellers book extraordinary places to stay, and a share
of what they pay flows into a transparent on-chain **fund** that acquires
permanently affordable housing for the people who live there. Every euro is
verifiable on Arc.

- **Live:** https://tourism-to-housing.pages.dev
- **Chain:** Arc testnet (Circle), chainId 5042002, settled in EURC
- **Explorer:** https://testnet.arcscan.app

## The problem

Tourism draws enormous value out of the places people visit and leaves the costs
behind: rising rents, displaced residents, a social fabric worn thin. In
Barcelona over a decade tourist numbers rose by half while rents climbed 68% and
salaries by 3.4%. The capital to buy land and buildings before the speculative
market does is exactly what non-profit housing cannot reach.

## How it works

A guide and booking front, backed by a fund:

1. **Operators contribute.** Each featured stay routes a fixed share of revenue
   into the pool (graded Gold 3.5%, Silver 2.5%, Copper 2%).
2. **The fund lends.** The pool acts as first-loss capital and lends to local
   housing commons (cooperatives, community land trusts), unlocking credit at
   several times its size.
3. **The homes are locked.** Each funded commons is recorded on-chain with a
   pointer to its legal wrapper, holding it off the speculative market for good.
4. **Stewards prove it.** Delivery of homes and square metres is attested
   on-chain; the guide can show no star the chain does not back.

The core move is transvestment: value crosses once, out of tourism and into
commons that cannot be seized. The one-way lock is on the funded homes, not the
operators' capital, so operators keep their principal plus a concessionary 2.5%
return funded by the structure, never by residents.

## Architecture

### Contracts (Solidity 0.8.24, OpenZeppelin v5), live on Arc testnet

| Contract | Address | Role |
|---|---|---|
| `TourismImpactPool` | `0x714272F6cB38A74a6A78464406a5b0d5199024Dd` | ERC-4626 fund: deposits, lending, 2.5% coupon, sets certificate tier |
| `ImpactCertificate` | `0xe78C3C1C8FDd6E07107d1d2A6AE113734A0010DA` | soulbound tiered ★/★★/★★★ credential |
| `HousingCommonsRegistry` | `0xcB18A2efc62A3Ff4821E319Fec16291908861C28` | ERC-721 per commons: geohash + legal-wrapper pointer |
| `ProofOfImpact` | `0xD1AA2dfA028a44BC6b145ADF43251B56306972F7` | steward attestations of homes + m² delivered |
| EURC (Circle) | `0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a` | the euro stablecoin the fund settles in |

### Frontend

Next.js (static export) + Tailwind. **The Guide** and **stay detail** sell the
places; **the Ledger** reads pool value, credit, coupon and the commons registry
live from Arc in-browser; **the Studio** is the wallet-connected back of house
(contribute, lend, attest), each a real Arc transaction.

## Repository layout

```
contracts/   Solidity, build + deploy + seed + test scripts
app/         Next.js frontend (Guide, stay detail, Ledger, Studio)
docs/        architecture design spec
```

## Local development

Prerequisites: Node 22+.

```bash
# Contracts: compile and test
cd contracts
npm ci
npm run compile      # solc (wasm) -> build/
npm test             # in-memory EVM suite (8 assertions)

# Deploy to Arc testnet (needs contracts/.env with DEPLOYER_PRIVATE_KEY)
node scripts/deploy-arc.js
node scripts/seed-arc.js

# App: run and build
cd ../app
npm ci
npm run dev          # http://localhost:3000
npm run build        # static export -> out/
```

The app's live contract addresses live in `app/lib/contracts.ts`; the Arc chain
definition in `app/lib/arc.ts`.

## Testing and CI

- `contracts/npm test` runs the suite in an ephemeral EVM (ganache), covering the
  soulbound certificate, tiering on deposit, lend/repay with proof-of-impact, and
  access control. It needs no external services.
- GitHub Actions (`.github/workflows/ci.yml`) compiles and tests the contracts
  and builds the app on every push and pull request.

## Open-source lineage

The ERC-4626 fund follows the Octant v2 principal/yield pattern; the housing
registry follows the GALT Project property-token pattern; the legal-wrapper field
follows the OtoCo approach. terra0 and MetaLeX informed the framing.

## Licence

MIT.
