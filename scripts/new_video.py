#!/usr/bin/env python3
"""Create a new video project from a workspace template (macOS).

    .venv/bin/python scripts/new_video.py <project-name> [--template brick-story|brick-cinematic]

Example:
    .venv/bin/python scripts/new_video.py octopus-brains
    .venv/bin/python scripts/new_video.py getty-ransom --template brick-story
    .venv/bin/python scripts/new_video.py starship-f16 --template brick-cinematic

Creates <workspace>/<project-name>/ as a copy of templates/<template>/ (default tiktok-explainer).
Then follow PLAYBOOK.md from step 3.
"""
import datetime
import json
import os
import re
import shutil
import sys

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
tpl = "tiktok-explainer"
if "--template" in args:
    i = args.index("--template")
    tpl = args[i + 1] if i + 1 < len(args) else ""
    del args[i : i + 2]

TEMPLATE = os.path.join(WS, "templates", tpl)
if not os.path.isdir(TEMPLATE):
    print(f"ERROR: no template folder templates/{tpl}")
    sys.exit(1)

if len(args) != 1 or not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,40}", args[0]):
    print("Usage: .venv/bin/python scripts/new_video.py <project-name> [--template brick-story|brick-cinematic]")
    sys.exit(1)

name = args[0]
dest = os.path.join(WS, name)
if os.path.exists(dest):
    print(f"ERROR: {dest} already exists. Pick another name, or work in that folder.")
    sys.exit(1)

shutil.copytree(
    TEMPLATE,
    dest,
    ignore=shutil.ignore_patterns(".hyperframes", "renders", "node_modules", "__pycache__", "*.mp4", ".DS_Store"),
)
meta_p = os.path.join(dest, "meta.json")
meta = json.load(open(meta_p, encoding="utf-8"))
meta.update({"id": name, "name": name, "createdAt": datetime.datetime.now(datetime.timezone.utc).isoformat()})
json.dump(meta, open(meta_p, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
os.makedirs(os.path.join(dest, "renders"), exist_ok=True)
print(f"Created {dest}")
print(f"Template: {tpl}. It still contains the DEMO. Replace, in this order:")
print("  1. script.json      (the words)")
print("  2. cues.json        (what happens on which spoken words)")
print("  3. assets/scene.js  (the 3D visuals)")
print(f'Then:  cd "{dest}" && ../.venv/bin/python tools/build.py')
