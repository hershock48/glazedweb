# Diocese of Kalamazoo (the parish platform)

**Repo** `hershock48/stmarymarshall` (the St. Mary repo, now a multi-parish platform) · **Prospect**, nothing sent · Pilot built 2026-11-02 ·
**Letter** kalamazoo.glazedweb.com · **Demos** stmarymarshall.glazedweb.com/demo, stphilip.glazedweb.com, sanfelipe.glazedweb.com · **Feed** kalamazoo.glazedweb.com/diocese/mass-times.json · all noindex.

## What they are

The Diocese of Kalamazoo, nine counties of southwest Michigan, Bishop Edward
M. Lohse (installed July 25, 2023). Pastoral Center at 215 N. Westnedge Ave,
Kalamazoo 49007, (269) 349-8714. Sixty parishes and missions in the Parish
Finder, 46 distinct websites, 41 of the 42 reachable ones eCatholic under a
diocesan partnership (ecatholic.com/kzoo). The audit of every home page is
`glaze/research/diokzoo-audit-2026-11.md` and its CSV.

## How this came about

St. Mary Marshall was rebuilt as a gift (`stmarymarshall.md`). On
2026-11-02 the office said the diocese pays for the website and would ask
someone there about it; Kevin said he could do all of them. Kevin's ruling
the same day: do not wait for the contract facts, build the work and a
proposal that pokes holes, and let that open the door.

## What is built

One deployment, parish per Host header. St. Mary (permission granted), St.
Philip Battle Creek and San Felipe de Jesús Fennville (both read off their
public eCatholic sites and feeds on 2026-11-01 without asking them; the
letter says so). San Felipe is in Spanish throughout: every platform word
lives in `lib/i18n.ts` in both languages and a parish picks one. A diocesan
feed joins every parish's Mass, Confession and Adoration times as one JSON
file, the thing the Parish Finder would read from the diocese instead of
from eCatholic.

Since the evening of 2026-11-02: each parish has its own palette
(`Parish.theme`, St. Philip wine and gold, San Felipe umber with Marian
blue and amber; `tools/palette-check.mjs` must clear every role); `/diocese`
on any host is the readable twin of the feed, every parish's address and
schedule on one page, which is what the letter's "The diocese on one page"
box opens (it used to open the raw JSON). It is read-only. The letter
never promises a management panel; an office panel for self-service edits
is the phase-two add-on the cost section says is quoted first.

The letter opens in the first person with the story (a parishioner whose
own parish site was the problem, now wanting to help the whole area, a
person inside the diocese rather than a template vendor), a "What the
monthly covers" table (hosting, security, backups, edits, checks, feed, a
person), four bar charts written by `tools/letter-charts.mjs` (missing
items on the 42 home pages, images per home page, Pew 2016 on how people
search, CARA 2023 on parish-website use), two stat tiles (Stanford 46%,
Google 53%) and a claim card from the 490-page inner crawl. The research
and the crawl are in the research note.

## Terms

Ruled by Kevin, 2026-11-02, after the market research
(`glaze/research/diokzoo-audit-2026-11.md` and the memory
parish-website-market-prices): **$99 a parish a month, no build fee for any
parish that moves under the diocesan agreement, a twelve-month first term on
that agreement, then month to month, thirty days' notice, no exit fee.** A
parish that comes alone pays the published build price. $4,158 a month for
the 42 with a site today. Anchors: eCatholic's own entry plan is $99; the
diocesan block most likely pays about $50 a site through the diocese
(Detroit, Pittsburgh and Boston all bill parishes that way), so the letter
never says "cheaper." The one action is glazedweb.com/schedule. The
agreement page needs a first-term clause before the letter is sent.

## Decisions on file

- **The pitch is to the Pastoral Center, not 41 pastors.** The deal is above
  them.
- **Ownership is the wedge**: the diocese holds the repository, hosting and
  data; "no hostage-taking" clause as on every agreement.
- **The feed has to exist from day one** or the Parish Finder goes dark one
  parish at a time; the format it consumes is the first thing to ask for.
- **Demo parishes set no `mailTo`**, so a form on a demo never reaches a real
  office that has not asked for it.
- **Giving never moves**: Vanco stays Vanco, OSV stays OSV.
- **Never say "cheaper."**

## Open

- Who holds the eCatholic agreement and when it ends (Stacie at St. Mary was
  asking).
- The Parish Finder's feed format.
- A Spanish-capable reviewer for San Felipe, Holy Angels and the two St.
  Josephs.
- Kevin's ruling on the price and on sending the letter.
- Parish-level letters for St. Philip and San Felipe do not exist; their
  pitch hosts serve the site at `/`.
- Data conflicts flagged in the repo README (St. Philip's Thursday and
  Friday Masses, a staff name, reconstructed emails; San Felipe's adoration
  time).
