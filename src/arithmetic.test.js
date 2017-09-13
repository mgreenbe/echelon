const {random} = require('lodash');
const Fraction = require('./fraction.js');
const {equal, add, negative, multiply, inverse} = require('./arithmetic.js');

const N = 100;
const n1 = random(-N, N);
const n2 = random(-N, N);
const d1 = random(1, N);
const d2 = random(1, N);
const d3 = random(1, N);
const x = new Fraction(n1, d1);
const y = new Fraction(n2, d2);

test('adds, negates fractions correctly', () => {
  const z = new Fraction(n1 * d2 - n2 * d1, d1 * d2);
  expect(add(x, negative(y))).toEqual(z);
});

test('multiplies, inverts fractions correctly', () => {
  const y = new Fraction(d2, d3);
  const z = new Fraction(n1 * d3, d1 * d2);
  expect(multiply(x, inverse(y))).toEqual(z);
});

test('equates fractions and numbers correctly', () => {
  const x = Math.random() * N;
  const y = new Fraction(x);
  expect(equal(x, y)).toBe(true);
});

test('equates fractions and numbers correctly', () => {
  const x = Math.random() * N;
  const y = Math.random() * N;
  const z = 1 / x - y;
  const xx = new Fraction(x);
  const yy = new Fraction(y);
  const zz = add(inverse(x), negative(y));
  expect(equal(z, zz)).toBe(true);
});
