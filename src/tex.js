import React, { Component } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

class TeX extends Component {
  componentDidMount() {
    const str = this.props.children;
    if (typeof str !== "string") {
      console.warn(str);
      throw new TypeError(
        "TeX component takes a single child; it must be a string."
      );
    }
    katex.render(str, this.elt);
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  render() {
    const { children, ...props } = this.props;
    return <span ref={elt => (this.elt = elt)} {...props} />;
  }
}

export default TeX;
