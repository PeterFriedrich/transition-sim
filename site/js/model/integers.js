// Integer rules, concepts 1.1–1.4 of docs/CONCEPTS_math15_review.md.
// "Size" is the concept set's word for absolute value (distance from 0).

// Which adding rule applies: same signs (add the sizes, keep the sign) or
// different signs (subtract the sizes, keep the sign of the larger size).
export function addRule(a, b) {
  const sizes = [Math.abs(a), Math.abs(b)];
  const result = a + b;
  if (a === 0 || b === 0) return { kind: 'zero', sizes, result };
  if (Math.sign(a) === Math.sign(b)) return { kind: 'same', sizes, combined: sizes[0] + sizes[1], result };
  return { kind: 'different', sizes, combined: Math.abs(sizes[0] - sizes[1]), result };
}

// Subtracting is adding the opposite: a − b = a + (−b).
export function subtractAsAdd(a, b) {
  const opposite = b === 0 ? 0 : -b;
  return { a, opposite, result: a + opposite };
}

// Same signs: positive. Different signs: negative. Holds for × and ÷.
export function signRule(a, b) {
  if (a === 0 || b === 0) return 'zero';
  return Math.sign(a) === Math.sign(b) ? 'same' : 'different';
}

// The pattern behind (−)(−) = (+): k × b for k counting down from `from` to `to`.
export function productPattern(b, from, to) {
  const rows = [];
  for (let k = from; k >= to; k--) rows.push({ k, product: k * b === 0 ? 0 : k * b });
  return rows;
}

// a ÷ b for integers; null when b is 0. `exact` is false when it does not divide evenly.
export function divide(a, b) {
  if (b === 0) return null;
  const q = a / b;
  return { quotient: q === 0 ? 0 : q, exact: Number.isInteger(q) };
}
