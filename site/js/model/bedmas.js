// Order of operations, one step at a time: concepts 2.1–2.3 and 1.5 of
// docs/CONCEPTS_math15_review.md.
//
// An expression is a list of items:
//   { t: 'num', v }                      a number
//   { t: 'op', op, implicit }            + − × ÷ ^ (implicit: 2(4) has no × sign)
//   { t: 'neg' }                         a leading minus that waits for an exponent: −3²
//   { t: 'group', items }                a bracket that still has work inside
// The order: Brackets, Exponents, Division and Multiplication left to right
// (tied), Addition and Subtraction left to right (tied). An exponent applies
// only to what it is directly attached to, so −3² is −(3²).

const OPS = { '+': '+', '-': '−', '−': '−', '*': '×', '×': '×', x: '×', '/': '÷', '÷': '÷', '^': '^' };

export class BedmasError extends Error {}

function tokenize(src) {
  const out = [];
  const s = src.replace(/\s+/g, '');
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    const m = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (m) {
      out.push({ t: 'num', v: Number(m[0]) });
      i += m[0].length;
    } else if (ch === '(' || ch === ')') {
      out.push({ t: ch });
      i += 1;
    } else if (OPS[ch]) {
      out.push({ t: 'op', op: OPS[ch] });
      i += 1;
    } else {
      throw new BedmasError(`Unexpected "${ch}"`);
    }
  }
  return out;
}

// Tokens → nested items, with unary minus and implicit multiplication resolved.
function nest(tokens) {
  let pos = 0;
  const list = (depth) => {
    const items = [];
    const last = () => items[items.length - 1];
    const isValue = (it) => it && (it.t === 'num' || it.t === 'group');
    while (pos < tokens.length) {
      const tok = tokens[pos++];
      if (tok.t === ')') {
        if (depth === 0) throw new BedmasError('Unmatched )');
        return items;
      }
      if (tok.t === '(') {
        if (isValue(last())) items.push({ t: 'op', op: '×', implicit: true });
        const inner = list(depth + 1);
        if (!inner.length) throw new BedmasError('Empty brackets');
        items.push(inner.length === 1 && inner[0].t === 'num' ? inner[0] : { t: 'group', items: inner });
      } else if (tok.t === 'num') {
        if (isValue(last())) items.push({ t: 'op', op: '×', implicit: true });
        items.push({ t: 'num', v: tok.v });
      } else if (tok.op === '−' && !isValue(last())) {
        if (last()?.t === 'neg') throw new BedmasError('Two minus signs in a row');
        items.push({ t: 'neg' });
      } else {
        if (!isValue(last())) throw new BedmasError(`"${tok.op}" has nothing before it`);
        items.push({ t: 'op', op: tok.op });
      }
    }
    if (depth > 0) throw new BedmasError('Missing )');
    return items;
  };
  const items = list(0);
  const check = (xs) => {
    const end = xs[xs.length - 1];
    if (!end || end.t === 'op' || end.t === 'neg') throw new BedmasError('The expression ends too early');
    xs.forEach((x) => x.t === 'group' && check(x.items));
  };
  check(items);
  return items;
}

// A leading minus on a plain number is just a negative number, unless an
// exponent is waiting to act on the number first (−3² keeps its 'neg').
function fold(list) {
  const items = list.map((it) => {
    if (it.t !== 'group') return it;
    const inner = fold(it.items);
    return inner.length === 1 && inner[0].t === 'num' ? inner[0] : { t: 'group', items: inner };
  });
  const out = [];
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.t === 'neg' && items[i + 1]?.t === 'num' && items[i + 2]?.op !== '^') {
      out.push({ t: 'num', v: -items[i + 1].v || 0 });
      i += 1;
    } else {
      out.push(it);
    }
  }
  return out;
}

export function parse(src) {
  return fold(nest(tokenize(src)));
}

function apply(a, op, b) {
  switch (op) {
    case '+':
      return a + b;
    case '−':
      return a - b;
    case '×':
      return a * b;
    case '÷':
      if (b === 0) throw new BedmasError('Division by zero');
      return a / b;
    default:
      if (!Number.isInteger(b) || b < 0) throw new BedmasError('Exponents here must be whole numbers, 0 or more');
      return a ** b;
  }
}

