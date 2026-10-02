// Bohr-Rutherford diagrams: a labelled nucleus, rings, electrons on the rings,
// and square brackets with the charge for an ion.
import { theme, text } from './canvas.js';

// Ring radii. `slots` keeps the spacing of the neutral atom when its ion has
// fewer shells, so the lost ring visibly disappears instead of the rest spreading out.
export function ringRadius(R, slots, k) {
  const core = R * 0.26;
  return core + ((R - core) * (k + 1)) / Math.max(slots, 1);
}

// Where electron i of `count` sits on ring k. They start at the top and go round evenly.
export function electronPos(cx, cy, R, slots, k, i, count) {
  const r = ringRadius(R, slots, k);
  const a = -Math.PI / 2 + (2 * Math.PI * i) / count;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

// shells: electrons per ring. nucleus: one or two short lines of text.
// highlight: index of the ring whose electrons are drawn in the accent colour.
// charge: a string such as "⁺" or "²⁻" turns the diagram into a bracketed ion.
// hide: [{ k, i }] electrons to leave out (they are being drawn in flight).
export function drawAtom(ctx, cx, cy, R, { shells, slots = shells.length, nucleus = [], highlight = -1, charge = '', hide = [], nucleusColor } = {}) {
  const th = theme();
  const core = R * 0.26;
  ctx.save();
  ctx.lineWidth = 1;
  ctx.strokeStyle = th.muted;
  for (let k = 0; k < shells.length; k++) {
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius(R, slots, k), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = th.grid;
  ctx.strokeStyle = nucleusColor ?? th.cation;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, core * 0.86, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  const size = Math.max(8, Math.min(13, core * 0.42));
  nucleus.forEach((s, i) => text(ctx, s, cx, cy + (i - (nucleus.length - 1) / 2) * size * 1.15, { size, weight: 700, align: 'center' }));
  const er = Math.max(2.5, R * 0.045);
  shells.forEach((count, k) => {
    for (let i = 0; i < count; i++) {
      if (hide.some((e) => e.k === k && e.i === i)) continue;
      const p = electronPos(cx, cy, R, slots, k, i, count);
      ctx.fillStyle = k === highlight ? th.result : th.electron;
      ctx.beginPath();
      ctx.arc(p.x, p.y, er, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  if (charge) {
    const b = R * 1.1;
    const lip = R * 0.16;
    ctx.strokeStyle = th.ink;
    ctx.lineWidth = 2;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(cx + side * (b - lip), cy - b);
      ctx.lineTo(cx + side * b, cy - b);
      ctx.lineTo(cx + side * b, cy + b);
      ctx.lineTo(cx + side * (b - lip), cy + b);
      ctx.stroke();
    }
    text(ctx, charge.replace(/[⁺⁻²³⁴]/g, (c) => ({ '⁺': '+', '⁻': '−', '²': '2', '³': '3', '⁴': '4' })[c]), cx + b + 4, cy - b, { size: Math.max(11, R * 0.22), weight: 750 });
  }
  ctx.restore();
}
