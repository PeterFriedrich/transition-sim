// Science 10 Unit A models, checked against docs/CONCEPTS_science10_unitA.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as A from '../site/js/model/atoms.js';
import * as Ionic from '../site/js/model/ionic.js';
import * as M from '../site/js/model/molecular.js';
import * as E from '../site/js/model/energy.js';
import * as L from '../site/js/model/lattice.js';
import * as D from '../site/js/model/dissolving.js';

test('test_atoms_shells_match_the_first_20_table', () => {
  // 1.3, as "electrons per shell", in order of atomic number
  const table = '1 2 2-1 2-2 2-3 2-4 2-5 2-6 2-7 2-8 2-8-1 2-8-2 2-8-3 2-8-4 2-8-5 2-8-6 2-8-7 2-8-8 2-8-8-1 2-8-8-2'.split(' ');
  const symbols = 'H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca'.split(' ');
  for (let z = 1; z <= 20; z++) {
    assert.equal(A.element(z).shells.join('-'), table[z - 1], `Z = ${z}`);
    assert.equal(A.element(z).symbol, symbols[z - 1]);
  }
  assert.equal(A.element(21), null);
  assert.deepEqual(A.shells(0), []);
});

test('test_atoms_sodium_nucleus_valence_and_period', () => {
  const na = A.element(11); // Na: 11 p+, 12 n0
  assert.equal(na.neutrons, 12);
  assert.equal(na.valence, 1);
  assert.equal(na.period, 3);
  assert.equal(A.element(17).valence, 7);
  assert.equal(A.element(2).valence, 2);
});

test('test_atoms_typical_ions_by_group', () => {
  // 2.2 table, and 2.3: Na+ 2-8 (11 p, 10 e); Cl- 2-8-8 (17 p, 18 e); Ca2+ 2-8-8 (20 p, 18 e)
  assert.deepEqual(A.ion(11), { charge: 1, electrons: 10, shells: [2, 8] });
  assert.deepEqual(A.ion(17), { charge: -1, electrons: 18, shells: [2, 8, 8] });
  assert.deepEqual(A.ion(20), { charge: 2, electrons: 18, shells: [2, 8, 8] });
  assert.deepEqual(A.ion(12).shells, [2, 8]); // Mg2+
  assert.deepEqual(A.ion(8), { charge: -2, electrons: 10, shells: [2, 8] }); // O2-
  assert.equal(A.typicalCharge(13), 3);
  assert.equal(A.typicalCharge(7), -3);
  for (const z of [2, 10, 18, 6, 14, 5]) assert.equal(A.ion(z), null, `Z = ${z} has no typical ion here`);
});

test('test_atoms_charge_is_protons_minus_electrons', () => {
  const d = A.describe(11, 12, 10);
  assert.equal(d.element.name, 'sodium');
  assert.equal(d.massNumber, 23);
  assert.equal(d.charge, 1);
  assert.equal(d.kind, 'positive ion (cation)');
  assert.equal(A.describe(6, 8, 6).massNumber, 14); // C-14: same protons, different neutrons
  assert.equal(A.describe(6, 8, 6).element.symbol, 'C');
  assert.equal(A.describe(17, 18, 18).charge, -1);
  assert.equal(A.chargeMark(1), '⁺');
  assert.equal(A.chargeMark(-2), '²⁻');
  assert.equal(A.chargeMark(0), '');
});

