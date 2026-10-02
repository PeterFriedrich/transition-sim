// Concepts 4.7 and 4.9 of docs/CONCEPTS_math15_review.md.
import * as D from '../model/decimals.js';
import * as F from '../model/fractions.js';
import { fitCanvas, theme, clear, text, fitText, para } from '../lib/canvas.js';
import { section, slider, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { frac } from '../lib/format.js';

export const equations = [
  { html: 'a/b = a ÷ b', what: 'divide the top by the bottom; add a point and zeros to the top as needed' },
  { html: 'remainder reaches 0 → terminating', what: '3/8 = 0.375' },
  { html: 'a remainder comes back → repeating', what: '1/3 = 0.333…' },
  { html: 'a simplified fraction terminates only if its denominator has just factors of 2 and 5', what: 'why 1/8 ends and 1/3 does not' },
];

export const prompts = [
  'Do 3 ÷ 8 by hand: 30 ÷ 8, then 60 ÷ 8, then 40 ÷ 8. Compare each line with the steps.',
  'Set 1/3. Which remainder keeps coming back? What does that do to the digits?',
  'Before setting it, decide whether 5/16 terminates or repeats. What about 5/12?',
  'Set 3/12. Its denominator has a factor of 3, yet it terminates. Why? (Look at the simplified fraction.)',
  'Know these cold: 1/2, 1/4, 3/4, 1/5, 1/8, 1/3, 2/3. Cover the answer and check each one.',
];

export const tallOnMobile = true;

export function mount(ui) {
  const box = section(ui.controls, 'Fraction');
  const n = slider(box, { label: 'Numerator', min: 1, max: 30, step: 1, value: 3 });
  const d = slider(box, { label: 'Denominator', min: 1, max: 30, step: 1, value: 8 });

  const out = readouts(ui.readouts, [
    { id: 'dec', label: 'Decimal' },
    { id: 'kind', label: 'Type' },
    { id: 'block', label: 'Repeating digits' },
    { id: 'low', label: 'Simplified fraction' },
    { id: 'factors', label: 'Its denominator' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const N = n.value;
    const Dn = d.value;
    const q = D.longDivision(N, Dn);
    const low = F.reduce([N, Dn]);
    const factors = D.primeFactors(low[1]);
    const dec = D.quotientString(q).replace('...', '…');
    const block = q.repeatAt >= 0 ? q.digits.slice(q.repeatAt).join('') : '';

    out.set('dec', dec);
    out.set('kind', q.terminates ? 'terminating' : 'repeating');
    out.set('block', block || 'none');
    out.set('low', frac(low));
    const den = factors.length > 1 ? `${low[1]} = ${factors.join(' × ')}` : String(low[1]);
    out.set('factors', den);

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    fitText(ctx, `${N}/${Dn} = ${N} ÷ ${Dn} = ${dec}`, w / 2, narrow ? 22 : 30, w - 2 * pad, { size: narrow ? 20 : 26, weight: 700, align: 'center' });

    // One line per digit: "30 ÷ 8 = 3 r 6".
    const lines = [{ str: `${N} ÷ ${Dn} = ${q.whole} r ${q.firstRem}`, note: q.steps.length ? 'point, then bring down a 0' : 'no remainder' }];
    q.steps.forEach((s, i) => {
      let note = '';
      if (s.rem === 0) note = 'remainder 0: done';
      else if (i === q.steps.length - 1 && q.repeatAt >= 0) note = `remainder ${s.rem} again: repeats`;
      lines.push({ str: `${s.from} ÷ ${Dn} = ${s.digit} r ${s.rem}`, note, digit: s.digit, repeat: q.repeatAt >= 0 && i >= q.repeatAt });
    });
    const top = narrow ? 44 : 60;
    const bottom = narrow ? 74 : 70;
    const maxRows = Math.floor((h - top - bottom) / (narrow ? 19 : 24));
    const shown = lines.slice(0, maxRows);
    const rowH = Math.min(narrow ? 24 : 30, (h - top - bottom) / Math.max(shown.length, 6));
    const xa = narrow ? pad + 4 : w * 0.18;
    shown.forEach((l, i) => {
      const y = top + rowH * (i + 0.5);
      const size = Math.min(narrow ? 14 : 18, rowH * 0.7);
      text(ctx, l.str, xa, y, { size, weight: 600, color: l.repeat ? th.seriesB : th.ink });
      if (l.note) fitText(ctx, l.note, xa + (narrow ? 132 : 190), y, w - pad - xa - (narrow ? 132 : 190), { size: narrow ? 10 : 13, color: th.muted, min: 7 });
    });
    if (lines.length > shown.length) text(ctx, `… ${lines.length - shown.length} more steps`, xa, top + rowH * (shown.length + 0.4), { size: narrow ? 11 : 13, color: th.muted });

    const yb = h - bottom + 20;
    let why;
    if (low[1] === 1) why = `${N}/${Dn} is the whole number ${low[0]}.`;
    else if (D.terminates(low[1])) why = `Simplified, the denominator is ${den}: only factors of 2 and 5, so it terminates.`;
    else {
      const other = [...new Set(factors.filter((p) => p !== 2 && p !== 5))].join(' and ');
      why = `Simplified, the denominator is ${den}: it has a factor of ${other}, so it repeats.`;
    }
    const y = para(ctx, why, w / 2, yb, w - 2 * pad, { size: narrow ? 12 : 15, weight: 600 });
    if (block) fitText(ctx, `Repeating digits: ${block}`, w / 2, y + 4, w - 2 * pad, { size: narrow ? 11 : 14, color: th.seriesB, align: 'center', min: 8 });
  }
}
