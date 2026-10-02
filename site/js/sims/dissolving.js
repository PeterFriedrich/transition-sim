// Concept 2.5 of docs/CONCEPTS_science10_unitA.md.
import * as D from '../model/dissolving.js';
import { fitCanvas, theme, clear, line, text, para } from '../lib/canvas.js';
import { section, slider, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'NaCl(s) → Na⁺(aq) + Cl⁻(aq)', what: 'the crystal was always ions; water pulls them apart' },
  { html: 'water is polar: O end negative, H ends positive', what: 'O ends face Na⁺, H ends face Cl⁻ (hydration)' },
  { html: 'ions free to move → the solution conducts', what: 'ionic compounds dissolve to ions' },
  { html: 'sugar dissolves as whole molecules', what: 'no ions, so no conduction' },
];

export const prompts = [
  'Before pressing Play: which beaker will light the bulb, and why?',
  'Watch a sodium ion leave the crystal. Which end of each water molecule turns toward it? What about a chloride ion?',
  'When the salt dissolves, does chlorine “give back” its electron? What does the picture show?',
  'Both solids disappear into the water. What is different about what is floating around afterward?',
  'Why does the bulb get brighter as more salt dissolves?',
];

export const legend = [
  { color: 'cation', label: 'Na⁺' },
  { color: 'anion', label: 'Cl⁻' },
  { color: 'series-b', label: 'sugar molecule' },
  { color: 'muted', label: 'water (O end larger)' },
];

export const tallOnMobile = true;

