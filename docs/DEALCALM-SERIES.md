# DealCalm story series: brief + fact sheets

> **New videos follow `docs/DEALCALM-TOFU.md`** (decided 2026-11-17): 60–75 s, soft brand CTA (no App Store read-out), triple hook, "DEALCALM STORIES" stinger, max 3 council rounds, POST.md. The ~110 s full-CTA format below is what the 15 Nov-2026 revamped videos use. The fact sheets below stay valid for new TOFU cuts.

These are short story videos for **DealCalm** (`dealcalm.com` & Apple App Store) on Instagram Reels and YouTube Shorts. Each one is a verified real-world story about negotiation, corporate coups, power, or manipulation, built in **cinematic LEGO video-game style (`templates/brick-cinematic`)**.

## Format (every revamped video)

- **Length:** Target **~110 seconds (`104–116 s`)**, vertical `1080x1920` at `30 fps`, suitable for YouTube Shorts and Instagram Reels.
- **Voice:** `en-US-Chirp3-HD-Sadachbia`, rate `1.1`–`1.15`. Never `Charon`.
- **Structure:**
  1. **Hook (0–3 s):** Scroll-stopping paradox or stakes gap (`<= 14` words) matched directly to an active opening LEGO visual (`ch-00` / `motion-00`). Never clutter the hook with >1 badge, and state core stakes immediately after the hook.
  2. **Story:** One high-stakes conflict, clear tension, 5–8 brisk visual beats with curiosity loops every 10–15 s.
  3. **"Move number one / two / three":** Name the negotiation or manipulation tactics cleanly as they happen (`slams` in `cues.json`).
  4. **The twist / outcome:** Pay off the hook with the documented real-world turn.
  5. **Takeaway + Story-Specific DealCalm CTA (Required):** Close with a sharp, witty, story-tailored callback into **DealCalm** — e.g., *"And if you don't want to get pushed out of your own company like Steve Jobs [or blindsided on a Friday video call like Sam Altman / laughed out of a fifty-million-dollar deal like Blockbuster], sharpen your communication and negotiation skills with Deal Calm — available on the Apple App Store and at deal calm dot com."*
     - Pronounce `"Deal Calm"` and `"deal calm dot com"` as separate words in `script.json` for clean TTS, while displaying **`DealCalm`** and **`App Store · dealcalm.com`** on the closing end card / brick showcase set.
     - **CTA set:** a generic DealCalm host minifig plus a story callback prop (e.g. the red CEO chair). **Never the real protagonist** (councils flag it as an implied endorsement). Never claim "free" or any unverified app feature. Keep the subtitle off the phone's buttons, the end title from wrapping, and confetti off the URL.
- **No third-party or toy-brand logos:** Only **DealCalm** (`dealcalm.com` / App Store) appears in the closing CTA. Never render real third-party company logos (Apple, OpenAI, Nike, Ford, etc.) or toy-brand logos anywhere in 3D geometry; company names may be *spoken* and shown in captions/HUD tags, while 3D signs show generic words (`HQ`, `BOARD`, `OFFER`, `PRESS`, `COURT`, `DEALCALM`).
- **Facts:** Use ONLY verified facts in the fact sheet below (plus the documented fact-check corrections at the bottom of this file). Preserve hedges (`"reportedly"`, `"later recalled"`, etc.) wherever noted.
- **People:** Real public figures built as LDraw minifigures (`K.mfig`). Neutral, accurate portrayal: dramatise documented meetings, phone calls, walks, and votes without inventing insults or placing someone in a room after they had already resigned/left.

## Visual rules (cinematic LEGO video-game upgrade)

> **Quality bar:** `examples/dotcom-crash-lego-r6/` (overall) + `examples/disney-iger-r7/` (props), approved by the person. Every video uses `assets/props-kit.js` with ≥ 6 asset types per set (≥ 3 unique to that set), extras with hand props and live props. See `.agents/skills/lego-explainer/SKILL.md` §3b.

1. **Use `templates/brick-cinematic` (`K.mfig` + `FXKIT` + cinematic `stage.html`):**
   - Load `assets/ldraw-parts.js`, `assets/brick-kit.js`, `assets/fx-kit.js`, `assets/ldraw-kit.js`, and `compositions/stage.html`.
   - Build every character with real LDraw minifigure geometry (`K.mfig(spec)`, `K.P`, `K.GESTURES`, `K.walkPh(t)`, seated on `1x2` brick chairs/stools so hips/legs never clip floors). Give every named character distinct hair, face print, outfit, and props.
2. **Full LEGO environments — zero `#000000` black voids:**
   - At least **8+ distinct furnished brick sets** per video (boardrooms, glass high-rise offices, streets with brick cars/trees/sky domes, stages, factories, courtrooms, tarmac/airports, newsrooms, plus a sleek closing **DealCalm** studio/app pedestal set for the final CTA).
   - Enclose interiors with back + side walls, windows looking onto brick skylines or `X.sky` domes, practical desk/ceiling lamps with warm bloom, and studded/tiled floors (`frustumCulled = false` on instanced studs). Use `X.sky` + `X.skyEnv` + `X.brickClouds` / `X.brickWater` / `X.puffs` on exteriors.
