import '@fontsource-variable/hanken-grotesk'
import type { router } from './router'
import { InnerApp } from './app'
import { createRoot } from 'react-dom/client'
import { queryClient } from './router'
import { ClerkProvider } from '@clerk/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider, AnchoredToastProvider } from '@/components/ui/toast.tsx'
import './index.css'
import 'react-image-crop/dist/ReactCrop.css'

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <ClerkProvider telemetry={false}>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AnchoredToastProvider>
          <InnerApp />
        </AnchoredToastProvider>
      </ToastProvider>
    </QueryClientProvider>
  </ClerkProvider>,
)
