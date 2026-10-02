// Dissolving salt and sugar: concept 2.5 of docs/CONCEPTS_science10_unitA.md.
// The salt crystal was always ions; water pulls them apart and surrounds them.
// Sugar leaves as whole molecules, so there are no ions and no conduction.

export const KINDS = {
  salt: { name: 'salt (NaCl)', ionsPerUnit: 2, unit: 'formula unit' },
  sugar: { name: 'sugar (C₁₂H₂₂O₁₁)', ionsPerUnit: 0, unit: 'molecule' },
};

// Units that have left the crystal after t seconds, at `rate` units per second.
export function dissolved(t, total, rate) {
  return Math.max(0, Math.min(total, Math.floor(t * rate)));
}

export function freeIons(kind, units) {
  return KINDS[kind].ionsPerUnit * units;
}

// A solution conducts when it has ions that are free to move.
export function conducts(kind, units) {
  return freeIons(kind, units) > 0;
}

// Which end of a polar water molecule faces an ion: the negative O end faces a
// positive ion, the positive H ends face a negative ion.
export function waterEnd(charge) {
  return charge > 0 ? 'O' : 'H';
}