// Index of the operator to do next in a bracket-free list, or −1.
function nextOp(items) {
  for (const set of [['^'], ['×', '÷'], ['+', '−']]) {
    const i = items.findIndex((it) => it.t === 'op' && set.includes(it.op));
    if (i >= 0) return i;
  }
  return -1;
}

const RULE = { '^': 'E', '×': 'DM', '÷': 'DM', '+': 'AS', '−': 'AS' };

// The path to the innermost, leftmost bracket that still has work in it.
function target(items, path = []) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].t === 'group') return target(items[i].items, [...path, i]);
  }
  return path;
}

// What happens next: { rule, at: path to the list, i: operator index }, or null when done.
export function next(items) {
  const path = target(items);
  let list = items;
  for (const i of path) list = list[i].items;
  const i = nextOp(list);
  if (i < 0) return null;
  if (list[i - 1]?.t !== 'num' || list[i + 1]?.t !== 'num') throw new BedmasError('Cannot work that out');
  return { rule: path.length ? 'B' : RULE[list[i].op], op: list[i].op, a: list[i - 1].v, b: list[i + 1].v, path, i };
}

// Does one operation and returns the new expression.
export function step(items) {
  const n = next(items);
  if (!n) return null;
  // Decimals: −0.8 × 1.5 is −1.2, not −1.2000000000000002.
  const value = Number(apply(n.a, n.op, n.b).toFixed(10));
  const replace = (list, path) => {
    if (!path.length) return [...list.slice(0, n.i - 1), { t: 'num', v: value === 0 ? 0 : value }, ...list.slice(n.i + 2)];
    const [head, ...rest] = path;
    return list.map((it, k) => (k === head ? { t: 'group', items: replace(it.items, rest) } : it));
  };
  return { ...n, value, items: fold(replace(items, n.path)) };
}

// Every line of the working, from the expression as written to its value.
export function solve(src) {
  let items = parse(src);
  const lines = [{ items }];
  for (let guard = 0; guard < 60; guard++) {
    const s = step(items);
    if (!s) break;
    items = s.items;
    lines.push({ items, rule: s.rule, op: s.op, a: s.a, b: s.b, value: s.value });
  }
  if (items.length !== 1 || items[0].t !== 'num') throw new BedmasError('Cannot work that out');
  return { lines, value: items[0].v };
}

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export function numStr(v) {
  const s = Number.isInteger(v) ? String(Math.abs(v)) : String(Number(Math.abs(v).toFixed(6)));
  return (v < 0 ? '−' : '') + s;
}

// The expression as a student writes it, as segments so the next operation can
// be highlighted: [{ str, hot }]. A negative number gets brackets unless it
// starts the expression or a bracket; 2(4) keeps its brackets; exponents are raised.
export function show(items, hot = null) {
  const segs = [];
  const walk = (list, path) => {
    const isHot = (i) => hot && hot.path.join() === path.join() && Math.abs(i - hot.i) <= 1;
    list.forEach((it, i) => {
      const prev = list[i - 1];
      const nextIt = list[i + 1];
      const h = isHot(i);
      if (it.t === 'neg') segs.push({ str: '−', hot: h });
      else if (it.t === 'op') {
        if (it.op === '^' || it.implicit) return;
        segs.push({ str: ` ${it.op} `, hot: h });
      } else if (it.t === 'group') {
        segs.push({ str: '(', hot: false });
        walk(it.items, [...path, i]);
        segs.push({ str: ')', hot: false });
      } else if (prev?.op === '^') {
        segs.push({ str: [...String(it.v)].map((d) => SUP[d] ?? d).join(''), hot: h });
      } else {
        const wrap = (prev?.implicit && prev.t === 'op') || (it.v < 0 && (i > 0 || nextIt?.op === '^'));
        segs.push({ str: wrap ? `(${numStr(it.v)})` : numStr(it.v), hot: h });
      }
    });
  };
  walk(items, []);
  return segs;
}

export function text(items) {
  return show(items).map((s) => s.str).join('');
}
