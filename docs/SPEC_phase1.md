# Spec — Phase 1

**Status: first versions being built.** The owner supplied two concept sets on
2026-10-01 (a Math 15 review and Science 10 Unit A). On 2026-10-02 the owner
said to build what does not depend on the open questions, as first versions the
owner will clean up afterward. More concept sets are expected. §2, §4 and §5 carry over from physics_sim
and hold for every sim.

## 1. Goal

A tutor (or student) opens a link, picks a Math 15 or Science 10 topic, and
gets an interactive simulation that makes the concept visible and whose numbers
can be checked against a hand calculation.

## 2. Audience and use

- **Tutor-led:** screen-shared or on a tablet during a session. The tutor sets
  up a situation, asks the student to predict, then plays it.
- **Student alone:** the "Try this" prompts on each page give a predict →
  check → explain sequence without a tutor.
- Devices: laptop and phone/tablet browsers. Light and dark mode.

## 3. Scope

The content comes from the owner as concept sets, kept verbatim in
`docs/CONCEPTS_*.md`. Each concept has an ID, rules, worked examples and common
errors; a sim names the concept IDs it serves, its tests use that concept's
worked examples and quick-check answers, and its "Try this" prompts aim at the
listed common errors.

**`docs/CONCEPTS_math15_review.md` — all eight built as first versions**
(2026-10-02). None has had the owner's walkthrough (§5 criterion 5).

| Course | Unit | Simulation (catalog id) | Concepts | What the student does |
|---|---|---|---|---|
| Math 15 | Integers | Integers on the number line (`numberline`) | 1.1–1.3 | Picks two integers and + or −; the sim walks the move on a number line and shows subtraction rewritten as adding the opposite |
| Math 15 | Integers | Signs in multiplying and dividing (`signs`) | 1.4 | Steps one factor down through zero and watches the product pattern cross into the other sign |
| Math 15 | BEDMAS | Order of operations, step by step (`bedmas`) | 2.1–2.3, 1.5 | Chooses an expression and predicts the next operation; the sim does one step per click, and shows the wrong answer a left-out rule gives (12 ÷ 3 × 2, −3² vs (−3)²) |
| Math 15 | Fractions | Fraction bars (`fractionbars`) | 3.1–3.4 | Sets two fractions on bars and a number line; re-cuts them to a common denominator to compare, add or subtract |
| Math 15 | Fractions | Multiplying and dividing fractions (`fractionarea`) | 3.5–3.8 | Area model for "2/3 of 9/10"; "how many 2/3s fit in 3/4" for division, beside the multiply-by-the-reciprocal working |
| Math 15 | Decimals | Place value and comparing (`placevalue`) | 4.1, 4.2, 4.6 | Builds decimals in a place-value chart, pads and compares them, and shifts the point for × and ÷ by powers of 10 |
| Math 15 | Decimals | Decimal arithmetic (`decimalops`) | 4.3–4.5, 4.11 | Lines up the points for + and −; counts decimal places for ×; shifts both points for ÷ |
| Math 15 | Decimals | Fraction to decimal by long division (`longdivision`) | 4.7–4.9 | Steps through the long division and sees the remainder reach 0 (terminating) or come back (repeating) |

Not built: 3.7 mixed numbers as input (answers are shown as mixed numbers), 3.3's
ordering of three fractions at once, and 4.10 rounding (the model has `round`,
no sim uses it yet). The quick checks are test cases. The concept set's "Not yet covered" list waits for its own set.

**`docs/CONCEPTS_science10_unitA.md` — nine built as first versions**
(2026-10-02): the rows marked ✓. The other seven wait on the owner. That set
gives a "Viz hook" for nearly every concept; this table only groups the hooks
into pages and gives them ids. The hook text in the concept set is the
description of each sim. Sections 4–7 are outlined only in the set, so their
sims wait for the detailed version.

