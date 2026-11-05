# Tourism-to-Housing: full prompt pack (Degentrify cut)

> The ETHGlobal video uses the simple version: `2026-11-06-video-prompts-v2.md`. This full
> version (Flow, character sheet, storyboard, 7 scenes) is kept for the Degentrify cut.

Replaces `2026-11-05-video-prompts.md`. Written 5 Nov 2026 for "Video script v2"
in `2026-11-05-demo-script.md`. Look and colour logic: `2026-11-05-visual-direction.md`.

## The look in one paragraph

The Meld film (Dayvan Studios × Komma Systems): handcrafted papercraft dioramas,
layered cut paper and cardboard, characters with softly painted paper faces,
warm golden light, miniature depth of field. **Colour is the argument.** The world
we want is full, warm colour. The problem drains to grey cardboard. Glowing red and
blue paper threads appear in the grey and braid with yellow into a red, blue and
yellow rope, and where the rope knots, colour comes back.

## Style references (use on every Midjourney prompt)

Stills from the Meld film, subtitles cropped off, in
`../../video-assets/meld-sref/`:

| File | Use it for |
|---|---|
| `01-colour-river-path-clean.png` | the warm colour world (main reference) |
| `06-colour-future-playground-clean.png` | warm colour, wider set, foliage |
| `02-colour-draining-clean.png` | the colour draining moment |
| `08-grey-meeting-clean.png` | the grey world |
| `03-red-blue-threads-clean.png` | glowing threads in a grey room |
| `04-braid-on-grey-clean.png` | threads knotting, light |
| `05-braid-map-colour-clean.png` | the braided rope on a paper model |

Upload them to Midjourney once and add them as style references (`--sref` with
their image URLs). Use 2 or 3 per prompt: always 01, plus the one that matches the
scene's mood. Start at `--sw 200` (style weight) and lower it if the scene copies
the Meld composition too literally.

Notes on parameters: I have not checked which Midjourney model version your account
defaults to. `--ar 16:9` works on all of them. On V7 the character reference is
Omni Reference (`--oref <url> --ow 100`); if your version differs, use whatever its
character-reference feature is called. Leave out `--style raw`: the Meld look is
stylised and raw mode tends to flatten it.

## Ajay (the character)