test('test_atoms_effective_pull_rises_across_a_period_not_down_a_group', () => {
  // Na: 11 protons, 10 inner electrons. Cl: 17 protons, 10 inner.
  assert.deepEqual(A.effectivePull(11), { protons: 11, inner: 10, pull: 1, shells: 3 });
  assert.equal(A.effectivePull(17).pull, 7);
  assert.deepEqual([3, 4, 5, 6, 7, 8, 9, 10].map((z) => A.effectivePull(z).pull), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(A.effectivePull(3).pull, A.effectivePull(19).pull); // same pull, more shells
  assert.ok(A.effectivePull(19).shells > A.effectivePull(3).shells);
});

const made = (c, a) => Ionic.compound(Ionic.cation(c), Ionic.anion(a));

test('test_ionic_binary_formulas_criss_cross_then_reduce', () => {
  // 3.1 examples: Na2S, AlCl3, Al2O3, MgO (Mg2O2 reduces), Ba3N2
  assert.equal(made('Na', 'S').formula, 'Na₂S');
  assert.equal(made('Al', 'Cl').formula, 'AlCl₃');
  assert.equal(made('Al', 'O').formula, 'Al₂O₃');
  assert.equal(made('Mg', 'O').crissCross, 'Mg₂O₂');
  assert.equal(made('Mg', 'O').formula, 'MgO');
  assert.equal(made('Mg', 'O').reduced, true);
  assert.equal(made('Ba', 'N').formula, 'Ba₃N₂');
  assert.equal(made('Ba', 'N').name, 'barium nitride');
  for (const c of Ionic.CATIONS) for (const a of Ionic.ANIONS) assert.equal(Ionic.compound(c, a).positive + Ionic.compound(c, a).negative, 0, `${c.id} ${a.id}`);
});

test('test_ionic_multivalent_metals_take_a_roman_numeral', () => {
  assert.equal(made('Fe3', 'O').formula, 'Fe₂O₃');
  assert.equal(made('Fe3', 'O').name, 'iron(III) oxide');
  assert.equal(made('Fe2', 'Cl').formula, 'FeCl₂');
  assert.equal(made('Fe2', 'Cl').name, 'iron(II) chloride');
  assert.equal(made('Cu1', 'O').formula, 'Cu₂O');
  assert.equal(made('Cu1', 'O').name, 'copper(I) oxide');
  assert.equal(made('Cu1', 'Cl').formula, 'CuCl');
  assert.equal(made('Cu2', 'Cl').formula, 'CuCl₂');
  assert.equal(made('Fe2', 'S').name, 'iron(II) sulfide');
  assert.equal(made('Na', 'Cl').name, 'sodium chloride'); // no numeral for Na
  assert.equal(made('Zn', 'O').name, 'zinc oxide');
  assert.equal(Ionic.metalCharge(2, 3, -2), 3); // Fe2O3: 6-/2 = 3+
});

test('test_ionic_polyatomic_ions_get_brackets_only_when_there_are_two_or_more', () => {
  assert.equal(made('Ca', 'NO3').formula, 'Ca(NO₃)₂');
  assert.equal(made('NH4', 'SO4').formula, '(NH₄)₂SO₄');
  assert.equal(made('Al', 'SO4').formula, 'Al₂(SO₄)₃');
  assert.equal(made('Mg', 'PO4').formula, 'Mg₃(PO₄)₂');
  assert.equal(made('K', 'CO3').formula, 'K₂CO₃');
  assert.equal(made('K', 'CO3').brackets, false);
  assert.equal(made('Fe2', 'NO3').formula, 'Fe(NO₃)₂');
  assert.equal(made('Fe3', 'OH').formula, 'Fe(OH)₃');
  assert.equal(made('Fe3', 'OH').name, 'iron(III) hydroxide');
  assert.equal(made('Na', 'OH').formula, 'NaOH');
  assert.equal(made('NH4', 'Cl').name, 'ammonium chloride');
});

test('test_molecular_names_use_prefixes_and_are_not_reduced', () => {
  const cases = [
    ['C', 1, 'O', 2, 'CO₂', 'carbon dioxide'],
    ['C', 1, 'O', 1, 'CO', 'carbon monoxide'],
    ['N', 2, 'O', 1, 'N₂O', 'dinitrogen monoxide'],
    ['N', 2, 'O', 4, 'N₂O₄', 'dinitrogen tetroxide'],
    ['N', 2, 'O', 5, 'N₂O₅', 'dinitrogen pentoxide'],
    ['P', 1, 'Cl', 5, 'PCl₅', 'phosphorus pentachloride'],
    ['S', 1, 'F', 6, 'SF₆', 'sulfur hexafluoride'],
    ['C', 1, 'Cl', 4, 'CCl₄', 'carbon tetrachloride'],
    ['P', 4, 'O', 10, 'P₄O₁₀', 'tetraphosphorus decoxide'],
    ['S', 1, 'O', 3, 'SO₃', 'sulfur trioxide'],
  ];
  for (const [a, na, b, nb, f, n] of cases) {
    assert.equal(M.formula(a, na, b, nb), f);
    assert.equal(M.name(a, na, b, nb), n);
  }
  assert.equal(M.nameParts('C', 1, 'O', 1).first.droppedMono, true);
  assert.equal(M.nameParts('N', 2, 'O', 5).second.elided, true);
  assert.equal(M.nameParts('P', 1, 'Cl', 5).second.elided, false);
  assert.equal(M.compoundType(false), 'molecular');
  assert.equal(M.compoundType(true), 'ionic');
});

test('test_energy_profile_favourable_is_not_the_same_as_fast', () => {
  const slow = E.profile(-50, 60);
  assert.equal(slow.releases, true);
  assert.equal(slow.fast, false);
  assert.equal(slow.reverseActivation, 110);
  const fast = E.profile(-50, 10);
  assert.equal(fast.releases && fast.fast, true);
  const catalysed = E.profile(-50, 30, true); // a catalyst lowers the barrier, not the change
  assert.equal(catalysed.activation, 15);
  assert.equal(catalysed.change, -50);
  assert.equal(catalysed.fast, true);
  const uphill = E.profile(40, 10); // the barrier is raised to clear the products
  assert.equal(uphill.releases, false);
  assert.equal(uphill.activation, 45);
  assert.equal(uphill.raised, true);
});

test('test_energy_curve_starts_at_reactants_peaks_and_ends_at_products', () => {
  assert.equal(E.curve(0, -50, 60), 0);
  assert.equal(E.curve(0.5, -50, 60), 60);
  assert.ok(Math.abs(E.curve(1, -50, 60) + 50) < 1e-9);
  let max = -Infinity;
  for (let x = 0; x <= 1; x += 0.01) max = Math.max(max, E.curve(x, 30, 45));
  assert.ok(max <= 45 + 1e-9);
});

test('test_lattice_neighbours_alternate_in_charge', () => {
  assert.equal(L.siteCharge(0, 0), 1);
  assert.equal(L.siteCharge(1, 0), -1);
  assert.equal(L.siteCharge(-1, 0), -1);
  assert.equal(L.siteCharge(-1, -1), 1);
  const filled = new Set([L.key(0, 0)]);
  assert.equal(L.canAttach(filled, 1, 0, -1), true);
  assert.equal(L.canAttach(filled, 1, 0, 1), false); // wrong charge for that site
  assert.equal(L.canAttach(filled, 2, 0, 1), false); // does not touch the crystal
  assert.equal(L.canAttach(filled, 0, 0, 1), false); // taken
  for (const [i, j] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) filled.add(L.key(i, j));
  assert.equal(L.neighbours(filled, 0, 0), L.NEIGHBOURS_FLAT);
});

test('test_dissolving_salt_gives_ions_and_conducts_sugar_does_not', () => {
  assert.equal(D.dissolved(0, 12, 2), 0);
  assert.equal(D.dissolved(2.6, 12, 2), 5);
  assert.equal(D.dissolved(100, 12, 2), 12);
  assert.equal(D.freeIons('salt', 5), 10);
  assert.equal(D.freeIons('sugar', 5), 0);
  assert.equal(D.conducts('salt', 1), true);
  assert.equal(D.conducts('salt', 0), false);
  assert.equal(D.conducts('sugar', 12), false);
  assert.equal(D.waterEnd(1), 'O'); // Na+ is surrounded by O ends
  assert.equal(D.waterEnd(-1), 'H'); // Cl- by H ends
});
