const {mapMatrix, printMatrix} = require('./matrix-utils.js');
const Fraction = require('./fraction.js');
const {toREF, REF} = require('./ref-imperative.js');

function f(A) {
  return A.map(row =>
    row.map(x => {
      return new Fraction(x);
    }),
  );
}

const A = [[0, 3, -6, 6, 4, -5], [3, -7, 8, -5, 8, 9], [3, -9, 12, -9, 6, 15]];

printMatrix(f(A));

let [mats, ops] = toREF(REF(f(A)));

console.log(ops);