3. **Moody TT-Games lighting, DOF & LEGO micro-detail:**
   - Return a per-shot `look` from `SCENE.update(t, ctx)` with warm key + cool rim lighting, `bloom: 0.45–0.65`, and tilt-shift miniature depth of field (`dof: 0.35–0.65`, `focus: dist`) on close/medium shots.
   - Add LEGO brick FX where motivated by the story (brick steam puffs from espresso cups/engines, camera flash pops at press conferences, brick confetti/sparks, glowing screen reflections, rain/weather tiles).
4. **Camera, Framing & Captions:**
   - Steady camera on captions (chapter push/whip only; zero per-word shake).
   - Main characters face the camera in 3/4 view (`ry ≈ az` in radians) in the upper-middle safe zone (`y = 350..1020`), never hidden behind foreground chairs or cut off at frame edges.
   - Use clean lower-third 2–3 word subtitles (`"captions": {"style": "subtitle", "max_words": 3, "max_chars": 20}`) OR non-colliding captions so minifigure faces stay 100% unobstructed, and keep all HUD tags/badges clear of faces and TikTok's right-rail icon zone (`x > 88%, y = 55%–96%`).
5. **Sound Mix:**
   - Curated `assets/sfx/sounds.json` only (`<= 6` uses per sound, `0` hiss windows, integrated `-16` to `-15 LUFS`, true peak strictly `<= -1.0 dBTP`, zero `< -35 dB` dead-air holes inside hooks or the closing DealCalm CTA).

---

# Fact sheets

Each sheet gives: project name · hook idea · facts · tactic(s) · takeaway · cast · set ideas.

## 1. altman-ousted: OpenAI, November 2023
- **Hook idea:** "The board fired him on a Friday. By Tuesday, he had them cornered."
- **Facts:**
  - Friday, Nov 17, 2023: OpenAI's board fired CEO Sam Altman over a video call. It said he was "not consistently candid in his communications".
  - Board chair Greg Brockman was removed as chair and quit the same day.
  - CTO Mira Murati was named interim CEO. That weekend the board named former Twitch CEO Emmett Shear interim CEO instead.
  - Monday, Nov 20: Microsoft CEO Satya Nadella announced that Altman and Brockman would join Microsoft to lead a new AI research team.
  - More than 700 of about 770 OpenAI employees signed a letter: reinstate Altman and resign, or we may quit and join Microsoft. Board member Ilya Sutskever signed it and said he regretted his part.
  - Late Tuesday, Nov 21: a deal to bring Altman back as CEO, with a new board: Bret Taylor (chair), Larry Summers, Adam D'Angelo.
- **Tactics:**
  - Your leverage is who walks out with you (the alternative: Microsoft).
  - A public ultimatum (the letter set no deadline).
  - Coalition: the employees.
- **Takeaway:** "Your power in a negotiation is your best alternative. Build one before you need it."
- **Cast:** Altman (casual: sweater or tee, short hair); four board members; Nadella (glasses, blazer); a crowd of employees.
- **Sets:** a video-call room with a laptop and screen tiles; an office lobby; a phone-screen montage; a Microsoft-style campus (generic glass building, no logo); an open-plan office full of desks (employees signing); a boardroom; the return (the team cheering).

## 2. uber-kalanick: Uber, June 2017
- **Hook idea:** "Five investors. One letter. The CEO of Uber was out in a day."
- **Facts:**
  - 2017 was a year of scandals at Uber, starting with an ex-engineer's February blog post about harassment.
  - Kalanick announced a leave of absence on June 13, 2017.
  - On June 20 in Chicago, Benchmark partners Matt Cohler and Peter Fenton hand-delivered a letter titled "Moving Uber Forward", demanding that he resign. It was signed by five investors: Benchmark, First Round Capital, Menlo Ventures, Lowercase Capital and Fidelity.
  - The signers held roughly 40% of the voting power. Say "reportedly about 40%".
  - The campaign was led behind the scenes by Benchmark partner Bill Gurley, who held Benchmark's board seat.
  - Kalanick resigned as CEO that day but stayed on the board.
- **Tactics:**
  - Coalition building: no single investor could force him out.
  - A written ultimatum, delivered in person.
  - Timing: strike while he's already stepping back.
- **Takeaway:** "One voice is a complaint. Five voices with a letter are a decision."
- **Cast:** Kalanick (short hair, casual blazer); Cohler and Fenton; Gurley (very tall, so scale him to 1.08); a board.
- **Sets:** a ride-hailing street at night (cars, phone); headquarters; a newsroom (headlines on screens); a Chicago hotel corridor; a hotel meeting room (the letter on the table); a phone-call split; a boardroom; a city skyline.

## 3. disney-iger: Disney, 2020–2024
- **Hook idea:** "He picked his own successor. Less than three years later, he was back in the chair." (February 2020 to November 2022)
- **Facts:**
  - February 2020: Bob Iger named Bob Chapek as Disney's CEO. Iger stayed as executive chairman until the end of 2021.
  - Sunday, Nov 20, 2022: Disney's board announced that Chapek was out and Iger was returning as CEO.
  - January 2023: activist investor Nelson Peltz (Trian) launched a proxy fight for a board seat.
  - February 2023: Disney announced a restructuring with about 7,000 job cuts and $5.5 billion in cost savings, and Peltz dropped the fight.
  - He came back in 2024. On April 3, 2024, Disney shareholders re-elected Disney's whole board and rejected Peltz.
- **Tactics:**
  - The board's leverage: a known alternative waiting (Iger).
  - Taking away the other side's argument: Disney delivered the cuts Peltz demanded.
  - Winning the vote by winning the big shareholders.
