# Template: brick story (brick-toy minifigure story videos)

Don't work in this folder. Copy it from the workspace root:

```
python scripts/new_video.py <name> --template brick-story
```

Then follow `../../PLAYBOOK.md`, and for DealCalm story videos also `../../docs/DEALCALM-SERIES.md`.

It is the TikTok explainer engine plus **`assets/brick-kit.js`**: the shared brick-toy kit. `scene.js` calls `const K = BRICK.setup(ctx)` inside `build(ctx)`.

- **Figures v2** (`K.fig(spec)`): slim and detailed, not chubby (the person rejected the simple, chubby figures of jobs-coup v2).
  - They are 1.73 tall, with jointed knees and elbows.
  - Clothing kinds: suit, blazer, shirt, turtleneck, tee, hoodie, jacket, polo, sweater, labcoat, uniform, racing, vest, blouse, dress.
  - Hair styles: short, side, slick, buzz, curly, bob, long, ponytail, bun, bald, receding. Hats: fedora, cap, officer, helmet, hardhat, beret.
  - Faces have 12 expressions, with eye whites, lashes, lips, age lines, stubble, beards and mustaches. Skin tones are in `K.SKIN`.
  - The full spec list is in the comment above `makeFig`.
- **Poses** (`K.P(fig, {...})`, called every frame): walking, running, sitting, leaning, head look/nod/tilt, and 19 gestures. The gestures are point, pointUp, cross, hips, phone, think, wave, cheer, shrug, facepalm, handshake, hold, present, fist, slam, write, type, reach and cover.
- **Sets and props:**
  - `K.room`, `K.windowPane` (with `K.cityTex`, `K.dayTex` or `K.sunsetTex`), `K.door`, `K.chair`, `K.desk`, `K.table`, `K.sofa`, `K.plant`, `K.lamp`, `K.bookshelf`.
  - Screens: `K.whiteboard`, `K.tv`, `K.monitor`, `K.laptop`; signs and props: `K.sign`, `K.podium`, `K.trophy`.
  - Vehicles and money: `K.car` (sedan or racer), `K.cash`.
  - Hand props for `K.attach`: `K.phone()`, `K.contract(title)`, `K.briefcase()`.
  - Bricks: `K.plate`, `K.brickWall`, `K.studField`.
- `assets/scene.js` is a demo: a line-up of every clothing kind, gestures, and a meeting with a walk-in. Read it as the usage example.

The demo voice and captions are still the bees demo. Replace `script.json`, `cues.json` and `scene.js` for a real video.

**Posing tip:** head turns are clamped to ±0.8 rad (more hides the face behind the hair). To make someone look sideways at another figure, turn the body (`ry`) and keep `look` for small adjustments.
