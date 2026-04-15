import { Sparkles, CalendarClock, TrendingUp } from 'lucide-react'
import styles from './insight-card.module.css'

const MONTHS_PT = [
  'janeiro','fevereiro','março','abril','maio','junho',
  'julho','agosto','setembro','outubro','novembro','dezembro',
]

function formatDate(isoString) {
  const d = new Date(isoString)
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`
}

function SkeletonLines() {
  return (
    <>
      <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '100%' }} />
      <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '85%' }} />
      <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '70%' }} />
    </>
  )
}

/**
 * Card de insight semanal gerado por IA para o Dashboard.
 * Exibe 4 estados: dados insuficientes, aguardando segunda-feira, gerando, insight pronto.
 * @param {{ insight, loading, generating, error, daysWithData, isMonday, daysUntilMonday, onGenerate }} props
 */
function InsightCard({ insight, loading, generating, error, daysWithData = 0, isMonday, daysUntilMonday, onGenerate }) {
  if (loading) return null

  const hasEnoughData = daysWithData >= 7
  const progress = Math.min((daysWithData / 7) * 100, 100)

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <Sparkles size={14} className={styles.icon} />
        <h2 className={styles.title}>Insight da semana</h2>
      </div>

      {generating ? (
        <SkeletonLines />
      ) : insight ? (
        <>
          <p className={styles.text}>{insight.content}</p>
          <p className={styles.meta}>Gerado em {formatDate(insight.created_at)}</p>
        </>
      ) : !hasEnoughData ? (
        <div className={styles.stateBox}>
          <TrendingUp size={20} className={styles.stateIcon} />
          <p className={styles.stateText}>Registre hábitos por 7 dias para receber seu insight semanal.</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.stateHint}>{daysWithData}/7 dias com dados</p>
        </div>
      ) : !isMonday ? (
        <div className={styles.stateBox}>
          <CalendarClock size={20} className={styles.stateIcon} />
          <p className={styles.stateText}>Seu insight será gerado automaticamente na próxima segunda-feira.</p>
          <p className={styles.stateHint}>
            {daysUntilMonday === 1 ? 'Amanhã!' : `Em ${daysUntilMonday} dias`}
          </p>
        </div>
      ) : (
        <button className={styles.generateBtn} onClick={onGenerate} disabled={generating}>
          <Sparkles size={14} />
          Gerar insight da semana
        </button>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </section>
  )
}

export default InsightCard
