import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles/tokens.css'
import './styles/global.css'
import './styles/mobile.css'
import 'katex/dist/katex.min.css'

declare global {
  interface Window {
    __kyotsuBootError?: (message: string) => void
  }
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Missing #root element')
}

const root = createRoot(rootElement)

root.render(
  <main className="fatal-error">
    <p className="eyebrow">共通 STEP</p>
    <p>App を読み込んでいます…</p>
  </main>,
)

Promise.all([
  import('./app/App'),
  import('./app/ErrorBoundary'),
])
  .then(([appModule, errorBoundaryModule]) => {
    const App = appModule.default
    const ErrorBoundary = errorBoundaryModule.ErrorBoundary

    root.render(
      <StrictMode>
        <HashRouter>
          <ErrorBoundary><App /></ErrorBoundary>
        </HashRouter>
      </StrictMode>,
    )
  })
  .catch((error: unknown) => {
    const message = error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack ?? ''}`
      : String(error)

    console.error('App bootstrap error', error)
    window.__kyotsuBootError?.(message)
  })
