import MetricCard from './MetricCard'
import { useStats } from '../context/StatsContext'
import styles from '../styles/Dashboard.module.css'

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const IconRefresh = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
)

const Dashboard = () => {
  const { stats, resetStats } = useStats()

  const winRate = stats.gamesPlayed > 0
    ? ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1)
    : '0.0'

  const avgTimePerGame = stats.gamesPlayed > 0
    ? Math.round(stats.totalTimePlayed / stats.gamesPlayed)
    : 0

  const metrics = [
    { id: 1, title: 'Partidas Jugadas', value: stats.gamesPlayed.toString(), change: `${stats.sessionsCount} sesiones`, trend: 'up', accent: 'cyan' },
    { id: 2, title: 'Victorias', value: stats.gamesWon.toString(), change: `${winRate}% win rate`, trend: stats.gamesWon > 0 ? 'up' : 'down', accent: 'green' },
    { id: 3, title: 'Tiempo Total', value: formatTime(stats.totalTimePlayed), change: `~${avgTimePerGame}s por partida`, trend: 'up', accent: 'magenta' },
    { id: 4, title: 'Mejor Reflejo', value: stats.bestReactionTime ? `${stats.bestReactionTime} ms` : '—', change: stats.bestReactionTime ? 'Récord personal' : 'Sin datos', trend: 'up', accent: 'yellow' },
  ]

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <div className={styles.tag}>// ANALYTICS ENGINE</div>
          <h2 className={styles.title}>Panel de Control</h2>
          <p className={styles.subtitle}>Métricas calculadas en tiempo real desde tus partidas</p>
        </div>
        <button className={styles.resetButton} onClick={resetStats}>
          <IconRefresh />
          <span>RESET</span>
        </button>
      </div>

      <div className={styles.grid}>
        {metrics.map((m) => (
          <MetricCard key={m.id} {...m}>
            <span className={styles.badge}>LIVE</span>
          </MetricCard>
        ))}
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTag}>// STATS</span>
            <h3>Estadísticas Detalladas</h3>
          </div>
          <div className={styles.statList}>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Tres en Línea — Victorias</span>
              <span className={styles.statValue}>{stats.ticTacToeWins}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Mejor puntaje de Memoria</span>
              <span className={styles.statValue}>{stats.memoryBestScore ?? '—'} pts</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Partidas perdidas</span>
              <span className={styles.statValue}>{stats.gamesLost}</span>
            </div>
            <div className={styles.statRow}>
              <span className={styles.statLabel}>Sesiones totales</span>
              <span className={styles.statValue}>{stats.sessionsCount}</span>
            </div>
          </div>
        </div>

        {stats.history.length > 0 && (
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTag}>// LOG</span>
              <h3>Historial Reciente</h3>
            </div>
            <div className={styles.historyList}>
              {stats.history.slice(0, 8).map((h, i) => (
                <div key={i} className={styles.historyRow}>
                  <span className={`${styles.historyIndicator} ${h.result === 'win' ? styles.win : h.result === 'loss' ? styles.loss : styles.draw}`}></span>
                  <span className={styles.historyGame}>{h.game}</span>
                  <span className={`${styles.historyResult} ${h.result === 'win' ? styles.win : h.result === 'loss' ? styles.loss : styles.draw}`}>
                    {h.result === 'win' ? 'WIN' : h.result === 'loss' ? 'LOSS' : 'DRAW'}
                  </span>
                  <span className={styles.historyTime}>{h.duration}s</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {stats.gamesPlayed === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◈</div>
          <p className={styles.emptyTitle}>Sin datos disponibles</p>
          <p className={styles.emptyText}>Ve al <strong>ARCADE</strong> y comienza a jugar para generar métricas reales.</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard