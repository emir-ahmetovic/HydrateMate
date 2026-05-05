"use client"

import React from "react"

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, ErrorBoundaryState> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Something went wrong</h3>
              <pre className="text-sm mt-2 whitespace-pre-wrap overflow-auto max-h-40">
                {this.state.error?.message}
              </pre>
            </div>
            <button
              onClick={this.reset}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