- **Takeaway:** "Remove their reason to fight, and the fight ends."
- **Cast:** Iger (grey hair, suit); Chapek (glasses? keep it neutral: suit, bald or short hair); Peltz (white hair, suit); the board; shareholders.
- **Sets:**
  - a castle-themed theme park (a generic brick castle, no Disney logos or characters);
  - executive offices; the boardroom on a Sunday night;
  - a TV news studio; a shareholder meeting hall with a voting screen;
  - a stage.

## 4. lucas-starwars: Star Wars, 1970s
- **Hook idea:** "He turned down a raise. It made him a billionaire."
- **Facts:**
  - After *American Graffiti* became a hit (1973), Lucas could have asked 20th Century Fox for a much bigger fee for his space film.
  - Instead he kept his fee and asked to keep the **merchandising and sequel rights**. Most accounts put the fee at $150,000 and the forgone raise at about $500,000; say "reportedly".
  - Fox agreed, because movie merchandise was a small business then.
  - *Star Wars* came out in 1977, and the merchandise became worth billions.
  - In 2012 Disney bought Lucasfilm for about $4 billion.
- **Tactic:** trade what they don't value for what you do (logrolling).
- **Takeaway:** "Don't fight over the number they care about. Ask for the thing they think is worthless."
- **Cast:** Lucas (beard, plaid or flannel shirt, glasses later in life? keep a beard, dark hair); Fox executives in suits; kids buying toys.
- **Sets:**
  - a 1970s studio office; a film set with cameras and lights;
  - a cinema queue in 1977 (marquee "NOW SHOWING", no title art);
  - a toy store full of generic space toys (generic rockets and robots, NOT Star Wars designs);
  - a factory line; a money vault;
  - a 2012 signing table.

## 5. jordan-nike: Michael Jordan, 1984
- **Hook idea:** "He didn't even want to take the meeting. That meeting is now worth billions."
- **Facts:**
  - In 1984 rookie Michael Jordan wanted to sign with Adidas. His parents pushed him to visit Nike's headquarters in Oregon. His agent was David Falk.
  - The deal, signed in late 1984: about $2.5 million over five years, **plus a royalty on every Air Jordan shoe sold**. The rate is disputed, so don't state it.
  - Nike reportedly hoped to sell $3 million of the shoes in the first few years. Air Jordan sales reportedly passed $100 million in the first year.
  - The royalty still pays: Forbes estimated Jordan earned about $256 million from Nike in 2023.
- **Tactic:** trade a fixed fee for a share of the upside (a royalty).
- **Takeaway:** "A fee pays you once. A share of what you create pays you forever."
- **Cast:**
  - Jordan: shaved head (style bald, no hair), K.SKIN.dark, tracksuit.
  - Deloris Jordan: blouse, bob hair.
  - James Jordan; Falk (suit); Nike executives (polo/blazer).
- **Sets:**
  - a college gym or basketball court with a hoop;
  - a living room (the family deciding);
  - a plane to Oregon; a campus meeting room with shoe sketches on the whiteboard;
  - a shoe factory; a shoe store with a huge queue;
  - a royalty counter (cash bricks stacking).
  - No Nike or Adidas logos: plain red and black sneakers.

## 6. gates-ibm: Microsoft and IBM, 1980–81
- **Hook idea:** "IBM had all the power. Bill Gates kept one tiny right."
- **Facts:**
  - In 1980 IBM needed an operating system for its first personal computer. Its talks with another software company stalled.
  - Microsoft licensed an existing system, 86-DOS, from Seattle Computer Products for $25,000, then bought it outright in 1981, reportedly for about $50,000.
  - Microsoft licensed it to IBM as PC DOS, but **did not give IBM exclusive rights**.
  - The IBM PC launched in August 1981. Soon clone makers built IBM-compatible PCs, and Microsoft sold them MS-DOS.
  - Microsoft became the standard on almost every PC.
- **Tactic:** non-exclusivity, i.e. keep the rights that matter.
- **Takeaway:** "Read what you're giving away, not just what you're getting."
- **Cast:** Gates (young, glasses, sweater); Paul Allen (beard, glasses); IBM executives in identical dark suits; the Seattle programmer.
- **Sets:**
  - a big corporate HQ (blue-grey, generic; no IBM logo);
  - a tiny Microsoft office with desks and terminals;
  - Seattle Computer Products' workshop; a contract signing;
  - the 1981 launch stage with a beige PC;
  - a factory turning out clone PCs; a city of PCs.

## 7. blockbuster-netflix: Blockbuster, 2000
- **Hook idea:** "They could have bought Netflix for $50 million. They laughed."
- **Facts:**
  - In 2000 Netflix co-founders Reed Hastings and Marc Randolph flew to Dallas to meet Blockbuster CEO John Antioco.
  - They proposed that Blockbuster buy Netflix for $50 million and that Netflix run Blockbuster's online business.
  - Blockbuster said no. Randolph wrote that the Blockbuster side was struggling not to laugh. Say "according to Randolph".
  - Blockbuster had thousands of stores and late fees.
  - It filed for bankruptcy in 2010.
  - Netflix moved to streaming and is now worth hundreds of billions of dollars.
