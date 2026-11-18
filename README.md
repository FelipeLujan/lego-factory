# LEGO Factory: short-form video workspace (macOS)

This workspace makes vertical TikTok explainer videos with **HyperFrames** (HTML rendered to MP4) and three.js.

## Start here

| You are… | Read |
|---|---|
| An AI agent asked to make a video | `AGENTS.md` (house rules), then **`PLAYBOOK.md`** (do it step by step) |
| An AI agent asked to *delegate* a video | `docs/DELEGATION.md` (the brief to send + how to review the result) |
| The person | this file |

## Clone and set up on a new Mac

```zsh
git clone <remote> "lego factory" && cd "lego factory"
zsh scripts/setup_mac.sh        # .venv from requirements.txt + checks ffmpeg, Node 22+, gcloud, HyperFrames 0.9.46
gcloud auth login && gcloud config set project <your-project>   # Google Cloud TTS (Text-to-Speech API enabled)
```
On **Windows** (PowerShell): `git clone https://github.com/FelipeLujan/lego-factory.git; cd lego-factory; powershell -ExecutionPolicy Bypass -File scripts\setup_windows.ps1`, then `gcloud auth login`. On the first video, ask the agent to run `scripts/render_benchmark.py` to tune render settings for that GPU.

Then open the folder in Antigravity (`agy`) and ask for a video, for example *"Make 3 DealCalm TOFU videos: the Getty ransom haggle, anchoring explained, negotiating a raise"* (see `docs/DEALCALM-TOFU.md`). Another example: e.g. *"Make a LEGO-style explainer about the 2008 financial crisis, ~100 s, Enceladus voice, run the legoCouncil (max 5 rounds)."*

