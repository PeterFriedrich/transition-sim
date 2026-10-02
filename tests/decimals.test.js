import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as D from '../site/js/model/decimals.js';

const p = D.parse;
const s = (x) => D.str(x);

test('test_decimals_parse_and_write_back_exactly', () => {
  assert.deepEqual(p('0.35'), { n: 35, dp: 2 });
  assert.deepEqual(p('-1.2'), { n: -12, dp: 1 });
  assert.deepEqual(p('3'), { n: 3, dp: 0 });
  assert.equal(p('1.2.3'), null);
  assert.equal(p('abc'), null);
  assert.equal(p('12345.6'), null);
  assert.equal(s(p('0.050')), '0.050');
  assert.equal(D.str(p('3'), 2), '3.00');
  assert.equal(s(D.trim(p('0.50'))), '0.5');
  assert.equal(s(D.trim(p('5.0'))), '5');
});

test('test_decimals_compare_after_padding', () => {
  // 0.3, 0.25, 0.305 -> 0.300, 0.250, 0.305 -> 0.25 < 0.3 < 0.305
  assert.deepEqual(D.pad([p('0.3'), p('0.25'), p('0.305')]).map(s), ['0.300', '0.250', '0.305']);
  assert.equal(D.compare(p('0.25'), p('0.3')), -1);
  assert.equal(D.compare(p('0.5'), p('0.50')), 0);
  // quick check 4.12 #1
  const order = ['0.4', '0.045', '0.39', '0.4005'].map(p).sort(D.compare).map(s);
  assert.deepEqual(order, ['0.045', '0.39', '0.4', '0.4005']);
});

test('test_decimals_add_and_subtract_lined_up', () => {
  assert.equal(s(D.add(p('4.7'), p('0.35'))), '5.05');
  assert.equal(s(D.subtract(p('3'), p('0.84'))), '2.16');
  assert.equal(s(D.subtract(p('6.2'), p('3.75'))), '2.45'); // quick check #2
  assert.equal(s(D.add(p('0.1'), p('0.2'))), '0.3'); // no float residue
  assert.equal(s(D.subtract(p('0.25'), p('0.3'))), '-0.05');
});

test('test_decimals_multiply_counts_the_places', () => {
  // 0.3 × 0.04 -> 3 × 4 = 12 -> 3 places -> 0.012
  const m = D.multiply(p('0.3'), p('0.04'));
  assert.equal(m.whole, 12);
  assert.equal(m.places, 3);
  assert.equal(s(m.result), '0.012');
  assert.equal(s(D.multiply(p('0.6'), p('0.07')).result), '0.042'); // quick check #3
  assert.equal(s(D.multiply(p('-0.4'), p('0.5')).result), '-0.20'); // 4.11, before trimming
  assert.equal(s(D.trim(D.multiply(p('-0.4'), p('0.5')).result)), '-0.2');
});

test('test_decimals_divide_by_shifting_both_points', () => {
  // 4.5 ÷ 0.3 = 45 ÷ 3 = 15; 0.72 ÷ 0.06 = 72 ÷ 6 = 12
  const a = D.divide(p('4.5'), p('0.3'));
  assert.equal(s(a.dividend), '45');
  assert.equal(s(a.divisor), '3');
  assert.equal(D.quotientString(a.quotient), '15');
  assert.equal(D.quotientString(D.divide(p('0.72'), p('0.06')).quotient), '12');
  assert.equal(D.quotientString(D.divide(p('2.4'), p('0.08')).quotient), '30'); // quick check #4
  assert.equal(D.quotientString(D.divide(p('7.5'), p('5')).quotient), '1.5'); // 4.7
  const n = D.divide(p('-1.2'), p('-0.04')); // 4.11
  assert.equal(n.negative, false);
  assert.equal(D.quotientString(n.quotient), '30');
  assert.equal(D.divide(p('1'), p('0')), null);
});

test('test_decimals_powers_of_ten_move_the_point', () => {
  assert.equal(s(D.shift(p('3.7'), 2)), '370');
  assert.equal(s(D.shift(p('52'), -3)), '0.052');
});

test('test_decimals_long_division_terminating_and_repeating', () => {
  // 3/8: 30 ÷ 8 = 3 r6; 60 ÷ 8 = 7 r4; 40 ÷ 8 = 5 r0 -> 0.375
  const q = D.longDivision(3, 8);
  assert.deepEqual(q.steps, [
    { from: 30, digit: 3, rem: 6 },
    { from: 60, digit: 7, rem: 4 },
    { from: 40, digit: 5, rem: 0 },
  ]);
  assert.equal(q.terminates, true);
  assert.equal(D.quotientString(q), '0.375');
  // 1/3: remainder 1 keeps recurring
  const r = D.longDivision(1, 3);
  assert.equal(r.terminates, false);
  assert.equal(r.repeatAt, 0);
  assert.equal(D.quotientString(r), '0.333...');
  assert.equal(D.quotientString(D.longDivision(2, 3)), '0.666...');
  assert.equal(D.quotientString(D.longDivision(1, 6)), '0.1666...');
  assert.equal(D.longDivision(1, 6).repeatAt, 1);
  assert.equal(D.quotientString(D.longDivision(5, 16)), '0.3125'); // quick check #5
  assert.equal(D.quotientString(D.longDivision(1, 7)), '0.142857...');
});

test('test_decimals_terminate_only_with_factors_of_2_and_5', () => {
  assert.equal(D.terminates(8), true);
  assert.equal(D.terminates(3), false);
  assert.equal(D.terminates(20), true);
  assert.equal(D.terminates(12), false);
  assert.deepEqual(D.primeFactors(200), [2, 2, 2, 5, 5]);
  for (let d = 1; d <= 40; d++) assert.equal(D.longDivision(1, d).terminates, D.terminates(d), `1/${d}`);
});

test('test_decimals_to_fraction_reads_the_place_value', () => {
  assert.deepEqual(D.toFraction(p('0.35')), { raw: [35, 100], reduced: [7, 20] });
  assert.deepEqual(D.toFraction(p('0.045')), { raw: [45, 1000], reduced: [9, 200] }); // quick check #6
  assert.deepEqual(D.toFraction(p('0.25')).reduced, [1, 4]);
});

test('test_decimals_round_half_up_on_the_next_digit', () => {
  assert.equal(s(D.round(p('3.746'), 2)), '3.75');
  assert.equal(s(D.round(p('0.0849'), 2)), '0.08');
  assert.equal(s(D.round(p('12.0963'), 2)), '12.10'); // quick check #7
  assert.equal(D.round(p('3.746'), 2).next, 6);
  assert.equal(s(D.round(p('-0.25'), 1)), '-0.3');
  assert.equal(s(D.round(p('0.04'), 1)), '0.0');
});
