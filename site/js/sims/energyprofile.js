// Concept 0.1 of docs/CONCEPTS_science10_unitA.md.
import * as E from '../model/energy.js';
import { fitCanvas, theme, clear, line, text, arrow, para } from '../lib/canvas.js';
import { section, slider, toggle, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'products lower than reactants → energy is released', what: 'bonds formed are stronger than bonds broken' },
  { html: 'activation energy = height of the barrier above the reactants', what: 'what the reaction needs to get started' },
  { html: 'favourable ≠ fast', what: 'H₂ + O₂ is favourable, and waits for a spark' },
  { html: 'a catalyst lowers the barrier, not the energy change', what: 'it changes the speed, not whether the reaction is favourable' },
];

export const prompts = [
  'Make a reaction that is favourable but slow. Which slider decides “favourable”, and which decides “slow”?',
  'Keep the products low and shrink the barrier. What changes in the readouts, and what stays the same?',
  'Turn on the catalyst. Does the energy released change? What does?',
  'Raise the products above the reactants. Where does the extra energy have to come from?',
  'H₂ and O₂ can sit together for years, then explode with one spark. Draw that profile with the sliders.',
];

export const tallOnMobile = false;

export function mount(ui) {
  const box = section(ui.controls, 'Reaction');
  const prod = slider(box, { label: 'Product energy (reactants are at 0)', min: -80, max: 80, step: 5, value: -50 });
  const bar = slider(box, { label: 'Barrier (activation energy)', min: 5, max: 100, step: 5, value: 60 });
  const cat = toggle(box, { label: 'Add a catalyst' });

  const out = readouts(ui.readouts, [
    { id: 'change', label: 'Energy change' },
    { id: 'act', label: 'Activation energy' },
    { id: 'fav', label: 'By energy' },
    { id: 'speed', label: 'Speed' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const P = prod.value;
    const p = E.profile(P, bar.value, cat.value);
    const size = Math.abs(p.change);
    const fav = p.change < 0 ? 'favourable' : p.change > 0 ? 'uphill' : 'no change';
    out.set('change', p.change < 0 ? `releases ${size}` : p.change > 0 ? `absorbs ${size}` : '0');
    out.set('act', String(p.activation));
    out.set('fav', fav);
    out.set('speed', p.fast ? 'fast' : 'slow');

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    let verdict;
    if (p.change < 0) verdict = p.fast ? 'Favourable and fast: it releases energy, and the barrier is low.' : 'Favourable but slow: it releases energy, but it needs a push to get over the barrier (heat, a spark, light, a catalyst).';
    else if (p.change > 0) verdict = 'Uphill: the products are higher in energy, so energy has to keep coming in. Energy alone does not favour it.';
    else verdict = 'No energy change: energy does not favour either side.';
    const top = para(ctx, verdict, w / 2, narrow ? 18 : 24, w - 2 * pad, { size: narrow ? 12 : 15, weight: 600 }) + 6;

    const left = pad + (narrow ? 30 : 46);
    const right = w - pad;
    const bottom = h - (narrow ? 30 : 38);
    const lo = -90;
    const hi = Math.max(110, p.peak + 15);
    const X = (x) => left + x * (right - left);
    const Y = (e) => bottom - ((e - lo) / (hi - lo)) * (bottom - top);
    line(ctx, left, top, left, bottom, { color: th.muted });
    line(ctx, left, bottom, right, bottom, { color: th.muted });
    text(ctx, 'reaction progress →', (left + right) / 2, bottom + 16, { size: narrow ? 10 : 12, color: th.muted, align: 'center' });
    ctx.save();
    ctx.translate(left - (narrow ? 20 : 30), (top + bottom) / 2);
    ctx.rotate(-Math.PI / 2);
    text(ctx, 'energy →', 0, 0, { size: narrow ? 10 : 12, color: th.muted, align: 'center' });
    ctx.restore();

    line(ctx, left, Y(0), right, Y(0), { color: th.grid, dash: [4, 4] });
    line(ctx, X(0.5), Y(P), right, Y(P), { color: th.grid, dash: [4, 4] });
    ctx.strokeStyle = th.ink;
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      const y = Y(E.curve(x, P, p.peak));
      i ? ctx.lineTo(X(x), y) : ctx.moveTo(X(x), y);
    }
    ctx.stroke();
    const small = narrow ? 11 : 13;
    text(ctx, 'reactants', X(0.02), Y(0) - 12, { size: small, weight: 700, color: th.seriesA });
    text(ctx, 'products', X(0.98), Y(P) - 12, { size: small, weight: 700, color: th.seriesB, align: 'right' });
    // Barrier, measured from the reactants up to the peak.
    arrow(ctx, X(0.3), Y(0), 0, Y(p.peak) - Y(0), { color: th.danger, width: 2, head: 7 });
    text(ctx, `barrier ${p.activation}`, X(0.3) - 6, (Y(0) + Y(p.peak)) / 2, { size: small, color: th.danger, align: 'right', weight: 600 });
    if (p.change !== 0) {
      arrow(ctx, X(0.72), Y(0), 0, Y(P) - Y(0), { color: th.result, width: 2, head: 7 });
      text(ctx, p.change < 0 ? `releases ${size}` : `absorbs ${size}`, X(0.72) - 6, (Y(0) + Y(P)) / 2, { size: small, color: th.result, align: 'right', weight: 600 });
    }
    if (p.raised) text(ctx, 'the barrier cannot sit below the products', X(0.5), Y(p.peak) - 12, { size: narrow ? 10 : 12, color: th.muted, align: 'center' });
    else if (cat.value) text(ctx, 'with a catalyst', X(0.5), Y(p.peak) - 12, { size: narrow ? 10 : 12, color: th.muted, align: 'center' });
  }
}
