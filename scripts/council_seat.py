#!/usr/bin/env python3
"""Harness-agnostic LEGO council helpers.

Same seat prompts, fact sheets, score schema, table and private gate as scripts/lego_council_workflow.py
(that file is loaded as the single source of truth), but driven from the shell so ANY harness can run a
round: T3 Code (delegate_task -> visible child threads), Claude Code (Agent tool), Antigravity
(invoke_subagent / run_workflow), Codex, plain CLI. See docs/COUNCIL.md "Running a round from any harness".

  PY="<workspace>/.venv/bin/python"; S="<workspace>/scripts/council_seat.py"
  $PY $S seats                         # the 6 seat names + short keys
  $PY $S prompts <slug> <N>            # write council/rN/seats/<seat>.prompt.md (self-contained briefs)
  $PY $S task <slug> <N> <seat>        # the short task text to hand a seat agent (points at its brief)
  $PY $S collect <slug> <N>            # validate seats/<seat>.json -> scores.json + SCORES.md, print table + gate
  $PY $S feedback <slug> <N>           # builder brief for round N+1 from round N's scores
Options: --brief <abs .md>  for non-DealCalm videos (same as the workflow's brief_files).
"""
import json, os, re, sys

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # repo root
WF = os.path.join(os.path.dirname(os.path.abspath(__file__)), "lego_council_workflow.py")
AGENTS_DIR = f"{WS}/.agents/agents"


def load_wf(brief=None, slug=None):
    """Exec lego_council_workflow.py up to run_video (definitions only; no agents, no renders)."""
    src = open(WF, encoding="utf-8").read()
    cut = src.find("\nasync def run_video(")
    if cut < 0:
        sys.exit("council_seat.py: lego_council_workflow.py no longer defines run_video(); update load_wf().")
    args = {"brief_files": {slug: brief}} if brief and slug else {}
    g = {"args": args, "__name__": "lego_council_wf", "__file__": WF}
    exec(compile(src[:cut], WF, "exec"), g)
    return g


def seat_body(seat):
    txt = open(f"{AGENTS_DIR}/{seat}/agent.md", encoding="utf-8").read()
    if txt.startswith("---"):
        txt = txt.split("---", 2)[2]
    return txt.strip()


def rdir(slug, n):
    return f"{WS}/{slug}/council/r{n}"


def out_path(slug, n, seat):
    return f"{rdir(slug, n)}/seats/{seat}.json"


def brief_path(slug, n, seat):
    return f"{rdir(slug, n)}/seats/{seat}.prompt.md"


def build_brief(g, slug, n, seat):
    topics = ", ".join(g["TOPICS"])
    return f"""{seat_body(seat)}

---

# This assignment

{g["seat_prompt"](slug, n, seat)}

## Vision check (do this first)
Open one reference image and one `ch-*.jpg`. If you get raw bytes / gibberish text instead of seeing a picture, you
CANNOT do this job: do not score anything. Write `{{"seat": "{seat}", "blocked": "<one-line reason>"}}` to the output
file below and reply `BLOCKED: <reason>`. Never guess visual scores from text.

## Output (required, machine-parsed)
1. Write ONE JSON object to `{out_path(slug, n, seat)}`. This is the ONLY file you may create or edit.
   Keys: "seat" ("{seat}"), "scores" (all 7 numbers 0.0-10.0: {topics}), "summary" (2-4 sentences),
   "findings" (array of {{"time_s": number, "severity": "high"|"medium"|"low", "issue": str, "fix": str}}),
   "copy_rewrites" (str: exact replacement lines, or "none").
2. Never open any other file in `{rdir(slug, n)}/seats/` (other seats' work) or any other `council/r*` folder.
3. End your final reply with the same JSON in one ```json fence.
"""


def cmd_seats(g):
    for s, k in g["SEATS"]:
        print(f"{k}  {s}")


def cmd_prompts(g, slug, n):
    if not os.path.exists(f"{rdir(slug, n)}/PACK.md"):
        sys.exit(f"No {rdir(slug, n)}/PACK.md: render and run council_pack.py first.")
    os.makedirs(f"{rdir(slug, n)}/seats", exist_ok=True)
    for s, _ in g["SEATS"]:
        open(brief_path(slug, n, s), "w", encoding="utf-8").write(build_brief(g, slug, n, s))
        print(brief_path(slug, n, s))


