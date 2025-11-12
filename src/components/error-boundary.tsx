"use client"

import React from "react"
import { useToast } from "@/components/ui/use-toast"

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />
      }

      return <ErrorToastFallback error={this.state.error} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function ErrorToastFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  const { toast } = useToast()

  React.useEffect(() => {
    toast({
      variant: "destructive",
      title: "Application Error",
      description: `An unexpected error occurred: ${error.message}`,
      action: (
        <button
          onClick={resetError}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium text-destructive-foreground ring-offset-background transition-colors hover:bg-destructive-foreground hover:text-destructive focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
        >
          Try Again
        </button>
      ),
    })
  }, [error, resetError, toast])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">
          An error occurred and has been reported. Please try refreshing the page.
        </p>
        <button
          onClick={resetError}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

export { ErrorBoundary }