const {applyRowOp} = require('./rowops.js');
const {add, negative, multiply, inverse} = require('./arithmetic.js');
const {random} = require('lodash');
const Fraction = require('./fraction.js');

const N = 100;
const a1 = -random(1, N);
const a2 = random(1, N);
const a = new Fraction(a1, a2);
const b1 = random(-N, N);
const b2 = random(1, N);
const b = new Fraction(b1, b2);
const c1 = random(-N, N);
const c2 = random(1, N);
const c = new Fraction(c1, c2);
const d1 = random(-N, N);
const d2 = random(1, N);
const d = new Fraction(d1, d2);
const A = [[a, b], [c, d]];
const x = new Fraction(random(-N, N), random(1, N));
const y = Math.random() * N;

test('swaps correctly', () => {
  expect(applyRowOp(A, ['swap', null, 1, 0])).toEqual([[c, d], [a, b]]);
});

test('scales correctly', () => {
  expect(applyRowOp(A, ['scale', x, 0])).toEqual([
    [multiply(x, a), multiply(x, b)],
    [c, d],
  ]);
});

test('scales correctly', () => {
  expect(applyRowOp(A, ['scale', y, 1, null])).toEqual([
    [a, b],
    [multiply(y, c), multiply(y, d)],
  ]);
});

test('transvects correctly', () => {
  expect(applyRowOp(A, ['transvect', y, 0, 1])).toEqual([
    [a, b],
    [add(multiply(y, a), c), add(multiply(y, b), d)],
  ]);
});

test('transvects correctly', () => {
  expect(applyRowOp(A, ['transvect', x, 1, 0])).toEqual([
    [add(multiply(x, c), a), add(multiply(x, d), b)],
    [c, d],
  ]);
});

test('transvects correctly', () => {
  const t = negative(multiply(c, inverse(a)));
  const dd = add(d, multiply(b, t));
  expect(applyRowOp(A, ['transvect', t, 0, 1])).toEqual([
    [a, b],
    [new Fraction(0), dd],
  ]);
});
