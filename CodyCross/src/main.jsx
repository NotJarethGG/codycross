import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Cody from './Cody.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Cody /> */}
    <App />
  </StrictMode>,
)