const UNITS = 12;
// Where dissolved particles float: a jittered grid in a fixed shuffled order, so
// they never pile up and the picture is the same every run.
function spots(seed, cols, rows) {
  let a = seed;
  const rnd = () => {
    a = (a * 1664525 + 1013904223) % 4294967296;
    return a / 4294967296;
  };
  const out = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) out.push({ x: 0.14 + ((c + 0.5 + (rnd() - 0.5) * 0.3) / cols) * 0.72, y: 0.06 + ((r + 0.5 + (rnd() - 0.5) * 0.3) / rows) * 0.6, ph: rnd() * 6.28 });
  }
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function mount(ui) {
  const rate = slider(section(ui.controls, 'Dissolving'), { label: 'Rate', min: 0.5, max: 3, step: 0.5, value: 1.5, unit: 'units/s' });
  const out = readouts(ui.readouts, [
    { id: 'salt', label: 'Salt dissolved' },
    { id: 'ions', label: 'Free ions in the salt water' },
    { id: 'saltC', label: 'Salt water conducts?' },
    { id: 'sugar', label: 'Sugar dissolved' },
    { id: 'sugarIons', label: 'Free ions in the sugar water' },
    { id: 'sugarC', label: 'Sugar water conducts?' },
  ]);
  const canvas = fitCanvas(ui.canvas);
  const saltSpots = spots(7, 6, 4);
  const sugarSpots = spots(19, 4, 3);
  createClock(ui.transport, { frame: draw });

  function water(ctx, th, x, y, angle, r) {
    // O toward `angle`: the two H atoms sit on the far side.
    ctx.fillStyle = th.muted;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    for (const off of [-0.9, 0.9]) {
      ctx.beginPath();
      ctx.arc(x - Math.cos(angle + off) * r * 1.35, y - Math.sin(angle + off) * r * 1.35, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw(clock) {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const k = D.dissolved(clock.t, UNITS, rate.value);
    if (k >= UNITS && clock.running) clock.pause();
    clock.setTimeLabel(`${k} of ${UNITS} dissolved`);
    out.set('salt', `${k} of ${UNITS} formula units`);
    out.set('ions', String(D.freeIons('salt', k)));
    out.set('saltC', D.conducts('salt', k) ? 'yes' : 'no');
    out.set('sugar', `${k} of ${UNITS} molecules`);
    out.set('sugarIons', String(D.freeIons('sugar', k)));
    out.set('sugarC', D.conducts('sugar', k) ? 'yes' : 'no');

    const stacked = w < 520;
    const noteH = stacked ? 50 : 40;
    const panels = stacked
      ? [{ x: 8, y: 4, w: w - 16, h: (h - noteH) / 2 - 6 }, { x: 8, y: (h - noteH) / 2 + 2, w: w - 16, h: (h - noteH) / 2 - 6 }]
      : [{ x: 12, y: 6, w: w / 2 - 18, h: h - noteH - 10 }, { x: w / 2 + 6, y: 6, w: w / 2 - 18, h: h - noteH - 10 }];

    panels.forEach((p, idx) => {
      const kind = idx === 0 ? 'salt' : 'sugar';
      const headH = stacked ? 30 : 40;
      const bx = p.x;
      const by = p.y + headH;
      const bw = p.w;
      const bh = p.h - headH;
      // Meter: a bulb that is brighter with more free ions.
      const on = D.conducts(kind, k);
      const glow = D.freeIons(kind, k) / (UNITS * 2);
      text(ctx, D.KINDS[kind].name, bx + 2, p.y + headH / 2, { size: stacked ? 12 : 14, weight: 700 });
      const lx = bx + bw - 16;
      ctx.fillStyle = on ? th.electron : th.grid;
      ctx.globalAlpha = on ? 0.35 + 0.65 * glow : 1;
      ctx.beginPath();
      ctx.arc(lx, p.y + headH / 2, stacked ? 9 : 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = th.muted;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      text(ctx, on ? 'conducts' : 'no current', lx - (stacked ? 14 : 18), p.y + headH / 2, { size: stacked ? 11 : 13, color: on ? th.ink : th.muted, align: 'right', weight: 600 });

      ctx.fillStyle = th.grid;
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = th.muted;
      ctx.strokeRect(bx, by, bw, bh);
      // Electrodes dipping in.
      line(ctx, bx + bw * 0.08, by - 4, bx + bw * 0.08, by + bh * 0.45, { color: th.ink, width: 3 });
      line(ctx, bx + bw * 0.92, by - 4, bx + bw * 0.92, by + bh * 0.45, { color: th.ink, width: 3 });

      const r = Math.max(5, Math.min(12, Math.min(bw / 6, bh / 4) * 0.16));
      const cols = 4;
      const cell = r * 2.5;
      const cx0 = bx + bw / 2 - (cols * cell * (kind === 'salt' ? 2 : 1.4)) / 2;
      const cyB = by + bh - 8;
      const wob = (s, amp) => ({ x: Math.sin(clock.t * 0.9 + s.ph) * amp, y: Math.cos(clock.t * 0.7 + s.ph * 1.7) * amp });
      for (let u = 0; u < UNITS; u++) {
        const gone = u >= UNITS - k; // the top rows leave first
        const row = Math.floor(u / cols);
        const col = u % cols;
        if (kind === 'salt') {
          for (const half of [0, 1]) {
            const charge = (row + col * 2 + half) % 2 === 0 ? 1 : -1;
            let x = cx0 + (col * 2 + half + 0.5) * cell;
            let y = cyB - (row + 0.5) * cell;
            if (gone) {
              const s = saltSpots[u * 2 + half];
              const o = wob(s, r * 0.4);
              x = bx + s.x * bw + o.x;
              y = by + s.y * bh + o.y;
              // Hydration: O ends toward Na⁺, H ends toward Cl⁻.
              const end = D.waterEnd(charge);
              for (let q = 0; q < 3; q++) {
                const a = s.ph + (q * 2 * Math.PI) / 3 + clock.t * 0.2;
                const wx = x + Math.cos(a) * r * 2.1;
                const wy = y + Math.sin(a) * r * 2.1;
                water(ctx, th, wx, wy, end === 'O' ? a + Math.PI : a, r * 0.38);
              }
            }
            ctx.fillStyle = charge > 0 ? th.cation : th.anion;
            ctx.beginPath();
            ctx.arc(x, y, charge > 0 ? r * 0.8 : r, 0, Math.PI * 2);
            ctx.fill();
            text(ctx, charge > 0 ? '+' : '−', x, y, { size: r * 1.2, weight: 700, align: 'center', color: th.surface });
          }
        } else {
          let x = cx0 + (col + 0.5) * cell * 1.4;
          let y = cyB - (row + 0.5) * cell * 0.9;
          if (gone) {
            const s = sugarSpots[u];
            const o = wob(s, r * 0.8);
            x = bx + s.x * bw + o.x;
            y = by + s.y * bh + o.y;
          }
          ctx.fillStyle = th.seriesB;
          ctx.beginPath();
          ctx.ellipse(x, y, r * 1.5, r * 0.9, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });
    para(ctx, 'Salt comes apart into ions that were already there; each ion is wrapped in water. Sugar leaves as whole, uncharged molecules.', w / 2, h - noteH + 14, w - 20, { size: stacked ? 10 : 12, color: th.muted });
  }
}
