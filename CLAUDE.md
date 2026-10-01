# Claude Instructions

## Project
A static web app of interactive simulations for tutoring the math and science transition basics: Alberta Math 15 and Science 10. It is a teaching aid: every readout must match what a student gets by hand with the course's own materials. It is deliberately not a general maths or science engine, not a course replacement, and has no backend or accounts. Sibling of `physics_sim`, `chemistry_sim` and `stats-visualizations`, whose apparatus it reuses — when in doubt about a shared helper or workflow rule, `physics_sim` (https://github.com/PeterFriedrich/physics_sim) is the reference implementation.

**State (2026-10-01): apparatus only, no sims.** The owner supplies the course content (outcomes, formula sheets, sim list). Until it arrives, do not fill in units, constants, formulas or a sim list from memory — `TODO.md` "Needs the owner" lists what is waiting.

## Key Files
- `TODO.md` — living backlog and **the source of truth for progress**. Read it first to know what to work on; update it in place as items open/close. Session summaries narrate *what happened*; TODO.md owns *what's left*. Never redo a closed item without asking — its `## Done` section lists every closed item in one line each. Conversely, an *open* item can be stale — reproduce the symptom before acting on it. **When an item closes, move its body to `docs/TODO_archive.md` and leave a `## Done` line** (`python3 tools/todo_archive.py` does it in bulk).
- `docs/DECISIONS.md` — append-only index of locked decisions: one row + pointer to the doc holding the full reasoning. **Add a row whenever a decision locks.** Check it before re-opening anything that feels "already settled".
- `docs/SPEC_phase1.md` — phase 1 (**the sim list is open, waiting on the owner**) and the acceptance criteria every sim must meet. Read before adding or changing a sim.
- `docs/DATA_SHEET.md` — where the owner's course materials (formula sheets, constants, notation) get transcribed. **Empty so far.** Once filled, check a constant or an "is it on the sheet?" question here first.
- `docs/ARCHITECTURE.md` — module contracts (model / lib / sims / catalog) and the sim page contract. Read before a new module or a change to a shared helper.
- `docs/TOKEN_EFFICIENCY.md` — context/token hygiene. Read before bulk-reading screenshots or summaries.
- `docs/AUDIT_LEDGER.md` — coverage map of executed audit runs. **Add a row when an audit executes; check it before scoping a new one.**
- `docs/REMOTE_VM.md` — **read FIRST in a Claude Code web/remote VM session**: network-policy constraints, environment setup.
- `session-summary/` — session handoff notes. Read the latest before starting work; older ones live in `session-summary/archive/` (don't bulk-read them).

## Token Efficiency
- **Screenshots are expensive.** `tools/verify-sims.js` writes one per page to `output/`; open only the sims you changed. See `docs/TOKEN_EFFICIENCY.md`.
- Read only the **latest** session summary; keep the 3 most recent at top level, archive older — enforced by `tests/loaded-path.test.js`.

## Session Management
- **At session start, check open GitHub issues** — nothing pushes these to a model. ⚠️ **A working guard on a channel nobody reads is the standing failure mode** — treat an unread report as a finding, not as background.
- Always run `/handoff` before `/clear` — never wipe context without a written record in `session-summary/`. The `SessionStart` and `SessionEnd` hooks run `scripts/handoff_gap.py`, which names the commits and uncommitted files that landed after the newest handoff was last committed, and **says nothing when nothing is owed**.
- Commit after each working unit with a descriptive message, rather than batching a session into one commit.
- **Pushing is normal — push proactively after committing, in every environment.**
- **Remote/cloud VM sessions: commit + push at every natural checkpoint.** The container is ephemeral; unpushed work is LOST when it is reclaimed. Quirks: `docs/REMOTE_VM.md`.
- **⚠️ The owner may merge PRs mid-session. Re-check before EVERY push to an existing branch.** Commits pushed after the PR merged land on a dead branch.
  - Enforced by `.githooks/pre-push`. **A fresh clone must enable it: `git config core.hooksPath .githooks`** (`./bootstrap.sh` does). It fails OPEN, so it can never be the reason work goes unsaved. Escape hatch: `git push --no-verify`.
  - After any merge, confirm the work landed: `git merge-base --is-ancestor <sha> origin/main`.
- **No scheduled PR check-ins** (owner, 2026-09-24, carried over from physics_sim): each one costs a full turn of usage. Subscribe to a PR's activity so CI failures and reviews still arrive, but never arm a `send_later` / trigger check-in for it.
- On the owner's server the system `python3` is 3.6 and the guards need ≥ 3.10: `./bootstrap.sh` picks a newer one; by hand use `python3.12 scripts/check_*.py` instead of `npm run check`.

## Code Style
- **A decision that protects a number is a test first, prose second.** Write the guard, then the `DECISIONS.md` row cites its ID (`test_x` — the string that opens a `test(...)` title). A row with nothing to cite is tagged `[unverifiable]`. `scripts/check_decisions_log.py` gates new rows on the merge path.
- **The maths and science live in `site/js/model/`, pure and DOM-free.** Sims only draw and wire controls; any number shown in a readout comes from a `model/` function that has a test. Rendering code contains no formulas beyond unit conversion.
- **Constants, formulas and notation come from the course materials** as transcribed in `docs/DATA_SHEET.md` — never a more precise outside value and never an inline literal. A value the materials do not give needs a DECISIONS row naming its source.
- **Closed-form over stepping or simulation** wherever a closed form exists, so readouts equal the hand method exactly.
- Units and sign conventions are stated in the model module's header comment, converted only at the display edge, and shown in the sim's UI where a student could get them backwards.
- Readouts go through `lib/format.js` so they are written the way students write them.
- No dependencies and no build step: ES modules served as-is. Adding one is a DECISIONS row.

## Comments & Scope
- Comments only where the *why* is non-obvious. Don't narrate what the code plainly does.
- Make the **smallest change that satisfies the request**. Don't refactor, rename, or reformat code you weren't asked to touch.
- No abstractions for a single use case — inline until there are 3+ call sites.
- Deleting obsolete code is valid and **preferred** over leaving it behind.
- **Propose the plan first** for: a new sim, a change to the sim page contract or a shared lib helper, or anything that changes CI or deployment. Routine edits don't need a proposal.
- These are scope rules, not verification rules. They do **not** relax the model tests, the guard scripts, or checking a changed sim in a real browser (`npm run verify`, then look at its screenshot).

## Verification
- `npm run check` — unit tests + doc-citation and decisions-log guards (what CI runs).
- `npm run verify:built` — the deploy build (cache-busted `_site/`) in the browser; also fails on any unversioned `.js`/`.css` request. Run it after touching `tools/build-site.js` or the HTML shells.
- `npm run verify` — every page in headless Chromium; fails on console errors, blank canvas, horizontal scroll. `VERIFY_WIDTHS=390,1280 VERIFY_THEME=dark` for phone and dark mode. Needs a global `playwright` (present in Claude Code web VMs, **not on the owner's server**). Look at the screenshot of anything you changed — "no errors" is not "looks right".
