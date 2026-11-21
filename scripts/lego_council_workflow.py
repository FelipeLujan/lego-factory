"""LEGO council loop (DealCalm series): builder-legoCouncil + 6 blind legoCouncil seats, max N rounds per video.
Run with the run_workflow tool (NOT python directly):  ScriptPath = this file, Args = {
  "videos": ["slug", ...], "max_rounds": 5, "concurrency": 4,
  "report": "<abs path of the markdown score report>",        # default: <workspace>/council-report.md
  "resume": {"slug": {"round": N, "feedback_round": N-1, "render_first": bool, "reuse_render": bool, "note": "...", "cta": "..."}}}
All agents inherit the coordinator's model (must be Claude Opus 5.5). Renders are serialized (one GPU), temp files on the Lexar drive.
Seats see only council/rN screenshots + PACK.md/AUDIO.md + the fact sheet from docs/DEALCALM-SERIES.md. See .agents/skills/lego-explainer."""
import asyncio, functools, json, os, re, shutil, subprocess, time, traceback

WS = (globals().get("args") or {}).get("workspace") or (WORKSPACES[0] if globals().get("WORKSPACES") else os.getcwd())  # repo root
DOC = f"{WS}/docs/DEALCALM-SERIES.md"
A = globals().get("args") or {}
REPORT = A.get("report") or f"{WS}/council-report.md"
SCRATCH = A.get("scratch") or f"{WS}/.council-scratch"
MAX_ROUNDS = int(A.get("max_rounds", 3))   # TOFU decision 2026-11-17: most of the gain lands in rounds 1-3
VIDEOS = A.get("videos") or [
    "altman-ousted", "blockbuster-netflix", "buffett-berkshire", "jobs-coup", "jordan-nike", "gates-ibm", "disney-iger",
    "ford-ferrari", "coke-pepsi", "hp-pretexting", "getty-ransom", "cuban-missile", "fbi-negotiation", "dirty-tactics", "car-dealer"]
CONC = int(A.get("concurrency", 3))       # batches of 2-3 videos
TOPIC_REQ = A.get("topics") or {}             # {slug: "topic + category"} -> research -> docs/facts/<slug>.md -> scaffold -> council (TOFU)
TOFU = set(A.get("tofu") or []) | set(TOPIC_REQ)  # DealCalm top-of-funnel videos (docs/DEALCALM-TOFU.md)
if TOPIC_REQ and not A.get("videos"):
    VIDEOS = list(TOPIC_REQ)
WIN = os.name == "nt"
NPX = "npx.cmd" if WIN else "npx"
VPY = os.path.join(WS, ".venv", "Scripts", "python.exe") if WIN else os.path.join(WS, ".venv", "bin", "python")
PYREL = r"..\.venv\Scripts\python.exe" if WIN else "../.venv/bin/python"
TMPHINT = (f'(PowerShell: $env:TEMP="{WS}\\.render-tmp"; $env:TMP="{WS}\\.render-tmp")' if WIN
           else f'TMPDIR="{WS}/.render-tmp/"')

SEATS = [("art-director-legoCouncil", "AD"), ("brick-critic-legoCouncil", "BC"), ("shortform-editor-legoCouncil", "SE"),
         ("social-copywriter-legoCouncil", "SC"), ("lego-game-feel-legoCouncil", "GF"), ("lego-particles-detail-legoCouncil", "PD")]
TOPICS = ["visual_craft_lighting", "brick_world_fidelity", "lego_game_look_feel", "particles_micro_detail",
          "motion_sets_continuity", "pacing_hud_sound", "hook_copy_retention_cta"]
REFS = [f"{WS}/reference/user-attachments/0b5ebd59-f705-4a34-9493-b9fc784fa577-{x}" for x in [
    "3549f833-0e34-4a42-8faf-6a7b22e2c16a.jpg", "af13db21-4b9a-46e5-98fe-cfddc633efa4.png", "c16341a9-beba-4807-a3b0-4ef67a662f96.jpg",
    "c269cf56-c505-49a9-9967-d2fd81221693.jpg", "ca651646-9679-4888-826a-841015539bad.jpg", "ccfe1f8d-9b35-4230-a089-f1d5eedc3ddc.png",
    "d7985996-7199-4e88-8266-74b1d72ab3f4.jpg"]]

gpu = asyncio.Lock()
sem = asyncio.Semaphore(CONC)
os.makedirs(SCRATCH, exist_ok=True)


def report(text):
    with open(REPORT, "a", encoding="utf-8") as f:
        f.write(text.rstrip() + "\n\n")


RTMP = f"{WS}/.render-tmp"
os.makedirs(RTMP, exist_ok=True)
ENV = dict(os.environ, TMPDIR=RTMP + os.sep, TEMP=RTMP, TMP=RTMP)


async def sh(cmd, cwd=WS, timeout=3600):
    loop = asyncio.get_running_loop()
    fn = functools.partial(subprocess.run, cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout, stdin=subprocess.DEVNULL, env=ENV)
    try:
        r = await loop.run_in_executor(None, fn)
        return r.returncode, (r.stdout or "") + (r.stderr or "")
    except subprocess.TimeoutExpired:
        return 124, f"timeout after {timeout}s"


BRIEFS = dict(A.get("brief_files") or {})   # {slug: abs path of a brief + fact sheet .md} -> general (non-DealCalm-revamp) mode
for _slug in TOPIC_REQ:
    BRIEFS.setdefault(_slug, os.path.join(WS, "docs", "facts", f"{_slug}.md"))


