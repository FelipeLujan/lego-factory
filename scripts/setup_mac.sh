#!/bin/zsh
# One-time setup on a new Mac after `git clone`. Run from the repo root:  zsh scripts/setup_mac.sh
# Creates .venv/ from requirements.txt and checks the tools the video pipeline needs. Safe to re-run.
set -e
cd "$(dirname "$0")/.."
ok()   { print -P "%F{green}OK%f   $1"; }
warn() { print -P "%F{yellow}TODO%f $1"; }

# 1. Python virtualenv
PY=$(command -v python3.14 || command -v python3.13 || command -v python3.12 || command -v python3)
[[ -z "$PY" ]] && { warn "install Python 3.12+ (brew install python)"; exit 1; }
[[ -d .venv ]] || "$PY" -m venv .venv
.venv/bin/python -m pip install -q --upgrade pip
.venv/bin/python -m pip install -q -r requirements.txt
ok "Python venv: $(.venv/bin/python --version) with numpy, faster-whisper, av<19, yt-dlp"

# 2. System tools
command -v ffmpeg >/dev/null && ok "ffmpeg" || warn "install ffmpeg:  brew install ffmpeg"
if command -v node >/dev/null; then
  v=$(node -p 'process.versions.node.split(".")[0]'); (( v >= 22 )) && ok "node $(node --version)" || warn "Node 22+ needed (have $(node --version))"
else warn "install Node 22+:  brew install node   (or nvm)"; fi
if command -v npx >/dev/null; then
  npx --yes hyperframes@0.9.46 --version >/dev/null 2>&1 && ok "HyperFrames 0.9.46 (npx)" || warn "npx hyperframes@0.9.46 failed: check network / Node"
fi
if command -v gcloud >/dev/null; then
  gcloud auth print-access-token >/dev/null 2>&1 && ok "gcloud authenticated (project: $(gcloud config get-value project 2>/dev/null))" \
    || warn "gcloud auth login   (Google Cloud TTS voices need it; enable the Text-to-Speech API on your project)"
else warn "install the Google Cloud CLI (brew install --cask google-cloud-sdk), then: gcloud auth login && gcloud config set project <id>"; fi

# 3. Working folders (ignored by git)
mkdir -p .render-tmp
ok "render temp folder .render-tmp/ (renders use TMPDIR=<repo>/.render-tmp/ so the internal disk doesn't fill)"
echo
echo "Done. Open this folder in Antigravity (agy) and ask for a video, e.g.:"
echo '  "Make a LEGO-style explainer about <topic>, ~100 s, using the legoCouncil (max 5 rounds)."'
echo "Agents read AGENTS.md -> PLAYBOOK.md and .agents/skills/lego-explainer automatically."
echo "Optional: music needs a HeyGen sign-in:  npx hyperframes auth login"
