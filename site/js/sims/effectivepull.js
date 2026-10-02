// Concept 1.5 of docs/CONCEPTS_science10_unitA.md.
import * as A from '../model/atoms.js';
import { fitCanvas, theme, clear, line, text, para } from '../lib/canvas.js';
import { section, slider, readouts } from '../lib/controls.js';
import { createClock } from '../lib/clock.js';

export const equations = [
  { html: 'effective pull ≈ protons − inner electrons', what: 'inner electrons screen part of the nucleus’s charge' },
  { html: 'across a period: more protons, same shells', what: 'atoms shrink and pull harder on electrons' },
  { html: 'down a group: more shells screen the added protons', what: 'outer electrons sit farther out and are held more loosely' },
];

export const prompts = [
  'Compare sodium and chlorine. Which holds its outer electrons more tightly? Which would rather lose one, and which gain one?',
  'Move across period 2 from lithium to neon. What happens to the pull, and to the number of shells?',
  'Lithium and sodium have the same pull in this picture. Why is sodium’s outer electron still easier to remove?',
  'Use the bars to explain why metals sit on the left of the table and nonmetals on the right.',
];

export const tallOnMobile = false;

export function mount(ui) {
  const z = slider(section(ui.controls, 'Element'), { label: 'Atomic number (3 to 18)', min: 3, max: 18, step: 1, value: 11 });
  const out = readouts(ui.readouts, [
    { id: 'el', label: 'Element' },
    { id: 'p', label: 'Protons' },
    { id: 'inner', label: 'Inner electrons' },
    { id: 'pull', label: 'Effective pull' },
    { id: 'shells', label: 'Shells' },
  ]);

  const canvas = fitCanvas(ui.canvas);
  createClock(ui.transport, { frame: draw });
  ui.transport.hidden = true; // nothing moves

  function draw() {
    const { ctx, w, h } = canvas;
    const th = theme();
    clear(ctx, w, h);
    const el = A.element(z.value);
    const e = A.effectivePull(el.z);
    out.set('el', `${el.name} (${el.symbol})`);
    out.set('p', String(e.protons));
    out.set('inner', String(e.inner));
    out.set('pull', `${e.protons} − ${e.inner} = ${e.pull}`);
    out.set('shells', String(e.shells));

    const narrow = w < 520;
    const pad = narrow ? 10 : 32;
    const top = para(ctx, `${el.name[0].toUpperCase()}${el.name.slice(1)}: ${e.protons} protons, ${e.inner} inner electrons screening them, so each outer electron feels a pull of about ${e.pull}.`, w / 2, narrow ? 18 : 24, w - 2 * pad, {
      size: narrow ? 12 : 15, weight: 600,
    }) + (narrow ? 16 : 22);
    const bottom = h - (narrow ? 84 : 66);
    const gap = narrow ? 12 : 30;
    const bw = (w - 2 * pad - gap) / 16;
    const unit = (bottom - top) / 8.6;
    [3, 11].forEach((first, g) => {
      const gx = pad + g * (8 * bw + gap);
      text(ctx, `period ${g + 2}: ${g + 2} shells`, gx + 4 * bw, top - 2, { size: narrow ? 10 : 13, color: th.muted, align: 'center', weight: 600 });
      line(ctx, gx, bottom, gx + 8 * bw, bottom, { color: th.muted });
      for (let i = 0; i < 8; i++) {
        const zz = first + i;
        const ee = A.effectivePull(zz);
        const on = zz === el.z;
        const x = gx + i * bw;
        ctx.fillStyle = on ? th.result : th.seriesA;
        ctx.globalAlpha = on ? 1 : 0.55;
        ctx.fillRect(x + 2, bottom - ee.pull * unit, bw - 4, ee.pull * unit);
        ctx.globalAlpha = 1;
        text(ctx, String(ee.pull), x + bw / 2, bottom - ee.pull * unit - 9, { size: narrow ? 10 : 13, align: 'center', weight: on ? 750 : 500, color: on ? th.ink : th.muted });
        text(ctx, A.element(zz).symbol, x + bw / 2, bottom + 13, { size: narrow ? 10 : 13, align: 'center', weight: on ? 750 : 500 });
      }
    });
    para(ctx, 'Qualitative: protons minus inner electrons. Going down a group the pull looks the same, but the outer shell is farther from the nucleus, so those electrons are held more loosely.', w / 2, bottom + (narrow ? 32 : 36), w - 2 * pad, {
      size: narrow ? 10 : 12, color: th.muted,
    });
  }
}
