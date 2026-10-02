// Naming molecular compounds: concept 3.4 of docs/CONCEPTS_science10_unitA.md.
// The prefix gives the subscript; nothing is reduced. Only pairs whose order is
// clear from the concept set's rough order (C, P, S, N, … O, then halogens) are
// offered: C, P, S or N first, then O, F or Cl.

export const PREFIX = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa', 'hepta', 'octa', 'nona', 'deca'];

export const FIRST = { C: 'carbon', P: 'phosphorus', S: 'sulfur', N: 'nitrogen' };
export const SECOND = { O: 'oxide', F: 'fluoride', Cl: 'chloride' };

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => SUB[d]));

export function formula(a, na, b, nb) {
  return `${a}${sub(na)}${b}${sub(nb)}`;
}

// How each half of the name is built, so the page can show the rule that applied.
export function nameParts(a, na, b, nb) {
  const first = { prefix: na === 1 ? '' : PREFIX[na], root: FIRST[a], droppedMono: na === 1 };
  let prefix = PREFIX[nb];
  // Drop the prefix's final a or o before a vowel: monoxide, tetroxide, pentoxide.
  const elided = /[ao]$/.test(prefix) && /^[aeiou]/.test(SECOND[b]);
  if (elided) prefix = prefix.slice(0, -1);
  return { first, second: { prefix, root: SECOND[b], elided } };
}

export function name(a, na, b, nb) {
  const p = nameParts(a, na, b, nb);
  return `${p.first.prefix}${p.first.root} ${p.second.prefix}${p.second.root}`;
}

// Type check: a metal, ammonium or a polyatomic ion makes it ionic; two nonmetals make it molecular.
export function compoundType(firstIsMetalOrAmmonium, hasPolyatomic = false) {
  return firstIsMetalOrAmmonium || hasPolyatomic ? 'ionic' : 'molecular';
}
