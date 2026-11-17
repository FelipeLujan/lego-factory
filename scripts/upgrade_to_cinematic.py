#!/usr/bin/env python3
"""Move an existing brick-story / tiktok-explainer project onto the brick-cinematic engine (macOS).

    .venv/bin/python scripts/upgrade_to_cinematic.py <project-dir>

What it does (idempotent; safe to run twice):
  1. Backs up the current script.json, cues.json, assets/scene.js, index.html and renders list to <project>/_pre-cinematic/
     (only the first time) and keeps the old scene as assets/scene.brickstory.js for reference.
  2. Copies the cinematic engine from templates/brick-cinematic: compositions/stage.html, assets/{brick-kit,fx-kit,ldraw-kit,
     ldraw-parts,film}.js, assets/tex/, tools/*.py, and the full curated sound library (assets/sfx/*.mp3, sounds.json, CREDITS.md).
  3. Rewrites the <script> tags in index.html so ldraw-parts.js, brick-kit.js, fx-kit.js and ldraw-kit.js load before scene.js.
The project's own script.json, cues.json and assets/scene.js are left for the author to rewrite.
"""
import os
import re
import shutil
import sys

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TPL = os.path.join(WS, "templates", "brick-cinematic")

if len(sys.argv) < 2:
    print(__doc__)
    sys.exit(1)
P = sys.argv[1] if os.path.isabs(sys.argv[1]) else os.path.join(WS, sys.argv[1])
if not os.path.isdir(P):
    sys.exit(f"ERROR: not a folder: {P}")

bk = os.path.join(P, "_pre-cinematic")
if not os.path.isdir(bk):
    os.makedirs(bk)
    for rel in ["script.json", "cues.json", "index.html", "assets/scene.js"]:
        src = os.path.join(P, rel)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(bk, os.path.basename(rel)))
    old_scene = os.path.join(P, "assets", "scene.js")
    if os.path.exists(old_scene):
        shutil.copy2(old_scene, os.path.join(P, "assets", "scene.brickstory.js"))
    print(f"backup  : {bk}")

for rel in ["assets/render-profile.js", "compositions/stage.html", "assets/brick-kit.js", "assets/fx-kit.js", "assets/ldraw-kit.js",
            "assets/ldraw-parts.js", "assets/film.js"]:
    os.makedirs(os.path.dirname(os.path.join(P, rel)), exist_ok=True)
    shutil.copy2(os.path.join(TPL, rel), os.path.join(P, rel))
shutil.copytree(os.path.join(TPL, "assets", "tex"), os.path.join(P, "assets", "tex"), dirs_exist_ok=True)
for f in os.listdir(os.path.join(TPL, "tools")):
    if f.endswith(".py"):
        shutil.copy2(os.path.join(TPL, "tools", f), os.path.join(P, "tools", f))
sfx_src, sfx_dst = os.path.join(TPL, "assets", "sfx"), os.path.join(P, "assets", "sfx")
os.makedirs(sfx_dst, exist_ok=True)
for f in os.listdir(sfx_src):
    if f.endswith(".mp3") or f in ("sounds.json", "CREDITS.md"):
        shutil.copy2(os.path.join(sfx_src, f), os.path.join(sfx_dst, f))
if not os.path.exists(os.path.join(P, "assets", "props-kit.js")):  # shared prop library (the Disney r7 quality bar); project may extend it
    shutil.copy2(os.path.join(TPL, "assets", "props-kit.js"), os.path.join(P, "assets", "props-kit.js"))
print("engine  : stage.html, brick-kit, fx-kit, ldraw-kit, ldraw-parts, film.js, tex/, tools/*.py, sfx library copied")

idx = os.path.join(P, "index.html")
s = open(idx, encoding="utf-8").read()
s = re.sub(r'\s*<script src="assets/(render-profile|ldraw-parts|brick-kit|fx-kit|ldraw-kit|props-kit)\.js"></script>', "", s)
block = ('<script src="assets/film.js"></script>\n'
         '    <script src="assets/render-profile.js"></script>\n'
         '    <script src="assets/ldraw-parts.js"></script>\n'
         '    <script src="assets/brick-kit.js"></script>\n'
         '    <script src="assets/fx-kit.js"></script>\n'
         '    <script src="assets/ldraw-kit.js"></script>\n'
         '    <script src="assets/props-kit.js"></script>')
s = s.replace('<script src="assets/film.js"></script>', block, 1)
open(idx, "w", encoding="utf-8").write(s)
print("index   : script tags set (film -> ldraw-parts -> brick-kit -> fx-kit -> ldraw-kit -> scene)")
print("next    : rewrite assets/scene.js for brick-cinematic (K.mfig + FXKIT + per-shot look), then tools/build.py")
