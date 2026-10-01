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

---

## Carrying a session forward, and the two-agent setup

Added 2026-09-29, after Kevin asked what happens when a chat fills up and how to
move what was built into a new one.

**Nothing that matters lives in a chat.** A conversation is where the work is
asked for, not where it is kept. When a chat fills, its context is summarized and
it keeps going; when it ends, or when you start a fresh one, everything below is
still there because it is a file.

| What carries | Where it lives | Who reads it |
|---|---|---|
| Who Kevin is, what he has ruled, the traps of this machine | Claude's memory directory for this project | loaded into every Claude session in this folder |
| The standards, the bar, the process | `glaze.md` and the files its table names | both agents, every session |
| Lanes, branch prefixes, commit trailers, dirty-tree etiquette, the dispute rule | `AGENTS.md` in each repo, with `CLAUDE.md` pointing at it | both agents, every session |
| The inbox between the two agents | `glaze/handoff.md` | both agents, at session start |
| The work list, the owners, the merge order | `glaze/backlog.md` | both agents, and Kevin |
| Who found what, and whether it held | `contracts-private/reviews/` and its scorecard | whoever asks |
| Review on every pull request | the workflow in each repo, plus Codex's GitHub integration | runs with no chat open at all |

**What does not carry:** the text of the conversation, any background agent still
running when it ends, and anything on screen such as a local preview. Work that
was never pushed is the only thing genuinely at risk, which is why the rule is to
push at the end of every verified change set.

### Opening the next chat

Same opener as above, plus one line. The full version:

```text
Repos attached: glazedweb (the studio docs) and <client-repo> (the work).

Read glaze.md in the glazedweb repo first, then AGENTS.md, then
glaze/handoff.md and glaze/backlog.md, then glaze/clients/<client>.md. Run the
ninety-second derive in glaze.md before trusting anything the docs claim about
current state.

Today: <what you want done>
```

`AGENTS.md` and the two shared files are the only addition. They are what make a
new chat pick up the other agent's work instead of starting its own.

### The other agent

Claude and Codex are not connected to each other. They share four things and
nothing else: the rules in `AGENTS.md`, the inbox in `glaze/handoff.md`, the list
in `glaze/backlog.md`, and the pull requests on GitHub, where each reviews the
other before Kevin merges. A Claude session can also ask GPT a question directly
through `glaze/scripts/second.mjs`, which runs the Codex CLI on Kevin's ChatGPT
subscription. That is a phone call, not a link: one question, one answer, no
shared memory.

If one of them is out of usage, the other takes over from those files and writes
a note saying so. The rule is in the agent outage memory and in `AGENTS.md`.
