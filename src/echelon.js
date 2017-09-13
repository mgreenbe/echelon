import { equal, negative, inverse } from "./arithmetic.js";

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

export default function nextRowOp(A) {
  let m = A.length;
  for (let i = 0; i < m; i++) {
    let [p, j] = getPivot(A, i) || [];
    if (p !== undefined) {
      if (p !== i) {
        return { op: ["swap", null, i, p], inREF: false, inRREF: false };
      }
      if (!equal(A[i][j], 1)) {
        return {
          op: ["scale", inverse(A[i][j]), i, -1],
          inREF: false,
          inRREF: false
        };
      }
      for (let q = i + 1; q < m; q++) {
        if (!equal(A[q][j], 0)) {
          return {
            op: ["transvect", negative(A[q][j]), i, q],
            inREF: false,
            inRREF: false
          };
        }
      }
    }
  }

  for (let i = m - 1; i >= 0; i--) {
    let j = A[i].findIndex(a => !equal(a, 0));
    if (j !== -1) {
      for (let p = 0; p < i; p++) {
        if (!equal(A[p][j], 0)) {
          return {
            op: ["transvect", negative(A[p][j]), i, p],
            inREF: true,
            inRREF: false
          };
        }
      }
    }
  }

  return { op: null, inREF: true, inRREF: true };
}
