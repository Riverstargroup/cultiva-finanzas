import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class GardenErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[GardenErrorBoundary]", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="organic-card p-6 flex flex-col items-center gap-4 text-center">
          <span className="text-4xl">🌱</span>
          <p className="font-semibold" style={{ color: "var(--forest-deep)" }}>
            No pudimos cargar tu jardín
          </p>
          <p className="text-sm text-muted-foreground">Intenta de nuevo</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 rounded-full text-sm font-semibold border border-[var(--leaf-bright)] text-[var(--forest-deep)] hover:bg-[var(--leaf-fresh)]/10 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
