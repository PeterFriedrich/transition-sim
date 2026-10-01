# TODO

The source of truth for what's left. Read first every session; update in place.

**Format contract** (`tools/todo_archive.py` depends on it): top-level items are
`- [ ]` / `- [x]` lines directly under `## Open work`; `###` sub-headings may
group them; closed items are moved to `docs/TODO_archive.md` by the tool, which
leaves a one-line stub under `## Done`. An open item can be stale — reproduce the
symptom before acting on it.

## Open work

### Needs the owner

- [ ] **Supply the course content for Math 15 and Science 10**: outcomes, formula sheets (and any data sheet), and the sim list. Nothing about either course has been written from memory. When it arrives: units go into `site/js/catalog.js`, the sheets into `docs/DATA_SHEET.md`, the sim list into `docs/SPEC_phase1.md` §3 with a DECISIONS row for the approval.
- [ ] **Enable GitHub Pages**: repository Settings → Pages → Source: *GitHub Actions*. Until then `deploy.yml` fails on every push to `main` (the merge gate `tests.yml` is unaffected).

### Before the first sim

- [ ] **Run `npm run verify` and `npm run verify:built` once in a VM session** (390 and 1280 px, light and dark) and look at the home page screenshot. The server has no playwright, so the browser check has never run on this repo; the empty-catalog home page ("Coming soon." under each course) has only been checked by reading the code.
- [ ] **Decide the names the setup had to guess**, when the course content shows what fits: the site name ("Transition Sims"), the module folder `site/js/model/` (physics_sim has `physics/`, chemistry_sim `chem/`, stats-visualizations `stats/`), the course ids `m15` / `s10`, and the home page's "Unit <id> · <title>" heading. All are cheap to change before the first sim and awkward after.
- [ ] **Pick the shared colour code** (ARCHITECTURE.md §5). The siblings' subject colour tokens were dropped; only `--c-danger` and the two series colours remain.

## Done

Closed items moved out of `## Open work` live in **`docs/TODO_archive.md`** — one line each below, reasoning there.

- [x] **Repo set up from physics_sim's apparatus, with no sims (2026-10-01).**
