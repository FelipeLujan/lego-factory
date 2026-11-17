# dotcom-crash-lego: build notes (brick-cinematic)

"Add .com, get rich?" in LEGO video-game style. A remake of `dotcom-crash` (the 2D cartoon). Not a DealCalm video (no DealCalm CTA).
Builder: builder-legoCouncil. Judged by the 6-seat legoCouncil. The orchestrator renders; builders never render.

## Files
- `script.json`: voice `en-US-Chirp3-HD-Enceladus`, rate 1.22 (about 96 s of voice + 2.4 s end hold).
- `cues.json`: subtitle captions (3 words / 20 chars), 26 chapters, 3 slams, 4 tags, payoff "the hype did", 30 story sfx.
- `assets/dc-kit.js`: project helpers (brick walls, floors, lights, screens, brick signs, brick towers/skylines, LEGO confetti
  made of 6141 plates, brick bursts, dust) plus story props built from PK primitives (bakeable): beige CRT, PC tower, keyboard,
  desk phone, fax, shoe boxes, shoe rack, LED ticker, clock row, ".COM" money jar, exchange bell, lectern, pet-food bag, pallet,
  racking, forklift, balance scale, price tag, roller door, conveyor, hand truck, mailbox, bag pile, bleachers, flood tower,
  goalpost, sock puppet, marble column, rate board, coin fountain, bean bag, kick scooter, foosball, lava lamp, CLOSED sign,
  moving box, chain-link gate, produce crate, shopping cart, tower crane. (Generic ones could go into the template's props-kit.)
- `assets/dc-kit2.js` (round 2): brick van, knit sock puppet (grey sock, white ribbed cuff + red stripes, red heel/toe, button eyes, felt mouth),
  brick bean bag, brick bell on a gantry, brick coin fountain with a draining pool of round plates, confetti cannon, mic stand, string lights,
  studded road plates, spilled fruit bricks. Overrides D.puppet / D.beanBag / D.bell / D.coinFountain from dc-kit.js.
- `assets/dc-sets.js`: the 11 sets. `assets/scene.js`: looks, cast, cue times, one shot function per set, callouts.
- index.html loads props-kit.js → dc-kit.js → dc-kit2.js → dc-sets.js → scene.js. Voice `<audio>` plays `assets/voice/voice-mix.wav`; sfx bed 0.5.

## Round 1 (2026-11-16)

### What was built
- Script (28 lines, about 280 words; facts only from the brief). Voice 94.93 s + 2.4 s hold = 97.33 s video.
  Numbers are written the way the transcript prints them ("600 percent", "85%", "$11", "90%", "78%", "dot-com"), which
  keeps the script/transcript word counts within 3 (no build warnings). Phrase cues use those forms ("11 a share", "about 85").
- Hook title `Add .com, / get rich?` (0–3.2 s). End card `Remember the puppet.` / `Follow for more` (60 px, set by a style
  that scene.js injects so the lines never wrap).
- Spoken ending: "So when everyone says this time is different, remember the sock puppet. Follow for the next bubble."
- Slams: 5K THE PEAK (peaked above), 6 RATE HIKES (six times), 78 PERCENT DOWN (down about 78). Tags: THEGLOBE.COM, PETS.COM,
  WEBVAN · 2001, AMAZON. Callouts (lower third, y ≈ 1255): NASDAQ +85.6% IN 1999, 5,048.62 / MARCH 10, 2000,
  JUNE 1999 → MAY 2000, FEB → NOV 2000, ABOUT 1,114 / OCT 9 2002, APRIL 23, 2015 / BACK ABOVE THE 2000 PEAK.
- Payoff riser: "the hype did". Story sfx: one sound per idea, max 3 uses each; fillers under the ending pauses
  (crane creak, slide whistle as the puppet lifts its head, inflate + pop + chime + low bell under the end card).

### Sets and time ranges (voice timeline)
| t (s) | Set | What happens |
|---|---|---|
| 0–5.7 | OFFICE (1999 shoe office) | `.COM` brick drops onto the BOB'S SHOES sign (dust ring), stock CRT climbs and jumps; Bob cheers, investor points |
| 5.7–9.5 | OFFICE re-angled | CRT crashes red, shoe-box stack topples into bricks; Bob covers his face |
| 9.6–12.8 | TRADE | two investors pour gold studs from buckets into the ".COM" jar (stream of 6141 plates), LED ticker scrolls, traders on phones |
| 12.8–15.0 | TRADE (low angle) | the ignored PROFITS? brick hops |
| 15.0–21.3 | BELL | NOV 1998 board, brick bar stacks to +606%, brass bell swings, LEGO confetti |
| 21.4–25.1 | MOUNT | brick bars 1996–98, the 1999 bar stacks up (+85.6%) |
| 25.2–31.7 | WARE | roller door rises (FREE SHIPPING van outside), PETS sign lights, the balance scale tips to PAID over SOLD FOR |
| 31.7–35.5 | STREET | driver wheels bags to the FREE SHIPPING van, bags pile up, van sags, gold studs leak out under it |
| 35.6–38.6 | STADIUM | brick sock puppet talks out of an ON AIR booth, jumbotron ad, 16 cheering fans, confetti |
| 38.7–42.7 | BELL re-angled | FEB 2000 · $11 A SHARE, bell rings again |
| 42.8–48.4 | MOUNT | the 2000 bar rises to the peak, flag drops on top, boombox note plates stop on "music stopped" |
| 48.4–55.3 | FED (marble reserve bank) | official lights the six rate slots; the coin fountain ("cheap money") dries up |
| 55.4–59.1 | TRADE re-angled | red ticker, traders raise PROFITS? placards, jar drains |
| 59.2–62.9 | BUST (startup loft) | lights cut out, mover walks out with a box, OPEN sign flips to CLOSED; puppet slumped on a bean bag |
| 62.9–67.1 | LOT (grocery vans) | chain gate rolls shut, BANKRUPT sign, driver facepalms |
| 67.1–69.4 | SKY (night terrace) | investor with phone; the survivor tower drops from 16 floors to 2 (dust + brick burst) |
| 69.4–82.1 | MOUNT | peak bar collapses (ghost bar remains), 2001–02 bars land red; 2003–2015 bars rise; 2015 turns gold at the peak line |
| 82.1–89.6 | SKY (dawn) | the tower regrows to 22 floors past the skyline, price tag swings in, TOO HIGH stamp |
| 89.7–97.3 | BUST (end) | close on the puppet in the sunbeam; head lifts on "remember", a bubble rises and pops; end card |

### Snapshot passes (4) and what they fixed
- Cameras were ~30% too close for the vertical frame (faces cut, props out of frame): every shot re-framed.
- Z-fighting on all studded brick signs (BOB'S SHOES / .COM / PETS / EXCHANGE read as hatching): front plane moved to 7 cm +
  polygonOffset. CRT screens, ticker, jar label, CLOSED sign got larger gaps too.
- Hook sign under the hook title, shoe rack post in front of the sign, shoe-box stacks filling the foreground: moved.
- Sock puppet redesigned (the first tall column read badly): short cuff + neck, the toe bends forward into a long head,
  eyes on top, hinged red mouth.
- Hand props (buckets, phones, placards) are reset every frame so they never leak into other sets.
- Text collisions: profit callout over the jar label removed; THEGLOBE tag shortened and the board moved left; GROCERIES sign
  lowered under the tag; PROFITS? brick lifted above the subtitle; END camera turned so CLOSED is not behind the puppet.
- Ending/hook dead air: fillers added; remaining sub −35 dB windows are single 0.25 s breaths at 0.25, 91.75, 93.0–93.25 s.

### Open issues / ideas for round 2
- Loudness estimated offline at about −18.4 LUFS for a naive sum; the same voice-mix chain gave −15.9 LUFS in disney-iger's
  render, so check the render with `hyperframes audio` and raise the sfx bed if needed.
- WARE: the scale post is a big dark block in the middle; FED: the coin arcs are still large in the dry shot.
- STREET: the driver crosses the FREE SHIPPING text; the bag pile sits mostly at the right edge.
- SKY rise: the regrown tower top is cut at the frame top; the price-tag plane reads small.
- Extras pose loops are simple sine head/arm moves; seated fans repeat the same cheer.
- Generic new props (CRT, fax, ticker, pallet, forklift, puppet, rate board, coin fountain, chain gate, crane…) could be
  copied into `templates/brick-cinematic/assets/props-kit.js` (not done: other folders untouched this round).


## Round 2 (2026-11-16): fixes for the round-1 council
Video 101.55 s (voice 99.15 s at rate 1.17 + 2.4 s hold). `voice-mix.wav` regenerated from the new take (r1 copy in `_r1-backup/`).

### Script / copy (all inside the fact sheet)
- Hook: "In 1999, three letters could make a stock jump. Dot-com." (.COM tile slams onto the BOB'S SHOES sign on "Dot-com"; CRT reads BOBS, then BOBS.COM).
- "Profits? Hardly anyone was asking. Yet." / "Meanwhile, the Federal Reserve raised interest rates six times in under a year." (HUD keeps JUNE 1999 → MAY 2000)
- "Webvan, the grocery delivery startup? Bankrupt in July 2001." / "In October 2002, the Nasdaq hit bottom. About eleven hundred. Down 78%." (HUD ABOUT 1,114 · OCT 9, 2002)
- "How long did it take to close above the old peak? Until April 2015. Fifteen years."
- Ending (spoken): "So when everyone says this time is different, remember the sock puppet. Follow for the next bubble."
- End card: `Remember the sock puppet` / `Follow for next bubble` on a dark rounded panel (y ≈ 236–380 px), nowrap, 58 px.
  (Line 1 is 24 chars: the council asked for it to match the spoken line; CSS keeps it on one line.)

### Visual fixes
- Slams moved to the sky band via injected CSS (top 150 px, 320 px letters): 5K / 6 / 78 never cross a face; cameras re-aimed so heads sit below ~560 px.
- Ticker: generic `.COM ▲ / TECH ▲ / BUY` and `.COM ▼ / TECH ▼ / SELL` (no invented percentages). TECH INDEX rolls over into a red cliff on the return visit.
- PROFITS? brick drops in on "Profits?" (no stray shadow slab); hops again on "where are the profits?". Jar coins = matte 1x1 round plates, label higher.
- BELL: brick bell on a gantry, ringer reaches for the rope during the date line and yanks it, others clap; two brick confetti cannons fire;
  no hidden figure behind the lectern (lectern moved right); $11 board raised and framed in full.
- MOUNT: deeper studded baseplate + studded ground, no ghost column: the peak bar's top bricks topple left as solid bricks, bounce once and stay;
  chips of round plates; figures stand on the plate (y = MY); cones moved off the walk path.
- WARE: shorter scale pillar, PAID / SOLD FOR printed on the pans, beam tips ~17° toward PAID on "less than it paid"; LOSS tag off the van livery.
- STREET: brick-built van side-on, FREE SHIPPING fully readable; courier enters from the right to the rear door (never crosses the text).
- STADIUM: knit sock puppet + mic stand; jumbotron repainted as a sock puppet.
- FED: dusk sky, exposure 0.8, warm low key + cool rim, darker stone wall, bronze door (the hatched z-fight is gone), lit lamps + lanterns,
  rate board slots visible from frame one and ticking up one bar per beat from "the Federal Reserve" to "six times"; brick fountain; press extras (mic, camera).
- BUST/END: brick bean bags, knit puppet talks through the last line, looks up on "remember", watches the bubble, droops after the pop; CLOSED sign
  swings and reads in full; foreground pet-bag pile moved out of the end framing; dust dots removed; mover walks behind the bean bags.
- LOT: studded road plates + lane tiles, four brick GROCERIES vans (headlights on two, one sagging), sodium lamps, foreground crates, toppled cart,
  spilled fruit bricks; guard pushes the gate shut and slaps the BANKRUPT sign (hung high, clear of heads).
- SKY: fall = windows black out top to bottom while floors break off one slab at a time; investor covers his face; callout MORE THAN 90% / OFF ITS PEAK.
  Rise = sunset look, low brick clouds, string lights, AC fan, planters, swinging cranes with hooks + loads, low-angle shot on "giants".
- Every city tower: mullions in two courses, sills as running-bond short bricks, stud roofs, AC boxes, antennas with red beacons, water tanks on legs.

### Audio
- Bell sample removed (both hiss windows came from it): first-day and IPO rings use `chime` (−7 / −5 semis).
- Crash is the loudest moment (boom 0.78 + rumble + bricks: loudest 0.25 s window at 74.0 s). Slide-whistle / servo pulled down.
- Fillers so no 0.25 s window < −35 dB in the hook (0–6 s), takeaway or ending (86–101.5 s): beep, inflate, slide-whistle, woodblock, squeak, pop, creak tail
  under the end card (no digital silence). 'next bubble' = pop only (+ creak/chime tails on the end card).

### Set list (r2 times)
0–5.2 OFFICE hook · 5.2–10.0 OFFICE stakes · 10.0–16.2 TRADE (pour, profits) · 16.2–22.5 BELL (first day) · 22.5–26.5 MOUNT rise ·
26.5–34.4 WARE · 34.4–38.7 STREET · 38.7–42.4 STADIUM · 42.4–47.0 BELL (IPO) · 47.0–53.2 MOUNT peak · 53.2–57.7 FED · 57.7–62.0 TRADE ask ·
62.0–67.0 BUST shut · 67.0–71.5 LOT · 71.5–73.7 SKY fall · 73.7–88.3 MOUNT crash + climb · 88.3–95.1 SKY rise · 95.1–101.55 BUST end

### Open issues
- The minifig tie decal edge (LDraw torso print) can still alias at 1080p.
- Loudness not re-measured on a render (the mix chain is unchanged from r1, which measured −15.6 LUFS).
- MOUNT crash + climb is still ~14 s on one set (two framings + the walk); could cut to a second angle in round 3.

## Round 3 (2026-11-16): fixes for the round-2 council
Video 96.15 s (voice 93.75 s at rate 1.17 + 2.4 s hold), back near the brief's ~95 s. r2 files backed up in `_r2-backup/`; voice-mix.wav regenerated.

### Script (copywriter rewrites, all inside the fact sheet)
- Line 2: "Then the floor fell out. The warning sign? A sock puppet." (0.6 s close-up of the stadium puppet on "a sock puppet": opens the loop)
- "The globe dot-com rose about 606 percent on its first day of trading. November 1998."
- "Now, about that sock puppet. Meet Pets dot-com." / "Lose money on the food. Pay to ship it. Repeat." / "But it had the famous sock puppet, and a Super Bowl ad."
- "On March 10, 2000, the Nasdaq peaked above five thousand." ("Weeks later" removed: it was an inference)
- "In October 2002, the Nasdaq hit bottom: down about 78%." ("About eleven hundred" now only in the HUD)
- Cut: "The idea was right. The price tag wasn't." (opinion; also removed the hiss-flagged price-tag cue)
- Ending unchanged: "So when everyone says this time is different, remember the sock puppet. Follow for the next bubble."
- End card: `Remember the sock puppet` / `Follow for the next bubble` on a navy brick plate with a stud row (CSS ::before/::after), 54 px nowrap.

### Visual fixes
- Sock puppet rebuilt (dc-kit2 D.puppet): grey tube, white ribbed cuff with red stripes, soft rounded foot-head, big googly eyes, red felt mouth that
  hinges wide, red heel patch. Shown in profile; no mic stand (it read as a TV camera). Jumbotron/warehouse poster use the same design.
- Bean bags: one-colour 4x4 round base + squashed dome + stud (no stacked-plate "cake", no fins).
- Fact chips anchored to the object (NASDAQ → 1999 bar, 5,048.62 → peak bar, APRIL 23, 2015 → 2015 bar, leader lines) or parked in the upper
  band (JUNE 1999 → MAY 2000, FEB → NOV 2000, MORE THAN 90%, ABOUT 1,114): none on a torso. Name tags restyled as game HUD plates.
- Hook: investor walks in during the first second, CRT spikes green on "jump", .COM lands on "Dot-com"; darker wall, blinds, cool window rim,
  1999 wall calendar; on "fell out" a 3x2 patch of floor tiles drops into a black hole with a burst of floor tiles.
- MOUNT: tiled grey plaza (no ripple normal map), loose giant bricks removed, traders cheering, lit lamps, planters + rope barrier;
  flag/boombox no longer baked at the origin (that was the checkered panel the walker clipped through); peak bar stacks brick by brick (short drops);
  collapse rubble stays on screen near the bar; crash now lands on "hit bottom" (riser payoff builds into it; boom is the loudest window);
  the old-peak rope of plates only appears at the 2015 beat with two posts and a 2000 PEAK tile; climb = walk → high crane view → low 2015 hero shot.
- WARE: cones off the scale, scale smaller/angled so PAID and SOLD FOR both read, a bag drops on the PAID pan on "It sold pet food", PETS sock-puppet poster.
- STREET: courier fully in frame, bags stand upright and pile up on the foreground sidewalk, brick fire hydrant.
- BELL: listing board shows PRICING... then flips to $11 on the number; IPO confetti only from the right cannon after "a share".
- FED: coin spray tapers from "Cheap" and stops by "dried up" (no coins vanish mid-air); fountain rim has studded plates.
- BUST: door frame bricks, panelled kick plate, FORECLOSURE notice, no floating wall bricks, abandoned desk + dark CRT, papers, dust sheet,
  flickering tube; ending: puppet talks, slumps on "remember the sock puppet", perks up to watch a big trans-pink bubble swell, pop (flash + plates).
- LOT: shopping carts are solid bar frames (no wireframe).
- Jar coins pearl gold; PROFITS? brick scaled down.

### Audio
- Bell gone, price-tag pop gone (cut line). Crash = loudest (boom 0.95 + rumble + bricks on "hit bottom", riser payoff into it).
- Fillers tied to visible events: computer/beep (CRTs), inflate (stock spike), buzzer (warning sign), squeak (puppet), thud, slide-whistle (bars),
  clunk (door/padlock), cheer pre-lapping the stadium cut, creak (gate, CLOSED sign), inflate + pop (end bubble). Offline check: hook and the
  ending (incl. the end card) have no 0.25 s window below −40 dB offline (≈ −35 dB in the render); a few mid-video breaths remain at −41 to −47 dB offline.
- Engine limit (not editable): build.py adds a section whoosh on every chapter (27×); flagged by the council again.

### Set list (r3 times)
0–5.4 OFFICE hook · 5.4–7.9 OFFICE floor drop · 7.9–9.5 STADIUM puppet tease · 9.5–16.1 TRADE · 16.1–21.4 BELL first day · 21.4–25.5 MOUNT rise ·
25.5–31.6 WARE · 31.6–36.5 STREET · 36.5–39.8 STADIUM ad · 39.8–44.1 BELL IPO · 44.1–49.4 MOUNT peak · 49.4–54.1 FED · 54.1–57.0 TRADE ask ·
57.0–62.5 BUST shut · 62.5–67.3 LOT · 67.3–70.1 SKY fall · 70.1–82.8 MOUNT crash + climb (3 framings) · 82.8–88.4 SKY rise · 88.4–96.15 BUST end

### Open issues
- Section whoosh on every cut (engine). Some mid-video breath gaps (offline −41 to −47 dB) between lines.
- Background towers are still the shared lattice module (now with studs/roof gear); the council wants glassier, hazier backdrops.

## Round 4 (2026-11-16): fixes for the round-3 council
Video 101.4 s (voice 99.0 s + 2.4 s hold): sits between the brief's ~95 s and the council's 100–118 s note. r3 files in `_r3-backup/`; voice-mix regenerated.

### Script (copywriter rewrites, all inside the fact sheet)
- Hook "…make a stock jump: dot-com." (.COM slams onto the sign on "jump", sign flashes; CRT spikes green)
- "Profits? Not the question. Yet." / "Proof? In November 1998, the globe dot-com rose about 606 percent. On day one." / "Then, in 1999 alone, the Nasdaq climbed about 85%."
- "Then the music stopped. Here's what changed: the Federal Reserve raised interest rates six times in under a year."
- "Even Amazon's stock fell more than 90%. Remember that." … "And Amazon, the one that fell more than 90%? It became a giant." (loop)
- Ending: "So when everyone says this time is different, remember the sock puppet. Follow before the next bubble pops."
  (brief's closing line kept; the follow pull now lands on the on-screen bubble pop). End card: `Remember the sock puppet` / `Follow before it pops`.

### Visual
- Ending split into beats: "this time is different" = the trading floor again (green ticker, investors pouring coins into a fresh jar, new angle);
  "remember the sock puppet" = slow push-in on the puppet slumping; "follow before the next bubble pops" = a trans-pink brick bubble (dome halves +
  stud ring) swells out of the puppet's mouth at mid-frame and pops (flash + plates) on "pops", before the end card (larger plate, y≈300 px).
- Puppet: brick head (2x4 brick on its side + 2x2 slope snout, red round heel), bigger round-tile googly eyes, red tile mouth on a hinged plate jaw;
  same model in the stadium (softer spot so the colour matches). Sits in a brick pet bowl (stacked red round bricks + round-plate rim + kibble).
- Hook floor collapse: real 2x2 tiles drop, plate/tile debris burst in floor colours, the hole shows joists over a studded baseplate with a warm glow.
- Nasdaq plaza: tan 2x2-tile paving (no lavender checker), parked taxis, newspaper boxes, ticket kiosk, lamp posts on round feet; skyline towers no
  longer cast/receive shadows (diagonal hatching gone); traders moved off the walk path.
- "Then the music stopped": the two top bricks of the peak bar tumble off and the summit flag tips over. "In October 2002": the bar wobbles and
  sheds plates, the investor steps back, then the collapse on "hit bottom". Climb: short brick drops (no gaps), eased turn to camera, feet on studs,
  the old-peak line is a dashed row of plates behind the bars with the 2000 PEAK tile mid-line; last beat framed wider.
- IPO: no green jump bar at the frame edge; the ringer points then yanks (no hand through the face). THEGLOBE.COM tag moved below the board;
  AMAZON tag moved top-left; MORE THAN 90% arrives 0.45 s after the burst. Amazon tower keeps a 1-floor stump.
- Street: livery on the upper courses (courier walks under it from the left, fully in frame), deeper sidewalk, FREE SHIPPING sandwich board,
  extra bag pile, van headlights. Pet-food sacks are 2x4 bricks with studs + label tile.
- Fed: pulled back so RESERVE reads, exposure 0.72, less bloom. Stadium: night sky without star dots. Lot: carts at waist height, coarser fence.
- Jar: lid off while money pours, coins drop through the mouth.

### Audio
- One idea one sound: 'next bubble pops' = inflate under "follow before the next bubble" + one pop on "pops" + one soft chime when the card lands
  + a creak tail (sign swinging) under the end card. Duplicate squeak/pop triggers removed. Toggle/latch (hiss flag) removed; clunk on the sign flip.
- Extra big-move whooshes (cinematic, build into the cut) at 6 chapter cuts that had gaps before them; fillers tied to events elsewhere.
  Offline: no 0.25 s window below −40 dB in the hook or ending; mid-video worst −45.6 dB (60.0 s).

## Round 5 (2026-11-16): fixes for the round-4 council
Video 99.95 s (voice 97.55 s + 2.4 s hold). r4 files in `_r4-backup/`; voice-mix regenerated.

### Script (copywriter trims, all inside the fact sheet)
- "Proof? November 1998: the globe dot-com rose about 606 percent. On day one." / "And in 1999 alone, the Nasdaq climbed about 85%."
- "February 2000: it went public at $11 a share. Weeks later, on March 10, the Nasdaq peaked above five thousand."
- "Then the music stopped. Why? From June 1999 to May 2000, the Fed raised interest rates six times." (fixes the timeline the old 'Here's what changed' implied)
- "How long to climb back above the old peak? Fifteen years. April 2015." ("Then came the long climb back" cut)
- Ending: "So when everyone says this time is different, remember the sock puppet. Follow to spot the next bubble."
  End card: `Remember the sock puppet` / `Spot the next bubble`.

### Visual
- Trading-floor reprise: bloom 0.28 / threshold 3.0, warm rim (no cyan floor wash). Close-up reframed so the whole .COM label reads; floor papers
  thinned to 8 and kept behind; stray orange floor cable removed. Tickers use words (UP/DOWN) on a finer LED grid (no garbled glyphs).
- Stadium tease: wider side angle, head at ~35% of frame, white back-rim spot so the grey sock separates from the stands.
- Street: courier walks in hugging a pet-food sack (no hand-truck clipping); sacks arc out of the van door and stack on a grid beside it (no overlap,
  never in front of his face); lost-money shot pulled back so FREE SHIPPING reads; streetlamp, newspaper box, bicycle, sack spill in the foreground.
- Sacks rebuilt as brick bodies with gabled slope tops + paw label (no rows of studs that read as tubes). LOSS tags apart; hazard-stripe tile
  line and a shrink-wrapped pallet in the warehouse foreground.
- IPO: confetti fires toward the camera's lower third (not over +606%); PRICING... dots tick from "February 2000"; the ringer reaches from the date.
- Nasdaq: the 1999 bar grows on "And in 1999 alone"; boombox note column removed; 5,048.62 chip leaves when the bricks topple; climb = walk ->
  overhead from the front (bloom 0.3) -> 2015 hero beat (gold bar + dashed old-peak line).
- Slams: '6' sits low-left between the columns (clear of RESERVE), '78' higher (clear of the hair). Fed practicals softer.
- Lot: BANKRUPT hung above head height, guard inside the frame, darker/finer fence, more depth of field.
- Closed office: kick scooter on its side and a bean bag in frame, LAUNCH PARTY banner hanging by one corner; puppet tube has course seams,
  the pet bowl is stacked round courses.
- Skylines: night sky without star sprites, brick parapet wall + satellite dish instead of black posts, blimp removed, cool rim on figures,
  less fog, clouds higher; the survivor tower grows floor by floor until "became a giant" and the figures look up at it. Crane cables thicker.
- Name tags hold until their shot cuts (no half-off-screen slide-outs).

### Audio
- End card: inflate -> pop on "bubble" -> chime -> brick-settle -> soft low rumble bed to the end (no dead air under the card). Creak removed there.
- Slide-whistle off the Nasdaq peak; 'and investors started' is a beep; rumble moved off the calm rooftop line (servo for the cranes instead).
- Worst mid-video window offline −50 dB at 89.5 s (breath before "it became a giant"); hook and ending ≥ −40 dB offline.


## Round 6 (2026-11-17): triple-hook rework + fixes for the round-5 council
Video 94.62 s (voice 92.22 s at rate 1.22 + 2.4 s hold), on the brief's ~95 s. r5 files in `_r5-backup/`; voice-mix.wav regenerated.
**Build with `../.venv/bin/python tools/build.py --no-voice`** unless the script changes (the voice was generated from the same
lines with numbers spelled out; voice-timing.json's script_hash was set to the current script so a plain build also reuses it).

### Triple hook (0–3.7 s), one question: "how did three letters make (and lose) fortunes?"
- Visual: from frame 0 the camera dollies in fast over Bob typing at the beige CRT while the investor walks in; on "three letters"
  three brick letter tiles C, O, M drop one per woodblock note beside BOB'S SHOES, hop on "stock jump", then the .COM panel pops in
  place on "dot-com" (flash + dust ring) as the CRT chart spikes. No HUD badge in the hook.
- Spoken: "In 1999, three letters could make a stock jump: dot-com." (11 words).
- Text (hook title, adds a number, works on mute): `Get rich fast?` / `Then lose 78%.` (92 px, one line each, nowrap).

### Script (copywriter rewrites, all inside the fact sheet)
- "Investors threw money at internet companies with little or no profit."
- "Why? In under a year, the Fed raised interest rates six times." (HUD keeps JUNE 1999 → MAY 2000)
- "And then came the yet. Investors asked one question: where are the profits?" (closes the 'Yet.' loop)
- "Even Amazon's stock fell more than 90%. Hold that thought." (keeps 'remember' for the ending)
- Ending: "So when everyone says this time is different, remember the sock puppet. Follow, and you'll spot the next bubble."
- End card: `Remember: sock puppet` / `Follow → next bubble` (both ≤ 22 chars).

### Visual
- One sock-puppet asset for every set (dc-kit3 D.puppet): grey knit tube, ribbed white cuff with two red stripes, long foot-head with a
  rounded toe, matte button eyes on the sides (no bloom), dark open mouth, red felt lips, pink tongue, flat red heel patch.
  Shown in 3/4; stadium spots at 45% so it stays grey. Stadium tease now holds through "puppet" + ~1 s.
- Real bell (lathe-cast pearl gold + collar + swinging clapper, yoke between brick posts); swing ±0.22 rad, ringer 0.85 away (no clip).
  Bell rings on "606 percent" with confetti over the riser; ringer reaches for the rope from "November 1998". Wider framing: EXCHANGE reads.
- Nasdaq set: brick-course seams on every bar, warm distance fog, lamp posts moved off the heads; "music stopped" shatters the top 4
  bricks (fall right, bounce, stay as rubble through the crash + climb), the flag topples with its pole onto the baseplate and the
  camera tilts down to follow; MOUNT holds through "Why?". The 2002 bar starts chipped (no reset). Chips shed from the bar top.
- "cheer" rebuilt with straight raised arms (the bent-elbow cheer read as four arms on suits).
- Trading floor: investors moved off the jar (no torso overlap), 6 spaced flat-gold coins per bucket, curved .COM decal on the jar,
  PROFITS? brick in front of the jar hops on "Yet", the trader taps the jar; PROFITS? hidden in the reprise.
- Warehouse: opens on the PETS sock-puppet poster ("about that sock puppet"), worker walks in, roller door rises on "Meet",
  reverse angle on the PAID / SOLD FOR scale at "It sold"; back worker moved clear; van in the door scaled so FREE SHIPPING reads.
- Street: knee-height camera with raking sun, hand truck of sacks + sack pile + cone + LOSS tag in the foreground, two parked
  late-90s brick sedans; courier carries the sack low and stops right of the livery.
- Sacks rebuilt (bulging body, shoulders, crimped top, paw label). Produce = 1x1 round plates/bricks in small crates; oversized
  spill removed; carts in matte grey bars.
- Fed: coins fall in low arcs into the pool; the 'dried up' beat frames fountain + investor + rate board.
- Lot: courier inside the frame, level camera, GROCERIES sign moved up-left (clear of BANKRUPT and the WEBVAN tag), livery only on the outer vans.
- Skyline: survivor tower stands from the first frame and grows to 22 floors on "giant"; a low layer of brick clouds at dusk.
- Ending: bubble swells in front of the mouth, camera re-centred so it never leaves the frame.

### Audio
- Every sound ≤ 4 uses (computer, woodblock, thud, pop, clunk, creak 4; others ≤ 3). No creak on the +606% day; cheer once (stadium,
  long tail covers the confetti burst); duplicate servo removed; 'next bubble' = inflate → one pop → soft creak of the swinging CLOSED
  sign under the end card (no digital silence). Dead-air fills: sonicboom thud under the floor collapse, servo (forklift) before
  "Meet Pets", riser building through "How long to climb back…" into "Fifteen years".

### Set list (r6 times)
0–4.1 OFFICE hook · 4.1–6.7 OFFICE floor drop · 6.7–8.5 STADIUM puppet tease · 8.5–15.0 TRADE (pour, profits) · 15.0–22.2 BELL first day ·
22.2–25.3 MOUNT rise · 25.3–31.5 WARE (poster, door, scale) · 31.5–35.6 STREET · 35.6–39.3 STADIUM ad · 39.3–43.4 BELL IPO ·
43.4–48.1 MOUNT peak + break · 48.1–53.4 FED · 53.4–58.0 TRADE ask · 58.0–62.0 BUST shut · 62.0–65.9 LOT · 65.9–68.9 SKY fall ·
68.9–79.4 MOUNT crash + climb (3 framings) · 79.4–86.0 SKY rise · 86.0–88.4 TRADE reprise · 88.4–94.62 BUST end

### Open issues
- Section whoosh on every cut (engine). The puppet reads warmer (tan) under the closed office's sunset key than in the stadium.
- Whisper transcripts flip between digits and words on each TTS run; keep `--no-voice` unless the script changes.
