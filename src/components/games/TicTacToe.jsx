import { useState, useEffect, useRef } from 'react'
import { useStats } from '../../context/StatsContext'
import {
  calculateWinner,
  isBoardFull,
  getBestMove,
  HUMAN,
  AI,
} from '../../utils/tictactoeAI'
import styles from '../../styles/TicTacToe.module.css'

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

const IconBot = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="12" rx="3"/>
    <circle cx="9" cy="14" r="1.5" fill="currentColor"/>
    <circle cx="15" cy="14" r="1.5" fill="currentColor"/>
    <path d="M12 8V4"/>
    <circle cx="12" cy="3" r="1"/>
  </svg>
)

const TicTacToe = ({ onBack }) => {
  const { recordGame } = useStats()

  const [board, setBoard] = useState(Array(9).fill(null))
  const [isHumanTurn, setIsHumanTurn] = useState(true)
  const [status, setStatus] = useState('TU TURNO')
  const [winnerInfo, setWinnerInfo] = useState(null)
  const [difficulty, setDifficulty] = useState('hard')

  const startTimeRef = useRef(Date.now())
  const gameEndedRef = useRef(false)

  // Detectar fin de partida
  useEffect(() => {
    const { winner, line } = calculateWinner(board)

    if (winner) {
      setWinnerInfo({ winner, line })
      setStatus(winner === HUMAN ? '¡VICTORIA!' : 'DERROTA')
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        recordGame({
          game: 'TicTacToe',
          result: winner === HUMAN ? 'win' : 'loss',
          duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          score: null,
        })
      }
    } else if (isBoardFull(board)) {
      setWinnerInfo({ winner: 'draw', line: null })
      setStatus('EMPATE')
      if (!gameEndedRef.current) {
        gameEndedRef.current = true
        recordGame({
          game: 'TicTacToe',
          result: 'draw',
          duration: Math.round((Date.now() - startTimeRef.current) / 1000),
          score: null,
        })
      }
    }
  }, [board, recordGame])

  // Turno IA
  useEffect(() => {
    if (!isHumanTurn && !winnerInfo) {
      setStatus('IA PENSANDO...')
      const timer = setTimeout(() => {
        const move = getBestMove(board, difficulty)
        if (move === undefined || move === null) return
        setBoard((prev) => {
          const next = [...prev]
          next[move] = AI
          return next
        })
        setIsHumanTurn(true)
        setStatus('TU TURNO')
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isHumanTurn, board, winnerInfo, difficulty])

  const handleCellClick = (index) => {
    if (!isHumanTurn || board[index] || winnerInfo) return

    const next = [...board]
    next[index] = HUMAN
    setBoard(next)
    setIsHumanTurn(false)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsHumanTurn(true)
    setStatus('TU TURNO')
    setWinnerInfo(null)
    gameEndedRef.current = false
    startTimeRef.current = Date.now()
  }

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <IconBack /> VOLVER AL ARCADE
      </button>

      <div className={styles.header}>
        <div className={styles.tag}>// MODULE 01</div>
        <h2 className={styles.title}>
          TRES EN LÍNEA <span className={styles.titleAccent}>// vs IA</span>
        </h2>
      </div>

      <div className={styles.statusBar}>
        <span className={`${styles.statusDot} ${winnerInfo ? styles.statusEnd : ''}`}></span>
        <span className={styles.statusText}>{status}</span>
        {!winnerInfo && (
          <span className={styles.thinkingIndicator}>
            <IconBot />
          </span>
        )}
      </div>

      <div className={styles.difficultySelector}>
        <span className={styles.difficultyLabel}>// NIVEL:</span>
        {[
          { id: 'easy', label: 'FÁCIL', color: 'green' },
          { id: 'medium', label: 'MEDIO', color: 'yellow' },
          { id: 'hard', label: 'DIFÍCIL', color: 'red' },
        ].map((d) => (
          <button
            key={d.id}
            className={`${styles.difficultyButton} ${difficulty === d.id ? styles.activeDifficulty : ''} ${styles[d.color]}`}
            onClick={() => {
              setDifficulty(d.id)
              resetGame()
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className={styles.board}>
        {board.map((cell, i) => {
          const isWinning = winnerInfo?.line?.includes(i)
          const isDisabled = !isHumanTurn || cell || winnerInfo
          return (
            <button
              key={i}
              className={`${styles.cell} ${isWinning ? styles.winning : ''} ${isDisabled && !cell ? styles.disabled : ''} ${cell === HUMAN ? styles.cellX : ''} ${cell === AI ? styles.cellO : ''}`}
              onClick={() => handleCellClick(i)}
              disabled={isDisabled}
            >
              {cell && (
                <span className={styles.cellSymbol}>{cell}</span>
              )}
            </button>
          )
        })}
      </div>

      {winnerInfo && (
        <button className={styles.resetButton} onClick={resetGame}>
          <IconRefresh /> JUGAR DE NUEVO
        </button>
      )}

      <div className={styles.infoBox}>
        <div className={styles.infoHeader}>
          <span className={styles.infoTag}>// AI ENGINE</span>
        </div>
        <p className={styles.infoText}>
          Algoritmo <strong>Minimax con poda Alfa-Beta</strong>. En nivel
          <em> DIFÍCIL</em> la IA es prácticamente imbatible (solo puedes empatar).
        </p>
      </div>
    </div>
  )
}

export default TicTacToe