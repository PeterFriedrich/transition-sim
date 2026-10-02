# transition-sim

Interactive simulations for tutoring the math and science transition basics:
**Alberta Math 15 and Science 10**. Each sim will show the concept, let the
student change the variables, and print readouts worked out the way the student
does it by hand, so the numbers match a hand calculation.

| Course | Unit | Simulations |
|---|---|---|
| Math 15 | Integers | Integers on the number line; signs in multiplying and dividing |
| | BEDMAS | Order of operations, step by step |
| | Fractions | Fraction bars (compare, add, subtract); multiplying and dividing fractions |
| | Decimals | Place value; decimal arithmetic; fraction to decimal by long division |

These are **first versions**, built from the owner's concept sets in
`docs/CONCEPTS_*.md` and not yet walked through by the owner. Science 10 Unit A
is next (`docs/SPEC_phase1.md` §3). See `TODO.md` for what is waiting.

**Live site (once Pages is enabled):** https://peterfriedrich.github.io/transition-sim/

## Run it

No install and no build step: plain HTML, CSS and ES modules.

```bash
./bootstrap.sh     # enables the git hooks, runs the tests
npm run serve      # http://localhost:8000
```

(Opening `site/index.html` straight from disk does not work: browsers block ES
modules on `file://`.)

## Check it

```bash
npm run check      # unit tests + doc guards (the CI merge gate)
npm run verify     # every page in headless Chromium; screenshots in output/
VERIFY_WIDTHS=390,1280 VERIFY_THEME=dark npm run verify
```

## Deploy

`.github/workflows/deploy.yml` builds `site/` with `tools/build-site.js`,
which cache-busts every asset, and publishes it to GitHub Pages on every push
to `main` after re-running the tests (Pages source: **GitHub Actions**).

## Working on it

A sibling of [physics_sim](https://github.com/PeterFriedrich/physics_sim),
[chemistry_sim](https://github.com/PeterFriedrich/chemistry_sim) and
[stats-visualizations](https://github.com/PeterFriedrich/stats-visualizations),
with the same workflow from
[cc-data-project-template](https://github.com/PeterFriedrich/cc-data-project-template):
spec → architecture → one module at a time with tests, a decisions log whose
rows cite tests, `/handoff` notes between sessions, and a pre-push hook that
refuses to push to an already-merged branch. Start with `CLAUDE.md`,
`CONTRIBUTING.md` and `TODO.md`.

Not affiliated with Alberta Education.
