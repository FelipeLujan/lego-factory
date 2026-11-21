# gemini-4-neon: "Gemini 4 Neon, the model in the middle" (brief + fact sheet)

LEGO / brick video-game style explainer (`templates/brick-cinematic`), made by `builder-legoCouncil` and judged by the 6-seat
legoCouncil (Claude Opus 5.5, screenshots only). This is **not** a DealCalm video: there is no DealCalm CTA and no series badge.
Researched 2026-11-18 (launch day) from ~70 fetched pages: Google's blog, the model card, the evals PDF, the Gemini API and Cloud docs,
the Antigravity blog/forum, Artificial Analysis, Vals, Zapier, Andon Labs, Cursor, OpenRouter, GitHub and press. Full notes with a
URL and a verbatim quote for every fact: `docs/facts/gemini-4-neon-sources/NOTES-primary.md`, `NOTES-press.md`, `NOTES-demos-safety.md`.

## Brief
- **Length:** about 108–115 s (voice about 105–112 s plus the 2.4 s end hold). **Hard cap: the whole video must stay under
  120 s** (YouTube Shorts limit); acceptable window 100–118 s. Vertical 1080x1920, 30 fps.
  Voice **`en-US-Chirp3-HD-Enceladus`** (the person's choice, as on the approved dotcom-crash-lego). Enceladus is a slow voice: use a
  natural rate of about 1.2–1.25 and fit the length with the script, not by speeding the voice up (never Charon).
- **Angle:** Google's fourth Gemini 4 model in seven weeks is the one *in the middle*: near-frontier brains, faster and cheaper per
  task. The curiosity loop: *it costs MORE per token than its big brother Carbon right now, yet Google says it's 32% cheaper per task.
  How?* (Payoff: it finishes faster with fewer tokens.)
- **Story arc (in this order):**
  1. **Hook (0–3 s):** a dark lab; a glass tube flickers and ignites reddish-orange (real neon's colour). Spoken idea (≤ 14 words,
     rewrite freely): "Google just shipped its fourth new AI in seven weeks. Meet the middle child." Text hook adds a number, e.g.
     "4 MODELS · 49 DAYS" (never repeats line 1).
  2. **The family (Gemini 4 = elements):** Argon (Sep 30), Carbon (Oct 28, the deep thinker), Hydrogen (Nov 12, the fast one),
     Neon (Nov 18). Carbon = hardest long projects, Hydrogen = fast everyday work, Neon = "balances depth and efficiency".
     Google's own launch demo was a lab bench: Bunsen flames for Carbon and Hydrogen, glowing gas tubes for Argon and Neon.
     Lineage: Neon is adapted from Carbon (model card).
  3. **What it is:** 1-million-token context; reads text, images, video, audio and PDFs; answers in text; four thinking levels
     (low, medium, high = default, extra high).
  4. **The price twist:** $3 in / $15 out per million tokens. Carbon is $2 / $10 until Nov 30 (then $4 / $20), so per token Neon costs
     more today; yet at its default level Google reports a 32% lower cost per task than Carbon. Why: Artificial Analysis measured about
     110 vs 57 output tokens per second and about 21 vs 36 minutes per task.
  5. **The scoreboard (independent):** #3 on the Artificial Analysis Intelligence Index (61); #1 on its Coding Agent Index by a hair
     (58.64 vs 58.47); #1 on Vending-Bench 2 (turned $500 into $16,843 in a simulated year of running a vending business). Honest beat:
     not #1 everywhere (Claude Opus 5.5 edges it on Terminal-Bench 4.1, 65.8% vs 65.2%).
  6. **Neon plans, Hydrogen builds:** in Google Antigravity, Orchestrator pairs Neon as planner with Hydrogen as executor; if Hydrogen
     hits friction it hands back to Neon to repair the plan.
  7. **What it built (demo montage, 1–3 of these):** a ski simulator on real Mont Blanc / Chamonix terrain (10,200 lines of shaders,
     zero pre-made assets); Alan Turing's 1936 room at King's College, Cambridge, in 3D; a photo turned into a 100,000-cell spreadsheet
     running 500,000+ formulas.
  8. **Trust:** 0.0% cheating on Terminal-Bench 4.0; 99.2% pass rate on Google's agent-honesty eval; its lowest fabrication rate yet
     (internal Antigravity testing).
  9. **Where:** the paid Gemini API, the Gemini app for Google AI Pro / Ultra, Google Antigravity. No free API tier.
  10. **Ending:** a one-line callback to the hook (the neon tube / "the middle child"), then a subtle follow pull, e.g. "Follow for
      more AI, built brick by brick." No sales pitch, no invented "part 2".
- **Sets (8+, fully dressed, brick-built; one brick metaphor per idea, cause → effect in every shot):**
  - **Elemental lab bench** (hook + family; revisit at the end): black-tile bench, four stations with masking-tape labels HYDROGEN,
    CARBON, ARGON, NEON; brick Bunsen burners (Carbon = tall yellow-orange flame, Hydrogen = an almost invisible pale-blue flicker);
    Argon = violet glowing tube, Neon = reddish-orange glowing tube; a black power box with a red "5,000 V" warning tile and a lever.
    (Real chemistry, safe as general knowledge: neon glows reddish-orange, argon violet/lilac; neon's atomic number is 10.)
  - **Release calendar wall / periodic-table wall:** four element tiles (Ar, C, H, Ne) slam onto a brick calendar Sep 30 → Nov 18.
  - **Family tree / foundry:** Argon → Carbon → Neon and Hydrogen as brick castings or a branching brick tree.
  - **Million-token intake:** a conveyor of text, image, video, audio and PDF bricks flowing into a glowing orange core; a big
    4-position thinking dial (LOW / MED / HIGH / XHIGH).
  - **Race track / price scale:** Carbon vs Neon go-karts or runners; a tokens-per-second gauge 57 vs 110; a coin stack per token
    (Neon taller) vs a coin stack per task (Neon shorter): the twist made physical.
  - **Scoreboard arena:** a podium with #3, a photo-finish for the coding index, a flag for "not #1 everywhere".
  - **Brick vending shop:** a vending machine whose cash display climbs $500 → $16,843.
  - **Construction site (Orchestrator):** an orange-torso foreman minifig with a blueprint directing pale-blue worker minifigs; one
    worker trips a red fail light, runs back, the foreman redraws the plan.
  - **Demo montage:** a brick Mont Blanc ski slope with a carving skier and a slab avalanche of white plates; a Gothic brick college
    room (Turing's study, 1936: bookshelves, lamp, a tape of black/white tiles); a wall of 1x1 tiles as spreadsheet cells.
  - **Safety vault / honesty scale** for the trust numbers.
  - **Ending studio:** a big brick phone with a generic chat app and a model picker (AUTO / HYDROGEN / NEON / CARBON), the neon tube
    glowing on the wall.
- **People:** keep real people minimal. Generic minifigs (lab tech, foreman, workers, skier, shopkeeper) carry the story. If Alan
  Turing appears it is in the 1936 room, neutral. Company and product names (Google, Gemini, Antigravity, Claude, GPT, Artificial
  Analysis) may be spoken and shown in captions / HUD chips; 3D signs show generic words only (LAB, DATA, RACE, SHOP). **No logos**
  (Google, DeepMind, Anthropic, OpenAI, toy brands). Element tile symbols (Ar, C, H, Ne) are fine.
- **Numbers on screen:** chips carry exact figures (1,048,576 · $3 / $15 · 58.64 vs 58.47 · $16,843); the voice can round.
  Write numbers in script.json the way TTS should say them ("three dollars", "a million tokens", "extra high").

## Facts (the ONLY facts the script may state; keep the hedges and attributions)
**Launch**
- Google announced Gemini 4 Neon on **November 18, 2026** (blog post by Koray Kavukcuoglu, SVP of Google DeepMind and Chief AI
  Architect). Tagline: "frontier-level intelligence with fast end-to-end task completion across complex software engineering,
  knowledge work, and science workflows." API model ID `gemini-4-neon`, generally available the same day.
- It reached the paid Gemini API in Google AI Studio, Gemini for business, Google Antigravity (paid Google AI Pro and Ultra), and the
  Gemini app for Google AI Pro and Ultra subscribers (pick it from the model drop-down). There is **no free API tier**. GitHub Copilot
  also added it on launch day (Pro+, Max, Business, Enterprise). A cyber-defence version goes to vetted defenders through Google's
  Fairwind Program "in the coming days".
- Execs on X, launch day (quotes, attribute exactly): Demis Hassabis: "Alchemy at its finest..."; Logan Kilpatrick: "punching above its
  model class"; Paige Bailey: "Atomic number is 10 out of 10."

**The Gemini 4 family (Google's dates and words)**
- Argon: announced Sep 30, 2026 (first to cyber defenders), broadly available Oct 13. Carbon: announced Oct 28 ("our strongest
  model"), broadly available Nov 10. Hydrogen: Nov 12 ("fast everyday execution", "bringing Gemini 4 to everyone", incl. a free tier).
  Neon: Nov 18. So **four Gemini 4 models in 49 days (about seven weeks)**; Neon came one day after OpenAI's GPT-6.2 (Nov 17).
- Google's positioning: "While Carbon tackles your hardest, long-horizon projects and Hydrogen handles fast everyday execution, Neon
  balances depth and efficiency." The API docs say it "sits between Gemini 4 Hydrogen and Gemini 4 Carbon". Antigravity calls it "the
  sweet spot".
- Lineage (model cards): Neon is "adapted from Gemini 4 Carbon"; Hydrogen is also adapted from Carbon; Carbon is "based on Gemini 4
  Argon", a sparse mixture-of-experts transformer trained on Google's TPUs.
- Google's own launch demo: Neon, driving Blender in Antigravity, built a photorealistic 3D lab bench of the four names "with elemental
  accuracy": Bunsen flames for Carbon and Hydrogen, high-voltage gas discharge tubes for Argon and Neon.

**What it is**
- Context window about 1 million tokens (exactly 1,048,576, shared by input and output). Reads text, images, video, audio and PDFs;
  outputs text only (no image or audio generation). Knowledge cutoff March 2026.
- Four thinking levels: low, medium, high (the default) and extra high ("xhigh"). Only Neon and Hydrogen have extra high; Carbon and
  Argon top out at high.

**Price and speed**
- $3 per million input tokens, $15 per million output tokens, flat across the whole window; cached input $0.15 (a 95% discount).
- Hydrogen is $1.50 / $7.50 (Neon is exactly double). Carbon is $2 / $10 until November 30, 2026, then $4 / $20 from December 1. So
  per token Neon costs more than Carbon today and less from December.
- Google: at its default high level Neon has "a 32% lower cost per task than Carbon", and roughly 50% to 80% lower cost per task than
  top competing frontier models (Google's claim; say "Google says").
- Artificial Analysis measured Neon at about 110 output tokens per second vs about 57 for Carbon, and about 21 minutes per task vs
  about 36 for Carbon (about 40% less time).

**Scores (always name who measured)**
- Artificial Analysis Intelligence Index: Neon 61 at extra high, **#3**, behind Claude Fable 5.2 (65) and GPT-6.2 Astra (62)
  (Artificial Analysis leaderboard, Nov 18).
- Artificial Analysis Coding Agent Index: Neon **#1** at 58.64 vs 58.47 for Claude Fable 5.2: "by a hair".
- Vals Index: #2 (70.9%). Neon is #1 on Vals' Legal Research Bench and Tax Agent Bench.
- Andon Labs' Vending-Bench 2 (a long simulated year running a vending business from $500): Neon **#1 with $16,843**.
- Zapier's AutomationBench: #1 (56.3%).
- Arena's new Agent Arena Index: #2 with 1336 across 4,200+ real agent sessions.
- Not #1 everywhere (Google's own table): Claude Opus 5.5 scores 65.8% vs Neon's 65.2% on Terminal-Bench 4.1 and edges it on
  FrontierCode 2.0; GPT-6.2 Sol beats it on Chartography (75.1% vs 73.5%).
- Long context (Google's table): GraphWalks 256K–1M tokens, Neon 95.2% vs Opus 5.5 66.8% vs GPT-6.2 Sol 80.1%.

**Neon plans, Hydrogen builds (Google Antigravity)**
- Orchestrator pairs "Gemini 4 Neon as the planner with Gemini 4 Hydrogen as the executor in a single session." "If Hydrogen hits
  friction, it hands back to Neon to inspect state, repair the plan, and resume execution."
- Neon can also direct parallel Hydrogen subagents; in Antigravity it is the default model for new conversations on plans that include it.

**What it built (Google's launch demos, made in Antigravity)**
- A first-person WebGL2 freeride ski simulator on real Mont Blanc and Chamonix elevation terrain: 10,200 lines of custom shaders,
  120 Hz ski physics across six alpine lines, slab avalanches, zero pre-made assets.
- Alan Turing's 1936 study at King's College, Cambridge, recreated in interactive 3D from archival photos, from King's Chapel outside
  to Room X.8 inside. (History: Turing's paper "On Computable Numbers" is from 1936. The Turing machine was an idea on paper: if
  shown, say it is the machine he imagined; never call it a real 1936 machine.)
- A single image turned into a 100,000-cell Google Sheet with zero embedded images and zero code scripts: 500,000+ live formulas doing
  edge detection, 3D depth and relighting across six modes.
- In the Gemini app: "Tasks" can run on Neon, e.g. analysing billing statements to spot why a utility charge spiked.

**Trust (Google's numbers; say "Google reports")**
- 0.0% cheating on Terminal-Bench 4.0 (matching Carbon); shortcuts on 2.45% of tasks on Google's coding-cheating eval, the lowest of
  any Gemini 4 model; 0.09% misaligned-action rate; 99.2% pass rate on Google's agent-honesty eval; "our lowest fabrication rate yet"
  in internal Antigravity testing.
- With real-time safeguards at its highest thinking level, Neon resisted every attack in Gray Swan's prompt-injection benchmark (0.0%).
- Refuses little legitimate work: 1.98% of tasks on Terminal-Bench 4.0.

## Do not say
- **Why** the models are named after elements (Google never explained it). Basic chemistry is fine (neon glows reddish-orange, atomic
  number 10), but never as Google's reason.
- "Neon replaces Argon" or "Argon is retired" (no deprecation announced; only 9to5Google says Neon replaces it in the app picker).
- Neon vs Carbon on the AA index using Google's numbers (61 vs 59 are different index versions). Allowed: "on Artificial Analysis's
  current leaderboard, Neon at extra high scores 61, one point above Carbon's 60". Never "Neon is cheaper than Carbon per token" (not until Dec 1).
- "3x faster than Carbon at 60% of the cost" (press claim, not in Google's post; AA shows ~1.9x the output speed).
- SWE-sweep 39% without "in Google's own Antigravity harness" (neutral harness: 12.8%) — simplest: leave it out.
- "Smartest AI in the world", "beats everyone", anything about who is "winning" the AI race.
- Neon's output speed or cost from sources other than Artificial Analysis / Google; any Arena median-cost figure; Surge AI rankings.
- That a real "working Turing machine" existed in 1936; any private scene, gesture or quote by a real person beyond the X quotes above.
- A release time, user counts, training compute, parameter counts or training-data claims (none are published).
- That Neon's full safety report is out (it is "coming in the coming days").
