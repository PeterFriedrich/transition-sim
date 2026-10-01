# Spec — Phase 1

**Status: scope open.** The sim list (§3) waits on the owner's course content.
§2, §4 and §5 carry over from physics_sim and hold for every sim regardless of
which ones are chosen.

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

**Open — the owner supplies it.** No units, topics or simulations are listed
here until the owner's outcomes, formula sheets and sim list arrive (`TODO.md`).
When they do, this section gets the table the siblings have:

| Course | Unit | Simulation (catalog id) |
|---|---|---|
| | | |

and the approval is recorded as a row in `docs/DECISIONS.md`.

Out of scope for phase 1: accounts, saved progress, a backend, and
worked-solution generation.

## 4. Every simulation page must have

1. A canvas view, with play/pause, reset and slow-motion where anything moves.
2. Controls for every variable the topic's equations use, with units shown.
3. Readouts of the quantities a student would calculate, written the way
   students write them.
4. A "Key equations" list and at least three "Try this" prompts.
5. The site-wide colour code, once one is chosen (ARCHITECTURE.md §5).

## 5. Acceptance criteria

1. Every readout comes from a function in `site/js/model/` with a unit test
   that checks it against the course's equation or a worked example.
2. Constants, formulas and notation are the ones in the course materials
   (`docs/DATA_SHEET.md`).
3. `npm run check` passes (unit tests + doc guards) on the merge gate.
4. `npm run verify` loads every page at 390 px and 1280 px, light and dark,
   with no console errors, no blank canvas and no horizontal scroll.
5. A human has looked at each sim's screenshot and the numbers on screen agree
   with a hand calculation for the default settings.
