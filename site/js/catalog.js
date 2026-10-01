// Every simulation the site hosts. The home page and the sim page both render
// from this list; tests/catalog.test.js checks that each entry has a module
// under js/sims/ exporting what sim-page.js needs.
//
// The two courses are the project's scope. Their units and the sim list wait on
// the owner's course content (TODO.md): nothing here is filled in from memory.

export const courses = [
  { id: 'm15', title: 'Math 15', units: [] },
  { id: 's10', title: 'Science 10', units: [] },
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
