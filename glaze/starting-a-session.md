# Starting a Cowork session

The opening message has one job: get the session reading the right files and
knowing which repo it is in. **It should stay short and stable.** Every sentence
of studio policy that creeps into the prompt is a sentence that will drift out of
sync with the documents, and then there are two answers to the same question.

---

## Attach the repos. That is the actual setup step.

**A Cowork task's authorized repo set is fixed when the task starts and cannot be
extended once it is running.** Attach a repo as a source at start and git works
with no token at all: clone, pull and push all just work.

Attach two:

1. **`glazedweb`**, so `glaze.md` and everything under `glaze/` can be read. If it
   is not attached, "read glaze.md" is an instruction pointing at a file that is
   not there, and the session will either guess or waste a turn asking.
2. **the client repo** being worked on.

Nothing below is a substitute for that. The token block exists because repos get
created after a task has already started, which is the situation it cannot be
fixed from.

---

## The prompt

Paste this, fill the two angle brackets, and delete the git block if the repos are
attached.

```text
Repos attached: glazedweb (the studio docs) and <client-repo> (the work).

Read glaze.md in the glazedweb repo first, then glaze/clients/<client>.md, then
whichever reference files glaze.md's table says apply. Run the ninety-second
derive in glaze.md before trusting anything the docs claim about current state.

Today: <what you want done>

Three things that are about me rather than about the docs: push finished work to
GitHub. Never ask me to paste a secret, I set environment variables in the Vercel
dashboard myself. And tell me what you could not verify, rather than leaving it
out.

Here's a GitHub PAT for hershock48/*: <PASTE TOKEN>. If the git proxy 403s, don't
try credential helpers or gh auth, it returns 403 not 401 so git never offers the
credential. Use git -c http.extraHeader="Authorization: Basic $(printf
'x-access-token:TOKEN' | base64 -w0)" push origin main, and redact the token from
any output.
```

### Why each line is there

**"Repos attached"** tells the session what it can reach before it tries. A
session that assumes the wrong thing spends its first turn discovering it.

**"Read glaze.md first"** is the whole point of the document existing. Naming the
client file second matters because that is where the decisions and the retired
lines are, and a retired line reintroduced is the most common way this work
embarrasses itself.

**"Run the ninety-second derive"** stops the docs being trusted for anything that
changes. The documents hold what a machine cannot find out; everything else gets
looked up.

**"Today"** is the only part that changes. Keep it one sentence if you can. The
docs carry the standards, so the request does not have to.

**The three personal lines** are the ones that are genuinely not in the documents
because they are about how you want to be worked with, not about how a site gets
built. Everything else, including the no-em-dashes rule, the American spelling and
the whole quality bar, is already in `glaze.md` and does not need repeating.

**The git block** stays last because it is machinery, not instruction.

---

## The short version

For a quick job on a repo that is already attached:

```text
Repos attached: glazedweb and <client-repo>. Read glaze.md and
glaze/clients/<client>.md first.

<what you want>
```

---

## Token hygiene

**Nothing in this repo should ever contain a real token, including this file.**
The placeholder above stays a placeholder.

A token pasted into a chat lives in that transcript for as long as the transcript
does. If one is going to be pasted repeatedly, it should be:

- **Fine-grained, not a classic `ghp_`.** A classic token with `repo` scope can
  touch everything the account owns. A fine-grained one can be scoped to only the
  repos in play, with **Contents: Read and write** and nothing else.
- **Short-lived.** Seven or thirty days.
- **Rotated** once the work it was issued for is done, and immediately if it has
  been used across a long session or pasted into more than one chat.

The reason to prefer attaching repos is not tidiness. It is that a token which is
never pasted cannot leak.