def task_text(slug, n, seat):
    return (f"You are `{seat}`, one seat of the blind 6-seat LEGO council, reviewing `{slug}` round {n}. "
            f"Read your complete brief at `{brief_path(slug, n, seat)}` and follow it exactly: it holds your seat "
            f"instructions, the screenshot pack, the 7 style references, the fact sheet and the output contract. "
            f"Judge only from screenshots and text (never open .mp4/.wav or .js/.html). Do not edit anything except "
            f"`{out_path(slug, n, seat)}`. Do not start subagents.")


def validate(g, r, seat):
    if not isinstance(r, dict):
        return None, "not a JSON object"
    if r.get("blocked"):
        return None, f"BLOCKED: {r['blocked']}"
    sc = r.get("scores")
    if not isinstance(sc, dict):
        return None, "missing scores"
    for t in g["TOPICS"]:
        v = sc.get(t)
        if not isinstance(v, (int, float)) or isinstance(v, bool) or not 0 <= v <= 10:
            return None, f"bad score for {t}: {v!r}"
    f = r.get("findings")
    if not isinstance(f, list):
        return None, "findings is not a list"
    for i, x in enumerate(f):
        if not isinstance(x, dict) or not all(k in x for k in ("time_s", "severity", "issue", "fix")):
            return None, f"finding {i} lacks time_s/severity/issue/fix"
    r.setdefault("seat", seat)
    r.setdefault("summary", "")
    if not isinstance(r.get("copy_rewrites"), str):
        r["copy_rewrites"] = json.dumps(r["copy_rewrites"], ensure_ascii=False) if r.get("copy_rewrites") else "none"
    return r, ""


def load_round(g, slug, n):
    res, notes = [], []
    for s, k in g["SEATS"]:
        p = out_path(slug, n, s)
        if not os.path.exists(p):
            res.append(None); notes.append(f"{k}: missing ({p})"); continue
        try:
            r, err = validate(g, json.load(open(p, encoding="utf-8")), s)
        except Exception as e:
            r, err = None, f"unreadable JSON: {e}"
        res.append(r)
        if err:
            notes.append(f"{k}: {err}")
    return res, notes


def cmd_collect(g, slug, n):
    res, notes = load_round(g, slug, n)
    json.dump({"slug": slug, "round": n, "seats": {s: r for (s, _), r in zip(g["SEATS"], res)}},
              open(f"{rdir(slug, n)}/scores.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    tbl, avgs = g["table"](slug, n, res)
    valid = [a for a in avgs if a is not None]
    overall = sum(valid) / len(valid) if valid else 0.0
    ok = g["passed"](res)
    verdict = "PASSED the private gate" if ok else ("below gate" if valid else "no valid seats")
    md = f"### {slug}: round {n}\n\n{tbl}\n\nOverall {overall:.2f} · {verdict} · {len(valid)}/6 valid seats\n"
    if notes:
        md += "\nProblems:\n" + "\n".join(f"- {x}" for x in notes) + "\n"
    open(f"{rdir(slug, n)}/SCORES.md", "w", encoding="utf-8").write(md)
    print(md)
    sys.exit(0 if len(valid) == 6 else 2)


def cmd_feedback(g, slug, n):
    res, notes = load_round(g, slug, n)
    if notes:
        print("WARNING: " + "; ".join(notes), file=sys.stderr)
    mp4 = f"{WS}/{slug}/renders/{slug}-r{n}.mp4"
    pk = open(f"{rdir(slug, n)}/PACK.md", encoding="utf-8").read()
    m = re.search(r"Audio: (.*?)\.\s*$", pk, re.M)
    print(g["feedback_prompt"](n, res, g["duration"](mp4), m.group(1) if m else "?"))


def main(argv):
    brief = None
    if "--brief" in argv:
        i = argv.index("--brief"); brief = argv[i + 1]; del argv[i:i + 2]
    if not argv or argv[0] in ("-h", "--help"):
        print(__doc__); return
    cmd, rest = argv[0], argv[1:]
    slug = rest[0] if rest else None
    g = load_wf(brief, slug)
    if cmd == "seats":
        cmd_seats(g)
    elif cmd == "prompts" and len(rest) == 2:
        cmd_prompts(g, slug, int(rest[1]))
    elif cmd == "task" and len(rest) == 3:
        print(task_text(slug, int(rest[1]), rest[2]))
    elif cmd == "collect" and len(rest) == 2:
        cmd_collect(g, slug, int(rest[1]))
    elif cmd == "feedback" and len(rest) == 2:
        cmd_feedback(g, slug, int(rest[1]))
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(sys.argv[1:])
