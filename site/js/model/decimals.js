// Decimal procedures, concept 4 of docs/CONCEPTS_math15_review.md.
//
// A decimal is held exactly as { n, dp }: the whole number you get by ignoring
// the point, and how many digits sit to the right of it (0.35 is { n: 35, dp: 2 }).
// That is the concept set's own method ("multiply as whole numbers, then count
// the places"), and it keeps floating-point residue out of every readout.

import { gcd } from './fractions.js';

// Up to 4 digits before the point and 4 after, so every product stays exact.
const SHAPE = /^-?\d{1,4}(\.\d{1,4})?$/;

export function parse(str) {
  const s = String(str).trim().replace('−', '-');
  if (!SHAPE.test(s)) return null;
  const [, frac = ''] = s.split('.');
  const n = Number(s.replace('.', ''));
  return { n: n === 0 ? 0 : n, dp: frac.length };
}

// The digits written out with `dp` places (never fewer than the value needs).
export function str({ n, dp }, places = dp) {
  let size = Math.abs(n);
  let d = dp;
  while (d < places) {
    size *= 10;
    d += 1;
  }
  let digits = String(size).padStart(d + 1, '0');
  if (d > 0) digits = `${digits.slice(0, -d)}.${digits.slice(-d)}`;
  return (n < 0 ? '-' : '') + digits;
}

// Trailing zeros after the point dropped: 5.0 → 5, 0.50 → 0.5.
export function trim(x) {
  let { n, dp } = x;
  while (dp > 0 && n % 10 === 0) {
    n /= 10;
    dp -= 1;
  }
  return { n, dp };
}

// The same values with the same number of places, so they compare digit by digit.
export function pad(xs) {
  const dp = Math.max(...xs.map((x) => x.dp));
  return xs.map((x) => ({ n: x.n * 10 ** (dp - x.dp), dp }));
}

export function compare(a, b) {
  const [pa, pb] = pad([a, b]);
  return Math.sign(pa.n - pb.n);
}

export function add(a, b) {
  const [pa, pb] = pad([a, b]);
  return { n: pa.n + pb.n, dp: pa.dp };
}

export function subtract(a, b) {
  const [pa, pb] = pad([a, b]);
  return { n: pa.n - pb.n, dp: pa.dp };
}

// Multiply as whole numbers, then the answer has as many places as both factors combined.
export function multiply(a, b) {
  const whole = a.n * b.n;
  const places = a.dp + b.dp;
  return { whole: whole === 0 ? 0 : whole, places, result: { n: whole === 0 ? 0 : whole, dp: places } };
}

// × 10^k (k may be negative): the point moves, the digits do not change.
export function shift({ n, dp }, k) {
  const places = dp - k;
  return places < 0 ? { n: n * 10 ** -places, dp: 0 } : { n, dp: places };
}

// Shift the point in both numbers until the divisor is whole, then divide.
// `quotient` is a long division of the two whole numbers that are left.
export function divide(a, b) {
  if (b.n === 0) return null;
  const places = b.dp;
  const dividend = shift(a, places);
  const divisor = shift(b, places);
  const negative = Math.sign(a.n) * Math.sign(b.n) < 0;
  const quotient = longDivision(Math.abs(dividend.n), Math.abs(divisor.n) * 10 ** dividend.dp);
  return { places, dividend, divisor, negative, quotient };
}

// n ÷ d by long division, for whole numbers n ≥ 0 and d > 0. Each step brings
// down a zero: `from` ÷ d = `digit` remainder `rem`. Stops when the remainder
// reaches 0 (terminating) or comes back (repeating: `repeatAt` is the index of
// the first digit of the repeating block).
export function longDivision(n, d, max = 40) {
  const whole = Math.floor(n / d);
  let rem = n % d;
  const seen = new Map();
  const steps = [];
  let repeatAt = -1;
  while (rem !== 0 && steps.length < max) {
    if (seen.has(rem)) {
      repeatAt = seen.get(rem);
      break;
    }
    seen.set(rem, steps.length);
    const from = rem * 10;
    const digit = Math.floor(from / d);
    rem = from % d;
    steps.push({ from, digit, rem });
  }
  return { whole, firstRem: n % d, steps, digits: steps.map((s) => s.digit), repeatAt, terminates: rem === 0 };
}

// "0.375", or "0.1666..." for a repeating decimal (the block written `repeats` times).
export function quotientString(q, repeats = 3) {
  if (!q.digits.length) return String(q.whole);
  if (q.repeatAt < 0) return `${q.whole}.${q.digits.join('')}${q.terminates ? '' : '...'}`;
  const head = q.digits.slice(0, q.repeatAt).join('');
  const block = q.digits.slice(q.repeatAt).join('');
  let shown = block.repeat(repeats);
  if (shown.length > 12) shown = block;
  return `${q.whole}.${head}${shown}...`;
}

// Read the place value, then simplify: 0.35 = 35/100 = 7/20.
export function toFraction(x) {
  const raw = [x.n, 10 ** x.dp];
  const g = gcd(raw[0], raw[1]) || 1;
  return { raw, reduced: [raw[0] / g, raw[1] / g] };
}

// Look at the digit just past the one you keep; 5 or more rounds up (the size
// goes up, for negatives too). Returns null if there is nothing to round.
export function round(x, places) {
  if (places >= x.dp) return { n: x.n * 10 ** (places - x.dp), dp: places, next: null };
  const cut = 10 ** (x.dp - places);
  const size = Math.abs(x.n);
  const next = Math.floor((size % cut) / (cut / 10));
  const kept = Math.floor(size / cut) + (next >= 5 ? 1 : 0);
  return { n: (x.n < 0 ? -kept : kept) || 0, dp: places, next };
}

export function primeFactors(n) {
  const out = [];
  for (let p = 2; p * p <= n; p++) {
    while (n % p === 0) {
      out.push(p);
      n /= p;
    }
  }
  if (n > 1) out.push(n);
  return out;
}

// A simplified fraction terminates only if its denominator has just factors of 2 and 5.
export function terminates(denominator) {
  return primeFactors(denominator).every((p) => p === 2 || p === 5);
}
