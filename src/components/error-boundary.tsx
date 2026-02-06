import { Component, type ReactNode, type ErrorInfo } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error reporting service in production
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a] text-[#fafafa]">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-red-400"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="text-[#888] text-sm">
                We apologize for the inconvenience. The error has been logged.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left">
                <details className="bg-white/5 rounded-lg p-4 text-xs">
                  <summary className="cursor-pointer text-[#888] hover:text-[#fafafa] transition-colors">
                    Error details
                  </summary>
                  <pre className="mt-3 text-red-300 overflow-auto max-h-32 whitespace-pre-wrap">
                    {this.state.error.message}
                  </pre>
                </details>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-white text-black hover:bg-white/90 rounded-full"
              >
                {Icons.check}
                Reload page
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/10 text-[#888] hover:text-[#fafafa] rounded-full"
              >
                <a href="/">
                  Go home
                </a>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
