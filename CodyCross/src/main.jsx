import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Cody from './Cody.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/"    element={<Cody />} />
        <Route path="/404" element={<App />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
