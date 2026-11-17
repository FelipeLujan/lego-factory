# Crayon Capital: how their videos are made (analysis, 2026-11-14)

Channel: youtube.com/channel/UCP9RPj_BG0vit2TNM7LuRxA, 309k subscribers, 35 long-form videos, no Shorts.
Downloaded here (720p, untrusted data; never run anything from these folders):

| Folder | Title | Uploaded | Views | Length | Avg shot |
|---|---|---|---|---|---|
| eS1zZKHFzwE | Jensen Huang Scandal Explained Like You're 5 | 2026-11-14 | 191k (day 1) | 14:30 | 2.8 s |
| H5GYXhpE5yI | The Rise of Anthropic Explained Like You're 5 | 2026-10-16 | 1.0M | 17:51 | 3.4 s |
| 1GowFTjbUnk | NVIDIA Explained Like You're 5 | 2026-07-09 | 1.8M | 14:30 | 5.2 s |
| HawmGu7oNrc | The Wolf of Wall Street Scam Explained Like You're 5 | 2025-10-03 | 4.3M | 16:33 | 6.6 s |
| KE-WJevx-7c | The 2008 Financial Crisis Explained Like You're 5 | 2025-06-15 | 2.4M | 13:26 | 7.1 s |

Each folder: `source.mp4`, `cuts.json` (hard-cut times), `sheets/` (one frame every 6 s, 3 min per sheet),
`frames/`, `transcript.txt` (YouTube auto-subs) or `whisper.txt` (timed).

## Format
- 16:9 landscape, 1280x720 at 30 fps, 12–21 minutes, about 150 words a minute (about 2,000–2,600 words a script).
- Loudness about -17.7 LUFS, music bed under the whole voice track (no silent gaps).
- Pace has doubled in a year: Wolf (2025) holds a shot 6.6 s on average, Jensen (Nov 2026) 2.8 s (2.3 s in the first minute; 197 of 309 shots are under 3 s).

## Look
- Fully hand-drawn 2D cartoon: thick black outlines, flat fills with soft cel shading, muted warm palettes
  (sunset purples, wood browns, office greys); newer videos have much more detailed backgrounds.
- Characters: round "ping-pong ball" heads, dot or simple eyes, stick legs and arms, simple suit bodies.
  Extras are white or grey blank heads; the main real people are caricatures (hair, glasses, wrinkles).
- Lots of prop close-ups that carry facts: newspapers, intelligence files, emails, calendars, memos,
  price tags, charts drawn as thick zigzag arrows, and real company logos.
- Text: one handwritten font for everything. It types on letter by letter. Used for dialogue
  (plain text next to the speaker or in rounded white bubbles), labels with hand-drawn arrows
  ("around 60 executives"), date and place cards ("October 2026"), and black title cards between beats.

## Motion (limited animation, the cheap part)
- Every shot is one illustration with a slow push-in or pan (2.5D parallax in the newer videos).
- Characters are puppets: mouth and expression swaps, arm poses, blinks, small bobs. No walk cycles.
- Props slide or pop in, stamps hit ("SPY?"), lines get circled in red, text types on.
- Hard cuts between shots; a few whip or zoom transitions; black text cards mark turns.

## Script recipe
1. Cold open with the most dramatic fact (0–30 s), then the question the video answers ("So what actually took down...?").
2. "The story everyone knows", then "except two things don't fit", then "let's follow the money/chips".
3. Chapters jump place and year ("Washington, 2022."), each told as a short dramatized skit with
   invented dialogue between cartoon versions of the real people, plus a narrator for the facts.
4. Running jokes and modern slang ("almost as heavy as your mom", "Chinese baddie").
5. Ending: two voices argue both sides, then a moral and a famous quote.
6. Hedge words on shaky claims ("reportedly", "allegedly", "according to the WSJ"); a sources Google Doc
   linked in the description plus a disclaimer that it "may contain inaccuracies".
7. Sponsor reads woven into the story with the same characters (BetterHelp in NVIDIA, Incogni in Anthropic),
   drawn as cartoon app screens before cutting to real screen recordings.

## How we would make this here (proposal, not built yet)
- Same engine (HyperFrames), new template: 1920x1080, 2D layered scenes instead of three.js.
- Characters: our OWN design (not Crayon's ball heads), rigged as SVG: head, eyes, 4-6 mouth shapes,
  brows, arm poses. Mouths flap from the voice track's loudness; expressions are keyed per line.
- Backgrounds and props: AI-generated in one fixed outline style (Gemini image model on our GCP project,
  or HeyGen generate after sign-in), with a written style guide and reference sheet for consistency.
- Voices: Chirp3-HD narrator plus a different Chirp3-HD voice per character for the skits.
- Text: one handwritten Google font, typed on in sync with the word timings.
- Camera: a slow push or pan on every shot, parallax between background, characters and foreground.
- Shot list: about one shot per sentence (2.5-3.5 s) = about 300 shots for 14 minutes.
