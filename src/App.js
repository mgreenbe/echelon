import React, { Component } from "react";
import Fraction from "fraction.js";
import parse from "./parse.js";
import { applyRowOp } from "./rowops.js";
import nextRowOp from "./echelon.js";
import "./App.css";

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
        const [type, hh, ii, jj] = op;
        this.setState({ h: hh.toFraction(), i: ii, j: jj, hint: true });
        break;
      default:
        console.err("Unknown action!");
    }
  };

  modifyMatrix = mat => {
    this.setState({ mat, hint: false, ...nextRowOp(mat) });
  };

  render() {
    const { matStr, h, i, j, mat, inREF, inRREF, hint, op } = this.state;
    return (
      <div className="App">
        <section>
          <div>Enter matrix:</div>
          <textarea
            name="matStr"
            value={matStr || ""}
            onChange={this.handleInput}
          />
          <div className="button-bar">
            <button name="create" onClick={this.handleClick}>
              Create
            </button>
            <button name="clear" onClick={this.handleClick}>
              Clear
            </button>
          </div>
          <div>
            {"Separate entries with spaces."}
            <br />
            {"One row per line."}
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
                <span className="bracket left-bracket" />
                <table>
                  <tbody>
                    {mat.map((row, i) => (
                      <tr key={i}>
                        {row.map((x, j) => <td key={j}>{x.toFraction()}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <span className="bracket right-bracket" />
              </div>
            </section>
            <section className="input-bar">
              <label>
                {"h = "}
                <input
                  name="h"
                  value={h || ""}
                  onChange={this.handleInput}
                  style={{
                    width: "60px",
                    transition: "background-color 0.5s",
                    backgroundColor:
                      hint && (op[0] === "scale" || op[0] === "transvect")
                        ? "lightpink"
                        : "transparent"
                  }}
                />
              </label>
              <label>
                {"i = "}
                <select
                  name="i"
                  value={i}
                  onChange={this.handleInput}
                  style={{
                    width: "60px",
                    transition: "background-color 0.5s",
                    backgroundColor: hint ? "lightpink" : "transparent"
                  }}
                >
                  {["", ...mat].map((_, k) => (
                    <option key={k} value={k - 1}>
                      {k === 0 ? "" : k}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {"j = "}
                <select
                  name="j"
                  value={j}
                  onChange={this.handleInput}
                  style={{
                    width: "60px",
                    transition: "background-color 0.5s",
                    backgroundColor:
                      hint && (op[0] === "swap" || op[0] === "transvect")
                        ? "lightpink"
                        : "transparent"
                  }}
                >
                  {["", ...mat].map((_, k) => (
                    <option key={k} value={k - 1}>
                      {k === 0 ? "" : k}
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <section className="button-bar-column">
              <button
                name="swap"
                disabled={!mat || Number(i) === -1 || Number(j) === -1}
                onClick={this.handleClick}
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor:
                    hint && op[0] === "swap" ? "lightpink" : undefined
                }}
              >
                {`Swap rows ${Number(i) === -1
                  ? "i"
                  : Number(i) + 1} and ${Number(j) === -1
                  ? "j"
                  : Number(j) + 1}.`}
              </button>
              <button
                name="scale"
                disabled={!mat || !h || Number(i) === -1}
                onClick={this.handleClick}
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor:
                    hint && op[0] === "scale" ? "lightpink" : undefined
                }}
              >
                {`Multiply row ${Number(i) === -1
                  ? "i"
                  : Number(i) + 1} by ${printh(h)}.`}
              </button>
              <button
                name="transvect"
                disabled={!mat || !h || Number(i) === -1 || Number(j) === -1}
                onClick={this.handleClick}
                style={{
                  transition: "background-color 0.5s",
                  backgroundColor:
                    hint && op[0] === "transvect" ? "lightpink" : undefined
                }}
              >
                {`Add ${printh(h)} times row ${Number(i) === -1
                  ? "i"
                  : Number(i) + 1} to row ${Number(j) === -1
                  ? "j"
                  : Number(j) + 1}.`}
              </button>
              <button
                name="hint"
                disabled={!mat || inRREF}
                onClick={this.handleClick}
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
