import styles from '../styles/MetricCard.module.css'

const ACCENT_MAP = {
  cyan: 'cyan',
  magenta: 'magenta',
  green: 'green',
  yellow: 'yellow',
}

const MetricCard = ({ title, value, change, trend, accent = 'cyan', children }) => {
  const accentClass = styles[ACCENT_MAP[accent] || 'cyan']

  return (
    <div className={`${styles.card} ${accentClass}`}>
      <div className={styles.cardGlow}></div>
      <div className={styles.cornerTL}></div>
      <div className={styles.cornerBR}></div>

      <div className={styles.cardHeader}>
        <span className={styles.cardLabel}>// METRIC</span>
        {children}
      </div>

      <div className={styles.cardTitle}>{title}</div>

      <div className={styles.cardValue}>{value}</div>

      <div className={`${styles.cardChange} ${trend === 'up' ? styles.up : styles.down}`}>
        <span className={styles.trendIcon}>{trend === 'up' ? '▲' : '▼'}</span>
        <span>{change}</span>
      </div>

      <div className={styles.cardBar}></div>
    </div>
  )
}

export default MetricCard