const { applyRowOp } = require("./rowops.js");
const { equal, negative, inverse } = require("./arithmetic.js");

function tail(A) {
  return A[A.length - 1];
}

function getPivot(A, i) {
  const [m, n] = [A.length, A[0].length];
  for (let j = 0; j < n; j++) {
    for (let p = i; p < m; p++) {
      if (!equal(A[p][j], 0)) {
        return [p, j];
      }
    }
  }
  return null;
}

function toREF(A) {
  let m = A.length;
  let mats = [Object.assign([], A)];
  let rowOps = [];
  for (let i = 0; i < m; i++) {
    let [p, j] = getPivot(tail(mats), i) || [];
    if (p === undefined) {
      return [mats, rowOps];
    }
    if (p !== i) {
      rowOps.push(["swap", null, i, p]);
      mats.push(applyRowOp(tail(mats), tail(rowOps)));
    }
    if (!equal(tail(mats)[i][j], 1)) {
      rowOps.push(["scale", inverse(tail(mats)[i][j]), i]);
      mats.push(applyRowOp(tail(mats), tail(rowOps)));
    }
    for (let q = i + 1; q < m; q++) {
      if (!equal(tail(mats)[q][j], 0)) {
        rowOps.push(["transvect", negative(tail(mats)[q][j]), i, q]);
        mats.push(applyRowOp(tail(mats), tail(rowOps)));
      }
    }
  }
  return [mats, rowOps];
}

function REF(A) {
  const [mats] = toREF(A);
  return tail(mats);
}

function REFtoRREF(A) {
  const pivCols = [];
  A.forEach(row => {
    let j = row.findIndex(x => !equal(x, 0));
    if (j !== -1) {
      pivCols.push(j);
    }
  });
  const r = pivCols.length;
  let mats = [Object.assign([], A)];
  let rowOps = [];
  pivCols.reverse().forEach((j, i) => {
    const p = r - i - 1;
    for (let q = 0; q < p; q++) {
      if (!equal(tail(mats)[q][j], 0)) {
        rowOps.push(["transvect", negative(tail(mats)[q][j]), p, q]);
        mats.push(applyRowOp(tail(mats), tail(rowOps)));
      }
    }
  });
  return [mats, rowOps];
}

function RREF(A) {
  let [mats] = REFtoRREF(REF(A));
  return tail(mats);
}

module.exports = { toREF, REF, REFtoRREF, RREF };
