import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[var(--color-sand)] border-b border-[var(--color-warm-light)]/30 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link to="/" className="font-serif text-2xl font-semibold text-[var(--color-stone)] hover:text-[var(--color-warm)] transition-colors">
            Stay
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] font-medium">Home</Link>
            <Link to="/listings" className="text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] font-medium">Rentals</Link>
            <Link to="/staging" className="text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] font-medium">AI Staging</Link>
            <Link to="/admin" className="text-[var(--color-stone)]/60 hover:text-[var(--color-stone)] text-sm">Admin</Link>
            <Link to="/login" className="inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--color-stone)]/20 text-sm font-medium text-[var(--color-stone)] hover:bg-[var(--color-stone)] hover:text-[var(--color-sand)] transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-[var(--color-stone)] text-[var(--color-sand)] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-serif text-xl">Stay</span>
          <p className="text-[var(--color-sand)]/80 text-sm">© {new Date().getFullYear()} — Find your next home.</p>
        </div>
      </footer>
    </div>
  )
}
