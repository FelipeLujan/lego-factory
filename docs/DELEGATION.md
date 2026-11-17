# Delegating a video to another AI (macOS)

Use this when the person says "delegate it" to a subagent or Swarm worker.
The other agent does the work. **You (the orchestrator) own the result**: you review it before the person sees it.

## Which agent

| Agent | How | When |
|---|---|---|
| Subagent (`self`) | `invoke_subagent` with `TypeName: "self"` | isolated task in the workspace |
| Swarm worker | `swarm` (`action: "add"`, e.g. `claude-opus-5-5-high` or `gemini-4-carbon-high`) | parallel or model-pinned work |

## The brief (copy, fill in the `<>` parts, send as the task)

```
You are making a short vertical TikTok video in "<workspace>".

READ FIRST, in full, before doing anything:
  1. "<workspace>/AGENTS.md"
  2. "<workspace>/PLAYBOOK.md"   (follow it step by step; do not skip the CHECK at the end of each step)

THE VIDEO
  Topic / reference: <topic, or the reference URL>
  Project name:      <lowercase-with-dashes>
  Target length:     <e.g. 60-75 seconds>
  Must include:      <facts, people, numbers the person wants; or "nothing specific">
  Special requests:  <e.g. "different voice", "no history section"; or "none">

HARD RULES
  - Create the project with:  .venv/bin/python scripts/new_video.py <project-name>
  - You only edit three files: script.json, cues.json, assets/scene.js
    (plus index.html colour variables if asked).
  - Every fact must be true. If unsure, leave it out and list it in your report.
  - Voice: en-US-Chirp3-HD-Sadachbia unless told otherwise. Never Charon.
  - Sounds: only names from assets/sfx/sounds.json; each sound at most about 6 times;
    never glitch, sparkle, key-press or click sounds.
  - Write assets/scene.js modularly in clean steps.
  - Run .venv/bin/python tools/build.py until it prints no WARNINGS.
  - Run the snapshot command the build prints and LOOK at every frame (PLAYBOOK section 6) before rendering.
  - Render to renders/<project-name>-v1.mp4.

WHEN DONE, REPLY WITH EXACTLY:
  VIDEO: <full path to the mp4>  LENGTH: <seconds>
  SCRIPT: <the full script text>
  VISUALS: <2-3 lines: what is shown in each chapter>
  SNAPSHOTS: <full path to the contact sheet you checked>
  LOUDNESS: <lufsIntegrated and truePeakDb from npx hyperframes audio>
  CREDITS: <the copy-paste credit line from assets/sfx/CREDITS.md>
  UNSURE / NOT DONE: <anything you could not do or verify; or "none">
```

## What you check before telling the person (orchestrator review)

1. View the contact sheet and run your own snapshot at 3–4 chapter times. Check for:
   - flat solid-colour boxes (emissive glow too high; keep emissive on real objects ≤ 0.1);
   - a small detail the voice talks about hidden behind other objects;
   - a black frame;
   - a missing or tiny subject;
   - captions covering the subject;
   - the same picture for many seconds.
2. `npx hyperframes check --json` in the project: 0 errors.
3. Read `script.json`: is every fact true, and does it sound like a TikTok hook (not an essay)?
4. Read `cues.json`: chapters every 3–6 s, accent words set, no banned sounds.
5. Fix small problems yourself. Send it back with specific notes only when the visuals are wrong as a whole.
