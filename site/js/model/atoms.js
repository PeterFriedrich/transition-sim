// Atomic structure and ions for the first 20 elements: concepts 1.1–1.5 and
// 2.2–2.3 of docs/CONCEPTS_science10_unitA.md.
//
// Shells are the concept set's (1.3): capacities 2, 8, 8, then K and Ca start
// shell 4. That 2-8-8 rule is a simplification that only works through Ca.
// Names and mass numbers are not in the concept set: they are the Chemistry 30
// Data Booklet's names and its atomic molar masses rounded to a whole number
// (docs/DATA_SHEET.md §2), which is the most common isotope for these twenty.

const CAPACITY = [2, 8, 8, 2];

// [symbol, name, group, mass number], in order of atomic number.
const TABLE = [
  ['H', 'hydrogen', 1, 1], ['He', 'helium', 18, 4],
  ['Li', 'lithium', 1, 7], ['Be', 'beryllium', 2, 9], ['B', 'boron', 13, 11], ['C', 'carbon', 14, 12],
  ['N', 'nitrogen', 15, 14], ['O', 'oxygen', 16, 16], ['F', 'fluorine', 17, 19], ['Ne', 'neon', 18, 20],
  ['Na', 'sodium', 1, 23], ['Mg', 'magnesium', 2, 24], ['Al', 'aluminum', 13, 27], ['Si', 'silicon', 14, 28],
  ['P', 'phosphorus', 15, 31], ['S', 'sulfur', 16, 32], ['Cl', 'chlorine', 17, 35], ['Ar', 'argon', 18, 40],
  ['K', 'potassium', 1, 39], ['Ca', 'calcium', 2, 40],
];

export const MAX_Z = TABLE.length;

// Electrons per shell for `count` electrons, filled from the inside out.
export function shells(count) {
  const out = [];
  let left = Math.max(0, Math.min(count, 20));
  for (const cap of CAPACITY) {
    if (left <= 0) break;
    out.push(Math.min(cap, left));
    left -= cap;
  }
  return out;
}

export function element(z) {
  const row = TABLE[z - 1];
  if (!row) return null;
  const [symbol, name, group, massNumber] = row;
  const s = shells(z);
  return { z, symbol, name, group, massNumber, neutrons: massNumber - z, shells: s, period: s.length, valence: s[s.length - 1] };
}

// Typical ion charge by group (2.2). Group 13 is listed for Al only; groups 14
// and 18 form none at this level. 0 means "no typical ion".
const GROUP_CHARGE = { 1: 1, 2: 2, 15: -3, 16: -2, 17: -1 };
export function typicalCharge(z) {
  const el = element(z);
  if (!el) return 0;
  if (el.symbol === 'Al') return 3;
  return GROUP_CHARGE[el.group] ?? 0;
}

// The typical ion: a cation loses its outer shell, an anion fills it (2.3).
export function ion(z) {
  const charge = typicalCharge(z);
  if (!charge) return null;
  const electrons = z - charge;
  return { charge, electrons, shells: shells(electrons) };
}

// What a pile of protons, neutrons and electrons is (1.1).
export function describe(p, n, e) {
  const charge = p - e;
  return {
    element: element(p),
    massNumber: p + n,
    charge,
    kind: charge === 0 ? 'neutral atom' : charge > 0 ? 'positive ion (cation)' : 'negative ion (anion)',
  };
}

// 1.5: the pull the outer electrons feel, protons minus the inner electrons screening them.
export function effectivePull(z) {
  const s = shells(z);
  const inner = s.slice(0, -1).reduce((a, b) => a + b, 0);
  return { protons: z, inner, pull: z - inner, shells: s.length };
}

const SUP = { 1: '', 2: '²', 3: '³', 4: '⁴' };
// +1 → "⁺", −2 → "²⁻", 0 → "".
export function chargeMark(charge) {
  if (!charge) return '';
  return `${SUP[Math.abs(charge)] ?? Math.abs(charge)}${charge > 0 ? '⁺' : '⁻'}`;
}
