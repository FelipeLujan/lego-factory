# Template: brick-cinematic (the brick VIDEO-GAME look)

```
python scripts/new_video.py <name> --template brick-cinematic
```
Then follow `../../PLAYBOOK.md` for script → voice → cues. This README is the **style guide** for `assets/scene.js`.

Use this template when the person asks for a LEGO / brick **video game or brick movie** look. It deliberately replaces the house
black-mesh stage with full environments. (For simple brick story videos on the black stage use `brick-story`.)

## What makes the brick-game look (checklist; the council judges against this)
1. **Everything is bricks.** Ground = baseplates with studs, water = translucent **tiles** that bob (never a smooth sea near the camera),
   clouds = **white brick clusters**, steam/smoke = **round bricks** + soft particles, explosions **burst into real brick pieces**.
2. **Real minifigs.** `K.mfig(spec)` builds figures from real LDraw parts (torso 973, hips 3815b, legs 3816c/3817c, arms, C-hands, head, moulded hair).
   Same spec and poses as `K.fig` (`K.P`, 19 gestures, walk, sit). Faces and torso prints are our own textures (no brand logos).
3. **Cinematic light.** Golden hour or soft overcast; pastel skies (lilac/peach mid-tones); warm key + cool rim; bloom on every light;
   **tilt-shift depth of field** on close shots (`look.dof` 0.3–0.9) — this is what makes it read as a miniature toy.
4. **Glossy ABS plastic** with clearcoat; steel = "metallic silver" plastic; seams every brick height.
5. **Full sets to the horizon** (fog fades them): no black voids, no empty floors. Fill foregrounds (hedges, cars, people, props).
6. Camera rules stay: steady on captions; whip + push only on chapters. Subject above the caption band (y 1070–1220).

## Files
| File | What |
|---|---|
| `compositions/stage.html` | Cinematic renderer: HDR + 4x MSAA → depth pass → 6-level bloom → composite (DOF, ACES, grade, vignette, dither). `SCENE.update` returns the camera **and** a `look` per shot (see the header comment). Do not edit for one video. |
| `assets/fx-kit.js` | `FXKIT.setup(ctx)`: `X.sky` + `X.skyEnv` (presets day, golden, overcast, night, orbit, space), `X.ground`, `X.brickWater` + `X.tickBrickWater`, `X.tileOcean`, `X.brickClouds`, `X.puffs`/`X.emitPuffs`, `X.particles`/`X.emit` (deterministic), `X.flame`/`X.setFlame`, `X.debris`/`X.burst`, `X.stars`, `X.earth`, `X.glowShell`, `X.roundBox`, `X.ld(part, scale)` (real LDraw geometry). |
| `assets/ldraw-kit.js` | `LDRAW_KIT.setup(ctx, K, X)` adds `K.mfig`. |
| `assets/ldraw-parts.js` | Generated LDraw geometry (see `tools-ldraw/README.md` to add parts). |
| `assets/tex/earth_*` | Earth textures (from the three.js repo, MIT; NASA-derived). |
| `assets/brick-kit.js` | Sets, props, procedural figures (`K.fig`), materials. |
| `assets/props-kit.js` | **Shared prop library** (40+ brick-built assets, minifig extras, `PK.bake`, `PK.tick`). `PK = PROPS.setup(ctx, K, X)`. The quality bar is disney-iger r7: ≥ 6 asset types per set, ≥ 3 unique to each set. Extend per project; add generic assets back here. |

## Lessons (2026-11-15, Starship videos)
- Align the sky dome's `sunDir` with `look.sun.dir`, or shadows and the sun disc disagree.
- Metallic surfaces in space need a lit reflection map: use `X.skyEnv(name, "orbit")` (earthshine), not black.
- The Earth cloud PNG carries its shape in alpha: use it as `map` (the kit does).
- Lathe UVs space V per profile point: set V from height before painting text on a tank (`starship-kit.js` `tank()`).
- Very large ground planes: turn `studs: false` (stud normal maps moiré at distance); use real stud geometry near the camera.
- Plumes are additive: keep `power` low (0.3–0.45) or they turn into solid white tubes.

## Lessons (2026-11-16, DealCalm revamp: 15 videos, about 4,100 council findings)
Full list in `.agents/skills/lego-explainer/SKILL.md`. The top items:
- No flat 2D cutouts or plain textured boxes as buildings, planes or kiosks: build facades from brick courses, trees from round bricks and cones, crowds from minifigs.
- Fill the bottom 40% of wide shots (rugs, crates, planters); keep window glare and bloom from covering > 10% of the frame; no signs at head height behind faces.
- Weather and steam as LEGO elements (6141 plates, `X.puffs`), only where physically plausible (snow outside the window).
- Loudness: compress the voice into `assets/voice/voice-mix.wav` and set the sfx bed to about 0.5 (build.py alone lands about −17.5 LUFS).
- Render with `TMPDIR` on the Lexar drive (a render needs about 2.5 GB of temp frames).
- Engine items seats keep flagging (fix here, in the template, when approved): a whoosh on every chapter (> 6 uses), slam drums louder than the climax, the end title only in the 2.4 s hold, the subtitle drawn under slam letters.