def fact_sheet(slug):
    if slug in BRIEFS:
        txt = open(BRIEFS[slug], encoding="utf-8").read()
        if slug in TOFU:
            txt = open(os.path.join(WS, "docs", "DEALCALM-TOFU.md"), encoding="utf-8").read() + "\n\n---\n\n" + txt
        return txt
    txt = open(DOC, encoding="utf-8").read()
    m = re.search(rf"^## \d+\. {re.escape(slug)}:.*?(?=^## )", txt, re.S | re.M)
    sec = m.group(0).strip() if m else ""
    parts = txt.split("## Status", 1)
    extra = [l for l in parts[1].splitlines() if slug in l] if len(parts) > 1 else []
    if slug == "jobs-coup":
        old = json.load(open(f"{WS}/jobs-coup/_pre-cinematic/script.json", encoding="utf-8"))
        sec = ("## jobs-coup: Steve Jobs pushed out of Apple, 1985\nNo separate sheet. The verified facts are exactly the claims in the "
               "Claude-reviewed v2 script below (keep its hedges such as 'reportedly'; add nothing new):\n" +
               "\n".join(f"- {l['text']}" for l in old["lines"]))
    if extra:
        sec += "\n\nFact-check notes from the series status log (these override the sheet):\n" + "\n".join(extra)
    return sec


BSCHEMA = {"type": "object", "properties": {
    "ready": {"type": "boolean"}, "summary": {"type": "string"}, "cta_line": {"type": "string"},
    "voice_seconds": {"type": "number"}, "sets": {"type": "array", "items": {"type": "string"}},
    "unsure_facts": {"type": "array", "items": {"type": "string"}}, "problems": {"type": "array", "items": {"type": "string"}}},
    "required": ["ready", "summary", "cta_line", "voice_seconds", "sets", "unsure_facts", "problems"]}

SSCHEMA = {"type": "object", "properties": {
    "seat": {"type": "string"},
    "scores": {"type": "object", "properties": {t: {"type": "number"} for t in TOPICS}, "required": TOPICS},
    "summary": {"type": "string"},
    "findings": {"type": "array", "items": {"type": "object", "properties": {
        "time_s": {"type": "number"}, "severity": {"type": "string"}, "issue": {"type": "string"}, "fix": {"type": "string"}},
        "required": ["time_s", "severity", "issue", "fix"]}},
    "copy_rewrites": {"type": "string"}},
    "required": ["seat", "scores", "summary", "findings", "copy_rewrites"]}


def builder_brief_general(slug):
    return f"""You are builder-legoCouncil, making the NEW LEGO explainer video `{slug}` in `{WS}/{slug}` (macOS zsh; already scaffolded
from templates/brick-cinematic, so the folder still holds the template demo: replace script.json, cues.json and assets/scene.js).
It will be judged by a blind 6-seat LEGO council from screenshots, for up to {MAX_ROUNDS} rounds. Work carefully but efficiently.

READ FIRST: `{WS}/.agents/skills/lego-explainer/SKILL.md` (lessons from every earlier council: fix its section-4 list BEFORE round 1),
`{WS}/AGENTS.md`, `{WS}/PLAYBOOK.md`, `{WS}/templates/brick-cinematic/README.md`, `compositions/stage.html` (header documents the
per-shot `look`), and the APPROVED reference videos (the quality bar: match or beat them): `{WS}/examples/README.md`, then
`{WS}/examples/dotcom-crash-lego-r6/` (overall: stills/, REVAMP_NOTES.md, assets/dc-sets.js, dc-kit*.js, scene.js) and
`{WS}/examples/disney-iger-r7/` (props: assets/props-kit.js, dressSets() in scene.js). Style targets (TT-Games LEGO cutscenes): {', '.join(REFS)}.
Do NOT edit the engine files (stage.html, build.py, brick-kit.js, fx-kit.js, ldraw-kit.js, ldraw-parts.js, film.js). You may add
project-local helper files under assets/ (e.g. props-kit.js) loaded in index.html before scene.js.

BRIEF + FACTS (follow the brief; the facts listed are the ONLY facts the script may state; keep hedges; no invented quotes/scenes):
<<<
{fact_sheet(slug)}
>>>

REQUIREMENTS
1. script.json: length and voice per the brief (never Charon). Hook <= 14 words in 0-3 s matched to the opening visual; momentum and
   a curiosity loop every 10-15 s; chapters that follow the brief's arc; a clear payoff; the closing line per the brief.
2. cues.json: chapters every 3-6 s in spoken order; slams for the big milestones (e.g. years / names of eras); tags for names and
   years; accent words; story sfx only from assets/sfx/sounds.json (one distinct sound per idea, <= 6 uses each, no hiss sounds, no
   click per word); hook lines; a short end card (each line <= 22 chars so it never wraps). Use
   "captions": {{"style": "subtitle", "max_words": 3, "max_chars": 20}} so faces stay clear.
3. assets/scene.js for brick-cinematic: `K = BRICK.setup(ctx); X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X);`
   - People are `K.mfig(spec)`: distinct, neutral looks; seated on brick chairs; nobody frozen > 1.5 s; faces in 3/4 view in the
     upper-middle (y ~350-1020 px), clear of the subtitle band (y ~1395-1525), the HUD tag zone (top-right, x 600-910, y 280-380)
     and TikTok's right rail (x > 950, y > 1050).
   - 8+ distinct, fully dressed, BRICK-BUILT environments (no flat 2D cutouts, no plain textured boxes as buildings/machines, no
     empty bottom 40% of the frame, no black voids). Give each set its own prop palette; build a project props kit with many varied
     brick assets. Explain ideas with tactile brick metaphors (glowing GPU bricks, a parameter-brick tower, word bricks linked by
     light beams, data flowing as studs).
   - PROPS QUALITY BAR = examples/disney-iger-r7 (approved; match or beat it; overall bar: examples/dotcom-crash-lego-r6): use assets/props-kit.js
     (`PK = PROPS.setup(ctx, K, X)`, see dressSets() in {WS}/examples/disney-iger-r7/assets/scene.js): every set gets >= 6 asset types,
     >= 3 unique to that set, extras holding props (PK.extra), 1-2 live props (PK.tick), PK.bake(set) for performance; add
     story-specific assets the library lacks; props must be visible in the actual framings but never cover faces or text.
   - Per-shot `look`: warm practical key + cool rim, bloom 0.45-0.65 without blowouts, tilt-shift DOF 0.35-0.65 on close/medium shots.
   - LEGO FX only (6141 round plates for sparks/glow particles, X.puffs, X.debris); every sound has a visible event.
   - Loudness per the skill's section 6 (voice-mix.wav compressor chain, sfx bed about 0.5) so the mix lands about -15.5 LUFS;
     no pause below -35 dB in the hook, payoff or ending; no digital silence under the end card.
   - Camera steady on captions (the stage adds only chapter push/whip). Pure function of t, no Math.random. No logos.
   Write scene.js in chunks of <= ~150 lines, saving each step; run `node --check` on every JS file.
4. Build & verify (from `{WS}/{slug}`, point the temp dir at the external/work drive first: `{TMPHINT}`): `{PYREL} tools/build.py`
   (fix every warning), `npx --yes hyperframes@0.9.46 check --json` (must be ok), then
   `npx --yes hyperframes@0.9.46 snapshot --at <14-18 plain seconds: hook, every set, every milestone, the ending> --no-end --output .hyperframes/snaps`
   and LOOK at every PNG (view_file). Fix the section-4 defects and re-snapshot.
5. DO NOT render the MP4 (the orchestrator renders; one shared GPU). NEVER play audio or video. Don't touch other project folders.
6. Keep `{WS}/{slug}/REVAMP_NOTES.md` current: per round what changed, the set list with time ranges, the ending text, open issues.

Finish with: ready, summary, cta_line (the closing line), voice_seconds, sets, unsure_facts (left out), problems."""


