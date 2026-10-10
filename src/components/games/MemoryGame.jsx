import { useState, useEffect } from 'react'
import { useStats } from '../../context/StatsContext'
import styles from '../../styles/MemoryGame.module.css'

const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

const SYMBOLS = ['◈', '◉', '◆', '✦', '⬢', '⬟', '◭', '❖']

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)

const createDeck = () => shuffle([...SYMBOLS, ...SYMBOLS]).map((symbol, i) => ({
  id: i,
  symbol,
  matched: false,
}))

const MemoryGame = ({ onBack }) => {
  const { recordGame } = useStats()
  const [cards, setCards] = useState(createDeck)
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [startTime] = useState(Date.now())
  const [finished, setFinished] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped
      if (cards[a].symbol === cards[b].symbol) {
        setCards((prev) => prev.map((c, i) =>
          (i === a || i === b) ? { ...c, matched: true } : c
        ))
        setMatched((m) => m + 1)
        setFlipped([])
      } else {
        const timer = setTimeout(() => setFlipped([]), 800)
        return () => clearTimeout(timer)
      }
    }
  }, [flipped, cards])

  useEffect(() => {
    if (matched === SYMBOLS.length && !finished) {
      setFinished(true)
      const duration = Math.round((Date.now() - startTime) / 1000)
      const score = Math.max(0, 1000 - moves * 10 - duration * 2)
      setFinalScore(score)
      recordGame({ game: 'Memory', result: 'win', duration, score })
    }
  }, [matched, finished, startTime, moves, recordGame])

  const handleClick = (i) => {
    if (flipped.length === 2 || flipped.includes(i) || cards[i].matched) return
    setFlipped((prev) => [...prev, i])
    if (flipped.length === 1) setMoves((m) => m + 1)
  }

  const resetGame = () => {
    setCards(createDeck())
    setFlipped([])
    setMoves(0)
    setMatched(0)
    setFinished(false)
    setFinalScore(0)
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <IconBack /> VOLVER AL ARCADE
      </button>

      <div className={styles.header}>
        <div className={styles.tag}>// MODULE 02</div>
        <h2 className={styles.title}>
          MEMORIA <span className={styles.titleAccent}>// CUÁNTICA</span>
        </h2>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>MOVIMIENTOS</span>
          <span className={styles.statValue}>{String(moves).padStart(2, '0')}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>PAREJAS</span>
          <span className={styles.statValue}>{matched}<span className={styles.statTotal}>/{SYMBOLS.length}</span></span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>PROGRESO</span>
          <span className={styles.statValue}>{Math.round((matched / SYMBOLS.length) * 100)}<span className={styles.statTotal}>%</span></span>
        </div>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(matched / SYMBOLS.length) * 100}%` }}
        ></div>
      </div>

      <div className={styles.board}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || card.matched
          return (
            <button
              key={card.id}
              className={`${styles.card} ${isFlipped ? styles.flipped : ''} ${card.matched ? styles.matched : ''}`}
              onClick={() => handleClick(i)}
              disabled={card.matched}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardBack}>
                  <span className={styles.cardBackSymbol}>?</span>
                </div>
                <div className={styles.cardFront}>
                  <span className={styles.cardSymbol}>{card.symbol}</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {finished && (
        <div className={styles.finishedPanel}>
          <div className={styles.finishedGlow}></div>
          <div className={styles.finishedTag}>// MISSION COMPLETE</div>
          <h3 className={styles.finishedTitle}>¡COMPLETADO!</h3>
          <div className={styles.finishedStats}>
            <div>
              <span className={styles.finishedLabel}>Movimientos</span>
              <span className={styles.finishedValue}>{moves}</span>
            </div>
            <div>
              <span className={styles.finishedLabel}>Puntaje</span>
              <span className={styles.finishedValue}>{finalScore}</span>
            </div>
            <div>
              <span className={styles.finishedLabel}>Tiempo</span>
              <span className={styles.finishedValue}>{Math.round((Date.now() - startTime) / 1000)}s</span>
            </div>
          </div>
          <button className={styles.resetButton} onClick={resetGame}>
            <IconRefresh /> JUGAR DE NUEVO
          </button>
        </div>
      )}
    </div>
  )
}

export default MemoryGame