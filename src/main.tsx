import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import { ErrorBoundary } from '@/components/error-boundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#fafafa',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </ErrorBoundary>
  </StrictMode>,
)
