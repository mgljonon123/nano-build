import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ReactNode } from 'react'

export default function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth()
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

  if (role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-stone)] mb-2">Access Denied</h1>
        <p className="text-[var(--color-stone)]/70 mb-6">
          You do not have the required permissions to view this page.
        </p>
        <Navigate to="/" replace />
      </div>
    )
  }

  return <>{children}</>
}
