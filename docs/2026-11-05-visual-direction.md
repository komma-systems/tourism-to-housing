# Tourism-to-Housing — visual direction (papercraft)

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

## Video — paper scenes mapped to the script beats

(Beats from `2026-11-05-demo-script.md`.)

| Beat | Paper scene |
|---|---|
| 0 Hook | A paper Barcelona street; hotels tall, little paper residents getting pushed off the edge as rent-numbers rise. String is being pulled *out* of the town. |
| 1 Guide | A paper guidebook opens; stays with hand-cut ★/★★/★★★ pinned on; the yellow traveller choosing one. |
| 2 Verified homes | The chosen string gets knotted into a standing paper house (La Borda); a small paper steward beside it; it will not come undone. |
| 3 Curtain | The paper set lifts to reveal the "machine" underneath: a paper treasury box, threads running pool → commons. |
| 4 Live proof | Cut to the real paper-skinned app; a live on-chain lend; a new paper house rises as the tx confirms. |
| 5 Ask | Pull back to a paper map: Barcelona now, threads reaching toward Venice, Mallorca, Mykonos. |

Production: generate each scene as a consistent grey-paper still, animate to a
3-to-6s clip, single narration track, captions along the bottom (reference style),
720p+, no music. Record Beat 4 against the live app.

## Website — paper-accented, clean base

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

1. Paper Barcelona street (hook).
2. Paper guidebook with pinned stars.
3. The knot → standing paper house (hero image, reusable on the site).
4. The treasury "machine" cutaway.
5. Paper map of the four cities.
6. Tiling paper texture + a few torn-edge PNGs for the site.
