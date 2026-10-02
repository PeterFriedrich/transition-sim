// Concept 1.4 of docs/CONCEPTS_math15_review.md.
import * as I from '../model/integers.js';
import { fitCanvas, theme, clear, line, text, para } from '../lib/canvas.js';
import { section, slider, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { signed, bracketed } from '../lib/format.js';

export const equations = [
  { html: 'same signs → positive', what: '(−6)(−4) = 24 and (−12) ÷ (−3) = 4' },
  { html: 'different signs → negative', what: '(−6)(4) = −24 and 12 ÷ (−3) = −4' },
  { html: 'a × b = c  means  c ÷ b = a', what: 'division undoes multiplication, so it follows the same sign rule' },
];

export const prompts = [
  'Set the second factor to −2 and read down the column: 3(−2), 2(−2), 1(−2), 0(−2). What must (−1)(−2) be for the pattern to keep going?',
  'Predict the sign of (−6)(−4), then of (−6)(4). Set them and check.',
  'Make the second factor positive. Which rows are negative now? Which rows were negative when it was negative?',
  'Pick a highlighted row and write its two division facts. Do their signs follow the same rule?',
  'What happens to every row when a factor is 0?',
];

export const legend = [
  { color: 'series-a', label: 'positive product' },
  { color: 'series-b', label: 'negative product' },
];

export const tallOnMobile = true;

const TOP = 6;

export function mount(ui) {
  const box = section(ui.controls, 'Factors');
  const a = slider(box, { label: 'First factor (the highlighted row)', min: -TOP, max: TOP, step: 1, value: -1 });
  const b = slider(box, { label: 'Second factor', min: -9, max: 9, step: 1, value: -2 });

  const out = readouts(ui.readouts, [
    { id: 'product', label: 'Product' },
    { id: 'rule', label: 'Signs' },
    { id: 'div1', label: 'Division fact' },
    { id: 'div2', label: 'Division fact' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const A = a.value;
    const B = b.value;
    const rows = I.productPattern(B, TOP, -TOP);
    const product = rows.find((r) => r.k === A).product;
    const kind = I.signRule(A, B);
    const ruleText = { same: 'same signs → positive', different: 'different signs → negative', zero: 'a factor is 0 → 0' }[kind];

    out.set('product', `${bracketed(A)} × ${bracketed(B)} = ${signed(product)}`);
    out.set('rule', ruleText);
    const fact = (divisor, quotient) => (I.divide(product, divisor) ? `${signed(product)} ÷ ${bracketed(divisor)} = ${signed(quotient)}` : 'cannot divide by 0');
    out.set('div1', fact(B, A));
    out.set('div2', fact(A, B));

    const narrow = w < 520;
    const pad = narrow ? 10 : 28;
    const step = B === 0 ? 'stays 0' : `goes ${B < 0 ? 'up' : 'down'} by ${Math.abs(B)}`;
    const top = para(ctx, `Each row down, the first factor drops by 1, so the product ${step}.`, w / 2, 20, w - 2 * pad, { size: narrow ? 12 : 15, color: th.muted });

    const rowH = (h - top - 10) / rows.length;
    const labelW = narrow ? 118 : 190;
    const x0 = pad + labelW;
    const mid = x0 + (w - pad - x0) / 2;
    const half = (w - pad - x0) / 2 - (narrow ? 22 : 30);
    const max = Math.max(1, TOP * Math.abs(B));
    line(ctx, mid, top, mid, h - 10, { color: th.muted, width: 1 });

    rows.forEach((r, i) => {
      const y = top + rowH * (i + 0.5);
      const on = r.k === A;
      if (on) {
        ctx.fillStyle = th.grid;
        ctx.fillRect(pad - 4, y - rowH / 2 + 1, w - 2 * pad + 8, rowH - 2);
      }
      const label = `${bracketed(r.k)} × ${bracketed(B)} = ${signed(r.product)}`;
      text(ctx, label, pad, y, { size: Math.min(narrow ? 12 : 15, rowH * 0.6), weight: on ? 750 : 500, color: on ? th.ink : th.muted });
      const len = (r.product / max) * half;
      ctx.fillStyle = r.product < 0 ? th.seriesB : th.seriesA;
      const bh = Math.min(16, rowH * 0.55);
      ctx.globalAlpha = on ? 1 : 0.55;
      ctx.fillRect(Math.min(mid, mid + len), y - bh / 2, Math.abs(len), bh);
      ctx.globalAlpha = 1;
      if (r.product !== 0 && rowH >= 14) {
        text(ctx, signed(r.product), mid + len + (len < 0 ? -4 : 4), y, {
          size: narrow ? 10 : 12, color: th.muted, align: len < 0 ? 'right' : 'left', weight: on ? 700 : 500,
        });
      }
    });
  }
}
