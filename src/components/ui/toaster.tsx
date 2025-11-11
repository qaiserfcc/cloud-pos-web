import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      toastOptions={{
        style: {
          borderRadius: '8px',
        },
        className: 'toast',
        duration: 4000,
      }}
    />
  )
}