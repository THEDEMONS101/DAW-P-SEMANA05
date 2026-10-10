import { useState } from 'react'
import styles from '../styles/CodeViewer.module.css'

const IconFile = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const snippets = {
  statsContext: {
    filename: 'StatsContext.jsx',
    path: 'src/context/',
    code: `import { createContext, useContext, useState, useEffect } from 'react'

const StatsContext = createContext()

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  totalTimePlayed: 0,
  bestReactionTime: null,
  memoryBestScore: null,
  ticTacToeWins: 0,
  sessionsCount: 0,
  history: [],
}

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('fuego-arcade-stats')
    return saved ? JSON.parse(saved) : DEFAULT_STATS
  })

  useEffect(() => {
    localStorage.setItem('fuego-arcade-stats', JSON.stringify(stats))
  }, [stats])

  const recordGame = ({ game, result, duration, score }) => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalTimePlayed: prev.totalTimePlayed + duration,
        history: [
          { game, result, duration, score, timestamp: Date.now() },
          ...prev.history.slice(0, 49),
        ],
      }

      if (result === 'win') {
        newStats.gamesWon = prev.gamesWon + 1
        if (game === 'TicTacToe') 
          newStats.ticTacToeWins = prev.ticTacToeWins + 1
      } else if (result === 'loss') {
        newStats.gamesLost = prev.gamesLost + 1
      }

      if (game === 'Reaction' && score) {
        if (prev.bestReactionTime === null 
            || score < prev.bestReactionTime) {
          newStats.bestReactionTime = score
        }
      }

      if (game === 'Memory' && score) {
        if (prev.memoryBestScore === null 
            || score > prev.memoryBestScore) {
          newStats.memoryBestScore = score
        }
      }

      return newStats
    })
  }

  return (
    <StatsContext.Provider value={{ stats, recordGame, resetStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => useContext(StatsContext)`,
  },
  ticTacToeAI: {
    filename: 'tictactoeAI.js',
    path: 'src/utils/',
    code: `export const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

export const HUMAN = 'X'
export const AI = 'O'

const minimax = (board, depth, isMaximizing, alpha, beta) => {
  const score = evaluate(board)

  if (score === 10) return score - depth
  if (score === -10) return score + depth
  if (isBoardFull(board)) return 0

  if (isMaximizing) {
    let best = -Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = AI
        const value = minimax(board, depth + 1, false, alpha, beta)
        board[i] = null
        best = Math.max(best, value)
        alpha = Math.max(alpha, best)
        if (beta <= alpha) break
      }
    }
    return best
  } else {
    let best = Infinity
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = HUMAN
        const value = minimax(board, depth + 1, true, alpha, beta)
        board[i] = null
        best = Math.min(best, value)
        beta = Math.min(beta, best)
        if (beta <= alpha) break
      }
    }
    return best
  }
}

export const getBestMove = (board, difficulty = 'hard') => {
  // ... lógica de dificultad + elección del mejor movimiento
}`,
  },
  ticTacToe: {
    filename: 'TicTacToe.jsx',
    path: 'src/components/games/',
    code: `const TicTacToe = ({ onBack }) => {
  const { recordGame } = useStats()
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isHumanTurn, setIsHumanTurn] = useState(true)
  const [winnerInfo, setWinnerInfo] = useState(null)
  const [difficulty, setDifficulty] = useState('hard')

  useEffect(() => {
    const { winner, line } = calculateWinner(board)
    if (winner) {
      setWinnerInfo({ winner, line })
      recordGame({
        game: 'TicTacToe',
        result: winner === HUMAN ? 'win' : 'loss',
        duration: Math.round((Date.now() - startTime) / 1000),
      })
    }
  }, [board])

  // Turno de la IA
  useEffect(() => {
    if (!isHumanTurn && !winnerInfo) {
      const timer = setTimeout(() => {
        const move = getBestMove(board, difficulty)
        setBoard((prev) => {
          const next = [...prev]
          next[move] = AI
          return next
        })
        setIsHumanTurn(true)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isHumanTurn, board, winnerInfo])

  // ... render del tablero
}`,
  },
  dashboard: {
    filename: 'Dashboard.jsx',
    path: 'src/components/',
    code: `const Dashboard = () => {
  const { stats, resetStats } = useStats()

  const winRate = stats.gamesPlayed > 0
    ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0'

  const metrics = [
    {
      title: 'Partidas Jugadas',
      value: stats.gamesPlayed.toString(),
      change: \`\${stats.sessionsCount} sesiones\`,
      trend: 'up',
      accent: 'cyan',
    },
    {
      title: 'Victorias',
      value: stats.gamesWon.toString(),
      change: \`\${winRate}% win rate\`,
      trend: stats.gamesWon > 0 ? 'up' : 'down',
      accent: 'green',
    },
    // ...
  ]

  return (
    <div className={styles.grid}>
      {metrics.map((m) => (
        <MetricCard key={m.title} {...m}>
          <span className={styles.badge}>LIVE</span>
        </MetricCard>
      ))}
    </div>
  )
}`,
  },
  memory: {
    filename: 'MemoryGame.jsx',
    path: 'src/components/games/',
    code: `const MemoryGame = ({ onBack }) => {
  const { recordGame } = useStats()
  const [cards, setCards] = useState(createDeck)
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped
      if (cards[a].emoji === cards[b].emoji) {
        setCards(prev => prev.map((c, i) => 
          (i === a || i === b) ? { ...c, matched: true } : c
        ))
        setMatched(m => m + 1)
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }, [flipped])

  useEffect(() => {
    if (matched === EMOJIS.length && !finished) {
      const score = Math.max(0, 1000 - moves * 10 - duration * 2)
      recordGame({ game: 'Memory', result: 'win', score })
    }
  }, [matched])

  // ... render
}`,
  },
  reaction: {
    filename: 'ReactionGame.jsx',
    path: 'src/components/games/',
    code: `const ReactionGame = ({ onBack }) => {
  const { recordGame } = useStats()
  const [state, setState] = useState('idle')
  const [reactionTime, setReactionTime] = useState(null)
  const timeoutRef = useRef(null)
  const startTimeRef = useRef(null)

  const startTest = () => {
    setState('waiting')
    const delay = 1500 + Math.random() * 3000
    timeoutRef.current = setTimeout(() => {
      setState('ready')
      startTimeRef.current = Date.now()
    }, delay)
  }

  const handleClick = () => {
    if (state === 'ready') {
      const time = Date.now() - startTimeRef.current
      setReactionTime(time)
      recordGame({
        game: 'Reaction',
        result: 'win',
        score: time,
      })
    }
    // ...
  }

  return (
    <button
      className={\`\${styles.reactionArea} \${getButtonStyle()}\`}
      onClick={handleClick}
    >
      {getLabel()}
    </button>
  )
}`,
  },
}

