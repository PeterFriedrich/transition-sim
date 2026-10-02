# Architecture

Carried over from physics_sim (the reference implementation), with the
subject-specific parts removed.

## 1. Shape

A static site with no build step and no dependencies. ES modules are served
as-is from `site/`, so GitHub Pages (or any static host) can publish the folder
directly, and tests import the same files the browser runs.

```
site/
├── index.html            home: renders the catalog
├── sim.html              one page for every sim: ?id=<catalog id>
├── css/style.css         tokens (light + dark), layout
└── js/
    ├── catalog.js        courses, units, sims — the single list
    ├── home.js           home page renderer
    ├── sim-page.js       loads js/sims/<id>.js into sim.html
    ├── model/            pure functions, no DOM   ← tested
    ├── lib/              canvas, controls, clock, format, atomdraw (Bohr diagrams)
    └── sims/             one module per simulation: UI + drawing only
tests/                    node:test — model, format, catalog, repo invariants
tools/                    serve.js (dev server), verify-sims.js (browser smoke test)
scripts/                  Python guards from the workflow template (stdlib only)
```

The apparatus was copied from physics_sim rather than shared as a package or
template, as chemistry_sim and stats-visualizations did: the sites diverge in
their lib helpers, and a shared dependency would add a toolchain.

## 2. Layers and what each may do

| Layer | May | May not |
|---|---|---|
| `model/` | maths, constants | touch the DOM, format numbers, know about pixels |
| `lib/` | DOM, canvas, formatting | contain course formulas |
| `sims/` | wire controls → model → drawing | compute a readout without a model function |
| `catalog.js` | list sims and units | import sim modules |

The rule that matters: **a number on screen traces to a tested model
function.** Rendering code can be wrong-looking; it cannot be wrong-valued.

`model/` is this site's name for what physics_sim calls `physics/`,
chemistry_sim `chem/` and stats-visualizations `stats/`. It was chosen at setup
because the site spans a mathematics and a science course; it is open to
change before the first sim (`TODO.md`).

## 3. The sim page contract

`sim-page.js` imports `js/sims/<id>.js` and expects:

- `equations`: `[{ html, what }]` — shown under "Key equations".
- `prompts`: `[html]` — shown under "Try this" (at least three).
- `legend` (optional): `[{ color, label }]`, `color` naming a `--c-*` token.
- `tallOnMobile` (optional): `true` gives the canvas a portrait aspect on phones
  for sims that stack two views.
- `mount(ui)`: builds the sim into `ui = { canvas, controls, readouts, transport }`.

Each sim module opens with a comment naming the concept IDs it serves.

`tests/catalog.test.js` checks every catalog entry against this contract, and
that no module in `sims/` is missing from the catalog.

A catalog entry is `{ id, course, unit, title, summary, concepts }`. A unit is a
section of one of the owner's concept sets (`docs/CONCEPTS_*.md`), with
an id from its section number (`catalog.js` header comment). The home page lists each course's units by title and
shows "Coming soon." for a unit with no sims, or for a course with no units yet. stats-visualizations
added an `also` field for a sim listed under two courses; port it from there if
a sim here serves both Math 15 and Science 10.

## 4. Time and drawing

`lib/clock.js` runs one `requestAnimationFrame` loop per page. Simulated time
advances only while playing (times the speed setting); the frame callback runs
every frame regardless, so a paused sim still redraws when a slider moves. The
next frame is scheduled before the callback runs, so a callback that throws does
not freeze the page (the fix chemistry_sim and stats-visualizations carry).
Sims read control values each frame rather than keeping derived state, except
where a change must restart the run (`onChange` → reset).

Positions and values come from closed-form expressions wherever one exists, so
readouts equal the hand method with no step drift.

## 5. Theming

Colours are CSS custom properties on `:root`, redefined for dark mode.
`lib/canvas.js` `theme()` reads the ones named in its `TOKENS` list so canvas
drawing follows the page theme.

The siblings each have a subject colour code shared by all their sims (in
physics_sim a velocity is always the same blue). Those tokens were not copied.
This site's code: the two numbers a student starts with are `series-a` (blue)
and `series-b` (orange), and the answer is `--c-result` (green). `--c-danger`
is for errors. For science, positive charge is `--c-cation`, negative charge
`--c-anion` and electrons `--c-electron`, with chemistry_sim's values so the
two sites agree. A new token goes in three places in `style.css` (light, and both
dark blocks) and in `TOKENS`.