def builder_brief(slug):
    if slug in BRIEFS:
        return builder_brief_general(slug)
    return f"""You are builder-legoCouncil, revamping the DealCalm LEGO story video `{slug}` in `{WS}/{slug}` (macOS zsh).
It will be judged by a blind 6-seat LEGO council from screenshots, for up to {MAX_ROUNDS} rounds. Work carefully but efficiently.

READ FIRST: `{WS}/.agents/skills/lego-explainer/SKILL.md` (the lessons from every earlier council: fix its section-4 list before round 1), `{WS}/AGENTS.md`, `{WS}/PLAYBOOK.md`, `{WS}/templates/brick-cinematic/README.md`, the top sections of `{DOC}`
("Format" and "Visual rules"), the project's current `script.json`, `cues.json`, and `assets/scene.brickstory.js` (the old
brick-story scene, for story beats and props). Approved reference videos (match or beat them): `{WS}/examples/README.md`, `{WS}/examples/dotcom-crash-lego-r6/`
(overall) and `{WS}/examples/disney-iger-r7/` (props). Style targets
(TT-Games LEGO cutscenes): {', '.join(REFS)}.

THE PROJECT IS ALREADY ON THE CINEMATIC ENGINE (scripts/upgrade_to_cinematic.py ran): index.html loads ldraw-parts.js,
brick-kit.js, fx-kit.js, ldraw-kit.js, then scene.js; compositions/stage.html is the HDR/bloom/DOF renderer whose header documents
the `look` object; tools/build.py supports subtitle captions. Do NOT edit the engine files (stage.html, build.py, brick-kit.js,
fx-kit.js, ldraw-kit.js, ldraw-parts.js, film.js). You edit `script.json`, `cues.json`, `assets/scene.js` (you may add
project-local helper files under assets/ and load them in index.html before scene.js).

FACTS (the ONLY facts the script may state; keep hedges like "reportedly"; never invent private scenes or quotes):
<<<
{fact_sheet(slug)}
>>>

REQUIREMENTS
1. script.json: total video ~110 s (voice about 104-114 s; build.py adds a 2.4 s end hold). Voice `en-US-Chirp3-HD-Sadachbia`,
   rate 1.1-1.15, never Charon. TRIPLE HOOK in 0-3 s (visual: motion/reveal from frame 0; spoken: line 1 <= 14 words, a curiosity gap; text: the hook title adds a twist/number, never repeats line 1, works on mute); state the stakes right after; name the
   tactics as "Move number one / two / three"; twist/outcome; one-line takeaway; then the FINAL line is a story-specific DealCalm CTA
   that calls back to this story's protagonist (their mistake or their winning move), one breath (<= ~30 words), witty not salesy.
   Pattern: "And if you don't want to get pushed out of your own company like Steve Jobs, sharpen your communication and negotiation
   skills with Deal Calm, on the Apple App Store and at deal calm dot com." Always write "Deal Calm" and "deal calm dot com" in the
   script text (clean TTS); captions may show them as spoken.
2. cues.json: chapters every 3-6 s in spoken order; slams for the moves; tags for names/years; accent words; story sfx only from
   assets/sfx/sounds.json (one distinct sound per idea, each sound <= 6 uses, no hiss/glitch/sparkle/keypress, no click per word);
   hook lines; end card {{"line1": "DealCalm", "line2": "App Store · dealcalm.com"}}. Use
   "captions": {{"style": "subtitle", "max_words": 3, "max_chars": 20}} so faces stay clear (council-approved on Starship).
3. assets/scene.js, a full rewrite for brick-cinematic: `K = BRICK.setup(ctx); X = FXKIT.setup(ctx); LDRAW_KIT.setup(ctx, K, X);`
   - Every person is `K.mfig(spec)` (same spec/poses as K.fig: K.P, gestures, walk, sit). Distinct, recognisable-but-neutral looks.
     Seated figures sit on brick chairs/stools (no hips/legs sinking into floors); nobody frozen > ~2 s; faces in 3/4 view toward
     camera (ry ~= az in radians) in the upper-middle of frame (y ~350-1020 px), never under the subtitle band (y ~1395-1525) and
     clear of the HUD tag zone (top-right, x 600-910, y 280-380) and TikTok's right rail (x > 950, y > 1050).
   - 8+ distinct, fully dressed brick environments, zero black voids: interiors enclosed (back + side walls, windows onto brick
     skylines or X.sky, practical lamps with bloom, studded/tiled floors); exteriors with X.sky + X.skyEnv (align sky sunDir with
     look.sun.dir), X.ground, brick trees/cars/street furniture, X.brickClouds; layered foreground/background depth.
   - PROPS QUALITY BAR = examples/disney-iger-r7 (approved; match or beat it; overall bar: examples/dotcom-crash-lego-r6): use assets/props-kit.js
     (`PK = PROPS.setup(ctx, K, X)`, see dressSets() in {WS}/examples/disney-iger-r7/assets/scene.js): every set gets >= 6 asset types,
     >= 3 unique to that set, extras holding props (PK.extra), 1-2 live props (PK.tick), PK.bake(set) for performance; add
     story-specific assets the library lacks; props must be visible in the actual framings but never cover faces or text.
   - A per-shot `look` from update(): warm key + cool rim, bloom 0.45-0.65, tilt-shift DOF 0.35-0.65 on close/medium shots, grade.
   - Motivated LEGO FX (X.puffs brick steam from coffee/engines, camera-flash pops at press events, brick confetti, X.debris bursts
     for dramatic beats); never blurry non-brick sprite walls.
   - Closing CTA set: a polished DealCalm studio, e.g. a large brick smartphone showing a "DealCalm" app screen, a "dealcalm.com"
     sign and an "App Store" text sign (text only; NO Apple logo or any third-party/toy logo anywhere), presented by a GENERIC
     DealCalm host minifig plus a story callback prop. Never put the real protagonist in the CTA (reads as an endorsement); never
     claim "free". Keep the subtitle off the phone's buttons and the end title short enough not to wrap.
   - Loudness: follow the skill's section 6 (voice-mix.wav compressor chain, sfx bed volume about 0.5) so the mix lands about -15.5 LUFS,
     and fill every pause below -35 dB in the hook, takeaway and CTA.
   - Camera steady on captions (the stage adds only chapter push/whip; never add shake). Pure function of t, no Math.random.
   - Known pitfalls: set `frustumCulled = false` on InstancedMesh that spans a large area; large ground planes `studs: false`
     with real stud geometry near camera; keep normalScale <= 0.25 on distant planes; opaque ABS/metal (no accidental glass).
   Write scene.js in chunks of <= ~150 lines (sets, cast, update/camera), saving each step; run `node --check assets/scene.js`.
4. Build & verify (from `{WS}/{slug}`): `{PYREL} tools/build.py` (Google TTS + whisper word timings, ~1-2 min; fix
   every warning), `npx --yes hyperframes@0.9.46 check --json` (must be ok), then
   `npx --yes hyperframes@0.9.46 snapshot --at <12-16 comma-separated plain seconds: hook, every set, every move, the CTA> --no-end --output .hyperframes/snaps`
   and LOOK at every PNG yourself (view_file). Fix black voids, hidden/cut-off faces, clipping, HUD/caption collisions, washed-out
   or crushed lighting, then re-snapshot the fixed moments.
5. The internal disk is nearly full: point the temp dir at `{WS}/.render-tmp` before every npx/hyperframes command
   (`{TMPHINT}`) so temp files go to the external drive, and never leave big files outside the project.
   DO NOT render the MP4: the orchestrator renders after you finish (one shared GPU). NEVER play audio or video (no afplay, say,
   ffplay, open). Do not touch other project folders.
6. Keep `{WS}/{slug}/REVAMP_NOTES.md` current: per round what changed, the set list with time ranges, the CTA text, open issues.

Finish with: ready (true if build + check pass and snapshots look right), summary, cta_line, voice_seconds, sets,
unsure_facts (claims you were not sure about; you must have left them out), problems (anything unresolved)."""


