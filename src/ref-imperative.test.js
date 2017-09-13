const Fraction = require('./fraction.js');
const {equal} = require('./arithmetic.js');
const {RREF} = require('./ref-imperative.js');

// matrix of numbers to matrix of fractions
function f(A) {
  return A.map(row =>
    row.map(x => {
      return new Fraction(x);
    }),
  );
}

function matrixEqual(A, B) {
  return A.map((row, i) => {
    return row.every((x, j) => equal(x, B[i][j]));
  }).every(x => x);
}

test('computes rref correctly 1', () => {
  const A = [[1, 6, 2, -5, -2, -4], [0, 0, 2, -8, -1, 3], [0, 0, 0, 0, 1, 7]];
  const R = [[1, 6, 0, 3, 0, 0], [0, 0, 1, -4, 0, 5], [0, 0, 0, 0, 1, 7]];
  expect(equal(RREF(A), R)).toBe(true);
});

test('computes rref correctly 1', () => {
  const A = [[0, 1, 2, 1, 0, 0], [1, 0, 3, 0, 1, 0], [4, -3, 8, 0, 0, 1]];
  const R = [
    [1, 0, 0, -9 / 2, 7, -3 / 2],
    [0, 1, 0, -2, 4, -1],
    [0, 0, 1, 3 / 2, -2, 1 / 2],
  ];
  expect(equal(RREF(A), R)).toBe(true);
});

test('computes rref correctly 3', () => {
  const A = [
    [0, 3, -6, 6, 4, -5],
    [3, -7, 8, -5, 8, 9],
    [3, -9, 12, -9, 6, 15],
  ];
  const R = [[1, 0, -2, 3, 0, -24], [0, 1, -2, 2, 0, -7], [0, 0, 0, 0, 1, 4]];
  expect(equal(RREF(f(A)), R)).toBe(true);
});
