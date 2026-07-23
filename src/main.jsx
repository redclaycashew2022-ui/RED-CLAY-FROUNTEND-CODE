import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './component/Navbar.jsx'

// Debug helper: log all browser fetch calls and responses
if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = async (...args) => {
    const [input, init] = args
    const method = (init?.method || (typeof input === 'string' ? 'GET' : input.method) || 'GET').toUpperCase()
    const url = typeof input === 'string' ? input : input.url

    console.groupCollapsed(`API Request: ${method} ${url}`)
    console.log('Request details:', { url, method, init })

    try {
      const response = await originalFetch(...args)
      const clone = response.clone()
      clone.text().then((text) => {
        console.log('Response details:', {
          url,
          status: response.status,
          statusText: response.statusText,
          headers: Array.from(response.headers.entries()),
          body: text,
        })
        console.groupEnd()
      })
      return response
    } catch (error) {
      console.error(`API Request failed: ${method} ${url}`, error)
      console.groupEnd()
      throw error
    }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <App/>
  </StrictMode>,
)
