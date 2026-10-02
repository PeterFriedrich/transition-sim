// Concepts 3.1–3.4 of docs/CONCEPTS_math15_review.md.
import * as F from '../model/fractions.js';
import { fitCanvas, theme, clear, text, fitText } from '../lib/canvas.js';
import { section, slider, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { frac, mixedStr } from '../lib/format.js';

export const equations = [
  { html: 'a/b = a pieces of size 1/b', what: 'one number, with one place on the number line' },
  { html: 'a/b = (a × k)/(b × k)', what: 'equivalent fractions: multiply or divide top and bottom by the same number' },
  { html: 'a/c ± b/c = (a ± b)/c', what: 'common denominator first (use the LCM); only the numerators combine' },
  { html: 'simplify by dividing top and bottom by the GCF', what: '18/24 → 3/4' },
];

export const prompts = [
  'Set 2/3 + 3/4. Before looking, what will the common denominator be? How many twelfths is each fraction?',
  'Someone adds the tops and the bottoms: 2/3 + 3/4 = 5/7. Compare 5/7 with the bars. Why can it not be right?',
  'Switch to “Compare” and order 3/5, 5/8 and 2/3, two at a time.',
  'Keep the numerators the same and make one denominator bigger. Which fraction is larger, and why?',
  'Find a subtraction whose answer simplifies. What did you divide the top and bottom by?',
];

export const legend = [
  { color: 'series-a', label: 'first fraction' },
  { color: 'series-b', label: 'second fraction' },
];

export const tallOnMobile = true;

const MAX_WHOLES = 3;

export function mount(ui) {
  const one = section(ui.controls, 'First fraction');
  const n1 = slider(one, { label: 'Numerator', min: 0, max: 12, step: 1, value: 2 });
  const d1 = slider(one, { label: 'Denominator', min: 1, max: 12, step: 1, value: 3 });
  const two = section(ui.controls, 'Second fraction');
  const n2 = slider(two, { label: 'Numerator', min: 0, max: 12, step: 1, value: 3 });
  const d2 = slider(two, { label: 'Denominator', min: 1, max: 12, step: 1, value: 4 });
  const op = choice(section(ui.controls, 'What to do'), {
    label: 'Operation',
    options: [
      { label: 'Add', value: '+' },
      { label: 'Subtract', value: '−' },
      { label: 'Compare', value: '?' },
    ],
    value: '+',
  });

  const out = readouts(ui.readouts, [
    { id: 'den', label: 'Common denominator (LCM)' },
    { id: 'a', label: 'First fraction' },
    { id: 'b', label: 'Second fraction' },
    { id: 'raw', label: 'Result' },
    { id: 'low', label: 'Simplified' },
    { id: 'mixed', label: 'As a mixed number' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const a = [n1.value, d1.value];
    const b = [n2.value, d2.value];
    const c = F.common(a, b);
    const mode = op.value;
    const res = mode === '+' ? F.add(a, b) : mode === '−' ? F.subtract(a, b) : null;

    out.set('den', String(c.den));
    out.set('a', `${frac(a)} = ${c.a[0]}/${c.den}`);
    out.set('b', `${frac(b)} = ${c.b[0]}/${c.den}`);
    let working;
    if (res) {
      const rawStr = `${res.raw[0] < 0 ? '−' : ''}${Math.abs(res.raw[0])}/${c.den}`;
      const steps = [`${a[0]}/${a[1]} ${mode} ${b[0]}/${b[1]}`, `${c.a[0]}/${c.den} ${mode} ${c.b[0]}/${c.den}`, rawStr];
      const low = frac(res.reduced);
      const mx = mixedStr(F.mixed(res.reduced));
      for (const s of [low, mx]) if (!steps.includes(s)) steps.push(s);
      working = steps.filter((s, i) => i === 0 || s !== steps[i - 1]).join(' = ');
      out.set('raw', rawStr);
      out.set('low', low);
      out.set('mixed', mx);
    } else {
      const sign = ['<', '=', '>'][F.compare(a, b) + 1];
      working = `${a[0]}/${a[1]} = ${c.a[0]}/${c.den}   and   ${b[0]}/${b[1]} = ${c.b[0]}/${c.den},   so   ${a[0]}/${a[1]} ${sign} ${b[0]}/${b[1]}`;
      out.set('raw', `${frac(a)} ${sign} ${frac(b)}`);
      out.set('low', '—');
      out.set('mixed', '—');
    }

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    fitText(ctx, working, w / 2, narrow ? 22 : 28, w - 2 * pad, { size: narrow ? 17 : 22, weight: 700, align: 'center', min: 9 });

    const resVal = res ? Math.abs(F.value(res.raw)) : 0;
    const wholes = Math.max(1, Math.ceil(Math.max(F.value(a), F.value(b), resVal) - 1e-9));
    if (wholes > MAX_WHOLES) {
      text(ctx, `Bars are drawn up to ${MAX_WHOLES} wholes. Use smaller fractions to see them.`, w / 2, h / 2, { size: narrow ? 12 : 14, color: th.muted, align: 'center' });
      return;
    }
    const labelW = narrow ? 58 : 84;
    const x0 = pad + labelW;
    const unit = (w - pad - x0) / wholes;
    const rows = [
      { label: `${a[0]}/${a[1]}`, parts: [{ n: a[0], color: th.seriesA }], d: a[1] },
      { label: `${b[0]}/${b[1]}`, parts: [{ n: b[0], color: th.seriesB }], d: b[1] },
      { label: `${c.a[0]}/${c.den}`, parts: [{ n: c.a[0], color: th.seriesA }], d: c.den, note: `× ${c.ka} top and bottom` },
      { label: `${c.b[0]}/${c.den}`, parts: [{ n: c.b[0], color: th.seriesB }], d: c.den, note: `× ${c.kb} top and bottom` },
    ];
    if (res && mode === '+') rows.push({ label: `${res.raw[0]}/${c.den}`, parts: [{ n: c.a[0], color: th.seriesA }, { n: c.b[0], color: th.seriesB }], d: c.den, note: 'put together' });
    if (res && mode === '−' && res.raw[0] >= 0) {
      rows.push({ label: `${res.raw[0]}/${c.den}`, parts: [{ n: res.raw[0], color: th.seriesA }, { n: c.b[0], color: th.seriesB, ghost: true }], d: c.den, note: `${c.b[0]} pieces taken away` });
    }
    const top = narrow ? 44 : 56;
    const rowH = Math.min(narrow ? 70 : 84, (h - top - 8) / rows.length);
    const barH = Math.min(34, rowH * 0.46);
    rows.forEach((r, i) => {
      const y = top + rowH * i + (rowH - barH) / 2 + 6;
      text(ctx, r.label, pad, y + barH / 2, { size: narrow ? 14 : 17, weight: 700 });
      if (r.note) text(ctx, r.note, x0, y - 9, { size: narrow ? 10 : 12, color: th.muted });
      const piece = unit / r.d;
      let k = 0;
      for (const part of r.parts) {
        ctx.fillStyle = part.color;
        ctx.globalAlpha = part.ghost ? 0.2 : 0.85;
        ctx.fillRect(x0 + k * piece, y, part.n * piece, barH);
        k += part.n;
      }
      ctx.globalAlpha = 1;
      ctx.strokeStyle = th.muted;
      ctx.lineWidth = 1;
      if (piece >= 3) {
        ctx.beginPath();
        for (let j = 1; j < r.d * wholes; j++) {
          if (j % r.d === 0) continue;
          ctx.moveTo(x0 + j * piece, y);
          ctx.lineTo(x0 + j * piece, y + barH);
        }
        ctx.globalAlpha = 0.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.strokeStyle = th.ink;
      ctx.lineWidth = 1.5;
      for (let j = 0; j < wholes; j++) ctx.strokeRect(x0 + j * unit, y, unit, barH);
    });
    if (res && mode === '−' && res.raw[0] < 0) {
      text(ctx, `The second fraction is larger, so the answer is negative: ${frac(res.reduced)}.`, w / 2, h - 18, { size: narrow ? 11 : 13, color: th.muted, align: 'center' });
    }
    for (let j = 0; j <= wholes; j++) text(ctx, String(j), x0 + j * unit, top - 2, { size: 11, color: th.muted, align: 'center' });
  }
}
