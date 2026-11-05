# Tourism-to-Housing Impact Pool: demo + video script

The judgeable artifact. Serves double duty: the 4-min live demo (+ 3-min Q&A) at
finalist judging, and the 2-to-4-min narrated video (720p+, no music) required for
submission. Build the frontend to serve this script.

Decisions locked (5 Nov 2026): Arc anchor + ENS (World dropped); Cloudflare Pages;
return shown as a single 2.5% concessionary coupon; papercraft look
(see `2026-11-05-visual-direction.md`); **story voice**, told through one
protagonist, **Ajay**, travelling from **Mumbai to Barcelona**.

Scored on: technicality, originality, practicality, usability, WOW.

## The posture (hold this throughout)

This is a demonstrator of a long-term pilot. Its credibility is rooted in Clara's
own experience across the three worlds this project joins (claragromaches.com): the
tourism industry, housing and land commons, and blockchain. Years on housing and
land commons in Catalonia (viability research, community incubation and policy work
with co-ops, municipalities and tenants' organisations), five years at a
blockchain-native startup (dOrg, 2021 to 2026) building community housing DAO
prototypes, and the Tourism × Housing pilot this demo brings to life.

Momentum behind it: next week the project is presented at Degentrify Barcelona (10
to 13 Nov), a conference in Barcelona, in front of potential partners to push the
pilot forward; conversations with several universities are ongoing; and the pilot
targets highly touristified cities where tourism has displaced residents, Barcelona,
Lisbon, Venice, Mykonos and the like. Present it with that weight.

## The spine (one sentence each)

- **Problem:** tourism pulls value out of a place and leaves the housing costs behind.
- **Mechanism:** a transparent on-chain treasury turns a share of that value into housing held in common, locked out of the market for good.
- **Proof:** the stars Ajay chose are backed by real on-chain money and verified humans, so "anyone can verify" is literally true.
- **Ask:** the first operators and the first pilot city, to take this from demonstrator to live pool.

## The protagonist

Ajay is an ordinary traveller booking a trip from Mumbai to Barcelona. He does
nothing unusual: he books a place to stay, sees the city, eats well. The whole point
is that an ordinary tourist, booking just as easily as always and giving up nothing,
can leave a home behind in the place he visits, and get a warmer trip for it.

---

## 4-minute live demo (and video)

Timing is a target; the live on-chain moment (Beat 4) is the one that must not be cut.

### Beat 0: The choice (0:00 to 0:20)
**On screen:** Ajay in his room in paper Mumbai, about to book a Barcelona trip; two
paper paths open in front of him.
**Say:** "Ajay is booking a trip to Barcelona. There are two ways to do it."

### Beat 1: The usual way, and what it does (0:20 to 1:05)
**On screen:** he taps the usual app (Airbnb-style); the path spirals out into paper
Barcelona, flats flipping from homes into tourist lets, balconies with "Tourists go
home" banners, locals demonstrating, rent figures climbing. Ajay is still sitting in
his room as the shadow plays out.
**Say:** "The usual way: a short-stay flat, a few nights in someone's apartment. But
that flat was once a home. Across Barcelona homes keep turning into tourist lets,
over a decade rents rose 68% while wages rose 3.4%, and residents are pushed out,
onto the streets: tourists go home. One booking feeds it, and no one means any harm.
If only he knew."

### Beat 2: The other way (1:05 to 1:55)
**On screen:** Ajay books through our platform, seamless, the same ease; the path
leads to Barcelona, a stay marked with hand-cut stars; the value of his stay knots
into a standing paper home (La Balma); then the scene opens further, locals welcome
him to a shared table, a community gathering, the dragon at Park Güell, La Pedrera,
paella among people who live there.
**Say:** "The other way is just as easy. He books through the guide we are building,
where every stay is rated by the homes its host has funded. His host has put real
capital into a fund that builds cooperative homes, locked out of the market for good,
and because travellers like Ajay choose hosts who do this, it is worth their while.
He pays no extra. And it opens a trip the other path never could: he is welcomed by
the people who live there, he eats where they eat, gets their recommendations, joins
what the neighbourhood is doing. He gives something back to the city, and the city
lets him in."

### Beat 3: Pull back the curtain (1:55 to 2:25)
**On screen:** the paper set lifts to reveal the machine underneath: a paper treasury
box, threads running pool to commons; cut to the real app's transparency view reading
live from Arc.
**Say:** "None of this runs on trust. The treasury is EURC on Arc, Circle's chain for
stablecoin finance. Operators contribute, the pool's first-loss capital unlocks credit
at several times its size, and it is lent to the housing commons. Every star you saw
is this, read live from chain. The certificate is soulbound and the delivery is
steward-attested, so the stars cannot be faked. Each pool and home carries its own
ENS name."

### Beat 4: The live proof (2:20 to 3:20) **[must execute live]**
**On screen:** run a governor-lend on a fresh commons; the Arc transaction confirms;
a new paper home rises and a new stay appears in the Guide from chain state.
**Say:** "This is not a mockup. I am registering a new home and disbursing its credit
right now." (Transaction confirms.) "The steward attests the homes delivered, the
certificate tier moves, and the Guide now shows a stay that did not exist a minute
ago. The coupon to operators is modest, nought to 2.5%, and their principal stays
redeemable. What crosses once and never comes back is the housing."

### Beat 5: The ask and the horizon (3:20 to 4:00)
**On screen:** a paper map, Barcelona, Lisbon, Venice, Mykonos, and the Balearics
(Mallorca, Ibiza).
**Say:** "We proved the machine this weekend. This is a pilot with a long horizon. I
have spent years building housing and land commons in Catalonia and blockchain tooling
at dOrg, and this joins that work. Next week I present it in Barcelona at Degentrify,
in front of potential partners to push it forward, the cooperatives and tenant unions
working on exactly this. We are
starting where tourism has already pushed residents out, Barcelona, Lisbon, Venice,
Mykonos, and we are in conversation with several universities on the research behind
it. It is live, it is open source, anyone can verify it. We are looking for the first
operators and the first pilot city. This is how we bring tourism value home."

---

## 3-minute Q&A prep (likely judge questions)

Clara leads the story and the ask; whoever built the contracts owns the mechanism answers.

- **"What stops an operator pulling their money out?"** The lock sits on the funded
  homes. Operator capital stays bond-like: principal redeemable, a modest coupon. The
  registry token plus its legal wrapper is what crosses once and stays crossed.
- **"What's on-chain vs off?"** On-chain: pool balances and rules, soulbound
  certificate tiers, the commons registry, steward attestations. Off: the legal wrapper
  itself (pointed to on-chain) and the real-world construction.
- **"Why Arc / why EURC?"** A euro-denominated European housing story; Arc is built for
  stablecoin finance with EURC native, so settlement is first-class.
- **"How is the star rating not gameable?"** The certificate is soulbound and revocable,
  the tier derives from cumulative on-chain contribution, and delivery is steward-attested
  on-chain, so marketing cannot buy a star.
- **"Is this a security / what's the return?"** This is a demonstrator. The coupon is
  illustrative; what we are proving is the transparency and the one-way lock.
- **"What did you build this weekend?"** All contracts and the frontend fresh this
  weekend (classic from-scratch track); only public libraries reused (OZ, wagmi).
- **"Is this real or just a hackathon pitch?"** Next week it goes to Degentrify Barcelona,
  to the actual co-ops and tenant unions. Anchor cases are La Balma and Can Batlló, both
  real Barcelona cooperatives.

---

## What the frontend must expose for this script to work

Mock state today, live Arc reads tomorrow.

1. The Guide: browse + ★/★★/★★★ filter, seeded **La Balma + Can Batlló** (Barcelona).
2. Operator detail: funded homes, m², soulbound star tier, ENS name.
3. Commons detail: geohash, steward, legal-wrapper pointer, status.
4. "Behind the guide" transparency panel: pool balance, credit extended, tiers,
   attested impact (one click from any star).
5. A visible, demoable governor-lend action that adds a new stay to the Guide live.

---

## Production notes (record tomorrow once live)

- 2 to 4 min, 720p+, single spoken-narration track, no music.
- Two cuts: narration-only for the ETHGlobal submission; a music version from the same
  footage for Degentrify, social and the Komma site (see visual-direction doc).
- Papercraft scenes per `2026-11-05-visual-direction.md`; capture order follows the beats.
- Record Beat 4 against the real deployed app.
- End on the live URL and the ask.
