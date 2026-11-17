# disney-iger: revamp notes (brick-cinematic)

## Set-dressing variety pass (2026-11-16, after the voice swap)
- New project-local prop library **`assets/props-kit.js`** (`PROPS.setup(ctx, K, X)`), loaded in index.html after ldraw-kit.js.
  Everything is built from real LDraw parts at true minifig scale (0.0175 m/LDU: 3001 3003 3004 3005 3010 3023 3024 3039 3040
  3062b 3941 4073 3068b 3069b 3070b 98138) plus shared cached boxes/cylinders/cones in glossy ABS (`K.plastic`) or metallic
  silver. No Math.random. `PK.bake(set)` merges each set's static prop meshes into InstancedMeshes (one per geometry + material,
  `frustumCulled = false`); `PK.tick(t)` drives the live props (fan, coffee steam, fountain droplets, pigeons pecking, dog tail,
  globe spin, balloon sway); it runs after the shot code, so the visible set is always current.
- 40+ new assets: filingCabinet, globe (floor/desk), coatRack (trench coat + fedora), umbrellaStand, bookStack, penCup,
  framedPicture (sea/mountain/abstract/city/flowers/portrait/chart art), credenza, pitcher, glass, flagStand, serviceCart
  (coffee urn or bar cart), softbox, tvCart, waterCooler, teleprompter, floorCables, ceilingFan, corkBoard, copier, safe,
  pottedPalm, speakerStack, roadCase, cableSpool, stageLadder, barrel, hotdogCart, waterFountain, lanternPost, conifer,
  ticketBooth, dog, newspaperBox, recyclingBins, bicycle, trafficCone, hedge/planter, pigeons, taxi, van, scooter, ropeBarrier,
  securityDesk, pressCamera, vendingMachine, balloonBunch, ringLight, boomMic, coffeeMachine (steaming cup), counter, tileRug,
  armchair; minifig extras (`PK.extra`, static, matte like the cast) with caps and hand props (clipboard, cup, ice cream,
  newspaper, parcel, camera, phone).
- Per set (asset types only in that set marked *):
  - **STAGE:** speaker stacks*, road cases*, cable spool*, stage ladder*, barrels*, stagehand on headset with clipboard*.
  - **PARK:** brick fountain* (replaces the small flower bed), hot-dog cart* + capped vendor*, double-globe lanterns* at the
    bridge, ticket booth*, conifers*, dog walker + dog on a leash* (day only; hidden on the night recap); visitors now carry an
    ice cream, a camera and a cup. Background walkers use two lanes (z -4.6 / -5.45) so the lantern/booth band stays clear;
    the waving visitor moved to (2.45, -2.45) to make room for the cart.
  - **OFFICE:** filing cabinet* + desk globe*, umbrella stand*, coat rack* (hat in frame, coat off to the right), desk books,
    pen cup*, framed mountain print.
  - **BOARD:** credenza under the screen* (pitcher*, glasses*, books), coffee service cart*, flower planter, water glasses at
    every seat, draped indoor flag* (right of the screen, mostly out of frame).
  - **NEWS:** softbox*, rolling monitor cart*, water cooler*, floor cable runs*, teleprompter on the near camera*, floor
    manager with headset*.
  - **TRIAN:** ceiling fan*, cork board with pinned notes + string*, copier* (replaces the back-right plant), bar cart*, safe*,
    potted palm (left side, clear of the whiteboard), city print.
  - **STREET:** newspaper box* + reader*, scooter*, bicycle*, pigeons*, recycling bins*, traffic cones*, flower hedge planter,
    parked taxi* + van* at the far curb, courier with a parcel*.
  - **HALL:** security desk* + guard (SECURITY vest)*, rope barriers*, vending machine*, press camera on a tripod* +
    photographer* (all at the back, seen on "cast their votes"), balloon bunches by the screen*, flower planters at the stage.
  - **STUDIO (CTA):** coffee counter with steaming cup* + books, ring light*, podcast boom mic on the plinth*, teal tile rug*
    in the foreground, lounge armchair* (left edge); nothing crosses the phone, the URL/App Store plates or the host's face.
