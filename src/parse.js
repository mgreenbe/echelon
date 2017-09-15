import Fraction from "fraction.js";

function toFraction(x) {
  return new Fraction(x);
}
function parse(str) {
  const mat = str.split("\n").map(line => line.split(" ").map(toFraction));
  return mat;
}

export default parse;
