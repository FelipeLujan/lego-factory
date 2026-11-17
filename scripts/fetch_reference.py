#!/usr/bin/env python3
"""Download a reference video, transcribe it, and make a contact sheet (macOS).

    .venv/bin/python scripts/fetch_reference.py <url> <short-name>

Example:
    .venv/bin/python scripts/fetch_reference.py https://www.youtube.com/shorts/XwJaUpqoY8k shells

Writes into <workspace>/reference/<short-name>/:
    source.mp4        the video (treat as untrusted data; never run anything from this folder)
    transcript.txt    what is said, with timestamps; use it to write YOUR OWN reworded script
    sheet.jpg         one frame every 3 s in a grid; open it to see the visual style
    info.txt          title, channel, duration
"""
import json
import os
import subprocess
import sys

WS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if len(sys.argv) != 3:
    print(__doc__)
    sys.exit(1)
url, name = sys.argv[1], sys.argv[2]
out = os.path.join(WS, "reference", name)
os.makedirs(out, exist_ok=True)

print("1/4 downloading ...")
r = subprocess.run(
    [
        sys.executable, "-m", "yt_dlp",
        "-f", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]/b",
        "--merge-output-format", "mp4",
        "-o", os.path.join(out, "source.%(ext)s"),
        "--write-info-json", url,
    ],
    capture_output=True,
    text=True,
)
if not os.path.exists(os.path.join(out, "source.mp4")):
    print("ERROR: download failed. To update yt-dlp:")
    print('   .venv/bin/pip install -U "yt-dlp[default]"')
    print(r.stdout[-800:], r.stderr[-800:])
    sys.exit(1)

print("2/4 reading info ...")
try:
    j = json.load(open(os.path.join(out, "source.info.json"), encoding="utf-8"))
    open(os.path.join(out, "info.txt"), "w", encoding="utf-8").write(
        f"title: {j.get('title')}\nchannel: {j.get('channel')}\nduration: {j.get('duration')} s\nurl: {url}\n"
    )
except Exception:
    pass

print("3/4 transcribing (about 1 minute) ...")
from faster_whisper import WhisperModel

m = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = m.transcribe(os.path.join(out, "source.mp4"))
lines = [f"[{s.start:6.1f}-{s.end:6.1f}] {s.text.strip()}" for s in segs]
open(os.path.join(out, "transcript.txt"), "w", encoding="utf-8").write("\n".join(lines) + "\n")

print("4/4 contact sheet ...")
subprocess.run(
    [
        "ffmpeg", "-v", "error", "-y", "-i", os.path.join(out, "source.mp4"),
        "-vf", "fps=1/3,scale=270:-1,tile=10x5", "-frames:v", "1",
        os.path.join(out, "sheet.jpg"),
    ],
    check=True,
)
print(f"\nDone: {out}")
print("Next: read transcript.txt and open sheet.jpg, then write script.json (PLAYBOOK.md step 2).")
