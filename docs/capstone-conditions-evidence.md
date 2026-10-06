# Capstone conditions: verified status and evidence

Verified on 2026-10-06 by the Maker (Claude Code, Sonnet 5.5, session id `bd80afe6-9ef9-4882-9227-a4b868e5866b`) against HEAD `5dfa1e1ee561548941d96117d5766e03232ea14b`, branch `mykhailo-zanizdra`. All commands below were run fresh in this session, not copied from earlier reports. Saved outputs: `docs/runs/2026-10-06-conditions-*.txt`.

Sources of the conditions: `RUBRIC.md` (acceptance), `README.md` (submission steps, course material, not edited), `PRODUCT_BRIEF.md` and `AGENTS.md` (Definition of Done). Verdicts: **MET**, **PARTLY**, **NOT MET**, **NOT CLAIMED** (optional practice, deliberately not used), **UNKNOWN** (could not be read from here); a qualifier after MET ("with caveats", "as of HEAD") marks a limit stated in the same row. Anything only Mykhailo can supply is marked `TODO(Mykhailo)` and is not filled in here.

## 1. Fresh runs

| Command | Result | Output |
|---|---|---|
| `git status`, `git log` | tracked tree clean; HEAD equals `origin/mykhailo-zanizdra` (`5dfa1e1`), so nothing is left unpushed before this file | n/a |
| `pnpm check` (run 1) | **exit 1**: 1 failed, 57 passed. `[mobile-375] landing.spec.ts:107 FAQ marker rotates…`: `answerRendered` was `false` at the mid-animation sample | `docs/runs/2026-10-06-conditions-check-run1-fail.txt` |
| `pnpm check` (run 2) | exit 0: typecheck, lint, Vitest 15 passed, Playwright 58 passed (Chromium 375 px and 1440 px) | `docs/runs/2026-10-06-conditions-check-run2-pass.txt` |
| `pnpm check` (run 3, output not saved) | exit 0, 58 passed | n/a |
| `pnpm test:e2e` ×5 (output not saved) | 58 passed each time | n/a |
| `pnpm build` | exit 0, `/` static | `docs/runs/2026-10-06-conditions-build.txt` |
| `pnpm exec openspec validate --all --strict` | exit 0, 2 specs passed (two INFO notes about long requirement text); no active changes remain | `docs/runs/2026-10-06-conditions-openspec-validate.txt` |
| `pnpm hooks:selftest` | exit 0, 47 passed; **synthetic** payloads, not live activation | `docs/runs/2026-10-06-conditions-hooks-selftest.txt` |
| `pnpm agent:log` | exit 0, **live** log: 349 completed, 3 unmatched, 9 failed, 0 interrupted, across 10 Claude sessions | `docs/runs/2026-10-06-conditions-agent-log-summary.txt` |

**Finding from this verification (intermittent failure, cause unknown, not fixed here).** The FAQ test added in c231505 failed once: the first `pnpm check` of this session exited 1 on it. Afterwards 2 `pnpm check` runs (one saved) and 5 `pnpm test:e2e` runs (unsaved) passed. The assertion `p.checkVisibility()` immediately after two animation frames in `tests/e2e/landing.spec.ts:134-139` checks that the answer is rendered two animation frames after the click, which the spec requires (`docs/reviews/2026-10-05-polish-spec-review.md`). The intermittent `false` is either test timing or a real, intermittent spec violation at 375 px; it is not diagnosed. Per `AGENTS.md` the test was not modified to get green. Diagnosis needs Mykhailo's go; until then, "`pnpm check` is green" holds for 2 of the 3 `pnpm check` runs seen today, not for every run.

## 2. RUBRIC.md acceptance (the four things)

| # | Condition | Verdict | Proof and gap |
|---|---|---|---|
| 1 | A project exists and works, taken through the full cycle | **MET** | Eight-section page at `/` with a demo waitlist form; brief → AGENTS.md → OpenSpec → tests → code → `pnpm check` → Checker → fixes. Section 1 above; commits 18baac5 → b921515 → f86752a → d3eb114 → 3c05168; second cycle 2a44921 → e5b9ab7 → c231505 → 7521cb6. |
| 2 | Practices are named | **PARTLY** | Named in `docs/pr-description-draft.md`, but that draft predates the second change (`polish-waitlist-and-faq`): it cites 12 unit and 38 E2E tests (now 15 and 58), has no mention of the second cycle, and still has `TODO` fields. The text actually in PR #1 could not be read from this environment (no `gh` CLI), so what the PR says is unknown. |
| 3 | Every named practice has proof | **PARTLY** | Per practice, section 3. Weakest: live blocked action (none saved), loops (not claimed). |
| 4 | A 1–2 minute video, and the PR says what the human decided vs the agent | **NOT MET** | No video link anywhere in the repo: `TODO(Mykhailo)`. Human decisions in the repo are limited to the approvals in `PRODUCT_BRIEF.md`; the draft's own section is `TODO(Mykhailo)`. |

