import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { dsCss } from './ds'
import App from './App.tsx'

const styleEl = document.createElement('style')
styleEl.setAttribute('data-ds', '')
styleEl.textContent = dsCss
document.head.appendChild(styleEl)

if (import.meta.hot) {
  import.meta.hot.accept('./ds', (mod) => {
    if (mod) styleEl.textContent = (mod as { dsCss: string }).dsCss
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
