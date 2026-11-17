# Template: TikTok explainer

Don't work in this folder. Copy it: `python scripts/new_video.py <name>` (from the workspace root), then follow `../../PLAYBOOK.md`.

It ships as a complete 23 s demo, "Why bees build hexagons". Run `python tools/build.py --no-voice` and then `npx hyperframes snapshot --at 0.2,9,18.6` to see it.

You edit only these files:
- `script.json`: the words and the voice
- `cues.json`: what happens on which spoken words
- `assets/scene.js`: the 3D visuals (the rules are in the comment box at its top)

Everything else is the engine or is generated. See the table in `../../README.md`.
