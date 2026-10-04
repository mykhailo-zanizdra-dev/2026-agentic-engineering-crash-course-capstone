# Local agent event log

Claude Code and Codex have separate registrations in `.claude/settings.json` and `.codex/hooks.json`. Their small adapters call `scripts/log-agent-action.mjs`. The adapters anchor the destination to their repository location, even when a session or tool starts in a subdirectory.

## Recorded data

Each supported tool event appends one schema-versioned JSON line to `.agent-log/actions.jsonl`: timestamp, agent, full session ID, tool-call ID, original event name, tool name, outcome, exit code when known, optional duration, and repository-relative file paths. Known verification commands have a fixed label; other shell commands are labeled `shell`.

Raw commands, patches, tool output, prompts, error text, search patterns, and URLs are not recorded. This avoids copying credentials or private content from those fields into Git. Live logs and generated summaries are ignored. Copy only reviewed evidence to `docs/runs/` for the capstone; never pass synthetic fixture records off as live agent activity.

- Claude: `PreToolUse`, `PostToolUse`, and `PostToolUseFailure`.
- Codex: `PreToolUse` and `PostToolUse`; a post event does not automatically mean success. Recognized result metadata supplies the exit code; otherwise the outcome is `unknown`.
- Records are correlated by agent + full session ID + tool-call ID.
- A pre event without a terminal event is `unmatched`, not automatically blocked. Tool hooks do not constitute a complete audit trail of all agent activity.
- Logger errors produce a visible diagnostic and exit 1, without returning a policy denial. The summary exits nonzero for unreadable logs or malformed records. Old-format records require explicit conversion; their missing identity is never invented.

## Commands

- `pnpm hooks:selftest`: validate both registrations, check log-directory writability, and run isolated synthetic regression tests, including concurrent writes. It does not prove client activation or trust.
- `pnpm agent:log`: summarize the local live log. It reports an error if no log exists yet.

The application-level `pnpm check` (typecheck, lint, Vitest, Playwright) remains part of the upcoming OpenSpec implementation. A hook self-test is not a substitute for it.

## Activate and verify locally

1. Open a fresh Claude Code session in the actual repository. Use `/hooks` to inspect the three configured logger events.
2. Open a fresh local Codex session in the same repository. Use `/hooks` to review and trust the current hook definitions. Project-local hooks require a trusted project. Do not change user-level trust files from a script.
3. In each client, ask it to run the harmless commands `node -e "process.exit(0)"` and `node -e "process.exit(7)"`, then run `pnpm agent:log`. Verify each client's pre/post records, full session identity, and success/failure outcomes. No product file needs to be edited.
4. If an outcome is `unknown`, inspect a sanitized sample of that client's hook payload and add a regression case before claiming support for that payload shape.
5. Save the actual results and client versions in `docs/runs/`. Synthetic tests, successful live activation, and independent review are separate evidence.

Current live activation is **not yet verified**. The installed Codex CLI failed during review; the desktop runtime was not tested. These registrations target supported local runtimes, not cloud-orchestrated chats. No hooks read `transcript_path`, user-level configuration, or private agent directories.

The logger does not rewrite tool input and is not a secrets-access enforcement hook. Follow AGENTS.md boundaries; permission rules and actual client enforcement are distinct from logging.

References: [Claude hooks](https://code.claude.com/docs/en/hooks), [Codex hooks](https://learn.chatgpt.com/docs/hooks).
