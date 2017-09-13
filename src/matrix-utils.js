const columnify = require('columnify');

function mapMatrix(A, f) {
  return A.map((row, i) => row.map((x, j) => f(x, i, j)));
}

function printMatrix(A) {
  console.log(
    columnify(mapMatrix(A, x => (typeof x === 'number' ? x : x.toFraction())), {
      showHeaders: false,
      columnSplitter: '   ',
      align: 'right',
    }),
  );
}

module.exports = {mapMatrix, printMatrix};
