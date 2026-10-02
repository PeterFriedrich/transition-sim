// Fraction arithmetic the way concept 3 of docs/CONCEPTS_math15_review.md does
// it. A fraction is a [numerator, denominator] pair of integers; results keep
// the unsimplified form beside the simplified one, because the working shows both.
// The sign lives in the numerator; denominators are positive.

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
}

export function lcm(a, b) {
  return a === 0 || b === 0 ? 0 : Math.abs(a * b) / gcd(a, b);
}

// Sign into the numerator, without simplifying.
function normal([n, d]) {
  return d < 0 ? [-n, -d] : [n === 0 ? 0 : n, d];
}

export function reduce(f) {
  const [n, d] = normal(f);
  const g = gcd(n, d) || 1;
  return [n / g, d / g];
}

export function value([n, d]) {
  return n / d;
}

// Both fractions rewritten over the lowest common denominator. `ka` and `kb`
// are what each top and bottom was multiplied by.
export function common(a, b) {
  const den = lcm(a[1], b[1]);
  const ka = den / a[1];
  const kb = den / b[1];
  return { den, ka, kb, a: [a[0] * ka, den], b: [b[0] * kb, den] };
}

export function add(a, b) {
  const c = common(a, b);
  const raw = [c.a[0] + c.b[0], c.den];
  return { common: c, raw, reduced: reduce(raw) };
}

export function subtract(a, b) {
  const c = common(a, b);
  const raw = [c.a[0] - c.b[0], c.den];
  return { common: c, raw, reduced: reduce(raw) };
}

// Straight across.
export function multiply(a, b) {
  const raw = normal([a[0] * b[0], a[1] * b[1]]);
  return { raw, reduced: reduce(raw) };
}

// Multiply by the reciprocal of the second fraction; null when dividing by 0.
export function divide(a, b) {
  if (b[0] === 0) return null;
  const reciprocal = normal([b[1], b[0]]);
  return { reciprocal, ...multiply(a, reciprocal) };
}

// −1, 0 or 1 as a is less than, equal to or greater than b.
export function compare(a, b) {
  const c = common(a, b);
  return Math.sign(c.a[0] - c.b[0]);
}

// 17/12 → 1 5/12. `whole` and `n` are sizes; `negative` carries the sign.
export function mixed(f) {
  const [n, d] = reduce(f);
  const size = Math.abs(n);
  return { negative: n < 0, whole: Math.floor(size / d), n: size % d, d };
}

// 2 1/2 → 5/2.
export function improper(whole, n, d) {
  return [whole * d + n, d];
}
