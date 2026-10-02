// Concepts 4.3–4.5 and 4.11 of docs/CONCEPTS_math15_review.md.
import * as D from '../model/decimals.js';
import * as I from '../model/integers.js';
import { fitCanvas, theme, clear, line, text, fitText, para } from '../lib/canvas.js';
import { section, textbox, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { signed, bracketed } from '../lib/format.js';

export const equations = [
  { html: '+ and −: line up the points, pad with zeros, work right to left', what: '4.70 + 0.35 = 5.05' },
  { html: '×: multiply as whole numbers, then count the decimal places of both factors', what: '0.3 × 0.04 → 12 → 3 places → 0.012' },
  { html: '÷: shift the point in both numbers until the divisor is whole', what: '4.5 ÷ 0.3 = 45 ÷ 3 = 15' },
  { html: 'negatives follow the integer sign rules', what: '(−0.4)(0.5) = −0.2' },
];

export const prompts = [
  'Set 3 − 0.84. What do you have to write before you can subtract? Check the padded column.',
  'Predict the number of decimal places in 0.6 × 0.07 before you look. Should the answer be smaller than both factors?',
  'Set 2.4 ÷ 0.08. How many places does the point move, and in which numbers?',
  'Someone moves the point only in the divisor: 4.5 ÷ 0.3 becomes 4.5 ÷ 3. How far off is their answer?',
  'Make one number negative, then both. Predict the sign each time for × and ÷.',
];

export const tallOnMobile = false;

export function mount(ui) {
  const box = section(ui.controls, 'Calculation');
  const ta = textbox(box, { label: 'First number', value: '4.7' });
  const op = choice(box, {
    label: 'Operation',
    options: [
      { label: 'Add (+)', value: '+' },
      { label: 'Subtract (−)', value: '−' },
      { label: 'Multiply (×)', value: '×' },
      { label: 'Divide (÷)', value: '÷' },
    ],
    value: '+',
  });
  const tb = textbox(box, { label: 'Second number', value: '0.35' });

  const out = readouts(ui.readouts, [
    { id: 'expr', label: 'Calculation' },
    { id: 'how', label: 'Rewritten' },
    { id: 'result', label: 'Result' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  const read = (t) => {
    const x = D.parse(t.value);
    t.setError(x ? '' : 'Up to 4 digits before the point and 4 after');
    return x;
  };
  const S = (x, places) => signed(D.str(x, places));
  const size = (x) => ({ n: Math.abs(x.n), dp: x.dp });

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const a = read(ta);
    const b = read(tb);
    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    const fail = (msg) => {
      ['expr', 'how', 'result'].forEach((id) => out.set(id, '—'));
      text(ctx, msg, w / 2, h / 2, { color: th.muted, size: 14, align: 'center' });
    };
    if (!a || !b) return fail('Type two decimals such as 4.7 and 0.35');
    const o = op.value;
    const expr = `${S(a)} ${o} ${bracketed(D.str(b))}`;
    out.set('expr', expr);
    const big = narrow ? 20 : 26;
    const mid = narrow ? 14 : 18;
    const small = narrow ? 12 : 14;
    const gap = narrow ? 10 : 14;
    let y = h * 0.1;
    // Lines flow down the canvas; long ones wrap.
    const head = (str, color = th.ink, weight = 700) => {
      fitText(ctx, str, w / 2, y, w - 2 * pad, { size: big, weight, align: 'center', color });
      y += big + gap + 6;
    };
    const say = (str, { size = small, color = th.muted } = {}) => {
      y = para(ctx, str, w / 2, y, w - 2 * pad, { size, color }) + gap;
    };
    head(expr);

    if (o === '×' || o === '÷') {
      const rule = I.signRule(a.n, b.n);
      const signNote = a.n < 0 || b.n < 0 ? (rule === 'same' ? 'Same signs: the answer is positive.' : rule === 'different' ? 'Different signs: the answer is negative.' : '') : '';
      if (o === '×') {
        const m = D.multiply(size(a), size(b));
        const res = D.trim(D.multiply(a, b).result);
        out.set('how', `${Math.abs(a.n)} × ${Math.abs(b.n)} = ${m.whole}, ${m.places} places`);
        out.set('result', S(res));
        say(`Multiply as whole numbers:  ${Math.abs(a.n)} × ${Math.abs(b.n)} = ${m.whole}`, { size: mid, color: th.ink });
        say(`Count the decimal places in both factors:  ${a.dp} + ${b.dp} = ${m.places}`, { size: mid, color: th.ink });
        say(`Give ${m.whole} that many places:  ${D.str(m.result)}${D.str(m.result) !== D.str(D.trim(m.result)) ? ` = ${D.str(D.trim(m.result))}` : ''}`, { size: mid, color: th.ink });
        if (signNote) say(signNote);
        y += gap;
        head(`${expr} = ${S(res)}`, th.result, 750);
        if (a.n > 0 && b.n > 0 && a.n < 10 ** a.dp && b.n < 10 ** b.dp) say('Both factors are less than 1, so the answer is smaller than both.');
        return;
      }
      const q = D.divide(a, b);
      if (!q) return fail('Dividing by 0 has no answer.');
      const quotient = `${q.negative && (q.quotient.whole || q.quotient.digits.length) ? '−' : ''}${D.quotientString(q.quotient).replace('...', '…')}`;
      const shiftedExpr = `${D.str(size(q.dividend))} ÷ ${D.str(size(q.divisor))}`;
      out.set('how', q.places ? shiftedExpr : 'the divisor is already whole');
      out.set('result', quotient);
      say(q.places ? `Move the point ${q.places} place${q.places > 1 ? 's' : ''} to the right in both numbers, so the divisor is whole:` : 'The divisor is already a whole number, so no shift is needed:', { size: mid, color: th.ink });
      head(`${shiftedExpr} = ${D.quotientString(q.quotient).replace('...', '…')}`, th.ink, 650);
      if (q.places) say(`Both were multiplied by ${10 ** q.places}, so the answer does not change.`);
      if (signNote) say(signNote);
      if (!q.quotient.terminates) say('The digits repeat, so the decimal never ends.');
      y += gap;
      head(`${expr} = ${quotient}`, th.result, 750);
      return;
    }

    // + and −: subtracting is adding the opposite, then the integer adding rules
    // decide whether the sizes are added or subtracted in the column.
    const move = o === '−' ? { n: -b.n || 0, dp: b.dp } : b;
    const res = D.add(a, move);
    const same = a.n === 0 || move.n === 0 || Math.sign(a.n) === Math.sign(move.n);
    let topRow = size(a);
    let botRow = size(move);
    if (!same && D.compare(topRow, botRow) < 0) [topRow, botRow] = [botRow, topRow];
    const [pt, pb] = D.pad([topRow, botRow]);
    const colOp = same ? '+' : '−';
    const colRes = size(res);
    out.set('how', `${D.str(pt)} ${colOp} ${D.str(pb)}`);
    out.set('result', S(D.trim(res)));

    if (a.n < 0 || b.n < 0 || res.n < 0) {
      let note = same ? 'Same signs: add the sizes, keep the sign.' : 'Different signs: subtract the smaller size from the larger, keep the sign of the larger size.';
      if (o === '−') note = `Subtracting is adding the opposite: ${S(a)} + ${bracketed(D.str(move))}. ${note}`;
      say(note);
    }

    // The column: digits in fixed cells so the points line up.
    const strs = [D.str(pt), D.str(pb), D.str(colRes, pt.dp)];
    const len = Math.max(...strs.map((s) => s.length));
    const cell = Math.min(narrow ? 26 : 38, (w - 2 * pad) / (len + 2));
    const fs = cell * 0.9;
    const xRight = w / 2 + (len * cell) / 2 + cell / 2;
    const y0 = y + cell * 0.6;
    const rowH = cell * 1.25;
    // `zeros` trailing digits were added to pad, and are drawn muted.
    const put = (s, row, color, weight = 600, zeros = 0) => {
      const chars = s.padStart(len, ' ').split('');
      chars.forEach((ch, i) => {
        if (ch === ' ') return;
        const padded = i >= chars.length - zeros;
        text(ctx, ch, xRight - (len - i) * cell + cell / 2, y0 + row * rowH, { size: fs, weight: padded ? 400 : weight, align: 'center', color: padded ? th.muted : color });
      });
    };
    put(strs[0], 0, th.ink, 600, pt.dp - topRow.dp);
    put(strs[1], 1, th.ink, 600, pt.dp - botRow.dp);
    text(ctx, colOp, xRight - (len + 1) * cell + cell / 2, y0 + rowH, { size: fs, weight: 600, align: 'center' });
    line(ctx, xRight - (len + 1.4) * cell, y0 + rowH * 1.55, xRight + cell * 0.2, y0 + rowH * 1.55, { color: th.ink, width: 2 });
    put(strs[2], 2.1, th.result, 750);
    text(ctx, 'points lined up, zeros padded', w / 2, y0 + rowH * 3.1, { size: narrow ? 11 : 13, color: th.muted, align: 'center' });
    fitText(ctx, `${expr} = ${S(D.trim(res))}`, w / 2, y0 + rowH * 3.1 + (narrow ? 30 : 40), w - 2 * pad, { size: big, weight: 750, align: 'center', color: th.result });
  }
}