def seat_prompt(slug, n, seat):
    pack = f"{WS}/{slug}/council/r{n}"
    return f"""Blind LEGO council review: `{slug}`, round {n}. You are seat `{seat}`. Follow your seat instructions exactly:
screenshots and text only (never open .mp4/.wav files, never read .js/.html source, never open other council/r* folders).

Read `{pack}/PACK.md`, then EVERY image it lists (contact sheets, chapter stills, motion strips), then `{pack}/AUDIO.md`, and compare
against the 7 LEGO video-game style references: {', '.join(REFS)}.

{CTX_TOFU if slug in TOFU else (CTX_GENERAL if slug in BRIEFS else CTX_DEALCALM)}
Fact sheet (the only facts the script may state; flag anything stated that is not supported here):
<<<
{fact_sheet(slug)}
>>>

Score all 7 topics (0.0-10.0, one decimal: 5 = passable amateur, 7 = publishable with clear flaws, 9 = reference-grade,
10 = nothing left to fix). Give concrete findings (time_s, severity high|medium|low, issue, fix). In copy_rewrites give exact
word-for-word replacement lines when you have them (the social copywriter must; others may write "none").{TRIPLE if seat.startswith("social-copywriter") else ""}"""


TRIPLE = """

TRIPLE HOOK AUDIT (required for this seat): judge the first 1-3 s as three separate hooks that must fire together on one
question: VISUAL (ch-00 + motion-00: motion or a reveal from frame 0, one badge at most), SPOKEN (script line 1, <= 14 words, a
curiosity gap, no dead air) and TEXT (the hook title: it adds a twist or number, never repeats line 1 or spoils the payoff, and
works on mute). Rate each strong / weak / missing in a finding, and put exact rewrites (line 1, hook title line1/line2, an
opening-shot direction) in copy_rewrites."""

CTX_TOFU = """Context (client requirements, not defects): this is a DealCalm TOP-OF-FUNNEL LEGO video for Instagram Reels / YouTube Shorts /
TikTok, made to win strangers' attention for the DealCalm negotiation app. Target 60-75 s. A small "DEALCALM STORIES" badge in the
first ~3 s is the series stinger. The ending is intentionally SOFT: the story's takeaway plus one short brand line (e.g. "Practice
moves like this with Deal Calm"), with the URL / App Store only on the end card. Judge how well it is executed (does it feel earned,
not like an ad?), never its existence. Real public figures appear as LEGO minifigures with neutral portrayal; no third-party or
toy-brand logos. Background music is intentionally absent for now: judge voice + effects. The brief below lists the facts."""

