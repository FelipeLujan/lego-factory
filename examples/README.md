# Approved reference videos (the quality bar)

The person approved these two LEGO videos. Every new LEGO video (especially the DealCalm top-of-funnel ones) should match them or
beat them. These folders hold the **source only**: script, cues, scene code, prop kits, build notes and 10 stills from the final
render. They are not runnable projects: the voice, sound bed and engine aren't included. To reuse code, copy the kit files into a
project scaffolded with `scripts/new_video.py <name> --template brick-cinematic`.

| Example | Why it's the bar | Look at |
|---|---|---|
| `dotcom-crash-lego-r6/` (Nov 2026, ~95 s, voice Enceladus 1.22; final council 7.34) | **"I loved it"**: the best overall video. 11 dressed sets with a clear visual metaphor for every beat: a brick bar "mountain" for the Nasdaq, a balance scale for losing money per sale, a coin fountain that dries up for cheap money, a survivor tower that collapses and regrows. Tight cause → effect beats, the sock-puppet callback loop, punchy short script lines, a sound per idea | `stills/`, `REVAMP_NOTES.md` (set table with timings), `assets/dc-sets.js` (sets), `assets/dc-kit*.js` (40+ story props: CRT, ticker, exchange bell, forklift, sock puppet, marble columns, rate board…), `assets/scene.js` (looks, shots, callouts), `script.json` |
| `disney-iger-r7/` (Nov 2026, ~110 s; final council 7.13 + props pass) | **The props bar**: every set has ≥ 6 asset types (≥ 3 unique), extras holding props, and live props (fan, steam, fountain, pigeons) | `stills/`, `assets/props-kit.js` (the template's shared library came from here), `dressSets()` in `assets/scene.js` |

Notes:
- The dot-com r6 hook title ("Get rich fast? / Then lose 78%.") was flagged by the council: it spoils the payoff and misattributes
  the loss. Its suggested fix was "Add .COM. Get rich?" / "Ask the sock puppet." The approval is for the video as a whole; new
  videos still follow the triple-hook rule.
- dot-com is not a DealCalm video (it ends with a follow line). DealCalm TOFU videos use `docs/DEALCALM-TOFU.md` (60–75 s, soft CTA).
