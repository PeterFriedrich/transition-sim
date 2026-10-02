// Ionic formulas and names: concepts 3.1–3.3 of docs/CONCEPTS_science10_unitA.md.
// Every ion here is one the concept set lists (3.1 examples and endings, 3.2
// common multivalent metals, the 3.3 table); its "possible extras" are left out.

import { chargeMark } from './atoms.js';

export const CATIONS = [
  { id: 'Li', symbol: 'Li', name: 'lithium', charge: 1 },
  { id: 'Na', symbol: 'Na', name: 'sodium', charge: 1 },
  { id: 'K', symbol: 'K', name: 'potassium', charge: 1 },
  { id: 'Mg', symbol: 'Mg', name: 'magnesium', charge: 2 },
  { id: 'Ca', symbol: 'Ca', name: 'calcium', charge: 2 },
  { id: 'Ba', symbol: 'Ba', name: 'barium', charge: 2 },
  { id: 'Al', symbol: 'Al', name: 'aluminum', charge: 3 },
  { id: 'Zn', symbol: 'Zn', name: 'zinc', charge: 2 },
  { id: 'Ag', symbol: 'Ag', name: 'silver', charge: 1 },
  { id: 'Fe2', symbol: 'Fe', name: 'iron', charge: 2, multivalent: true },
  { id: 'Fe3', symbol: 'Fe', name: 'iron', charge: 3, multivalent: true },
  { id: 'Cu1', symbol: 'Cu', name: 'copper', charge: 1, multivalent: true },
  { id: 'Cu2', symbol: 'Cu', name: 'copper', charge: 2, multivalent: true },
  { id: 'Pb2', symbol: 'Pb', name: 'lead', charge: 2, multivalent: true },
  { id: 'Pb4', symbol: 'Pb', name: 'lead', charge: 4, multivalent: true },
  { id: 'Sn2', symbol: 'Sn', name: 'tin', charge: 2, multivalent: true },
  { id: 'Sn4', symbol: 'Sn', name: 'tin', charge: 4, multivalent: true },
  { id: 'NH4', symbol: 'NH₄', name: 'ammonium', charge: 1, poly: true },
];

export const ANIONS = [
  { id: 'F', symbol: 'F', name: 'fluoride', charge: -1 },
  { id: 'Cl', symbol: 'Cl', name: 'chloride', charge: -1 },
  { id: 'Br', symbol: 'Br', name: 'bromide', charge: -1 },
  { id: 'I', symbol: 'I', name: 'iodide', charge: -1 },
  { id: 'O', symbol: 'O', name: 'oxide', charge: -2 },
  { id: 'S', symbol: 'S', name: 'sulfide', charge: -2 },
  { id: 'N', symbol: 'N', name: 'nitride', charge: -3 },
  { id: 'P', symbol: 'P', name: 'phosphide', charge: -3 },
  { id: 'H', symbol: 'H', name: 'hydride', charge: -1 },
  { id: 'OH', symbol: 'OH', name: 'hydroxide', charge: -1, poly: true },
  { id: 'NO3', symbol: 'NO₃', name: 'nitrate', charge: -1, poly: true },
  { id: 'HCO3', symbol: 'HCO₃', name: 'hydrogen carbonate', charge: -1, poly: true },
  { id: 'CH3COO', symbol: 'CH₃COO', name: 'acetate', charge: -1, poly: true },
  { id: 'CO3', symbol: 'CO₃', name: 'carbonate', charge: -2, poly: true },
  { id: 'SO4', symbol: 'SO₄', name: 'sulfate', charge: -2, poly: true },
  { id: 'PO4', symbol: 'PO₄', name: 'phosphate', charge: -3, poly: true },
];

export const cation = (id) => CATIONS.find((c) => c.id === id) ?? null;
export const anion = (id) => ANIONS.find((a) => a.id === id) ?? null;

const SUB = '₀₁₂₃₄₅₆₇₈₉';
const sub = (n) => (n === 1 ? '' : String(n).replace(/\d/g, (d) => SUB[d]));
const ROMAN = ['', 'I', 'II', 'III', 'IV'];
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

// An ion with its charge: Fe³⁺, SO₄²⁻.
export function ionLabel(ion) {
  return `${ion.symbol}${chargeMark(ion.charge)}`;
}

// One ion's part of a formula: brackets only around 2 or more of a polyatomic ion.
function part(ion, count) {
  return ion.poly && count > 1 ? `(${ion.symbol})${sub(count)}` : `${ion.symbol}${sub(count)}`;
}

// Charges must cancel: criss-cross the charges to subscripts, then reduce.
export function compound(cat, an) {
  const crissCross = { cations: Math.abs(an.charge), anions: cat.charge };
  const g = gcd(crissCross.cations, crissCross.anions);
  const cations = crissCross.cations / g;
  const anions = crissCross.anions / g;
  return {
    cations,
    anions,
    crissCross: `${part(cat, crissCross.cations)}${part(an, crissCross.anions)}`,
    reduced: g > 1,
    formula: `${part(cat, cations)}${part(an, anions)}`,
    name: `${cat.name}${cat.multivalent ? `(${ROMAN[cat.charge]})` : ''} ${an.name}`,
    positive: cations * cat.charge,
    negative: anions * an.charge,
    brackets: (cat.poly && cations > 1) || (an.poly && anions > 1),
  };
}

// Formula to name for a multivalent metal: metal charge = total negative charge ÷ number of metal atoms.
export function metalCharge(metalAtoms, anionCount, anionCharge) {
  return Math.abs(anionCount * anionCharge) / metalAtoms;
}
