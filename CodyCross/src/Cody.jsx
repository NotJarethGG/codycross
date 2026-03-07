import { useState, useRef } from "react";
import "./styles.css";

const WORDS = [
  { id: 0, clue: "Sistema que controla el almacén en tiempo real",              answer: "WMS" },
  { id: 1, clue: "Norma internacional para laboratorios clínicos",              answer: "ISO15189" },
  { id: 2, clue: "Tecnología de identificación sin contacto",                   answer: "RFID" },
  { id: 3, clue: "Sistema automatizado con grúas robotizadas",                  answer: "ASRS" },
  { id: 4, clue: "Robots móviles autónomos",                                    answer: "AMR" },
  { id: 5, clue: "Seguimiento del producto desde ingreso hasta salida",         answer: "TRAZABILIDAD" },
  { id: 6, clue: "Condición ambiental clave para reactivos",                    answer: "TEMPERATURA" },
  { id: 7, clue: "Tecnología que requiere escaneo manual",                      answer: "CODIGODEBARRAS" },
  { id: 8, clue: "Selección automática de productos",                           answer: "PICKING" },
  { id: 9, clue: "Sensores conectados que monitorean inventario",               answer: "IOT" },
];

const LAYOUT = [
  { id: 5, dir: "H", row: 0,  col: 2  },
  { id: 2, dir: "V", row: 0,  col: 3  },
  { id: 1, dir: "H", row: 2,  col: 3  },
  { id: 3, dir: "V", row: 3,  col: 13 },
  { id: 9, dir: "V", row: 5,  col: 5  },
  { id: 8, dir: "V", row: 5,  col: 3  },
  { id: 7, dir: "H", row: 6,  col: 0  },
  { id: 4, dir: "V", row: 10, col: 7  },
  { id: 0, dir: "V", row: 11, col: 4  },
  { id: 6, dir: "H", row: 12, col: 2  },
];

const ROWS = 14, COLS = 14;

function buildCellMap() {
  const map = {};
  for (const w of LAYOUT) {
    const word = WORDS.find(x => x.id === w.id);
    for (let i = 0; i < word.answer.length; i++) {
      const r = w.dir === "H" ? w.row : w.row + i;
      const c = w.dir === "H" ? w.col + i : w.col;
      if (!map[r]) map[r] = {};
      if (!map[r][c]) map[r][c] = { letter: word.answer[i], wordCells: [] };
      map[r][c].wordCells.push({ wordId: w.id, letterIdx: i });
    }
  }
  return map;
}

function buildWordCells(cellMap) {
  const wc = {};
  for (const [rStr, cols] of Object.entries(cellMap)) {
    for (const [cStr, cell] of Object.entries(cols)) {
      for (const { wordId, letterIdx } of cell.wordCells) {
        if (!wc[wordId]) wc[wordId] = [];
        wc[wordId].push({ r: Number(rStr), c: Number(cStr), letterIdx });
      }
    }
  }
  for (const id of Object.keys(wc)) wc[id].sort((a, b) => a.letterIdx - b.letterIdx);
  return wc;
}

const CELL_MAP   = buildCellMap();
const WORD_CELLS = buildWordCells(CELL_MAP);

// Number labels
const NUMBER_LABELS = {};
let labelCounter = 1;
const sortedLayout = [...LAYOUT].sort((a, b) => a.row !== b.row ? a.row - b.row : a.col - b.col);
for (const w of sortedLayout) {
  const key = `${w.row},${w.col}`;
  if (!NUMBER_LABELS[key]) NUMBER_LABELS[key] = labelCounter++;
}
const WORD_NUMBER = {};
for (const w of LAYOUT) WORD_NUMBER[w.id] = NUMBER_LABELS[`${w.row},${w.col}`];

