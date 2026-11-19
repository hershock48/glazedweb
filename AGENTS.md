# Working in this repo as an agent

Claude works in the Glazed Web repos, in Claude Code sessions. Kevin owns every decision. This file is the convention; the rules themselves live in the glaze kit in this repo.

Codex worked here too until 9 Nov 2026, when Kevin retired it ("we're not using codex anymore"). Its branches and handoff entries are history, not instructions. Nothing waits for a second agent's review.

## Read first, every session

1. `glaze.md`, then `glaze/standards.md`. They govern copy and code in every hershock48 repo. No em dashes anywhere. American spelling. Write like a person: the tells are listed in standards.md.
2. `glaze/backlog.md`. The one backlog. An item still marked (codex) has no owner now; it waits for Kevin to say it still matters.
3. `glaze/catalog/` before building any tool, harness, form flow, checkout, auth scheme, admin surface or asset pipeline. Add the row in the same commit that builds one.

Read this file and those from `origin/main` (`git show origin/main:AGENTS.md`) when the checkout is on another branch. A branch can carry an older copy. On 9 Nov 2026 one did: it still said merges wait for the other agent, weeks after Kevin had ruled otherwise.

`glaze/handoff.md` is the record of the two-agent period. Read it for the history of an old branch, never as an inbox.

## Who decides

Kevin owns prices, agreements, and anything a client sees before it is sent. He does not want to be the gate on merges (ruling, 2026-10-01, below).

## Branches and merging

- New branches are `claude/<topic>`. Never commit to main.
- Every commit message ends with the Claude co-author trailer. Kevin's hand commits carry none, which is how his are told apart.
- Git author identity is the GitHub noreply address. `kevin@glazedweb.com` blocks Vercel deploys of private repos.
- Merge your own pull request to main once the house checks have passed and the pull request body records what was measured (the auditor at both widths, the width check, the performance numbers, and anything over a line said plainly). Kevin's ruling, 2026-10-01: "I don't understand why we have started doing this new thing where we don't merge our work and I have to manually tell you to merge." Merge commits, never squash or rebase, because the component manifests pin SHAs.
- If the session's permissions refuse the merge, do not route around the refusal. List the pull requests that are ready, say what refused them, and keep working.
- Kevin can say "hold" on any pull request, and that one waits for him. Anything a client will see before it is sent (a letter, a price, an agreement) is shown to him in the session before it goes out, merged or not.

## Working tree etiquette

- A dirty working tree belongs to whoever is mid-task, and that can be another Claude session. Never stash, reset, checkout, or clean it. Commit only your own paths. When the checkout is busy, work in a `git worktree` off `origin/main`.
- Pull before push. Rebase or squash only an unpushed branch of your own; the component manifests pin commit SHAs and a rewritten SHA breaks every pin.
- Keep the reasoning comments. Do not minify code or strip file headers. Every glaze script carries a usage header at the top.
- The commit message names every behavior change in the diff, including cookie flags, rate limits, TLS and anything a client could notice.
- Assert before you write. A scripted edit to a doctrine file is checked by reading the result, not by trusting the regex.

## Facts

Facts live in one place; point at them, never copy them. Prices and payment status come from `lib/customOrders.js` on main, which Kevin edits. Kevin sets prices in that registry. The dashboard holds a reconciled copy that the digest and closing brief read, so after any price change run `../glazedweb-admin/scripts/reconcile-facts.mjs` and apply the plan; a stale copy is the failure that produced H3 on 2026-09-17.
