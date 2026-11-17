#!/usr/bin/env python3
"""Add (or remove) the DealCalm series stinger: a small corner badge for the first seconds of a video.

    python scripts/series_badge.py <project> ["DEALCALM STORIES"] [--seconds 3.2] [--remove]

Top-of-funnel brand recall (docs/DEALCALM-TOFU.md): viewers see the series name while the hook plays, above the hook
title (which starts at y = 300 px) and inside TikTok's safe zone. It is a timed HyperFrames clip in index.html; build.py
keeps it (build.py rewrites only durations). Idempotent: running again replaces the old badge.
"""
import argparse
import os
import re
import sys

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("project")
ap.add_argument("text", nargs="?", default="DEALCALM STORIES")
ap.add_argument("--seconds", type=float, default=3.2)
ap.add_argument("--remove", action="store_true")
a = ap.parse_args()
P = a.project if os.path.isabs(a.project) else os.path.join(WS, a.project)
idx = os.path.join(P, "index.html")
if not os.path.exists(idx):
    sys.exit(f"ERROR: {idx} not found")
s = open(idx, encoding="utf-8").read()
s = re.sub(r"\s*<!-- series-badge -->.*?<!-- /series-badge -->", "", s, flags=re.S)
if not a.remove:
    badge = (
        "\n      <!-- series-badge -->"
        f'\n      <div id="series-badge" class="clip" data-start="0" data-duration="{a.seconds}" data-track-index="4" '
        'style="position:absolute; left:130px; top:205px; z-index:4; padding:10px 18px 8px; border-radius:8px; '
        "background:#111; border:3px solid var(--color-accent); color:#fff; font-family:'Archivo Black',sans-serif; "
        'font-size:30px; letter-spacing:0.06em; line-height:1; box-shadow:0 5px 0 rgba(0,0,0,0.55);">'
        f"{a.text}</div>"
        "\n      <!-- /series-badge -->"
    )
    m = re.search(r'(<div id="captions"[^>]*></div>)', s)
    if not m:
        sys.exit("ERROR: could not find the captions <div> in index.html")
    s = s[: m.end()] + badge + s[m.end():]
open(idx, "w", encoding="utf-8").write(s)
print(("removed" if a.remove else f'added "{a.text}" for {a.seconds}s') + f" in {idx}")