CTX_GENERAL = """Context: this is a LEGO video-game style tech-history explainer for TikTok / YouTube Shorts / Instagram Reels (NOT a DealCalm
video; no product CTA: it should end with a subtle follow pull per its brief). Real public figures appear as LEGO minifigures with
neutral portrayal. No company or toy-brand logos are allowed (generic signs only). Background music is intentionally absent for now:
judge voice + effects. The brief below also lists the target length."""

CTX_DEALCALM = """Context (client requirements, not defects): this is a DealCalm story video for Instagram Reels and YouTube Shorts (history of
corporate coups, manipulation tactics and negotiation, made to grow the DealCalm account). The final spoken line and end card are a
CTA for the DealCalm negotiation app (Apple App Store + dealcalm.com) tailored to the story: judge how well it is executed, never
its existence. Target length is about 110 s. Real public figures appear as LEGO minifigures with neutral portrayal. No third-party
or toy-brand logos are allowed (generic signs only). Background music is intentionally absent for now: judge voice + effects."""

def table(slug, n, res):
    head = "| Topic | " + " | ".join(k for _, k in SEATS) + " | Avg |\n|---|" + "---|" * (len(SEATS) + 1)
    rows = []
    for t in TOPICS:
        vals = [r["scores"].get(t) if r else None for r in res]
        got = [v for v in vals if isinstance(v, (int, float))]
        cells = " | ".join(f"{v:.1f}" if isinstance(v, (int, float)) else "–" for v in vals)
        rows.append(f"| {t} | {cells} | " + (f"{sum(got) / len(got):.2f} |" if got else "– |"))
    avgs = []
    for r in res:
        avgs.append(sum(r["scores"][t] for t in TOPICS) / len(TOPICS) if r else None)
    rows.append("| **Seat avg** | " + " | ".join(f"**{a:.2f}**" if a is not None else "–" for a in avgs) + " | |")
    return head + "\n" + "\n".join(rows), avgs


def passed(res):
    if any(r is None for r in res):
        return False
    allv = [r["scores"][t] for r in res for t in TOPICS]
    seat_avgs = [sum(r["scores"][t] for t in TOPICS) / len(TOPICS) for r in res]
    return min(seat_avgs) >= GATE_AVG and min(allv) >= GATE_MIN


GATE_AVG = float(A.get("gate_avg", 8.0))                  # private pass mark: every seat's average >= this (never told to seats/builders)
GATE_MIN = float(A.get("gate_min", GATE_AVG - 0.5))       # ... and no single topic score below this
TARGET_S = A.get("target_seconds") or [100, 118]          # render length window used in the builder feedback


async def run_seat(slug, n, seat):
    for attempt in range(2):
        try:
            return await agent(seat_prompt(slug, n, seat), schema=SSCHEMA, role=f"{seat.split('-legoCouncil')[0]} · {slug} r{n}",
                               type_name=seat, model="inherit")
        except Exception as e:
            log(f"[{slug} r{n}] seat {seat} failed (attempt {attempt + 1}): {e}")
    return None


DRAFT_FPS = str(A.get("draft_fps", 10))      # council rounds: seats only see 1.5 s contact sheets + 0.25 s motion strips
DRAFT_PR = float(A.get("draft_pixel_ratio", 1.0))
GPU_ENC = bool(A.get("gpu_encode", not WIN))  # VideoToolbox verified on the M1; on Windows run scripts/render_benchmark.py first
WORKERS = str(A.get("workers", 4))           # benchmark 2026-11-16 (M1, 16 GB): 4 fastest; 6-8 slower; 1 slowest


def set_profile(slug, pr):
    with open(f"{WS}/{slug}/assets/render-profile.js", "w", encoding="utf-8") as f:
        f.write("/* Render profile. Normally empty (= full quality). The council loop writes { pixelRatio: 1.0 } here for fast draft "
                "renders and restores it. */\nwindow.RENDER_PROFILE = " + (json.dumps({"pixelRatio": pr}) if pr else "{}") + ";\n")


async def render(slug, n, final=False):
    out = f"renders/{slug}-r{n}-final.mp4" if final else f"renders/{slug}-r{n}.mp4"
    async with gpu:
        lockdir = f"{WS}/.render-tmp/.gpu-lock"   # cross-workflow lock: only one HyperFrames render on this Mac at a time
        while True:
            try:
                os.mkdir(lockdir); break
            except FileExistsError:
                if time.time() - os.path.getmtime(lockdir) > 3600:
                    shutil.rmtree(lockdir, ignore_errors=True)
                await asyncio.sleep(15)
        log(f"[{slug} r{n}] rendering (GPU lock held)")
        t0 = time.time()
        if not final:
            set_profile(slug, DRAFT_PR)
        try:
            code, txt = await sh([NPX, "--yes", "hyperframes@0.9.46", "render", "--output", out, "--fps", "30" if final else DRAFT_FPS,
                                  "--quality", "standard", "--workers", WORKERS] + (["--gpu"] if (GPU_ENC and not final) else []),
                                 cwd=f"{WS}/{slug}", timeout=5400)   # drafts: VideoToolbox encode (PSNR 45 dB vs software)
        finally:
            set_profile(slug, None)
        log(f"[{slug} r{n}] render exit {code} in {int(time.time() - t0)} s")
        shutil.rmtree(lockdir, ignore_errors=True)
        for d in os.listdir(RTMP):
            if d.startswith("hf-"):
                shutil.rmtree(os.path.join(RTMP, d), ignore_errors=True)
    mp4 = f"{WS}/{slug}/{out}"
    if code != 0 or not os.path.exists(mp4):
        return None, txt[-4000:]
    return mp4, ""


async def make_builder(slug):
    return agent(builder_brief(slug), role=f"Builder · {slug}", type_name="builder-legoCouncil", model="inherit")


PRIORITY = A.get("priority_note", "")
BUILDER_TIMEOUT = float(A.get("builder_timeout_s", 7200))


