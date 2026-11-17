# The LEGO Video Council (`*-legoCouncil`)

Use this independent blind 6-seat council (plus `builder-legoCouncil` for authoring/fixes) whenever creating or gating a LEGO-style explainer video in `<workspace>`.

**Read `.agents/skills/lego-explainer/SKILL.md` first**: it has the most-flagged defects, the loudness recipe, the CTA rules and the infra lessons.

**Models:** every council agent (builder + 6 seats) runs on **Claude Opus 5.5 only**: no Gemini 4 Carbon, no Gemini via Vertex AI, and **no swarm**. Opus can't watch video or hear audio, so seats judge from screenshots + text reports.

## Local Workspace Subagents (`.agents/agents/`)

| Subagent Name | Role | Mode |
|---|---|---|
| `builder-legoCouncil` | **LEGO Explainer Producer & Scene Author** — scaffolds `brick-cinematic` / `brick-story`, writes `script.json`, `cues.json`, `assets/scene.js`, runs `build.py` + `snapshot` + `hyperframes check`. | Read/Write |
| `art-director-legoCouncil` | **Seat 1: Art Director & Cinematographer** — 9:16 TikTok safe zones, moody key/rim/practical lighting, HDR/bloom discipline, horizon/shader cleanliness. | Blind Read-Only |
| `brick-critic-legoCouncil` | **Seat 2: Brick Construction & Toy Fidelity Critic** — 100% brick-built geometry, stud/tile relief, Technic trusses, scale harmony, non-clipping LDraw minifigs, zero Z-fighting. | Blind Read-Only |
| `shortform-editor-legoCouncil` | **Seat 3: Short-Form Retention Editor & Sound Designer** — 0.5 s beat rhythm, continuous motion across `motion-*.jpg`, steady-caption camera rule, HUD collisions, `-16 LUFS` / `<= -1.0 dBTP` / `0` hiss / zero dead-air audio mix. | Blind Read-Only |
| `social-copywriter-legoCouncil` | **Seat 4: Social Media Copywriter & Viral Strategist** — scroll-stopping 0–3 s hook, post-hook stakes, curiosity loops, and subtle, high-converting end-of-video CTA (supplies exact replacement lines whenever `< 9.0`). | Blind Read-Only |
| `lego-game-feel-legoCouncil` | **Seat 5: LEGO Video-Game Look & Feel Critic** — TT-Games cutscene benchmark (`reference/user-attachments/`), set-dressing density, tactile ABS/metallic shaders, playful game-mission staging. | Blind Read-Only |
| `lego-particles-detail-legoCouncil` | **Seat 6: LEGO Particles, FX & Micro-Detail Critic** — brick-built flames/plumes, `1x1` stud steam/vapor, glowing sheaths, brick debris/shockwaves, water/glint artifact hunting, micro-props & decals. | Blind Read-Only |

## How to Run a Council Round

1. **Render & Pack:**
   ```zsh
   cd "<workspace>/<project>"
   TMPDIR="<workspace>/.render-tmp/" npx --yes hyperframes@0.9.46 render --output renders/<project>-r<N>.mp4 --fps 30 --quality standard
   .venv/bin/python "<workspace>/scripts/council_pack.py" <project> <N>
   ```
2. **Convene All 6 Blind Seats in Parallel** (each seat is its own `invoke_subagent` / workflow `agent(type_name="<seat>")` conversation, never the swarm):
   - Pass ONLY `<project>/council/r<N>/PACK.md`, `<project>/council/r<N>/AUDIO.md`, the project's fact sheet, and `<workspace>/reference/user-attachments/`.
   - **Claude-Safe Screenshot Rule:** Seats inspect `.jpg`/`.png` screenshots and `.md` reports only—never `.mp4` or `.wav` binaries.
   - **Strict Blindness:** Never share prior round scores, other seats' reviews, or the Director's private pass mark.
3. **Unified 7-Topic Scorecard (`0.0–10.0`, shown as a 6-column table after every round):**
   1. `visual_craft_lighting` — Visual Craft, Lighting & Framing
   2. `brick_world_fidelity` — Brick Construction & Toy Fidelity
   3. `lego_game_look_feel` — LEGO Video-Game Look & Feel
   4. `particles_micro_detail` — LEGO Particles, FX & Micro-Detail
   5. `motion_sets_continuity` — Motion, Sets & Continuity
   6. `pacing_hud_sound` — Short-Form Pacing, HUD & Sound Mix
   7. `hook_copy_retention_cta` — Hook, Copywriting, Retention & Subtle CTA
4. **Director Fact Check & Gate:** Because `social-copywriter-legoCouncil` replaced the dedicated fact checker, the coordinator/director verifies every script change against the project's fact sheet before building the next round, and always prints the full 6-reviewer score table at the end of each round.


