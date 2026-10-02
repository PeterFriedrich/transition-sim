// Concept 2.4 of docs/CONCEPTS_science10_unitA.md (the wet route).
import * as L from '../model/lattice.js';
import { fitCanvas, theme, clear, text, para } from '../lib/canvas.js';
import { section, slider, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'opposite charges attract', what: 'every neighbour of an ion in the crystal has the opposite charge' },
  { html: 'crystallization is the reverse of dissolving', what: 'the ions were already there in the solution' },
  { html: 'evaporation or cooling crowds the ions until they stick', what: 'the crystal grows from a seed' },
  { html: 'NaCl: 6 opposite-charge neighbours each', what: 'in 3-D; this flat picture shows 4 of them' },
];

export const prompts = [
  'Press Play with the water cool. Where do new ions join the crystal: anywhere, or only at certain places?',
  'Look at any ion inside the crystal. What charge are its neighbours? Why is that pattern the stable one?',
  'Evaporate more water. What happens to the space the ions have, and to how fast the crystal grows?',
  'Make the water hot. What happens to ions at the corners and edges of the crystal?',
  'A crystal has formed. Were any electrons transferred while it grew?',
];

export const legend = [
  { color: 'cation', label: 'Na⁺' },
  { color: 'anion', label: 'Cl⁻' },
];

export const tallOnMobile = false;

const PER_KIND = 36;

export function mount(ui) {
  const box = section(ui.controls, 'Solution');
  const temp = slider(box, { label: 'Temperature', min: 0, max: 100, step: 5, value: 25, unit: '°C' });
  const evap = slider(box, { label: 'Water evaporated', min: 0, max: 80, step: 5, value: 30, unit: '%' });

  const out = readouts(ui.readouts, [
    { id: 'crystal', label: 'Ions in the crystal (this run)' },
    { id: 'free', label: 'Ions still in solution' },
    { id: 'flat', label: 'Opposite neighbours, flat picture' },
    { id: 'real', label: 'Opposite neighbours, real crystal' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  let ions = [];
  let filled = new Set();
  // Positions are in a 1 × 1 box; the crystal's grid is centred on (0.5, 0.5).
  const CELL = 0.052;
  const reset = () => {
    filled = new Set([L.key(0, 0)]);
    ions = [];
    for (let i = 0; i < PER_KIND * 2; i++) {
      const charge = i % 2 ? -1 : 1;
      if (i === 0) continue; // the seed is an Na⁺ at the centre
      ions.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, charge });
    }
  };
  reset();
  createClock(ui.transport, { frame: draw, onReset: reset, autoplay: true });

  function step(dt) {
    const T = temp.value;
    const size = 1 - evap.value / 160; // less water: the ions share a smaller box
    const lo = (1 - size) / 2;
    const hi = lo + size;
    const speed = 0.12 + T / 300;
    for (const ion of ions) {
      ion.vx += (Math.random() - 0.5) * 4 * dt;
      ion.vy += (Math.random() - 0.5) * 4 * dt;
      const v = Math.hypot(ion.vx, ion.vy) || 1;
      ion.vx = (ion.vx / v) * speed;
      ion.vy = (ion.vy / v) * speed;
      ion.x += ion.vx * dt;
      ion.y += ion.vy * dt;
      if (ion.x < lo) (ion.x = lo), (ion.vx = Math.abs(ion.vx));
      if (ion.x > hi) (ion.x = hi), (ion.vx = -Math.abs(ion.vx));
      if (ion.y < lo) (ion.y = lo), (ion.vy = Math.abs(ion.vy));
      if (ion.y > hi) (ion.y = hi), (ion.vy = -Math.abs(ion.vy));
      // Stick at a free site that touches the crystal and suits this ion's charge; cool water sticks more readily.
      const i = Math.round((ion.x - 0.5) / CELL);
      const j = Math.round((ion.y - 0.5) / CELL);
      // A site held by two or more neighbours is far stickier than one held by a single neighbour, which keeps the crystal compact.
      const hold = L.neighbours(filled, i, j) >= 2 || filled.size < 4 ? 1 : 0.08;
      if (L.canAttach(filled, i, j, ion.charge) && Math.random() < (1 - T / 110) * 14 * hold * dt) {
        filled.add(L.key(i, j));
        ion.stuck = true;
      }
    }
    ions = ions.filter((ion) => !ion.stuck);
    // Hot water shakes loosely held ions (one neighbour) back off the crystal.
    if (T > 60) {
      for (const k of [...filled]) {
        const [i, j] = k.split(',').map(Number);
        if ((i || j) && L.neighbours(filled, i, j) <= 1 && Math.random() < ((T - 60) / 40) * 1.5 * dt) {
          filled.delete(k);
          ions.push({ x: 0.5 + i * CELL, y: 0.5 + j * CELL, vx: 0, vy: 0, charge: L.siteCharge(i, j) });
        }
      }
    }
  }

  function draw(clock, dSim) {
    if (dSim > 0) step(dSim);
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    out.set('crystal', String(filled.size));
    out.set('free', String(ions.length));
    out.set('flat', String(L.NEIGHBOURS_FLAT));
    out.set('real', String(L.NEIGHBOURS_3D));
    clock.setTimeLabel(`${filled.size} in the crystal`);

    const narrow = w < 520;
    const noteH = narrow ? 40 : 34;
    const side = Math.min(w - 16, h - noteH - 8);
    const x0 = (w - side) / 2;
    const y0 = 6;
    const size = 1 - evap.value / 160;
    const lo = (1 - size) / 2;
    ctx.fillStyle = th.grid;
    ctx.fillRect(x0 + lo * side, y0 + lo * side, size * side, size * side);
    ctx.strokeStyle = th.muted;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 + lo * side, y0 + lo * side, size * side, size * side);
    const r = Math.max(4, CELL * side * 0.46);
    const dot = (x, y, charge, solid) => {
      ctx.globalAlpha = solid ? 1 : 0.8;
      ctx.fillStyle = charge > 0 ? th.cation : th.anion;
      ctx.beginPath();
      ctx.arc(x0 + x * side, y0 + y * side, charge > 0 ? r * 0.78 : r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      if (r >= 7) text(ctx, charge > 0 ? '+' : '−', x0 + x * side, y0 + y * side, { size: r * 1.1, weight: 700, align: 'center', color: th.surface });
    };
    for (const k of filled) {
      const [i, j] = k.split(',').map(Number);
      dot(0.5 + i * CELL, 0.5 + j * CELL, L.siteCharge(i, j), true);
    }
    for (const ion of ions) dot(ion.x, ion.y, ion.charge, false);
    para(ctx, 'A teaching model: the ions wander at random, and one joins where it touches the crystal next to ions of the opposite charge.', w / 2, h - noteH + 12, w - 20, { size: narrow ? 10 : 12, color: th.muted });
  }
}
