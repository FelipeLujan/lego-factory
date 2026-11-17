# AGENTS.md: read this first (every agent, every time)

This workspace makes **vertical TikTok explainer videos** with HyperFrames (HTML rendered to MP4) and three.js.

## Where to go

| Task | Do this |
|---|---|
| **Make DealCalm videos (the main goal: top-of-funnel for the DealCalm Instagram/Shorts)** | Read **`docs/DEALCALM-TOFU.md`** (60–75 s, soft CTA, triple hook, series stinger, 3 council rounds, POST.md) and run `scripts/lego_council_workflow.py` with `topics` (it researches, scaffolds, builds, runs the council, renders the final cut and writes the post copy). |
| Make a new video | Follow **`PLAYBOOK.md`** step by step. Start with `.venv/bin/python scripts/new_video.py <name>`. |
| Delegate a video to another AI | Follow **`docs/DELEGATION.md`**: send its brief, then review the result before the person sees it. |
| Change an existing video | Read that project's `AGENTS.md` "This project" section, then PLAYBOOK section 9. |
| Understand the files | `README.md` |
| Make a DealCalm story video (LEGO game look, ~110 s, DealCalm CTA at the end) | `docs/DEALCALM-SERIES.md` + `templates/brick-cinematic` (existing brick-story folders: `scripts/upgrade_to_cinematic.py <name>`) |
| Make a **brick video-game look** video (full environments, real LDraw minifigs, bloom, depth of field, brick water) | `.venv/bin/python scripts/new_video.py <name> --template brick-cinematic`, then read `templates/brick-cinematic/README.md` (the style guide) |
| Make / revamp / review any **LEGO-style** video | **Quality bar: `examples/dotcom-crash-lego-r6/` (overall, the person loved it) + `examples/disney-iger-r7/` (props)**: match or beat them; see `examples/README.md`. Load **`.agents/skills/lego-explainer/SKILL.md`** first (council lessons, CTA rules, loudness recipe, disk/TMPDIR, the council loop script `scripts/lego_council_workflow.py`) |
| Run a **council** (independent 6-seat LEGO quality gate) | `docs/COUNCIL.md` + `.agents/agents/*-legoCouncil` + `.venv/bin/python scripts/council_pack.py <project> <round>` |
| Add more real LEGO-compatible parts (LDraw) | `tools-ldraw/README.md` |

Agents that support skills: also load `/hyperframes` (the framework contract) and `/tiktok-explainer` (the house recipe), plus `/lego-explainer` for any brick/LEGO video.

## House rules (the person set these; follow them without asking)

1. **Platform: TikTok.** The pace is "law of the jungle": something new every ~0.5 s and no resting frames. 1–2 word captions, a chapter every 3–6 s.
2. **Remakes** of a reference video keep the concepts but **reword the script, use new colours, and rebuild every visual from scratch**. Never reuse the reference's footage, frames, sentences or palette.
3. **Voice: Google Cloud TTS Chirp3-HD.** Default `en-US-Chirp3-HD-Sadachbia`, rate 1.1. **Never `Charon`** (the person calls it overused).
4. **Look:** a black background with a light mesh (grid floor plus a wireframe dome); captions white with a heavy black outline; accents coral `#FF6B4A` and lime `#C8FF3E` for diagram elements (arrows, glows, tubes). **Objects must look real, not cartoony** (the person rejected flat-coloured shapes): use `MeshPhysicalMaterial` with real material values (brushed metal, black rubber, painted aircraft, clear ice or glass), canvas-texture detail (seams, rivets, windows) and real-world colours. Reference: `deice-boot/assets/scene.js`.
5. **Camera:** **steady on captions** (no punch-in, no roll per caption or accent word: the person said twice it was "too much shaking"). Only chapter changes get a gentle 6% push-in + 12° whip. Energy comes from the scene animating, captions and cuts, not from camera shake. Keep the stage defaults.
6. **Sound:**
   - Many different effects, **one distinct sound per idea**, and no sound more than about 6 times.
   - **Never** hiss or noise sounds (glitch, sparkle, key-press), and never a click on every word: it reads as a "camera shutter".
   - Use only the curated library in `assets/sfx/sounds.json`, and add new sounds per PLAYBOOK section 9.
