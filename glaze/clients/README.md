# Client files

One file per client. **Durable facts only.**

## What belongs here

What a machine cannot find out by looking: what the business is, what was
decided and why, what was promised, what the client explicitly asked for or
refused, what is retired and must not come back, and the palette and assets they
gave us permission to use.

## What does not

**No live state.** Not whether it is deployed, not whether an env var is set, not
which bugs are open, not what the current build number is. All of that is wrong
within a day, and a document that is wrong is worse than one that is silent.

Derive live state at the start of a session instead, in about ninety seconds:

```bash
git remote -v                       # which repo am I actually in
git merge-base HEAD origin/main     # empty means unrelated histories, stop
cat package.json                    # Next version, Tailwind 3 or 4, scripts
cat .env.example                    # what this build needs, authoritatively
grep -rn PLACEHOLDER app lib components
```

Then check Vercel for the project's deployment state and domains.

## Format

Free-form prose is fine, but keep these headings so a session can skim:

- **What they are.** One or two lines.
- **Terms.** Price, what was quoted, anything unusual.
- **Decisions on file.** What was chosen, in their words where the wording matters.
- **Permissions.** Logo and photo use, in writing or not.
- **Palette and type.** The hexes and faces, lifted from their repo.
- **Retired.** Things that were shipped and pulled. This is the section that
  stops a retired line reappearing on a portfolio card a month later.
- **Open.** What is genuinely blocked, and on whose answer.

## The repos

| Client | Repo |
|---|---|
| Chism Chicken Ranch | `chism-chicken-ranch` |
| Copper Athletic Club | `copperac` |
| Super Duper | `superduperr` |
| Cookin' with Beans | `cookinwithbeans` |
| Sprinkles & Sparkles BB | `sprinklesandsparklesbb` |
| Cascarelli's of Homer | `cascarellis` |
| Louie's Bakery | `louies` |
| Griffin Claw Brewing | `griffin-claw-rebuild` |
| MI Gas | `migas` (not `mi-gas`) |
| Be A Number International | `beanumber` |
| Lemoncello Catering | `donna` |
| Camp Barber | `campbarber` |
| Shortstop Barber Shop | *not created yet* |
| Anchor Insurance (was Insurance for a Cause) | `anchor` |
| Pastrami Joe's | `pjs` |
| Schuler's Restaurant & Pub | `Schulers` |
| DeVine's Flowers & Botanicals | `devine` |
| True North Ice Cream | `truenorth` |
| The Stagecoach Inn | `stagecoach` |

`bangrants` is Kevin's and does not matter.

Four of those rows have no file here yet: pjs, Schulers, truenorth and
stagecoach carry their durable facts in their own READMEs, which is the wrong
place per this file's own rules. Writing their client files is open work.
