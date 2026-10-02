// Concepts 2.3 and 2.3b of docs/CONCEPTS_science10_unitA.md.
import * as A from '../model/atoms.js';
import * as Ionic from '../model/ionic.js';
import { fitCanvas, theme, clear, text, para } from '../lib/canvas.js';
import { drawAtom, electronPos } from '../lib/atomdraw.js';
import { section, choice, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'metal atoms lose their outer electrons → positive ions', what: 'the old outer ring disappears: Na (2-8-1) → Na⁺ (2-8)' },
  { html: 'nonmetal atoms gain electrons into the outer shell → negative ions', what: 'Cl (2-8-7) → Cl⁻ (2-8-8)' },
  { html: 'the charges must add to zero', what: 'that gives the formula' },
  { html: '[Na]⁺ [Cl]⁻', what: 'brackets with the charge at the top right; the nucleus is unchanged' },
];

export const prompts = [
  'Before pressing Play for Na and Cl: how many electrons move, and which way?',
  'Set Mg and O. How many electrons does each magnesium give? What are the two charges afterward?',
  'Set Na and O. Why does it take two sodium atoms? Write the formula before you play it.',
  'After the transfer, compare each ion’s shells with the nearest noble gas.',
  'Did any nucleus change during the transfer? What does that tell you about ions?',
];

export const legend = [
  { color: 'electron', label: 'electron' },
  { color: 'result', label: 'electron being transferred' },
];

export const tallOnMobile = true;

const METALS = [3, 11, 19, 12, 20, 13];
const NONMETALS = [9, 17, 8, 16, 7, 15];
const MOVE_START = 0.6;
const MOVE_END = 2.6;

