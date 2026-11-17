#!/usr/bin/env python3
"""Make a review pack for the video council from a rendered MP4 (macOS).

    .venv/bin/python scripts/council_pack.py <project-dir> <round> [render.mp4]

Writes <project-dir>/council/r<round>/:
    sheet-01.jpg ...   contact sheets: one frame every 1.5 s, 12 per sheet, each stamped with its time
    ch-XX-<t>s.jpg     full-size frames 0.45 s after every chapter cut (what a viewer sees at each new section)
    motion-XX.jpg      8 frames 0.25 s apart from each section start (judge animation / camera moves)
    AUDIO.md           level and brightness every 0.5 s (hiss check), plus the sound-design cue list
    PACK.md            the script, the cue list, loudness, and the list of files a council seat must read

Council seats are fresh subagents that can view images. See docs/COUNCIL.md.
"""
import json
import os
import re
import subprocess
import sys
import numpy as np

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) < 3:
    print(__doc__)
    sys.exit(1)

proj, rnd = sys.argv[1], sys.argv[2]
P = os.path.abspath(proj) if os.path.isabs(proj) else os.path.join(WS, proj)
if not os.path.isdir(P):
    print(f"ERROR: project directory not found: {P}")
    sys.exit(1)

mp4 = os.path.abspath(sys.argv[3]) if len(sys.argv) > 3 else None
if not mp4:
    renders_dir = os.path.join(P, "renders")
    cands = sorted(
        [f for f in os.listdir(renders_dir) if f.endswith(".mp4")],
        key=lambda f: os.path.getmtime(os.path.join(renders_dir, f)),
    )
    if not cands:
        print(f"ERROR: no .mp4 files found in {renders_dir}")
        sys.exit(1)
    mp4 = os.path.join(renders_dir, cands[-1])

out = os.path.join(P, "council", f"r{rnd}")
os.makedirs(out, exist_ok=True)

dur = float(
    subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4],
        capture_output=True,
        text=True,
        check=True,
    ).stdout.strip()
)

FONT_CANDIDATES = [
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",   # macOS
    "/System/Library/Fonts/Helvetica.ttc",
    "C:/Windows/Fonts/arialbd.ttf",                        # Windows
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", # Linux / WSL
]
font = next((f for f in FONT_CANDIDATES if os.path.exists(f)), FONT_CANDIDATES[0])
font_esc = font.replace(":", "\\:").replace("'", "\\'")

# 1. Contact sheets: every 1.5 s, 4 x 3 per sheet, time stamped
vf = (
    f"fps=1/1.5,scale=360:-1,"
    f"drawtext=fontfile='{font_esc}':text='%{{pts\\:hms}}':x=8:y=8:fontsize=22:"
    f"fontcolor=white:box=1:boxcolor=black@0.6,tile=4x3"
)
subprocess.run(
    ["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vf", vf, "-q:v", "5", os.path.join(out, "sheet-%02d.jpg")],
    check=True,
)

# 2. Chapter frames from the generated cues
cues_text = open(os.path.join(P, "assets", "cues.js"), encoding="utf-8").read()
m = re.search(r"window\.FILM_CUES\s*=\s*(\{.*\});?\s*$", cues_text, re.S)
C = json.loads(m.group(1)) if m else {"chapters": []}
times = [0.3] + [round(c + 0.45, 2) for c in C.get("chapters", [])] + [round(dur - 0.4, 2)]
# Smaller packs (2026-11-16): every seat stores every image in its conversation on the internal SSD. Cap the chapter
# stills / motion strips at MAX_STILLS (evenly spaced, always keeping the first and last); the contact sheets still
# show every 1.5 s of the video.
MAX_STILLS = int(os.environ.get("COUNCIL_MAX_STILLS", "16"))
if len(times) > MAX_STILLS:
    idx = sorted({round(i * (len(times) - 1) / (MAX_STILLS - 1)) for i in range(MAX_STILLS)})
    times = [times[i] for i in idx]
for i, t in enumerate(times):
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", mp4,
            "-frames:v", "1", "-vf", "scale=540:-1", "-q:v", "5",
            os.path.join(out, f"ch-{i:02d}-{t:.1f}s.jpg"),
        ],
        check=True,
    )

# 3. Motion strips: 8 frames 0.25 s apart from each section start
for i, t in enumerate(times[:-1]):
    t0 = max(0, t - 0.35)
    mvf = (
        f"fps=4,scale=200:-1,"
        f"drawtext=fontfile='{font_esc}':text='%{{pts\\:hms}}':x=4:y=4:fontsize=14:"
        f"fontcolor=white:box=1:boxcolor=black@0.6,tile=8x1"
    )
    subprocess.run(
        [
            "ffmpeg", "-v", "error", "-y", "-ss", str(t0), "-i", mp4,
            "-vf", mvf, "-frames:v", "1", "-copyts",
            os.path.join(out, f"motion-{i:02d}.jpg"),
        ],
        check=False,
    )

