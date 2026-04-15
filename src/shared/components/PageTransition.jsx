import { useLocation } from 'react-router-dom'

/**
 * Envolve o conteúdo da rota e aplica animação de entrada
 * sempre que o pathname muda. A troca de `key` força remontagem.
 */
function PageTransition({ children }) {
  const { pathname } = useLocation()

  return (
    <div key={pathname} className="page-enter" style={{ display: 'contents' }}>
      {children}
    </div>
  )
}

export default PageTransition