async def builder_turn(state, slug, prompt):
    if PRIORITY:
        prompt = prompt + "\n\nPRIORITY FROM THE PERSON: " + PRIORITY
    try:   # watchdog: a builder turn that never returns (seen once) is replaced by a fresh builder after BUILDER_TIMEOUT
        return await asyncio.wait_for(state["b"](prompt, BSCHEMA), timeout=BUILDER_TIMEOUT)
    except Exception as e:
        log(f"[{slug}] builder turn failed ({e}); starting a fresh builder that reads REVAMP_NOTES.md")
        state["b"] = await make_builder(slug)
        return await state["b"](prompt + f"\n\n(You are a fresh builder taking over: read {WS}/{slug}/REVAMP_NOTES.md and the current "
                                         "files first; the previous builder's work is on disk.)", BSCHEMA)


def duration(mp4):
    try:
        return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4],
                                    capture_output=True, text=True).stdout.strip())
    except Exception:
        return 0.0


RESUME = A.get("resume") or {}


def feedback_prompt(n, res, dur, loud):
    fb = []
    for (s_, k), r in zip(SEATS, res):
        if not r:
            continue
        fb.append(f"## {s_} (avg {sum(r['scores'][t] for t in TOPICS) / len(TOPICS):.2f})\nSummary: {r['summary']}\n" +
                  "\n".join(f"- [{f['severity']}] t={f['time_s']}s: {f['issue']} -> FIX: {f['fix']}" for f in r["findings"]) +
                  (f"\nCopy rewrites: {r['copy_rewrites']}" if r.get("copy_rewrites") and r["copy_rewrites"].strip().lower() != "none" else ""))
    lo, hi = float(TARGET_S[0]), float(TARGET_S[1])
    dnote = "" if lo <= dur <= hi else f"\nNOTE: the render is {dur:.1f} s; bring it back into the brief's window ({lo:.0f}-{hi:.0f} s)."
    return (f"ROUND {n + 1}. The blind council reviewed your round {n} render ({dur:.1f} s, {loud}). Their findings:\n\n" +
            "\n\n".join(fb) + dnote +
            "\n\nAddress every high and medium finding and as many low ones as you can. Apply copy rewrites only when every fact "
            "stays inside the fact sheet (never add unverified claims) and keep the required closing line from your brief (the DealCalm CTA in DealCalm videos). "
            "Rebuild, check, snapshot-verify the changed moments, update REVAMP_NOTES.md, then finish. Do not render.")


RESEARCH_SCHEMA = {"type": "object", "properties": {"facts_md": {"type": "string"}, "title": {"type": "string"},
                   "unsure": {"type": "array", "items": {"type": "string"}}}, "required": ["facts_md", "title", "unsure"]}
POST_SCHEMA = {"type": "object", "properties": {"post_md": {"type": "string"}}, "required": ["post_md"]}


async def research_topic(slug):
    fp = BRIEFS[slug]
    if os.path.exists(fp):
        return
    phase(f"{slug} · research")
    r = await agent(f"""Research a DealCalm top-of-funnel LEGO video. Topic for `{slug}`: {TOPIC_REQ[slug]}
Read {WS}/docs/DEALCALM-TOFU.md (format: 60-75 s, soft CTA, triple hook) and use docs/DEALCALM-SERIES.md as the model for a fact
sheet. Use web search to VERIFY every fact (prefer primary or reputable sources: court records, company filings, major newspapers,
Harvard PON, peer-reviewed research, FBI CNU, well-known books). Then return `facts_md`, a markdown brief + fact sheet with:
# <slug>: <title>; ## Brief (category, hook idea <= 14 words, story arc for 60-75 s, 1-2 tactics, a one-line takeaway, a soft CTA
line idea, 5-7 brick-built set ideas, cast as neutral minifigs); ## Facts (only verified facts, each with its source in brackets,
keep hedges like "reportedly"); ## Do not say (UNSURE or disputed claims, left out). For tactic explainers / everyday scenarios:
cite the research or present a dramatized "Imagine..." example; never invent statistics. Never play audio/video.""",
                    schema=RESEARCH_SCHEMA, role=f"Researcher · {slug}", type_name="self", model="inherit")
    os.makedirs(os.path.dirname(fp), exist_ok=True)
    open(fp, "w", encoding="utf-8").write(r["facts_md"])
    report(f"### {slug}: research done\n\nFact sheet: `{fp}` ({r['title']}). Left out as unsure: {r['unsure'] or 'none'}")


async def scaffold(slug):
    if os.path.isdir(os.path.join(WS, slug)):
        if slug in TOFU and "series-badge" not in open(os.path.join(WS, slug, "index.html"), encoding="utf-8").read():
            await sh([VPY, "scripts/series_badge.py", slug], timeout=60)
        return
    code, txt = await sh([VPY, "scripts/new_video.py", slug, "--template", "brick-cinematic"], timeout=300)
    if code != 0:
        raise RuntimeError(f"new_video.py failed: {txt[-800:]}")
    if slug in TOFU:
        await sh([VPY, "scripts/series_badge.py", slug], timeout=60)


async def write_post(slug, final):
    if slug not in TOFU:
        return
    phase(f"{slug} · post copy")
    try:
        script = json.load(open(os.path.join(WS, slug, "script.json"), encoding="utf-8"))
        lines = "\n".join(l["text"] for l in script["lines"])
        r = await agent(f"""Write the Instagram Reels / YouTube Shorts post copy for the DealCalm top-of-funnel LEGO video `{slug}`.
The spoken script:\n<<<\n{lines}\n>>>\nFacts allowed (state nothing else):\n<<<\n{fact_sheet(slug)}\n>>>
Return post_md (markdown) with: ## Caption (a scroll-stopping first line that is NOT the video's hook word for word, 2-3 short
lines of value, then a soft CTA such as "Practice this with DealCalm (link in bio / dealcalm.com)"); ## Hashtags (5-8, a mix of
niche and broad: negotiation, business history, etc.); ## Pinned comment (a question that invites replies); ## Shorts title
(<= 60 chars). No "free" claims, no unverified facts, no emojis spam (0-2 emojis max).""",
                        schema=POST_SCHEMA, role=f"Post copy · {slug}", type_name="social-copywriter-legoCouncil", model="inherit")
        open(os.path.join(WS, slug, "POST.md"), "w", encoding="utf-8").write(r["post_md"])
        report(f"### {slug}: post copy\n\n`{os.path.join(WS, slug, 'POST.md')}`")
    except Exception as e:
        log(f"[{slug}] post copy failed: {e}")


