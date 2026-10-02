import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as B from '../site/js/model/bedmas.js';

const value = (src) => B.solve(src).value;
const working = (src) => B.solve(src).lines.map((l) => B.text(l.items));

test('test_bedmas_division_and_multiplication_are_tied_left_to_right', () => {
  assert.equal(value('12 ÷ 3 × 2'), 8); // not 2
  assert.equal(value('12 - 3 + 2'), 11);
  assert.deepEqual(working('12 ÷ 3 × 2'), ['12 ÷ 3 × 2', '4 × 2', '8']);
});

test('test_bedmas_worked_example_2_2_line_by_line', () => {
  assert.deepEqual(working('8 - 2(3 + 1)^2 ÷ 4'), ['8 − 2(3 + 1)² ÷ 4', '8 − 2(4)² ÷ 4', '8 − 2(16) ÷ 4', '8 − 32 ÷ 4', '8 − 8', '0']);
  assert.deepEqual(
    B.solve('8 - 2(3 + 1)^2 ÷ 4').lines.slice(1).map((l) => l.rule),
    ['B', 'E', 'DM', 'DM', 'AS']
  );
});

test('test_bedmas_exponent_applies_only_to_what_it_is_attached_to', () => {
  assert.equal(value('(-3)^2'), 9);
  assert.equal(value('-3^2'), -9);
  assert.equal(value('-4^2'), -16); // quick check 1.6 #6
  assert.equal(value('(-4)^2'), 16);
  assert.deepEqual(working('-3^2'), ['−3²', '−9']);
  assert.deepEqual(working('(-3)^2'), ['(−3)²', '9']);
});

test('test_bedmas_with_integers', () => {
  // -5 - (-3) × 2: multiply first -> -5 - (-6) = -5 + 6 = 1
  assert.deepEqual(working('-5 - (-3) × 2'), ['−5 − (−3) × 2', '−5 − (−6)', '1']);
  assert.deepEqual(working('-2(3 - 7)'), ['−2(3 − 7)', '−2(−4)', '8']);
  assert.equal(value('6 - 2(-3)'), 12); // quick check 1.6 #4
  assert.equal(value('(-18) ÷ 3 - (-4)'), -2); // #5
  assert.equal(value('(-3)(-4)(-2)'), -24); // #3
  assert.equal(value('-(3 + 1)'), -4);
  assert.equal(value('(-0.8) × 1.5 + 2'), 0.8); // quick check 4.12 #8
});

test('test_bedmas_rejects_what_it_cannot_read', () => {
  for (const bad of ['', '3 +', '(3 + 1', '3 + 1)', '2 ÷ 0', '3 $ 4', '()', '× 3']) {
    assert.throws(() => B.solve(bad), B.BedmasError, bad);
  }
});

test('test_bedmas_next_operation_is_marked_for_highlighting', () => {
  const items = B.parse('8 - 2(3 + 1)^2 ÷ 4');
  const hot = B.show(items, B.next(items)).filter((s) => s.hot).map((s) => s.str).join('');
  assert.equal(hot, '3 + 1');
});