- Checked snapshots (`.hyperframes/snaps-props`, `.hyperframes/snaps-props2`): 0.8, 2.6, 7, 10.5, 14.2, 18, 22.5, 25, 31.5,
  37, 41, 47, 57.5, 61, 65, 69.5, 74, 78, 87, 91, 95.5, 99, 103, 107.5 s. Fixed on the way: palm fronds over "ONE SEAT", the
  stagehand competing with the hook, the ladder poking into the hook title, the coat rack blob behind Iger, the floor manager
  and cooler crowding the savings bars, the dog walker behind Iger on the night recap.
- Open: the board flag and studio armchair/coffee counter are mostly outside the tight framings (present in the set, barely on
  screen); the news softbox reads as a pale panel at the left edge; MP4 not rendered (orchestrator renders).

## Voice swap (2026-11-16, after round 5)
- Voice changed to `en-US-Chirp3-HD-Zubenelgenubi` at rate 1.32 (at 1.1 it ran 131.6 s; 1.32 gives voice 108.2 s, video 110.6 s). Script, scene and cues unchanged.
- voice-mix.wav regenerated (compressor + limiter 0.66 chain). Render: `renders/disney-iger-r6-zubenelgenubi.mp4`, -15.9 LUFS, true peak -1.9 dB, no gaps below -35 dB.
- Sadachbia r5 audio/timing files backed up in `_sadachbia-r5/` (restore them + script.json to go back).

## Round 5 (2026-11-16)

### What changed (council r4 findings)
- **Copy (facts unchanged; voice 108.01 s + 2.4 s = 110.41 s, rate 1.1):** "February 2020. Bob Iger hands Disney's CEO job to Bob
  Chapek." (no repeat of the hook); "In a proxy fight, headlines make noise. Share counts decide. / Win the biggest holders, and the
  challenger has nowhere to go. So it all comes down to one count."; CTA "…Practice that move with Deal Calm…".
- **Boardroom:** Chapek is no longer shown being removed (dramatization flagged by two seats); his spot-lit red CEO chair sits empty
  behind "CEO · CHAPEK" until Iger walks in and sits; the plate flips as he lands, then slides toward him on "switch". Lamp moved
  off the plate, plate widened so CHAPEK / IGER fit. Night grade: low ambient, warm pendants/lamps as key, cool rim.
- **Stage:** soft additive haze cone (fades at its edges and near the floor) on the CEO chair, amber glowing studs ring the
  turntable, darker curtain for hook-title contrast, CEO sign hidden under the "1" slam, Iger's crossed arms replaced (no clipping).
- **Peltz's office:** evening grade (-0.7 stop, lit skyline instead of white window glare), pendant + desk-lamp key, cool window
  fill, rim on the suit; trophy shelf, wall clock, steaming coffee cup; a different camera angle on each visit; Peltz no longer
  pokes the sign.
- **News studio:** camera raised so the desk front drops out of the bottom 40%; anchor framed left of centre with the screen.
- **Hall:** during the "3" slam the shot holds on the dimmed (blank) screen with the board low in frame (no text-on-text, no faces
  under the badge); standing extras that crossed the holders removed; stray grey bricks removed; wider "noise" shot; headline tiles
  burst from the screen ledge; result confetti from the table edges (headline stays clear).
- **Night castle:** recap pedestal faced with real running-bond tan bricks + yellow tile trim; darker grade, stronger cool moon
  rim; fireworks moved inside the frame; the blue support brick slides out and tumbles off (no one-frame pop), FIGHT falls with
  gravity immediately; dimmer break light.
- **CTA:** printed slim host (blazer + tie), seated in the hook's red CEO chair on the stand (story callback) and standing up on
  "Pull an Iger"; black cannon and floating confetti removed; app chat bubbles pop in after "Practice that move", START glows;
  push-in on "Deal Calm" that keeps the URL plate above the caption band; tactic bricks snap down with dust.
- **Details:** hands matte and slightly darker than the face print (no glow, closer skin match), name chips lowered off the CEO
  brick, label "$5.5B SAVINGS" (not "SAVED"), bigger DONE backing so CUT COSTS is fully covered.
