# Copy that reads as written by a person

Kevin, 2026-11-11, about the MI Gas owner: he is intense about anything in the
copy that sounds like AI. `standards.md` has the short rule ("Write like a
person, not like a model", 2026-09-13). This file is the long version: what
readers notice, what the research measured, what to write instead, and the
checker that reads a site for it. Two research passes on 2026-11-11 fed it,
one on AI prose in general and one on marketing and website copy. The sources
are at the bottom.

Same contract as the rest of the kit: rules first, the evidence underneath.

---

## The rules

1. **Run `glaze/scripts/tells.mjs` on every page before copy ships.** Zero hard
   hits. Read every check hit in context and decide; the per-page count is the
   point.
2. **Fix the content, then the wording.** Swapping words does not remove the
   signal. In the best study we have, readers who use AI tools daily caught
   every paraphrased and "humanized" AI article. What changes their verdict is
   substance: a number, a name, a position, a limit.
3. **Apply the swap test to every claim.** If a competitor could publish the
   sentence unchanged, it is generic. Rewrite it around something only this
   owner can say, or cut it.
4. **Never invent a specific.** A made-up number, review, badge or client is
   worse than a vague line. Current models insert plausible numbers on their
   own, so a specific is only evidence of a human when it is true.
5. **Write in the owner's register, not a generic "human" one.** Read his own
   writing first (the client's voice file if there is one). Contractions,
   pronouns and profanity follow how he writes.
6. **One idea per sentence, subject then verb, the plain word.** Use "is",
   "has" and "uses". Repeat the same noun each time it comes up.
7. **No em dashes.** The research says they no longer prove much, but readers
   still believe they do, and this house banned them before AI made them famous.
8. **Do not fake humanity.** No planted typos, no performed candor ("I'll be
   honest"), no sprinkled slang. Experts look past surface cues, and those
   cues are the first thing a "humanizer" adds.

---

## The checker

```
node glaze/scripts/tells.mjs --base http://127.0.0.1:4517 --routes /,/consulting
node glaze/scripts/tells.mjs --text draft.txt        # a letter, an email, a note
```

Run it from the project, against a production build, like the auditor. It shows
every hidden element and opens every `<details>` before reading, so booking
steps and FAQ answers are checked too, along with titles, meta and og
descriptions, alt text, placeholders and aria-labels. Lines shared by every
route (nav, footer) are reported once.

- **Hard** hits fail the run (exit 1): em dashes, the negation reframe, a
  tautology, unnamed authorities ("studies show"), stock phrases, and the
  model vocabulary the studies and editors agree on.
- **Check** hits are constructions that are fine once and a tell as a habit:
  lists of three, "X, not Y", short landing lines, colon reveals, questions the
  copy answers itself, personification, mirror sentences, counting
  announcements, "worth" constructions, tradeoff denials, sincerity markers,
  repeated phrases (more than twice on a page, per `glaze.md`).
- It also prints sentence-length spread per page. Low spread is what detectors
  call low "burstiness"; read a page whose spread is low aloud.

It flags candidates, and a person decides. It cannot tell whether a sentence
sounds like the owner, and it cannot see a claim that is generic but
grammatically clean. The swap test and a read-aloud are still the job.

---

## What the research found

- **Clusters, not single items.** Every serious source says one tell proves
  nothing. Readers react to several together.
- **Heavy AI users are expert detectors.** Russell, Karpinska and Iyyer (ACL
  2025): five annotators who use ChatGPT daily, voting together, misjudged 1
  article in 300 and caught every paraphrased one. People who rarely use AI
  scored near chance. A sensitive owner is probably in the expert group. Write
  for him. The experts cited vocabulary in 53% of their explanations, sentence
  structure in 36%, and originality, quotes, over-explaining, formatting and
  formulaic endings after that.
- **Suspicion costs trust even when a human wrote it.** Raptive (2025, 3,000
  adults): content readers believed was AI-made was rated about half as
  trustworthy. The job is to remove triggers, including from the owner's own
  sentences.
- **The tells drift.** "Delve", "intricate" and "showcasing" fell after they
  were publicized in 2024. In 2026 the risers are "matters", "dependable",
  "steady", "meaningful", "foster", "leverage", "prioritize". Em dashes went
  from the best-known tell to under-used in GPT-6 and Gemini 3.1, and Claude
  Opus 5.5 dropped them almost entirely. Word lists date within a year; the
  sentence shapes have lasted longer.
- **Each model family has its own habits.** Graphite (a marketing firm, Sept
  and Oct 2026) found most tells unique to one family. Claude Opus 5.5 overuses
  "this matters", "why X matters", "is more than a", "rather than simply",
  "looking ahead", "adds another layer", "dependable" and superlative frames
  ("every single", "arguably the most"). GPT-6 hedges and corrects ("does not
  establish", "not necessarily"). Gemini leans on "additionally",
  "furthermore" and intensifiers. Anything drafted with a model gets checked for
  that model's list, including drafts written by us.
- **Detectors are a rough guide at best.** Pangram, GPTZero, Originality and
  Copyleaks are trained classifiers. All lose accuracy under 50 to 100 words,
  which is every headline, CTA and FAQ answer on a small site. Perplexity-based
  detectors flagged 61% of human TOEFL essays as AI (Liang et al. 2023), and
  OpenAI withdrew its own detector in 2023, so we never edit toward a detector
  score.

---

## The tells, with the fix

Strength: **strong** means measured at scale and flagged by several catalogs;
**moderate** means flagged by several, measured little; **weak** means humans
do it often or the evidence conflicts.

### Sentences

| Tell | Example | Fix | Strength |
|---|---|---|---|
| Negation reframe | "This isn't consulting. It's a partnership." / "not just X, but Y" / "more than a" | State the positive claim with a detail. Name a real misconception if there is one. | Strong; the most-cited single tell, still rising |
| Reflex triads | "One room, one problem, an answer this week." | However many items are true. Vary list shapes between sections. | Strong in clusters, weak alone |
| "-ing" tails | "..., ensuring optimal conditions" | Cut it, or make the consequence its own checkable sentence. | Strong for 2023-25 models |
| "Serves as", "boasts", "stands as" | "Our showroom serves as a hub" | Use "is" or "has". | Moderate, fading |
| Stock openers | "In today's fast-paced world", "Whether you're X or Y", "Look no further" | Open on a fact about the owner or the reader's problem. | Strong for the named phrases |
| Self-answered questions, colon reveals | "The result? Bigger harvests." / "Here's the thing:" | Say it flatly. Keep a question only if clients ask it in those words. | Moderate |
| Tradeoff denial | "without sacrificing quality" | State the mechanism or the real tradeoff. | Moderate (2026 models) |
| Synonym cycling | "your grow, your facility, your cultivation space" | Pick the owner's word and repeat it. | Moderate |
| Chiasmus and mirror lines | "the room never waits on the crew and the crew never waits on the room" | Say what is planned around what. | Moderate (house finding) |
| Personification | "the room answers", "the first call prices the room" | Say who did what. | Moderate (house finding, standards.md) |

### Content

| Tell | Example | Fix | Strength |
|---|---|---|---|
| Generic claim | "We are passionate about exceptional quality." | A number, name, place, process, price or term. Apply the swap test. | Strong |
| Inflated significance | "a testament to", "this matters because" | Show the consequence. | Strong; "matters" is the 2026 wording |
| Unnamed authority, phantom proof | "experts agree", "trusted by industry leaders", a "Most booked" badge with no bookings | Name and link it, or cut it. | Moderate to strong |
| Invented specifics and testimonials | "Sarah M., Head Grower" | Real clients, their own words, odd details intact. The FTC rule (Oct 2024) bans fake testimonials. | Moderate; also a legal risk |
| Balance for its own sake | "Despite these challenges, we thrive" | Take a position and give the reason. | Moderate |
| Banal claim as insight | "Choosing the right consultant is important." | Cut it, or say what only he would say. | Moderate |
| No limits stated | Every page upbeat, nobody turned away | Say who it isn't for, what he won't do, one thing that went wrong. | Moderate |

### Vocabulary

One word proves nothing; a cluster does. Lists age, so the checker's lists are
dated in the code. Use the plain word or the evidence the adjective stood in for.

- **Measured (Kobak 2025, Juzek & Ward 2025, Liang 2024):** delve, underscore,
  showcase, intricate, meticulous, pivotal, realm, commendable, noteworthy,
  groundbreaking, boasts, garner, additionally, crucial, comprehensive.
- **Marketing lists (editors and practitioners):** unlock, unleash, elevate,
  empower, seamless, tailored, curated, journey, landscape, navigate, harness,
  robust, holistic, transformative, game-changer, cutting-edge, leverage.
- **2026 risers:** matters, dependable, steady, thoughtful, meaningful,
  foster, prioritize, multifaceted, quietly; Claude banlist phrases
  load-bearing, earns its keep, north star, pressure-test, right-size, and
  "worth" constructions.

### Rhythm and structure

| Tell | Fix |
|---|---|
| Every sentence and paragraph the same length | Let length follow content. One line where the answer is short, a long paragraph where a process needs it. |
| The neat one-line landing, fragment stacks | Fold the point into the paragraph and end on a fact, or just stop. |
| Twin-sentence headlines ("Grow smarter. Harvest more.") | One plain sentence: who it is for, what he does, one checkable detail. |
| Summary closers ("In short", "Ultimately", "Looking ahead") | Stop when the information ends. |
| One point said several ways | Say it once, in the place it does the most work. |
| Counting announcements ("Three things set us apart") | Start with the first thing. |
| Bold-label bullets, emoji bullets, title-case headings | Plain bullets that start with the fact; sentence case. |
| Template page skeleton (hero, three benefits, three steps, testimonials, CTA) | Order sections by the buyer's questions: what, for whom, cost, how, proof, how to start. |

### Website parts

- **CTAs:** say the step, the price and who answers. Not "Get started today".
- **FAQs:** answer first, then the condition. No restating the question, no
  "Great question", no questions no client has asked ("Why choose us?").
- **Forms and confirmations:** say what happens next and when. Explain why a
  field is asked if it is not obvious.
- **Meta descriptions:** facts in about 150 characters, written per page. Never
  open with Discover, Explore, Unlock, Elevate or Dive into.
- **Testimonials:** real, attributed, in the client's phrasing, including the
  doubt they had before hiring. Never a placeholder person.

---

## What reads as human

- Verifiable specifics: names, places, numbers with units and dates, real
  brands and gear, down to the model.
- First person and direct address, small true anecdotes, real enthusiasm
  where it is felt.
- Uneven rhythm and mixed punctuation (parentheses, the odd semicolon).
- Plain verbs, "is" and "has", the same noun repeated.
- Positions a reader could argue with, tradeoffs stated, uncertainty shown
  where it is real.
- Endings that stop instead of summarizing.
- One register throughout. A pricing page should not lurch into brochure.

---

## Editor's checklist

A "yes" means fix it.

1. Could a competitor publish any paragraph unchanged?
2. Does the hero leave out who it is for, what he does, or one checkable detail?
3. Is any heading two or three matched fragments ("X. Y." or "X. Y. Z.")?
4. Is there any "not X, it's Y", "not just", "more than a", or "rather than simply"?
5. Does any section open on the industry, "Whether you're", a rhetorical question, or "Here's the thing"?
6. Does any paragraph hold two or more words from the vocabulary lists?
7. Does any sentence end in an "-ing" benefit clause?
8. Does the copy say "our team" for work the owner does alone, or "I" when his own writing says "we"?
9. Is there any number, count, percentage or "up to" claim he cannot trace to a record?
10. Is any claim credited to unnamed authorities?
11. Does any section lack a named piece of equipment, a process, a metric with units, a place or a date?
12. Does every list on the page have exactly three items?
13. Does any heading announce importance ("Why X matters")?
14. Is the page missing who it is not for, or what he does not do?
15. Is the price, minimum or process missing where a buyer would look for it?
16. Does any testimonial lack a real attribution or the client's own phrasing?
17. Does any FAQ answer repeat the question or clear its throat?
18. Does any CTA or confirmation leave out what happens next?
19. Is the same point made more than once on the page?
20. Is there an em dash anywhere?
21. Read aloud to the owner: is there a sentence he would not say to a grower standing in the room?

---

## Owner rules beat research rules

The research gives defaults. The owner's own writing overrides them.

- **MI Gas uses "we".** The marketing research says to write "I" for a solo
  practice, because AI drafts default to a corporate "we". Jake's posts say
  "we" for a real team (a veg and mom manager, staff), so "we" is his voice,
  not a tell. `clients/migas-voice.md` has the evidence.
- **Contractions follow the owner.** Jake writes "you're" and "don't", so the
  MI Gas copy does. Contractions alone prove nothing in either direction.
- **The owner's own phrases stay, even when the checker flags them.** "Grow
  with us" and his Patreon tagline ("Commercial cannabis cultivation advice,
  SOPs, and instruction", a triad) are his.

---

## MI Gas, 2026-11-11

The first run of the checker on the live site found 2 hard hits and 50 check
hits across six routes. After the rewrite (migas branch
`claude/copy-pass-2026-11`, about 120 lines): 0 and 14, each of the 14 read and
kept. What came out, by pattern:

- Negation reframe: "Rooms... are not luck. They are a program."
- Aphorisms: "Co-management steers the room; it cannot walk it." / "Thirty
  minutes that skip the setup are worth more than an hour that does not."
- Twin headline: "The work is public. The method is on Patreon."
- Chiasmus, personification, a tautology ("Remote steering is remote"),
  sincerity markers ("an honest no"), a strawman ("Most paid consults
  spend... This one asks"), counting ("Four things we take over").
- One point (we read your profile before the call) made four times on one page;
  "before the call" eight times.
- A "Most booked" badge on a site with no bookings. Invented social proof.
- The first rewrite's own Claude habits, caught by the 2026 lists: four "worth"
  constructions and a tradeoff denial.

Still open with him: the draft FAQ answers (confidentiality, rescheduling,
term) need his own words, and the site has no story of something that went
wrong, which his posts always have. Nothing from his Patreon gets lifted
to fill that gap; ask him for one he is willing to publish.

---

## Sources

Read in full by the research passes, unless marked.

- Wikipedia, "Signs of AI writing" (WikiProject AI Cleanup), current to Nov 2026, and its list of ineffective indicators: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- Russell, Karpinska and Iyyer, expert human detection of AI text, ACL 2025: https://arxiv.org/abs/2501.15654
- Kobak et al., excess vocabulary in 15M PubMed abstracts, Science Advances 2025: https://www.science.org/doi/10.1126/sciadv.adt3813
- Juzek and Ward, why LLMs overuse certain words, COLING 2025: https://arxiv.org/html/2412.11385
- Liang et al., LLM-modified peer reviews, ICML 2024: https://arxiv.org/html/2403.07183v4
- Reinhart et al., instruction-tuned style vs human style, PNAS 2025: https://arxiv.org/html/2410.16107v2
- Geng and Trotta, how flagged words fell after publicity: https://arxiv.org/html/2502.09606
- Chakrabarty et al., what professional editors change in AI text, CHI 2025: https://arxiv.org/html/2409.14509v5
- Graphite, AI tells by model, Sept and Oct 2026 (marketing firm; not peer reviewed): https://graphite.io/five-percent/research/ai-tells and https://graphite.io/research/ai-tells-opus-5-5-update
- Pew Research Center, how much of the web is written with AI, Aug 2026: https://www.pewresearch.org/data-labs/2026/08/20/how-much-of-the-internet-is-written-with-ai/
- Pangram, signs of AI writing and most common AI phrases: https://www.pangram.com/signs-of-ai-writing
- tropes.fyi, a directory of LLM writing tropes (one author's catalog): https://tropes.fyi/directory
- Colin Gorrie, rhetorical analysis of LLM prose: https://www.deadlanguagesociety.com/p/rhetorical-analysis-ai
- Hollis Robbins, how to tell if something is AI-written: https://hollisrobbinsanecdotal.substack.com/p/how-to-tell-if-something-is-ai-written
- Wendy Belcher, ten ways AI is changing student writing: https://wendybelcher.com/writing-advice/10-ways-ai-is-ruining-your-students-writing/
- Nathan Lambert, why AI writing is mid: https://www.interconnects.ai/p/why-ai-writing-is-mid
- Jill Walker Rettberg, genre glitches: https://jilltxt.net/genre-glitches-and-unexpected-promotional-phrases-as-a-sign-of-ai-writing/
- Search Engine Journal on the sermon rhythm of AI copy: https://www.searchenginejournal.com/and-the-truth-this-writing-style-screams-ai/555854/
- Optimizely, the case against tell lists that ignore substance: https://www.optimizely.com/field-notes/articles/in-defense-of-the-em-dash-and-everything-else-on-this-ai-tell-trial/
- Harry Dry, the three tests for a line of copy: https://gp.demandcurve.com/lessons/fundamental-rules-of-good-copy
- Raptive, the trust cost of suspected AI content (2025): https://raptive.com/blog/the-ai-stink-is-real-and-its-costing-brands/
- Jabarian and Imas on detector accuracy, via Chicago Booth Review: https://www.chicagobooth.edu/review/2025/december/do-ai-detectors-work-well-enough-trust
- FTC final rule on fake reviews and testimonials (Aug 2024): https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
- Anthropic's prompting guidance on mannered prose: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#writing-density
- Seen only through summaries or abstracts: Liang et al. 2023 on detector bias against non-native writers, the Washington Post's ChatGPT style analysis, The Economist and The Atlantic pieces on AI style (2026), Barron's count of "not X but Y" in filings.
