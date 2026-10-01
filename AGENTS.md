# Working in this repo as an agent

One agent works in the Glazed Web repos: Claude, in Claude Code sessions. Kevin owns every decision. This file is the convention. The rules themselves live in the glaze kit in this repo.

Until 2026-10-01 a second agent, Codex (GPT), shared the work under a lane and cross-review arrangement. Kevin retired it so everything stays in one place. The records it left (the handoff inbox, the backlog's old owner tags, the dated review notes under `glaze/catalog/` and `glaze/research/`) are history and stay as written.

## Read first, every session

1. `glaze.md`, then `glaze/standards.md`. They govern copy and code in every hershock48 repo. No em dashes anywhere. American spelling. Write like a person: the tells are listed in standards.md.
2. `glaze/backlog.md`. The one backlog. Every open item has an owner: `(claude)` is yours, `(kevin)` waits on him. Check an item off only with the evidence the item names.
3. `glaze/catalog/` before building any tool, harness, form flow, checkout, auth scheme, admin surface or asset pipeline. Add the row in the same commit that builds one.
4. `glaze/clients/<client>.md` before touching that client's repo.

## Who does what

- **Claude does** the building, the reviewing, the prospecting and the writing: pitches, proposals, letters, client-facing copy, the studio site, the shared components and their client copies, workrooms and owner controls, kitchen, printer and payment code, the ledger and the dashboard, account economics.
- **Kevin owns** prices, agreements, anything a client sees before it is sent, and every merge to main.

If a task needs a fact only Kevin has, or a decision only Kevin can make, say so in the pull request and keep going on what does not depend on it. Do not guess the fact; mark it `PLACEHOLDER` per glaze.md.

## Branches and identity

- New branches are `claude/<topic>`. Never commit to main.
- One branch per task, from main, with a pull request to main. Do not stack a branch on another open branch; the September stack of thirty pull requests across twelve repos is the reason this rule exists.
- Every Claude commit ends with the Claude trailer. Kevin's hand commits carry none. That is how the two are told apart.
- Git author identity is the GitHub noreply address. `kevin@glazedweb.com` blocks Vercel deploys of private repos.
- Every pull request gets the automatic Claude review from the workflow in `.github/`. Address every HIGH and MEDIUM before asking Kevin to merge; answer the rest on the thread.

## Working tree etiquette

- A dirty working tree belongs to whoever is mid-task. Never stash, reset, checkout, or clean it. Commit only your own paths.
- Pull before push. Rebase or squash only an unpushed branch of your own; the component manifests pin commit SHAs and a rewritten SHA breaks every pin.
- Keep the reasoning comments. Do not minify code or strip file headers. Every glaze script carries a usage header at the top.
- The commit message names every behavior change in the diff, including cookie flags, rate limits, TLS and anything a client could notice.
- Assert before you write. A scripted edit to a doctrine file is checked by reading the result, not by trusting the regex.
- Push at the end of every verified change set. Work that was never pushed is the only thing a session can lose.

## When you disagree with a document

A failing test or a measured number settles it. If the doctrine is wrong, fix the doctrine in the same pull request and say what changed and why. Record a retracted rule as a retraction, not a deletion, so the next session does not re-derive it. If a rule is Kevin's to change (a price, a term, a client-facing claim), put the objection and the evidence in the pull request and leave the rule as it was.

## Facts

Facts live in one place; point at them, never copy them. Prices and payment status come from `lib/customOrders.js` on main, which Kevin edits. The dashboard in `glazedweb-admin` holds a reconciled copy that the digest and closing brief read, so after any price change run `../glazedweb-admin/scripts/reconcile-facts.mjs` and apply the plan; a stale copy is the failure that produced H3 on 2026-09-17.
