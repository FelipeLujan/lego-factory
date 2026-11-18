---
name: lego-explainer
description: House recipe and hard-won lessons for LEGO / brick video-game style explainer videos (brick-cinematic template, LDraw minifigs, 6-seat legoCouncil review loop), including the DealCalm story series. Use whenever this workspace makes, revamps, reviews or re-voices a LEGO/brick video, or runs the legoCouncil.
---

# LEGO explainer videos (brick-cinematic + legoCouncil)

Read with `/hyperframes` and `/tiktok-explainer`. Style guide: `templates/brick-cinematic/README.md`.
Council process: `docs/COUNCIL.md`. DealCalm series rules + fact sheets: `docs/DEALCALM-SERIES.md`.
These lessons come from the Starship videos (10 rounds) and the 15-video DealCalm revamp (Nov 2026; about 4,100 council findings mined).

## 0. The main goal: DealCalm top-of-funnel videos
New DealCalm videos follow **`docs/DEALCALM-TOFU.md`**:
- 60–75 s; topics are negotiation/power history stories, tactic explainers and everyday scenarios;
- a soft CTA line ("Practice moves like this with Deal Calm"; App Store / URL only on the end card) and the "DEALCALM STORIES" stinger (`scripts/series_badge.py`);
- triple hook, max 3 council rounds, `POST.md` post copy.
Run them with `scripts/lego_council_workflow.py` + `topics` (it researches the facts with web search, leaves unsure claims out and proceeds without waiting).

## 1. Start / migrate
- New video: `.venv/bin/python scripts/new_video.py <name> --template brick-cinematic`.
- Existing brick-story folder: `.venv/bin/python scripts/upgrade_to_cinematic.py <name>`. It backs up to `_pre-cinematic/`, keeps the old scene as `assets/scene.brickstory.js`, copies the engine and the full sfx library, and fixes the index.html script order: film → ldraw-parts → brick-kit → fx-kit → ldraw-kit → scene.
- Never edit the engine for one video: `stage.html`, `tools/build.py`, `brick-kit.js`, `fx-kit.js`, `ldraw-kit.js`, `ldraw-parts.js`, `film.js`. `assets/props-kit.js` (the shared prop library, loaded after ldraw-kit.js) is copied into every project and may be extended there; see 3b.
- Real LDraw parts available: 973 3001 3003 3004 3005 3010 3023 3024 3039 3040 3062b 3068b 3069b 3070b 3941 4073 6141 98138, plus the minifig parts and hair. Use them via `X.ld(id, scale)` (there is no `tools-ldraw/` folder on this Mac).

## 2. Script, voice, length
- About 110 s (voice 104–114 s plus the 2.4 s end hold). Fit the length with the speaking rate first.
- Voices are Google Cloud TTS Chirp3-HD only. The en-US names are stars: Achernar, Achird, Algenib, Algieba, Alnilam, Aoede, Autonoe, Callirrhoe, Charon (banned), Despina, Enceladus, Erinome, Fenrir, Gacrux, Iapetus, Kore, Laomedeia, Leda, Orus, Puck, Pulcherrima, Rasalgethi, Sadachbia (house default), Sadaltager, Schedar, Sulafat, Umbriel, Vindemiatrix, Zephyr, Zubenelgenubi. Names like "Arlo" or "Ludo" do not exist there: ask where they come from.
  - Voices differ a lot in pace: Zubenelgenubi at rate 1.1 ran 131.6 s where Sadachbia ran 108 s; it needed rate 1.32.
- Re-voicing an existing video:
  1. Back up `script.json`, `words.json`, `voice-timing.json`, `assets/voice/`, `assets/cues.js`, captions.html, hud.html and sfx-bed.wav to `_<oldvoice>-rN/`.
  2. Change `voice` and `rate`, then run `build.py`.
  3. If index.html plays `assets/voice/voice-mix.wav`, regenerate it, or the old take keeps playing. See section 6.
  4. Cues are phrase-based (`F.at`), so the scene re-times itself. Snapshot-check, then render as `<name>-rN-<voice>.mp4`.
- **Triple hook (0–3 s):** the visual hook (motion or a reveal from frame 0), the spoken hook (line 1, ≤ 14 words) and the text hook (the hook title, which adds and never repeats, and works on mute) fire together on one question. The social copywriter rates each as strong/weak/missing.
- Hook ≤ 14 words, matched to the opening shot. Don't repeat the hook later ("ten years later…" said twice was flagged), and don't spoil the payoff in the hook title. State the stakes right after the hook; name the moves; pay off the twist clearly, not buried inside a long list of names.
- Facts: only from the fact sheet. Keep hedges. Builders list unsure claims, which stay out. "Framing" lines are fine; invented scenes with real people are not (see section 5).

