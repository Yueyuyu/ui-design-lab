import { Component } from "react";

export class LoadBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() {
    if (this.state.error) return <div className="lab-load-error" role="alert">
      <h2>页面暂时无法显示</h2><p>请重新加载页面，或返回目录选择套系。</p>
      <button type="button" onClick={() => window.location.reload()}>重新加载页面</button>
      <a href="#/systems">返回套系目录</a>
    </div>;
    return this.props.children;
  }
}
