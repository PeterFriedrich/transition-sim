// Concepts 1.1 and 1.2 of docs/CONCEPTS_science10_unitA.md.
import * as A from '../model/atoms.js';
import { fitCanvas, theme, clear, text, para } from '../lib/canvas.js';
import { drawAtom } from '../lib/atomdraw.js';
import { section, slider, toggle, buttons, readouts, el as node } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'protons (atomic number) decide the element', what: 'change them and it is a different element: a nuclear process, not chemistry' },
  { html: 'mass number = protons + neutrons', what: 'isotopes: same protons, different neutrons (C-12, C-14)' },
  { html: 'charge = protons − electrons', what: 'a neutral atom has as many electrons as protons' },
  { html: 'chemistry moves electrons, never protons', what: 'ions form by gaining or losing electrons' },
];

export const prompts = [
  'Start from carbon and add two neutrons. Is it still carbon? What changed?',
  'Start from sodium and remove one electron. What is the charge, and is it still sodium?',
  'Someone says “an ion forms when an atom gains or loses a proton”. Try it with chemistry mode off. What happens to the element?',
  'Build an atom with 17 protons and 18 electrons. Name it and give its charge.',
  'Turn chemistry mode on. Which button stops working, and why is that the rule for all of chemistry?',
];

export const legend = [
  { color: 'cation', label: 'nucleus: protons (+) and neutrons' },
  { color: 'electron', label: 'electron (−)' },
];

export const tallOnMobile = false;

export function mount(ui) {
  const start = slider(section(ui.controls, 'Start from'), { label: 'Element (atomic number)', min: 1, max: A.MAX_Z, step: 1, value: 6 });
  const state = { p: 6, n: 6, e: 6 };
  const load = () => {
    const el = A.element(start.value);
    Object.assign(state, { p: el.z, n: el.neutrons, e: el.z });
  };
  start.onChange(load);
  load();

  const box = section(ui.controls, 'Add or remove');
  const limits = { p: [1, A.MAX_Z], n: [0, 30], e: [0, 20] };
  const rows = {};
  for (const [k, name] of [['p', 'Protons'], ['n', 'Neutrons'], ['e', 'Electrons']]) {
    node('div', { class: 'ctl-head', html: `<label>${name}</label>` }, box);
    rows[k] = buttons(box, [
      { label: '−', onClick: () => (state[k] = Math.max(limits[k][0], state[k] - 1)) },
      { label: '+', onClick: () => (state[k] = Math.min(limits[k][1], state[k] + 1)) },
    ]);
  }
  const chem = toggle(box, { label: 'Chemistry mode: protons are locked' });

  const out = readouts(ui.readouts, [
    { id: 'el', label: 'Element' },
    { id: 'counts', label: 'p⁺, n⁰, e⁻' },
    { id: 'mass', label: 'Mass number' },
    { id: 'charge', label: 'Net charge' },
    { id: 'kind', label: 'It is a' },
    { id: 'same', label: 'Same element as the start?' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    rows.p.forEach((b) => (b.disabled = chem.value));
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const d = A.describe(state.p, state.n, state.e);
    const first = A.element(start.value);
    const same = d.element.z === first.z;
    const mark = A.chargeMark(d.charge);
    const chargeStr = d.charge === 0 ? '0' : `${Math.abs(d.charge)}${d.charge > 0 ? '+' : '−'}`;
    out.set('el', `${d.element.name} (${d.element.symbol})`);
    out.set('counts', `${state.p}, ${state.n}, ${state.e}`);
    out.set('mass', String(d.massNumber));
    out.set('charge', chargeStr);
    out.set('kind', d.kind);
    out.set('same', same ? 'yes' : `no: now ${d.element.name}`);

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    const noteH = narrow ? 86 : 78;
    const R = Math.min((w - 2 * pad) / 2.6, (h - noteH - 20) / 2.4);
    const cy = 12 + R * 1.15;
    const shells = A.shells(state.e);
    drawAtom(ctx, w / 2, cy, R, { shells, slots: Math.max(shells.length, 1), nucleus: [`${state.p} p⁺`, `${state.n} n⁰`], charge: mark });
    const y = cy + R * 1.15 + 16;
    text(ctx, `${d.element.name}-${d.massNumber}${mark ? `   ${d.element.symbol}${mark}` : ''}`, w / 2, y, { size: narrow ? 16 : 20, weight: 750, align: 'center' });
    let note = `${state.p} protons, so it is ${d.element.name}. `;
    note += d.charge === 0 ? 'Protons = electrons: a neutral atom.' : `${state.p} protons − ${state.e} electrons = a charge of ${chargeStr}.`;
    if (!same) note += ` Changing the protons made a different element (it started as ${first.name}): that is a nuclear change, not chemistry.`;
    else if (state.n !== first.neutrons) note += ` Same element, different mass: an isotope of ${first.name}.`;
    para(ctx, note, w / 2, y + (narrow ? 22 : 26), w - 2 * pad, { size: narrow ? 11 : 14, color: th.muted });
  }
}