async def run_video(slug):
    if slug in TOPIC_REQ:
        await research_topic(slug)
    await scaffold(slug)
    state = {"b": await make_builder(slug)}
    rs = RESUME.get(slug, {})
    start = int(rs.get("round", 1))
    prompt = ("ROUND 1: make the full video described in your brief (script, cues, full brick-cinematic scene.js + props kit), build, "
              "check, snapshot-verify. Then finish.") if slug in BRIEFS else (
              "ROUND 1: do the full revamp described in your brief (script ~110 s with the DealCalm CTA, cues, full brick-cinematic "
              "scene.js), build, check, snapshot-verify. Then finish.")
    if rs.get("feedback_round"):
        fr = int(rs["feedback_round"])
        saved = json.load(open(f"{WS}/{slug}/council/r{fr}/scores.json", encoding="utf-8"))["seats"]
        res0 = [saved.get(s_) for s_, _ in SEATS]
        mp0 = f"{WS}/{slug}/renders/{slug}-r{fr}.mp4"
        pk0 = open(f"{WS}/{slug}/council/r{fr}/PACK.md", encoding="utf-8").read()
        m0 = re.search(r"Audio: (.*?)\.\s*$", pk0, re.M)
        prompt = feedback_prompt(fr, res0, duration(mp0), m0.group(1) if m0 else "?")
    if rs.get("note"):
        prompt += "\n\n" + rs["note"]
    final = {"slug": slug, "rounds": 0, "passed": False, "mp4": None}
    last = min(MAX_ROUNDS, int(rs.get("max_round", MAX_ROUNDS)))   # per-video cap (e.g. 3 NEW rounds on top of old ones)
    for n in range(start, last + 1):
        phase(f"{slug} · round {n}")
        if n == start and rs.get("render_first"):
            b = {"ready": True, "cta_line": rs.get("cta", "(from the previous run)"), "unsure_facts": [], "problems": []}
        else:
            b = await builder_turn(state, slug, prompt)
        log(f"[{slug} r{n}] builder: ready={b.get('ready')} voice={b.get('voice_seconds')} cta={b.get('cta_line')!r}")
        existing = f"{WS}/{slug}/renders/{slug}-r{n}.mp4"
        if n == start and rs.get("reuse_render") and os.path.exists(existing):
            mp4, err = existing, ""
        else:
            mp4, err = await render(slug, n)
        if not mp4:
            b = await builder_turn(state, slug, f"The orchestrator's render of round {n} FAILED. Output tail:\n{err}\n"
                                                "Fix the cause, rebuild, check, snapshot-verify, then finish. Do not render.")
            mp4, err = await render(slug, n)
        if not mp4:
            report(f"### {slug}: round {n} render failed twice; stopped.\n```\n{err[-1500:]}\n```")
            final["error"] = "render failed"
            break
        dur = duration(mp4)
        code, txt = await sh([VPY, "scripts/council_pack.py", slug, str(n), mp4], timeout=1800)
        if code != 0:
            report(f"### {slug}: council_pack failed in round {n}\n```\n{txt[-1500:]}\n```")
            final["error"] = "pack failed"
            break
        pack_md = open(f"{WS}/{slug}/council/r{n}/PACK.md", encoding="utf-8").read()
        m = re.search(r"Audio: (.*?)\.\s*$", pack_md, re.M)
        loud = m.group(1) if m else "?"
        res = await parallel(SEATS, lambda s: run_seat(slug, n, s[0]))
        json.dump({"slug": slug, "round": n, "seats": {s: r for (s, _), r in zip(SEATS, res)}},
                  open(f"{WS}/{slug}/council/r{n}/scores.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        json.dump(res, open(f"{SCRATCH}/{slug}_r{n}_scores.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        tbl, avgs = table(slug, n, res)
        ok = passed(res)
        valid = [a for a in avgs if a is not None]
        overall = sum(valid) / len(valid) if valid else 0
        final.update(rounds=n, passed=ok, mp4=mp4, dur=dur, loud=loud, cta=b.get("cta_line"), overall=overall,
                     unsure=b.get("unsure_facts", []), problems=b.get("problems", []))
        report(f"### {slug}: round {n}\n\n`{mp4}` · {dur:.1f} s · {loud}\n\nCTA: “{b.get('cta_line')}”\n\n{tbl}\n\n"
               f"Overall {overall:.2f} · {'**PASSED** the private gate' if ok else 'below gate' if n < last else 'round cap reached'}")
        log(f"[{slug} r{n}] overall {overall:.2f} passed={ok}")
        if ok or n == last:
            break
        prompt = feedback_prompt(n, res, dur, loud)
    if final.get("mp4") and not final.get("error"):   # council rounds are 10 fps drafts: make the 30 fps full-quality deliverable
        phase(f"{slug} · final render")
        fm, ferr = await render(slug, final["rounds"], final=True)
        if fm:
            final["draft_mp4"], final["mp4"] = final["mp4"], fm
            report(f"### {slug}: final delivery render\n\n`{fm}` · {duration(fm):.1f} s · 30 fps · full quality (council rounds were 10 fps drafts)")
        else:
            report(f"### {slug}: final 30 fps render failed\n```\n{ferr[-1200:]}\n```")
    await write_post(slug, final)
    return final


async def sync_output():   # copy finished finals + POST.md into <workspace>/output/
    await sh([VPY, "scripts/sync_output.py"], timeout=900)


async def guarded(slug):
    async with sem:
        try:
            r = await run_video(slug)
        except Exception as e:
            log(f"[{slug}] ERROR {e}")
            report(f"### {slug}: workflow error\n```\n{traceback.format_exc()[-2000:]}\n```")
            return {"slug": slug, "error": str(e)}
        s = (f"#### ✅ {slug} final: round {r.get('rounds')} · {'passed' if r.get('passed') else 'stopped at cap/err'} · overall "
             f"{r.get('overall', 0):.2f} · `{r.get('mp4')}` · {r.get('dur', 0):.1f} s\n"
             f"Unsure facts left out: {r.get('unsure') or 'none'} · Builder open problems: {r.get('problems') or 'none'}\n\n---")
        report(s)
        return r


# ------------------------------------------------------------------ DAEMON MODE: work a queue file forever
# Args: {"queue_file": "<abs>/queue.json", "concurrency": 3, ...}. queue.json = {"items": [{"slug", "status": "pending",
#   "brief_file"?: abs path, "topic"?: "text (category)", "tofu"?: true, "resume"?: {...}}]}. Edit the file at any time to add or
#   reorder pending items. When nothing is pending, a researcher agent finds new engaging topics and appends them. Runs until stopped.
QUEUE_FILE = A.get("queue_file")
MIN_FREE_GB = float(A.get("min_free_gb", 5))
DEFAULT_ITEM_ROUNDS = int(A.get("item_rounds", 3))


def free_gb():
    return shutil.disk_usage(os.path.expanduser("~")).free / 1e9


if QUEUE_FILE:
    qlock, refill_lock = asyncio.Lock(), asyncio.Lock()

    def qload():
        return json.load(open(QUEUE_FILE, encoding="utf-8"))

    def qsave(q):
        tmp = QUEUE_FILE + ".tmp"
        json.dump(q, open(tmp, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        os.replace(tmp, QUEUE_FILE)

    async def next_item():
        async with qlock:
            q = qload()
            for it in q["items"]:
                if it.get("status", "pending") == "pending":
                    it["status"], it["started"] = "running", time.strftime("%Y-%m-%d %H:%M")
                    qsave(q)
                    return it
        return None

    async def mark(slug, **kw):
        async with qlock:
            q = qload()
            for it in q["items"]:
                if it["slug"] == slug and it.get("status") == "running":
                    it.update(kw)
            qsave(q)

    def register(it):
        slug = it["slug"]
        if it.get("brief_file"):
            BRIEFS[slug] = it["brief_file"]
        if it.get("topic"):
            TOPIC_REQ[slug] = it["topic"]
            BRIEFS.setdefault(slug, os.path.join(WS, "docs", "facts", f"{slug}.md"))
        if it.get("tofu", True):
            TOFU.add(slug)
        RESUME[slug] = it.get("resume") or {"round": 1, "max_round": DEFAULT_ITEM_ROUNDS}   # scout topics: 3 rounds, not max_rounds

    TOPIC_SCHEMA = {"type": "object", "properties": {"topics": {"type": "array", "items": {"type": "object", "properties": {
        "slug": {"type": "string"}, "topic": {"type": "string"}, "why": {"type": "string"}}, "required": ["slug", "topic", "why"]}}},
        "required": ["topics"]}

    async def refill():
        async with refill_lock:
            q = qload()
            if any(it.get("status", "pending") == "pending" for it in q["items"]):
                return 0
            taken = sorted({it["slug"] for it in q["items"]} | {d for d in os.listdir(WS) if os.path.isdir(os.path.join(WS, d))})
            phase("queue refill · topic research")
            r = await agent(f"""The DealCalm LEGO video queue is empty. Find 6 NEW, highly engaging topics for DealCalm top-of-funnel
Reels/Shorts (read {WS}/docs/DEALCALM-TOFU.md). Priority order: (1) real negotiation / power / manipulation STORIES with a
scroll-stopping twist (corporate coups, hostage standoffs, famous deals, diplomatic showdowns, heists, sports contracts);
(2) negotiation TECHNIQUES from well-known sources (Chris Voss "Never Split the Difference", "Getting to Yes", Cialdini
"Influence", Kahneman/Tversky), each explained through a dramatized or real example; (3) everyday negotiation scenarios.
Use web search to confirm each story is well documented. Avoid these slugs/topics already done or queued: {', '.join(taken)}.
Return topics: slug (short kebab-case, unique), topic (one line: what it is + category + the hook angle), why (why it will
engage strangers). Never play audio/video.""", schema=TOPIC_SCHEMA, role="Topic scout", type_name="self", model="inherit")
            added = 0
            async with qlock:
                q = qload()
                have = {it["slug"] for it in q["items"]} | set(taken)
                for t in r["topics"]:
                    slug = re.sub(r"[^a-z0-9-]", "", t["slug"].lower().replace(" ", "-"))[:40]
                    if slug and slug not in have:
                        q["items"].append({"slug": slug, "topic": t["topic"], "status": "pending", "added_by": "topic scout", "why": t["why"],
                                           "resume": {"round": 1, "max_round": DEFAULT_ITEM_ROUNDS}})
                        have.add(slug); added += 1
                qsave(q)
            report(f"### Queue refill: {added} new topics\n\n" + "\n".join(f"- `{t['slug']}`: {t['topic']}" for t in r["topics"]))
            return added

    async def worker(i):
        while True:
            while free_gb() < MIN_FREE_GB:
                log(f"[worker {i}] internal disk {free_gb():.1f} GB free < {MIN_FREE_GB} GB: pausing 10 min")
                await asyncio.sleep(600)
            it = await next_item()
            if not it:
                try:
                    n = await refill()
                except Exception as e:
                    log(f"[worker {i}] refill failed: {e}"); n = 0
                if not n:
                    await asyncio.sleep(120)
                continue
            register(it)
            log(f"[worker {i}] picked {it['slug']}")
            r = await guarded(it["slug"])
            await mark(it["slug"], status="error" if r.get("error") else "done", finished=time.strftime("%Y-%m-%d %H:%M"),
                       overall=round(r.get("overall", 0) or 0, 2), mp4=r.get("mp4"), error=r.get("error"))
            await sync_output()

    await parallel(list(range(CONC)), worker)
else:
    results = await parallel(VIDEOS, guarded)
    summary = [{k: v for k, v in r.items() if k in ("slug", "rounds", "passed", "overall", "mp4", "dur", "error")} for r in results]
    print(json.dumps(summary, indent=1, ensure_ascii=False))
