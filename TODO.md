# TODO

The source of truth for what's left. Read first every session; update in place.

**Format contract** (`tools/todo_archive.py` depends on it): top-level items are
`- [ ]` / `- [x]` lines directly under `## Open work`; `###` sub-headings may
group them; closed items are moved to `docs/TODO_archive.md` by the tool, which
leaves a one-line stub under `## Done`. An open item can be stale — reproduce the
symptom before acting on it.

## Open work

### Needs the owner

- [ ] **Answer the three Science 10 questions** at the end of SPEC_phase1.md §3: the valence-electrons rule for groups 13–18, the element order for molecular names, and a source for the data the set does not give (composition figures, NaCl energies, activity series, bond energies).
- [ ] **Confirm or replace the source for element names and mass numbers** (DATA_SHEET.md §2): the Chemistry 30 Data Booklet as chemistry_sim transcribed it, used by `buildatom`, `bohr` and `transfer`.
- [ ] **Supply the remaining course content**: the other Math 15 concept sets (the first one lists percent, exponent laws, algebra, polynomials, graphing, measurement, logic, statistics and probability as not yet covered), the detailed version of Science 10 Unit A sections 4–7, any further Science 10 units, and any formula or data sheet. Each concept set goes verbatim into `docs/CONCEPTS_<name>.md`, its sections into `site/js/catalog.js` as units, sheets into `docs/DATA_SHEET.md`.

### Before tutoring with it

- [ ] **Owner walkthrough and clean-up of every sim** (SPEC_phase1.md §5 criterion 5): defaults and a few other settings against a hand calculation, and whether the picture teaches what the concept set means. Done when each has a ✓ or a bug filed here. Math 15: `numberline` ☐ `signs` ☐ `bedmas` ☐ `fractionbars` ☐ `fractionarea` ☐ `placevalue` ☐ `decimalops` ☐ `longdivision` ☐. Science 10: `energyprofile` ☐ `buildatom` ☐ `bohr` ☐ `effectivepull` ☐ `transfer` ☐ `lattice` ☐ `dissolving` ☐ `ionicformula` ☐ `molecular` ☐
- [ ] **Science 10 sims still to build** (SPEC_phase1.md §3): `composition`, `ionenergy`, `reactiontypes` and `bondenergy` need data from the owner; `periodictable` needs the valence-rule answer; `balancing` and `ph` need the detailed version of sections 4 and 6 (or the owner's go-ahead to build from the outline).
- [ ] **Science 10 hooks only partly built**: no 3-D lattice (2.4), no ball-and-stick views (3.3, 3.4), no drag-and-drop for ions (3.1), no name → formula direction, nothing for 3.5 (diatomics and common names) or 2.6. Ask the owner which matter.
- [ ] **Math 15 concepts with no sim yet**: 3.3 ordering three or more fractions at once, 3.7 mixed numbers as input, 4.10 rounding (`model/decimals.js` `round` exists and is tested). Decide whether each is an option in an existing sim or its own page.
- [ ] `decimalops` shows no carrying or borrowing marks in the column, and `longdivision` shows the steps as a list, not as the long-division bracket layout. Ask the owner whether the hand layout matters.

### Tidy-ups from the setup

- [ ] **Decide the names the setup had to guess**, when the course content shows what fits: the site name ("Transition Sims"), the module folder `site/js/model/` (physics_sim has `physics/`, chemistry_sim `chem/`, stats-visualizations `stats/`), and the course ids `m15` / `s10`. They get more awkward to change with every sim.

## Done

Closed items moved out of `## Open work` live in **`docs/TODO_archive.md`** — one line each below, reasoning there.

- [x] **Repo set up from physics_sim's apparatus, with no sims (2026-10-01).**
- [x] **Math 15 review and Science 10 Unit A concept sets recorded verbatim, their sections added as catalog units (2026-10-01).**
- [x] **Browser check run on the server (playwright in `/tmp/pw`), 390 and 1280 px, light and dark (2026-10-02).**
- [x] **Colour code chosen: series-a / series-b for the inputs, `--c-result` for the answer (2026-10-02).**
- [x] **Eight Math 15 sims built as first versions (2026-10-02).**
- [x] **Nine Science 10 Unit A sims built as first versions (2026-10-02).**
- [x] **GitHub Pages enabled by the owner; PRs #1 and #2 merged; site live at https://peterfriedrich.github.io/transition-sim/ (2026-10-02).**
