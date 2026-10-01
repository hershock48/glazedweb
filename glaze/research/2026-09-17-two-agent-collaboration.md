# Two agents, one repo: what connects Claude Code and Codex (researched 2026-09-17)

Asked by Kevin: is there a better way for Claude and Codex to talk than files in the repo, and is there a third AI or program worth adding. Researched by a Claude session with web search under the standing constraints: subscriptions only, no API keys, Windows 11, LM Studio on the RX 9070 XT, repos on GitHub, deploys on Vercel. Claims below are as of the dates on the sources; verify a tool against its current README before installing. Anything here that favors Claude as the reviewer was found by a Claude session, so read that part with that in mind.

## 1. Communication between the two agents

**Codex as an MCP server is gone.** OpenAI removed `codex mcp-server`; the replacement is `codex app-server`, a JSON-RPC protocol over stdio that the docs call experimental and unsupported for production. Community "Codex as MCP" wrappers survive only if they shell out to `codex exec`. Failure mode: silent breakage on Codex upgrades.

**The official bridge: openai/codex-plugin-cc.** OpenAI ships a Claude Code plugin (`/plugin marketplace add openai/codex-plugin-cc`) with `/codex:review`, `/codex:adversarial-review` (read-only), `/codex:rescue` (delegate a task) and `/codex:transfer` (hand the session to a persistent Codex thread). It drives the local Codex CLI, so the ChatGPT sign-in carries over. Caveats: an open Windows install failure (issue #113, April 2026) with no maintainer reply, and a README warning that review gates can loop and drain both quotas. This is the upgrade path for `glaze/scripts/second.mjs` if the Windows bug does not bite.

**Claude Code as a server for Codex.** `claude mcp serve` exposes Claude's tools over stdio and Codex can register it, but that exposes tools, not a conversation. The honest equivalent of second.mjs in the other direction is a `claude -p` wrapper. Both `claude -p` and `codex exec` draw on subscriptions today. Anthropic announced a separate Agent SDK credit for headless use in May 2026 and paused it on June 15, 2026; watch that page.

**Thread continuation.** `codex exec resume --last "next step"` or `resume <id>` continues a Codex thread non-interactively (`--json` events, `-o` final message); known gaps: resume always injects a user turn, and resuming an ephemeral session silently starts a new one. `claude -p --output-format json` returns a session id and `claude -p --resume <id>` continues it. A handoff can carry a thread id instead of re-pasting context.

**Push into a live session.** Claude Code channels (research preview) let an MCP server push events into a running session; preview-grade, Bun required, flags may change. Possible, not yet worth it.

**GitHub-native, on subscriptions.** Claude: `claude setup-token` mints a one-year OAuth token for Pro and Max; `anthropics/claude-code-action@v1` with `claude_code_oauth_token` runs `@claude` mentions and PR review on subscription quota. Anthropic's managed Code Review is Team and Enterprise only and bills per review; skip. Codex: `openai/codex-action@v1` needs an API key (subscription support requested, open since July 2026), but Codex cloud's GitHub integration (`@codex review`, an "Automatic reviews" toggle) is included on Plus and Pro with ChatGPT sign-in, private repos supported. Net: both agents can review every pull request with zero API spend; only Codex inside GitHub Actions is blocked.

**Orchestrators.** awslabs/cli-agent-orchestrator (needs tmux, so WSL only), qanh10x10/multiagents (zero stars, Unix paths), Enderfga/claw-orchestrator (no Windows docs). None is worth a two-person studio's Windows time over files plus pull requests.

## 2. A third AI or program

- **Gemini CLI / Jules.** Gemini CLI stopped serving free and AI Pro users on June 18, 2026; the Antigravity CLI replacement has a quota users report exhausting in a few requests. Jules (async pull-request agent) still has a free tier, about 15 tasks a day on an older model. The only zero-cost third model family; low volume, GitHub-only.
- **Cursor.** Hobby tier is limited; Bugbot is usage-billed per run. Adds nothing over two CLIs.
- **GitHub Copilot.** Free plan excludes PR review; since June 2026 review draws AI credits plus Actions minutes. Pro is $10 a month. Not worth it.
- **CodeRabbit.** Free only on public repos; private repos are $24 per user per month after a trial. Glazedweb repos are private.
- **Goose, Aider, OpenHands.** Harnesses, not models. Goose (Apache 2.0, native Windows, LM Studio provider) and Aider work with local models. On a 16 GB card the usable models are 14B-class; open models scored 53 to 72 percent on a 2026 vulnerability-detection study against 89 to 96 percent for commercial models.
- **Local reviewer.** PR-Agent (MIT, community-owned since April 2026) runs against LM Studio's OpenAI-compatible endpoint. Lint-grade, pre-push only; hosted runners cannot reach localhost.

**Verdict:** nothing worth adding now. Deterministic gates (tests, audit.mjs, width-check, axe) are the cheaper third reviewer. Revisit Jules only if a free third vote is wanted.

## 3. Evidence on multi-model review

Self-review is weak: intrinsic self-correction does not improve reasoning and sometimes degrades it (Huang et al., ICLR 2024); self-repair is bottlenecked by the model's ability to critique its own code, and a stronger reviewer produces much larger gains (Olausson et al., ICLR 2024). OpenAI's CriticGPT (2024) showed trained critics beat baseline critiques on 63 percent of natural bugs. On these two vendors specifically, Xiang et al. (arXiv 2607.21656, July 2026, 116 LiveCodeBench tasks): Claude Opus 4.7 reviewing GPT-5.5 Codex raised pass rate from 71.6 to 89.7 percent against 84.5 for Codex self-review; Codex reviewing Claude dropped it from 91.4 to 82.8 percent because the Codex reviewer rewrote working code. Zietsman (arXiv 2603.25773, March 2026) argues same-family pipelines echo rather than cancel correlated errors and that executable checks must gate before AI review. Small studies, single-file tasks; the direction (strong reviewer, comment-only, different family, tests first) is consistent, and it matches how second.mjs was built (GPT comments, never rewrites).

## Recommendation

Move cross-review from handoff.md to pull requests, on subscriptions: turn on Codex cloud "Automatic reviews" for the hershock48 repos, run `claude setup-token`, and add the claude-code-action review workflow with the OAuth token, so every pull request gets both opinions where Kevin already merges. Default direction: Codex writes, Claude reviews; when Codex reviews, read-only. Install codex-plugin-cc locally as the complement, and keep second.mjs as the fallback if the Windows bug hits. Keep handoff.md for disputes and handoffs; it stops being the review channel.

## Sources

- https://learn.chatgpt.com/docs/mcp-server
- https://learn.chatgpt.com/docs/app-server
- https://github.com/openai/codex-plugin-cc
- https://github.com/openai/codex-plugin-cc/issues/113
- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/headless
- https://learn.chatgpt.com/docs/non-interactive-mode
- https://github.com/openai/codex/issues/24016
- https://code.claude.com/docs/en/channels
- https://code.claude.com/docs/en/github-actions
- https://code.claude.com/docs/en/authentication
- https://code.claude.com/docs/en/code-review
- https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan
- https://learn.chatgpt.com/docs/github-action
- https://github.com/openai/codex/issues/34425
- https://learn.chatgpt.com/docs/pricing
- https://learn.chatgpt.com/docs/third-party/github
- https://github.com/awslabs/cli-agent-orchestrator
- https://github.com/qanh10x10/multiagents
- https://github.com/Enderfga/claw-orchestrator
- https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/
- https://hackup.ai/ai-plans/jules/
- https://cursor.com/blog/may-2026-bugbot-changes
- https://github.blog/changelog/2026-04-27-github-copilot-code-review-will-start-consuming-github-actions-minutes-on-june-1-2026/
- https://www.coderabbit.ai/pricing
- https://goose-docs.ai/docs/getting-started/providers/
- https://github.com/The-PR-Agent/pr-agent
- https://arxiv.org/abs/2310.01798
- https://arxiv.org/abs/2306.09896
- https://openai.com/index/finding-gpt4s-mistakes-with-gpt-4/
- https://arxiv.org/html/2607.21656v1
- https://arxiv.org/abs/2603.25773
