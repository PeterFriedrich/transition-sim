// Concepts 1.3, 1.4 and 2.3 of docs/CONCEPTS_science10_unitA.md.
import * as A from '../model/atoms.js';
import { fitCanvas, theme, clear, text, para } from '../lib/canvas.js';
import { drawAtom } from '../lib/atomdraw.js';
import { section, slider, toggle, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'shell 1 holds 2, shell 2 holds 8, shell 3 holds 8', what: 'fill from the inside out; K and Ca start shell 4' },
  { html: 'number of rings = period', what: 'the row of the periodic table' },
  { html: 'outer-shell electrons = valence electrons', what: 'they match the group (main groups)' },
  { html: 'ion charge = protons − electrons', what: 'the nucleus never changes: Na⁺ has 11 p⁺ and 10 e⁻' },
];

export const prompts = [
  'Before moving the slider to sulfur (16), write its electrons per shell. Check.',
  'Find three elements with 1 valence electron. What do they have in common on the periodic table?',
  'Show the ion for sodium, then for chlorine. Which one loses a ring? Which one fills its ring?',
  'Show the ion for calcium. Which neutral atom has the same electron arrangement?',
  'In an ion diagram, what changes: the nucleus, the electrons, or both?',
];

export const legend = [
  { color: 'electron', label: 'electron' },
  { color: 'result', label: 'valence (outer-shell) electron' },
  { color: 'cation', label: 'nucleus' },
];

export const tallOnMobile = false;

export function mount(ui) {
  const box = section(ui.controls, 'Element');
  const z = slider(box, { label: 'Atomic number (protons)', min: 1, max: A.MAX_Z, step: 1, value: 11 });
  const asIon = toggle(box, { label: 'Show its typical ion', checked: true });

  const out = readouts(ui.readouts, [
    { id: 'el', label: 'Element' },
    { id: 'shells', label: 'Electrons per shell' },
    { id: 'val', label: 'Valence electrons' },
    { id: 'period', label: 'Period (rings)' },
    { id: 'ion', label: 'Typical ion' },
    { id: 'ionShells', label: 'Ion: p⁺, e⁻, shells' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const el = A.element(z.value);
    const ion = A.ion(el.z);
    out.set('el', `${el.name} (${el.symbol})`);
    out.set('shells', el.shells.join('-'));
    out.set('val', String(el.valence));
    out.set('period', String(el.period));
    out.set('ion', ion ? `${el.symbol}${A.chargeMark(ion.charge)}` : 'none');
    out.set('ionShells', ion ? `${el.z}, ${ion.electrons}, ${ion.shells.join('-') || 'none'}` : '—');

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    const two = asIon.value && ion;
    const noteH = narrow ? 64 : 62;
    const R = Math.min((w - 2 * pad) / (two ? 5.2 : 2.6), (h - noteH - 46) / 2.5);
    const cy = 30 + R * 1.2;
    const nucleus = [`${el.z} p⁺`, `${el.neutrons} n⁰`];
    const cx1 = two ? w * 0.27 : w / 2;
    drawAtom(ctx, cx1, cy, R, { shells: el.shells, nucleus, highlight: el.shells.length - 1 });
    text(ctx, `${el.symbol}  ${el.shells.join('-')}`, cx1, cy + R * 1.2 + 12, { size: narrow ? 13 : 16, weight: 700, align: 'center' });
    if (two) {
      const cx2 = w * 0.73;
      text(ctx, '→', w / 2, cy, { size: narrow ? 20 : 28, color: th.muted, align: 'center' });
      drawAtom(ctx, cx2, cy, R, { shells: ion.shells, slots: el.shells.length, nucleus, charge: A.chargeMark(ion.charge) });
      text(ctx, `${el.symbol}${A.chargeMark(ion.charge)}  ${ion.shells.join('-') || 'no electrons'}`, cx2, cy + R * 1.2 + 12, { size: narrow ? 13 : 16, weight: 700, align: 'center' });
    }

    let note;
    if (!asIon.value) note = `${el.valence} valence electron${el.valence > 1 ? 's' : ''} in the outer shell; ${el.period} ring${el.period > 1 ? 's' : ''}, so period ${el.period}.`;
    else if (!ion) note = `${el.name} has no typical ion at this level${el.group === 18 ? ': its outer shell is already full' : ''}.`;
    else if (ion.charge > 0) note = `${el.name} loses its ${ion.charge} outer electron${ion.charge > 1 ? 's' : ''}, so the old outer ring disappears: ${el.z} p⁺ and ${ion.electrons} e⁻. The nucleus is unchanged.`;
    else note = `${el.name} gains ${-ion.charge} electron${ion.charge < -1 ? 's' : ''} into its outer shell and fills it: ${el.z} p⁺ and ${ion.electrons} e⁻. The nucleus is unchanged.`;
    note = note[0].toUpperCase() + note.slice(1);
    if (el.z >= 19) note += ' The 2-8-8 pattern only works up to calcium.';
    para(ctx, note, w / 2, h - noteH + 14, w - 2 * pad, { size: narrow ? 11 : 14, color: th.muted });
  }
}
