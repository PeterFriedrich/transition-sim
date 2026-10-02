// A flat slice of an NaCl-type crystal: concept 2.4 of
// docs/CONCEPTS_science10_unitA.md. Sites sit on a square grid and alternate in
// charge, so every neighbour of an ion has the opposite charge. In this flat
// picture an ion inside the crystal has 4 opposite neighbours; in the real 3-D
// crystal it has 6.

export const key = (i, j) => `${i},${j}`;

// +1 or −1: the charge an ion must have to sit at site (i, j).
export function siteCharge(i, j) {
  return (((i + j) % 2) + 2) % 2 === 0 ? 1 : -1;
}

const AROUND = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// How many of a site's 4 neighbours are filled (all of them opposite in charge).
export function neighbours(filled, i, j) {
  return AROUND.filter(([di, dj]) => filled.has(key(i + di, j + dj))).length;
}

// An ion can join at an empty site that touches the crystal and matches its charge.
export function canAttach(filled, i, j, charge) {
  return !filled.has(key(i, j)) && siteCharge(i, j) === charge && neighbours(filled, i, j) > 0;
}

export const NEIGHBOURS_FLAT = 4;
export const NEIGHBOURS_3D = 6;
