// Concept 3.4 of docs/CONCEPTS_science10_unitA.md.
import * as M from '../model/molecular.js';
import { fitCanvas, theme, clear, text, fitText, para } from '../lib/canvas.js';
import { section, slider, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'nonmetal + nonmetal → molecular', what: 'electrons are shared; there are no ions' },
  { html: 'the prefix gives the subscript; do not reduce', what: 'mono, di, tri, tetra, penta, hexa, hepta, octa, nona, deca' },
  { html: 'drop “mono” on the first element only', what: 'CO is carbon monoxide, not monocarbon monoxide' },
  { html: 'drop the prefix’s final a or o before a vowel', what: 'monoxide, tetroxide, pentoxide' },
];

export const prompts = [
  'Name N₂O₅ before you set it. Which letter gets dropped, and why?',
  'Set CO and then CO₂. Why does this pair of elements need prefixes at all?',
  'N₂O₄ is not reduced to NO₂. What would be lost if it were?',
  'Is PCl₅ ionic or molecular? What about AlCl₃? How do you tell from the elements?',
  'Write the formula for sulfur hexafluoride, then check.',
];

export const legend = [
  { color: 'series-a', label: 'first element' },
  { color: 'series-b', label: 'second element' },
];

export const tallOnMobile = false;

const EXAMPLES = [['C', 1, 'O', 2], ['C', 1, 'O', 1], ['N', 2, 'O', 1], ['N', 2, 'O', 4], ['N', 2, 'O', 5], ['P', 1, 'Cl', 5], ['S', 1, 'F', 6], ['C', 1, 'Cl', 4], ['P', 4, 'O', 10], ['S', 1, 'O', 3]];

export function mount(ui) {
  const pick = choice(section(ui.controls, 'Real compounds'), {
    label: 'Examples',
    options: EXAMPLES.map((e) => ({ label: `${M.formula(...e)}`, value: e.join() })),
    value: EXAMPLES[4].join(),
  });
  const box = section(ui.controls, 'Or build a formula');
  const a = choice(box, { label: 'First element', options: Object.entries(M.FIRST).map(([s, n]) => ({ label: `${n} (${s})`, value: s })), value: 'N' });
  const na = slider(box, { label: 'How many', min: 1, max: 10, step: 1, value: 2 });
  const b = choice(box, { label: 'Second element', options: [['O', 'oxygen'], ['F', 'fluorine'], ['Cl', 'chlorine']].map(([s, n]) => ({ label: `${n} (${s})`, value: s })), value: 'O' });
  const nb = slider(box, { label: 'How many', min: 1, max: 10, step: 1, value: 5 });
  pick.onChange((v) => {
    const [ea, ena, eb, enb] = v.split(',');
    a.value = ea;
    na.value = Number(ena);
    b.value = eb;
    nb.value = Number(enb);
  });

  const out = readouts(ui.readouts, [
    { id: 'type', label: 'Type' },
    { id: 'formula', label: 'Formula' },
    { id: 'name', label: 'Name' },
    { id: 'real', label: 'A listed real compound?' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const args = [a.value, na.value, b.value, nb.value];
    const f = M.formula(...args);
    const name = M.name(...args);
    const parts = M.nameParts(...args);
    const real = EXAMPLES.some((e) => e.join() === args.join());
    out.set('type', M.compoundType(false));
    out.set('formula', f);
    out.set('name', name);
    out.set('real', real ? 'yes' : 'not on the list');

    const narrow = w < 520;
    const pad = narrow ? 10 : 32;
    fitText(ctx, f, w / 2, narrow ? 28 : 38, w - 2 * pad, { size: narrow ? 30 : 42, weight: 750, align: 'center' });
    fitText(ctx, name, w / 2, narrow ? 60 : 80, w - 2 * pad, { size: narrow ? 16 : 22, weight: 650, align: 'center', color: th.result });

    // The atoms, counted out. No shape is implied.
    const total = na.value + nb.value;
    const top = narrow ? 86 : 112;
    const r = Math.min(narrow ? 13 : 20, (w - 2 * pad) / (total * 2.4 + 1));
    const span = total * r * 2.4 + r * 1.2;
    let x = (w - span) / 2 + r * 1.2;
    const cy = top + r + 4;
    for (let i = 0; i < total; i++) {
      const first = i < na.value;
      if (i === na.value) x += r * 1.2;
      ctx.fillStyle = first ? th.seriesA : th.seriesB;
      ctx.beginPath();
      ctx.arc(x, cy, r, 0, Math.PI * 2);
      ctx.fill();
      text(ctx, first ? a.value : b.value, x, cy, { size: r * 0.9, weight: 700, align: 'center', color: th.surface });
      x += r * 2.4;
    }
    const y = cy + r + (narrow ? 26 : 34);
    const small = narrow ? 12 : 15;
    const p1 = parts.first.droppedMono ? `1 ${a.value}: “mono” is dropped on the first element → ${parts.first.root}` : `${na.value} ${a.value}: ${M.PREFIX[na.value]} + ${parts.first.root} → ${parts.first.prefix}${parts.first.root}`;
    const full = M.PREFIX[nb.value];
    const p2 = `${nb.value} ${b.value}: ${full} + ${parts.second.root} → ${parts.second.prefix}${parts.second.root}${parts.second.elided ? ` (the final “${full.slice(-1)}” is dropped before a vowel)` : ''}`;
    let yy = para(ctx, p1, w / 2, y, w - 2 * pad, { size: small, weight: 600 }) + 6;
    yy = para(ctx, p2, w / 2, yy, w - 2 * pad, { size: small, weight: 600 }) + 10;
    const note = `Two nonmetals: a molecular compound, so prefixes and no reducing.${real ? '' : ' Not every combination you can build here is a real compound; the naming rule works the same way.'}`;
    para(ctx, note, w / 2, yy, w - 2 * pad, { size: narrow ? 11 : 13, color: th.muted });
  }
}
