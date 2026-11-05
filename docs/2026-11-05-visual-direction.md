# Tourism-to-Housing: visual direction (papercraft)

Creative direction for both the demo video and the live website. Updated 5 Nov 2026
(evening) after rewatching the reference film.

**Reference:** the Meld film by Dayvan Studios × Komma Systems, "The future remembers
how we decided" (@likevespa, 1 Nov 2026): https://x.com/likevespa/status/2117011681930830293
Stills (subtitles cropped) are in `../../video-assets/meld-sref/`.

Decisions locked (5 Nov 2026):
- **Website:** paper-accented on a clean, readable base (no full stop-motion).
- **Video:** AI stills and image-to-video in the Meld style, narration only for the
  ETHGlobal cut. Prompts: `2026-11-06-video-prompts-v2.md`.

## The look

Handcrafted papercraft dioramas: layered cut paper and cardboard, characters with
softly painted paper faces, visible paper grain and folded edges, warm golden light,
miniature depth of field. The film reads as a made object, with care in it.

## Colour carries the story

The earlier version of this doc made the whole world grey with a few colour pops.
The reference does something different, and we follow it:

- **Full, warm colour** is the world working as it should: neighbours on balconies,
  a city people can live in.
- **Grey cardboard** is the problem. Colour drains out of the scene when homes turn
  into tourist lets.
- **Glowing red and blue paper threads** appear in the grey and braid with yellow
  into a **red, blue and yellow rope**: value made visible (the capital loop and the
  reputation loop braided together).
- **Where the rope knots, colour comes back.** The knot is the house that stays: the
  one-way lock as something you can see.
- **Yellow is the person choosing.** Ajay wears the yellow raincoat, which ties this
  film to the Meld film as one Komma world.

## The core metaphor (hold this everywhere)

Tourism value is loose string pulled out of a place. Our machine knots the string
into a house that cannot be untied, and the colour returns around it.

## Video: scenes mapped to script v2

(Beats from "Video script v2" in `2026-11-05-demo-script.md`.)

| Beat | Scene | Colour |
|---|---|---|
| 0 Hook | Barcelona Eixample street, neighbours, laundry; figures over the sky | full colour |
| 1 Clara | on camera, real location | live footage |
| 2 Usual way | Ajay in Mumbai with two forking paths; then the same Barcelona street as flats lift out into suitcases, residents leave, "Tourists go home" banners | colour drains to grey |
| 3 Other way | the braided thread runs through the grey city and knots around a timber co-op; Ajay welcomed at a courtyard table; cut to the live Guide | colour returns |
| 4 Behind the stars | live app only | app |
| 5 Live proof | empty grey plot, the rope's end; a paper house unfolds and colour floods in; hard cut to the real transaction | grey to colour |
| 6 Ask | paper map, threads from Barcelona to the pilot cities; end card | full colour |

For the ETHGlobal cut we use the simple version: 5 images (Barcelona in colour and drained to grey; Ajay in Mumbai; the empty plot and the risen house), see `2026-11-06-video-prompts-v2.md`.

Production: captions along the bottom (Meld style), 720p or higher, narration only
for the submission cut. Make a second cut with music from the same footage for
Degentrify, social and the Komma site.

## Website: paper-accented, clean base

Real working dApp (Next.js + wagmi/viem reading Arc); the skin carries the charm
without hurting readability or the deadline.

Taken from the Meld end cards (see `07-end-card-website.png`):
- **Warm off-white paper base** (current #F4EEE2 is right).
- **Small red letter-spaced labels** (uppercase, wide tracking) above headings and
  section starts, as in "THE DIAL IS A STORY. THE TOOL IS REAL."
- **Italic serif for statements** (Fraunces italic): the hero line, pull quotes,
  the closing line.
- **Braided red, blue and yellow stripe** as a border along the page bottom and as a
  divider between sections.

Keep:
- Paper-texture card backgrounds, soft shadow as if cut shapes rest on a surface.
- **Hand-cut star ratings** (★/★★/★★★) as the certificate, drawn as paper shapes.
- On "Behind the guide", value flows as **coloured thread** from pool to commons,
  braiding the two loops; the live lend animates a new thread.
- The video stills reused as hero images: P1 (Barcelona in colour) on the home page,
  P4 or P6b (the knotted house) on stay and commons pages.
- One accent colour (yellow) for the traveller's actions (contribute, choose).

Optional if time allows: images on the Guide sit slightly desaturated and come to full
colour on hover, echoing "colour comes back where the homes are kept".

Avoid (protects the deadline and legibility):
- Full stop-motion wobble on every element; keep body text and data crisp.
- Paper texture behind dense numbers on the transparency panel.

Hand to the `frontend-design` skill when building; this is the design brief.

## Asset list

Video stills (prompts in `2026-11-06-video-prompts-v2.md`):
1. Ajay character sheet.
2. P1 Barcelona street in colour (also the site hero).
3. P2 Ajay in Mumbai, two forking paths.
4. P3 the same street drained to grey, suitcases, banners.
5. P4 the thread knotting around the co-op, colour returning (site image).
6. P5 Ajay welcomed at the courtyard table.
7. P6a / P6b the empty plot and the risen house (site image).
8. P7 the map.

Site: a tiling paper texture, the braided stripe as an SVG or PNG strip, a few
torn-edge PNGs.
