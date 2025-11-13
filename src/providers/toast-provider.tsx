"use client"

import { Toaster, toast } from 'react-hot-toast'
import { Copy, X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react'

export interface ToastOptions {
  duration?: number
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
}

class ToastService {
  success(message: string, options?: ToastOptions) {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  }

  error(message: string, error?: any, options?: ToastOptions) {
    const errorMessage = error?.message || message
    const errorDetails = error?.response?.data || error?.stack || error

    return toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-red-50 border border-red-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-400" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-red-800">
                Error
              </p>
              <p className="mt-1 text-sm text-red-700 whitespace-pre-wrap">
                {errorMessage}
              </p>
              {errorDetails && (
                <details className="mt-2">
                  <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">
                    Show Details
                  </summary>
                  <pre className="mt-1 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto max-h-32">
                    {typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
        <div className="flex border-l border-red-200">
          <button
            onClick={() => {
              const textToCopy = `${errorMessage}\n\n${typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2)}`
              navigator.clipboard.writeText(textToCopy)
              toast.success('Error details copied to clipboard')
            }}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        <div className="flex border-l border-red-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    ), {
      duration: 8000,
      position: 'top-right',
      ...options,
    })
  }

  warning(message: string, options?: ToastOptions) {
    return toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-yellow-50 border border-yellow-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-yellow-800">
                Warning
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-yellow-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-yellow-600 hover:text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-right',
      ...options,
    })
  }

  info(message: string, options?: ToastOptions) {
    return toast.custom((t) => (
      <div className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-blue-50 border border-blue-200 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Info className="h-6 w-6 text-blue-400" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-blue-800">
                Info
              </p>
              <p className="mt-1 text-sm text-blue-700">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-blue-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-right',
      ...options,
    })
  }

  dismiss(toastId?: string) {
    if (toastId) {
      toast.dismiss(toastId)
    } else {
      toast.dismiss()
    }
  }
}

export const toastService = new ToastService()

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  )
}
