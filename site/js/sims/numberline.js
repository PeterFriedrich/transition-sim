// Concepts 1.1–1.3 of docs/CONCEPTS_math15_review.md.
import * as I from '../model/integers.js';
import { fitCanvas, theme, clear, line, text, arrow, fitText, para } from '../lib/canvas.js';
import { section, slider, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { signed, bracketed } from '../lib/format.js';

export const equations = [
  { html: 'sign = direction, size = distance from 0', what: 'what an integer means' },
  { html: 'same signs: add the sizes, keep the sign', what: '(−4) + (−3) = −7' },
  { html: 'different signs: subtract the sizes, keep the sign of the larger size', what: '(−9) + 5 = −4' },
  { html: 'a − b = a + (−b)', what: 'subtracting is adding the opposite: 5 − (−3) = 5 + 3 = 8' },
];

export const prompts = [
  'Predict (−9) + 5 before you set it. Which way does the second arrow point, and which side of 0 do you land on?',
  'Set (−4) + (−3). Someone says “two negatives make a positive, so it is 7”. What does the number line show instead?',
  'Set 5 − (−3). Why does taking away a debt of 3 leave you 3 higher? Watch which way the second arrow goes.',
  'Find two different subtractions that both give −2. What do their arrows have in common?',
  'Set the second number to 0, then to the opposite of the first. What happens each time?',
];

export const legend = [
  { color: 'series-a', label: 'start at the first number' },
  { color: 'series-b', label: 'the move' },
  { color: 'result', label: 'where you land' },
];

export const tallOnMobile = false;

export function mount(ui) {
  const box = section(ui.controls, 'Expression');
  const a = slider(box, { label: 'First number', min: -10, max: 10, step: 1, value: 5 });
  const op = choice(box, {
    label: 'Operation',
    options: [
      { label: 'Add (+)', value: '+' },
      { label: 'Subtract (−)', value: '−' },
    ],
    value: '−',
  });
  const b = slider(box, { label: 'Second number', min: -10, max: 10, step: 1, value: -3 });

  const out = readouts(ui.readouts, [
    { id: 'expr', label: 'Expression' },
    { id: 'add', label: 'As an addition' },
    { id: 'sizes', label: 'Sizes' },
    { id: 'result', label: 'Result' },
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
    const move = op.value === '−' ? I.subtractAsAdd(A, B).opposite : B;
    const rule = I.addRule(A, move);
    const expr = `${signed(A)} ${op.value} ${bracketed(B)}`;
    const asAdd = `${signed(A)} + ${bracketed(move)}`;
    const working = op.value === '−' ? `${expr} = ${asAdd} = ${signed(rule.result)}` : `${expr} = ${signed(rule.result)}`;

    out.set('expr', expr);
    out.set('add', asAdd);
    out.set('sizes', `${rule.sizes[0]} and ${rule.sizes[1]}`);
    out.set('result', signed(rule.result));

    const narrow = w < 520;
    const pad = narrow ? 14 : 36;
    fitText(ctx, working, w / 2, h * 0.12, w - 2 * pad, { size: narrow ? 20 : 26, weight: 700, align: 'center' });
    const sign = (x) => (x < 0 ? 'negative' : 'positive');
    let why;
    if (rule.kind === 'zero') why = 'Adding 0 does not move you.';
    else if (rule.kind === 'same') why = `Same signs: add the sizes (${rule.sizes[0]} + ${rule.sizes[1]} = ${rule.combined}), keep the sign (${sign(A)}).`;
    else if (rule.combined === 0) why = 'Different signs with equal sizes: the moves cancel, and you land on 0.';
    else {
      const big = Math.max(...rule.sizes);
      const small = Math.min(...rule.sizes);
      why = `Different signs: subtract the sizes (${big} − ${small} = ${rule.combined}), keep the sign of the larger size (${sign(rule.result)}).`;
    }
    if (op.value === '−') why = `Subtracting ${bracketed(B)} is adding its opposite, ${bracketed(move)}. ${why}`;
    para(ctx, why, w / 2, h * 0.12 + (narrow ? 28 : 36), w - 2 * pad, { size: narrow ? 12 : 14, color: th.muted });

    // The line runs −20…20 so every result fits.
    const y = h * 0.74;
    const x = (v) => pad + ((v + 20) / 40) * (w - 2 * pad);
    line(ctx, pad - 6, y, w - pad + 6, y, { color: th.ink, width: 1.5 });
    for (let v = -20; v <= 20; v++) {
      const major = v % 5 === 0;
      line(ctx, x(v), y - (major ? 7 : 4), x(v), y + (major ? 7 : 4), { color: v === 0 ? th.ink : th.muted, width: v === 0 ? 2 : 1 });
      if (major) text(ctx, signed(v), x(v), y + 20, { size: narrow ? 10 : 12, color: v === 0 ? th.ink : th.muted, align: 'center', weight: v === 0 ? 700 : 500 });
    }

    const y1 = y - (narrow ? 56 : 70);
    const y2 = y - (narrow ? 28 : 34);
    arrow(ctx, x(0), y1, x(A) - x(0), 0, { color: th.seriesA, width: 3 });
    text(ctx, `start at ${signed(A)}`, (x(0) + x(A)) / 2, y1 - 13, { size: narrow ? 11 : 13, color: th.seriesA, align: 'center', weight: 600 });
    arrow(ctx, x(A), y2, x(rule.result) - x(A), 0, { color: th.seriesB, width: 3 });
    const dir = move === 0 ? 'stay' : `${Math.abs(move)} ${move < 0 ? 'left' : 'right'}`;
    text(ctx, dir, (x(A) + x(rule.result)) / 2, y2 - 13, { size: narrow ? 11 : 13, color: th.seriesB, align: 'center', weight: 600 });
    line(ctx, x(A), y1, x(A), y2, { color: th.grid, width: 1, dash: [3, 3] });

    ctx.fillStyle = th.result;
    ctx.beginPath();
    ctx.arc(x(rule.result), y, 6, 0, Math.PI * 2);
    ctx.fill();
    line(ctx, x(rule.result), y2, x(rule.result), y - 6, { color: th.result, width: 1, dash: [3, 3] });
    text(ctx, signed(rule.result), x(rule.result), y + 40, { size: narrow ? 14 : 16, color: th.result, align: 'center', weight: 750 });
  }
}