## 3. DealCalm CTA (series rule)
- The final line is story-specific and one breath, e.g. "Someone coming for your seat? Pull an Iger: leave them nothing to fight about. Practice it with Deal Calm, on the App Store and at deal calm dot com." Write "Deal Calm" / "deal calm dot com" in the script for clean TTS.
- **Do not put the real person's minifig in the CTA set.** Seats flag it as an implied endorsement. Use a generic DealCalm host plus a story callback prop (Iger's red CEO chair, a Netflix-style mailer, etc.).
- Don't claim "free" or anything about the app that isn't verified. No Apple logo: the text "App Store" only.
- CTA layout bugs that recur:
  - the subtitle ("dot com") lands on the phone's START button;
  - the end title wraps "App Store · / dealcalm.com" (keep line2 short, e.g. `App Store · dealcalm.com` ≤ 24 chars, or split it across the hook/end lines);
  - confetti covers the URL;
  - the push-in crops the DealCalm header;
  - 1.4 s of digital silence under the end card.

## 3b. Props & set dressing (the quality bar)
**Quality bar (approved by the person): `examples/dotcom-crash-lego-r6/` overall ("I loved it": a visual brick metaphor for every beat, cause → effect shots, a callback loop) and `examples/disney-iger-r7/` for props.** Read `examples/README.md` and look at both `stills/` folders before building. For props specifically, every new or revamped LEGO video must match or beat `disney-iger` r7:
- Use the shared prop library `assets/props-kit.js` (`const PK = PROPS.setup(ctx, K, X)`; template copy in `templates/brick-cinematic/assets/props-kit.js`; usage example: `dressSets()` in `examples/disney-iger-r7/assets/scene.js`; story-prop examples: `examples/dotcom-crash-lego-r6/assets/dc-kit*.js`). It has 40+ brick-built assets (office, stage/studio, outdoor/street, hall), `PK.extra` minifig extras with hand props, `PK.bake(set)` to merge static props into InstancedMeshes, and `PK.tick(t)` for live props.
- Every set: at least 6 asset types, at least 3 that appear in no other set, foreground + midground + background interest, extras holding props, and 1–2 live props (fan, steam, fountain, pigeons, balloons, screens).
- Add story-specific assets the library lacks (GPUs, server racks, race cars…). Put new GENERIC ones back into the template's props-kit.js so the library keeps growing.
- Dressing never covers faces, the subtitle band, slams, HUD tags or CTA text. Check that props are actually visible in the tight framings (props outside the frame don't count).

## 3c. What made dotcom-crash-lego r6 the approved video (copy these habits)
- **One brick metaphor per idea, built physically:**
  - a "mountain" of brick bars for an index's rise, peak and collapse, which stays on screen as a recurring set;
  - a balance scale tipping to PAID over SOLD FOR for selling at a loss;
  - a coin fountain draining its round-plate pool for "cheap money dried up";
  - a survivor tower dropping from 16 floors to 2, then regrowing past the skyline.
- **Cause → effect in every shot:** a brick drops onto the sign, then the stock jumps; the CRT line crashes red, then the box stack topples into bricks; a roller door rises, then the van sags under free-shipping bags.
- **A callback object that loops:** the sock puppet is set up in the hook ("The warning sign? A sock puppet."), shown at its peak (stadium ad), at its fall (slumped on a bean bag) and in the ending ("remember the sock puppet").
- **11 sets, each revisited from a new angle, never the same framing twice.** Story props live in project kits (`dc-kit*.js`, `dc-sets.js`), built on PK primitives so they can be baked.
- **Short, punchy script lines (≤ 12 words)** with rhetorical questions ("Profits? Not the question. Yet." … "And then came the yet.") and numbers written the way the transcript prints them, so there are no word-count warnings.
- **Chips and callouts carry the exact figures** (5,048.62 · March 10, 2000) while the voice says "above five thousand". Subtitles are 3 words / 20 chars, and the end title is set by an injected style so it never wraps.
- **A sound per idea**, with low fillers under every pause; the voice-mix.wav chain lands about −15.7 LUFS.
Sources: `examples/dotcom-crash-lego-r6/REVAMP_NOTES.md` (set-by-set table with timings) and `stills/`.

## 4. What the council marks down most (fix these BEFORE round 1)
Ranked by how often seats flagged them:
1. **Not brick-built.** Flat 2D cutouts (lollipop trees, silhouette people, painted skylines behind glass), plain textured boxes as buildings/planes/kiosks, smooth spheres as "smoke". Build facades from brick courses with window frames, cornices and rooftop gear; trees from round bricks/cones; crowds from minifigs.
2. **Caption/HUD collisions.** Text on text: the subtitle under slam letters, a sign behind a head ("PRESS" cut by Jordan's head), decals overlapping and z-fighting (two posters in one glass → "EVERY STORE / MUS LOSING"). Keep signs off head height behind faces; separate overlapping decals by depth ≥ 2 cm.
3. **Lighting blowouts.** Window glare or bloom hotspots covering 15–30% of the frame, legs dissolving into glow, overexposed white cabins. Use evening/practical grades, dimmer windows with a lit skyline, warm practicals as key and a cool rim.
4. **Faces hidden or figures cut off** at frame edges; backs to camera; the payoff object hidden behind a torso.
5. **Bare floor.** The bottom 40–45% of the frame is empty floor tile in wide shots. Raise the camera target or fill the foreground (rugs, crates, planters, cables, props).
6. **Clipping.** Two minifigs in one spot, nameplates intersecting, seated legs sinking or floating, props floating beside hands (scale floppy disks etc. to the C-hand), duplicate props (two basketballs).
7. **Static holds and repeated sets.** Any figure frozen > 1.5 s, a composition held > ~6 s, or ~11 s on one set at the same framing. Re-angle each revisit.
8. **Sound.** Dead air below −35 dB inside the hook, takeaway or CTA (put a low filler under pauses); an inverted dynamic arc where slams are louder than the climax; digital silence at the end.
9. **Particles as sprites.** Snow/steam/growth lines as blurry dots or ribbons. Use LEGO elements: 1x1 round plates (6141) for fireworks, sparks and snow; round bricks (`X.puffs`) for steam; real brick debris. Keep weather outside windows only, and give every sound a visible physical event (door slam, chair kick).
10. **Seated minifigs** seen from the front show blocky leg fronts: angle the camera or hide them with a desk.

## 5. Real people (neutral portrayal)
- Never show a documented-absent person in a scene (e.g. Chapek being removed, when the event isn't shown that way in the record). Show an empty chair, a nameplate flip, a headline instead.
- No invented gestures of emotion (facepalm, cheering) for real people unless documented.

## 6. Loudness recipe (build.py defaults land around −17.5 LUFS)
- Compress the voice into `assets/voice/voice-mix.wav` and point index.html's voice `<audio>` at it:
  `ffmpeg -y -i assets/voice/voice.wav -af "acompressor=threshold=-20dB:ratio=3:attack=4:release=90:makeup=5dB,volume=2.9dB,alimiter=limit=0.66:attack=2:release=40:level=false" -ar 24000 assets/voice/voice-mix.wav`
- Set the sfx-bed volume in index.html to about 0.46–0.55. Result: −15.1 to −15.9 LUFS, true peak about −1.2 to −1.9 dB.
- Regenerate voice-mix.wav after every script/voice change.
- Engine limits (build.py; not editable per video): a whoosh on EVERY chapter (more than 6 uses), slam drums that are often the loudest window, the end title only in the 2.4 s hold. Seats keep flagging these; fix them in the template's build.py when someone approves an engine change.

## 7. Running the council (orchestrator)
- **Any harness:** `scripts/council_seat.py prompts|task|collect|feedback <slug> <N>` builds the same seat briefs and gate as the workflow and collects seat JSON files (`docs/COUNCIL.md` → "Running a round from any harness"). **In T3 Code, start the 6 seats with `delegate_task` on `claudeAgent` / `claude-opus-5-5`** so the person sees each seat as a thread. Seats must be able to see images: the Antigravity harness inside T3 cannot (its `view_file` returns raw bytes).
- Use the council subagents (`builder-legoCouncil` + 6 seats), **not the swarm**. All run on **Claude Opus 5.5**, judging from screenshots only (no Gemini, no Vertex AI). Unattended multi-video batches in Antigravity desktop: `scripts/lego_council_workflow.py` via `run_workflow` using `ScriptPath` + `Args`:
  - `videos`, `max_rounds` (5), `concurrency` (4),
  - `resume: {slug: {round, feedback_round, render_first, reuse_render, note, cta}}`, which restarts from saved `council/rN/scores.json`.
- The builder never renders. The orchestrator renders one MP4 at a time (about 5–9 min for 110 s), then runs `council_pack.py`, then 6 seats in parallel in isolated conversations, then a score table in the report and `council/rN/scores.json`.
- The builder keeps `REVAMP_NOTES.md` so a fresh builder can take over (builders sometimes end without calling finish).
- Private gate: every seat's average ≥ 8.0 and no topic < 7.5. Never tell seats or builders the number.
- **Expectations:** round 1 lands about 5.9–6.3; round 5 lands about 6.9–7.1. Most of the gain is in rounds 1–3. Nobody reached 8 in 5 rounds, so put the effort into section 4 before round 1.

## 8. Machine / infra (macOS)
- **Disk:** a 4-worker HyperFrames render needs about 2.5 GB of temp frames. Always render with `TMPDIR="<workspace>/.render-tmp/"`. The internal disk was nearly full and caused failed renders and a crashed run.
- Agent conversation logs grow about 1–5 GB per hour during council batches (on the internal disk). Check `df -h /System/Volumes/Data` first: want ≥ 20–25 GB free for a multi-video run. Pause, don't delete user files, if it drops below about 3 GB.
- Use `npx --yes hyperframes@0.9.46 …` (never interactive). Snapshot: `--at 1.2,5,9 --no-end --output <dir>` (plain seconds, no "s").
- Never play audio/video out loud (no afplay, say, ffplay, open).

## 9. Overnight TOFU production lessons (Nov 17, 2026: 33 videos, about 7,500 council findings)
- **Scores to expect at 3 rounds:** round 1 lands about 6.2–6.7, round 3 about 6.9–7.2. The mean over 33 finished videos was **7.07** (range 6.81–7.46). Extra rounds keep paying a little: silna-nba-deal reached **7.46** after 5 rounds (+0.4 over its round 3). Nobody reached the private 8.0 gate.
- **#1 finding now is READABILITY of the brick metaphor** (about 2,300 mentions: the viewer can't tell at phone size what an object is or what it means). Make every hero prop readable in under 0.5 s: an exaggerated silhouette, one consistent model reused in every shot (the dot-com sock puppet looked like a pipe in one shot and a dog in another), a short label chip when needed, and framing at ≥ 25% of the frame height.
- Then, in order: not brick-built (flat or primitive shapes, sprite FX) · an empty floor in the bottom 40% · caption/HUD/badge collisions (the new DEALCALM STORIES badge plus the hook title plus slams: keep them staggered) · faces cut or hidden · hook/title (the triple hook) · clipping/scale · bloom blowouts · static holds · CTA/end-card layout · dead air.
- **Re-cutting an old ~110 s video to 60–75 s beats starting fresh:** the 4 re-cuts landed at 7.06–7.19 on their first new rounds (their old ~110 s cuts were 6.46–6.86).
- **Daemon infra that worked:** queue.json with per-item `max_round`, a 2 h builder watchdog, the topic scout refill (its stories were the strongest), 10 fps drafts (35–70 s), automatic `output/` sync, and the disk-pause at 5 GB. Bugs found and fixed: hung builder turns, a variable-name collision, and scout items inheriting `max_rounds` 10.

## Render speed (benchmark 2026-11-16, Mac M1 16 GB, ai-boom full 110 s)
> On any other machine (e.g. the Windows PC with an AMD GPU) run `scripts/render_benchmark.py <finished-project>` once and pass its recommended `workers` / `gpu_encode` to the workflow. On Windows `gpu_encode` defaults to off until benchmarked.
| Setting | Render time |
|---|---|
| 30 fps, 1.5× pixel ratio, auto workers (old council default) | ~6 min |
| 10 fps, 1.5×, 2 / 3 / **4** / 6 / 8 / 1 workers | 2:06 / 1:55 / **1:48** / 2:14 / 2:28 / 2:26 |
| 10 fps, 4 workers, `--gpu` (VideoToolbox encode) | 1:42 |
| **10 fps, 4 workers, 1.0× pixel ratio, `--gpu` (new council draft)** | **1:18** |
- **4 workers** is fastest (auto also picks 4); more workers add memory/swap and slow down. 1 worker is slowest, and `--start/--end` span renders with 1 worker can hang.
- Fast capture (`drawElementImage`) never engages on WebGL scenes; forcing it off was slower (3:06). Leave the default.
- `--gpu` encode: PSNR 45 dB vs the software encode (visually the same) at ~60% of the file size. It's used for drafts; the final 30 fps deliverable keeps software encode.
- Draft pixel ratio comes from `assets/render-profile.js` (`window.RENDER_PROFILE = {pixelRatio: 1.0}`); the council script writes it before a draft and restores `{}` after. Always render with `TMPDIR` on the Lexar drive.
