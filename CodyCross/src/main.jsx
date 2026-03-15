import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Cody from './Cody.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<Cody />} />
        <Route path="/404" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
