import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { useStore } from './state/useStore'

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore.getState().theme
  React.useEffect(() => {
    const apply = () => {
      const html = document.documentElement
      const t = useStore.getState().theme
      html.classList.remove('light', 'dark')
      if (t === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        html.classList.add(prefersDark ? 'dark' : 'light')
      } else {
        html.classList.add(t)
      }
    }
    apply()
    const unsub = useStore.subscribe(apply)
    return () => { unsub() }
  }, [])
  return <>{children}</>
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)