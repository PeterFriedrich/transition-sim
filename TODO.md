# TODO

The source of truth for what's left. Read first every session; update in place.

**Format contract** (`tools/todo_archive.py` depends on it): top-level items are
`- [ ]` / `- [x]` lines directly under `## Open work`; `###` sub-headings may
group them; closed items are moved to `docs/TODO_archive.md` by the tool, which
leaves a one-line stub under `## Done`. An open item can be stale — reproduce the
symptom before acting on it.

## Open work

### Needs the owner

- [ ] **Approve or edit the proposed sim lists** (SPEC_phase1.md §3: 8 for the Math 15 review, 16 for Science 10 Unit A) **and say which to build first.** Record the approval as a DECISIONS row; nothing gets built before it.
- [ ] **Answer the three Science 10 questions** at the end of SPEC_phase1.md §3: the valence-electrons rule for groups 13–18, the element order for molecular names, and a source for the data the set does not give (composition figures, NaCl energies, activity series, bond energies).
- [ ] **Supply the remaining course content**: the other Math 15 concept sets (the first one lists percent, exponent laws, algebra, polynomials, graphing, measurement, logic, statistics and probability as not yet covered), the detailed version of Science 10 Unit A sections 4–7, any further Science 10 units, and any formula or data sheet. Each concept set goes verbatim into `docs/CONCEPTS_<name>.md`, its sections into `site/js/catalog.js` as units, sheets into `docs/DATA_SHEET.md`.
- [ ] **Enable GitHub Pages**: repository Settings → Pages → Source: *GitHub Actions*. Until then `deploy.yml` fails on every push to `main` (the merge gate `tests.yml` is unaffected).

### Before the first sim

- [ ] **Run `npm run verify` and `npm run verify:built` once in a VM session** (390 and 1280 px, light and dark) and look at the home page screenshot. The server has no playwright, so the browser check has never run on this repo; the empty-catalog home page ("Coming soon." under each course) has only been checked by reading the code.
- [ ] **Decide the names the setup had to guess**, when the course content shows what fits: the site name ("Transition Sims"), the module folder `site/js/model/` (physics_sim has `physics/`, chemistry_sim `chem/`, stats-visualizations `stats/`), and the course ids `m15` / `s10`. All are cheap to change before the first sim and awkward after.
- [ ] **Pick the shared colour code** (ARCHITECTURE.md §5). The siblings' subject colour tokens were dropped; only `--c-danger` and the two series colours remain.

## Done

Closed items moved out of `## Open work` live in **`docs/TODO_archive.md`** — one line each below, reasoning there.

- [x] **Repo set up from physics_sim's apparatus, with no sims (2026-10-01).**
- [x] **Math 15 review and Science 10 Unit A concept sets recorded verbatim, their sections added as catalog units (2026-10-01).**
