# PLAYBOOK: make a TikTok explainer video, step by step

This playbook is written so that **any AI agent** can make a video by following it literally.
Do the steps **in order**. Each step ends with a **CHECK**; do not go on until the check passes.
Paths are relative to the workspace `<workspace>` unless a step says otherwise. Use `.venv/bin/python` whenever running Python scripts.

> **What you are making:** a vertical video (1080×1920, 30 fps, 30–90 s) for TikTok.
> - It has a fast Google Cloud TTS voiceover and 3D visuals on a black stage with a light mesh.
> - Captions are 1–2 words and change about every 0.5 s.
> - The camera stays steady on captions (no per-caption punch or roll); a white flash plus a gentle whip marks every chapter.
> - Big letters slam onto the screen on key points, and every moment has its own sound effect.
>
> Example of the finished style: `shell-rule/renders/shell-rule-tiktok-v5.mp4`.

---

## 0. Before anything: check the machine (1 minute)

Run each command. Every one must succeed.

```powershell
gcloud auth print-access-token        # prints a long token          -> Google Cloud TTS works
python -c "import faster_whisper, numpy; print('ok')"   # prints ok   -> transcription works
ffmpeg -version                       # prints a version
npx hyperframes --version             # prints a version
```

If one fails, stop and tell the person exactly which one failed and the error. Do not try other tools instead.

---

## 1. Understand the request

The person gives you one of the following:
- **A reference video link** ("make one like this"): run
  `python scripts/fetch_reference.py <url> <short-name>`
  then read `reference/<short-name>/transcript.txt` and open `reference/<short-name>/sheet.jpg`.
  **Keep the concepts, reword everything, and use our colours.** Never copy the reference's sentences, frames or palette.
- **A topic** ("make a video about X"): research the facts you need. Every claim must be true.

**CHECK:** You can say, in one sentence, the single idea the viewer must remember.

---

## 2. Write the script

Create the project first. The name is lowercase with dashes:

```powershell
python scripts/new_video.py <project-name>
cd "<project-name>"
```

Then replace `script.json` with your script. Format:

```json
{
  "voice": "en-US-Chirp3-HD-Sadachbia",
  "rate": 1.1,
  "lines": [
    {"id": "hook", "gap": 0.1,  "text": "Every seashell on Earth is secretly the same shell."},
    {"id": "two",  "gap": 0.05, "text": "Only three numbers change."}
  ]
}
```

**Script rules**
1. **Line 1 is the hook**: a surprising claim or question, at most 12 words. No "Hi", no "In this video".
2. One idea per line, 4–16 words per line. Short sentences. Spoken English, not essay English.
3. **Length:** about 2.7 spoken words per second at rate 1.1, so 30 s ≈ 80 words, 60 s ≈ 160 words and 75 s ≈ 200 words. Hit the requested length ±10% by adding or removing *content*, never by padding.
4. Write numbers the way they are spoken when it matters: "1966" is fine, but write "three times", not "3x".
5. Structure that works: hook → setup (show the examples) → "Number one / two / three" explanations → the twist or history → the payoff → a one-line ending that loops back to the hook.
6. `gap` is the pause after a line in seconds: 0.05 inside a section, 0.1–0.15 at the end of a section. Never more than 0.2 (TikTok pace).
7. The `id`s are just labels: short, unique, no spaces.
8. **Voice:** keep `en-US-Chirp3-HD-Sadachbia`. **Never use `Charon`** (the person finds it overused). If the person asks for another voice, uncommon good ones are `Laomedeia` (female, upbeat), `Zubenelgenubi` (male, casual) and `Achird` (friendly). Write the full name, e.g. `en-US-Chirp3-HD-Laomedeia`.

**CHECK:** The word count divided by 2.7 is within 10% of the target length in seconds.

---

## 3. Make the voice (first build)

```powershell
python tools/build.py
```

The first run calls Google Cloud TTS and then transcribes the voice (about 1 minute). It prints sections `1. Voice` … `5. Report`.
The demo's `cues.json` will produce WARNINGS now, because its phrases are not in your script. That is expected; you fix it in step 4.

