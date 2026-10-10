import styles from '../styles/Header.module.css'
import { useStats } from '../context/StatsContext'

const IconArcade = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="4"/>
    <path d="M6 12h4M8 10v4"/>
    <circle cx="16" cy="11" r="1"/>
    <circle cx="18" cy="13" r="1"/>
  </svg>
)

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1"/>
    <rect x="14" y="3" width="7" height="5" rx="1"/>
    <rect x="14" y="12" width="7" height="9" rx="1"/>
    <rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
)

const IconStyles = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="14.5" r="2.5"/>
    <circle cx="8.5" cy="7.5" r="2.5"/>
    <circle cx="6.5" cy="15.5" r="2.5"/>
    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"/>
  </svg>
)

const IconCode = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
)

const IconFire = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="fireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00fff7" />
        <stop offset="50%" stopColor="#ff00e5" />
        <stop offset="100%" stopColor="#9d4edd" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C12 2 9 6 9 9c0 1.5 1 3 3 3s3-1.5 3-3c0-3-3-7-3-7z"
      fill="url(#fireGrad)"
      opacity="0.9"
    />
    <path
      d="M12 6c0 0-2 3-2 5 0 2 1 3.5 2 3.5s2-1.5 2-3.5c0-2-2-5-2-5z"
      fill="#fff"
      opacity="0.8"
    />
    <path
      d="M7 12c-1.5 1.5-2 3-2 4.5C5 19 8 22 12 22s7-3 7-5.5c0-1.5-.5-3-2-4.5 0 2-1 3-1 3s-1-2-4-2-4 2-4 2-1-1-1-3z"
      fill="url(#fireGrad)"
      opacity="0.6"
    />
  </svg>
)

const Header = ({ activeTab, setActiveTab }) => {
  const { stats } = useStats()

  const tabs = [
    { id: 'arcade', label: 'ARCADE', icon: <IconArcade /> },
    { id: 'dashboard', label: 'MÉTRICAS', icon: <IconDashboard /> },
    { id: 'styles', label: 'ESTILOS', icon: <IconStyles /> },
    { id: 'code', label: 'CÓDIGO', icon: <IconCode /> },
  ]

  return (
    <header className={styles.header}>
      <div className={styles.logo} data-text="FUEGO ARCADE">
        <div className={styles.logoIconWrapper}>
          <IconFire />
          <div className={styles.logoPulse}></div>
        </div>
        <div className={styles.logoText}>
          <h1 className={styles.logoTitle}>FUEGO<span className={styles.logoAccent}>ARCADE</span></h1>
          <p className={styles.logoSubtitle}>// CYBER ARENA v2.0</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.navButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span className={styles.navLabel}>{tab.label}</span>
            {activeTab === tab.id && <span className={styles.navGlow}></span>}
          </button>
        ))}
      </nav>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statDot}></span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{String(stats.gamesPlayed).padStart(2, '0')}</span>
            <span className={styles.statLabel}>PARTIDAS</span>
          </div>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={`${styles.statDot} ${styles.statDotGreen}`}></span>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{String(stats.gamesWon).padStart(2, '0')}</span>
            <span className={styles.statLabel}>VICTORIAS</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header