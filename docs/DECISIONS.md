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