# 4. Audio report: level and brightness every 0.5 s (hiss check on effects bed alone)
bed = os.path.join(P, "assets", "sfx", "sfx-bed.wav")
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", mp4, "-f", "f32le", "-ac", "1", "-ar", "22050", "-"],
    capture_output=True,
).stdout
rawb = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", bed, "-f", "f32le", "-ac", "1", "-ar", "22050", "-"],
    capture_output=True,
).stdout
xb = np.frombuffer(rawb, dtype=np.float32)
x = np.frombuffer(raw, dtype=np.float32)
SR = 22050
win = SR // 2
rows = []
hissy = 0
for k in range(0, len(x) - win, win):
    seg = x[k : k + win]
    rms = float(np.sqrt(np.mean(seg ** 2)) + 1e-9)
    db = 20 * np.log10(rms)
    sb = xb[k : k + win] if k + win <= len(xb) else np.zeros(win, dtype=np.float32)
    Sb = np.abs(np.fft.rfft(sb * np.hanning(len(sb)))) + 1e-12
    frb = np.fft.rfftfreq(len(sb), 1 / SR)
    dbb = 20 * np.log10(float(np.sqrt(np.mean(sb ** 2)) + 1e-9))
    hi = float(Sb[frb > 4000].sum() / Sb.sum()) if dbb > -45 else 0.0
    if hi > 0.35:
        hissy += 1
    rows.append(
        f"| {k / SR:5.1f} | {db:6.1f} dB | {'#' * max(0, int((db + 50) / 2.5))} | {hi:.2f}{' HISS?' if hi > 0.35 else ''} |"
    )

cj = json.load(open(os.path.join(P, "cues.json"), encoding="utf-8"))
snd = [s["sound"] for s in cj.get("sfx", [])]
aud = [
    "# Audio report",
    "",
    f"Distinct story sounds: {len(set(snd))} ({', '.join(sorted(set(snd)))}); story cues: {len(snd)}; plus automatic section whooshes, slam drums and the payoff riser.",
    f"Effects-bed windows flagged as possible hiss (>35% of energy above 4 kHz while the effects are audible): {hissy} of {len(rows)}. (The voice is excluded: its s-sounds are bright by nature.)",
    "",
    "| t (s) | mix level | meter | effects-bed share >4 kHz (0 = effects silent) |",
    "|---|---|---|---|",
] + rows
open(os.path.join(out, "AUDIO.md"), "w", encoding="utf-8").write("\n".join(aud))

# 5. Loudness (native macOS npx call with --yes and pinned version from package.json)
hf_pkg = "hyperframes@0.9.46"
pkg_path = os.path.join(P, "package.json")
if os.path.exists(pkg_path):
    m_pkg = re.search(r"hyperframes@[\d.]+", open(pkg_path, encoding="utf-8").read())
    if m_pkg:
        hf_pkg = m_pkg.group(0)

lo = subprocess.run(
    ["npx.cmd" if os.name == "nt" else "npx", "--yes", hf_pkg, "audio", mp4, "--json"],
    capture_output=True,
    text=True,
    cwd=P,
    stdin=subprocess.DEVNULL,
).stdout
try:
    L = json.loads(lo)["items"][0]["loudness"]
    loud = f"integrated {L.get('lufsIntegrated')} LUFS, true peak {L.get('truePeakDb')} dB"
except Exception:
    loud = "(could not measure)"

script = json.load(open(os.path.join(P, "script.json"), encoding="utf-8"))
sheets = sorted(f for f in os.listdir(out) if f.startswith("sheet-"))
chs = sorted(f for f in os.listdir(out) if f.startswith("ch-"))
motions = sorted(f for f in os.listdir(out) if f.startswith("motion-"))

lines = (
    [
        f"# Review pack: {os.path.basename(P)}, round {rnd}",
        "",
        f"Video: `{mp4}` ({dur:.1f} s, 1080x1920, 30 fps). Audio: {loud}.",
        "",
        "## Frames to view (all of them)",
        "",
    ]
    + [f"- `{os.path.join(out, f)}`" for f in sheets + chs]
    + [
        "",
        "## Motion strips (8 frames, 0.25 s apart, from each section start: judge movement here)",
        "",
    ]
    + [f"- `{os.path.join(out, f)}`" for f in motions]
    + [
        "",
        f"## Audio: read `{os.path.join(out, 'AUDIO.md')}` (level every 0.5 s, hiss check, sound variety). Judge sound from this report.",
        "",
        "## Voiceover script (spoken, in order)",
        "",
    ]
    + [f"{i + 1}. {l['text']}" for i, l in enumerate(script["lines"])]
    + [
        "",
        "## On-screen extras",
        "",
        f"- Hook title: {cj.get('hook')}",
        f"- End title: {cj.get('end')}",
        f"- Big number slams: {[(s['letter'], s['word']) for s in cj.get('slams', [])]}",
        f"- Name tags: {[s['text'] for s in cj.get('tags', [])]}",
        f"- Sound effects (word -> sound): {[(s['at'] if isinstance(s['at'], str) else s['at']['at'], s['sound']) for s in cj.get('sfx', [])]}",
        "  plus a whoosh on every section cut, drum + bass under every number slam, a riser into the payoff word.",
        "",
    ]
)
open(os.path.join(out, "PACK.md"), "w", encoding="utf-8").write("\n".join(lines))
print(f"Pack written: {out}  ({len(sheets)} sheets, {len(chs)} chapter frames, {len(motions)} motion strips)")
