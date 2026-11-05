# Tourism-to-Housing: video prompts (simple version, ETHGlobal)

Five images, **Midjourney only** (Clara's paid image tool). Images 2 and 5 are edits of
images 1 and 4 made in Midjourney's editor (repaint a selected area, keep the rest).
Grey and colour changes are done in the video editor. Motion is slow zooms and
crossfades in the video editor. Script:
"Video script v2" in `2026-11-05-demo-script.md`. Look: `2026-11-05-visual-direction.md`.
Full version with Flow and more scenes: `2026-11-06-video-prompts-full-degentrify.md`.

## The idea in one line

Barcelona in warm colour; the colour drains when homes become tourist lets; it comes
back where a red, blue and yellow braided rope knots into a house that stays.

## The five images

| # | Image | Tool | Used in | Motion in the editor |
|---|---|---|---|---|
| 1 | Barcelona street in colour | Midjourney | Beat 0, hook (figures over the sky) | slow zoom in, 10 s |
| 2 | Same street with suitcases, boxes, banners; turned grey in the editor | Midjourney editor, edit of 1 | Beat 2, the usual way | crossfade 1 to 2 over 2 to 3 s, slow zoom continues |
| 3 | Ajay in Mumbai, two paths (optional) | Midjourney | Beat 2, opening | slow zoom in |
| 4 | Empty grey plot, the rope's end | Midjourney | Beat 5, before the transaction | slow zoom in |
| 5 | The house has risen, in colour | Midjourney editor, edit of 4 | Beat 5, then hard cut to the real transaction | crossfade 4 to 5 over 2 s |

**Order of work:** 1, 2, 4, 5, then 3 if there is time. Pairs 1+2 and 4+5 carry the
story; without image 3, the narration introduces Ajay over image 1.

## Before you start: style references (once)

Upload these Meld film stills (in `../../video-assets/meld-sref/`) to Midjourney and
note their image URLs:

- `01-colour-river-path-clean.png`: the warm colour world. **Use on every prompt.**
- `06-colour-future-playground-clean.png`: warm colour, wider set.
- `08-grey-meeting-clean.png`: the grey world.
- `04-braid-on-grey-clean.png`: glowing threads in the grey.

In the prompts below, replace `URL01`, `URL06`, `URL08`, `URL04` with those URLs.
`--sw` is style weight: start at 200; lower it to 100 if the result copies the Meld
scenes too closely, raise it to 400 if it drifts away from the paper look.

Midjourney gives four options per prompt. Pick one and upscale it before editing it.

---

## Image 1 (Midjourney): Barcelona in colour

```
papercraft diorama of a Barcelona Eixample street corner, cream paper apartment buildings with wrought-iron balconies, green shutters, potted geraniums, laundry lines, neighbours chatting on balconies, an old man carrying a bread loaf, a child on a scooter, warm late-afternoon golden light, layered cut paper and cardboard, softly painted paper faces, visible paper grain and folded edges, miniature tilt-shift depth of field, stop-motion film still, wide calm sky in the upper left --ar 16:9 --sref URL01 URL06 --sw 200
```

Check: the empty sky in the upper left is where the rent and wage figures go. If it
is too busy, regenerate.

## Image 2 (Midjourney editor, edit of image 1): homes become tourist lets

Open the upscaled image 1 in Midjourney's editor. Select (erase) only the areas to
change, and keep the buildings outside the selection so they stay exactly in place.

1. Select two or three balconies and windows on the facade. Prompt:
   ```
   paper flats lifting out of the facade and folding into small paper suitcases with luggage tags, papercraft diorama
   ```
2. Select the people on the street. Prompt:
   ```
   paper residents carrying cardboard boxes away down the street, sad, papercraft diorama
   ```
3. Select two balcony railings. Prompt:
   ```
   hand-painted cloth protest banners hanging from the balconies, papercraft diorama
   ```
   Midjourney often garbles lettering, so leave the banners blank and add
   "TOURISTS GO HOME" as text in the video editor.

In the video editor: crossfade from image 1 to image 2 while taking the saturation
down to zero over 2 to 3 seconds, so the colour drains as the flats leave. Cool the
light slightly at the end.

Check: the buildings must line up with image 1. If the editor shifts things, select a
smaller area.

## Image 3 (Midjourney, optional): Ajay in Mumbai

```
papercraft diorama of a young Indian man around 28 with short black hair and light stubble, wearing a yellow paper raincoat, sitting on a bed in a small room in Mumbai at night, monsoon rain on the window, paper Mumbai skyline outside, holding a glowing phone, two paper paths unfolding out of the phone across the floor and forking, one a plain grey paper path, one a glowing braided rope of red, blue and yellow threads, warm lamp light against blue night, layered cut paper and cardboard, softly painted paper face, miniature tilt-shift depth of field, stop-motion film still --ar 16:9 --sref URL01 URL04 --sw 200
```

## Image 4 (Midjourney): the empty plot

```
papercraft diorama of an empty grey cardboard building plot between two grey paper apartment blocks in Barcelona, the loose end of a glowing braided rope of red, blue and yellow paper threads lying on the ground in the middle of the plot, soft cool light, everything grey except the glowing rope, layered cut paper and cardboard, visible paper grain and folded edges, miniature tilt-shift depth of field, stop-motion film still --ar 16:9 --sref URL08 URL04 --sw 200
```

## Image 5 (Midjourney editor, edit of image 4): the house rises

Open the upscaled image 4 in Midjourney's editor. Select only the empty plot (include
the rope's end) and keep the two side buildings outside the selection. Prompt:

```
a small paper cooperative house standing in the plot as if it has unfolded upward from the ground, timber-coloured paper walls, planted balconies, warm golden light in every window, a braided rope of red, blue and yellow threads tied around its base in a firm knot, a small paper card with three hand-cut gold stars by the door, full warm colour, papercraft diorama --sref URL01
```

The house comes out in colour while the street around it stays grey, which is the
point: colour returns where the house is kept. In the video editor, crossfade from
image 4 to image 5 over 2 seconds, then add a slight warm grade to the whole frame so
the colour spreads outward.

Check: the side buildings stay in place, so the crossfade reads as the house rising.

---

## In the editor

- **Colour drain (images 1 to 2):** crossfade plus saturation down to zero; banner text
  "TOURISTS GO HOME" added as text on the blank banners.
- **Hook (image 1):** set in Fraunces, white over the sky: "Rent +40%" and "Wages +4%",
  small line "after inflation, Barcelona, decade to 2023"; then "Wages still buy less
  than in 2010".
- **Captions** on all narration, small, bottom centre.
- **Sponsor labels** in the app sections: "EURC on Arc", "ENS name".
- **End card:** warm off-white, small red letter-spaced label, italic serif line,
  braided red, blue and yellow stripe along the bottom (like
  `../../video-assets/meld-sref/07-end-card-website.png`), live URL and repo.
- **No music** in the ETHGlobal cut.

Optional: if Midjourney's own animate feature gives a good clip of image 1 or 3 on the
first try, use it in place of the zoom. Don't spend more than a few tries on it.

## Checklist

- [ ] Style references uploaded, URLs pasted into the prompts
- [ ] Image 1, upscaled
- [ ] Image 2 (Midjourney editor), alignment checked
- [ ] Image 4, upscaled
- [ ] Image 5 (Midjourney editor), alignment checked
- [ ] Image 3 (if time)
- [ ] Edit: zooms, two crossfades, figures, captions, labels, end card

## If a Midjourney edit won't behave

Free option: the Gemini app (Nano Banana Pro has a small free daily allowance, which
changes over time) is good at "keep everything, change only this" edits. Attach the
image and describe the change, ending with "keep exactly the same camera, composition
and buildings". Only use it if the Midjourney editor fails.