Ajay, an Indian man around 28, short black hair, light stubble, warm smile, yellow
paper raincoat (Komma's yellow: the person making the choice), dark trousers, small
backpack. Painted paper face in the Meld style, same proportions as the Meld
figures (slightly large head, simple features).

---

## Step 1: Nano Banana Pro, character sheet

Attach `01-colour-river-path-clean.png` and `06-colour-future-playground-clean.png`.

> Using the attached images as the visual style, create a character turnaround sheet
> for a papercraft stop-motion figure named Ajay: an Indian man around 28, short
> black hair, light stubble, warm smile, wearing a yellow paper raincoat, dark
> trousers and a small backpack. Same construction as the figures in the reference:
> cut paper and cardboard body, softly painted paper face, visible paper grain and
> folded edges. Show front, three-quarter, side and back views plus three
> expressions (curious, thoughtful, smiling), on a plain warm off-white paper
> background, even soft studio light. No text.

Pick the best result. Use its front view as Ajay's character reference in
Midjourney (`--oref`) and attach it in every later Nano Banana edit.

## Step 2: Nano Banana Pro, rough storyboard (cheap check before spending credits)

Attach the character sheet and `01-colour-river-path-clean.png`.

> Create a rough storyboard of 8 numbered panels in a 4 by 2 grid, 16:9 panels, in
> the papercraft style of the attached image, featuring the attached character
> (Ajay, yellow raincoat):
> 1. A warm, colourful paper Barcelona street with balconies, plants and neighbours.
> 2. Ajay in a small paper room in Mumbai at night, phone glowing, two paper paths
>    forking out of the phone, one plain grey, one a braided red, blue and yellow thread.
> 3. The same Barcelona street turned grey: flats lifting out of the building as
>    suitcases, residents carrying boxes away, blank banners on balconies.
> 4. A grey paper city with a glowing braided red, blue and yellow thread running
>    along the street to a timber cooperative building, colour returning around it.
> 5. Ajay at a long table in a sunny courtyard with residents, sharing food.
> 6. An empty grey plot with the end of the braided thread lying on it.
> 7. The same plot with a small paper house unfolded upward, warm light in the
>    windows, colour spreading.
> 8. A paper map of the Mediterranean with braided threads running from Barcelona
>    to Lisbon, Venice, Mykonos and Mallorca.
> Simple, loose and readable. Panel numbers only, no other text.

Use the boards to check the flow against the script before generating finals.

## Step 3: Midjourney, final stills

Append to every prompt (fill in the URLs):
`--ar 16:9 --sref <01 url> <mood url> --sw 200 --oref <ajay url> --ow 100`
(leave out `--oref` on shots without Ajay).

Shared style text, already included in each prompt below: *handcrafted papercraft
diorama, layered cut paper and cardboard, softly painted paper faces, visible paper
grain and folded edges, miniature tilt-shift depth of field, stop-motion film still*

### P1, Beat 0 hook: Barcelona in colour (mood ref: 06)
> A Barcelona Eixample street corner as a handcrafted papercraft diorama: cream paper
> apartment buildings with wrought-iron balconies, potted geraniums, laundry lines,
> green shutters, neighbours chatting on balconies, an old man with a bread loaf, a
> child on a scooter, warm late-afternoon golden light, layered cut paper and
> cardboard, softly painted paper faces, visible paper grain and folded edges,
> miniature tilt-shift depth of field, stop-motion film still, calm open sky in the
> upper left third

(Empty sky leaves room for the rent and wage figures added in the edit.)

### P2, Beat 2: the choice in Mumbai (mood ref: 03)
> Ajay in a yellow paper raincoat sitting on a bed in a small papercraft room in
> Mumbai at night, monsoon rain on the window, paper Mumbai skyline outside, holding
> a glowing phone, two paper paths unfolding out of the phone across the floor and
> forking: one a plain grey paper path, one a glowing braided red, blue and yellow
> thread, handcrafted papercraft diorama, layered cut paper and cardboard, softly
> painted paper face, warm lamp light against blue night, miniature tilt-shift depth
> of field, stop-motion film still

### P3, Beat 2: the usual way, colour drained
**Make this one in Nano Banana Pro as an edit of P1**, so the composition matches
exactly and Flow can move from one to the other. Attach the chosen P1 image:

> Edit this image. Keep the exact same camera, composition and buildings. Drain the
> colour so the whole scene becomes grey cardboard and dim cool light, like the
> attached reference (attach `02-colour-draining-clean.png`). Make several flats lift
> out of the building facades and fold into small paper suitcases with luggage tags.
> Turn the neighbours into grey residents carrying cardboard boxes away down the
> street. Hang hand-painted cloth banners from two balconies reading
> "TOURISTS GO HOME". Remove the scooter child. No other text.

(Nano Banana handles lettering; check the spelling before using it.)

### P4, Beat 3: the thread finds the co-op (mood refs: 04, 08)
> A grey cardboard city street at dusk as a papercraft diorama, a glowing braided
> rope of red, blue and yellow paper threads winding along the pavement and knotting
> around a small modern timber cooperative housing building with planted balconies,
> warm light in its windows, colour blooming outward from the building onto the
> grey street around it, handcrafted papercraft diorama, layered cut paper and
> cardboard, miniature tilt-shift depth of field, stop-motion film still

### P5, Beat 3: welcomed (mood ref: 01)
> Ajay in a yellow paper raincoat sitting at a long wooden table in the sunny
> courtyard of a timber cooperative housing building, residents of all ages sharing
> a big pan of paella and bread with him, plants climbing the balconies above,
> bunting of red, blue and yellow paper, warm golden light, handcrafted papercraft
> diorama, layered cut paper and cardboard, softly painted paper faces, miniature
> tilt-shift depth of field, stop-motion film still

### P6a, Beat 5: empty plot (start frame) (mood refs: 08, 04)
> An empty grey cardboard building plot between two grey paper apartment blocks, the
> loose end of a glowing braided red, blue and yellow paper rope lying on the ground
> in the middle of the plot, soft cool light, handcrafted papercraft diorama,
> miniature tilt-shift depth of field, stop-motion film still

### P6b, Beat 5: the house has risen (end frame)
**Make in Nano Banana Pro as an edit of P6a:**

> Edit this image. Keep the exact same camera and the two side buildings. In the
> plot, a small paper cooperative house has unfolded upward from the ground, the
> braided red, blue and yellow rope tied around its base in a firm knot, warm light
> in every window, a small paper card with three hand-cut gold stars leaning by the
> door. Colour spreads from the house onto the street and the side buildings, warm
> golden light, as in the attached reference (attach `01-colour-river-path-clean.png`).

### P7, Beat 6: the map (mood ref: 05)
> A paper map of the Mediterranean on a cardboard table as a papercraft diorama, small
> folded paper city markers at Barcelona, Lisbon, Venice, Mykonos and Mallorca, glowing
> braided red, blue and yellow paper threads reaching out from Barcelona to each
> marker, tiny paper houses rising at each city, warm light from one side,
> handcrafted papercraft diorama, miniature tilt-shift depth of field, stop-motion
> film still, no text

(City names go in the edit as captions; Midjourney garbles lettering.)

---

## Step 4: Flow, animation

I don't know the specific controls in Flow's current model ("Omni 1.1"), so these are
plain-language motion prompts that should work with any image-to-video tool. Where
Flow lets you give a **first and last frame**, use the pairs marked below; that is
the cleanest way to get the colour-draining and house-rising moves.

Keep every clip **4 to 8 seconds**, slow, with small stop-motion movements. Avoid big
camera moves; they break the paper illusion.

| Clip | Input | Motion prompt |
|---|---|---|
| C1 | P1 | Slow gentle push-in on the street. Laundry sways, a neighbour waves from a balcony, the child scoots past. Subtle stop-motion movement, warm light flickers softly. |
| C2 | P2 | Rain runs down the window. The two paper paths slowly unfold from the phone across the floor and fork. Ajay looks down at them. Very slight camera drift. |
| C3 | **first P1, last P3** | The colour drains out of the street from the edges inward. Flats lift out of the facades and fold into suitcases, residents walk away carrying boxes, banners unroll from the balconies. Camera still. |
| C4 | P4 | The braided thread slides along the pavement and pulls tight into a knot around the building. Colour blooms outward from the building across the grey street. Slow push-in. |
| C5 | P5 | Steam rises from the paella, residents lean in and pass bread to Ajay, he laughs. Bunting moves in a light breeze. Camera still. |
| C6 | **first P6a, last P6b** | The rope tightens, a small paper house unfolds upward out of the plot fold by fold, the windows light up, colour spreads across the street, the star card brightens. Camera still. |
| C7 | P7 | Braided threads extend one by one from Barcelona to each city marker, a tiny paper house pops up at each. Slow overhead drift. |

The ETHGlobal cut uses no music; turn off any generated audio in the clips or mute
the clips in the edit.

## Step 5: the edit

- Figures and labels in the edit, set in Fraunces (the site's serif), white on the
  sky in C1: "Rent +40%", "Wages +4%", "after inflation, Barcelona, decade to 2023",
  then "Wages still buy less than in 2010".
- Captions on all narration, small, bottom centre (Meld style).
- Sponsor lower-thirds in the app sections: "EURC on Arc", "ENS name".
- End card in the Meld end-card style: warm off-white paper, small red letter-spaced
  label, italic serif line, braided red, blue and yellow stripe along the bottom
  (see `../../video-assets/meld-sref/07-end-card-website.png`).

## Priority if time runs short

1. C3 (P1 to P3, colour drains) and C6 (P6a to P6b, house rises): these carry the story.
2. C1 for the hook.
3. C4, C2, C7, C5.

The minimum video needs none of these: Clara on camera, the app recordings, and the
hook figures on a text card.

## Checklist

- [ ] Style references uploaded to Midjourney, URLs noted
- [ ] Ajay character sheet (Nano Banana), front view saved as `--oref`
- [ ] Storyboard grid checked against the script
- [ ] P1, P2, P4, P5, P6a, P7 in Midjourney
- [ ] P3 and P6b as Nano Banana edits; banner spelling checked
- [ ] C1 to C7 in Flow, audio off
- [ ] Figures, captions, lower-thirds and end card added in the edit
