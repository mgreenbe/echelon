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
  return `\\displaystyle{\\begin{pmatrix}${inside}\\end{pmatrix}}`;
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { matStr: "1 2 3\n4 5 6", h: "", i: -1, j: -1 };
  }

  handleInput = ({ target: { name, value } }) => {
    const newState = { [name]: value, hint: false };
    if (name === "h") {
      let hFraction;
      try {
        hFraction = Fraction(value);
        Object.assign(newState, { hFraction });
        console.log(`h=${hFraction.toFraction()} parsed to fraction.`);
      } catch (e) {
        console.warn(`Couldn't parse h=${value} to fraction.`);
      }
    }
    this.setState(newState);
  };

  handleClick = e => {
    const { name } = e.target;
    if (!name) {
      console.log(`Clicked: ${e.target.name}`);
      console.log(e.target);
    }
    const { matStr, mat, i, j, op } = this.state;
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
        this.modifyMatrix(applyRowOp(mat, [name, this.state.hFraction, i, j]));
        break;
      case "hint":
        const [type, hFraction, ii, jj] = op;
        const newState = { i: ii, j: jj, hint: true };
        if (type === "scale" || type === "transvect") {
          console.assert(hFraction instanceof Fraction);
          Object.assign(newState, { h: hFraction.toFraction(), hFraction });
        }
        this.setState(newState);
        break;
      default:
        console.error(`Unknown action: ${name}`);
    }
  };

  modifyMatrix = mat => {
    this.setState({ mat, hint: false, ...nextRowOp(mat) });
  };

  render() {
    const {
      matStr,
      h,
      i,
      j,
      hFraction,
      mat,
      inREF,
      inRREF,
      hint,
      op
    } = this.state;
    const hTeX = hFraction ? hFraction.toLatex() : "";
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
                  className="flag rounded"
                  style={{
                    textDecoration: inREF ? undefined : "line-through",
                    backgroundColor: inREF ? "aquamarine" : undefined
                  }}
                >
                  REF
                </span>
                <span
                  className="flag rounded"
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
                    transition: "color 0.5s, background-color 0.5s",
                    color: hint ? "white" : undefined,
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
                    transition: "color 0.5s, background-color 0.5s",
                    color:
                      hint && (op[0] === "swap" || op[0] === "transvect")
                        ? "white"
                        : undefined,
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
                  transition: "color 0.5s, background-color 0.5s",
                  color: hint && op[0] === "swap" ? "white" : undefined,
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
                  transition: "color 0.5s, background-color 0.5s",
                  color: hint && op[0] === "scale" ? "white" : undefined,
                  backgroundColor:
                    hint && op[0] === "scale" ? "palevioletred" : undefined
                }}
              >
                {`Multiply row `}
                <TeX>{Number(i) === -1 ? "i" : String(Number(i) + 1)}</TeX>
                {` by `} <TeX>{hTeX}</TeX>
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
                  transition: "color 0.5s, background-color 0.5s",
                  color: hint && op[0] === "transvect" ? "white" : undefined,
                  backgroundColor:
                    hint && op[0] === "transvect" ? "palevioletred" : undefined
                }}
              >
                {`Add `}
                <TeX>{hTeX || "h"}</TeX>
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
