import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Enable auth bypass for development (remove this in production)
localStorage.setItem("BYPASS_AUTH", "true");
localStorage.setItem("BYPASS_ROLE", "mentor");

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)