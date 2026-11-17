#!/usr/bin/env python3
"""Collect finished videos into <workspace>/output/ (not in git).

    python scripts/sync_output.py            # copy new/changed finals; safe to run any time (the council loop runs it too)

Layout:
  output/dealcalm-stories/<slug>.mp4 + <slug>.POST.md   DealCalm top-of-funnel videos finished by the queue (queue.json "done")
  output/dealcalm-long/<slug>.mp4                         the 110 s full-CTA DealCalm revamp (Nov 2026)
  output/other/<slug>.mp4                                  everything else (ai-boom, dot-com, ...)
Only final deliverables are copied (30 fps finals or the last full-quality council render), never 10 fps drafts.
"""
import json, os, re, shutil

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(WS, "output")
# finished before the queue existed: (folder, render file, subfolder, output name)
MANUAL = [
    ("altman-ousted", "altman-ousted-r5.mp4", "dealcalm-long", "altman-ousted"),
    ("blockbuster-netflix", "blockbuster-netflix-r5.mp4", "dealcalm-long", "blockbuster-netflix"),
    ("buffett-berkshire", "buffett-berkshire-r5.mp4", "dealcalm-long", "buffett-berkshire"),
    ("jobs-coup", "jobs-coup-r5.mp4", "dealcalm-long", "jobs-coup"),
    ("jordan-nike", "jordan-nike-r5.mp4", "dealcalm-long", "jordan-nike"),
    ("gates-ibm", "gates-ibm-r5.mp4", "dealcalm-long", "gates-ibm"),
    ("ford-ferrari", "ford-ferrari-r5.mp4", "dealcalm-long", "ford-ferrari"),
    ("disney-iger", "disney-iger-r7-props.mp4", "dealcalm-long", "disney-iger"),
    ("ai-boom", "ai-boom-r5.mp4", "other", "ai-boom"),
    ("dotcom-crash-lego", "dotcom-crash-lego-r6-final.mp4", "other", "dotcom-crash-lego"),
    ("dotcom-crash", "dotcom-crash-v2-enceladus.mp4", "other", "dotcom-crash-cartoon"),
]


def copy(src, dst):
    if not os.path.exists(src):
        return False
    if os.path.exists(dst) and os.path.getsize(dst) == os.path.getsize(src) and os.path.getmtime(dst) >= os.path.getmtime(src):
        return False
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(src, dst)
    return True


def main():
    n = 0
    for folder, f, sub, name in MANUAL:
        n += copy(os.path.join(WS, folder, "renders", f), os.path.join(OUT, sub, name + ".mp4"))
    q = os.path.join(WS, "queue.json")
    if os.path.exists(q):
        for it in json.load(open(q, encoding="utf-8")).get("items", []):
            mp4 = it.get("mp4")
            if it.get("status") == "done" and mp4 and mp4.endswith("-final.mp4"):
                slug = it["slug"]
                n += copy(mp4, os.path.join(OUT, "dealcalm-stories", slug + ".mp4"))
                n += copy(os.path.join(WS, slug, "POST.md"), os.path.join(OUT, "dealcalm-stories", slug + ".POST.md"))
    print(f"output/: {n} file(s) copied or updated")


if __name__ == "__main__":
    main()