export default function App() {
  const [inputs, setInputs] = useState(() => {
    const init = {};
    for (const w of WORDS) init[w.id] = Array(w.answer.length).fill("");
    return init;
  });
  const [activeWord, setActiveWord] = useState(null);
  const [activeCell, setActiveCell] = useState(null);
  const [revealed,  setRevealed]  = useState({});
  const inputRefs = useRef({});

  const isWordSolved = (id) => inputs[id].join("") === WORDS.find(w => w.id === id).answer;
  const allSolved = WORDS.every(w => isWordSolved(w.id));

  const getCellValue = (r, c) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return "";
    const aw = cell.wordCells.find(wc => wc.wordId === activeWord);
    const ref = aw || cell.wordCells[0];
    return inputs[ref.wordId][ref.letterIdx] || "";
  };

  const focusCell = (r, c, wordId) => {
    setActiveCell({ r, c });
    setActiveWord(wordId);
    setTimeout(() => inputRefs.current[`${r},${c}`]?.focus(), 0);
  };

  const handleCellClick = (r, c) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return;
    if (activeCell?.r === r && activeCell?.c === c && cell.wordCells.length > 1) {
      const other = cell.wordCells.find(wc => wc.wordId !== activeWord);
      if (other) { setActiveWord(other.wordId); return; }
    }
    const preferred = cell.wordCells.find(wc => wc.wordId === activeWord);
    focusCell(r, c, (preferred || cell.wordCells[0]).wordId);
  };

  const syncIntersection = (r, c, newInputs, fromWordId) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return;
    const fromWc = cell.wordCells.find(x => x.wordId === fromWordId);
    if (!fromWc) return;
    const val = newInputs[fromWordId][fromWc.letterIdx];
    for (const { wordId, letterIdx } of cell.wordCells) {
      if (wordId !== fromWordId) {
        newInputs[wordId] = [...newInputs[wordId]];
        newInputs[wordId][letterIdx] = val;
      }
    }
  };

  const handleInput = (e, r, c) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return;
    const wc = cell.wordCells.find(x => x.wordId === activeWord);
    if (!wc) return;
    const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const ch  = raw.slice(-1);
    const newInputs = { ...inputs, [activeWord]: [...inputs[activeWord]] };
    newInputs[activeWord][wc.letterIdx] = ch;
    syncIntersection(r, c, newInputs, activeWord);
    setInputs(newInputs);
    if (ch) {
      const cells = WORD_CELLS[activeWord];
      const nextIdx = wc.letterIdx + 1;
      if (nextIdx < cells.length) focusCell(cells[nextIdx].r, cells[nextIdx].c, activeWord);
    }
  };

  const handleKeyDown = (e, r, c) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return;
    const wc = cell.wordCells.find(x => x.wordId === activeWord);
    if (!wc) return;
    const w = LAYOUT.find(x => x.id === activeWord);
    const cells = WORD_CELLS[activeWord];

    if (e.key === "Backspace") {
      e.preventDefault();
      const newInputs = { ...inputs, [activeWord]: [...inputs[activeWord]] };
      if (newInputs[activeWord][wc.letterIdx]) {
        newInputs[activeWord][wc.letterIdx] = "";
        syncIntersection(r, c, newInputs, activeWord);
        setInputs(newInputs);
      } else if (wc.letterIdx > 0) {
        const prev = cells[wc.letterIdx - 1];
        newInputs[activeWord][prev.letterIdx] = "";
        syncIntersection(prev.r, prev.c, newInputs, activeWord);
        setInputs(newInputs);
        focusCell(prev.r, prev.c, activeWord);
      }
      return;
    }

    if (["ArrowRight","ArrowLeft","ArrowUp","ArrowDown"].includes(e.key)) {
      e.preventDefault();
      const isH = w.dir === "H";
      let ni = wc.letterIdx;
      if ((isH && e.key==="ArrowRight") || (!isH && e.key==="ArrowDown")) ni++;
      if ((isH && e.key==="ArrowLeft")  || (!isH && e.key==="ArrowUp"))   ni--;
      ni = Math.max(0, Math.min(ni, cells.length - 1));
      focusCell(cells[ni].r, cells[ni].c, activeWord);
    }
  };

  const revealWord = (wordId) => {
    const word = WORDS.find(w => w.id === wordId);
    const newInputs = { ...inputs, [wordId]: word.answer.split("") };
    for (const { r, c, letterIdx } of WORD_CELLS[wordId]) {
      const cell = CELL_MAP[r]?.[c];
      for (const { wordId: wid, letterIdx: li } of cell.wordCells) {
        if (wid !== wordId) {
          newInputs[wid] = [...(newInputs[wid] || inputs[wid])];
          newInputs[wid][li] = word.answer[letterIdx];
        }
      }
    }
    setInputs(newInputs);
    setRevealed(prev => ({ ...prev, [wordId]: true }));
  };

  const resetAll = () => {
    const init = {};
    for (const w of WORDS) init[w.id] = Array(w.answer.length).fill("");
    setInputs(init);
    setActiveWord(null);
    setActiveCell(null);
    setRevealed({});
  };

  const horizontalWords = LAYOUT.filter(w => w.dir === "H").map(w => w.id);
  const verticalWords   = LAYOUT.filter(w => w.dir === "V").map(w => w.id);

  const renderCell = (r, c) => {
    const cell = CELL_MAP[r]?.[c];
    if (!cell) return <td key={c} className="cell-empty" />;

    const val        = getCellValue(r, c);
    const isActive   = activeCell?.r === r && activeCell?.c === c;
    const inWord     = activeWord !== null && cell.wordCells.some(wc => wc.wordId === activeWord);
    const isSolved   = cell.wordCells.every(wc => isWordSolved(wc.wordId));
    const isRev      = cell.wordCells.some(wc => revealed[wc.wordId]);
    const label      = NUMBER_LABELS[`${r},${c}`];

    let cls = "cell-letter";
    if (isActive)  cls += " cell-active";
    else if (inWord) cls += " cell-highlight";
    if (isSolved)  cls += " cell-solved";
    if (isRev)     cls += " cell-revealed";

    return (
      <td key={c} className={cls} onClick={() => handleCellClick(r, c)}>
        {label && <span className="cell-number">{label}</span>}
        <input
          ref={el => { inputRefs.current[`${r},${c}`] = el; }}
          className="cell-input"
          type="text"
          maxLength={2}
          value={val}
          onChange={e => handleInput(e, r, c)}
          onKeyDown={e => handleKeyDown(e, r, c)}
          onFocus={() => handleCellClick(r, c)}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
      </td>
    );
  };

  const AUTHORS = [
    "Priscilla Cruz Torres",
    "Hillary Santana Sequeira",
    "Daniela Martinez Serrano",
    "Nicole Steffany Fonseca",
    "Keiel Mayorga Martinez",
    "Valeria Concepción Álvarez",
  ];

  return (
    <div className="cc-app">
      {/* Decorative lab bubbles background */}
      <div className="lab-bg" aria-hidden="true">
        <span className="bubble b1">🧪</span>
        <span className="bubble b2">⚗️</span>
        <span className="bubble b3">🔬</span>
        <span className="bubble b4">🧬</span>
        <span className="bubble b5">💊</span>
        <span className="bubble b6">🧫</span>
      </div>

      {/* ── Header ── */}
      <header className="cc-header">
        <div className="cc-logo">
          <span className="logo-icon">⚗️</span>
          <span className="logo-c">C</span>
          <span className="logo-ody">ody</span>
          <span className="logo-cross">Cross</span>
        </div>
        <div className="cc-header-center">
          <h2 className="cc-topic">Automatización en Laboratorio Clínico</h2>
          <div className="cc-topic-sub">🔬 Sistemas · Tecnología · Trazabilidad</div>
        </div>
        <div className="cc-score-wrap">
          <div className="cc-score-ring">
            <svg viewBox="0 0 40 40" className="score-svg">
              <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
              <circle cx="20" cy="20" r="16" fill="none" stroke="#7ee8a2" strokeWidth="3"
                strokeDasharray={`${(WORDS.filter(w=>isWordSolved(w.id)).length/WORDS.length)*100} 100`}
                strokeDashoffset="25" strokeLinecap="round" pathLength="100"/>
            </svg>
            <span className="score-num">{WORDS.filter(w => isWordSolved(w.id)).length}<span className="score-total">/{WORDS.length}</span></span>
          </div>
          <div className="score-label">resueltas</div>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="cc-main">
        {/* Grid */}
        <div className="cc-grid-wrap">
          <div className="grid-label">🧩 Crucigrama</div>
          <table className="cc-grid">
            <tbody>
              {Array.from({ length: ROWS }, (_, r) => (
                <tr key={r}>
                  {Array.from({ length: COLS }, (_, c) => renderCell(r, c))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clues */}
        <div className="cc-clues">
          <div className="clue-section">
            <h3 className="clue-heading"><span className="clue-arrow">➡</span> Horizontales</h3>
            <ul>
              {horizontalWords.map(id => {
                const word   = WORDS.find(w => w.id === id);
                const solved = isWordSolved(id);
                return (
                  <li key={id}
                    className={`clue-item ${activeWord===id?"clue-active":""} ${solved?"clue-solved":""}`}
                    onClick={() => { const l=LAYOUT.find(x=>x.id===id); focusCell(l.row,l.col,id); }}
                  >
                    <span className="clue-num">{WORD_NUMBER[id]}.</span>
                    <span className="clue-text">{word.clue}</span>
                    {solved && <span className="clue-check">✓</span>}
                    {!solved && !revealed[id] && (
                      <button className="clue-reveal" onClick={e=>{e.stopPropagation();revealWord(id);}}>Ver</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="clue-section">
            <h3 className="clue-heading"><span className="clue-arrow">⬇</span> Verticales</h3>
            <ul>
              {verticalWords.map(id => {
                const word   = WORDS.find(w => w.id === id);
                const solved = isWordSolved(id);
                return (
                  <li key={id}
                    className={`clue-item ${activeWord===id?"clue-active":""} ${solved?"clue-solved":""}`}
                    onClick={() => { const l=LAYOUT.find(x=>x.id===id); focusCell(l.row,l.col,id); }}
                  >
                    <span className="clue-num">{WORD_NUMBER[id]}.</span>
                    <span className="clue-text">{word.clue}</span>
                    {solved && <span className="clue-check">✓</span>}
                    {!solved && !revealed[id] && (
                      <button className="clue-reveal" onClick={e=>{e.stopPropagation();revealWord(id);}}>Ver</button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <button className="cc-reset" onClick={resetAll}>↺ Reiniciar todo</button>
        </div>
      </div>

      {/* ── Authors Footer ── */}
      <footer className="cc-footer">
        <div className="footer-inner">
          <div className="footer-badge">🧬</div>
          <div className="footer-content">
            <div className="footer-title">Creado por</div>
            <div className="footer-names">
              {AUTHORS.map((name, i) => (
                <span key={i} className="footer-name">
                  <span className="footer-dot">●</span>{name}
                </span>
              ))}
            </div>
          </div>
          <div className="footer-badge">🔬</div>
        </div>
      </footer>

      {/* ── Win overlay ── */}
      {allSolved && (
        <div className="cc-win-overlay">
          <div className="cc-win-box">
            <div className="win-confetti">🎉🧪🔬⚗️🎊</div>
            <h2>¡Laboratorio Completado!</h2>
            <p>¡Excelente trabajo! Todos los términos resueltos.</p>
            <div className="win-authors">
              <p className="win-authors-label">Desarrollado por:</p>
              {AUTHORS.map((a,i) => <span key={i} className="win-author-name">{a}</span>)}
            </div>
            <button onClick={resetAll}>↺ Jugar de nuevo</button>
          </div>
        </div>
      )}
    </div>
  );
}