#!/usr/bin/env python3
"""Render-speed benchmark for THIS machine (macOS or Windows). Finds the best worker count and whether GPU encoding helps.

    <venv python> scripts/render_benchmark.py <finished-project>   [--workers 2,3,4,6] [--fps 10]

Renders the whole project at 10 fps (like a council draft) with each worker count, then the best one with 1.0x pixel ratio and
`--gpu` encoding, and compares GPU vs software encode quality (PSNR). Silent (never plays media). Writes
<project>/.hyperframes/render_benchmark.md and prints the recommended `workers` / `gpu_encode` Args for lego_council_workflow.py.
Reference (Mac M1 16 GB, 2026-11-16): 4 workers fastest; --gpu + 1.0x pixel ratio -> 1:18 for a 110 s video.
"""
import argparse, os, re, shutil, subprocess, sys, time

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ap = argparse.ArgumentParser()
ap.add_argument("project")
ap.add_argument("--workers", default="2,3,4,6")
ap.add_argument("--fps", default="10")
a = ap.parse_args()
P = a.project if os.path.isabs(a.project) else os.path.join(WS, a.project)
NPX = "npx.cmd" if os.name == "nt" else "npx"
TMP = os.path.join(WS, ".render-tmp"); os.makedirs(TMP, exist_ok=True)
ENV = dict(os.environ, TMPDIR=TMP + os.sep, TEMP=TMP, TMP=TMP)
OUT = os.path.join(P, ".hyperframes", "bench"); os.makedirs(OUT, exist_ok=True)
PROFILE = os.path.join(P, "assets", "render-profile.js")


def profile(pr):
    open(PROFILE, "w", encoding="utf-8").write("window.RENDER_PROFILE = " + (f'{{"pixelRatio": {pr}}}' if pr else "{}") + ";\n")


def run(label, workers, pr=None, gpu=False):
    profile(pr)
    mp4 = os.path.join(OUT, label + ".mp4")
    cmd = [NPX, "--yes", "hyperframes@0.9.46", "render", "--fps", a.fps, "--quality", "standard", "--workers", str(workers), "--output", mp4]
    if gpu:
        cmd.append("--gpu")
    t0 = time.time()
    try:
        r = subprocess.run(cmd, cwd=P, env=ENV, capture_output=True, text=True, timeout=1200, stdin=subprocess.DEVNULL)
        ok = r.returncode == 0 and os.path.exists(mp4)
        tail = (r.stdout or "")[-3000:]
    except subprocess.TimeoutExpired:
        ok, tail = False, "timeout"
    finally:
        profile(None)
        for d in os.listdir(TMP):
            if d.startswith("hf-"):
                shutil.rmtree(os.path.join(TMP, d), ignore_errors=True)
    secs = time.time() - t0
    stage = (re.search(r"screenshot capture.*", tail) or re.search(r"capture .*", tail))
    print(f"{label:16s} workers={workers:<4} pr={pr or 1.5:<4} gpu={gpu!s:5s} {'OK ' if ok else 'ERR'} {secs:6.1f}s  {stage.group(0)[:110] if stage else ''}", flush=True)
    return secs if ok else 1e9, mp4


rows = []
best_w, best_t = None, 1e9
for w in [x.strip() for x in a.workers.split(",") if x.strip()]:
    t, _ = run(f"w{w}", w)
    rows.append((f"{w} workers", t))
    if t < best_t:
        best_t, best_w = t, w
t_sw, mp4_sw = run(f"w{best_w}_sw", best_w)
t_gpu, mp4_gpu = run(f"w{best_w}_gpu", best_w, gpu=True)
t_pr1, _ = run(f"w{best_w}_pr1_gpu", best_w, pr=1.0, gpu=True)
psnr = "?"
if t_gpu < 1e9 and t_sw < 1e9:
    q = subprocess.run(["ffmpeg", "-i", mp4_sw, "-i", mp4_gpu, "-lavfi", "psnr", "-f", "null", "-"], capture_output=True, text=True).stderr
    m = re.search(r"average:([\d.]+)", q); psnr = m.group(1) if m else "?"
gpu_ok = t_gpu < t_sw * 0.97 and psnr != "?" and float(psnr) >= 40
md = ["# Render benchmark", "", f"Project `{os.path.basename(P)}` at {a.fps} fps, {sys.platform}.", "", "| Setting | Seconds |", "|---|---|"]
md += [f"| {k} | {v:.1f} |" if v < 1e9 else f"| {k} | failed |" for k, v in rows]
md += [f"| {best_w} workers + `--gpu` | {t_gpu:.1f} |" if t_gpu < 1e9 else f"| {best_w} workers + `--gpu` | failed |",
       f"| {best_w} workers + `--gpu` + 1.0x pixel ratio | {t_pr1:.1f} |" if t_pr1 < 1e9 else "| + 1.0x pixel ratio | failed |",
       "", f"GPU vs software encode PSNR: {psnr} dB (>= 40 = visually the same).", "",
       f"**Recommended workflow Args:** `\"workers\": {best_w}, \"gpu_encode\": {str(gpu_ok).lower()}`"]
open(os.path.join(P, ".hyperframes", "render_benchmark.md"), "w", encoding="utf-8").write("\n".join(md))
shutil.rmtree(OUT, ignore_errors=True)
print("\n".join(md))
