# Retorn: product model spec + decisions (shared by the site and the demo)

One source of truth so the Retorn website (retorn-website.netlify.app) and the
ETHGlobal Tourism-to-Housing demo stay aligned. Decisions locked 5 Nov 2026.
Built by Komma; for the hackathon the Komma/Fundació relationship stays offstage.

## Decisions at a glance

1. **Money:** the fund, low purposeful return (concessionary capital).
2. **Reputation:** one three-tier impact star (replaces the stamp).
3. **On-chain:** ERC-4626 + EURC on Arc + ENS (canonical for the hackathon; World dropped).
4. **Headline figure:** homes and hectares protected (euros secondary).
5. **Geography:** Barcelona flagship + outskirts; rural backbone retained.
6. **Entities:** built by Komma; not foregrounded for the hackathon.

---

## 1. The model: the fund

Dropped: "€1 per guest-night into the commons." It reads like a tourist tax or a
charity round-up, it is psychologically small, and it caps the impact at loose change.
It stays as one minor channel, it no longer leads.

The fund:
- **Hosts commit real capital** into the fund, under multi-year agreements. They get
  their principal back plus a **low, purposeful return**, concessionary/patient
  capital pitched at or just above inflation. The thin return is the point: it carries
  a donation-like spirit while staying a fund.
- That first-loss capital **unlocks credit at several times its size** (the site's own
  "five to eight euros per commons euro"), lent to cooperative housing and land commons.
- Each funded home is **permanently de-commodified**, it crosses once and can never be
  sold back (the one-way lock).
- **Travellers pay no levy.** A traveller chooses a host who funds homes; their bookings
  are what make it worth a host's while to commit capital and climb the stars.

**Two numbers, named to avoid confusion** (metals are dropped, so the old "Silver =
2.5%" clash goes away):
- **Contribution** = the share of revenue a host directs into the fund. The input that
  earns homes and the star tier.
- **Return** = a single 2.5% concessionary coupon on the host's committed capital, just
  above the ~1.9% deposit rate. The one and only 2.5%.

**Legal flag (needs the legal-tax layer before the site says "fund/return"):** a fund
that pays any return is legally an investment, so the current site line "contributions
are donations, not investments" has to change, and the securities/prospectus angle
needs a pass. Route through legal-tax-advisor (LI/ES/EU) before publishing.

## 2. The rating: one impact star

Measures one thing, how much permanent housing the host has funded. Replaces the
current "stamp." Michelin register:

- **★ Worth a stay:** in the fund, first-loss capital committed, first homes underway.
- **★★ Worth a detour:** funded homes delivered and verified.
- **★★★ Worth the journey:** a substantial, standing housing commons.

Thresholds (illustrative, tunable): ★ = capital committed; ★★ = 2+ homes delivered
and attested; ★★★ = 5+ homes. The tier derives from verifiable on-chain contribution
and attested delivery, so it cannot be bought with marketing (soulbound, revocable).

On the card: **★★★ · Worth the journey · 8 homes funded · €1.4m committed**. The
tagline carries the desire, the number carries the proof.

Stamps come off the cards. Keep 3 to 4 genuine, filterable facts on the detail page
only (Cooperative, Km0, Train-friendly); drop the vague ones.

## 3. On-chain layer (hackathon-canonical)

For the demo the on-chain layer is the DeFi stack, because we are optimising to win:
- the fund as an **ERC-4626 vault**, **EURC on Arc**, balances and rules readable on-chain,
- each pool and home carrying its **ENS** name,
- one click from any star to live chain state.

Retorn's real-world Safe multisig treasury (Ethereum/L2 + fiat-hash) is a later,
separate concern; the demo does not claim to be it.

## 4. Headline figure

Lead with **homes kept permanently affordable and hectares protected**. Euros sit
beside it as committed capital. Replace the "€31,447 returned" counter.

## 5. Geography and host profile

- **Barcelona is the flagship** (plus outskirts): where the problem is undeniable
  (holiday flats replace homes, rents +68%, "tourists go home"), the catchy narrative,
  and a high-margin contribution source. The demo's Ajay story rides this.
- **Rural stays the backbone** where real homes and land get protected and where the
  work is most tractable (Sostre Civic, surface rights, cheaper land). Retorn keeps its
  rural soul; territorial pools keep each place's money local.
- **Barcelona host profile:** independent/boutique owner-operated hotels, cooperative
  guesthouses (e.g. Pensió Cooperativa Gràcia), foundation/community spaces with
  lodging. The outliers who want to differentiate. Chains and tourist-flats are the
  problem, so they are not the early supply (licences phase out by 2028 anyway).

## 6. Entities

Built by Komma. For the hackathon this stays offstage, it is a demo. Fundació Retorn
/ Komma structure gets stated plainly later, not now.

---

## Leaning the site (do less, say it once)

The site documents the whole machine before a single home exists (first key: autumn
2027). Its only job now is to **recruit founding hosts and members, and earn trust.**

- **One message, said once:** "Travel that returns. Every stay leaves a home behind."
  Lead with it; stop re-proving it on every page.
- **Collapse the nav** from 11 items to four: The idea / For places / For travellers /
  Join. Manifesto and Transparency move to the footer.
- **Defer the over-specified mechanism:** show 3 fund channels not 8; 1 to 2 membership
  tiers not 3; the treasury as one sentence + link, not tables.
- **One ask per page**, ending on a single action.

Principle: the site sells the vision and collects founders. The machine stays mostly
offstage until one loop actually runs.

## Open build actions (for the chain/frontend terminal)

To make the as-built state match these decisions:
1. **Re-seed La Borda to La Balma** on-chain, so the commons match the Degentrify
   co-ops (La Balma, Can Batlló).
2. **Switch the frontend rating from Gold/Silver/Copper to the ★/★★/★★★ star** with
   the taglines and the hard number. The contracts already mint the soulbound stars.
3. **Build the ENS naming** (parent `retorn.eth` → pool `barcelona.retorn.eth` →
   commons `labalma.barcelona.retorn.eth`), the one stretch prize we are integrating.
4. **Converge to one frontend** and lead its seeded stays with Barcelona (boutique,
   cooperative, foundation hosts).
5. Drop any World ID references in the build (prize dropped).

## Keep (already working on Retorn)

My passport (→ a soulbound traveller token later); "stay long enough to belong" and
the Commons Travellers thesis; no commission, contact the host directly; the manifesto;
territory filters, real places and photos; multi-language (EN/CA/ES).
