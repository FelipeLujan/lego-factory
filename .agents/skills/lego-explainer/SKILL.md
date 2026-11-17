---
name: lego-explainer
description: House recipe and hard-won lessons for LEGO / brick video-game style explainer videos (brick-cinematic template, LDraw minifigs, 6-seat legoCouncil review loop), including the DealCalm story series. Use whenever this workspace makes, revamps, reviews or re-voices a LEGO/brick video, or runs the legoCouncil.
---

# LEGO explainer videos (brick-cinematic + legoCouncil)

Read with `/hyperframes` and `/tiktok-explainer`. Style guide: `templates/brick-cinematic/README.md`.
Council process: `docs/COUNCIL.md`. DealCalm series rules + fact sheets: `docs/DEALCALM-SERIES.md`.
These lessons come from the Starship videos (10 rounds) and the 15-video DealCalm revamp (Nov 2026; about 4,100 council findings mined).

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
**Props & set-dressing quality bar = `disney-iger` r7 (`renders/disney-iger-r7-props.mp4`): the person approved it, so every new or revamped LEGO video must match it or beat it.**
- Use the shared prop library `assets/props-kit.js` (`const PK = PROPS.setup(ctx, K, X)`; template copy in `templates/brick-cinematic/assets/props-kit.js`; usage example: `dressSets()` in `disney-iger/assets/scene.js`). It has 40+ brick-built assets (office, stage/studio, outdoor/street, hall), `PK.extra` minifig extras with hand props, `PK.bake(set)` to merge static props into InstancedMeshes, and `PK.tick(t)` for live props.
- Every set: at least 6 asset types, at least 3 that appear in no other set, foreground + midground + background interest, extras holding props, and 1–2 live props (fan, steam, fountain, pigeons, balloons, screens).
- Add story-specific assets the library lacks (GPUs, server racks, race cars…). Put new GENERIC ones back into the template's props-kit.js so the library keeps growing.
- Dressing never covers faces, the subtitle band, slams, HUD tags or CTA text. Check that props are actually visible in the tight framings (props outside the frame don't count).

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

## Render speed (benchmark 2026-11-16, Mac M1 16 GB, ai-boom full 110 s)
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