## 6. Verification and deployment

- **Merge gate (`.github/workflows/tests.yml`)**: `node --test` plus the two
  Python doc guards. Offline, secret-free, dependency-free, so it cannot flake
  on an upstream outage and never gets ignored.
- **Browser smoke test (`tools/verify-sims.js`)**: headless Chromium over every
  page. Not on the gate — it needs a browser download there — so it is run
  locally before merging UI work (`npm run verify`). If UI regressions start
  slipping through, promote it to its own CI job rather than weakening it.
- **Deploy (`.github/workflows/deploy.yml`)**: on push to `main`, re-runs the
  unit tests, builds `site/` into `_site/` with `tools/build-site.js`, and
  publishes that to GitHub Pages. One-time setup: repository Settings → Pages →
  Source: *GitHub Actions*.
- **Cache busting (`tools/build-site.js`)**: Pages lets browsers cache every
  file for 10 minutes, so right after a deploy a fresh page could run against an
  old `catalog.js` ("the new sim isn't there"). The build stamps the stylesheet
  and entry scripts with `?v=<content hash>` and writes an import map into each
  HTML page that sends every module, including the sim page's dynamic import,
  to its hashed URL. Content hash rather than commit sha, so unchanged files
  stay cached. The HTML itself can't be stamped: a browser holding a stale page
  keeps its old map until max-age runs out or a hard refresh. `site/` stays
  unbuilt for local work (`npm run serve`); `npm run verify:built` checks the
  built output and fails on any unversioned `.js`/`.css` request.
- The workflow guards stay in Python (stdlib only, no `pip install`) as they
  came from the template; the loaded-path check is `node:test` so the repo has a
  single test runner.

## 7. Teaching models (deliberate simplifications)

Each simplification a sim makes gets an entry here, is stated in the code where
it lives, and is flagged to the student where it could mislead.

- **Decimals** (`model/decimals.js`) are a whole number plus a count of decimal
  places, as the concept set does it by hand. Typed decimals are limited to 4
  digits before the point and 4 after.
- **BEDMAS** (`model/bedmas.js`): exponents must be whole numbers, 0 or more. A
  leading minus on a number is part of the number unless an exponent is
  attached (−3² is −(3²)). Each step is rounded to 10 decimal places.
- **Pictures show sizes.** In `fractionarea` the area and "how many fit" models
  are drawn for the sizes of the fractions; the sign comes from the sign rule
  and the page says so. The multiplication square is drawn only for fractions
  up to 1, and `fractionbars` draws at most 3 wholes.
- **Most Math 15 sims have nothing that moves**, so they hide the transport bar
  and redraw from the controls every frame.
- **Shells** (`model/atoms.js`) are 2-8-8-2, as the concept set gives them. That
  only works through calcium, and the `bohr` page says so for K and Ca.
- **Effective pull** is protons minus inner electrons: a count, not a measured
  effective nuclear charge. The page calls it qualitative.
- **Energy profile** (`model/energy.js`): arbitrary units, reactants at 0. The
  barrier is raised when needed so it clears the products. "Fast" means a
  barrier of `FAST` (20) or less, a line drawn for the page, not a measurement.
  A catalyst halves the barrier.
- **Lattice** (`sims/lattice.js`): ions wander at random and stick at a free
  grid site that touches the crystal and suits their charge, more readily when
  cool and when the site has two or more neighbours; hot water shakes off ions
  held by one neighbour. It is a flat slice (4 opposite neighbours; the real
  NaCl crystal has 6) and uses `Math.random()`, so each run differs. Only the
  counts are read out, labelled "this run".
- **Dissolving** (`sims/dissolving.js`): units leave the crystal at a set rate
  and float at fixed places; each ion gets three water molecules turned the
  right way round. The bulb's brightness follows the number of free ions. No
  solubility limit is modelled.
- **Electron transfer** shows whole electrons hopping between Bohr diagrams. It
  shows the bookkeeping (charges add to zero), not the energy accounting of
  concept 2.1, which has no sim yet.
- **Molecular naming** lets a student build formulas that are not real
  compounds; the page says which ones are on the concept set's list.
