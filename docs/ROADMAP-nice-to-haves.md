# Roadmap / nice-to-haves (parked, post-MVP)

The MVP is a single fixed-rate lending pool with an impact-driven star. These are
real extensions we deliberately parked to ship the MVP by the deadline.

- **Secondary market for early exit (AMM-priced).** The vault is illiquid by
  design (you can only withdraw idle cash, not capital lent out). A secondary
  market would let a depositor sell their position to another investor before
  loans mature. This is the one place a floating/AMM price genuinely fits, for
  exit liquidity, never for the primary lending rate (fixed-rate is correct for
  real-world housing credit, as own.casa and Morpho V2 do).
- **Three rate-pools = three stars.** A variant where hosts choose a return band
  (2.5 / 3 / 3.5%). Dropped in favour of a single fair rate + impact-based star.
- **Embedded wallet (Privy) for travellers.** Email-login, no seed phrase, so the
  consumer guide needs no crypto wallet. Usability upgrade.
- **Whitechain RWA.** Deploy the commons registry on Whitechain Sepolia as a
  tokenised real-world asset (a third prize).
- **Outcome-funded coupon.** A municipality / tourism-levy buffer that tops up
  depositor returns, so the commons could borrow at 0%. More political, needs the
  extra actor.