- **Tactic:** the other side judged the offer by today's leverage, not tomorrow's (status-quo bias).
- **Takeaway:** "Value a deal by where things are going, not where they are."
- **Cast:** Hastings, Randolph (casual); Antioco (suit) plus two executives.
- **Sets:**
  - a 2000-era video store with shelves of tapes (generic covers);
  - an airport and plane; a Dallas skyscraper boardroom;
  - a DVD-mailer envelope factory;
  - "closing" signs on a store; a living room with streaming on TV;
  - a stock chart going up.

## 8. buffett-berkshire: Warren Buffett, 1964
- **Hook idea:** "An eighth of a dollar made Warren Buffett furious, and cost him billions."
- **Facts:**
  - Buffett's partnership bought shares in Berkshire Hathaway, a struggling New England textile mill, starting in 1962.
  - In 1964 its boss, Seabury Stanton, asked what price Buffett would sell his shares at. Buffett said $11.50, and Stanton agreed.
  - The written tender offer came at **$11 and 3/8**, an eighth of a dollar less. Buffett felt chiselled, refused, and bought more shares instead.
  - He took control in 1965 and removed Stanton.
  - Buffett later called buying Berkshire his worst mistake. In a 2010 CNBC interview he estimated that the decision cost about $200 billion, because he kept a dying textile business.
