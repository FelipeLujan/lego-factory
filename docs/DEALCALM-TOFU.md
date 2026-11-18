# DealCalm top-of-funnel (TOFU) LEGO videos: the production brief

**Goal:** grow the DealCalm Instagram / YouTube Shorts / TikTok audience with strangers who have never heard of DealCalm.
Entertain and teach first; the brand is remembered, not sold. (Decided with the person, 2026-11-17.)

## Format (every TOFU video)
| Item | Rule |
|---|---|
| Length | **60–75 s** (voice about 57–72 s plus the 2.4 s end hold). One story or scenario, 1–2 tactics. |
| Topics | (1) negotiation / power / manipulation **history stories** (coups, deals, standoffs); (2) **tactic explainers** with no single story (anchoring, the flinch, BATNA, silence, deadlines…); (3) **everyday scenarios** (salary, car dealer, rent, freelancer rates, refunds…). |
| Voice | `en-US-Chirp3-HD-Sadachbia`, rate about 1.1 (never Charon). |
| Look | `templates/brick-cinematic`, LDraw minifigs, quality bar = `examples/dotcom-crash-lego-r6/` (overall: a visual brick metaphor for every beat, cause → effect shots, a callback loop) + `examples/disney-iger-r7/` (props; `assets/props-kit.js`: ≥ 6 asset types per set, ≥ 3 unique to that set). 5–7 sets fit 60–75 s. |
| Hook | **Triple hook** in 0–3 s: visual reveal from frame 0, spoken line 1 ≤ 14 words, hook title that adds (never repeats) and works on mute. |
| Brand recall | **Series stinger:** a small "DEALCALM STORIES" badge in the top-left corner for the first ~3 s (`scripts/series_badge.py <slug>`). |
| CTA (soft) | The story's takeaway line, then ONE short brand line, e.g. *"Practice moves like this with Deal Calm."* (≤ 8 words; spoken "Deal Calm"). **No "App Store" read-out, no URL read-out.** The end card shows `DealCalm` / `App Store · dealcalm.com`. A generic DealCalm host minifig may appear on the end set; never the real person from the story. Never claim "free". |
| Post copy | `POST.md` per video: an Instagram/Shorts caption (hook line + 2–3 lines + soft CTA "link in bio / dealcalm.com"), 5–8 hashtags, and a pinned comment that asks a question. |
| Council | 6 blind Opus seats, **max 3 rounds** (most of the gain lands in rounds 1–3), council drafts at 10 fps, then one 30 fps `-final.mp4`. |
| Production | Batches of **2–3 videos** per run. |

## Facts
- The agent researches each topic with web search and writes `docs/facts/<slug>.md`: brief, verified facts with sources, hedges, and an UNSURE list.
- It **proceeds without waiting** for review. Anything unsure is left out of the script automatically.
- Everyday scenarios and tactic explainers state only well-documented negotiation research (name the source: Harvard PON, Kahneman & Tversky, *Getting to Yes*, FBI CNU, etc.) or present the scenario as a dramatized example ("Imagine…"), never invented statistics.
- The 23 existing fact sheets in `docs/DEALCALM-SERIES.md` can be reused; cut them down to 60–75 s.

## How to ask for videos (any machine)
> "Make 3 DealCalm TOFU videos: (1) the Getty ransom haggle, (2) anchoring explained, (3) negotiating a raise."

The agent then runs `scripts/lego_council_workflow.py` with `topics` (research → fact sheet → scaffold → builder → 3 council rounds → final render → POST.md). See `docs/COUNCIL.md`.

## Non-stop production (daemon) and output
- Copy `queue.example.json` to `queue.json` (git-ignored), list the videos, then run `scripts/lego_council_workflow.py` via `run_workflow` with `{"queue_file": "<workspace>/queue.json", "concurrency": 3, "max_rounds": 10, "item_rounds": 3, "priority_note": "<engagement-first note + NO Vertex AI rule>"}`.
  It works the queue top to bottom, refills it with researched topics when empty, and runs until stopped. Edit `queue.json` any time.
- Finished videos are copied to `output/dealcalm-stories/<slug>.mp4` + `<slug>.POST.md` (and `output/dealcalm-long/`, `output/other/`) by `scripts/sync_output.py`. `output/` is local, not in git.
- **Never use Vertex AI** or any Gemini/LLM API on the person's GCP project. Cloud Text-to-Speech is the only Google API.
- First overnight run (Nov 17): 33 videos, mean council score 7.07, best silna-nba-deal 7.46. Lessons: `.agents/skills/lego-explainer/SKILL.md` §9.
