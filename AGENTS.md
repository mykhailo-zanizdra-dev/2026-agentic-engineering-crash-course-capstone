<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AgentFlow — Agent Instructions

## Persistent rules

- Before implementation, read `PRODUCT_BRIEF.md`, `TECH_STACK.md`, and the active OpenSpec specification. Commit the specification before AgentFlow feature code; the existing scaffold is the baseline.
- Implement only specified functionality. Resolve missing or conflicting requirements in the specification first, and carry approved requirements unchanged into handoffs.
- Keep one page at `/` and stay within the approved scope. Do not add backend/API routes, authentication, databases, AI APIs, external integrations, or other excluded features. Waitlist submission stays local without email persistence.
- Keep business logic outside large UI components where practical. Share the Zod validation schema between the form and its unit tests.
- Add tests for new logic. Include a regression test with bug fixes where practical.
- Do not modify, skip, or weaken tests merely to make verification pass. Explain legitimate test corrections against the specification.
- Run `pnpm check` before declaring work complete: typecheck → lint → Vitest unit tests → Playwright E2E tests. Report failures or unavailable checks honestly.
- Keep implementation minimal, use the approved stack, preserve unrelated work, and avoid unnecessary dependencies or agent infrastructure.
- Write project documentation and commit messages in English; preserve original course materials and third-party files in their source language. Documentation language does not determine UI language.

## Definition of Done

- The eight approved sections are present; layouts work at 375 px and 1440 px without horizontal overflow and have been visually inspected.
- The labeled, keyboard-accessible waitlist form handles empty/whitespace-only and invalid emails, valid-email success, and correction followed by resubmission. Submission is visibly identified as a demo.
- Unit tests and Chromium E2E tests at both widths cover the specified behavior. `pnpm check` passes and actual verification output is saved.
- An independent Checker has reviewed the implementation without fixing code during review; findings have fixes or documented resolutions.
- The capstone PR links specifications, review reports, verification runs, and relevant commits; distinguishes human and agent decisions; and includes a 1–2 minute video showing the product and workflow.
