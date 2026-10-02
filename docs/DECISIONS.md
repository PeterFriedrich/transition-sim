# Decisions Index

Append-only. **One ROW per locked decision** — when, what, why (including what
was rejected), and a pointer to where the argument lives in full. When a decision
locks, add a row; when one is superseded, strike it (`~~...~~`) or mark it
`SUPERSEDED <date>` in place and add the successor — don't delete history.

**What a row owes you:**

1. ⚠️ **EVERY ROW CARRIES A POINTER TO A DOC** — not only to code. Code moves;
   the argument has to live somewhere prose can hold it.
   `scripts/check_doc_citations.py` checks that every pointer resolves.
2. **The row is a self-contained summary** and may paraphrase the argument.
3. **The pointer is the authority.** When a row and its target disagree, the
   target wins and the row gets fixed.
4. **A row names the test that protects it** (`test_x`, the ID opening a
   `test(...)` title in `tests/*.test.js`; `verify-x.js`; `check_x.py`), or
   carries `[unverifiable]`. `scripts/check_decisions_log.py` enforces this on
   the merge gate (and that a superseded row is marked where it stands).

| When | Decision | Full reasoning |
|------|----------|----------------|
| 2026-10-01 | **Same apparatus as physics_sim**: static site, ES modules, no build step and no npm dependencies; offline merge gate (node:test + stdlib Python guards); GitHub Pages deploy with content-hash cache busting; the pre-push merged-branch guard. Copied rather than shared (a template or package), because the sibling sites diverge in their lib helpers and a shared dependency would add a toolchain. Protected by `test_catalog_every_sim_module_exports_page_contract`, `test_build_site_every_module_is_in_the_import_map_with_its_content_hash`, `test_at_most_three_handoffs_at_top_level`. | ARCHITECTURE.md §1 |
| 2026-10-01 | **Every on-screen number traces to a tested function in `site/js/model/`**; sim modules only wire controls and draw. No mechanical check that a sim does not compute a readout inline — review catches it. [unverifiable] | ARCHITECTURE.md §2 |
| 2026-10-01 | **Set up with no sims and nothing about the courses written from memory** (owner's instruction, relayed by the `server` session): no units in the catalog, no constants or formulas, no sim list. The owner supplies outcomes, formula sheets and the sim list; they are transcribed with their sources. Rejected: a seed sim as chemistry_sim had, and unit titles from recall. [unverifiable] | SPEC_phase1.md §3 |
| 2026-10-01 | **Course content is the owner's concept sets, kept verbatim in `docs/CONCEPTS_*.md`**; a mistake in one is fixed only on the owner's say-so. Catalog units are a concept set's sections with ids from the section numbers (`catalog.js` header comment), and sims cite concept IDs (3.4). A sim's tests use that concept's worked examples and quick-check answers. First sets: the Math 15 review (integers, BEDMAS, fractions, decimals) and Science 10 Unit A (Energy and Matter in Chemical Change). Where a set gives a viz hook, the hook is the sim's description. Rejected: paraphrasing the set into the spec, which would drift from what the owner tutors with. [unverifiable] | SPEC_phase1.md §3 |
| 2026-10-02 | **Build first versions of every sim that does not wait on an open question; the owner cleans them up afterward** (owner's call, replacing "approve the list first"). So a sim on the site is a first version until TODO.md's walkthrough item ticks it. Math 15: all eight. Their numbers come from `site/js/model/` with the concept set's worked examples and quick checks as tests. Protected by `test_bedmas_worked_example_2_2_line_by_line`, `test_fractions_add_and_subtract_over_the_lcm`, `test_decimals_long_division_terminating_and_repeating`, `test_integers_subtracting_is_adding_the_opposite`. | SPEC_phase1.md §3 |
| 2026-10-02 | **Decimals are held as a whole number plus a count of decimal places, never as floats** (`model/decimals.js`), which is the concept set's own method and keeps 0.1 + 0.2 = 0.3 exact. Inputs are limited to 4 digits each side of the point so products stay exact. The BEDMAS stepper works in floats and rounds each step to 10 places. Protected by `test_decimals_add_and_subtract_lined_up`, `test_bedmas_with_integers`. | ARCHITECTURE.md §7 |
| 2026-10-02 | **Colour code: the two starting numbers are `series-a` and `series-b`, the answer is `--c-result` (green)**, on every page. Chosen with the first sims; the accent blue was too close to `series-a` to mark an answer. [unverifiable] | ARCHITECTURE.md §5 |
