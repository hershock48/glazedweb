# Done, and getting to live

Two lists. The first is what "done" means and it is not negotiable. The second is
the order of operations for standing a site up.

**Copy the checklist below into the client's README** as unchecked boxes, and work
it to zero. It is the handover artifact, not a private note.

---

## What done means

None of these is a judgment call.

### Correctness

- [ ] Zero accessibility violations from the auditor at 390px and 1440px on every route.
- [ ] Zero console errors, zero 4xx, on every route.
- [ ] `grep -rn PLACEHOLDER` returns nothing, or every hit is on this checklist.
- [ ] Every form actually submitted, and the message confirmed arriving in a real inbox.
- [ ] Any remote data source verified on the deployment, not locally.
- [ ] Every heading, button and body run measured for contrast, not glanced at.

### The visitor's experience

- [ ] Checked at 320, 390, 768 and 1440 wide. 320 is the one that breaks.
- [ ] Reduced motion produces a complete page, not an empty one.
- [ ] With JavaScript off, every form still submits and every nav link still works.
- [ ] Keyboard: focus visible on every interactive element, skip link first in tab order.
- [ ] Largest Contentful Paint under 2.5s and Cumulative Layout Shift under 0.1 on
      a throttled mobile profile. Total JavaScript under 150KB compressed.

### Search and sharing

- [ ] Every route has its own title and meta description. No route inherits a generic one.
- [ ] `og:image` is an absolute URL on an origin that serves it, and it resolves. See `link-cards.md`.
- [ ] Canonical URL points at the client's real domain, never at a `.vercel.app` host.
- [ ] `LocalBusiness` structured data, with hours and address, on the homepage.
- [ ] `sitemap.xml` and `robots.txt` present, and the demo or preview host is `noindex`.

### Security and handover

- [ ] HTTPS enforced, no redirect that drops to HTTP.
- [ ] `npm audit` reviewed, and any remaining advisory named in the README with a reason.
- [ ] No secret in the repo, in a commit, in a README, or in any file here.
- [ ] Studio credit placed, plate ground computed, and the client told it is there.
- [ ] README written: what it is, how to run it, where content lives, every trap
      named, decisions with reasoning, and this checklist with nothing unticked.

**Support target.** Current Chrome, Safari, Firefox and Edge, plus iOS Safari and
Chrome on Android. Real iOS Safari behaves differently from a headless WebKit and
has produced bugs no local check caught, so anything visually unusual needs a real
device before it ships.

**Accessibility target.** WCAG 2.1 AA, measured with the auditor.

---

## Zero to live, in order

1. **Pick the repo name and verify it exists before pushing anything to it.**
   Probing the wrong name returns "Repository not found," which reads like a
   permissions problem and is not.
2. **Create the repo on GitHub first**, empty is fine, then clone it. Do not build
   first and graft later.
3. **Create exactly one Vercel project per repo.** Duplicated imports have
   happened and produce two projects racing on one repo.
4. **Decide the canonical host**, `www` or apex, and set it in the constant file.
   It must be the client's real domain, never the `.vercel.app` one.
5. **`noindex` the preview and pitch hosts.**
6. **Set environment variables in the Vercel dashboard.** Kevin does this. Never
   ask for a paste, never write one into a file. Each repo carries a
   `.env.example` listing exactly what it needs, and that file is the authority.
7. **Run the plate script and place the studio credit.** See `brand.md`.
8. **Run the auditor at both widths on every route.**
9. **Work the checklist above to zero.**

**If you inherit a working copy that was never a clone of the target repo:** run
`git merge-base HEAD origin/main`. Empty output means the histories are unrelated
and `--force` would replace the client's whole site. The fix is
`git merge --allow-unrelated-histories`. Expect `README.md` as the only conflict,
keep ours, and rename `master` to `main` to match the account.

---

## Before you say a fix is deployed

The last step is the one people skip, and it is the only one that proves the
visitor sees it.

1. `git remote -v`, and `git merge-base HEAD origin/main` is non-empty.
2. `git ls-remote origin <branch>` matches your local SHA.
3. The deployment for that SHA reports READY.
4. **Fetch the deployed URL and confirm the change is in the response.**

A green build proves syntax and types and nothing else. Not which repo, not which
data, not what rendered.

---

## Offboarding

Written down it is a selling point. Unwritten it is an obligation nobody can
execute under time pressure.

1. Transfer the GitHub repo to the client's account, or hand over a full clone.
2. Transfer the Vercel project, or disconnect it and let them import the repo.
3. Unlock and transfer the domain, and hand over DNS.
4. Hand over any Stripe or Square connection, and the sending mailbox if we set one up.
5. Remove the studio credit. It is one line.
6. Send the READMEs and this checklist in whatever state it is in.
