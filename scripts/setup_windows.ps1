# One-time setup on a Windows PC after `git clone`. Run from the repo root in PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts\setup_windows.ps1
# Creates .venv\ from requirements.txt and checks the tools the video pipeline needs. Safe to re-run.
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
function Ok($m)   { Write-Host "OK   $m" -ForegroundColor Green }
function Todo($m) { Write-Host "TODO $m" -ForegroundColor Yellow }
function Have($c) { [bool](Get-Command $c -ErrorAction SilentlyContinue) }

# 1. Python virtualenv
$py = if (Have "py") { "py" } elseif (Have "python") { "python" } else { $null }
if (-not $py) { Todo "install Python 3.12+:  winget install Python.Python.3.12"; exit 1 }
if (-not (Test-Path ".venv")) { & $py -m venv .venv }
& .\.venv\Scripts\python.exe -m pip install -q --upgrade pip
& .\.venv\Scripts\python.exe -m pip install -q -r requirements.txt
Ok ("Python venv: " + (& .\.venv\Scripts\python.exe --version) + " with numpy, faster-whisper, av<19, yt-dlp")

# 2. System tools
if (Have "ffmpeg") { Ok "ffmpeg" } else { Todo "install ffmpeg:  winget install Gyan.FFmpeg   (then open a new terminal)" }
if (Have "node") {
  $v = [int]((node -p "process.versions.node.split('.')[0]"))
  if ($v -ge 22) { Ok ("node " + (node --version)) } else { Todo ("Node 22+ needed (have " + (node --version) + "):  winget install OpenJS.NodeJS.LTS") }
} else { Todo "install Node 22+:  winget install OpenJS.NodeJS.LTS" }
if (Have "npx") {
  npx.cmd --yes hyperframes@0.9.46 --version *> $null
  if ($LASTEXITCODE -eq 0) { Ok "HyperFrames 0.9.46 (npx)" } else { Todo "npx hyperframes@0.9.46 failed: check network / Node" }
}
if (Have "gcloud") {
  gcloud auth print-access-token *> $null
  if ($LASTEXITCODE -eq 0) { Ok ("gcloud authenticated (project: " + (gcloud config get-value project 2>$null) + ")") }
  else { Todo "gcloud auth login   (Google Cloud TTS needs it; enable the Text-to-Speech API on your project)" }
} else { Todo "install the Google Cloud CLI:  winget install Google.CloudSDK   then: gcloud auth login; gcloud config set project <id>" }

# 3. Working folders (ignored by git)
New-Item -ItemType Directory -Force -Path ".render-tmp" | Out-Null
Ok "render temp folder .render-tmp\ (the council workflow points TEMP/TMP here during renders)"
Write-Host ""
Write-Host "Done. Open this folder in Antigravity (agy) and ask, for example:"
Write-Host '  "Make 3 DealCalm TOFU videos: (1) <story>, (2) <tactic>, (3) <everyday scenario>."'
Write-Host "First time on this PC: ask the agent to run scripts\render_benchmark.py to tune render workers / GPU encoding."
Write-Host "Optional: music needs a HeyGen sign-in:  npx hyperframes auth login"
