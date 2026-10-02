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
export const sims = [
  {
    id: 'numberline',
    course: 'm15',
    unit: '1',
    title: 'Integers on the Number Line',
    summary: 'Add and subtract integers as moves along a number line. Subtracting is adding the opposite.',
    concepts: ['sign and size', 'adding integers', 'adding the opposite'],
  },
  {
    id: 'signs',
    course: 'm15',
    unit: '1',
    title: 'Signs in Multiplying and Dividing',
    summary: 'Follow the pattern of products down through zero to see why a negative times a negative is positive.',
    concepts: ['same signs, different signs', 'product patterns', 'division facts'],
  },
  {
    id: 'bedmas',
    course: 'm15',
    unit: '2',
    title: 'Order of Operations, Step by Step',
    summary: 'Predict the next operation, then watch it happen one line at a time. Type your own expression.',
    concepts: ['BEDMAS', 'left to right', '−3² vs (−3)²'],
  },
  {
    id: 'fractionbars',
    course: 'm15',
    unit: '3',
    title: 'Fraction Bars',
    summary: 'Re-cut two fractions into pieces of the same size, then compare, add or subtract them.',
    concepts: ['equivalent fractions', 'common denominator', 'simplifying'],
  },
  {
    id: 'fractionarea',
    course: 'm15',
    unit: '3',
    title: 'Multiplying and Dividing Fractions',
    summary: 'A part of a part as an area, and division as “how many fit?”, beside the working.',
    concepts: ['straight across', 'reciprocal', 'sign rules'],
  },
  {
    id: 'placevalue',
    course: 'm15',
    unit: '4',
    title: 'Decimal Place Value',
    summary: 'Put two decimals in a place-value chart to compare them, read one as a fraction, and shift it by powers of 10.',
    concepts: ['place value', 'comparing decimals', 'powers of 10'],
  },
  {
    id: 'decimalops',
    course: 'm15',
    unit: '4',
    title: 'Decimal Arithmetic',
    summary: 'Line up the points to add and subtract, count places to multiply, shift both points to divide.',
    concepts: ['column method', 'counting decimal places', 'shifting the point'],
  },
  {
    id: 'longdivision',
    course: 'm15',
    unit: '4',
    title: 'Fraction to Decimal',
    summary: 'Long division one digit at a time: the remainder reaches zero, or it comes back and the digits repeat.',
    concepts: ['long division', 'terminating and repeating', 'factors of 2 and 5'],
  },
  {
    id: 'energyprofile',
    course: 's10',
    unit: 'A0',
    title: 'Why Reactions Happen: Energy Profile',
    summary: 'Set the barrier and the product energy. Favourable is not the same as fast.',
    concepts: ['activation energy', 'energy released or absorbed', 'catalyst'],
  },
  {
    id: 'buildatom',
    course: 's10',
    unit: 'A1',
    title: 'Build an Atom',
    summary: 'Add and remove protons, neutrons and electrons, and see what each one changes.',
    concepts: ['atomic number', 'isotopes', 'ion charge'],
  },
  {
    id: 'bohr',
    course: 's10',
    unit: 'A1',
    title: 'Bohr-Rutherford Diagrams',
    summary: 'The first 20 elements, shell by shell, and the ion each one typically forms.',
    concepts: ['electron shells', 'valence electrons', 'drawing ions'],
  },
  {
    id: 'effectivepull',
    course: 's10',
    unit: 'A1',
    title: 'Nuclear Pull and Screening',
    summary: 'How hard the nucleus pulls on the outer electrons, across periods 2 and 3.',
    concepts: ['screening', 'trends across a period', 'trends down a group'],
  },
  {
    id: 'transfer',
    course: 's10',
    unit: 'A2',
    title: 'Electron Transfer',
    summary: 'Watch a metal give its outer electrons to a nonmetal, and read the formula off the charges.',
    concepts: ['ionic bonding', 'charges add to zero', 'ion diagrams'],
  },
  {
    id: 'lattice',
    course: 's10',
    unit: 'A2',
    title: 'Growing a Crystal Lattice',
    summary: 'Ions in solution stick to a growing crystal as the water cools or evaporates.',
    concepts: ['crystal lattice', 'opposite charges attract', 'crystallization'],
  },
  {
    id: 'dissolving',
    course: 's10',
    unit: 'A2',
    title: 'Dissolving: Salt vs Sugar',
    summary: 'Salt comes apart into ions wrapped in water and conducts. Sugar stays as whole molecules and does not.',
    concepts: ['dissociation', 'polar water', 'conductivity'],
  },
  {
    id: 'ionicformula',
    course: 's10',
    unit: 'A3',
    title: 'Ionic Formulas and Names',
    summary: 'Pick a positive and a negative ion. The charges must cancel, and that gives the formula and the name.',
    concepts: ['charge balance', 'multivalent metals', 'polyatomic ions'],
  },
  {
    id: 'molecular',
    course: 's10',
    unit: 'A3',
    title: 'Naming Molecular Compounds',
    summary: 'Two nonmetals: the prefixes give the subscripts, and nothing is reduced.',
    concepts: ['prefixes', 'mono and vowel rules', 'ionic or molecular?'],
  },
];

export function findSim(id) {
  return sims.find((s) => s.id === id) ?? null;
}

export function unitOf(sim) {
  const course = courses.find((c) => c.id === sim.course);
  return { course, unit: course?.units.find((u) => u.id === sim.unit) };
}
