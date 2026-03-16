import { useState, useEffect } from 'react'
import './App.css'

const AUTHORS = [
  "Priscilla Cruz Torres",
  "Hillary Santana Sequeira",
  "Daniela Martinez Serrano",
  "Nicole Steffany Fonseca",
  "Keiel Mayorga Martinez",
  "Valeria Concepción Álvarez",
]

function App() {
  const [pulse, setPulse] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 200)
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

      <div className="error-container">

        {/* ── Título ── */}
        <div className="error-code-wrap">
          <h1 className="label">¡MISIÓN CUMPLIDA!</h1>
          {/* <h6 className={`error-code ${pulse ? 'glitch' : ''}`} data-text="GG">
            GG
          </h6> */}
        </div>

        <div className="divider" />

        {/* ── GIF ── */}
        <div className="gif-wrap">
          <div
            className="tenor-gif-embed"
            data-postid="26479187"
            data-share-method="host"
            data-aspect-ratio="1.21212"
            data-width="100%"
          />
        </div>

        {/* ── Cuerpo ── */}
        <div className="error-body">
          <h2 className="error-title">¡Gracias por jugar! 🧪</h2>
          <p className="error-desc">
            Completaste el crucigrama de automatización<br />
            en laboratorio clínico. ¡Excelente trabajo!
          </p>
           <p className="error-tagline">
            Esperamos que hayas aprendido algo nuevo hoy
          </p>
          <h4 className="nota">
              ¡Espero mínimo 100 de nota! Mochi🍡
          </h4>

          {/* ── Autores ── */}
          <div className="thanks-authors">
            <p className="thanks-label">Desarrollado con 💚 por</p>
            <div className="thanks-names">
              {AUTHORS.map((name, i) => (
                <span key={i} className="thanks-name">
                  <span className="thanks-dot">●</span>{name}
                </span>
              ))}
            </div>
          </div>

          <div className="error-actions">
            <a href="/" className="btn-primary">
              <span>↺ Jugar de nuevo</span>
            </a>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <footer className="error-footer">
        <span>LABORATORIO CLÍNICO · {new Date().toLocaleDateString('es-CR')}</span>
        <span>AUTOMATIZACIÓN 🧬</span>
      </footer>
    </div>
  )
}

export default App
