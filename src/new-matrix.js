import { toREF, REFtoRREF } from "./ref-imperative.js";

export default function(A) {
  let [mats, ops] = toREF(A);
  let nextRowOp;
  let inREF = ops.length === 0;
  if (!inREF) {
    nextRowOp = ops[0];
  } else {
    let B = mats[mats.length - 1];
    [mats, ops] = REFtoRREF(B);
    nextRowOp = ops.length === 0 ? null : ops[0];
  }
  return { inREF, nextRowOp };
}