## Running a round from any harness (T3, Claude Code, Antigravity, Codex)

The person switches between harnesses, CLIs and T3 Code, so a round must never depend on one harness's agent registry.
`scripts/council_seat.py` produces the **same** briefs, schema, table and gate as `lego_council_workflow.py` (it loads that
file as the single source of truth), and seats hand back results as **files**, so any harness can drive the round:

```zsh
PY=.venv/bin/python; S="<workspace>/scripts/council_seat.py"
$PY $S prompts <slug> <N>          # -> <slug>/council/rN/seats/<seat>.prompt.md (seat agent.md + fact sheet + output contract)
$PY $S task <slug> <N> <seat>      # the short task text for each seat agent
# ... start the 6 seats (table below); each writes <slug>/council/rN/seats/<seat>.json ...
$PY $S collect <slug> <N>          # validate -> council/rN/scores.json + SCORES.md, prints the 6-seat table + gate (exit 2 if < 6 valid)
$PY $S feedback <slug> <N>         # builder brief for round N+1
```
(Non-DealCalm videos: add `--brief <abs path of the brief + fact sheet .md>`.)

**Hard requirement: seats must SEE images.** Every seat is screenshot-only. Verified 2026-11-16: the Antigravity
harness inside T3 Code (ACP) never hands image pixels to the model. `view_file` returns raw JPEG bytes, and MCP image
results (e.g. `html_preview` screenshots) are offloaded to a file instead of shown. The model (Opus 5.5) can see images;
this harness just doesn't deliver them, and its subagents use the same tools. The seat brief makes a seat write
`{"blocked": ...}` instead of guessing, and `collect` reports it. Never average guessed scores.

**Quota:** the `claudeAgent` route below bills the person's Claude (Claude Code) account, not Antigravity. If only
Antigravity Opus quota is available, run the visual seats and the builder's snapshot checks in the **Antigravity
desktop app**, which shows images; text-only steps (copy, audio report, fact check, edits) can stay in T3.

| Where you are | How to start the 6 seats | Seats visible? |
|---|---|---|
| **T3 Code (any harness: Claude, Antigravity, ...)** | `delegate_task` ×6, `target: {providerInstanceId: "claudeAgent", model: "claude-opus-5-5"}`, `role: "review"`, `mode: "async"`, `title: "Council rN · <slug> · <Seat>"`, `task` = output of `council_seat.py task`. Wait for completion wake-ups (no polling), then `collect`. | **Yes**, each seat is a child thread in T3 |
| Claude Code CLI (outside T3) | 6 parallel `Agent` calls (general-purpose), prompt = `council_seat.py task` output | In the CLI transcript |
| Antigravity desktop (image-capable `view_file`) | `invoke_subagent` with the `.agents/agents/` seat types and the `task` text, or the whole loop via `run_workflow` (below) | In Antigravity |
| Codex / others | Any subagent that can view images, same `task` text; otherwise hand the round to T3 | Varies |

The orchestrator (whoever you are) still renders one MP4 at a time with the GPU lock, runs `council_pack.py`, fact-checks
script changes, and acts as builder (or delegates the builder with `builder_brief` from the workflow script).

## Automated loop (many videos)

Run `scripts/lego_council_workflow.py` with the `run_workflow` tool (`ScriptPath` + `Args`: `videos`, `max_rounds` 5, `concurrency` 4, `report`, `resume`):
- builder turn (no render) → the orchestrator renders (one GPU lock, temp files on Lexar) → `council_pack.py` → 6 seats in parallel → score table appended to the report + `council/r<N>/scores.json` → findings back to the builder.
- `resume: {slug: {round, feedback_round, render_first, reuse_render, note}}` restarts after a crash from the saved scores.
- **Private gate:** every seat's average ≥ 8.0 and no topic < 7.5. Never revealed to seats or builders. **Hard cap: 5 rounds per video.**
- **Expect** round 1 to land about 5.9–6.3 and round 5 about 6.9–7.1 (DealCalm revamp, 12 videos at the cap, none passed). Most of the gain comes in rounds 1–3, so fix the skill's section-4 list before round 1.
- **Disk:** check `df -h /System/Volumes/Data` for ≥ 20–25 GB free before a batch. Agent logs grow 1–5 GB/hour on the internal disk; pause below about 3 GB (never delete the person's files).
- **Draft renders:** council rounds render at 10 fps, 1.0× pixel ratio, 4 workers, `--gpu` encode (about 1:20 for 110 s, instead of about 6 min). The loop ends with one 30 fps full-quality `renders/<slug>-r<N>-final.mp4`, which is the file to post. Packs are capped at 16 chapter stills (540 px) to save SSD space; env `COUNCIL_MAX_STILLS` overrides.
