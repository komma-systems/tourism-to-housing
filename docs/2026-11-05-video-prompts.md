# Tourism-to-Housing: Midjourney prompt pack

> **Superseded** by `2026-11-06-video-prompts-v2.md` (5 Nov 2026, evening). Kept for reference.

Prompts to generate the papercraft stills for the demo video, one per beat, in a
single consistent look. Workflow: generate the **master style frame** first, lock the
look, grab its style reference code, then run every scene prompt with that code so all
scenes share one world. Then animate each still (image-to-video) with the motion note
underneath. See `2026-11-05-visual-direction.md` for the design intent.

## How to use (read first)

1. Generate **Scene 0 (master)**. Iterate until the paper look is right.
2. On the winning image, get its style reference: `--sref <code>` (or use the image
   URL as `--sref <url>`). Add that same `--sref` to every scene below so they match.
3. Keep these constant on every prompt: `--ar 16:9 --style raw --v 7`.
4. **Text caveat:** Midjourney garbles lettering. For the "Tourists go home" banners,
   either expect gibberish and add real text in post, or prompt the banners as blank
   paper placards and letter them in the edit. Do not rely on MJ for legible words.
5. Colour discipline: the world is grey paper. Only **yellow** (Ajay) and the
   **braided red/blue/yellow string** carry colour. Say so in every prompt.
6. Animate each still into a 3 to 6s clip; subtle stop-motion sway, no big camera moves.

Shared style suffix (append to every scene prompt, including the master):
`handmade papercraft stop-motion diorama, sculpted grey cardboard and construction
paper, torn deckle edges, visible fold lines and glue, tilt-shift macro, soft diffused
studio light, shallow depth of field, muted monochrome world with selective colour,
tactile and warm --ar 16:9 --style raw --v 7`

---

## Scene 0: Master style frame (generate first, sets the look)

> A single small paper figure in a yellow paper raincoat standing on a cobbled paper
> street, grey cardboard buildings behind, a thin braided string of red and blue paper
> thread winding along the ground, everything else greyscale paper, [shared style suffix]

Motion (for the animation step): gentle breathing sway, the string shifting slightly,
dust motes in the light.

## Scene 1 (Beat 0): The choice

> A paper figure in a yellow raincoat sitting in a small cardboard bedroom in paper
> Mumbai, a glowing paper phone in his hands, two paper paths unfolding out of the phone
> in front of him and forking in two directions across the floor, greyscale paper world,
> only the figure's yellow coat in colour, [shared style suffix]

Motion: the two paper paths slowly unfold and fork; the phone glows faintly.

## Scene 2 (Beat 1): The usual way (displacement shadow)

> A paper diorama of a Barcelona street, grey cardboard apartment blocks, small paper
> flats lifting out of the buildings and turning into tiny tourist suitcases, little
> grey paper residents being pushed toward the edge, blank paper banners hanging from
> the balconies, a dark paper shadow spreading over the street, strictly greyscale paper
> except one small yellow figure watching from the corner, [shared style suffix]

Motion: flats peel upward into suitcases, residents edge outward, the shadow creeps.
(Add "Tourists go home" lettering to the banners in post.)

## Scene 3 (Beat 2a): The knot into a home (hero image, reuse on the site)

> A braided string of red, blue and yellow paper thread crossing a grey paper city and
> knotting tightly into a small standing paper house that glows warm from inside, a tiny
> paper steward figure beside it, greyscale paper surroundings, the braided thread and
> the warm window the only colour, [shared style suffix]

Motion: the thread draws across frame and cinches into a knot; the house window warms.

## Scene 4 (Beat 2b): Belonging (the warmer trip)

> A long paper table in a sunlit cardboard courtyard in paper Barcelona, paper locals
> and the yellow-coated traveller sharing a meal together, a small paper plate of paella,
> the Sagrada Familia and Park Güell mosaic dragon folded from paper in the background,
> greyscale paper world warmed by soft colour at the table, the traveller's yellow coat
> bright, [shared style suffix]

Motion: steam rises from the paella, figures lean in, paper leaves flutter.

## Scene 5 (Beat 3): The machine (curtain lifts)

> A cutaway paper diorama, a grey cardboard city lifting like a lid to reveal a treasury
> box underneath made of paper, red and blue braided paper threads running from a central
> pool box out to several small paper houses, clean and diagrammatic, greyscale paper with
> only the threads in colour, [shared style suffix]

Motion: the city lid lifts away; threads pulse with value flowing pool to houses.

## Scene 6 (Beat 4): A new home rises (live proof)

> A fresh small paper house rising and unfolding upward out of a grey paper plot, a new
> braided thread snapping into place to it, a tiny certificate card with hand-cut stars
> brightening nearby, greyscale paper, threads and stars in colour, [shared style suffix]

Motion: the house unfolds upward; the thread snaps in; stars brighten one by one.
(In the edit, cut from this to the real on-chain lend on the live app.)

## Scene 7 (Beat 5): The map (the ask)

> A paper map of Europe and the Mediterranean on a cardboard table, small folded paper
> city markers at Barcelona, Lisbon, Venice, Mykonos and the Balearic islands, braided
> paper threads reaching out from Barcelona toward each one, greyscale paper, threads in
> colour, [shared style suffix]

Motion: threads extend one by one from Barcelona to each city marker.

---

## Site textures (not video)

- **Tiling paper texture:** `seamless tiling warm off-white handmade paper texture,
  subtle fibres and deckle grain, flat overhead scan, no shadows --tile --ar 1:1 --v 7`
- **Torn-edge strips:** `a strip of torn white handmade paper, deckle ragged edge, on
  pure black background, flat overhead --ar 3:1 --style raw --v 7` (knock out the black
  to PNG alpha for card edges).

## Checklist

- [ ] Scene 0 master generated, `--sref` code captured.
- [ ] Scenes 1 to 7 generated with that `--sref`, look consistent.
- [ ] Banner/map lettering added in post where MJ garbled it.
- [ ] Each still animated to a 3 to 6s clip.
- [ ] Beat 4 real-app capture recorded tomorrow and cut in.