**CHECK:**
- The report's `length` is within 10% of the target. Too long: cut words, or raise `"rate"` to at most 1.2. Too short: add content. Then re-run.
- Each voice build is a new TTS take, and takes vary by about ±4% in length even with the same text and rate (one 115 s script came out 111.8–119.9 s). To hit an exact length, nudge `"rate"` by 0.02–0.04 and rebuild; don't rewrite the script for a 2–4 s miss.
- `assets/voice/voice.wav` exists.

---

## 4. Write the cues (`cues.json`)

`cues.json` says **what happens on which spoken words**. Every `"at"` is a phrase copied **exactly** from your script (case and punctuation don't matter). For the 2nd time a phrase is spoken, write `{"at": "one", "nth": 2}`.

```json
{
  "hook":  { "line1": "One shell.", "line2": "Three numbers." },
  "end":   { "line1": "Three numbers.", "line2": "Every shell." },
  "accent": ["shell", "three", "snail", "nautilus", "clam", "cube", "empty"],
  "chapters": ["take a snail", "number one", "number two", "number three", "in 1966", "then he built"],
  "big_moves": ["five shapes", "then he built"],
  "slams": [ { "at": "number one", "letter": "W", "word": "WIDENS" } ],
  "tags":  [ { "at": "david raup", "text": "DAVID RAUP · 1966", "hold": 3.0 } ],
  "payoff": "empty",
  "sfx": [
    { "at": "aren't", "sound": "scratch", "max_len": 1.2 },
    { "at": "five shapes", "sound": "woodblock", "run": [0, 2, 4, 7, 9] },
    { "at": "tower", "sound": "slide-whistle", "gain": 0.2 }
  ]
}
```

| Key | What it does | How many |
|---|---|---|
| `hook` | Big title on screen from frame 0 (it is also the thumbnail). Two short lines; line 2 is coral. | 1 |
| `end` | Big title for the last 2.4 s. Make it echo the hook so the video loops. | 1 |
| `accent` | Words that get coloured in the captions (coral and lime alternate). Pick the nouns and numbers that matter. | 10–60 |
| `chapters` | Each one is a new section: white flash + camera whip + whoosh. **Must be in spoken order.** | one every 3–6 s |
| `big_moves` | Add a cinematic whoosh where your scene makes a big camera move. | 0–3 |
| `slams` | A giant letter or number (`letter`, 1–2 characters) plus a word (≤ 12 characters) slams onto the screen for 1.25 s, with a drum and bass hit. Use it for "Number one/two/three" or the key numbers. | 0–4 |
| `tags` | A white name tag at the top for `hold` seconds, with a pop. Use it for people, dates and places. | 0–4 |
| `payoff` | The biggest moment: a riser builds into a bass impact on this word. | 1 |
| `sfx` | Extra story sounds. `sound` must be a name from `assets/sfx/sounds.json`. Optional: `gain` (default 0.3), `semis` (pitch, −7…+7), `max_len` (seconds), `offset` (seconds), `run` (list of pitches for a rising note run). | 6–20 |

**Sound rules (the person is strict about these)**
- **One distinct sound per idea.** Read the `use` column in `assets/sfx/sounds.json` and match it to the meaning: scratch for "wait, no", rewind for "replay", bell for an "aha", boing for something snapping into place, and so on.
- A sound appears **at most about 6 times** per video (runs count once). The build warns you if you go over.
- **Never** add glitch, sparkle, key-press or click sounds, and never a click on every word. They read as white noise or a camera shutter.
- Need a sound that isn't in the library? See section 9.

Run the build again:

```powershell
python tools/build.py
```

**CHECK:** The build ends with **no WARNINGS** (exit code 0). Every warning says what to fix; fix it and re-run.

---

## 5. Write the visuals (`assets/scene.js`)

This is the only creative code you write. Open `assets/scene.js` and read the rules box at the top; the demo in that file is a complete, working example. Replace the demo with your topic.

**The contract (do not break it)**
```js
window.SCENE = {
  labels: [ { id: "mouth", text: "Mouth", dx: 140, dy: -120, style: "ink" } ],  // optional 3D-anchored tags
  build(ctx) { /* make every object ONCE, add to ctx.scene */ },
  update(t, ctx) { /* move things for time t; return the camera */
    return { target: [0, 1.2, 0], dist: 9, az: 0, el: 12 };
  },
};
```

**How to time things.** Use `F.at("spoken words")` → seconds. Never type raw seconds.
```js
const tOne = F.at("number one");
const show = F.win(t, tOne, F.at("number two"), 0.3, 0.2);   // 0 → 1 → 0 between two phrases
const x = F.sample([[0, 0], [tOne, 0], [tOne + 0.8, 3, "io3"]], t); // hold 0, then ease to 3
const pop = 1 - 0.35 * F.kick(t, [tOne], 0.35);              // a squash-pop right at tOne
```
Eases: `"io3"` (smooth, the default), `"o3"` (fast then slow), `"back"` (overshoot pop), `"lin"`, `"step"` (instant).

**Visual rules**
1. **Show the real thing the voice talks about**, built from three.js shapes: a shell, a planet, a cell, a coin. Abstract blobs fail.
2. The main subject fills **40–70% of the frame width**. With the default lens, an object about 2 units wide fills about 60% of the width at `dist: 9`.
3. **Something changes at every chapter**: a new object, a morph, a camera move or a pop-in. Use the cue times.
4. Subjects always rotate slowly (`rotation.y = t * 0.6`). The stage already adds chapter whips and a slow drift. **Do not add your own camera shake or per-caption camera moves** (the person rejected them twice).
5. **Realistic, not cartoony.** Objects use real materials and real colours. The stage gives every material a studio reflection environment, so use `MeshPhysicalMaterial` (recipes in the cookbook below) and add surface detail with canvas textures: panel seams, rivets, windows, tube seams. Coral `#FF6B4A` and lime `#C8FF3E` are only for diagram elements: arrows, glows, highlights. Keep the background black (the stage handles it). Never make a whole object flat ivory or flat coral.
6. The subject sits around `y = 1.2` (the floor is `y = 0`). Things below `y = 0` are hidden by the floor.
7. Text goes in captions, slams, tags or `labels`. Don't build 3D text.
8. **No randomness.** Use `rand(i)` from the demo when you need variety.

**Cookbook (three.js r149, `const { THREE } = ctx`)**

| You need | Use |
|---|---|
| Ball, planet, cell | `new THREE.SphereGeometry(1, 64, 32)` |
| Box, crate, building | `new THREE.BoxGeometry(w, h, d)` |
| Coin, disc, can, N-sided prism | `new THREE.CylinderGeometry(r, r, h, sides)` |
| Ring, donut | `new THREE.TorusGeometry(R, tube, 24, 96)` |
| Vase, bottle, bell, anything round with a profile | `new THREE.LatheGeometry(points2D, 64)` |
| A flat 2D shape with depth (star, arrow, map outline) | `new THREE.ExtrudeGeometry(shape, { depth: 0.3, bevelEnabled: true, bevelSize: 0.03 })` |
| Curvy tube along a path (spiral, DNA, orbit trail) | `new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 200, 0.08, 12)` |
| Many copies (grid, crowd, dots) | build N meshes once in `build`, store them in an array, scale them 0 → 1 in `update` |
| A line or wireframe drawing | `new THREE.LineSegments(new THREE.WireframeGeometry(geo), new THREE.LineBasicMaterial({ color: "#fff" }))` |
| Brushed metal (aluminium) | `new THREE.MeshPhysicalMaterial({ color: "#c0c6cc", metalness: 1, roughness: 0.4, clearcoat: 0.25 })` (+ `roughnessMap`/`bumpMap` canvas textures for seams and rivets) |
| Black rubber | `new THREE.MeshPhysicalMaterial({ color: "#0e0e0e", roughness: 0.55, clearcoat: 0.18, specularIntensity: 0.5 })` |
| Painted surface (aircraft, car) | `new THREE.MeshPhysicalMaterial({ color: "#eef0f2", roughness: 0.3, clearcoat: 0.9, clearcoatRoughness: 0.08 })` |
| Ice, glass, water | `new THREE.MeshPhysicalMaterial({ color: "#e2f3ff", roughness: 0.06, transmission: 0.88, thickness: 0.45, ior: 1.31, attenuationColor: new THREE.Color("#6fbde9"), attenuationDistance: 0.35, clearcoat: 1 })` on faceted, noise-displaced `IcosahedronGeometry` |
| Chrome | `new THREE.MeshPhysicalMaterial({ color: "#e8eaec", metalness: 1, roughness: 0.12 })` |
| Surface detail | draw on a `<canvas>` in `build()` and use it as `map`/`roughnessMap`/`bumpMap` via `new THREE.CanvasTexture(canvas)`; the geometry needs UVs that follow the surface (see `deice-boot/assets/scene.js` `canvasTex`) |
| Glowing diagram element | `MeshBasicMaterial({ color: "#C8FF3E", toneMapped: false })`, or lines as additive ribbons (`blending: THREE.AdditiveBlending`) |
| Coloured light ruins a material | the stage's coral rim light tints dark materials red; dim it in `build()`: `scene.traverse(o => { if (o.isDirectionalLight && o.color.r > 2 * o.color.g) o.intensity = 0.45; })` |
| Shadows | `mesh.castShadow = true` |
| Pop in | `const k = F.E.back(F.win(t, tA, tB, 0.3, 0.2)); mesh.scale.setScalar(k + 1e-4);` (never scale to exactly 0) |
| Hide | `mesh.visible = t >= tA && t < tB;` |
| A morph between two shapes | build both; cross-scale them (one 1 → 0 while the other goes 0 → 1) over 0.3 s at the cue |
| A pointing label | add `{id, text}` to `labels`, then in `update`: `ctx.tag("id", mesh.position, F.win(t, tA, tB))` |

For an advanced example (live-generated shell geometry, a morphing hero, a 125-object cube and a dot cloud), read `shell-rule/compositions/world.html`.

Run the build again and check:

```powershell
python tools/build.py
npx hyperframes check --json
```

**CHECK:** `check` reports `"ok": true` with 0 errors. Warnings about "outside_safe_zone" for YouTube Shorts are acceptable.

---

## 6. Look at it (mandatory)

The build prints a snapshot command at the end. Run it. It captures the first frame, a frame just after each chapter, and the last frame.

```powershell
npx hyperframes snapshot --at <times from the build report> --out .hyperframes/snaps
```

Open `.hyperframes/snaps/contact-sheet.jpg` (and the individual PNGs if needed). Check **every** frame against this list:

- [ ] Frame 0 shows the hook title **and** the subject: a good thumbnail.
- [ ] The subject is big, visible, recognisable, and **not hidden behind the captions** (captions sit at y 1070–1220).
- [ ] Every chapter frame looks different from the one before it.
- [ ] Nothing important is cut off at the edges. The background is black with the light grid.
- [ ] No two captions overlap; the slam letters don't cover the captions.
- [ ] The last frame shows the end title.

Fix what you see in `assets/scene.js` (camera `dist` too small = subject too big, and so on), rebuild, and snapshot again.

---

## 7. Render

```powershell
npx hyperframes render -o renders/<project-name>-v1.mp4
```
This takes 1–3 minutes on this machine. If it takes longer than 10 minutes, something is wrong: see section 10.

**CHECK:** Measure the sound:
```powershell
npx hyperframes audio renders/<project-name>-v1.mp4 --json
```
In `loudness`, `lufsIntegrated` must be between −18 and −14, `truePeakDb` at most −1 and `clipping.count` 0.
Too quiet: in `index.html` raise the `sfx-bed` `data-volume` (max 1.2). Too loud: lower it.

---

## 8. Deliver

Tell the person:
1. The video path (`renders/<name>-v1.mp4`) and its length.
2. The script in one line, and which voice you used.
3. What happens visually, in 2–3 lines.
4. Which sounds need credit: copy the "Copy-paste for the description" line from `assets/sfx/CREDITS.md`.
5. What you could **not** do or are unsure about (a fact you couldn't verify, a shape that is approximate).
6. That music needs a HeyGen sign-in (`! npx hyperframes auth login`), unless it's already done.

Then update `AGENTS.md` in the project folder with a 5-line "This project" section: what it is, the latest render, and open decisions.

---

## 9. Changes the person often asks for

| The person says | You change | Then |
|---|---|---|
| "Faster / more energy" | `script.json`: raise `rate` (max 1.2), cut `gap`s to 0.05; `cues.json`: add more chapters | build, snapshot, render |
| "Too much camera shake" | Per-caption punch and roll are already removed. Lower the chapter push-in (`0.06 * pCh`) or the whip amplitude (`12`) in `compositions/stage.html` `render()`/`whip()` | render |
| "Different voice" | `script.json` `voice` (never Charon) | build (makes a new voice; all timings follow), render |
| "Change the words" | `script.json` | build (all timings follow), check `cues.json` phrases still exist, render |
| "Sound X is annoying" | remove it from `cues.json` `sfx`; if it is automatic (whoosh, tom, pop), lower its gain in `tools/build.py` `step_sound` | build, render |
| "More sound variety" | add `sfx` cues with sounds you haven't used yet; or fetch a new sound (below) | build, render |
| "Different colours" | `index.html` variables `color-accent`, `color-accent-2`; object colours in `scene.js` | render |
| "Add music" | after the HeyGen sign-in: `npx hyperframes media-use resolve --type bgm --intent "fast upbeat electronic, 120 bpm, energetic" --project .`, put the file in `assets/music/`, uncomment the music line in `index.html`, set its `src` (volume 0.14) | render |

**Fetch a new sound effect (free, no sign-in):**
```powershell
npx hyperframes media-use resolve --type sfx --intent "<concrete sound, e.g. glass clink>" --project .
```
It prints a path under `.media/audio/sfx/`. Then:
1. Copy that file to `assets/sfx/<name>.mp3`.
2. Measure its peak with `npx hyperframes audio assets/sfx/<name>.mp3 --json` (use `items[0].moments.peak`).
3. Add `"<name>": {"peak": <peak>, "lp": 6000, "use": "<when>"}` to `assets/sfx/sounds.json`.
4. If `.media/audio/sfx/CREDITS.md` lists it as CC BY, add its line to `assets/sfx/CREDITS.md`.
5. **Reject it** if it sounds like hiss or noise (`whoosh`-like noise bursts, glitches, static).

---

## 10. When something goes wrong

| Symptom | Cause | Fix |
|---|---|---|
| `could not get a Google Cloud token` | gcloud logged out | ask the person to run `gcloud auth login` |
| TTS 400/403 error | wrong voice name, or API not enabled | use exactly `en-US-Chirp3-HD-<Name>`; tell the person if it's 403 |
| `word timing failed` | faster-whisper missing | `python -m pip install --user faster-whisper` |
| Build WARNING: phrase not in the script | the `at` text doesn't match the script | copy the words exactly from `script.json` |
| Captions out of sync | rare since the build aligns the whole script to the transcript ("thirty percent" vs "30%" is handled) | if a few captions still drift, write the number the way the voice says it, then rebuild |
| Snapshot is all black | `scene.js` threw an error | run `npx hyperframes check --json` and read the `runtime` errors; usually a typo or using `THREE` outside `build`/`update` |
| Subject missing in a frame | its scale is 0 or `visible` is false at that time, or it is below the floor | print the cue times from the build report and check your `F.win` ranges |
| Render stuck or extremely slow | too many objects rebuilt each frame | build geometry once in `build()`; in `update()` only change position, scale, rotation or visibility |
| A downloaded video fails to download | yt-dlp is old | `python -m pip install -U --user "yt-dlp[default]"` |
| Text garbled (`Â·`) | a file was edited with PowerShell `Get-Content`/`Set-Content` | re-type the character with your file editor tool; never use PowerShell to rewrite files |

**Never:**
- edit the generated files: `compositions/captions.html`, `compositions/hud.html`, `assets/cues.js`, `assets/sfx/sfx-bed.wav`;
- edit `assets/film.js` or `tools/build.py` for a single video;
- use `Math.random()` or `Date.now()` in `scene.js`;
- render before step 6 passes;
- skip telling the person what you could not do.
