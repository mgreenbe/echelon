import React, { Component } from "react";
import Fraction from "fraction.js";
import parse from "./parse.js";
import { applyRowOp } from "./rowops.js";
import nextRowOp from "./echelon.js";
import TeX from "./tex.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const toLatex = mat => {
  const inside = mat
    .map(row => row.map(x => x.toLatex()).join("&"))
    .join("\\\\[1ex]");
  console.log(inside);
  return `\\displaystyle{\\begin{pmatrix}${inside}\\end{pmatrix}}`;
};

const printh = h => {
  let hh;
  if (h instanceof Fraction) {
    return h.toFraction();
  } else {
    try {
      hh = new Fraction(h);
    } catch (e) {
      console.error(e);
      return "h";
    }
    return hh.toFraction();
  }
};
const ensureFraction = x => {
  return x instanceof Fraction ? x : new Fraction(x);
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { matStr: "1 2 3\n4 5 6", h: "", i: -1, j: -1 };
  }

  handleInput = ({ target: { name, value } }) => {
    this.setState({ [name]: value, hint: false });
  };

  handleClick = ({ target: { name } }) => {
    const { matStr, mat, h, i, j, op } = this.state;
    switch (name) {
      case "clear":
        this.setState({ matStr: "" });
        break;
      case "create":
        this.modifyMatrix(parse(matStr));
        break;
      case "swap":
      case "scale":
      case "transvect":
        this.modifyMatrix(applyRowOp(mat, [name, ensureFraction(h), i, j]));
        break;
      case "hint":
        const [, hh, ii, jj] = op;
        this.setState({ h: hh.toFraction(), i: ii, j: jj, hint: true });
        break;
      default:
        console.error(`Unknown action: ${name}`);
    }
  };

  modifyMatrix = mat => {
    this.setState({ mat, hint: false, ...nextRowOp(mat) });
  };

  render() {
    const { matStr, h, i, j, mat, inREF, inRREF, hint, op } = this.state;
    console.log(printh(h));
    return (
      <div className="App">
        <section>
          <div>Enter matrix:</div>
          <textarea
            name="matStr"
            className="form-control"
            style={{
              fontSize: "125%",
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              border: "1px solid darkgray"
            }}
            value={matStr || ""}
            onChange={this.handleInput}
          />
          <div className="button-bar">
            <button
              name="create"
              className="btn"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderLeft: "1px solid darkgray",
                borderBottom: "1px solid darkgray",
                borderRight: "1px solid darkgray"
              }}
              onClick={this.handleClick}
            >
              Create
            </button>
            <button
              name="clear"
              className="btn"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottom: "1px solid darkgray",
                borderRight: "1px solid darkgray"
              }}
              onClick={this.handleClick}
            >
              Clear
            </button>
          </div>
        </section>
        {mat && (
          <div>
            <section>
              <div className="flag-panel">
                <span
                  className="flag"
                  style={{
                    textDecoration: inREF ? undefined : "line-through",
                    backgroundColor: inREF ? "aquamarine" : undefined
                  }}
                >
                  REF
                </span>
                <span
                  className="flag"
                  style={{
                    textDecoration: inRREF ? undefined : "line-through",
                    backgroundColor: inRREF ? "violet" : undefined
                  }}
                >
                  RREF
                </span>
              </div>
              <div className="matrix-panel">
                <TeX>{toLatex(mat)}</TeX>{" "}
              </div>
            </section>
            <section className="input-bar">
              <div
                className="input-group"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "stretch"
                }}
              >
                <TeX className="label">{"h =\\,\\,"}</TeX>
                <input
                  name="h"
                  className="form-control"
                  value={h || ""}
                  onChange={this.handleInput}
                  style={{
                    width: "80px",
                    transition: "color 0.5s, background-color 0.5s",
                    color:
                      hint && (op[0] === "scale" || op[0] === "transvect")
                        ? "white"
                        : undefined,
                    backgroundColor:
                      hint && (op[0] === "scale" || op[0] === "transvect")
                        ? "palevioletred"
                        : "transparent"
                  }}
                />
              </div>
              <div className="input-group">
                <TeX className="label">{"i =\\,\\,"}</TeX>
                <select
                  name="i"
                  className="form-control"
                  value={i}
                  onChange={this.handleInput}
                  style={{
                    display: "inline",
                    width: "60px",
                    transition: "background-color 0.5s",
                    backgroundColor: hint ? "palevioletred" : "transparent"
                  }}
                >
                  {["", ...mat].map((_, k) => (
                    <option key={k} value={k - 1}>
                      {k === 0 ? "" : k}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <TeX className="label">{"j =\\,\\,"}</TeX>
                <select
                  name="j"
                  className="form-control"
                  value={j}
                  onChange={this.handleInput}
                  style={{
                    display: "inline",
                    width: "60px",
                    transition: "background-color 0.5s",
                    backgroundColor:
                      hint && (op[0] === "swap" || op[0] === "transvect")
                        ? "palevioletred"
                        : "transparent"
                  }}
                >
                  {["", ...mat].map((_, k) => (
                    <option key={k} value={k - 1}>
                      {k === 0 ? "" : k}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            <section className="button-bar-column">
              <button
                name="swap"
                className="btn"
                disabled={!mat || Number(i) === -1 || Number(j) === -1}
                onClick={this.handleClick}
                style={{
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                  border: "1px solid darkgray",
                  backgroundColor:
                    hint && op[0] === "swap" ? "palevioletred" : undefined
                }}
              >
                {`Swap rows `}
                <TeX>{Number(i) === -1 ? "i" : String(Number(i) + 1)}</TeX>
                {` and `}
                <TeX>{Number(j) === -1 ? "j" : String(Number(j) + 1)}</TeX>
                {`.`}
              </button>
              <button
                name="scale"
                className="btn"
                disabled={!mat || !h || Number(i) === -1}
                onClick={this.handleClick}
                style={{
                  borderRadius: 0,
                  borderLeft: "1px solid darkgray",
                  borderRight: "1px solid darkgray",
                  borderBottom: "1px solid darkgray",
                  transition: "background-color 0.5s",
                  backgroundColor:
                    hint && op[0] === "scale" ? "palevioletred" : undefined
                }}
              >
                {`Multiply row `}
                <TeX>{Number(i) === -1 ? "i" : String(Number(i) + 1)}</TeX>
                {` by `} <TeX>{printh(h)}</TeX>
                {`.`}
              </button>
              <button
                name="transvect"
                className="btn"
                disabled={!mat || !h || Number(i) === -1 || Number(j) === -1}
                onClick={this.handleClick}
                style={{
                  borderRadius: 0,
                  borderLeft: "1px solid darkgray",
                  borderRight: "1px solid darkgray",
                  transition: "background-color 0.5s",
                  backgroundColor:
                    hint && op[0] === "transvect" ? "palevioletred" : undefined
                }}
              >
                {`Add `}
                <TeX>{printh(h)}</TeX>
                {` times row `}
                <TeX>{Number(i) === -1 ? "i" : String(Number(i) + 1)}</TeX>
                {` to row `}
                <TeX>{Number(j) === -1 ? "j" : String(Number(j) + 1)}</TeX>
                {`.`}
              </button>
              <button
                name="hint"
                className="btn"
                disabled={!mat || inRREF}
                onClick={this.handleClick}
                style={{
                  border: "1px solid darkgray",
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0
                }}
              >
                Hint
              </button>
            </section>
          </div>
        )}
      </div>
    );
  }
}

export default App;
