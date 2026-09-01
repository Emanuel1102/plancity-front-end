import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary capturó un error:", error, errorInfo);
  }

  handleReload = (): void => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Algo salió mal</h1>
          <p className="text-gray-600">
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={this.handleReload}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}