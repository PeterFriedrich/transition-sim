// Concepts 3.1–3.3 of docs/CONCEPTS_science10_unitA.md.
import * as Ionic from '../model/ionic.js';
import { fitCanvas, theme, clear, text, fitText, para, roundRect } from '../lib/canvas.js';
import { section, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'the charges must cancel', what: 'criss-cross the charges to subscripts, then reduce' },
  { html: 'name: metal unchanged, nonmetal ending in -ide', what: 'no prefixes in ionic names' },
  { html: 'Roman numeral = the metal’s charge', what: 'only for metals with more than one charge: iron(III) oxide is Fe₂O₃' },
  { html: 'brackets when there are 2 or more of a polyatomic ion', what: 'Ca(NO₃)₂, but NaOH' },
];

export const prompts = [
  'Predict the formula for aluminum and oxide before you set it. How many of each ion make the charges cancel?',
  'Set magnesium and oxide. The criss-cross gives Mg₂O₂. Why is that not the formula?',
  'Compare copper(I) chloride with copper(II) chloride. What does the numeral tell you, and what does it not tell you?',
  'Which needs brackets: calcium nitrate, sodium hydroxide, ammonium sulfate? Decide, then check each one.',
  'Work backward: in Fe(OH)₃ the hydroxides carry 3− in total. What is the charge on the iron, and so its name?',
];

export const legend = [
  { color: 'cation', label: 'positive ion' },
  { color: 'anion', label: 'negative ion' },
];

export const tallOnMobile = false;

export function mount(ui) {
  const box = section(ui.controls, 'Ions');
  const label = (i) => `${i.name}${i.multivalent ? ` (${i.charge}+)` : ''}  ${Ionic.ionLabel(i)}`;
  const cat = choice(box, { label: 'Positive ion', options: Ionic.CATIONS.map((c) => ({ label: label(c), value: c.id })), value: 'Al' });
  const an = choice(box, { label: 'Negative ion', options: Ionic.ANIONS.map((a) => ({ label: label(a), value: a.id })), value: 'O' });

  const out = readouts(ui.readouts, [
    { id: 'formula', label: 'Formula' },
    { id: 'name', label: 'Name' },
    { id: 'cross', label: 'Criss-cross gives' },
    { id: 'pos', label: 'Total positive charge' },
    { id: 'neg', label: 'Total negative charge' },
    { id: 'br', label: 'Brackets needed?' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const c = Ionic.cation(cat.value);
    const a = Ionic.anion(an.value);
    const r = Ionic.compound(c, a);
    out.set('formula', r.formula);
    out.set('name', r.name);
    out.set('cross', r.reduced ? `${r.crissCross}, reduce` : r.crissCross);
    out.set('pos', `${r.cations} × ${c.charge}+ = ${r.positive}+`);
    out.set('neg', `${r.anions} × ${-a.charge}− = ${-r.negative}−`);
    out.set('br', r.brackets ? 'yes' : 'no');

    const narrow = w < 520;
    const pad = narrow ? 10 : 32;
    fitText(ctx, r.formula, w / 2, narrow ? 26 : 36, w - 2 * pad, { size: narrow ? 30 : 42, weight: 750, align: 'center' });
    fitText(ctx, r.name, w / 2, narrow ? 56 : 76, w - 2 * pad, { size: narrow ? 15 : 20, weight: 600, align: 'center', color: th.muted });

    // Ion cards: as many of each as the formula needs. Each card's width is its charge.
    const total = r.positive;
    const top = narrow ? 84 : 112;
    const barW = w - 2 * pad;
    const unit = barW / total;
    const cardH = Math.min(narrow ? 44 : 60, (h - top - (narrow ? 96 : 100)) / 2);
    const row = (ion, count, y, color) => {
      const cw = Math.abs(ion.charge) * unit;
      for (let i = 0; i < count; i++) {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        roundRect(ctx, pad + i * cw + 2, y, cw - 4, cardH, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
        fitText(ctx, Ionic.ionLabel(ion), pad + i * cw + cw / 2, y + cardH / 2, cw - 8, { size: narrow ? 13 : 17, weight: 700, align: 'center', color: th.surface, min: 7 });
      }
    };
    text(ctx, `${r.cations} × ${Ionic.ionLabel(c)}  =  ${r.positive}+`, pad, top - 10, { size: narrow ? 11 : 13, color: th.cation, weight: 700 });
    row(c, r.cations, top, th.cation);
    const y2 = top + cardH + (narrow ? 26 : 30);
    text(ctx, `${r.anions} × ${Ionic.ionLabel(a)}  =  ${-r.negative}−`, pad, y2 - 10, { size: narrow ? 11 : 13, color: th.anion, weight: 700 });
    row(a, r.anions, y2, th.anion);

    const notes = [`The two rows are the same length: ${r.positive}+ and ${-r.negative}− cancel.`];
    if (r.reduced) notes.push(`Criss-cross gives ${r.crissCross}; reduce it to ${r.formula}.`);
    if (c.multivalent) notes.push(`${c.name[0].toUpperCase()}${c.name.slice(1)} has more than one charge, so the name says which: (${['', 'I', 'II', 'III', 'IV'][c.charge]}) means ${c.charge}+, not ${c.charge} atoms.`);
    if (a.poly || c.poly) notes.push(r.brackets ? 'Two or more of a polyatomic ion: brackets, with the subscript outside.' : 'Only one of the polyatomic ion: no brackets.');
    para(ctx, notes.join(' '), w / 2, y2 + cardH + (narrow ? 20 : 26), w - 2 * pad, { size: narrow ? 11 : 14, color: th.muted });
  }
}