- **Sound:** "fight ends" = boom + impact (thud dropped), job-cut tower = rumble (not woodblock), fillers for three pause gaps
  (incl. a low hit in the hook pause). Offline mix: **-15.1 LUFS, true peak -1.2 dBTP**, no 0.5 s window below -35 dB, no hiss.

### Open issues (r5)
- The per-chapter whooshes and the number-slam drums are generated by build.py (not editable here), so whooshes exceed 6 uses
  and the move-1/2 slams remain the loudest windows (-10.5 dB vs about -11.8 dB elsewhere).
- The end title appears only in the 2.4 s end hold (build.py timing). Name-chip subtitle size is fixed by the stage CSS.
- CTA uses a generic host (endorsement concern from round 3) with the red CEO chair as the Iger callback.

## Round 4 (2026-11-16)

### What changed (council r3 findings)
- **Boardroom continuity (all seats' high):** the real Chapek minifig (brown hair, glasses, grey suit, red tie) now sits in a red
  CEO chair behind "CEO · CHAPEK"; on "Chapek is out" he stands and walks off frame right; Iger walks in, sits, and only then the
  plate flips to "CEO · IGER". The board gets a fifth seat; the former glasses/green-tie member is now curly auburn hair, no
  glasses, purple tie. No board member mimes a phone anymore.
- **Copy (facts unchanged; voice 106.16 s + 2.4 s = 108.56 s, rate 1.1):** hook "He picked his successor. Under three years later,
  he was back in the chair."; stakes "Then an activist came for a seat on the board. Three moves kept the board in control." (no
  spoiler, no ambiguous "he"); "Less than a year after that, on Sunday, November 20, 2022, the board makes its move."; "Pushing out
  a CEO is a gamble, unless the replacement has done the job before. Iger had."; "It does something stranger: it delivers it.";
  one-line recap "Three moves: a replacement waiting, an argument removed, the big holders won over."; CTA "Someone coming for
  your seat? Pull an Iger: leave them nothing to fight about. Practice it with Deal Calm, on the App Store and at deal calm dot com."
  Small pads for length: "his hand-picked successor", "waiting in the wings", "Peltz comes back for another round".
- **CTA:** the real Iger minifig is removed from the CTA set (endorsement risk); a generic DealCalm host minifig (teal sweater)
  presents; tactic stack moved left of the phone, everything inside the side margins; confetti cannon on the right fires back
  and up (never across the URL plate); START button lights on "Practice it"; window behind the end title dimmed.
- **Fireworks:** rebuilt as sprays of glowing translucent 1x1 round plates (LDraw 6141) with radial + gravity motion and a
  shrink-fade; flash lights are small, warm and local (the lime full-frame wash is gone); the FIGHT break gets its own small warm light.
- **Night castle:** warm glow + light behind the portcullis, lamp pools, cool back rim on Iger, taller studded grey recap pedestal
  with brass trim and a top spot (no plain black slab); "THEIR REASON" text removed from the pulled brick (no caption echo).
- **News studio:** desk-front NEWS plate removed (no caption collision; small NEWS brick on the desk top), anchor framed at ~30%
  with the screen beside her, job-cut / savings labels on posts above the stacks (out of the caption band), chips are real
  bricks/plates (no flat shards).
- **Peltz:** no hand at the chin on his entrance; move two uses a new angle of his office (window + bookshelf wall); cool back rim
  and lighter floor so the black suit separates; in the hall he stands alone by his red stack and walks into the yellow wall
  and recoils on "can't break through" (no back-to-camera turn).
- **Hall:** narrower vote screen fully in frame for the result; screen dimmed during the "3" slam; back wall gaps closed with a
  backdrop and real doors (no beige panel); ballot paddles in hand for the whole vote shot; crowd uses slim sleeved outfits.
- **Hook / stage:** chair spin starts at 0.3 s (Iger in the chair by 1.0 s); hanging sign lowered and hidden behind the hook title.
- **Castle day:** handoff starts on "February" and ends on "Bob Chapek"; popcorn stand, balloon cart, carousel, flower bed and a
  foreground lamp post pulled into frame; guests moved into the shot. Office mug moved clear of Iger's hand; steam translucent.
