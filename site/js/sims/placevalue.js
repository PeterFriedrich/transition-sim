// Concepts 4.1, 4.2, 4.6 and 4.8 of docs/CONCEPTS_math15_review.md.
import * as D from '../model/decimals.js';
import { fitCanvas, theme, clear, line, text, para } from '../lib/canvas.js';
import { section, textbox, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';
import { frac } from '../lib/format.js';

export const equations = [
  { html: '0.25 = 25/100 = 1/4', what: 'a decimal is a fraction with denominator 10, 100, 1000…' },
  { html: '0.5 = 0.50', what: 'zeros on the end do not change the value' },
  { html: 'compare digit by digit from the left, after padding with zeros', what: '0.300, 0.250, 0.305' },
  { html: '× 10, 100, 1000: every digit moves left;  ÷: every digit moves right', what: 'move the point, do not “add zeros”' },
];

export const prompts = [
  'Is 0.25 bigger than 0.3 because 25 is bigger than 3? Set them and find the first column where they differ.',
  'Order 0.4, 0.045, 0.39 and 0.4005 by comparing them two at a time.',
  'Type 0.5 and 0.50. What does the chart say?',
  'Set A to 3.7 and multiply by 100. Which column does each digit move to? Then try 52 ÷ 1000.',
  'Read A as a fraction from its last column, then simplify it. Check with 0.35 and 0.045.',
];

export const tallOnMobile = false;

const NAMES = ['thousands', 'hundreds', 'tens', 'ones'];
const HEADS = ['1000', '100', '10', '1'];
const FRAC_NAMES = ['tenths', 'hundredths', 'thousandths', 'ten-thousandths', 'hundred-thousandths', 'millionths', 'ten-millionths'];

export function mount(ui) {
  const box = section(ui.controls, 'Two decimals');
  const ta = textbox(box, { label: 'A', value: '0.3' });
  const tb = textbox(box, { label: 'B', value: '0.25' });
  const pow = choice(section(ui.controls, 'Powers of 10'), {
    label: 'Multiply or divide A',
    options: [
      { label: 'Leave A alone', value: 0 },
      { label: 'A × 10', value: 1 },
      { label: 'A × 100', value: 2 },
      { label: 'A × 1000', value: 3 },
      { label: 'A ÷ 10', value: -1 },
      { label: 'A ÷ 100', value: -2 },
      { label: 'A ÷ 1000', value: -3 },
    ],
    value: 0,
  });

  const out = readouts(ui.readouts, [
    { id: 'pad', label: 'Padded' },
    { id: 'cmp', label: 'Comparison' },
    { id: 'frac', label: 'A as a fraction' },
    { id: 'shift', label: 'A shifted' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  const read = (t) => {
    const x = D.parse(t.value);
    const bad = !x ? 'Up to 4 digits before the point and 4 after' : x.n < 0 ? 'Use a number that is 0 or more here' : '';
    t.setError(bad);
    return bad ? null : x;
  };

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const a = read(ta);
    const b = read(tb);
    if (!a || !b) {
      ['pad', 'cmp', 'frac', 'shift'].forEach((id) => out.set(id, '—'));
      text(ctx, 'Type two decimals such as 0.3 and 0.25', w / 2, h / 2, { color: th.muted, size: 14, align: 'center' });
      return;
    }
    const k = pow.value;
    const shifted = k ? D.shift(a, k) : null;
    const [pa, pb] = D.pad([a, b]);
    const sign = ['<', '=', '>'][D.compare(a, b) + 1];
    const f = D.toFraction(a);
    out.set('pad', `${D.str(pa)} and ${D.str(pb)}`);
    out.set('cmp', `${D.str(a)} ${sign} ${D.str(b)}`);
    out.set('frac', a.dp ? [`${f.raw[0]}/${f.raw[1]}`, frac(f.reduced)].filter((s, i, xs) => xs.indexOf(s) === i).join(' = ') : D.str(a));
    const opText = k > 0 ? `× ${10 ** k}` : `÷ ${10 ** -k}`;
    out.set('shift', shifted ? `${D.str(a)} ${opText} = ${D.str(shifted)}` : '—');

    // Rows share one set of columns: enough whole places and decimal places for all of them.
    const rows = [
      { name: 'A', x: a },
      { name: 'B', x: b },
    ];
    if (shifted) rows.push({ name: `A ${opText}`, x: shifted, accent: true });
    const dp = Math.max(1, ...rows.map((r) => r.x.dp));
    const ints = Math.max(1, ...rows.map((r) => String(Math.floor(r.x.n / 10 ** r.x.dp)).length));
    const cells = rows.map((r) => {
      const s = D.str(r.x, dp);
      const [i, d] = s.split('.');
      return { ...r, digits: (i.padStart(ints, ' ') + d).split(''), own: i.length, ownDp: r.x.dp };
    });

    const narrow = w < 520;
    const pad = narrow ? 8 : 28;
    const labelW = narrow ? 62 : 96;
    const cols = ints + dp;
    const gap = narrow ? 10 : 16; // room for the point
    const cw = Math.min(narrow ? 44 : 70, (w - 2 * pad - labelW - gap) / cols);
    const x0 = (w - (labelW + cols * cw + gap)) / 2 + labelW;
    const colX = (c) => x0 + c * cw + (c >= ints ? gap : 0);
    const top = narrow ? 30 : 44;
    const headH = narrow ? 34 : 44;
    const rowH = Math.min(narrow ? 46 : 60, (h - top - headH - (narrow ? 70 : 84)) / rows.length);

    for (let c = 0; c < cols; c++) {
      const name = c < ints ? HEADS[4 - ints + c] : `1/${10 ** (c - ints + 1)}`;
      text(ctx, name, colX(c) + cw / 2, top + 10, { size: Math.min(narrow ? 10 : 13, cw * 0.3), color: th.muted, align: 'center', weight: 600 });
      const word = c < ints ? NAMES[4 - ints + c] : FRAC_NAMES[c - ints];
      if (!narrow && cw > 60) text(ctx, word, colX(c) + cw / 2, top + 27, { size: 10, color: th.muted, align: 'center' });
    }
    // First column, from the left, where A and B differ.
    let diff = -1;
    for (let c = 0; c < cols && diff < 0; c++) if (cells[0].digits[c].trim() !== cells[1].digits[c].trim()) diff = c;
    if (diff >= 0) {
      ctx.fillStyle = th.grid;
      ctx.fillRect(colX(diff) + 2, top + headH, cw - 4, rowH * 2);
    }
    cells.forEach((r, i) => {
      const y = top + headH + rowH * (i + 0.5);
      text(ctx, r.name, x0 - 10, y, { size: narrow ? 12 : 15, weight: 700, align: 'right', color: r.accent ? th.result : th.ink });
      r.digits.forEach((ch, c) => {
        const padded = c >= ints + r.ownDp; // a zero that was added to pad
        const color = padded ? th.muted : r.accent ? th.result : th.ink;
        if (ch !== ' ') text(ctx, ch, colX(c) + cw / 2, y, { size: Math.min(narrow ? 22 : 30, rowH * 0.6), weight: padded ? 400 : 700, align: 'center', color });
      });
      text(ctx, '.', x0 + ints * cw + gap / 2, y + 2, { size: Math.min(narrow ? 22 : 30, rowH * 0.6), weight: 800, align: 'center', color: r.accent ? th.result : th.ink });
      line(ctx, x0, y + rowH / 2, colX(cols - 1) + cw, y + rowH / 2, { color: th.grid, width: 1 });
    });
    for (let c = 0; c <= cols; c++) {
      const x = c === cols ? colX(cols - 1) + cw : colX(c);
      line(ctx, x, top + headH, x, top + headH + rowH * rows.length, { color: th.grid, width: 1 });
    }

    const yb = top + headH + rowH * rows.length + (narrow ? 22 : 28);
    let verdict;
    if (diff < 0) verdict = `${D.str(a)} = ${D.str(b)}: every column matches once the zeros are padded.`;
    else {
      const place = diff < ints ? NAMES[4 - ints + diff] : FRAC_NAMES[diff - ints];
      const da = cells[0].digits[diff].trim() || '0';
      const db = cells[1].digits[diff].trim() || '0';
      verdict = `${D.str(a)} ${sign} ${D.str(b)}: the ${place} differ first (${da} ${sign} ${db}).`;
    }
    let y = para(ctx, verdict, w / 2, yb, w - 2 * pad, { size: narrow ? 13 : 17, weight: 650 }) + 6;
    if (a.dp) {
      const asFrac = `${f.raw[0]}/${f.raw[1]}${f.raw[1] !== f.reduced[1] ? ` = ${frac(f.reduced)}` : ''}`;
      y = para(ctx, `A ends in the ${FRAC_NAMES[a.dp - 1]} column, so ${D.str(a)} = ${asFrac}.`, w / 2, y, w - 2 * pad, { size: narrow ? 11 : 14, color: th.muted }) + 6;
    }
    if (shifted) {
      const places = Math.abs(k);
      para(ctx, `${opText}: every digit moves ${places} column${places > 1 ? 's' : ''} to the ${k > 0 ? 'left' : 'right'}.`, w / 2, y, w - 2 * pad, { size: narrow ? 11 : 14, color: th.result });
    }
  }
}
