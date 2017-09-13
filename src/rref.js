const {equal, negative} = require('./arithmetic.js');
const {applyRowOp} = require('./rowops.js');

nextRowOp = function(A, pivCols) {
  const r = pivCols.length;
  for (let i = 0; i < r; i++) {
    let j = pivCols[r - i - 1];
    for (k = 0; k < i; k++) {
      let a = A[k][j];
      if (!equal(a, 0)) {
        return ['transvect', negative(a), i, k];
      }
    }
  }
};

function next() {
  if (this.nextRowOp !== null) {
    this.matrix = applyRowOp(this.matrix, this.nextRowOp);
    this.matrix = nextRowOp(this.matrix, this.pivCols);
  } else {
    console.log('Nothing to do; the matrix is in reduced row echelon form.');
  }
  return this.matrix;
}

function Process(A, pivCols) {
  this.matrix = Object.assign([], A);
  this.pivCols = Object.assign([], pivCols);
  const op = nextRowOp(A, pivCols);
  this.nextRowOp = op;
  this.next = next.bind(this);
}

module.exports = {nextRowOp, Process};
