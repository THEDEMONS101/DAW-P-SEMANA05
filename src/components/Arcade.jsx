import { useState } from 'react'
import TicTacToe from './games/TicTacToe'
import MemoryGame from './games/MemoryGame'
import ReactionGame from './games/ReactionGame'
import styles from '../styles/Arcade.module.css'

const IconTicTacToe = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <line x1="24" y1="8" x2="24" y2="56"/>
    <line x1="40" y1="8" x2="40" y2="56"/>
    <line x1="8" y1="24" x2="56" y2="24"/>
    <line x1="8" y1="40" x2="56" y2="40"/>
    <line x1="10" y1="10" x2="20" y2="20"/>
    <line x1="20" y1="10" x2="10" y2="20"/>
    <circle cx="32" cy="32" r="5"/>
    <line x1="44" y1="44" x2="54" y2="54"/>
    <line x1="54" y1="44" x2="44" y2="54"/>
  </svg>
)

const IconMemory = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="10" width="24" height="20" rx="3"/>
    <rect x="34" y="10" width="24" height="20" rx="3"/>
    <rect x="6" y="34" width="24" height="20" rx="3"/>
    <rect x="34" y="34" width="24" height="20" rx="3"/>
    <circle cx="18" cy="20" r="3" fill="currentColor"/>
    <circle cx="46" cy="44" r="3" fill="currentColor"/>
    <circle cx="18" cy="44" r="3" fill="currentColor"/>
    <circle cx="46" cy="20" r="3" fill="currentColor"/>
  </svg>
)

const IconReaction = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M36 4 L18 32 L30 32 L28 60 L46 28 L34 28 Z" fill="currentColor" fillOpacity="0.15"/>
  </svg>
)

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
)

const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/>
  </svg>
)

const Arcade = () => {
  const [selectedGame, setSelectedGame] = useState(null)

  const games = [
    {
      id: 'tictactoe',
      name: 'TRES EN LÍNEA',
      subtitle: 'vs IA Neural',
      desc: 'Duelo estratégico contra inteligencia artificial Minimax.',
      Icon: IconTicTacToe,
      accent: 'cyan',
    },
    {
      id: 'memory',
      name: 'MEMORIA CUÁNTICA',
      subtitle: 'Pattern Match',
      desc: 'Encuentra los pares en el menor tiempo posible.',
      Icon: IconMemory,
      accent: 'magenta',
    },
    {
      id: 'reaction',
      name: 'REFLEJOS',
      subtitle: 'Speed Test',
      desc: 'Mide tu tiempo de reacción en milisegundos.',
      Icon: IconReaction,
      accent: 'purple',
    },
  ]

  if (selectedGame === 'tictactoe') return <TicTacToe onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'memory') return <MemoryGame onBack={() => setSelectedGame(null)} />
  if (selectedGame === 'reaction') return <ReactionGame onBack={() => setSelectedGame(null)} />

  return (
    <div className={styles.arcade}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <IconSparkle /> SISTEMA ACTIVO
        </div>
        <h2 className={styles.heroTitle}>
          <span className={styles.heroTitleLine}>BIENVENIDO AL</span>
          <span className={styles.heroTitleMain}>ARCADE</span>
        </h2>
        <p className={styles.heroSubtitle}>
          Selecciona un módulo de juego. Cada partida se registra en tiempo real.
        </p>
        <div className={styles.heroDivider}>
          <span></span><span></span><span></span>
        </div>
      </div>

      <div className={styles.gamesGrid}>
        {games.map((game, index) => (
          <button
            key={game.id}
            className={`${styles.gameCard} ${styles[game.accent]}`}
            onClick={() => setSelectedGame(game.id)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={styles.cardGlow}></div>
            <div className={styles.cardCorner}></div>
            <div className={styles.cardCornerTR}></div>

            <div className={styles.cardNumber}>0{index + 1}</div>

            <div className={styles.gameIconWrapper}>
              <game.Icon />
            </div>

            <div className={styles.cardContent}>
              <p className={styles.gameSubtitle}>{game.subtitle}</p>
              <h3 className={styles.gameName}>{game.name}</h3>
              <p className={styles.gameDesc}>{game.desc}</p>
            </div>

            <div className={styles.playButton}>
              <span>JUGAR</span>
              <IconArrow />
            </div>
          </button>
        ))}
      </div>

      <div className={styles.footerHint}>
        <span className={styles.hintDot}></span>
        <span>Las métricas se sincronizan automáticamente con el panel de control</span>
      </div>
    </div>
  )
}

export default Arcade