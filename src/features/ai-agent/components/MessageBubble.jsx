import { useState } from 'react'
import { BookmarkPlus, Check } from 'lucide-react'
import styles from './agent-drawer.module.css'

/**
 * Bolha de mensagem do chat. Mensagens do assistente têm botão "Salvar".
 * @param {{ message: { role: string, content: string }, onSaveNote?: Function }} props
 */
function MessageBubble({ message, onSaveNote }) {
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    try {
      await onSaveNote(message.content)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // falha silenciosa — não interrompe o usuário
    }
  }

  const isAssistant = message.role === 'assistant'

  return (
    <div className={`${styles.bubble} ${isAssistant ? styles.bubbleAssistant : styles.bubbleUser}`}>
      {message.content}
      {isAssistant && onSaveNote && (
        <button
          className={`${styles.saveNoteBtn} ${saved ? styles.saveNoteSaved : ''}`}
          onClick={handleSave}
          disabled={saved}
          aria-label="Salvar resposta nas anotações do hábito"
          title="Salvar nas anotações"
        >
          {saved
            ? <><Check size={11} /><span>Salvo</span></>
            : <><BookmarkPlus size={11} /><span>Salvar</span></>
          }
        </button>
      )}
    </div>
  )
}

export default MessageBubble
