const {add, multiply} = require('./arithmetic.js');

function swap(A, i, j) {
  return Object.assign([], A, {[i]: A[j], [j]: A[i]});
}

function scale(A, c, i) {
  return Object.assign([], A, {[i]: A[i].map(a => multiply(c, a))});
}

function transvect(A, c, i, j) {
  return Object.assign([], A, {
    [j]: A[j].map((a, k) => add(a, multiply(c, A[i][k]))),
  });
}

function applyRowOp(A, [type, c, i, j], verbose = false) {
  switch (type) {
    case 'swap':
      if (verbose) {
        console.log(`Swapped rows ${i + 1} and ${j + 1}.`);
      }
      return swap(A, i, j);
    case 'scale':
      if (verbose) {
        console.log(`Multiplied row ${i + 1} by ${c}.`);
      }
      return scale(A, c, i);
    case 'transvect':
      if (verbose) {
        console.log(`Added ${c} times row ${i + 1} to row ${j + 1}.`);
      }
      return transvect(A, c, i, j);
    default:
      console.log('No such row operation.');
  }
}

module.exports = {swap, scale, transvect, applyRowOp};
