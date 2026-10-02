import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as F from '../site/js/model/fractions.js';

test('test_fractions_simplify_with_the_gcf', () => {
  assert.deepEqual(F.reduce([18, 24]), [3, 4]);
  assert.deepEqual(F.reduce([24, 36]), [2, 3]); // quick check 3.9 #1
  assert.deepEqual(F.reduce([3, -6]), [-1, 2]);
  assert.deepEqual(F.reduce([0, 5]), [0, 1]);
  assert.equal(F.lcm(3, 4), 12);
  assert.equal(F.gcd(18, 24), 6);
});

test('test_fractions_add_and_subtract_over_the_lcm', () => {
  // 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12
  const s = F.add([2, 3], [3, 4]);
  assert.deepEqual(s.common.a, [8, 12]);
  assert.deepEqual(s.common.b, [9, 12]);
  assert.deepEqual(s.raw, [17, 12]);
  assert.deepEqual(F.mixed(s.reduced), { negative: false, whole: 1, n: 5, d: 12 });
  // 5/6 - 1/4 = 10/12 - 3/12 = 7/12
  const d = F.subtract([5, 6], [1, 4]);
  assert.deepEqual([d.common.a, d.common.b, d.reduced], [[10, 12], [3, 12], [7, 12]]);
  // quick check 3.9 #3, #4, #8
  assert.deepEqual(F.add([1, 2], [3, 5]).reduced, [11, 10]);
  assert.deepEqual(F.subtract([7, 8], [1, 3]).reduced, [13, 24]);
  assert.deepEqual(F.subtract([-2, 5], [-1, 10]).reduced, [-3, 10]);
});

test('test_fractions_multiply_straight_across', () => {
  // 2/3 × 9/10 = 18/30 = 3/5
  assert.deepEqual(F.multiply([2, 3], [9, 10]), { raw: [18, 30], reduced: [3, 5] });
  assert.deepEqual(F.multiply([4, 9], [3, 8]).reduced, [1, 6]); // quick check #5
  assert.deepEqual(F.multiply([-2, 3], [3, 4]).reduced, [-1, 2]); // 3.8
  // 2 1/2 × 1 1/3 = 5/2 × 4/3 = 20/6 = 10/3 = 3 1/3
  const m = F.multiply(F.improper(2, 1, 2), F.improper(1, 1, 3));
  assert.deepEqual(m.raw, [20, 6]);
  assert.deepEqual(F.mixed(m.reduced), { negative: false, whole: 3, n: 1, d: 3 });
});

test('test_fractions_divide_by_multiplying_by_the_reciprocal', () => {
  // 3/4 ÷ 2/3 = 3/4 × 3/2 = 9/8
  const q = F.divide([3, 4], [2, 3]);
  assert.deepEqual(q.reciprocal, [3, 2]);
  assert.deepEqual(q.reduced, [9, 8]);
  assert.deepEqual(F.divide([5, 6], [5, 12]).reduced, [2, 1]); // quick check #6
  assert.deepEqual(F.divide(F.improper(1, 1, 2), [3, 4]).reduced, [2, 1]); // #7
  // -3/5 ÷ (-1/10) = -3/5 × -10/1 = 6
  const n = F.divide([-3, 5], [-1, 10]);
  assert.deepEqual(n.reciprocal, [-10, 1]);
  assert.deepEqual(n.reduced, [6, 1]);
  assert.equal(F.divide([1, 2], [0, 3]), null);
});

test('test_fractions_compare_and_order', () => {
  // 3/5 < 5/8 < 2/3 ; quick check: 2/3 < 5/7 < 3/4
  assert.equal(F.compare([3, 5], [5, 8]), -1);
  assert.equal(F.compare([2, 3], [5, 8]), 1);
  assert.equal(F.compare([2, 3], [4, 6]), 0);
  const sorted = [[3, 4], [5, 7], [2, 3]].sort(F.compare);
  assert.deepEqual(sorted, [[2, 3], [5, 7], [3, 4]]);
  assert.equal(F.compare([1, 3], [1, 5]), 1);
});