RUBRIC "returned for rework" traps: *practices without proof* (see section 3); *description written backwards, nothing went wrong* (mitigated by section 4 below and the "what went wrong" part of `docs/rubric-audit.md`); *no human decisions visible* (open, see section 5); *video over 2 minutes or without the agentic story* (not recorded yet).

## 3. Practice by practice

| Practice | Verdict | Proof | Gap |
|---|---|---|---|
| Context engineering, static | **MET** | `AGENTS.md` (project rules added in 61b2981 on top of the scaffold's generated block: spec-first, scope, `pnpm check`, protected env files), `CLAUDE.md`, `PRODUCT_BRIEF.md`, `TECH_STACK.md`, `openspec/config.yaml`. Rules that visibly worked: Checker findings cite them and the violations were fixed: `docs/reviews/2026-10-05-pnpm-check-setup-review.md` (tasks ticked without a saved run), `…-waitlist-validation-review.md`. | The repo has no commit "agent behaved differently after the rule changed"; the evidence is review findings. |
| Context engineering, dynamic (hooks) | **PARTLY** | **Live:** `pnpm agent:log` today shows 349 completed actions from 10 real sessions (file above); hooks `.claude/hooks/log-action.mjs`, `protect-env.mjs`; earlier live statement in `docs/reviews/2026-10-05-workflow-update-review.md`. **Synthetic, kept apart:** `pnpm hooks:selftest` (47 passed) and `docs/runs/2026-10-04-*.json`. Raw `.agent-log/actions.jsonl` stays git-ignored (`.gitignore:46`) and is not committed. | No saved example of a live **blocked** action; the 9 failed actions are failed commands, not guard denials. The summary also counts this verification session. |
| Loops | **NOT CLAIMED** | Only manual reruns after test bugs exist (`docs/runs/2026-10-05-*-check-fail.txt` → `…-pass.txt`, `…-polish-red*.txt` → `…-polish-green.txt`). They are manual, not a loop. | The PR must not claim loop engineering. |
| Verification | **MET, with caveats** | `pnpm check` (section 1). Unit tests `lib/waitlist.test.ts` share the Zod schema with the form. Red evidence for the second change: `docs/runs/2026-10-05-polish-red.txt` (3 unit and 10 E2E tests failing, 5 per width, before the code) and `…-polish-red2.txt` (current FAQ tests with the FAQ CSS removed fail), then `…-polish-green.txt` (full run, exit 0). First cycle: `…-waitlist-unit-red.txt` → `…-waitlist-unit-green.txt`. | Red→green is shown by saved run files, not by git history: tests and code share one commit (e5b9ab7, c231505). First-cycle pairs are not clean (tests rewritten after review, one truncated red file; see `docs/rubric-audit.md`). The flaky test above. No CI. |
| maker ≠ checker | **MET** | `.claude/agents/reviewer.md` (Opus, read-only). Reports in `docs/reviews/` (13 files). Findings that changed the work: spec review 1 P2 + 4 P3; four slice reviews 7 findings; workflow update 1 P3; final review 1 P3; RUBRIC audit 11 findings; second change: spec review 6 findings (2 P2: undefined animation duration, untested "no other animation"), implementation review 8 findings (3 P2: closing not tested, outdated red evidence, partial green file, plus 5 P3). Each report records its resolution. Earlier, Codex was Checker of the hooks work and returned "changes required" (`docs/reviews/2026-10-04-logging-hooks-review.md`); in `docs/reviews/2026-10-04-precommit-review.md` Codex was Maker and Claude Code Checker (1 P2, 3 P3). | Both roles are Claude Code (approved workflow, not a two-tool review). Several Checker invocation ids and all Maker session ids except two are unknown. The fixes after the second change's implementation review were not re-reviewed. |
| Spec first (SDD) | **MET** | OpenSpec change `agentflow-landing` committed in 18baac5, before any feature code (b921515 onward). Second change `polish-waitlist-and-faq` committed in 2a44921 before its code (e5b9ab7, c231505); it is the case of a spec changing because reality did not match: its MODIFIED requirements amend the archived specs (`openspec/specs/*`). Both changes archived (9f9b095, 7521cb6). | The scaffold (4666845) predates the spec; not claimed otherwise. Spec-review fixes in the first cycle landed before the first commit, so history does not show them. |
| Trust-level log | **NOT CLAIMED** | `templates/autonomy-log.md` untouched. | A log written now would be retroactive. |
| Project Factory | **NOT CLAIMED** | Not used. | n/a |

## 4. What went wrong (real, from saved evidence)

- Tasks 1.1–1.4 ticked with no saved run (`…-pnpm-check-setup-review.md`).
- Test bugs fixed by the Maker: regex typo, `alert` locator clash with the Next.js route announcer (`docs/runs/2026-10-05-*-check-fail.txt`).
- Live regions mounted with their text, possibly not announced (P2, fixed, not verified with a screen reader).
- Second change: the first spec wording ("short" animation, "no other animation") was untestable (Checker P2×2); the implementation review was returned as incomplete for evidence gaps; the assumption that `getAnimations()` exposes the `::details-content` transition was wrong (`docs/runs/2026-10-05-polish-getanimations-diagnostic.txt`).
- Today: the flaky FAQ test (section 1).
- History looks batch-committed: 18baac5 and 93d408e share the timestamp 16:45:02; e5b9ab7, c231505, 7521cb6 and 5dfa1e1 are within 3 seconds (23:25:33–23:25:36). `TODO(Mykhailo)`: say in the PR why.

## 5. What the human decided

In the repository: the product owner's approval of the brief, stack, scope and the 2026-10-05 workflow update (Claude Code fills both Maker and Checker; `PRODUCT_BRIEF.md`, `docs/reviews/2026-10-05-workflow-update-review.md`). Checkers only reported; the Maker wrote specs, tests, code and evidence.

Reported by the coordinating session from Mykhailo's messages, **not verifiable in the repo, Mykhailo to confirm and word in his own terms**: the second change came out of Mykhailo's own review of the page (error not clearing; FAQ without animation), and its spec was approved with a «далі»; the new dependencies for `pnpm check` were approved with a «go»; every thread waited for a «go»; Mykhailo pushes the branch personally (a push from this Mac returned 403). `TODO(Mykhailo)`: what you stopped, rolled back or decided differently.

## 6. Submission steps from README.md

| Step | Verdict | Proof |
|---|---|---|
| Fork the course repo | **MET** | `origin` is `mykhailo-zanizdra-dev/2026-agentic-engineering-crash-course-capstone`. |
| Project on its own branch; course root files untouched | **MET** | Branch `mykhailo-zanizdra`; `git diff cbee9be HEAD -- README.md RUBRIC.md .github templates` is empty. The project sits at the repo root, not in `submissions/<name>/` (README calls that only the most convenient layout). |
| Branch pushed | **MET (as of HEAD 5dfa1e1)** | `origin/mykhailo-zanizdra` equals HEAD. Commits made after this file (this evidence) are local until Mykhailo pushes. |
| PR open with the template filled | **UNKNOWN** | The coordinator reports PR #1 exists; this environment has no `gh`, so title and body were not read. Template fields: project and code location (branch `mykhailo-zanizdra`, root of the repo); name `TODO(Mykhailo)`; video link `TODO(Mykhailo)`; practices (draft is stale, section 2); tools and MCP; human vs agent `TODO(Mykhailo)`; verification (use section 1). |

## 7. Brief and AGENTS.md Definition of Done

| Item | Verdict | Proof |
|---|---|---|
| Eight sections in order; 375 px and 1440 px without horizontal overflow | **MET** | `tests/e2e/landing.spec.ts` (sections, `no horizontal overflow`), both Chromium projects green in run 2. |
| Labeled, keyboard-accessible form; empty, invalid, valid, correct-and-resubmit; demo note | **MET** | `tests/e2e/waitlist.spec.ts`, `lib/waitlist.test.ts` (run 2). |
| Visual inspection at both widths | **PARTLY** | Agent-viewed only: `docs/runs/2026-10-05-visual-inspection.md`, `…-polish-visual-inspection.md`, `docs/runs/screenshots/`. No human inspection recorded: `TODO(Mykhailo)`. |
| `pnpm check` passes and actual output saved | **MET, with the flaky caveat** | Section 1; `…-polish-green.txt`, `…-final-check.txt`. |
| Independent Checker, findings resolved | **MET** | Section 3, maker ≠ checker. |
| Spec committed before feature code; Conventional Commits | **MET** | Commit order above. |
| PR links specs, reviews, runs, commits; separates human and agent; video | **PARTLY** | Draft exists but is stale; video missing. |

## 8. Open items

1. Mykhailo: name, video link, own decisions, commit-timing explanation, human visual check (all `TODO(Mykhailo)`).
2. Refresh `docs/pr-description-draft.md` and `docs/rubric-audit.md` (stale counts, no second change, "nothing is pushed yet"); not edited here.
3. Decide whether to fix the flaky FAQ test (needs a go; touches tests).
4. Push this commit and update PR #1 (Mykhailo).
5. The video narration is in `docs/video-script.md` (written after this file; it states the gaps above).

Review of this file by an independent Checker: `docs/reviews/2026-10-06-capstone-conditions-review.md`.
