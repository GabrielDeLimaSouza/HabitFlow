import { useEffect, useRef, useState } from 'react'
import { Sparkles, X, Send, Trash2, Flame, Clock, Calendar } from 'lucide-react'
import { useAiAgent } from '../hooks/use-ai-agent'
import { useAiStore } from '../store/ai-store'
import MessageBubble from './MessageBubble'
import styles from './agent-drawer.module.css'

const MAX_MESSAGES  = 20
const MAX_HOURLY    = 5
const MAX_MONTHLY   = 100

const SUGGESTIONS_GENERIC = [
  'Como criar um hábito que dure?',
  'Como manter consistência nos dias difíceis?',
]

function getSuggestions(ctx) {
  if (!ctx?.name) return SUGGESTIONS_GENERIC
  return [
    `Como melhorar minha consistência em ${ctx.name}?`,
    `Qual a melhor forma de começar ${ctx.name}?`,
  ]
}

function TypingIndicator() {
  return (
    <div className={styles.typing}>
      <span className={styles.dot} /><span className={styles.dot} /><span className={styles.dot} />
    </div>
  )
}

function AgentDrawer() {
  const {
    isOpen, messages, loading, error,
    hourlyCount, monthlyCount,
    open, close, sendMessage, fetchUsage, saveNote,
  } = useAiAgent()
  const { habitContext, activeHabit, currentUserId, clearMessages } = useAiStore()
  const [input, setInput] = useState('')
  const messagesEndRef    = useRef(null)
  const textareaRef       = useRef(null)

  const visibleMessages = messages.filter((m) => m.content !== '')
  const messageCount    = visibleMessages.filter((m) => m.role === 'user').length
  const hasContent      = visibleMessages.length > 0
  const canSave         = !!activeHabit?.id

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!isOpen) return
    textareaRef.current?.focus()
    if (currentUserId) fetchUsage(currentUserId)
  }, [isOpen, currentUserId])

  const handleSend = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    setInput('')
    sendMessage(trimmed)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <>
      {!isOpen && (
        <button className={styles.fab} onClick={() => open()} aria-label="Abrir assistente">
          <Sparkles size={20} />
        </button>
      )}

      {isOpen && (
        <>
          <div className={styles.overlay} onClick={close} />
          <div className={styles.drawer} role="dialog" aria-label="Assistente de hábitos">

            {/* Header */}
            <div className={styles.header} style={{ '--habit-color': activeHabit?.color ?? 'var(--accent)' }}>
              <div style={{ height:'3px', background:'var(--habit-color)', position:'absolute',
                top:'-1px', left:'-1px', width:'calc(100% + 2px)',
                borderRadius:'var(--radius-md) var(--radius-md) 0 0' }} />
              <Sparkles size={16} className={styles.headerIcon} />
              <div className={styles.headerInfo}>
                <p className={styles.headerTitle}>{habitContext?.name ?? 'Assistente'}</p>
                <p className={styles.headerSub}>
                  {habitContext?.streak > 0 ? <><Flame size={11} /> {habitContext.streak} dias</> : 'Powered by Claude'}
                </p>
              </div>
              {hasContent && (
                <button className={styles.clearBtn} onClick={clearMessages} title="Limpar conversa">
                  <Trash2 size={14} />
                </button>
              )}
              <button className={styles.closeBtn} onClick={close} aria-label="Fechar"><X size={16} /></button>
            </div>

            {/* Mensagens */}
            <div className={styles.messages}>
              {!hasContent && !loading && (
                <div className={styles.empty}>
                  <Sparkles size={32} className={styles.emptyIcon} />
                  <p className={styles.emptyTitle}>Como posso ajudar?</p>
                  <p className={styles.emptyHint}>Pergunte sobre técnicas, consistência ou progresso.</p>
                  <div className={styles.suggestions}>
                    {getSuggestions(habitContext).map((s) => (
                      <button key={s} className={styles.suggestion} onClick={() => handleSend(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => msg.content === '' ? null : (
                <MessageBubble
                  key={i}
                  message={msg}
                  onSaveNote={canSave ? saveNote : null}
                />
              ))}

              {loading && messages.at(-1)?.content === '' && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}

            {/* Input */}
            <div className={styles.inputArea}>
              <textarea ref={textareaRef} className={styles.textarea} value={input}
                onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Escreva sua pergunta… (Enter para enviar)"
                disabled={loading} rows={1} />
              <button className={styles.sendBtn} onClick={() => handleSend()}
                disabled={!input.trim() || loading} aria-label="Enviar">
                <Send size={16} />
              </button>
            </div>

            {/* Uso */}
            <div className={styles.usageBar}>
              <span className={styles.usageStat}>
                <Clock size={10} />{hourlyCount}/{MAX_HOURLY} hora
              </span>
              <span className={styles.usageStat}>
                <Calendar size={10} />{monthlyCount}/{MAX_MONTHLY} mês
              </span>
              <span className={styles.usageMsgs}>{messageCount}/{MAX_MESSAGES}</span>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AgentDrawer
