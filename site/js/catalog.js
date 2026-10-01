// Every simulation the site hosts. The home page and the sim page both render
// from this list; tests/catalog.test.js checks that each entry has a module
// under js/sims/ exporting what sim-page.js needs.
//
// Units are the sections of the concept sets the owner supplies
// (docs/CONCEPTS_*.md), titled as the owner titled them: nothing here is filled
// in from memory. Math 15 ids are the section numbers of the review set.
// Science 10 ids are the program unit letter plus the section number, so the
// other program units can be added later without a clash.

export const courses = [
  {
    id: 'm15',
    title: 'Math 15',
    units: [
      { id: '1', title: 'Integers' },
      { id: '2', title: 'BEDMAS (Order of Operations)' },
      { id: '3', title: 'Fractions' },
      { id: '4', title: 'Decimals' },
    ],
  },
  {
    id: 's10',
    title: 'Science 10',
    units: [
      { id: 'A0', title: 'Cross-cutting ideas' },
      { id: 'A1', title: 'Atomic structure' },
      { id: 'A2', title: 'Ions and ionic bonding' },
      { id: 'A3', title: 'Formulas and naming' },
      { id: 'A4', title: 'Conservation of mass and balancing' },
      { id: 'A5', title: 'Reaction types' },
      { id: 'A6', title: 'Acids and bases' },
      { id: 'A7', title: 'Energy in reactions' },
    ],
  },
];

// One entry per sim: { id, course, unit, title, summary, concepts: [] }.
export const sims = [];

export function findSim(id) {
  return sims.find((s) => s.id === id) ?? null;
}

export function unitOf(sim) {
  const course = courses.find((c) => c.id === sim.course);
  return { course, unit: course?.units.find((u) => u.id === sim.unit) };
}
