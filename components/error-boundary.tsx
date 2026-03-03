"use client"

import { Button } from "@/components/ui/button"
import React from "react"

type ErrorBoundaryProps = {
  children: React.ReactNode
  context?: string
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    void fetch("/api/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: this.props.context ?? "unknown",
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        path: typeof window !== "undefined" ? window.location.pathname : "",
      }),
    }).catch(() => {
      // Prevent secondary errors from bubbling if logging transport fails.
    })
  }

  private handleRetry = () => {
    this.setState({ hasError: false })
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-border bg-card p-6 text-sm text-foreground">
          <p className="text-base font-medium">Something went wrong with this tool.</p>
          <p className="mt-2 text-muted-foreground">Refresh to try again.</p>
          <Button onClick={this.handleRetry} className="mt-4 w-full sm:w-auto">
            Refresh
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