- **Sound:** boing → pop, slide-whistle → creak, squeaks → latch/clunk; "dot com" = clunk + a soft rumble tail under the end card;
  fewer stacked cues; tom 5 uses; cheer and "fight ends" raised; sfx bed 0.46 and voice limiter 0.66.
  Offline mix: **-15.2 LUFS, true peak -1.2 dBTP**, no 0.5 s window below -35 dB, no hissy bed window.

### Open issues (r4)
- Slam drums/whooshes come from build.py, so the move-two slam is still the loudest 0.5 s window (-10.1 dB vs about -11 dB at the climax).
- Slam overlays have a fixed HUD position; faces are framed clear where possible.
- Brief asked for the protagonist minifig in the CTA set; the council flagged it as an endorsement risk, so a generic host is used.

## Round 3 (2026-11-16)

### What changed (council r2 findings)
- **Copy (facts unchanged; voice 106.29 s + 2.4 s hold = 108.69 s, rate 1.1):** dropped "Weeks later" ("Then, in January 2023, a new
  threat arrives…"); stakes "Then an activist came for a seat on the board. Disney made three moves. He never got it." (paid off by
  "…and reject Peltz. He never gets his seat."); move one in plain words ("keep a proven replacement waiting" / "Replacing a CEO is
  risky…" / "But this replacement was no stranger"); de-duplicated move two ("February 2023. Disney doesn't fight the demand. It
  delivers it." / "Peltz demanded cuts. Disney made them. His argument is gone."); recap shortened to "Three moves. One: a
  replacement waiting. Two: their argument removed. Three: big holders won over." Hook title: "Picked his heir." / "CEO again."
  Slam 1 and the move bricks now read REPLACEMENT. Iger chip: "BOB IGER / outgoing CEO" (Chapek chip "new CEO" kept).
  CTA captions re-chunked in the DOM so "App Store" is never split ("on the App Store" / "and at" / "dealcalm.com").
- **Stage:** curtain rebuilt from columns of stacked 1x1 round bricks (studs at every joint); floor = staggered 1x4/1x6 tiles with
  gaps; hard-edged light-shaft cones removed (real spotlights only, lower intensity); CEO chair on a studded 2x2 round plate +
  round-brick column; chairs on studded round-brick legs in seat colour; smaller turntable studs; stakes bricks land on a studded
  crate (clear of the caption band); move-one framing keeps faces under the slam word; the scene cuts to the stage/hall 0.15 s
  before each slam so a badge never crosses a cut; "risky" rocks the empty chair, heads turn in sequence on "nobody".
- **Castle:** Iger hands Chapek a CEO brick on "hands the CEO job"; extra guests at the stands; park signs on brick posts.
  Night: lamps dimmed, a neutral key on Iger from camera-left, dark blue haze that drops the towers into shadow, 3x larger
  glowing brick fireworks bursting above the curtain wall with flash lights, the FIGHT brick breaks into real LDraw parts.
- **Boardroom:** wall screen snaps on from STANDBY to SUNDAY, a folder slides across, the CEO nameplate sits at the empty seat
  of the member who stands up, above the caption band; the grey-haired board member is now dark-haired; the TV Chapek icon has hair.
- **News studio:** brick-built desk (white 1x4 courses, tile top, glow studs), monitor bank, ON AIR sign, lower lighting truss
  with fresnels, third studio camera, anchor framed left with the screen beside her; the screen reveals DEMAND → DELIVERED →
  ~7,000 JOB CUTS → $5.5B SAVINGS; stacks are real LDraw 1x2 bricks (studs stay on the falling bricks), chips bounce on impact,
  large readable labels.
- **Activist office:** Peltz plants the PROXY FIGHT sign on "Nelson Peltz" and steps forward on "Trian"; no strike-through; DONE
  drops on "Disney made them"; the sign breaks into white/red LDraw tiles and plates that settle; the placard topples sideways and
  bounces (panel stays visible).
- **Street:** briefcase handle seated in the C-hand grip.
- **Hall:** vote screen live from "Move number three" (VOTING OPEN, bars counting up, no numbers) to RESULT; Iger moved off the
  centre seat (the "3" slam no longer hides him); confetti fires from the lower stage corners (headline stays clear); headline
  tiles flutter down on "headlines"; ballot paddles rise in a front-to-back wave on "April 3"; stage-side key + back rim.
- **CTA:** Iger between the phone and the tactic tower, hands never over the wordmark; one burst from a brick confetti cannon on
  "pull an Iger" that settles on the plinth; layered studded plinth, brick bezels; gentle push-in on "Practice it".
- **Materials:** hands share the head's skin material (no orange hands on brown skin), face clearcoat removed (no wet streaks).
- **Sound:** toggles at "cost savings" / "shareholder vote" swapped for latch / clunk; "dot com" = clunk + impact tail + soft rumble
  under the end card (whoosh-cinematic removed); fillers in three pause gaps; cheer raised; fight-ends boom +3 dB; sfx bed
  volume 0.52. Offline mix: **-15.4 LUFS, true peak -1.0 dBTP**, no 0.5 s window below -35 dB, no hissy bed window.

### Sets (r3 voice timings, seconds)
| Set | Times |
|---|---|
| STAGE (hook, stakes, move one / "?" / replacement) | 0–7.04, ~26.0–37.32 |
| PARK day (handoff) | 7.04–11.00 |
| OFFICE | 11.00–14.84 |
| BOARD Sunday night | 14.84–~26.0 |
| NEWS (proxy fight; restructuring + cuts) | 37.32–41.46, 53.42–62.68 |
| TRIAN | 41.46–53.42, 62.68–69.02 |
| STREET | 69.02–~73.55 |
| HALL | ~73.55–91.68 |
| PARK night (recap + takeaway) | 91.68–99.80 |
| STUDIO (CTA) | 99.80–108.69 |

### CTA (final spoken line)
"Someone coming for your seat? Pull an Iger: take their argument away first. Practice it with Deal Calm, on the App Store and at deal calm dot com."

### Open issues (r3)
- Automatic chapter whooshes and slam drums come from build.py (not editable here); the move-two slam is still the loudest 0.5 s window.
- The move slams are fixed HUD overlays (y ~400–940); framing keeps hero faces outside them but non-hero board faces can pass under.
- No TT-style objective banners (HUD is generated by build.py). No music (HeyGen sign-in).

## Round 2 (2026-11-16)

### What changed (council r1 findings)
- **Script (copy rewrites, facts unchanged, rate 1.1, voice 106.93 s + 2.4 s hold = 109.33 s):**
  - Stakes: "Then an activist came for a seat on that board. Three moves. Zero seats lost." (fixes the logic error: the three
    moves are the board's moves, not all aimed at Peltz). "Zero seats lost" is paid off after the vote (whole board re-elected).
  - Cut the filler "After that, Chapek runs the company without him" and the double recap ("A Sunday comeback…").
  - "Then, on Sunday, November 20, 2022, Disney's board makes its move. It announces that Chapek is out, and Iger is returning as CEO."
  - "He had been Disney's CEO before" (supported by "returning as CEO") replaces "He had run Disney before".
  - "Weeks later, in January 2023, a new threat…"; "An activist needs a demand the company refuses. No refusal, no rally.";
    "February 2023. Disney beats him to it. A restructuring, with about seven thousand job cuts and 5.5 billion dollars in cost savings.";
    "And Peltz drops the fight. Case closed? Not quite. In 2024, he comes back."
  - Recap tightened to "One / Two / Three" lines; CTA is now one breath (27 words).
- **Hook title:** "Picked his heir." / "Back by 2022." (two lines; the board brought him back, so no "took it back").
- **HUD tags:** dropped the tags that duplicated set text (FEB 2020, SUNDAY NOV 20, the second Peltz tag); the news wall bands carry
  "JAN 2023 · PROXY FIGHT" / "FEB 2023 · RESTRUCTURING"; only "APRIL 3, 2024" remains as a tag. One Peltz name chip.
- **Seated minifigs:** every LDraw leg gets a leg-coloured sole cap (no more hollow red-lit leg boxes); `sitLift` 0.155 puts the
  thigh underside exactly on the seat top; all chairs rebuilt wider than the minifig hips (0.84 m seat, chrome round-brick legs)
  so the seat reads under the figure (stage bench, boardroom, hall board, audience); exec chairs widened.
- **Stud scale:** fixed oversize `K.studField` calls that ran past their platforms (news riser = the "giant foreground studs",
  stage bench, flower beds); surfaces near figures use real-scale studs (`studs2`, LDraw 20 LDU pitch); figures on the CTA plinth
  stand on smooth tiles.
- **Lighting:** bloom threshold 2.3 (only lamps/screens bloom), rims about 30% lower, stage spotlights lower, white hair darkened;
  castle day: 0.5 stop down, low side sun, saturated sky, closer brick clouds, darker paving; boardroom is now genuinely night
  (dark facades with lit windows, warm pendants as key, laptop glow, no ceiling strip).
- **Sets:** stage dressed (truss towers, light shafts, side flats with sconces, podium with mic, crates, sign flips CEO ⇄ "?");
  castle rebuilt (towers from real brick courses, studded merlons, arched lit windows, bunting with bulbs, popcorn stand,
  carousel, foreground visitors); news studio (smaller centred wall, animated ticker, anchor gestures + push-in, second crew
  member); activist office (floor-standing PROXY FIGHT placard instead of a hand-held flag through his head, filing cabinet,
  chart); street (traffic light, hydrant, trash can, mailbox, facade ledges/pilasters, proper briefcase); hall (aisle carpet,
  aisle mics, ballot box). Plants are brick bushes (1x1 round plant elements) instead of faceted slopes.
- **Story beats/FX:** label bricks land beside the action, never over faces; brick dust is a short ring of translucent flat
  round plates from the base (no opaque white totems); mug steam is translucent; 7,000 cuts = bricks knocked off a stack
  (removal, not growth); CUT COSTS gets a red strike tile, then a DONE stamp drops with a squash on a white backing, then the
  sign breaks and the easel topples, debris stays until the cut; recap + takeaway moved to the castle at night with brick
  rockets (glowing round-plate trails) bursting above the curtain wall; CTA confetti spawns behind the phone (never over the
  URL/App Store plates).
- **Sound:** no bells (hiss flags) — chime/clunk instead; rewind removed (hissy); cheer raised for the climax; gap fillers at
  "case closed" and in the recap; the end card has a low whoosh/rumble tail. Offline mix (voice-mix + bed × 0.55):
  **-15.5 LUFS, true peak -1.5 dBTP**, no 0.5 s window below -35 dB, no hissy bed window.
- voice-mix.wav regenerated from the new voice.wav (same ffmpeg chain as r1).

### Sets (r2 voice timings, seconds)
| Set | Times |
|---|---|
| STAGE dressed theatre stage: CEO chair spin (hook), board bench + Peltz walk-on + three move bricks (stakes), move one / "?" sign / Iger returns | 0–8.58, 26.94–37.02 |
| PARK castle theme park by day (Feb 2020 handover) | 8.58–12.70 |
| OFFICE executive chairman office, calendar 2020 → 2021 | 12.70–16.48 |
| BOARD boardroom, Sunday night (announcement, CEO plate flip) | 16.48–26.94 |
| NEWS TV news studio (JAN 2023 proxy fight; FEB 2023 restructuring, cuts knocked off, savings stack) | 37.02–41.74, 53.26–61.10 |
| TRIAN activist office (Peltz, PROXY FIGHT placard, move two, CUT COSTS → strike → DONE → breaks) | 41.74–53.26, 61.10–67.52 |
| STREET dusk 2024, SHAREHOLDER VOTE marquee | 67.52–72.08 |
| HALL shareholder meeting: move three, share stacks, vote, result | 72.08–89.58 |
| PARK castle by night: recap bricks + brick fireworks, takeaway (FIGHT brick breaks) | 89.58–99.78 |
| STUDIO DealCalm CTA (brick phone app, dealcalm.com + App Store plates, Iger + tactic bricks) | 99.78–109.33 |

### CTA (final spoken line, 27 words)
"Someone coming for your seat? Pull an Iger: take their argument first. Practice it with Deal Calm, on the App Store and at deal calm dot com."
End card: "DealCalm" / "App Store · dealcalm.com".

### Verification (r2)
- `tools/build.py`: no warnings; 109.33 s (voice 106.932 s). `hyperframes check --json`: ok true.
- Snapshots inspected (several passes, all sets, all moves, CTA): 0.5, 2.6, 6.2/6.4, 10.5, 14, 15.8, 18.5, 22.8, 26, 28.5, 32,
  34.5, 36, 39.5, 40.5, 41, 44, 47.5, 51, 55, 57.6, 58, 59.5, 60.8, 62.6/62.8, 66.5/66.8, 70.8, 71.6, 73, 77, 80, 83/83.5, 87,
  91.4, 92, 96, 99, 102, 108.

### Open issues (r2)
- The automatic section whooshes (build.py, one per chapter, rotating whoosh/swoosh/swish) still exceed 6 uses each; this is
  engine behaviour (count=False) and cannot be changed from the project. Chapters were cut from 33 to 28.
- The 1.25 s move slams (HUD, fixed position y 400–940) still pass over faces for that moment (move three over the board row).
- Loudest 0.5 s window is still slam 2 (-9.8 dB) vs the vote climax (-10.0 dB); the slam level is set by build.py.
- The castle-at-night recap reads as warm evening (lamp-lit walls) more than deep night.
- CTA uses the Iger minifig with the tactic bricks per the brief (a seat suggested a generic host to avoid an endorsement read).
- No music (needs HeyGen sign-in).

## Round 1 (2026-11-16)

### What changed
- **Script** rewritten for ~110 s (voice 106.07 s at rate 1.13 + 2.4 s end hold = 108.47 s), voice `en-US-Chirp3-HD-Sadachbia`.
  - Hook (12 words, spoken 0.05–2.75 s): "He picked his successor. Less than three years later, he was back." Stakes right after:
    "Then an activist investor came for Disney's board. Three moves shut him out."
  - Story: Feb 2020 Iger names Chapek → exec chairman until end of 2021 → Sunday Nov 20, 2022 board announcement →
    "Move number one / two / three" (known alternative, take away their argument, win the big shareholders) →
    Jan 2023 Peltz/Trian proxy fight → Feb 2023 restructuring (about seven thousand job cuts, 5.5 billion dollars savings) →
    Peltz drops the fight → comes back in 2024 → April 3, 2024 vote: whole board back in, Peltz rejected → recap → takeaway → CTA.
  - Numbers are spelled so the whisper transcript matches the script (no word-count warning).
- **cues.json**: subtitle captions (3 words / 20 chars), 33 chapters (≤ ~5 s apart), 3 move slams (1 ALTERNATIVE, 2 NO ARGUMENT,
  3 BIG HOLDERS), 4 HUD tags (FEB 2020 · NEW CEO, SUNDAY · NOV 20, 2022, NELSON PELTZ · TRIAN, APRIL 3, 2024 · VOTE), payoff
  "reject peltz", 26 story sfx (no sound over 6 uses incl. automatic slam toms; no hiss/glitch/sparkle/keypress/click), end card
  "DealCalm / App Store · dealcalm.com".
- **scene.js**: full rewrite for brick-cinematic (K.mfig LDraw minifigs, per-shot `look`, X.sky + X.skyEnv, brick skylines
  behind windows, practical lamps, brick trees / lamp posts / cars, brick clouds, brick-water moat, brick steam puffs, brick
  dust puffs, glowing brick fireworks, brick confetti, X.debris bursts). Caption DOM shows "DealCalm" / "dealcalm.com".

### Sets (r1 voice timings, seconds)
| Set | Times |
|---|---|
| STAGE theatre stage, CEO chair on riser (hook chair-spin, stakes brick wall, move one, recap, takeaway) | 0–7.1, 26.4–36.2, 87.4–98.9 |
| PARK castle-themed theme park, golden hour / dusk fireworks (generic brick castle, moat of brick water, no logos) | 7.1–12.0, 15.1–17.5, 84.1–87.4 |
| OFFICE executive corner office, EXEC CHAIRMAN plate, calendar 2020 → 2021 | 12.0–15.1 |
| BOARD boardroom on Sunday night, announcement screen, CEO plate flips CHAPEK → IGER | 17.5–26.4 |
| NEWS TV news studio: proxy-fight wall, restructuring wall, brick bar stacks | 36.2–41.2, 50.6–58.9 |
| TRIAN activist's office: PROXY FIGHT placard, one-seat whiteboard, CUT COSTS sign → DONE → breaks into bricks | 41.2–50.6, 58.9–63.3 |
| STREET dusk city street 2024, SHAREHOLDER VOTE marquee | 63.3–68.1 |
| HALL shareholder meeting hall: voting screen, share-brick stacks, audience paddles, confetti | 68.1–84.1 |
| STUDIO DealCalm studio: giant brick phone app, dealcalm.com + App Store signs, Iger | 98.9–108.5 |

### CTA (final spoken line)
"So when someone comes for your seat, pull an Iger and take their argument away. Sharpen that skill with Deal Calm, on the App
Store and at deal calm dot com."

### Facts left out / hedged
- No private scenes or quotes: the chair spin, the brick wall and the stacks are visual metaphors. No handshake. No number of
  board seats, no vote percentages (the voting screen shows bars without numbers, only that the board beat Peltz).
- "pull an Iger" credits the restructuring to Disney under CEO Iger (the sheet says "Disney announced"); kept as a callback, not a claim.

### Audio
- The voice now plays `assets/voice/voice-mix.wav`, a compressed and limited copy of voice.wav (-18.7 LUFS mono, peak -2.2 dBFS).
  The sfx bed is at 0.55 (it was 0.9). An offline ffmpeg mix of the two stems (voice dual-mono + bed) measures **-15.5 LUFS, true peak -1.2 dBTP**.
  The old default mix measured about +3 dBTP, which clips.
- If the script changes, regenerate voice-mix.wav or the old take will play:
  `ffmpeg -y -i assets/voice/voice.wav -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=90:makeup=5dB,volume=2.9dB,alimiter=limit=0.75:attack=2:release=40:level=false" -ar 24000 assets/voice/voice-mix.wav`

### Verification (r1)
- `tools/build.py`: no warnings. Length 108.47 s (voice 106.069 s).
- `hyperframes check --json`: ok true. runtime, craft and audio have 0 errors. Lint has 4 warnings, layout 4 and contrast 1; none are errors.
- I looked at snapshots at 0.6, 2.4, 5.8/6.4, 9.5, 13.5, 16.3, 19, 22.5, 25.5, 26.9, 28.8, 31, 34.8, 39.5, 42.5, 45, 48, 52, 57, 60.5,
  61.8, 62.8, 64.5, 66, 67, 68.6, 72.5, 76.9, 79.5, 80.8, 81, 82.8, 83, 85.6, 88.5, 91, 92, 95, 97.5, 97.9, 98.6, 101, 104 and 107.5 s.
  Fixed after the first pass:
  - too-wide staging that cut figures at the frame edges;
  - a camera inside a street tree;
  - hall cameras outside the back wall (the hall is now deeper);
  - over-tall share stacks;
  - Peltz looking away from the camera;
  - the placard covering his face;
  - overexposed spotlit faces;
  - the news wall text cut off;
  - fireworks above the frame.

### Open issues
- No music (needs HeyGen sign-in).
- Faces under the stage spotlights still read a little pale. The skin is matte light flesh, but the warm key is strong.
- In the 57 s cuts shot, the anchor sits at the left edge. The savings stack builds after the jobs stack (on "in cost savings").
- In the "headlines make noise" shot (~72 s), the gold share stacks start short (3 bricks) beside the holders. They grow to 8 on "share counts decide".
- The section whooshes (one per chapter) and the slam toms are automatic, added by build.py.
- The caption spelling "DealCalm" / "dealcalm.com" is patched in the caption DOM from scene.js. The TTS still says "Deal Calm".