| Unit (section) | Simulation (catalog id) | Concepts | Needs data the set does not give |
|---|---|---|---|
| 0 Cross-cutting ideas | ✓ Energy profile of a reaction (`energyprofile`) | 0.1 | no (qualitative sliders) |
| 0 Cross-cutting ideas | What the crust, ocean and air are made of (`composition`) | 0.2 | **yes**: composition figures by form |
| 1 Atomic structure | ✓ Build an atom (`buildatom`), with isotopes as its neutron control | 1.1, 1.2 | element names: taken from the Chemistry 30 Data Booklet (DATA_SHEET.md §2) |
| 1 Atomic structure | ✓ Bohr-Rutherford diagrams (`bohr`), with the ion toggle | 1.3, 1.4, 2.3 | neutron counts: from the booklet's molar masses (DATA_SHEET.md §2) |
| 1 Atomic structure | Periodic table heatmap (`periodictable`), ion Bohr diagram on click | 1.4, 2.2 | waits on question 1 below; table layout past Ca, if it shows more than the first 20 |
| 1 Atomic structure | ✓ Effective pull across periods 2 and 3 (`effectivepull`) | 1.5 | no (protons minus inner electrons, from 1.3) |
| 2 Ions and ionic bonding | Energy accounting for NaCl (`ionenergy`) | 2.1 | **yes**: the three energies, or agreement that the bars are qualitative |
| 2 Ions and ionic bonding | ✓ Electron transfer (`transfer`): any of six metals to any of six nonmetals | 2.3, 2.3b | no |
| 2 Ions and ionic bonding | ✓ Growing a crystal lattice (`lattice`), flat not 3D | 2.4 | no (a teaching model, ARCHITECTURE.md §7) |
| 2 Ions and ionic bonding | ✓ Dissolving: salt vs sugar (`dissolving`) | 2.5 | no (a teaching model) |
| 3 Formulas and naming | ✓ Ionic formulas and names (`ionicformula`): charge-balance rows, multivalent metals, polyatomic brackets | 3.1–3.3 | built with the listed ions only; 3.2's "also" metals and 3.3's "possible extras" are left out |
| 3 Formulas and naming | ✓ Molecular compounds (`molecular`): formula → name, C, P, S or N with O, F or Cl | 3.4 | no shapes drawn (atoms are counted out in a row); the pairs offered avoid question 2 below |
| 4 Balancing (outlined) | Balancing equations (`balancing`) | 4 | the list of equations |
| 5 Reaction types (outlined) | Reaction types (`reactiontypes`) | 5 | **yes**: the activity series |
| 6 Acids and bases (outlined) | The pH scale (`ph`) | 6 | titration curve needs its own concept detail |
| 7 Energy in reactions (outlined) | Bond-energy bookkeeping (`bondenergy`) | 7 | **yes**: bond energies |

2.6 has no hook and no sim. The set's "Test cases for naming sim" are tests
(`tests/science10.test.js`); its "Common student errors" feed the prompts.
Not built from the hooks that were built: the 3-D lattice (2.4), ball-and-stick
views (3.3, 3.4), drag-and-drop (3.1), a name → formula direction, and the
diatomics and common names of 3.5.

Questions the Science 10 set raises (answers go in `docs/DECISIONS.md`):

1. **Valence electrons vs group number.** 1.3 and 1.4 say valence electrons =
   group number (main groups), while 2.2 numbers the groups 13–18. A readout
   needs one rule: group number for groups 1–2, group number minus 10 for 13–18,
   and 2 for He. Confirm, or say which numbering the students use.
2. **Element order in molecular names (3.4).** The rough order given puts O
   before the halogens and S before N. It names every example in the set
   correctly, but a free builder would produce OCl2 where textbooks write Cl2O.
   Either restrict the builder to listed compounds or supply the order to use.
3. **Where the missing data comes from** (the "yes" rows above): the owner names
   a source for each and it is transcribed into `docs/DATA_SHEET.md`.

Out of scope for phase 1: accounts, saved progress, a backend, and
worked-solution generation.

## 4. Every simulation page must have

1. A canvas view, with play/pause, reset and slow-motion where anything moves.
2. Controls for every quantity the concept's rules use, with units shown where there are any.
3. Readouts of the quantities a student would calculate, written the way
   students write them.
4. A "Key equations" list (for these concepts, the rules) and at least three
   "Try this" prompts.
5. The site-wide colour code, once one is chosen (ARCHITECTURE.md §5).

## 5. Acceptance criteria

1. Every readout comes from a function in `site/js/model/` with a unit test
   that checks it against the concept set's worked examples and quick checks.
2. Rules, notation and wording are the concept set's (`docs/CONCEPTS_*.md`);
   constants and formulas are the ones in `docs/DATA_SHEET.md`.
3. `npm run check` passes (unit tests + doc guards) on the merge gate.
4. `npm run verify` loads every page at 390 px and 1280 px, light and dark,
   with no console errors, no blank canvas and no horizontal scroll.
5. A human has looked at each sim's screenshot and the numbers on screen agree
   with a hand calculation for the default settings.
