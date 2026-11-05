# Tourism-to-Housing Impact Pool — demo + video script

The judgeable artifact. Serves double duty: the 4-min live demo (+ 3-min Q&A) at
finalist judging, and the 2-to-4-min narrated video (720p+, no music) required for
submission. Build the frontend to serve this script, not the other way round.

Decisions locked (5 Nov 2026): Arc anchor + ENS + **World ID** as the three
partner prizes; hosted on Cloudflare Pages at `tourism-to-housing.komma.systems`;
coupon shown **illustratively** (stated, not computed).

Scored on: technicality, originality, practicality, usability, WOW.

---

## The spine (one sentence each, memorise these)

- **Problem:** tourism pulls value out of a place and leaves the housing costs behind.
- **Mechanism:** a transparent on-chain treasury turns a share of that value into housing held in common, locked out of the market for good.
- **Proof:** the stars in the guide are backed by on-chain money and verified humans, so "anyone can verify" is literally true.
- **Ask:** pilot operators and cities to take this from demonstrator to first live pool.

---

## 4-minute live demo (and video)

Timing is a target; the live on-chain moment (Beat 4) is the one that must not be cut.

### Beat 0 — Hook (0:00–0:25)
**On screen:** the Guide landing, populated with real seeded stays (La Borda, Can
Batlló in Barcelona).
**Say:** "In Barcelona over a decade tourist numbers rose by half, rents by 68%,
salaries by 3.4%. Tourism draws the value out and leaves the housing crisis
behind. We built the thing that sends it home. This is a guide to stays rated by
how much permanent affordable housing their guests have funded."

### Beat 1 — The Guide as front door (0:25–1:05)
**On screen:** filter by ★ / ★★ / ★★★; open a ★★★ operator.
**Say:** "One star is worth a stay, three is worth the journey. The Michelin move:
we make funding local housing the thing operators compete for. Every listing shows
the homes and square metres its guests actually helped fund." Point to the World
ID verified badge: "and the operator behind this star is a verified unique human,
so the rating cannot be faked or Sybil-gamed."

### Beat 2 — The verified homes (1:05–1:40)
**On screen:** the funded commons under that operator (La Borda), homes + m²,
steward, legal-wrapper pointer, ENS name (`laborda.barcelona.tourism-pool.eth`).
**Say:** "These are real cooperative homes in Barcelona, each permanently
de-commodified. That is transvestment: value crosses once, out of the market, into
commons that cannot be pulled back into private hands. The lock is on the homes."

### Beat 3 — Pull back the curtain (1:40–2:10)
**On screen:** click through to "Behind the guide": live pool balance, credit
extended, certificate tiers, attested impact, all read from Arc.
**Say:** "Every star you just saw is this, read live from chain. The treasury is
EURC on Arc, Circle's L1 for stablecoin finance. Operators contribute, the pool's
first-loss capital unlocks credit at several times its size, lent to the commons."

### Beat 4 — The live on-chain action (2:10–3:15) **[must execute live]**
**On screen:** run a governor-lend on a fresh commons; watch the transaction
confirm on Arc; the dashboard and the new listing update from chain state.
**Say:** "This is not mocked. I am registering a new commons and disbursing EURC
credit now." (Transaction confirms.) "The steward attests the homes delivered, the
certificate tier moves, and the guide now shows a stay that did not exist sixty
seconds ago. The coupon to operators is illustrative here, 0 to 2.5%, the principal
stays redeemable; what crosses permanently is the housing."

### Beat 5 — The ask (3:15–4:00)
**On screen:** back to the Guide, the map of target cities (Barcelona, Venice,
Mallorca, Mykonos).
**Say:** "Built from scratch this weekend on Arc, with ENS naming every pool and
commons and World ID verifying every operator and steward. It is live at
tourism-to-housing.komma.systems, open source, anyone can verify it. We are looking
for the first operators and a pilot city to turn this demonstrator into a real
pool. Bringing tourism value home."

---

## 3-minute Q&A prep (likely judge questions)

Owner note: Clara leads the story and the ask; whoever built the contracts owns
the mechanism answers.

- **"What stops an operator pulling their money out?"** The lock is on the funded
  homes, not operator capital. Operators are bond-like: principal redeemable, a
  modest coupon. The registry token plus its legal wrapper is what crosses once.
- **"What's actually on-chain vs off?"** On-chain: pool balances and rules,
  soulbound certificate tiers, the commons registry, steward attestations. Off:
  the legal wrapper itself (pointed to on-chain) and real-world construction.
- **"Why Arc / why EURC?"** Euro-denominated European housing story; Arc is
  built for stablecoin finance with EURC native, so settlement is first-class.
- **"How is the star rating not gameable?"** Certificate is soulbound and
  revocable, tier is derived from cumulative on-chain contribution, and operators
  and stewards are World ID verified unique humans.
- **"Is this a security / what's the return?"** Demonstrator, not an offering.
  The coupon is illustrative; the point we are proving is the transparency and the
  one-way lock, not a yield product.
- **"What did you build this weekend vs before?"** All contracts and frontend
  fresh this weekend (classic from-scratch track); only public libraries (OZ,
  wagmi) reused.

---

## What the frontend must expose for this script to work

Checklist for the scaffold (mock state today, live Arc reads tomorrow):

1. Guide browse + ★/★★/★★★ filter, seeded La Borda + Can Batlló.
2. Operator detail: funded homes, m², World ID verified badge, ENS name.
3. Commons detail: geohash, steward, legal-wrapper pointer, status.
4. "Behind the guide" transparency panel: pool balance, credit extended, tiers,
   attested impact (one click from any star).
5. A visible, demoable governor-lend action that updates the guide live.

---

## Production notes (record tomorrow once live)

- 2 to 4 min, 720p+, single spoken-narration track, no music.
- Capture order follows the beats above; record Beat 4 against the real deployed app.
- End on the live URL and the ask, not on the app.
