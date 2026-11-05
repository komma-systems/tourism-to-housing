# Tourism-to-Housing Impact Pool — demo architecture

Design spec for the ETHGlobal Mumbai demonstrator. Scope: **hackathon demo
only** — legible, demoable, defensible, not the full production economic model.
Deadline Saturday 7 November 09:00 IST.

## What we're proving

A transparent on-chain treasury that turns tourism value into permanently
affordable housing. Two loops (capital and reputation) plus a proof step, all
readable on-chain so "anyone can verify" is literally true.

## The transvestment reading (resolved)

The one-way lock is on the **funded homes**, not on operator capital. Operators
contribute bond-like: principal stays redeemable and earns a modest coupon (0 to
2.5%). What crosses once and cannot be pulled back into private hands is each
housing commons, permanently de-commodified through the registry token and its
legal wrapper. This keeps the vault honest (it is a loan-like pool) while the
transvestment is enforced on the registry side.

## Components

### Contracts (Solidity 0.8.24, cancun; Hardhat + OZ v5)
- **TourismImpactPool** — ERC-4626 vault (Octant v2 principal/yield pattern).
  EURC asset. Operators deposit for redeemable shares; pool holds first-loss
  capital, lends to commons, receives use-fee repayments; every deposit refreshes
  the operator's certificate tier.
- **ImpactCertificate** — soulbound, revocable ERC-721. Tier (★/★★/★★★) set by
  cumulative contribution. The reputation operators compete for, untradeable.
- **HousingCommonsRegistry** — ERC-721 per commons (GALT Project pattern), with
  geohash, `legalWrapper` pointer (OtoCo-style), homes, m², steward, status.
  Where the permanent de-commodification is recorded.
- **ProofOfImpact** — steward-only attestation of homes and m² delivered; moves a
  commons to Delivered and lets the pool recycle use fees.

### Frontend (Next.js + wagmi/viem + RainbowKit)
Four surfaces on one app:
1. **Contribute** (operator) — deposit EURC, see certificate tier update.
2. **Lend** (governor) — register a commons, disburse credit.
3. **Attest** (steward) — record homes/m² delivered.
4. **Transparency dashboard** (public) — pool balance, credit extended,
   certificate tiers, attested impact, all read live from chain. This is the WOW
   and the required live-deployment link.

## Data flow

Operator deposits EURC → pool mints shares + sets certificate tier → governor
registers a commons and disburses EURC credit → co-op draws it, builds, repays a
use fee → steward attests delivery → dashboard reflects every step from chain
state.

## Prize mapping

- **Arc (core).** Whole stack on Arc testnet, EURC settlement. Wins the Arc
  tracks and satisfies live deployment on its own. If only this ships, the
  submission is complete.
- **ENS (stretch 1).** ENSv2 names for pools, commons, stewards. Dashboard add-on.
- **Whitechain (stretch 2).** Registry on Whitechain Sepolia, commons token as
  tokenised RWA. Second chain, so last.

## The 2-day cut

- **Core (must work live):** contribute → certificate, governor lend, steward
  attest, dashboard reads it all from Arc.
- **Stretch, in order:** ENS names, then Whitechain RWA.
- **Deferred:** Overflow-style threshold pool replacing manual governor-lend
  (swap in later if time allows).

## Plan split
- **Today:** product + presentation — finalise surfaces/UX, demo script, the
  narrative for judges, frontend scaffold against mock/local state.
- **Tomorrow:** chain tech — deploy to Arc testnet, wire the frontend to live
  contracts, record the demo video, point the subdomain.

## Testing
Hardhat tests cover the capital + reputation + proof flows (soulbound transfer
blocked, tiering on deposit, lend/repay with proof-of-impact). Compile verified
via the npm wasm solc (`scripts/compile-check.js`).

## Open (decide while building)
- Coupon mechanics for the demo: show a modeled coupon, or keep it illustrative?
- Whether to show the governor-lend step at all, or jump straight to a seeded
  "already funded" commons to keep the demo tight.
