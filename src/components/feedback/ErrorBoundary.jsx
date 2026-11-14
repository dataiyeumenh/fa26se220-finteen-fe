import { Component } from "react";
import "./error-boundary.css";

export default class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="ft-error-boundary" role="alert">
          <h1>{this.props.title || "Trang gặp sự cố"}</h1>
          <p>{this.props.description || "Vui lòng tải lại trang để tiếp tục."}</p>
          <button type="button" onClick={() => window.location.reload()}>Tải lại</button>
        </section>
      );
    }
    return this.props.children;
  }
}
