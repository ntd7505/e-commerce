import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin route crashed:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-soft text-danger">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-text">Trang gặp lỗi</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          Đã có lỗi xảy ra khi hiển thị trang này. Vui lòng thử lại hoặc tải lại trang.
        </p>
        {this.state.error && (
          <pre className="mt-4 max-w-xl overflow-x-auto rounded-xl bg-surface px-4 py-3 text-left text-xs text-muted">
            {this.state.error.message}
          </pre>
        )}
        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-surface"
          >
            <RotateCcw className="h-4 w-4" />
            Thử lại
          </button>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-success"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }
}