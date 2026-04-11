import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-[var(--color-stone)]/70 text-sm">
        Loading…
      </div>
    )
  }
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <>{children}</>
}
