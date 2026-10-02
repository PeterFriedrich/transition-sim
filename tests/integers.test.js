import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as I from '../site/js/model/integers.js';

test('test_integers_adding_rules_match_concept_1_2', () => {
  // (-4) + (-3) = -7; (-9) + 5 = -4; 9 + (-5) = 4
  assert.deepEqual(I.addRule(-4, -3), { kind: 'same', sizes: [4, 3], combined: 7, result: -7 });
  assert.deepEqual(I.addRule(-9, 5), { kind: 'different', sizes: [9, 5], combined: 4, result: -4 });
  assert.equal(I.addRule(9, -5).result, 4);
  assert.equal(I.addRule(-7, 10).result, 3); // quick check 1.6 #1
  assert.equal(I.addRule(0, -5).kind, 'zero');
  assert.equal(I.addRule(5, -5).result, 0);
});

test('test_integers_subtracting_is_adding_the_opposite', () => {
  // 5 - (-3) = 5 + 3 = 8; (-5) - 3 = -8; (-5) - (-3) = -2
  assert.deepEqual(I.subtractAsAdd(5, -3), { a: 5, opposite: 3, result: 8 });
  assert.deepEqual(I.subtractAsAdd(-5, 3), { a: -5, opposite: -3, result: -8 });
  assert.equal(I.subtractAsAdd(-5, -3).result, -2);
  assert.equal(I.subtractAsAdd(-8, -5).result, -3); // quick check 1.6 #2
  assert.ok(Object.is(I.subtractAsAdd(4, 0).opposite, 0), 'no −0');
});

test('test_integers_sign_rule_for_multiplying_and_dividing', () => {
  assert.equal(I.signRule(-6, -4), 'same');
  assert.equal(I.signRule(-6, 4), 'different');
  assert.equal(I.signRule(0, 4), 'zero');
  assert.deepEqual(I.divide(-12, -3), { quotient: 4, exact: true });
  assert.deepEqual(I.divide(12, -3), { quotient: -4, exact: true });
  assert.equal(I.divide(7, 2).exact, false);
  assert.equal(I.divide(3, 0), null);
});

test('test_integers_product_pattern_crosses_zero', () => {
  // 3(-2) = -6, 2(-2) = -4, 1(-2) = -2, 0(-2) = 0, so (-1)(-2) = +2
  assert.deepEqual(
    I.productPattern(-2, 3, -1).map((r) => r.product),
    [-6, -4, -2, 0, 2]
  );
  assert.ok(I.productPattern(-2, 0, 0).every((r) => Object.is(r.product, 0)), 'no −0');
});
