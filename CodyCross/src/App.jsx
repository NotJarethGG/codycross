import { useState, useEffect } from 'react'
import './App.css'
 
function App() {
  const [glitch, setGlitch] = useState(false)
  const [visible, setVisible] = useState(false)
 
  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 3500)
    return () => clearInterval(interval)
  }, [])
 
  return (
    <div className={`error-page ${visible ? 'visible' : ''}`}>
      <div className="noise" />
      <div className="scanlines" />
 
      <div className="error-container">
        <div className="error-code-wrap">
          <span className="label">CÓDIGO DE ERROR</span>
          <h1 className={`error-code ${glitch ? 'glitch' : ''}`} data-text="404">
            404
          </h1>
        </div>
 
        <div className="divider" />
 
        <div className="error-body">
          <h2 className="error-title">Página no encontrada</h2>
          <p className="error-desc">
            La ruta que buscas no existe, fue movida,<br />
            o nunca estuvo aquí para empezar.
          </p>
 
          <div className="error-actions">
            <a href="/" className="btn-primary">
              <span>← Volver al inicio</span>
            </a>
            <button className="btn-secondary" onClick={() => window.history.back()}>
              Página anterior
            </button>
          </div>
        </div>
      </div>
 
      <footer className="error-footer">
        <span>ERROR · {new Date().toLocaleDateString('es-CR')}</span>
        <span>SISTEMA NO DISPONIBLE</span>
      </footer>
    </div>
  )
}
 
export default App