const CodeViewer = () => {
  const [selected, setSelected] = useState('statsContext')
  const snippet = snippets[selected]
  const files = Object.keys(snippets)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tag}>// SOURCE CODE</div>
        <h2 className={styles.title}>Código Real del Proyecto</h2>
        <p className={styles.subtitle}>
          Fragmentos extraídos directamente de los archivos fuente
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>// FILES</span>
            <span className={styles.fileCount}>{files.length}</span>
          </div>
          {Object.entries(snippets).map(([key, s]) => (
            <button
              key={key}
              className={`${styles.fileButton} ${selected === key ? styles.active : ''}`}
              onClick={() => setSelected(key)}
            >
              <span className={styles.fileIcon}><IconFile /></span>
              <div className={styles.fileInfo}>
                <span className={styles.fileName}>{s.filename}</span>
                <span className={styles.filePath}>{s.path}</span>
              </div>
              {selected === key && <span className={styles.activeBar}></span>}
            </button>
          ))}
        </div>

        <div className={styles.codePanel}>
          <div className={styles.codeHeader}>
            <div className={styles.dots}>
              <span className={styles.dot} style={{ background: '#ff2a6d' }}></span>
              <span className={styles.dot} style={{ background: '#ffea00' }}></span>
              <span className={styles.dot} style={{ background: '#39ff14' }}></span>
            </div>
            <span className={styles.filename}>
              <IconFile /> {snippet.filename}
            </span>
            <span className={styles.langTag}>JSX</span>
          </div>
          <pre className={styles.code}>
            <code>{snippet.code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

export default CodeViewer