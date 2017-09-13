const {nextRowOp, ref} = require('./ref.js');
const {applyRowOp} = require('./rowops');
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
const B = applyRowOp(A, ['scale', inverse(a), 0]);
const C = applyRowOp(B, ['transvect', negative(B[1][0]), 0, 1]);
const D = applyRowOp(C, ['scale', inverse(C[1][1]), 1]);
test('picks right 1', () => {
  expect(nextRowOp(A)).toEqual(['scale', inverse(a), 0]);
});

test('picks right 2', () => {
  expect(nextRowOp(B)).toEqual(['transvect', negative(B[1][0]), 0, 1]);
});

test('picks right 3', () => {
  expect(nextRowOp(C)).toEqual(['scale', inverse(C[1][1]), 1]);
});

test('picks right 4', () => {
  expect(nextRowOp(D)).toEqual(null);
});

test('reduces to ref correctly 1', () => {
  expect(ref(A)).toEqual([D, [0, 1]]);
});

test('reduces to ref correctly 2', () => {
  const E = [
    [new Fraction(0), new Fraction(1), new Fraction(2)],
    [new Fraction(3), new Fraction(4), new Fraction(5)],
    [new Fraction(6), new Fraction(7), new Fraction(8)],
  ];
  const F = [
    [new Fraction(1), new Fraction(4, 3), new Fraction(5, 3)],
    [new Fraction(0), new Fraction(1), new Fraction(2)],
    [new Fraction(0), new Fraction(0), new Fraction(0)],
  ];
  expect(ref(E)).toEqual([F, [0, 1]]);
});

test('reduces to ref correctly 3', () => {
  const E = [
    [new Fraction(1), new Fraction(2), new Fraction(3)],
    [new Fraction(4), new Fraction(5), new Fraction(6)],
    [new Fraction(7), new Fraction(8), new Fraction(9)],
  ];
  const F = [
    [new Fraction(1), new Fraction(2), new Fraction(3)],
    [new Fraction(0), new Fraction(1), new Fraction(2)],
    [new Fraction(0), new Fraction(0), new Fraction(0)],
  ];
  expect(ref(E)).toEqual([F, [0, 1]]);
});

test('reduces to ref correctly 4', () => {
  const E = [[1, 2, 3, 4], [0, 0, 0, 1]];
  expect(ref(E)).toEqual([E, [0, 3]]);
});

test('reduces to ref correctly 5', () => {
  const E = [
    [new Fraction(0), new Fraction(0), new Fraction(0), new Fraction(4)],
    [new Fraction(0), new Fraction(0), new Fraction(3), new Fraction(7)],
  ];
  expect(ref(E)).toEqual([
    [
      [new Fraction(0), new Fraction(0), new Fraction(1), new Fraction(7, 3)],
      [new Fraction(0), new Fraction(0), new Fraction(0), new Fraction(1)],
    ],
    [2, 3],
  ]);
});
