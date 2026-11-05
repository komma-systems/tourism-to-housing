# Tourism-to-Housing Impact Pool — demo + video script

The judgeable artifact. Serves double duty: the 4-min live demo (+ 3-min Q&A) at
finalist judging, and the 2-to-4-min narrated video (720p+, no music) required for
submission. Build the frontend to serve this script.

Decisions locked (5 Nov 2026): Arc anchor + ENS + World ID; Cloudflare Pages at
`tourism-to-housing.komma.systems`; coupon shown illustratively; papercraft look
(see `2026-11-05-visual-direction.md`); **story voice**, told through one
protagonist, **Meera**, travelling from **Mumbai to Barcelona**.

Scored on: technicality, originality, practicality, usability, WOW.

## The posture (hold this throughout)

This is a demonstrator of a long-term project with a long horizon behind it. It is
grounded in a real movement (Degentrify Barcelona, 10 to 13 Nov), real Catalan
cooperatives, and an ongoing research conversation with a European university. It
also carries real credentials: Clara has spent years on housing and land commons in
Catalonia (viability research, community incubation and policy work with co-ops,
municipalities and tenants' organisations), five years at a blockchain-native
startup (dOrg, 2021 to 2026) building community housing DAO prototypes, and now runs
the Tourism × Housing pilot this demo brings to life (claragromaches.com). The
person presenting has worked in all three worlds this joins: tourism, housing
commons, and blockchain. Present it with that weight.

## The spine (one sentence each)

- **Problem:** tourism pulls value out of a place and leaves the housing costs behind.
- **Mechanism:** a transparent on-chain treasury turns a share of that value into housing held in common, locked out of the market for good.
- **Proof:** the stars Ajay chose are backed by real on-chain money and verified humans, so "anyone can verify" is literally true.
- **Ask:** the first operators and the first pilot city, to take this from demonstrator to live pool.

## The protagonist

Ajay saved for two years for this trip. He flies from Mumbai to Barcelona for the
holiday he has wanted for a long time. He does nothing unusual: he books a place
to stay, sees the city, eats well. The whole point is that an ordinary tourist,
giving up nothing, leaves a home behind in the place he visited.

---

## 4-minute live demo (and video)

Timing is a target; the live on-chain moment (Beat 4) is the one that must not be cut.

### Beat 0 — The booking (0:00–0:30)
**On screen:** Ajay in paper Mumbai, booking Barcelona on the Guide; he picks a
place to stay and it carries three hand-cut paper stars.
**Say:** "Ajay saved two years for this trip. He books a place to stay in
Barcelona. It has three stars, and he barely notices why. All he wants is a good
holiday."

### Beat 1 — Barcelona in paper (0:30–1:15)
**On screen:** the paper city rises around him, the mosaic dragon at Park Güell, the
wave-stone of La Pedrera, the Sagrada Família, a paper plate of paella.
**Say:** "He does what everyone does. The dragon at Park Güell, the stone waves of
La Pedrera, the Sagrada Família, a plate of paella in the sun. A completely ordinary,
lovely trip. In the city he is enjoying, rents have climbed 68% in a decade while
salaries rose 3.4%, and residents are being pushed out of the neighbourhoods he is
walking through."

### Beat 2 — The quiet twist (1:15–1:50)
**On screen:** while he wanders, a thread is drawn from his stay across the city and
knotted into a standing paper home (La Balma); a small paper steward beside it.
**Say:** "Here is what his stars meant. While Ajay ate and wandered, the value of
his stay was pulled as a single thread and knotted, on the other side of the same
city, into a real cooperative home that can never be sold back into the market. The
one-way lock is on the house. He gave up nothing, and a family stays."

### Beat 3 — Pull back the curtain (1:50–2:20)
**On screen:** the paper set lifts to reveal the machine underneath: a paper treasury
box, threads running pool to commons; cut to the real app's transparency view reading
live from Arc.
**Say:** "None of this runs on trust. The treasury is EURC on Arc, Circle's chain for
stablecoin finance. Operators contribute, the pool's first-loss capital unlocks credit
at several times its size, and it is lent to the housing commons. Every star you saw
is this, read live from chain. Every operator and steward is a verified human through
World ID, so the stars cannot be faked. Each pool and home carries its own ENS name."

### Beat 4 — The live proof (2:20–3:20) **[must execute live]**
**On screen:** run a governor-lend on a fresh commons; the Arc transaction confirms;
a new paper home rises and a new stay appears in the Guide from chain state.
**Say:** "This is not a mockup. I am registering a new home and disbursing its credit
right now." (Transaction confirms.) "The steward attests the homes delivered, the
certificate tier moves, and the Guide now shows a stay that did not exist a minute
ago. The coupon to operators is modest, nought to 2.5%, and their principal stays
redeemable. What crosses once and never comes back is the housing."

### Beat 5 — The ask and the horizon (3:20–4:00)
**On screen:** a paper map, Barcelona, Lisbon, Venice, Mykonos, and the Balearics
(Mallorca, Ibiza).
**Say:** "We proved the machine this weekend, but this is not a weekend project. Next
week I present it in Barcelona at Degentrify, to the cooperatives and tenant unions
building the real thing, Sostre Civic, Can Batlló, La Morada. We are starting where
tourism has already pushed residents out, Barcelona, Lisbon, Venice, Mykonos, Mallorca,
Ibiza, and we are in conversation with a European university on the research behind it.
It is live, it is open source, anyone can verify it. We are looking for the first
operators and the first pilot city. This is how we bring tourism value home."

---

## 3-minute Q&A prep (likely judge questions)

Clara leads the story and the ask; whoever built the contracts owns the mechanism answers.

- **"What stops an operator pulling their money out?"** The lock is on the funded
  homes, not operator capital. Operators are bond-like: principal redeemable, a modest
  coupon. The registry token plus its legal wrapper is what crosses once.
- **"What's on-chain vs off?"** On-chain: pool balances and rules, soulbound
  certificate tiers, the commons registry, steward attestations. Off: the legal wrapper
  itself (pointed to on-chain) and the real-world construction.
- **"Why Arc / why EURC?"** A euro-denominated European housing story; Arc is built for
  stablecoin finance with EURC native, so settlement is first-class.
- **"How is the star rating not gameable?"** The certificate is soulbound and revocable,
  the tier derives from cumulative on-chain contribution, and operators and stewards are
  World ID verified unique humans.
- **"Is this a security / what's the return?"** A demonstrator, not an offering. The
  coupon is illustrative; what we are proving is the transparency and the one-way lock.
- **"What did you build this weekend?"** All contracts and the frontend fresh this
  weekend (classic from-scratch track); only public libraries reused (OZ, wagmi).
- **"Is this real or just a hackathon pitch?"** Next week it goes to Degentrify Barcelona,
  to the actual co-ops and tenant unions. Anchor cases are La Balma and Can Batlló, both
  real Barcelona cooperatives.

---

## What the frontend must expose for this script to work

Mock state today, live Arc reads tomorrow.

1. The Guide: browse + ★/★★/★★★ filter, seeded **La Balma + Can Batlló** (Barcelona).
2. Operator detail: funded homes, m², World ID verified badge, ENS name.
3. Commons detail: geohash, steward, legal-wrapper pointer, status.
4. "Behind the guide" transparency panel: pool balance, credit extended, tiers,
   attested impact (one click from any star).
5. A visible, demoable governor-lend action that adds a new stay to the Guide live.

---

## Production notes (record tomorrow once live)

- 2 to 4 min, 720p+, single spoken-narration track, no music.
- Papercraft scenes per `2026-11-05-visual-direction.md`; capture order follows the beats.
- Record Beat 4 against the real deployed app.
- End on the live URL and the ask.
