const Fraction = require("fraction.js");

function equal(x, y) {
  if (Array.isArray(x)) {
    return x.every((w, i) => equal(w, y[i]));
  } else {
    return x instanceof Fraction
      ? x.equals(y)
      : y instanceof Fraction ? y.equals(x) : x === y;
  }
}

function add(x, y) {
  return x instanceof Fraction
    ? x.add(y)
    : y instanceof Fraction ? y.add(x) : x + y;
}

function negative(x) {
  return x instanceof Fraction ? x.neg() : -x;
}

function multiply(x, y) {
  return x instanceof Fraction
    ? x.mul(y)
    : y instanceof Fraction ? y.mul(x) : x * y;
}

function inverse(x) {
  return x instanceof Fraction ? x.inverse() : 1 / x;
}

module.exports = { equal, add, negative, multiply, inverse };
