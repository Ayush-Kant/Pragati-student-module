import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * Error Boundary for the Coding Challenges module.
 *
 * Catches rendering errors in its subtree and displays a fallback UI.
 * Logs the error to console (replace with a real error reporting service in production).
 *
 * Usage:
 *   <CodingChallengeErrorBoundary>
 *     <SomeComponent />
 *   </CodingChallengeErrorBoundary>
 */
class CodingChallengeErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // In production, replace with Sentry / Datadog / similar.
    console.error('[CodingChallengeErrorBoundary] Caught rendering error:', error, info);
  }

  handleReset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={36} className="text-red-400" aria-hidden="true" />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-100">Something went wrong</h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                An unexpected error occurred in the Coding Challenges module.
                Please try refreshing or click below to retry.
              </p>
            </div>

            {/* Error detail (dev only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="text-left bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <p className="text-xs font-mono text-red-400 break-all">
                  {this.state.error?.message ?? String(this.state.error)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30
                  text-orange-400 text-sm font-medium hover:bg-orange-500/20 transition-all duration-200"
              >
                <RotateCcw size={16} aria-hidden="true" />
                Try Again
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700
                  text-gray-400 text-sm font-medium hover:border-gray-500 hover:text-gray-200 transition-all duration-200"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CodingChallengeErrorBoundary;
