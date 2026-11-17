---
name: tiktok-explainer
description: House recipe for a vertical TikTok/Shorts explainer in HyperFrames - Google Cloud TTS voiceover, word-synced retention edit (0.5 s caption beats, steady camera with chapter whips, flash frames, letter slams), black + light-mesh 3D look, and a clean (no-hiss) sound-effects bed. Use with /hyperframes whenever this workspace makes or remakes a short-form video, or when asked to make one "catchy", "addictive" or "for TikTok".
---

# TikTok explainer (house recipe)

**For a new video, don't build from scratch: use the template and follow the playbook.**
1. `python scripts/new_video.py <name>` copies `templates/tiktok-explainer/` (a working demo).
2. Follow `PLAYBOOK.md` (workspace root) step by step. You write only `script.json`, `cues.json` and `assets/scene.js`.
3. Run `python tools/build.py` in the project. It does TTS, word timings, captions, cue times, the overlay layer (hook, end card, flashes, slams, tags) and the sound bed, and reports any problems.
4. To delegate to another agent (Claude Opus 5.5 only for LEGO/council work; no Gemini), use `docs/DELEGATION.md`.

The sections below are the reasoning behind the template's numbers. Read them when you change the engine or build something it can't do.

## Engine notes

- `shell-rule/` predates the template and is the advanced example. It keys its tracks on a *design clock* (the v1 voice) and warps them to the current voice word by word (`shell-rule/tools/retime.py`). The template is simpler: every cue is a spoken phrase resolved to seconds (`F.at("phrase")`), so a new voice or new wording re-times everything automatically.
- Fit the length by speaking rate and gap first, and by cutting words second. Never pad.

## Voice

- Use Google Cloud TTS Chirp3-HD, LINEAR16 at 24 kHz, one request per line, joined with gaps.
- Do **not** use `Charon` (overused). The current house voice is `en-US-Chirp3-HD-Sadachbia` at rate 1.1, with each line's gap at ~30% of a calm read (0.05–0.15 s).
- Pass `speakingRate` in `audioConfig`; Chirp3 honours it.

## Retention edit (the "never let them rest" numbers)

- **Captions:** 1–2 words, ≤ 12 characters, so a new group arrives about every 0.5 s.
  - Archivo Black, 104 / 90 / 74 px by length, white with an 11 px black stroke (`paint-order: stroke fill`).
  - Each group pops from 1.3× (1.6× for an accent word) with a seeded tilt of ±3.5°.
  - Accents alternate coral `#FF6B4A` and lime `#C8FF3E`, one word a group.
  - Clamp each group's end to the next group's start; a minimum hold must never overlap the next caption.
- **LEGO / brick style** (minifigure stories, the DealCalm series, Starship): use `templates/brick-cinematic` (`new_video.py <name> --template brick-cinematic`; old brick-story folders: `scripts/upgrade_to_cinematic.py`) with real LDraw minifigs (`K.mfig`), 8+ fully dressed brick sets and no black voids. **Load `/lego-explainer` (`.agents/skills/lego-explainer/SKILL.md`)**: council lessons, CTA rules, the loudness recipe and the council loop. Series brief: `docs/DEALCALM-SERIES.md`.
- **Camera:** steady on every caption. **No per-caption or per-accent punch-in and no roll**: the person rejected it twice as "too much shaking". Only section changes get a gentle 6% push-in and a 12° whip (alternating, settling in ~0.3 s). Get energy from scene animation, caption pops and cuts instead.
- **Something always moving:** subjects spin at ~16°/s, the background mesh turns slowly, and the camera drifts gently.
- **Section changes:** a white flash frame (0.45–0.7 opacity, fading over 0.14 s) and a whoosh. Mark big structural beats ("number one / two / three") with a giant letter slam: 460 px, scale 2.6 → 1 in 0.16 s with expo.out, then it flies into its slot in the HUD.
- **Hook:** the title is already on screen at frame 0 (the thumbnail), and the end frame mirrors frame 0 so the video loops.
- **Safe areas (TikTok):** content between x 130 and 930 and between y 280 and 1290. Captions sit at y 1070–1220. Nothing readable below 1330.

## Look

- **Real, not cartoony.** The person rejected flat ivory/coral shapes as too cartoony and wanted reference-grade 3D. The stage now has a PMREM studio environment (softboxes in a dark room) and renders at 1.5x pixel ratio. Objects use `MeshPhysicalMaterial` with real values: brushed aluminium (metalness 1, canvas seams and rivets), black rubber, clear-coated paint, transmissive faceted ice. Coral and lime are for diagram elements only. Example: `deice-boot/assets/scene.js`.
- Black background (`#000`) with an **unlit** black floor (MeshBasicMaterial) plus a ShadowMaterial catcher. A lit floor reflects the rim lights and turns grey or coloured.
- Light mesh: a `GridHelper` in `#D9D9D9` at 20%, and a wireframe icosphere dome (radius 46, detail 5) in white at 17% with `fog: false`.
- Light: a warm key with a 2048 soft shadow, a cool white rim (2.4) and a coral rim (1.6) so subjects separate from the black. Use ACES tone mapping and `THREE.ColorManagement.legacyMode = false` (three r149) so hex colours stay true.
- HUD panels: `rgba(8,8,8,0.82)` with a 2 px white border at 22% and a 10 px radius; the active cell is filled with the accent.

## Sound

- All effects go into **one bed** (`sfxbed.py`): each file is placed so its measured peak (`npx hyperframes audio <f> --json` → `moments.peak`) lands one frame after its picture. Every file is peak-levelled before its gain.
- **Variety: one sound per idea.** The bundled set is too small. Fetch concrete cues from Openverse with `npx hyperframes media-use resolve --type sfx --intent "<concrete sound>" --project .` (free, no sign-in, CC0/CC BY). Then copy the keepers into `assets/sfx/` and keep `assets/sfx/CREDITS.md` up to date.
  - Proven cues in `shell-rule/assets/sfx/`: swoosh, swish, woodblock (pitched runs for lists and counts), tom (under the slams), slide-whistle (things growing), boing (a shape snaps into place), scratch ("wait, no" or "disagreed"), rewind ("replay"), computer (retro tech), bell (a reveal; cut it to about 1 s), buzzer (failure; keep it short and quiet).
  - Section changes rotate whoosh, swoosh and swish, also pitched, so no sound repeats back to back.
- **Don't overuse anything.** No per-word clicks: on every accent word they read as a camera shutter. A single sound should play at most about 6 times in a film, unless it forms a melodic run.
- **No hiss.** Never use `glitch-1/2/3`, `sparkle` or `key-press`: more than 35% of their energy is above 6 kHz and they read as white noise. Measure every new file's high-frequency share before using it. Low-pass every file (whoosh 7 kHz, cinematic 6 kHz, riser 5 kHz, others 6 kHz).
- Verify with the bed's energy above 6 kHz (should be ≈ 0%) and the render's loudness (target −16 to −14 LUFS, true peak ≤ −1 dBTP).
- Music comes from the HeyGen catalog (sign-in). Until then, ship without music and say so.
