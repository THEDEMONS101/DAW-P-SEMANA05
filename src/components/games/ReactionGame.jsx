import { useState, useEffect, useRef } from 'react'
import { useStats } from '../../context/StatsContext'
import styles from '../../styles/ReactionGame.module.css'

const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
)

const IconBolt = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z"/>
  </svg>
)

const ReactionGame = ({ onBack }) => {
  const { recordGame } = useStats()
  const [state, setState] = useState('idle')
  const [reactionTime, setReactionTime] = useState(null)
  const [attempts, setAttempts] = useState([])
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)

  const startTest = () => {
    setState('waiting')
    setReactionTime(null)
    const delay = 1500 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => {
      setState('ready')
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (state === 'idle') {
      startTest()
    } else if (state === 'waiting') {
      clearTimeout(timeoutRef.current)
      setState('idle')
      setReactionTime(null)
    } else if (state === 'ready') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      setAttempts((prev) => [...prev, time])
      setState('done')
      recordGame({
        game: 'Reaction',
        result: 'win',
        duration: Math.round(time / 1000),
        score: time,
      })
    } else if (state === 'done') {
      startTest()
    }
  }

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current)
  }, [])

  const getButtonStyle = () => {
    switch (state) {
      case 'waiting': return styles.waiting
      case 'ready': return styles.ready
      case 'done': return styles.done
      default: return styles.idle
    }
  }

  const getLabel = () => {
    switch (state) {
      case 'idle': return 'CLICK PARA EMPEZAR'
      case 'waiting': return 'ESPERA EL VERDE...'
      case 'ready': return '¡CLICK AHORA!'
      case 'done': return `${reactionTime} ms`
      default: return ''
    }
  }

  const getSubLabel = () => {
    switch (state) {
      case 'idle': return 'Presiona para iniciar el test'
      case 'waiting': return 'No hagas click todavía'
      case 'ready': return '¡Reacción inmediata!'
      case 'done': return 'Click para reintentar'
      default: return ''
    }
  }

  const bestTime = attempts.length ? Math.min(...attempts) : null
  const avgTime = attempts.length ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null
  const worstTime = attempts.length ? Math.max(...attempts) : null

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <IconBack /> VOLVER AL ARCADE
      </button>

      <div className={styles.header}>
        <div className={styles.tag}>// MODULE 03</div>
        <h2 className={styles.title}>
          REFLEJOS <span className={styles.titleAccent}>// SPEED TEST</span>
        </h2>
        <p className={styles.subtitle}>Mide tu tiempo de reacción en milisegundos</p>
      </div>

      <button
        className={`${styles.reactionArea} ${getButtonStyle()}`}
        onClick={handleClick}
      >
        <div className={styles.areaContent}>
          <div className={styles.areaIcon}>
            {state === 'ready' && <IconBolt />}
            {state === 'waiting' && <div className={styles.waitingSpinner}></div>}
            {state === 'done' && <IconBolt />}
            {state === 'idle' && <IconBolt />}
          </div>
          <div className={styles.areaLabel}>{getLabel()}</div>
          <div className={styles.areaSubLabel}>{getSubLabel()}</div>
        </div>
        {state === 'waiting' && <div className={styles.pulseRing}></div>}
      </button>

      {attempts.length > 0 && (
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.best}`}>
            <span className={styles.statLabel}>MEJOR</span>
            <span className={styles.statValue}>{bestTime}<span className={styles.statUnit}>ms</span></span>
          </div>
          <div className={`${styles.statCard} ${styles.avg}`}>
            <span className={styles.statLabel}>PROMEDIO</span>
            <span className={styles.statValue}>{avgTime}<span className={styles.statUnit}>ms</span></span>
          </div>
          <div className={`${styles.statCard} ${styles.worst}`}>
            <span className={styles.statLabel}>PEOR</span>
            <span className={styles.statValue}>{worstTime}<span className={styles.statUnit}>ms</span></span>
          </div>
        </div>
      )}

      {attempts.length > 0 && (
        <div className={styles.historyPanel}>
          <div className={styles.historyTag}>// INTENTOS</div>
          <div className={styles.historyList}>
            {attempts.slice(-8).reverse().map((t, i) => (
              <div key={i} className={styles.historyItem}>
                <span className={styles.historyIndex}>#{attempts.length - i}</span>
                <div className={styles.historyBar}>
                  <div
                    className={styles.historyBarFill}
                    style={{ width: `${Math.min(100, (t / 500) * 100)}%` }}
                  ></div>
                </div>
                <span className={styles.historyTime}>{t}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ReactionGame