What Antigravity picks up from the repo automatically:
- `AGENTS.md`: the house rules (always loaded).
- `.agents/agents/*-legoCouncil/`: the builder + 6 blind council seats, which become subagent types.
- `.agents/skills/`: `lego-explainer` (all council lessons, props bar, triple hook, loudness, voices, render speed), `tiktok-explainer`, `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `motion-doctrine` and `reverse-any-video`. Claude Code reads `.claude/skills/` and `CLAUDE.md`.
- `templates/brick-cinematic/`: the LEGO engine and the shared props library (`assets/props-kit.js`).
- `scripts/lego_council_workflow.py`: the automated council loop (run via `run_workflow`).

**Not in git** (see `.gitignore`): video project folders, renders, council packs, voices, reference videos, `.venv/`, `.render-tmp/`. Paths in the docs are written `<workspace>/...` = the repo root on whatever machine you cloned to.

## Make a new video in four commands

```zsh
.venv/bin/python scripts/fetch_reference.py <youtube-url> <short-name>   # only when there is a reference video
.venv/bin/python scripts/new_video.py <project-name>                     # copies the template (--template brick-cinematic for brick-game look)
#   edit <project-name>/script.json, cues.json, assets/scene.js          (PLAYBOOK steps 2, 4, 5)
cd <project-name> && ../.venv/bin/python tools/build.py                  # voice, captions, cues, sound
npx hyperframes render -o renders/<project-name>-v1.mp4
```

## What's where

| Path | What |
|---|---|
| `PLAYBOOK.md` | The step-by-step recipe, with checks, rules, a visuals cookbook and fixes |
| `AGENTS.md` / `CLAUDE.md` | House preferences every agent must follow (voice, pace, look, sound) |
| `docs/DELEGATION.md` | How to hand a video to another agent (Claude Opus 5.5 only; no Gemini, no Vertex AI), and how to review it |
| `docs/COUNCIL.md` | The **LEGO council**: 6 blind review seats that score each render from screenshots (see below) |
| `docs/DEALCALM-SERIES.md` | DealCalm story series brief (format, CTA rule, visual rules) + every fact sheet |
| `templates/tiktok-explainer/` | **The template.** A working 23 s demo ("why bees build hexagons") with the full pipeline |
| `templates/brick-story/` | The older brick-toy story template on the black stage (`K.fig`). Kept for reference |
| `templates/brick-cinematic/` | **The LEGO video-game look** (use this for every brick video): HDR, bloom, tilt-shift depth of field, sky domes, brick water/clouds/puffs, real LDraw minifigures (`K.mfig`). `python scripts/new_video.py <name> --template brick-cinematic`; style guide in its `README.md` |
| `scripts/new_video.py` | Copies the template into a new project folder |
| `scripts/upgrade_to_cinematic.py` | Moves an existing brick-story project onto the brick-cinematic engine (backs up the old files to `<project>/_pre-cinematic/`) |
| `scripts/lego_council_workflow.py` | The automated council loop (builder → render → pack → 6 seats → feedback, max 5 rounds, resumable). Run with the agent's `run_workflow` tool |
| `.agents/skills/lego-explainer/` | **Lessons for LEGO videos**: most-flagged council defects, CTA rules, loudness recipe, voices, disk/TMPDIR |
| `scripts/setup_mac.sh`, `scripts/setup_windows.ps1` | One-time setup after cloning |
| `scripts/render_benchmark.py` | Tunes render workers / GPU encoding for the current machine |
| `scripts/series_badge.py` | Adds the "DEALCALM STORIES" corner stinger |
| `queue.example.json` | Template for `queue.json`, the work queue of the non-stop council daemon (see `docs/DEALCALM-TOFU.md`) |
| `output/` (local, not in git) | **Finished videos to post**: `dealcalm-stories/<slug>.mp4 + .POST.md` (TOFU), `dealcalm-long/`, `other/`. Filled by `scripts/sync_output.py` (the council loop runs it after every finished video) |
| `examples/` | **Approved reference videos** (source + stills): `dotcom-crash-lego-r6` (overall bar), `disney-iger-r7` (props bar) |
| `docs/DEALCALM-TOFU.md` | **The main production brief**: DealCalm top-of-funnel videos |
| `scripts/council_pack.py` | Turns a render into a council review pack (`<project>/council/r<N>/`: contact sheets, chapter stills, motion strips, AUDIO.md, PACK.md) |
| `.agents/agents/*-legoCouncil/` | The council subagents: `builder-legoCouncil` (makes/fixes the video) + 6 blind seats (art director, brick critic, short-form editor, social copywriter, LEGO game feel, particles & detail) |
| `scripts/fetch_reference.py` | Downloads, transcribes and contact-sheets a reference video |
| `shell-rule/` | The first finished video ("One shell, three numbers"), an advanced example |
| `reference/` | Downloaded reference videos (untrusted data) |
| `.claude/skills/`, `.agents/skills/` | Agent skills: the HyperFrames set, plus `tiktok-explainer` (the house recipe) |

## Inside a video project (made from the template)

| File | Who edits it | What |
|---|---|---|
| `script.json` | **you / the agent** | The words, the voice and the speed |
| `cues.json` | **you / the agent** | What happens on which spoken words: chapters, slams, name tags, sounds, accent words, hook and end titles |
| `assets/scene.js` | **you / the agent** | The 3D visuals |
| `index.html` | rarely | Colour variables; the music line |
| `tools/build.py` | nobody | Runs the whole pipeline: TTS, word timings, captions, cues, overlays, sound bed |
| `tools/tts.py`, `tools/words.py` | nobody | Google Cloud TTS; faster-whisper word timings |
| `compositions/stage.html` | nobody | The stage: lights, camera energy (whips, drift); in brick-cinematic also HDR, bloom, depth of field and the per-shot `look` |
| `assets/film.js` | nobody | Timing helpers (`F.at`, `F.sample`, `F.win`, `F.kick`) |
| `assets/sfx/` | add sounds only | The curated, hiss-free sound library (`sounds.json` lists them; `CREDITS.md`) |
| `compositions/captions.html`, `compositions/hud.html`, `assets/cues.js`, `assets/sfx/sfx-bed.wav` | **generated**, never edit | Rebuilt by `tools/build.py` |
| `renders/` | output | Finished MP4s |

## The LEGO council (quality gate for brick videos)

1. `builder-legoCouncil` writes or fixes `script.json`, `cues.json` and `assets/scene.js`, runs `tools/build.py`, `hyperframes check` and looks at snapshots. It never renders: the orchestrator renders **one video at a time** (the GPU is shared).
2. The orchestrator renders `renders/<project>-r<N>.mp4` and runs `scripts/council_pack.py <project> <N>`.
3. Six **blind** seats review the pack in separate conversations (they never see each other, the code or earlier rounds) and score 7 topics from 0 to 10: visual craft & lighting, brick-world fidelity, LEGO game look & feel, particles & micro-detail, motion & set continuity, pacing/HUD/sound, hook/copy/retention/CTA.
4. Their findings go back to the builder for the next round. **At most 5 rounds per video.**

**Models:** every council agent (builder and all six seats) runs on **Claude Opus 5.5**. Opus cannot watch video or listen to audio, so it judges from the screenshot pack (contact sheets every 1.5 s, chapter stills, 8-frame motion strips) and the text reports (`PACK.md` with the script and loudness, `AUDIO.md` with the level/hiss meter). Do not use Gemini (4 Carbon or via Vertex AI) for these videos.

Score tables for every round of the DealCalm revamp are kept in the orchestrator's report (`dealcalm_revamp_report.md`) and raw JSON in each project's `council/r<N>/scores.json`.

## DealCalm series (brick story videos)

15 project folders (altman-ousted, blockbuster-netflix, buffett-berkshire, car-dealer, coke-pepsi, cuban-missile, dirty-tactics, disney-iger, fbi-negotiation, ford-ferrari, gates-ibm, getty-ransom, hp-pretexting, jobs-coup, jordan-nike) promote the **DealCalm** negotiation app on Instagram Reels and YouTube Shorts. Since the November 2026 revamp each one:
- runs on `templates/brick-cinematic` (full LEGO environments, LDraw minifigures),
- is about **110 s** long,
- ends with a story-specific spoken CTA, e.g. *"And if you don't want to get pushed out of your own company like Steve Jobs, sharpen your communication and negotiation skills with Deal Calm, on the Apple App Store and at deal calm dot com."*, plus an end card `DealCalm · App Store · dealcalm.com`,
- keeps the old version in `_pre-cinematic/` and `renders/<name>-v1.mp4`; new renders are `renders/<name>-r<N>.mp4` (the highest N is the latest).

## Requirements on this machine (already set up)
gcloud (authenticated) · Python 3.12 with numpy and faster-whisper · ffmpeg · Node + `npx hyperframes` · Chrome with GPU. Music needs a free HeyGen sign-in: `npx hyperframes auth login`.
