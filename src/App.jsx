import { useState } from 'react'
import { StatsProvider } from './context/StatsContext'
import Header from './components/Header'
import Arcade from './components/Arcade'
import Dashboard from './components/Dashboard'
import StyleComparison from './components/StyleComparison'
import CodeViewer from './components/CodeViewer'
import styles from './styles/App.module.css'
import MatrixRain from './components/MatrixRain'
// ...
<MatrixRain />

function App() {
  const [activeTab, setActiveTab] = useState('arcade')

  const renderContent = () => {
    switch (activeTab) {
      case 'arcade': return <Arcade />
      case 'dashboard': return <Dashboard />
      case 'styles': return <StyleComparison />
      case 'code': return <CodeViewer />
      default: return <Arcade />
    }
  }

  return (
    <StatsProvider>
      <div className={styles.app}>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={styles.main}>{renderContent()}</main>
        <footer className={styles.footer}>
          <p>FUEGO ARCADE © 2026 — DESARROLLO DE APLICACIONES WEB IS093A- CAMARGO ALVARADO EDILSON ROBERTO</p>
        </footer>
      </div>
    </StatsProvider>
  )
}

export default App