- **Tactics:**
  - Never insult your counterpart over pennies (Stanton's mistake).
  - Ego is a cost (Buffett's).
- **Takeaway:** "Saving a penny can cost you the whole deal, and pride can cost you even more."
- **Cast:** young Buffett (glasses, short side hair, suit); Stanton (older, white hair, suit); mill workers.
- **Sets:**
  - a textile mill with looms and spools; Stanton's wood-panelled office;
  - a mailbox and letter close-up with the number;
  - Buffett's Omaha office; a shareholder meeting;
  - a modern skyscraper (Berkshire today); a stack of coins.

## 9. getty-ransom: the Getty kidnapping, 1973
- **Hook idea:** "The richest man in the world negotiated his grandson's ransom, and charged interest."
- **Facts:**
  - July 10, 1973: John Paul Getty III, 16, was kidnapped in Rome.
  - The kidnappers demanded $17 million (some sources say $18 million). His grandfather J. Paul Getty, then one of the richest men in the world, refused to pay at first.
  - In November a newspaper in Rome received a package with the boy's ear and a lock of hair. **Keep it non-graphic: show a sealed envelope, never an ear.**
  - The ransom was negotiated down to about $3 million (some sources say $2.9 million).
  - The grandfather paid $2.2 million, reportedly the most that was tax-deductible. He lent the rest to his son, the boy's father, at 4% interest.
  - The boy was released on December 15, 1973.
- **Tactics:**
  - Anchoring and the walk-away: refusing to pay pulled the number down.
  - The other side's deadline.
  - The human cost of treating everything as a deal.
- **Takeaway:** "Winning the number isn't the same as winning."
- **Cast:** the grandfather (old, bald or receding, suit); the father; the mother (Gail Harris: blouse, bob); the teenager (long hair, 1970s); negotiators; kidnappers (hats, no faces needed; neutral).
- **Sets:**
  - a Rome piazza at night (brick fountain, Vespa-style scooter);
  - a mountain hideout in southern Italy; an English country mansion;
  - a newspaper office; a phone booth; a bank vault;
  - a gas station on a country road (the release).

## 10. cuban-missile: the Cuban Missile Crisis, 1962
- **Hook idea:** "The world was on the brink of nuclear war. A secret side deal stopped it." (not "minutes from": that isn't literally true)
- **Facts:**
  - October 1962: US spy-plane photos showed Soviet nuclear missile sites being built in Cuba.
  - President Kennedy chose a naval "quarantine" (a blockade), announced October 22.
  - Khrushchev sent two letters. The first offered to remove the missiles in exchange for a US promise not to invade Cuba. The second added a demand: remove US missiles from Turkey.
  - October 27: a US U-2 was shot down over Cuba.
  - Kennedy publicly answered the first letter. Robert Kennedy privately told Soviet ambassador Anatoly Dobrynin that the US missiles in Turkey would be removed, on condition that this was kept secret.
  - October 28: Khrushchev announced that the missiles would be dismantled. The US Jupiter missiles left Turkey in 1963.
- **Tactics:**
  - Let the other side save face.
  - Answer the offer you want (often called the "Trollope ploy").
  - A secret concession.
- **Takeaway:** "Give them a way to say yes without looking like they lost."
- **Cast:** JFK (suit, side hair); RFK; Khrushchev (bald, suit); Dobrynin; generals (uniform, officer hats).
- **Sets:**
  - a spy plane over an island; a map table in a war room;
  - navy ships on a brick sea; the Oval Office (generic: desk, flags without emblems);
  - the Kremlin office (generic); a missile site in a jungle;
  - a night-time embassy meeting; a radio broadcast.

## 11. fbi-negotiation: FBI hostage-negotiation tricks
- **Hook idea:** "FBI negotiators talk people out of the worst day of their lives. Here's the script."
- **Facts:**
  - The FBI's crisis-negotiation approach is often described as the Behavioral Change Stairway Model: active listening, then empathy, then rapport, then influence, then behavioural change.
  - The core skills are open-ended questions, minimal encouragers ("mm-hm", "okay"), paraphrasing, **emotional labelling** ("It sounds like you feel ignored"), **mirroring** (repeat their last few words as a question) and effective pauses.
  - Former FBI lead international kidnapping negotiator Chris Voss popularised these in his book *Never Split the Difference* (2016).
  - Calibrated questions ("How am I supposed to do that?") make the other side solve your problem.
- **Format:** a tense brick standoff scene (fictional, nobody hurt), told through each technique. Then the same techniques used on a landlord, a boss or a car dealer.
- **Takeaway:** "Before you persuade anyone, make them feel heard."
- **Cast:** a negotiator (vest, label "NEGOTIATOR"); a fictional man barricaded in a store; police; a tenant and a landlord.
- **Sets:**
  - a street with police cars and a barrier; a command van with screens;
  - inside a store; a phone close-up;
  - an apartment hallway (the landlord); an office (salary); a car lot.

## 12. theranos-halo: Theranos
- **Hook idea:** "Her blood tests did not work as she claimed. Her board was full of famous names." (not "no working product": that overstates the record)
- **Facts:**
  - Elizabeth Holmes founded Theranos in 2003 at 19, after dropping out of Stanford. She claimed a few drops of blood from a finger could run many tests.
  - Her board included former Secretaries of State George Shultz and Henry Kissinger, former Defense Secretary William Perry, Jim Mattis and Sam Nunn.
  - The company was valued at about $9 billion in 2014, and the tests rolled out in Walgreens stores.
  - Tyler Shultz, an employee and George Shultz's grandson, became a whistleblower.
  - In October 2015 the Wall Street Journal's John Carreyrou exposed problems with the tests.
  - In January 2022 Holmes was convicted on four counts of defrauding investors. She was sentenced to 11 years and 3 months.
- **Tactic:** borrowed authority (the halo effect): famous names replacing evidence.
- **Takeaway:** "Big names are not proof. Ask to see it work."
- **Cast:** Holmes (black turtleneck, blonde bun, K.SKIN.light, deep voice is a cliché, so don't mention it); elderly board members in suits; Tyler Shultz (young); Carreyrou (glasses); lab workers (labcoat).
- **Sets:**
  - a sleek glass HQ lobby; a lab with machines; a board table full of famous figures;
  - a pharmacy counter; a magazine-cover wall (generic covers);
  - a newsroom; a courtroom.

## 13. hp-pretexting: Hewlett-Packard's spying scandal, 2006
- **Hook idea:** "The chair of HP spied on her own board to find one leaker."
- **Facts:**
  - HP's board had a leak problem: confidential discussions kept appearing in the press.
  - Chair Patricia Dunn backed an investigation. Investigators used "pretexting" (posing as other people) to get the phone records of directors and journalists.
  - Director George Keyworth was identified as the source of a leak.
  - Director Tom Perkins resigned in protest in May 2006 and later pushed for the methods to be disclosed.
  - The scandal went public in September 2006. Dunn resigned, and executives testified to Congress.
  - California's criminal charges against Dunn were later dismissed.
  - HP paid $14.5 million to settle a civil case brought by California.
- **Tactics:**
  - When trust breaks, surveillance makes it worse.
  - Perkins' walk-out turned a private fight public.
- **Takeaway:** "You can't negotiate with people you're spying on."
- **Cast:** Dunn (blazer, short hair); Perkins (white hair, suit); Keyworth (older); investigators (fedora, trench); journalists.
- **Sets:**
  - an HP-style boardroom (no logo); a newsroom with leaked headlines;
  - a phone-company call centre (pretexting calls); an investigator's van;
  - Perkins' exit through a door; a congressional hearing room;
  - a courthouse.

## 14. porsche-vw: Porsche and Volkswagen, 2008–2012
- **Hook idea:** "A small car maker secretly cornered the world's biggest one, and still lost."
- **Facts:**
  - Porsche quietly built a position in Volkswagen through cash-settled options.
  - On October 26, 2008, it disclosed that it held or controlled about 74% of VW's ordinary shares (42.6% in shares plus 31.5% in options).
  - The state of Lower Saxony held about 20%, so very few shares were left to trade, and short sellers rushed to buy.
  - VW's share price jumped from around €200 to over €1,000 during trading on October 28. That briefly made VW the most valuable company in the world.
  - Porsche had taken on huge debt. In the 2009 financial crisis the plan collapsed, and VW ended up taking over Porsche's car business (completed 2012).
- **Tactics:**
  - Hidden leverage.
  - Overreach: a plan that needs everything to go right.
- **Takeaway:** "Leverage you can't afford to hold isn't leverage."
- **Cast:** Porsche CEO Wendelin Wiedeking (glasses, side hair); VW chair Ferdinand Piëch (older, slick white hair); traders (shirts, ties); Lower Saxony official.
- **Sets:**
  - two car factories (small sports-car vs giant); a trading floor with screens;
  - a price chart rocket; a car showroom;
  - a bank (debt); the boardroom swap; a 2012 handshake.
  - Use generic car shapes, no badges.

## 15. musk-twitter: Musk and Twitter, 2022
- **Hook idea:** "He tried to walk away from a $44 billion deal. The contract wouldn't let him."
- **Facts:**
  - April 2022: Elon Musk revealed a stake of about 9% in Twitter.
  - On April 14 he offered $54.20 a share, about $44 billion. The board adopted a "poison pill", then accepted the deal on April 25. Musk had waived detailed due diligence.
  - In May he said the deal was "temporarily on hold" over fake-account numbers.
  - On July 8 he tried to terminate it. Twitter sued him in Delaware on July 12 to force the deal at the agreed price.
  - Weeks before trial, on October 4, Musk offered to go through with it. The deal closed on October 27, 2022, and he fired the top executives, including CEO Parag Agrawal.
- **Tactics:**
  - Commitment: a signed contract (with specific performance) beats second thoughts.
  - Due diligence is leverage you give up when you waive it.
- **Takeaway:** "Your leverage ends when you sign. Ask your questions before."
- **Cast:** Musk (short hair, black tee or blazer); Agrawal (beard, glasses? keep: short hair, K.SKIN.medium); the Twitter board; a judge; lawyers.
- **Sets:**
  - a rocket launch pad (generic rocket); an HQ lobby with a bird-free blue sign "HQ";
  - a phone with posts; the boardroom (poison pill, shown as a pill bottle prop);
  - a courthouse in Delaware; a sink being carried into the lobby (he did this on Oct 26, 2022, a documented event);
  - empty desks.

## 16. dirty-tactics: six manipulation tactics in negotiations
- **Hook idea:** "Six tricks people use on you in every negotiation, and how to beat them."
- **Content** (general, no fake statistics). Each tactic gets one brick vignette and a one-line defence:
  1. **Good cop / bad cop:** "Treat them as one team."
  2. **The fake deadline** ("only today"): "Ask what really happens tomorrow."
  3. **The lowball anchor:** "Don't counter a crazy number; reset with your own, backed by a reason."
  4. **Nibbling** ("one more small thing" after you agree): "Trade for it: 'Sure, if…'"
  5. **False scarcity** ("two other buyers"): "Be ready to walk."
  6. **"My boss won't approve it"** (higher authority): "Ask to talk to the boss, or set your own limit."
- **Takeaway:** "Once you can name the trick, it stops working."
- **Sets:** one new set per tactic: a police interview room, a market stall, a car lot, a contract desk, an auction, a sales floor with a manager's glass office, plus an opening and a closing set.

## 17. salary-offer: negotiating a job offer
- **Hook idea:** "The first number in a salary talk decides the whole thing. Make sure it's yours."
- **Content** (general advice, no invented statistics). A fictional character, Maya, gets an offer:
  1. Don't accept on the spot: thank them and ask for time.
  2. Research the market range.
  3. Counter with a specific number, anchored high and backed by reasons.
  4. Use silence after the counter.
  5. Negotiate the whole package (start date, bonus, remote days, title).
  6. Get it in writing.
- **Tactics named:** anchoring, the pause, package trading (logrolling).
- **Takeaway:** "They expect you to negotiate. The only bad move is not asking."
- **Sets:** a home desk with a laptop; an interview room; a coffee shop; a video call; HR's office; the first day at a new office; a calendar or contract close-up.

## 18. car-dealer: what the car salesperson says vs. what it means
- **Hook idea:** "'What monthly payment works for you?' is the most expensive question at a car dealer."
- **Content** (general, no invented statistics), one line at a time:
  - "What monthly payment are you looking for?" → they can hit any monthly number by stretching the loan; negotiate the total price.
  - "Let me check with my manager." → the higher-authority tactic; the back-and-forth wears you down.
  - "This price is only good today." → a false deadline.
  - The worksheet that mixes price, trade-in, down payment and monthly payment in one place → negotiate each separately.
  - Add-ons in the finance office (extended warranties, protection packages) → you can say no.
- **Takeaway:** "Negotiate one number at a time, and always be ready to walk out."
- **Sets:** a car lot with flags; a showroom; the salesperson's desk; the manager's glass office; the finance office; the test-drive road; the walk-out to the street.

## 19. ford-ferrari: Ford vs. Ferrari, 1963–1966
- **Hook idea:** "Enzo Ferrari walked away from Ford's offer. Ford spent three years getting revenge."
- **Facts:**
  - In 1963 Ford negotiated to buy Ferrari. The talks collapsed in May 1963 because Enzo Ferrari would not give up control of his racing team.
  - Henry Ford II answered by funding a racing programme to beat Ferrari at Le Mans: the GT40.
  - Ferrari kept winning Le Mans in 1964 and 1965.
  - In 1966 Ford finished first, second and third at Le Mans. The winning car was driven by Bruce McLaren and Chris Amon; Ken Miles and Denny Hulme were second.
  - Ford won Le Mans every year from 1966 to 1969.
  - In 1969 Fiat bought a stake in Ferrari, and Enzo kept control of racing.
- **Tactics:**
  - Know your non-negotiable: Enzo's walk-away point was control.
  - The cost of an insulted counterpart.
- **Takeaway:** "Know the one thing you will never trade, and you'll know when to walk."
- **Cast:** Enzo (sunglasses, grey slick hair, suit); Henry Ford II (suit, side hair); Ford negotiators; Carroll Shelby (cowboy hat → use fedora, light suit); racing drivers (racing suits, helmets).
- **Sets:**
  - an Italian workshop with red cars; Ford's Detroit office;
  - a negotiation table with a contract; a design studio (GT40 as a generic low racer);
  - the race track at night with pits and stands; the 1966 finish line with three cars side by side;
  - a podium with a trophy.
  - Cars: `K.car` "racer", no badges.

## 20. coke-pepsi: the Coke secret that Pepsi turned in, 2006
- **Hook idea:** "Someone offered Pepsi Coca-Cola's secrets. Pepsi called Coke."
- **Facts:**
  - In May 2006 PepsiCo received a letter, in an official Coca-Cola envelope, offering Coca-Cola trade secrets to the highest bidder.
  - Pepsi alerted Coca-Cola, which contacted the FBI.
  - In an undercover sting, an agent agreed to pay $1.5 million for secret documents and a sample of a new product.
  - Arrested: Joya Williams, a secretary at Coca-Cola, and two accomplices, Ibrahim Dimson (who used the alias "Dirk") and Edmund Duhaney.
  - Williams was convicted in February 2007 and sentenced to eight years; Dimson got five years and Duhaney two.
  - Pepsi said competition "can sometimes be fierce, but also must be fair and legal".
- **Tactic:** integrity as strategy (reputation is long-term leverage; a stolen advantage poisons every future deal).
- **Takeaway:** "Your reputation is the one bargaining chip you can't buy back."
- **Cast:** Williams (blouse, bun); Dimson and Duhaney; a Pepsi executive; a Coke executive; FBI agents (vest "FBI" is OK as a label, it's a government agency).
- **Sets:**
  - a soda factory line (generic red and blue cans, NO logos);
  - Coke HQ (generic red building); Pepsi HQ (generic blue);
  - a mailroom with an envelope; an FBI office;
  - an airport meeting with a cash bag; a courtroom.

## 21. kraft-cadbury: Kraft takes Cadbury, 2009–2010
- **Hook idea:** "Kraft promised to keep a chocolate factory open. A week after winning, it closed it."
- **Facts:**
  - In September 2009 Kraft made a hostile bid for the British chocolate maker Cadbury. Cadbury's board rejected it.
  - In January 2010 Cadbury agreed to a raised offer of about $19 billion (about £11.5 billion).
  - During the bid Kraft said it would keep Cadbury's Somerdale factory near Bristol open.
  - About a week after gaining control, Kraft announced the factory would close.
  - In May 2010 the UK Takeover Panel criticised Kraft for making the promise without a reasonable basis. UK takeover rules were tightened in 2011.
  - Warren Buffett, Kraft's biggest shareholder, publicly opposed how the deal was financed.
- **Tactic:** promises in a negotiation are only as good as their enforcement (get it in writing, with consequences).
- **Takeaway:** "A promise without a penalty is just a sales pitch."
- **Cast:** Kraft CEO Irene Rosenfeld (blazer, bob hair); Cadbury chairman Roger Carr (suit); factory workers (hardhats, overalls → shirt + hardhat); British politicians.
- **Sets:**
  - a chocolate factory (brown bricks and wrappers, generic purple, no logos);
  - a London boardroom; a bid letter on a desk;
  - a stock-exchange screen; a factory gate with a CLOSED sign;
  - the UK Parliament committee room; workers in the rain.

## 22. oracle-peoplesoft: Oracle vs. PeopleSoft, 2003–2004
- **Hook idea:** "PeopleSoft built a poison pill to stop Oracle. Oracle just kept raising the price."
- **Facts:**
  - In June 2003, days after PeopleSoft agreed to buy J.D. Edwards, Oracle launched a hostile $16-a-share bid for PeopleSoft.
  - PeopleSoft fought back with a "customer assurance program": refunds of two to five times license fees if a buyer cut support. Critics called it a poison pill.
  - The US Justice Department sued to block the deal in 2004 and lost.
  - Oracle's bid rose to $19.50, then $26, dipped to $21, and finally reached $26.50 a share.
  - In October 2004 PeopleSoft's board fired CEO Craig Conway.
  - In December 2004 PeopleSoft agreed to Oracle's $26.50 offer, about $10.3 billion.
- **Tactics:**
  - Persistence and attrition: keep the offer alive until the other side's defences cost more than saying yes.
  - Poison pills raise the price, but rarely stop a determined buyer.
- **Takeaway:** "A no is often a not yet. Keep your offer alive."
- **Cast:** Larry Ellison (beard, slick grey hair, blazer); Craig Conway (suit); boards; customers; lawyers; a judge.
- **Sets:**
  - two rival office towers; a server room; a press conference stage;
  - a "price board" climbing; a courtroom; the boardroom (Conway's exit);
  - a signing table.

## 23. ackman-icahn: the billionaires' shouting match on live TV, 2013
- **Hook idea:** "Two billionaires shouted at each other on live TV. Their feud went back a decade." (don't claim a motive such as revenge: that's speculation)
- **Facts:**
  - In December 2012 Bill Ackman announced a $1 billion bet against Herbalife, calling it a pyramid scheme. Herbalife denied it.
  - On January 25, 2013, on CNBC's Halftime Report with Scott Wapner, Carl Icahn called in, and the two traded insults live for about half an hour. Icahn called Ackman "a crybaby in the schoolyard".
  - The feud went back about a decade, to a deal over Hallwood Realty in which Ackman said Icahn owed him money. A court later sided with Ackman.
  - Icahn then bought a big stake in Herbalife, betting the other way.
  - Ackman's short went badly, and he exited it in 2018.
  - The two had already made up publicly in July 2014, at a CNBC conference, where they hugged on stage.
- **Tactics:**
  - Never make it personal. Emotion leaks information and leverage.
  - A public position you can't back out of becomes a target.
- **Takeaway:** "The moment it gets personal, you've handed the other side a lever."
- **Cast:** Ackman (grey hair, side, suit); Icahn (bald or receding, mustache, older); Wapner (TV host, suit); traders.
- **Sets:**
  - a TV studio with a split-screen phone call; a trading floor;
  - a presentation hall (Ackman's slides); the courtroom (Hallwood);
  - a supplement shop (generic shakes); a conference stage (the hug).

---

## Revamp status (Nov 2026)

brick-cinematic + DealCalm CTA + 6-seat Opus council, max 5 rounds; latest = highest `renders/<name>-r<N>.mp4`.
- Done at 5 rounds (none reached the private 8.0 gate): disney-iger 7.13 (plus a Zubenelgenubi re-voice `r6-zubenelgenubi`), buffett-berkshire 7.10, jobs-coup 7.10, blockbuster-netflix 7.05, jordan-nike 6.95, gates-ibm 6.95, altman-ousted 6.94, ford-ferrari 6.90.
- Paused (resume with the orchestrator's `resume3_args.json`): coke-pepsi (4 rounds, 6.86), hp-pretexting (3, 6.86), getty-ransom (3, 6.46), cuban-missile (2, 6.66); not started: fbi-negotiation, dirty-tactics, car-dealer.
- Lessons: `.agents/skills/lego-explainer/SKILL.md`.

## Production order

Batches of about 4 in parallel. Order: 1, 9, 5, 8 · 4, 7, 6, 2 · 10, 12, 14, 15 · 19, 20, 21, 22 · 3, 13, 23, 11 · 16, 17, 18.

## Status (orchestrator keeps this current)

TODO at the end: re-render the early videos (jordan, getty, buffett, altman, lucas, gates) with the final kit. Hair and head-turn fixes landed after they were rendered. Look at a few frames first.

| # | Project | Status |
|---|---|---|
| 5 | jordan-nike | DONE: `jordan-nike/renders/jordan-nike-v1.mp4` (110.1 s). Gemini made it; Claude fixed the hook framing, the signing cameras and the window gaps in the kit |
| 1 | altman-ousted | DONE: Gemini made it; Claude changed "deadline" to "ultimatum" (the letter set no deadline; the error was in my fact sheet), faced Altman to camera in the hook and on the call, and raised the ending camera |
| 9 | getty-ransom | DONE: Gemini made it; Claude fixed the mother's call shot (her face was hidden, and a tag covered it) |
| 8 | buffett-berkshire | DONE: Gemini made it; Claude tightened all cameras (×0.86), cleaned up the recap and faced old Buffett to camera. Kit fix: the side fringe no longer covers the eyes |
| 4 | lucas-starwars | DONE: Gemini made it; Claude removed a double hedge ("most accounts ... reportedly") |
| 7 | blockbuster-netflix | DONE: Gemini made it; Claude removed invented reactions (Antioco facepalming at a 2010 store closure, though he had left in 2007, and in "hindsight"), tightened the cameras and kept the pitchers in frame |
| 6 | gates-ibm | DONE: Gemini made it; Claude reworded move one ("secure the rights before you license them out" implied the wrong order: the IBM deal came before the 86-DOS purchase) |
| 2 | uber-kalanick | DONE: Gemini made it; Claude fixed a fact (only Cohler and Fenton were in the Chicago room, not all five investors). Kit fixes: head turn ±0.8, short hair stops behind the eyes, sideburns moved back |
| 10 | cuban-missile | DONE: Gemini made it; Claude softened the hook ("minutes from" became "on the brink of") and put an announcer at the radio mic instead of Khrushchev |
| 12 | theranos-halo | DONE: Gemini made it; Claude reworded the hook ("no working product" overstated the record) |
| 14 | porsche-vw | DONE: Gemini made it; Claude removed invented reactions (Piëch shocked or smirking, Wiedeking sad) and kept Wiedeking out of the 2009–2012 boardroom (he left in July 2009) |
| 15 | musk-twitter | DONE: Gemini made it; Claude removed Agrawal from the April 14 offer scene (the offer went to the board) |
| 19 | ford-ferrari | DONE: Gemini made it; script checked OK. Kit fix: the racing helmet is now open-face (the closed shell hid the drivers' faces) |
| 13 | hp-pretexting | DONE: Gemini made it; Claude faced Dunn to the camera and removed an invented hand-over of documents from Perkins to a journalist |
| 20 | coke-pepsi | DONE: Gemini made it; Claude removed an unsupported "right away" |
| 22 | oracle-peoplesoft | DONE: Gemini made it; Claude softened a causal claim ("the poison pill pushed the price up" became "the long fight") |
| 21 | kraft-cadbury | DONE: Gemini made it; Claude reviewed it, no changes needed (101.6 s) |
| 23 | ackman-icahn | DONE: Gemini made it; Claude removed motive speculation ("getting his revenge", "grudge turned into a trade"; the error was in my fact sheet) and made Icahn look distinct (bald, darker mustache) |
| 3 | disney-iger | DONE: Gemini made it; Claude fixed the hook timing ("two years later" became "less than three years later": Feb 2020 to Nov 2022; the error was in my fact sheet) and removed an undocumented handshake between Iger and a board member |
| 11 | fbi-negotiation | DONE: Gemini made it; Claude reviewed it, no changes needed (112.1 s) |
| 16 | dirty-tactics | DONE: Gemini made it; Claude reviewed it, no changes needed (107.9 s) |
| 18 | car-dealer | DONE: Gemini made it; Claude reviewed it, no changes needed (105.4 s) |
| 17 | salary-offer | DONE: Gemini made it; Claude softened a generalization ("Hiring teams expect a counteroffer" became "Many hiring teams expect you to negotiate") |
