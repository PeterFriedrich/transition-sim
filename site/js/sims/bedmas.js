// Concepts 2.1–2.3 and 1.5 of docs/CONCEPTS_math15_review.md.
import * as B from '../model/bedmas.js';
import { fitCanvas, theme, clear, text, fitText, segText } from '../lib/canvas.js';
import { section, choice, textbox, buttons, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: '<b>B</b>rackets', what: 'anything grouped: brackets, a numerator or denominator, the inside of a root' },
  { html: '<b>E</b>xponents', what: 'an exponent applies only to what it is attached to: −3² = −9, (−3)² = 9' },
  { html: '<b>D</b>ivision and <b>M</b>ultiplication', what: 'tied: left to right' },
  { html: '<b>A</b>ddition and <b>S</b>ubtraction', what: 'tied: left to right' },
];

export const prompts = [
  'Before each click of “Next step”, say which operation comes next. The highlight on the line above shows whether you were right.',
  'Work out 12 ÷ 3 × 2 by hand. Did you get 8 or 2? Step through it and find where “multiplication before division” goes wrong.',
  'Compare −3² and (−3)². What is the exponent attached to in each one?',
  'Step through −5 − (−3) × 2. Why is the answer not −4?',
  'Type an expression of your own with a bracket and an exponent. Write out every line by hand, then compare with the steps.',
];

const PRESETS = ['8 − 2(3 + 1)^2 ÷ 4', '12 ÷ 3 × 2', '−5 − (−3) × 2', '−3^2', '(−3)^2', '−2(3 − 7)', '6 − 2(−3)', '(−18) ÷ 3 − (−4)'];
const RULE = { B: 'Brackets', E: 'Exponent', DM: '× and ÷, left to right', AS: '+ and −, left to right' };

export const tallOnMobile = true;

function did(l) {
  const a = l.a < 0 ? `(${B.numStr(l.a)})` : B.numStr(l.a);
  if (l.op === '^') return `${a}${[...String(l.b)].map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]).join('')} = ${B.numStr(l.value)}`;
  const b = l.b < 0 ? `(${B.numStr(l.b)})` : B.numStr(l.b);
  return `${B.numStr(l.a)} ${l.op} ${b} = ${B.numStr(l.value)}`;
}

export function mount(ui) {
  const box = section(ui.controls, 'Expression');
  const preset = choice(box, { label: 'Examples', options: PRESETS.map((p) => ({ label: p.replace('^2', '²'), value: p })), value: PRESETS[0] });
  const typed = textbox(box, { label: 'Or type your own (use ^ for an exponent, * and / work too)', value: PRESETS[0] });
  let solved = null;
  let shown = 0; // how many steps are revealed
  const load = () => {
    try {
      solved = B.solve(typed.value);
      typed.setError('');
    } catch (err) {
      solved = null;
      typed.setError(err instanceof B.BedmasError ? err.message : 'Cannot read that expression');
    }
    shown = 0;
  };
  preset.onChange((v) => {
    typed.value = v;
    load();
  });
  typed.onChange(load);
  load();

  buttons(box, [
    { label: 'Back', onClick: () => (shown = Math.max(0, shown - 1)) },
    { label: 'Next step', primary: true, onClick: () => solved && (shown = Math.min(solved.lines.length - 1, shown + 1)) },
    { label: 'Show all', onClick: () => solved && (shown = solved.lines.length - 1) },
  ]);

  const out = readouts(ui.readouts, [
    { id: 'step', label: 'Step' },
    { id: 'did', label: 'Just did' },
    { id: 'value', label: 'Answer' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // stepped by the buttons

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    if (!solved) {
      ['step', 'did', 'value'].forEach((id) => out.set(id, '—'));
      text(ctx, 'Type an expression such as 8 − 2(3 + 1)^2 ÷ 4', w / 2, h / 2, { color: th.muted, size: 14, align: 'center' });
      return;
    }
    const total = solved.lines.length - 1;
    const done = shown === total;
    out.set('step', `${shown} of ${total}`);
    out.set('did', shown ? `${RULE[solved.lines[shown].rule]}: ${did(solved.lines[shown])}` : '—');
    out.set('value', done ? B.numStr(solved.value) : 'keep stepping');

    const narrow = w < 520;
    const pad = narrow ? 12 : 32;
    const rows = Math.max(total + 1, 4);
    const rowH = Math.min(narrow ? 62 : 74, (h - 24) / rows);
    const size = Math.min(narrow ? 22 : 28, rowH * 0.42);
    const top = Math.max(12, (h - rowH * (shown + 1)) / 2);
    for (let i = 0; i <= shown; i++) {
      const l = solved.lines[i];
      const y = top + rowH * (i + 0.62);
      const latest = i === shown;
      if (i > 0) {
        fitText(ctx, `${RULE[l.rule]}:  ${did(l)}`, w / 2, y - rowH * 0.42, w - 2 * pad, { size: Math.min(narrow ? 11 : 13, rowH * 0.22), color: th.muted, align: 'center', min: 8 });
      }
      // Highlight what was done to a line only once the next line is showing.
      const hot = latest ? null : B.next(l.items);
      const segs = B.show(l.items, hot);
      if (i > 0) segs.unshift({ str: '= ', hot: false });
      segText(ctx, segs, w / 2, y, w - 2 * pad, { size, weight: latest ? 650 : 500, color: latest ? th.ink : th.muted, hotColor: th.accent });
    }
    if (!done && shown === 0) {
      text(ctx, 'What comes first? Decide, then press “Next step”.', w / 2, h - 16, { size: narrow ? 11 : 13, color: th.muted, align: 'center' });
    }
  }
}
