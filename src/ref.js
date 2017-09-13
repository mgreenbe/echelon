const {inverse, negative, equal} = require('./arithmetic.js');
const {applyRowOp} = require('./rowops.js');

function nextRowOp(A, r = 0) {
  const m = A.length;
  leadingCols = A.map(a => a.findIndex(x => !equal(x, 0))).map(
    j => (j === -1 ? Infinity : j),
  );
  const pivCol = Math.min(...leadingCols);
  if (pivCol === Infinity) {
    // A is the zero matrix
    // console.log('Zero matrix!');
    return null;
  }
  const i = leadingCols.findIndex(j => equal(j, pivCol));
  if (i === 0) {
    // Pivot is in the first row.
    if (equal(A[i][pivCol], 1)) {
      // Pivot is 1.
      const ii = leadingCols.findIndex((j, ii) => j === pivCol && ii > i);
      if (ii === -1) {
        // There is no nonzero entry below the pivot.
        // Make recursive call.
        return nextRowOp(A.slice(1), r + 1);
      }
      // There is a nonzero entry below the pivot.
      // Kill it.
      // console.log(`Clear out entry (${ii}, ${pivCol}).`);
      return ['transvect', negative(A[ii][pivCol]), i + r, ii + r];
    }
    // Pivot is not 1. Scale it..
    // console.log(`Divide row ${i} by ${A[i][pivCol]}.`);
    return ['scale', inverse(A[i][pivCol]), i + r];
  }
  // Pivot is not in the first row. Swap.
  // console.log(`Swap rows ${0+r} and ${i+r}.`);
  return ['swap', undefined, 0 + r, i + r];
}

function pivCols(A) {
  return A.map(a => a.findIndex(x => equal(x, 1))).filter(j => j !== -1);
}

function next() {
  if (!(this.nextRowOp === null)) {
    this.matrix = applyRowOp(this.matrix, this.nextRowOp);
    this.nextRowOp = nextRowOp(this.matrix);
    if (this.nextRowOp === null) {
      this.pivCols = pivCols(this.matrix);
    }
  } else {
    console.log('Nothing to do; the matrix is in row echelon form.');
  }
  return this.matrix;
}

function Process(A) {
  this.matrix = Object.assign([], A);
  this.nextRowOp = nextRowOp(A);
  if (this.nextRowOp === null) {
    this.pivCols = pivCols(this.matrix);
  }
  this.next = next.bind(this);
}

function ref(A, pivCols) {
  const P = new Process(A);
  while (P.nextRowOp !== null) {
    P.next();
  }
  return [P.matrix, P.pivCols];
}

module.exports = {nextRowOp, Process, ref};
