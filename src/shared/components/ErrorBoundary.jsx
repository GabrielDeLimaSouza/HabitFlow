import { Component } from 'react'

/**
 * Captura erros não tratados na árvore de componentes filhos e exibe um fallback
 * em vez de uma tela branca total.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', height: '100vh', gap: '1rem',
        background: 'var(--bg-base)', color: 'var(--text-primary)',
        fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '2rem',
      }}>
        <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Algo deu errado</p>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: '24rem' }}>
          Ocorreu um erro inesperado. Seus dados estão seguros.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: '0.5rem', padding: '0.5rem 1.25rem',
            background: 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 'var(--radius-md)', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 500,
          }}
        >
          Tentar novamente
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
