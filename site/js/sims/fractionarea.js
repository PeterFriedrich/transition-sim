// Concepts 3.5, 3.6 and 3.8 of docs/CONCEPTS_math15_review.md.
import * as F from '../model/fractions.js';
import * as I from '../model/integers.js';
import { fitCanvas, theme, clear, line, text, fitText, para } from '../lib/canvas.js';
import { section, slider, choice, toggle, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { frac, mixedStr } from '../lib/format.js';

export const equations = [
  { html: 'a/b × c/d = (a × c)/(b × d)', what: 'straight across; no common denominator needed' },
  { html: 'a/b ÷ c/d = a/b × d/c', what: 'multiply by the reciprocal of the second fraction' },
  { html: 'c/d × d/c = 1', what: 'why the reciprocal works' },
  { html: 'same signs → positive, different signs → negative', what: 'the integer sign rules' },
];

export const prompts = [
  'Set 2/3 × 9/10. Count the pieces shaded twice and the pieces in the whole square. Where do 18 and 30 come from?',
  'Multiply two fractions that are both less than 1. Is the answer bigger or smaller than each one? Why?',
  'Set 3/4 ÷ 2/3. 2/3 is a little smaller than 3/4, so predict: is the answer a bit over 1 or a bit under?',
  'In a division, which fraction gets flipped? Check with 5/6 ÷ 5/12.',
  'Make one fraction negative, then both. Predict the sign of the answer each time.',
];

export const legend = [
  { color: 'series-a', label: 'first fraction' },
  { color: 'series-b', label: 'second fraction' },
  { color: 'result', label: 'the answer' },
];

export const tallOnMobile = true;

export function mount(ui) {
  const one = section(ui.controls, 'First fraction');
  const n1 = slider(one, { label: 'Numerator', min: 1, max: 10, step: 1, value: 2 });
  const d1 = slider(one, { label: 'Denominator', min: 1, max: 10, step: 1, value: 3 });
  const neg1 = toggle(one, { label: 'Negative' });
  const two = section(ui.controls, 'Second fraction');
  const n2 = slider(two, { label: 'Numerator', min: 1, max: 10, step: 1, value: 9 });
  const d2 = slider(two, { label: 'Denominator', min: 1, max: 10, step: 1, value: 10 });
  const neg2 = toggle(two, { label: 'Negative' });
  const op = choice(section(ui.controls, 'What to do'), {
    label: 'Operation',
    options: [
      { label: 'Multiply', value: '×' },
      { label: 'Divide', value: '÷' },
    ],
    value: '×',
  });

  const out = readouts(ui.readouts, [
    { id: 'across', label: 'Straight across' },
    { id: 'low', label: 'Simplified' },
    { id: 'mixed', label: 'As a mixed number' },
    { id: 'sign', label: 'Signs' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const a = [neg1.value ? -n1.value : n1.value, d1.value];
    const b = [neg2.value ? -n2.value : n2.value, d2.value];
    const dividing = op.value === '÷';
    const res = dividing ? F.divide(a, b) : F.multiply(a, b);
    const plain = (f) => `${f[0] < 0 ? '−' : ''}${Math.abs(f[0])}/${f[1]}`;
    const wrap = (f) => (f[0] < 0 ? `(${plain(f)})` : plain(f));
    const steps = [`${plain(a)} ${op.value} ${wrap(b)}`];
    if (dividing) steps.push(`${plain(a)} × ${wrap(res.reciprocal)}`);
    for (const s of [plain(res.raw), frac(res.reduced), mixedStr(F.mixed(res.reduced))]) if (!steps.includes(s)) steps.push(s);

    out.set('across', plain(res.raw));
    out.set('low', frac(res.reduced));
    out.set('mixed', mixedStr(F.mixed(res.reduced)));
    out.set('sign', I.signRule(a[0], b[0]) === 'same' ? 'same signs → positive' : 'different signs → negative');

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    fitText(ctx, steps.join(' = '), w / 2, narrow ? 22 : 28, w - 2 * pad, { size: narrow ? 17 : 22, weight: 700, align: 'center', min: 9 });
    const top = narrow ? 44 : 56;
    const sa = [Math.abs(a[0]), a[1]];
    const sb = [Math.abs(b[0]), b[1]];
    const note = neg1.value || neg2.value ? ' The picture shows the sizes; the sign rule gives the sign.' : '';

    if (!dividing) {
      if (sa[0] > sa[1] || sb[0] > sb[1]) {
        text(ctx, 'The square shows fractions up to 1.', w / 2, h / 2, { size: narrow ? 12 : 14, color: th.muted, align: 'center' });
        return;
      }
      // A unit square: columns for the first fraction, rows for the second.
      const side = Math.min(w - 2 * pad - (narrow ? 40 : 120), h - top - (narrow ? 84 : 64));
      const x0 = (w - side) / 2;
      const y0 = top + 22;
      const cw = side / sa[1];
      const rh = side / sb[1];
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = th.seriesA;
      ctx.fillRect(x0, y0, cw * sa[0], side);
      ctx.fillStyle = th.seriesB;
      ctx.fillRect(x0, y0, side, rh * sb[0]);
      ctx.globalAlpha = 1;
      ctx.fillStyle = th.result;
      ctx.fillRect(x0, y0, cw * sa[0], rh * sb[0]);
      ctx.globalAlpha = 1;
      for (let i = 1; i < sa[1]; i++) line(ctx, x0 + i * cw, y0, x0 + i * cw, y0 + side, { color: th.muted, width: 1 });
      for (let j = 1; j < sb[1]; j++) line(ctx, x0, y0 + j * rh, x0 + side, y0 + j * rh, { color: th.muted, width: 1 });
      ctx.strokeStyle = th.ink;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x0, y0, side, side);
      text(ctx, `${sa[0]}/${sa[1]} of the width`, x0 + (cw * sa[0]) / 2, y0 - 10, { size: narrow ? 11 : 13, color: th.seriesA, align: 'center', weight: 600 });
      ctx.save();
      ctx.translate(x0 - 10, y0 + (rh * sb[0]) / 2);
      ctx.rotate(-Math.PI / 2);
      text(ctx, `${sb[0]}/${sb[1]} of the height`, 0, 0, { size: narrow ? 11 : 13, color: th.seriesB, align: 'center', weight: 600 });
      ctx.restore();
      const size = Math.abs(res.raw[0]);
      para(ctx, `${size} of the ${res.raw[1]} pieces are shaded twice: ${size}/${res.raw[1]} of the square.${note}`, w / 2, y0 + side + 18, w - 2 * pad, { size: narrow ? 11 : 13, color: th.muted });
      return;
    }

    // Division: how many of the second fraction fit in the first?
    const q = F.divide(sa, sb);
    const count = F.value(q.reduced);
    const full = Math.floor(count + 1e-9);
    const span = Math.max(F.value(sa), (full + (count > full ? 1 : 0)) * F.value(sb), 1);
    const x0 = pad + 4;
    const scale = (w - 2 * pad - 8) / span;
    const y1 = top + (narrow ? 50 : 60);
    const barH = narrow ? 30 : 38;
    text(ctx, `${sa[0]}/${sa[1]}`, x0, y1 - 12, { size: narrow ? 12 : 14, color: th.seriesA, weight: 700 });
    ctx.fillStyle = th.seriesA;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x0, y1, F.value(sa) * scale, barH);
    ctx.globalAlpha = 1;
    const y2 = y1 + barH + (narrow ? 34 : 44);
    text(ctx, `pieces of size ${sb[0]}/${sb[1]}`, x0, y2 - 12, { size: narrow ? 12 : 14, color: th.seriesB, weight: 700 });
    const chunk = F.value(sb) * scale;
    const shownChunks = Math.min(full + 1, 60);
    for (let i = 0; i < shownChunks; i++) {
      const part = i < full ? 1 : count - full;
      ctx.fillStyle = th.seriesB;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x0 + i * chunk, y2, chunk * part, barH);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = th.ink;
      ctx.lineWidth = 1;
      if (chunk >= 3 && (i < full || part > 0 || i === 0)) ctx.strokeRect(x0 + i * chunk, y2, chunk, barH);
    }
    line(ctx, x0 + F.value(sa) * scale, y1 - 4, x0 + F.value(sa) * scale, y2 + barH + 4, { color: th.result, width: 2, dash: [4, 3] });
    const y3 = y2 + barH + 18;
    line(ctx, x0, y3, x0 + span * scale, y3, { color: th.muted, width: 1 });
    for (let v = 0; v <= Math.floor(span); v++) {
      line(ctx, x0 + v * scale, y3 - 4, x0 + v * scale, y3 + 4, { color: th.muted, width: 1 });
      text(ctx, String(v), x0 + v * scale, y3 + 15, { size: 11, color: th.muted, align: 'center' });
    }
    para(ctx, `How many ${sb[0]}/${sb[1]}s fit in ${sa[0]}/${sa[1]}? ${mixedStr(F.mixed(q.reduced))}.${note}`, w / 2, y3 + 42, w - 2 * pad, { size: narrow ? 12 : 15, weight: 600 });
  }
}
