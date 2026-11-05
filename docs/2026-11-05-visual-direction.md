# Tourism-to-Housing: visual direction (papercraft)

Creative direction for both the demo video and the live website. Reference:
@likevespa papercraft stop-motion made with Komma (privacy-preserving audio),
"we made it out of paper and string... the threads knot, and the knot becomes a
plan." We borrow that language for housing.

Decisions locked (5 Nov 2026):
- **Website:** paper-accented on a clean, readable base (not full stop-motion).
- **Video:** AI image-to-video, consistent grey-paper scenes + narration.

## The look

A world sculpted from grey paper and cardboard, deliberately monochrome, with a
few deliberate colour pops:
- **Yellow** = the traveller / the human choosing (the raincoat in the reference).
- **Coloured braided string** = value made visible. Two threads that braid:
  - **thread A (capital loop)** = tourism money flowing in,
  - **thread B (reputation loop)** = the certificate / stars,
  - braided together they knot into a **paper house that stays standing**.
- Everything tactile: torn edges, visible fold lines, hand-cut shapes, slight wobble.

## The core metaphor (hold this everywhere)

Tourism value is loose string pulled out of a place. Our machine **knots the string
into a house that cannot be untied**. The one-way lock is a knot you can see.

## Video: paper scenes mapped to the script beats

(Beats from `2026-11-05-demo-script.md`.)

| Beat | Paper scene |
|---|---|
| 0 Choice | Ajay (yellow) in his paper room in Mumbai, about to book; two paper paths fork in front of him. |
| 1 Usual way | He taps the usual app; the path spirals out into paper Barcelona, flats flipping from homes into tourist lets, balconies with "Tourists go home" banners, little paper residents demonstrating, rent-numbers climbing. Ajay still in his room as the shadow plays. |
| 2 Other way | He books through our platform; the path leads to Barcelona, a starred stay; the string of his stay knots into a standing paper house (La Balma), a steward beside it; the scene opens further, locals welcoming him to a shared table, a community gathering, the dragon at Park Güell, La Pedrera, paella among people who live there. |
| 3 Curtain | The paper set lifts to reveal the "machine" underneath: a paper treasury box, threads running pool → commons; cut to the real app's transparency view. |
| 4 Live proof | Cut to the real paper-skinned app; a live on-chain lend; a new paper house rises and a new stay appears as the tx confirms. |
| 5 Ask | Pull back to a paper map: Barcelona, Lisbon, Venice, Mykonos (and the Balearics), threads reaching out. |

Production: generate each scene as a consistent grey-paper still, animate to a
3-to-6s clip, single narration track, captions along the bottom (reference style),
720p+, no music. Record Beat 4 against the live app.

**Two cuts.** The submission cut is narration only, no music (ETHGlobal rule). Make
a second cut with a music bed from the same footage for Degentrify Barcelona, social
and the Komma site, where music is allowed and the paper look carries well with it.

## Website: paper-accented, clean base

Real working dApp (Next.js + wagmi/viem reading Arc); the skin carries the charm
without hurting readability or the Saturday deadline.

Keep:
- Paper-texture card backgrounds, soft shadow as if cut shapes rest on a surface.
- **Hand-cut star ratings** (★/★★/★★★) as the certificate, not font glyphs.
- On "Behind the guide", render value flows as **coloured string/thread** from
  pool → commons, braiding the two loops; the live lend animates a new thread.
- Subtle torn/deckle edges on primary cards; a warm paper off-white base.
- One accent colour (yellow) for the human/traveller actions (contribute, choose).

Avoid (protects the deadline and legibility):
- Full stop-motion wobble on every element; keep body text and data crisp.
- Paper texture behind dense numbers on the transparency panel (legibility first).

Hand to the `frontend-design` skill when scaffolding; this is the design brief.

## Asset list to generate (video stills + site textures)

1. Ajay's paper room in Mumbai, two forking paths (hook).
2. The usual-way shadow: paper Barcelona, flats flipping to tourist lets, "Tourists go home" banners.
3. The knot → standing paper house / La Balma (hero image, reusable on the site).
4. The belonging scene: locals welcoming Ajay, a shared table / community gathering, sights among residents.
5. The treasury "machine" cutaway.
6. Paper map of the cities (Barcelona, Lisbon, Venice, Mykonos, and the Balearics).
7. Tiling paper texture + a few torn-edge PNGs for the site.
