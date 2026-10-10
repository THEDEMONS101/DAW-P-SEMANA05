import styles from '../styles/StyleComparison.module.css'

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const IconClose = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const StyleComparison = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tag}>// STYLE ENGINE</div>
        <h2 className={styles.title}>Estrategias de Estilado</h2>
        <p className={styles.subtitle}>
          Comparativa de las tres técnicas aplicadas en este proyecto
        </p>
      </div>

      <div className={styles.grid}>
        {/* CSS MODULES */}
        <div className={`${styles.card} ${styles.cyan}`}>
          <div className={styles.cardGlow}></div>
          <div className={styles.cornerTL}></div>
          <div className={styles.cornerBR}></div>

          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.cardIndex}>01</span>
              <h3 className={styles.cardTitle}>CSS Modules</h3>
            </div>
            <span className={`${styles.badge} ${styles.badgeActive}`}>
              <IconCheck /> EN USO
            </span>
          </div>

          <p className={styles.cardText}>
            Scope aislado por componente. Es la estrategia principal de este proyecto.
          </p>

          <pre className={styles.codeBlock}>
            <code>
{`/* MetricCard.module.css */
.card {
  background: var(--bg-card);
  border-radius: 12px;
  border: 1px solid var(--border-glow);
}

/* MetricCard.jsx */
import styles from '../styles/MetricCard.module.css'
<div className={styles.card}>...</div>`}
            </code>
          </pre>

          <div className={styles.benefits}>
            <span className={styles.benefitOk}><IconCheck /> Sin colisiones</span>
            <span className={styles.benefitOk}><IconCheck /> Hashing en build</span>
          </div>
        </div>

        {/* TAILWIND */}
        <div className={`${styles.card} ${styles.magenta}`}>
          <div className={styles.cardGlow}></div>
          <div className={styles.cornerTL}></div>
          <div className={styles.cornerBR}></div>

          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.cardIndex}>02</span>
              <h3 className={styles.cardTitle}>Tailwind CSS</h3>
            </div>
            <span className={`${styles.badge} ${styles.badgeConcept}`}>
              <IconWarn /> CONCEPTO
            </span>
          </div>

          <p className={styles.cardText}>
            Utilidades predefinidas. Alternativa válida pero más verbosa en el JSX.
          </p>

          <pre className={styles.codeBlock}>
            <code>
{`<div className="bg-slate-900 
  rounded-xl p-5 
  border border-cyan-500/30
  hover:border-cyan-400 
  transition-all">
  <h3 className="text-cyan-400 
    text-xs uppercase">
    {title}
  </h3>
</div>`}
            </code>
          </pre>

          <div className={styles.benefits}>
            <span className={styles.benefitOk}><IconCheck /> Rápido prototipado</span>
            <span className={styles.benefitWarn}><IconWarn /> HTML verboso</span>
          </div>
        </div>

        {/* INLINE STYLES */}
        <div className={`${styles.card} ${styles.purple}`}>
          <div className={styles.cardGlow}></div>
          <div className={styles.cornerTL}></div>
          <div className={styles.cornerBR}></div>

          <div className={styles.cardHeader}>
            <div className={styles.cardTitleGroup}>
              <span className={styles.cardIndex}>03</span>
              <h3 className={styles.cardTitle}>Inline Styles</h3>
            </div>
            <span className={`${styles.badge} ${styles.badgeDynamic}`}>
              ⚡ DINÁMICO
            </span>
          </div>

          <p className={styles.cardText}>
            Ideal para valores calculados en tiempo de ejecución, como el color del trend.
          </p>

          <pre className={styles.codeBlock}>
            <code>
{`// En ReactionGame.jsx
<button
  className={styles.reactionArea}
  style={{
    backgroundColor: 
      state === 'ready' 
        ? '#39ff14' 
        : undefined,
    boxShadow: state === 'ready'
      ? '0 0 40px #39ff14'
      : undefined
  }}
/>`}
            </code>
          </pre>

          <div className={styles.benefits}>
            <span className={styles.benefitOk}><IconCheck /> Valores en runtime</span>
            <span className={styles.benefitBad}><IconClose /> Sin pseudo-clases</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StyleComparison