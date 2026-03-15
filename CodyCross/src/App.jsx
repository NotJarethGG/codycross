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

    const script = document.createElement('script')
    script.src = 'https://tenor.com/embed.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      clearInterval(interval)
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className={`error-page ${visible ? 'visible' : ''}`}>
      <div className="noise" />
      <div className="scanlines" />

      {/* Spotify — esquina superior derecha, autoplay activado */}
  

      <div className="error-container">
        <div className="error-code-wrap">
          <span className="label">CÓDIGO DE ERROR</span>
          <h1 className={`error-code ${glitch ? 'glitch' : ''}`} data-text="404">
            404
          </h1>
        </div>

        <div className="divider" />

        <div className="gif-wrap">
          <div
            className="tenor-gif-embed"
            data-postid="26479187"
            data-share-method="host"
            data-aspect-ratio="1.21212"
            data-width="100%"
          />
        </div>

        <div className="error-body">
          <h2 className="error-title">Página no encontrada</h2>
          <p className="error-desc">
            La ruta que buscas no existe, fue movida,<br />
            o nunca estuvo aquí para empezar.
          </p>
          <p className="error-tagline">✌🏼 Aún tienes tiempo para hacer algo mejor.</p>

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