export function mount(ui) {
  const box = section(ui.controls, 'Atoms');
  const opt = (z) => ({ label: `${A.element(z).name} (${A.element(z).symbol})`, value: z });
  const metal = choice(box, { label: 'Metal', options: METALS.map(opt), value: 11 });
  const non = choice(box, { label: 'Nonmetal', options: NONMETALS.map(opt), value: 17 });

  const out = readouts(ui.readouts, [
    { id: 'give', label: 'Each metal atom gives' },
    { id: 'take', label: 'Each nonmetal atom takes' },
    { id: 'ratio', label: 'Atoms needed' },
    { id: 'sum', label: 'Charges add to' },
    { id: 'formula', label: 'Formula' },
    { id: 'name', label: 'Name' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  const clock = createClock(ui.transport, { frame: draw, speeds: [0.5, 1, 2] });
  metal.onChange(() => clock.reset());
  non.onChange(() => clock.reset());

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const m = A.element(metal.value);
    const n = A.element(non.value);
    const mi = A.ion(m.z);
    const ni = A.ion(n.z);
    const c = Ionic.compound(Ionic.cation(m.symbol), Ionic.anion(n.symbol));
    const give = mi.charge;
    const take = -ni.charge;
    out.set('give', `${give} e⁻`);
    out.set('take', `${take} e⁻`);
    out.set('ratio', `${c.cations} ${m.symbol} : ${c.anions} ${n.symbol}`);
    out.set('sum', `${c.cations}(${give}+) + ${c.anions}(${take}−) = 0`);
    out.set('formula', c.formula);
    out.set('name', c.name);

    const t = clock.t;
    const prog = Math.min(1, Math.max(0, (t - MOVE_START) / (MOVE_END - MOVE_START)));
    const done = prog >= 1;
    if (t > MOVE_END + 1.5 && clock.running) clock.pause();
    clock.setTimeLabel(done ? 'ions' : prog > 0 ? 'transferring' : 'atoms');

    const narrow = w < 520;
    const pad = narrow ? 10 : 28;
    const noteH = narrow ? 72 : 64;
    const rowsMax = Math.max(c.cations, c.anions);
    const R = Math.min((w - 2 * pad) / 6.2, (h - noteH - 16) / (rowsMax * 2.7));
    const colX = [w * 0.24, w * 0.76];
    const rowY = (i, count) => 10 + ((h - noteH - 10) * (i + 0.5)) / count;
    const donors = Array.from({ length: c.cations }, (_, i) => ({ x: colX[0], y: rowY(i, c.cations) }));
    const takers = Array.from({ length: c.anions }, (_, i) => ({ x: colX[1], y: rowY(i, c.anions) }));

    // Every transferred electron: from an outer-shell place on a donor to an empty outer-shell place on a taker.
    const flights = [];
    const outerM = m.shells.length - 1;
    const outerN = n.shells.length - 1;
    let k = 0;
    donors.forEach((d, di) => {
      for (let i = 0; i < give; i++, k++) {
        const ti = Math.floor(k / take);
        const from = electronPos(d.x, d.y, R, m.shells.length, outerM, i, m.valence);
        const to = electronPos(takers[ti].x, takers[ti].y, R, n.shells.length, outerN, n.valence + (k % take), 8);
        flights.push({ di, i, from, to });
      }
    });

    donors.forEach((d, di) => {
      const nucleus = [`${m.z} p⁺`];
      if (done) drawAtom(ctx, d.x, d.y, R, { shells: mi.shells, slots: m.shells.length, nucleus, charge: A.chargeMark(mi.charge) });
      else drawAtom(ctx, d.x, d.y, R, { shells: m.shells, nucleus, hide: prog > 0 ? flights.filter((f) => f.di === di).map((f) => ({ k: outerM, i: f.i })) : [] });
    });
    takers.forEach((a) => {
      const nucleus = [`${n.z} p⁺`];
      if (done) drawAtom(ctx, a.x, a.y, R, { shells: ni.shells, nucleus, charge: A.chargeMark(ni.charge), nucleusColor: th.anion });
      else {
        // Drawn on 8 places so the gaps the new electrons will fill are visible.
        drawAtom(ctx, a.x, a.y, R, { shells: n.shells.slice(0, -1).concat(0), slots: n.shells.length, nucleus, nucleusColor: th.anion });
        for (let i = 0; i < n.valence; i++) {
          const p = electronPos(a.x, a.y, R, n.shells.length, outerN, i, 8);
          ctx.fillStyle = th.electron;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(2.5, R * 0.045), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    if (prog > 0 && !done) {
      const s = prog * prog * (3 - 2 * prog);
      for (const f of flights) {
        ctx.fillStyle = th.result;
        ctx.beginPath();
        ctx.arc(f.from.x + (f.to.x - f.from.x) * s, f.from.y + (f.to.y - f.from.y) * s - Math.sin(Math.PI * s) * R * 0.5, Math.max(3, R * 0.06), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    text(ctx, done ? `[${m.symbol}]${A.chargeMark(mi.charge)}` : m.symbol, colX[0], h - noteH - 2, { size: narrow ? 13 : 16, weight: 750, align: 'center', color: th.cation });
    text(ctx, done ? `[${n.symbol}]${A.chargeMark(ni.charge)}` : n.symbol, colX[1], h - noteH - 2, { size: narrow ? 13 : 16, weight: 750, align: 'center', color: th.anion });

    const note = done
      ? `${m.symbol} is now ${mi.shells.join('-')} with ${m.z} p⁺ and ${mi.electrons} e⁻; ${n.symbol} is ${ni.shells.join('-')} with ${n.z} p⁺ and ${ni.electrons} e⁻. Charges add to zero, so the formula is ${c.formula}: ${c.name}.`
      : `Each ${m.name} atom (${m.shells.join('-')}) gives ${give} electron${give > 1 ? 's' : ''}; each ${n.name} atom (${n.shells.join('-')}) has room for ${take}.${prog > 0 ? '' : ' Press Play.'}`;
    para(ctx, note, w / 2, h - noteH + 22, w - 2 * pad, { size: narrow ? 11 : 14, color: th.muted });
  }
}
