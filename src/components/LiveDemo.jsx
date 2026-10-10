import { useState, useEffect } from 'react'
import styles from '../styles/LiveDemo.module.css'

const LiveDemo = () => {
  const [renderCount, setRenderCount] = useState(0)
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    setRenderCount((prev) => prev + 1)
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>⚡ Demostración en Vivo (CSR)</h2>
        <p className={styles.subtitle}>Validación del ciclo de render en el cliente</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>🔄 Ciclo de Render</h3>
          <p className={styles.metric}>{renderCount}</p>
          <p className={styles.label}>Veces renderizado</p>
        </div>

        <div className={styles.card}>
          <h3>🕐 Reloj en Tiempo Real</h3>
          <p className={styles.metric}>{time}</p>
          <p className={styles.label}>Actualizado cada segundo</p>
        </div>

        <div className={styles.card}>
          <h3>🌐 CSR Activo</h3>
          <p className={styles.metric}>100%</p>
          <p className={styles.label}>Renderizado en el navegador</p>
        </div>
      </div>

      <div className={styles.infoPanel}>
        <h3>🔍 ¿Cómo validar CSR?</h3>
        <ol>
          <li>Abre las <strong>Herramientas de Desarrollador</strong> (F12).</li>
          <li>Ve a la pestaña <strong>Network</strong> y recarga. Verás los chunks JS descargándose.</li>
          <li>Inspecciona el <code>index.html</code> inicial: solo hay <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</li>
          <li>Usa <strong>React DevTools</strong> para ver el árbol de componentes y las props.</li>
        </ol>
      </div>
    </div>
  )
}

export default LiveDemo