import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from "react-hot-toast";

// ← ADD THESE 3 LINES
if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster position="top-right" />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