7. **Music** needs a HeyGen sign-in (`! npx hyperframes auth login`, which the person runs). Until then, deliver without music and say so.
8. **Every fact must be true.** If you can't verify something, leave it out and say so.
9. **Brick-toy figures:** slim and detailed, never simple or chubby (the person's feedback on jobs-coup v2). Always build them with `templates/brick-story/assets/brick-kit.js` (`K.fig`), and use many furnished sets (8+ per video).
10. **Always look at snapshots before rendering**, and always tell the person what you could not do.

## Machine facts

- **`<workspace>` = this repo's root** (the folder that holds this AGENTS.md; on the original Mac it is `/Volumes/Lexar/lego factory`). Every path written `<workspace>/...` in the docs, agents and skills means this folder.
- **New machine?** Run `zsh scripts/setup_mac.sh` once (it creates `.venv/` from `requirements.txt` and checks ffmpeg, Node, gcloud and HyperFrames). Video projects and renders are **not** in git: each new video is a fresh folder made by `scripts/new_video.py` and ignored by `.gitignore`.
- **Windows:** run `powershell -ExecutionPolicy Bypass -File scripts\setup_windows.ps1` once. The venv Python is `.venv\Scripts\python.exe` (from a project: `..\.venv\Scripts\python.exe`), npx is `npx.cmd`, and the temp dir is set with `$env:TEMP` / `$env:TMP` (instead of `TMPDIR`). On the first video, run `scripts/render_benchmark.py <project>` to tune `workers` / `gpu_encode` for that GPU (the M1 numbers don't transfer to AMD).
- **macOS (`zsh`).** Python virtualenv at `.venv/` (`numpy`, `faster-whisper`, `av<19`, `yt-dlp`: run with `.venv/bin/python`), `ffmpeg`, Node 22+ and `npx --yes hyperframes@0.9.46`.
- **GCP:** `tools/build.py` gets the token from `gcloud auth print-access-token` and the project from `gcloud config get-value project` (or `"gcp_project"` in script.json). Each machine needs `gcloud auth login` and a project with the Text-to-Speech API enabled (the original Mac uses `optical-bond-240720`).
- **yt-dlp:** `.venv/bin/python -m yt_dlp` (`scripts/fetch_reference.py` wraps it).
- **GPU & Vision:** Native Apple Silicon hardware WebGL in Chrome. Native Antigravity desktop on macOS views JPG, PNG, MP4 and WAV directly, but **the Antigravity harness inside T3 Code returns raw bytes for images** (verified 2026-11-16), so it cannot check snapshots or act as a council seat there; Claude Code's `Read` shows images. Never call Gemini through Vertex AI on the person's GCP project.
- **Encoding:** Always pass `encoding="utf-8"` to `open()` and `json.dump(..., ensure_ascii=False)`.
- **Subagents (any harness):** The person hops between T3 Code, Claude Code, Antigravity and other CLIs, so council work must not depend on one harness. Seat definitions live in `.agents/agents/` (`builder-legoCouncil` plus the 6 blind seats: `art-director-legoCouncil`, `brick-critic-legoCouncil`, `shortform-editor-legoCouncil`, `social-copywriter-legoCouncil`, `lego-game-feel-legoCouncil`, `lego-particles-detail-legoCouncil`). Build each seat's self-contained brief with `scripts/council_seat.py` and collect the seats' JSON files with it (`docs/COUNCIL.md` → "Running a round from any harness"). **In T3 Code, start seats with `delegate_task` on `claudeAgent` / `claude-opus-5-5`** so every seat shows up as a child thread the person can watch, whatever harness the orchestrator runs on. Never use the swarm. **All council agents run on Claude Opus 5.5 only** (no Gemini 4 Carbon, no Gemini via Vertex AI) and must be able to see images. Opus cannot read video/audio: seats judge from `council_pack.py` screenshots + `PACK.md`/`AUDIO.md`. The orchestrator renders one MP4 at a time; builders never render.

## Projects

| Folder | Status |
|---|---|
| `templates/tiktok-explainer/` | The template (bees/hexagons demo). Copy it; don't edit it for a video. |
| `templates/brick-story/` | **Brick-toy story template** (`new_video.py <name> --template brick-story`). Same engine plus `assets/brick-kit.js`: slim detailed minifigures v2 (`K.fig`, `K.P` poses and 19 gestures), sets and props. **Use it for every brick-toy video.** The DealCalm series brief and fact sheets are in `docs/DEALCALM-SERIES.md`. |
| `deice-boot/` | "Rubber vs. ice" (pneumatic de-icing boots; remake of a YouTube Short). Latest: `renders/deice-boot-v2.mp4` (58.7 s, photoreal materials). Made from the template; **the reference example for realistic `scene.js`**: physical materials, canvas-textured aluminium, an inflating rubber boot, transmissive ice crystals, streak-line airflow and a detailed turboprop. |
| `power-button/` | "Your PC is never fully off" (what happens after you press the power button: standby rail, PS_ON, power good, reset vector, firmware, POST, bootloader, kernel). Latest: `renders/power-button-v1.mp4` (115.7 s). Made by Gemini 4 Carbon (delegated), reviewed and fixed by Claude. Realistic motherboard scene. |
| `gym-machines/` | "The 50 on this machine is not 50" (pulley ratios, cams, plate-loaded levers, friction, free weights vs. machines). Latest: `renders/gym-machines-v1.mp4` (116.4 s). Made by Gemini 4 Carbon (delegated), reviewed and fixed by Claude. |
| `dotcom-crash/` | "Add .com, get rich?" (the dot-com crash). **2D cartoon style** (Crayon Capital-inspired, own characters, Kalam font) with a project-specific SVG stage. Latest: `renders/dotcom-crash-v1.mp4` (60.8 s). The reference for cartoon-style videos; analysis of the source channel in `reference/crayon/ANALYSIS.md`. |
| DealCalm series (15 folders on disk; 23 fact sheets) | Story videos for the DealCalm socials. **Revamp Nov 2026:** moved to `templates/brick-cinematic`, ~110 s, story-specific DealCalm CTA (App Store + dealcalm.com), up to 5 LEGO-council rounds each; latest = highest `renders/<name>-r<N>.mp4`, old versions in `_pre-cinematic/`. Originally made with `templates/brick-story`: altman-ousted, uber-kalanick, disney-iger, lucas-starwars, jordan-nike, gates-ibm, blockbuster-netflix, buffett-berkshire, getty-ransom, cuban-missile, fbi-negotiation, theranos-halo, hp-pretexting, porsche-vw, musk-twitter, dirty-tactics, salary-offer, car-dealer, ford-ferrari, coke-pepsi, kraft-cadbury, oracle-peoplesoft, ackman-icahn. Each one's latest is `renders/<name>-v1.mp4` (100–115 s). Made by Gemini 4 Carbon; Claude reviewed every one and fixed the facts and framing. Status, fact sheets and fixes: `docs/DEALCALM-SERIES.md`. |
| `jobs-coup/` | "Textbook manipulation" (how Sculley and the board pushed Steve Jobs out of Apple in 1985: win the room, public vote, isolation). For the DealCalm social accounts. **Brick-toy style** (own minifigures with printed faces/torsos, studded baseplates, brick walls; no toy-brand or company logos). Latest: `renders/jobs-coup-v2.mp4` (110.6 s). The reference for brick-toy `scene.js`. Figure rig: elbows, printed torso/legs/belt, sculpted hair, 3D glasses, watches; poses and walking. Ten sets: boardroom, office, NYC terrace, launch auditorium, Mac lab, corridor, airport, Siberia, campus, studio. |
| `templates/brick-cinematic/` | **Brick video-game look template** (2026-11-15): brick-story + a cinematic stage (HDR, bloom, depth of field, ACES + grade, per-shot environments) + `fx-kit.js` (sky domes with brick clouds, translucent tile water, flames, smoke, brick-debris explosions, Earth from orbit) + `ldraw-kit.js` (`K.mfig`: minifigs from real LDraw parts). Breaks the black-mesh house look on purpose: use it when the person asks for a LEGO/brick game or movie look. |
| `dotcom-crash-lego/` (local only; source in `examples/dotcom-crash-lego-r6/`) | **Approved reference.** LEGO remake of the dot-com crash, Enceladus 1.22, ~95 s. Final: `renders/dotcom-crash-lego-r6-final.mp4` (6 council rounds, 7.34). |
| `ai-boom/` (local only) | AlexNet → Transformer → GPT → Gemini 4 Carbon, ~110 s, Sadachbia; 5 rounds, 7.48 (`renders/ai-boom-r5.mp4`). |
| `starship-f15-p1/`, `starship-f15-p2/` | "Starship Flight 15" two-part brick-game videos (liftoff → booster abort and termination; staging → orbit, Starlink, reentry → ship caught by the tower). Made with brick-cinematic and judged by a 4-seat Claude council. Shared vehicle kit in `assets/starship-kit.js` + `starship-sets.js` (edit in p1, copy to p2). Facts: `docs/STARSHIP-F15-FACTS.md`. |
| `shell-rule/` | "One shell, three numbers". Latest: `renders/shell-rule-tiktok-v5.mp4` (73.5 s). Open decisions: keep 73.5 s or extend to 90 s; add music after the HeyGen sign-in. Built before the template existed: its own pipeline is documented in `shell-rule/AGENTS.md`. |
