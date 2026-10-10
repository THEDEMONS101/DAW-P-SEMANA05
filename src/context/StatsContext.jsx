import { createContext, useContext, useState, useEffect } from 'react'

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

  // Persistir en localStorage cada vez que cambian las stats
  useEffect(() => {
    localStorage.setItem('fuego-arcade-stats', JSON.stringify(stats))
  }, [stats])

  // Registrar sesión al cargar
  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      sessionsCount: prev.sessionsCount + 1,
    }))
  }, [])

  const recordGame = ({ game, result, duration, score }) => {
    setStats((prev) => {
      const newStats = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        totalTimePlayed: prev.totalTimePlayed + duration,
        history: [
          { game, result, duration, score, timestamp: Date.now() },
          ...prev.history.slice(0, 49), // guardar últimas 50 partidas
        ],
      }

      if (result === 'win') {
        newStats.gamesWon = prev.gamesWon + 1
        if (game === 'TicTacToe') newStats.ticTacToeWins = prev.ticTacToeWins + 1
      } else if (result === 'loss') {
        newStats.gamesLost = prev.gamesLost + 1
      }

      // Mejor tiempo de reacción (menor es mejor)
      if (game === 'Reaction' && score) {
        if (prev.bestReactionTime === null || score < prev.bestReactionTime) {
          newStats.bestReactionTime = score
        }
      }

      // Mejor puntaje de memoria (mayor es mejor)
      if (game === 'Memory' && score) {
        if (prev.memoryBestScore === null || score > prev.memoryBestScore) {
          newStats.memoryBestScore = score
        }
      }

      return newStats
    })
  }

  const resetStats = () => {
    setStats(DEFAULT_STATS)
    localStorage.removeItem('fuego-arcade-stats')
  }

  return (
    <StatsContext.Provider value={{ stats, recordGame, resetStats }}>
      {children}
    </StatsContext.Provider>
  )
}

export const useStats = () => {
  const context = useContext(StatsContext)
  if (!context) throw new Error('useStats debe usarse dentro de StatsProvider')
  return context
}