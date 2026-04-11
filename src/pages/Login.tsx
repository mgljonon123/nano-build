import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const next = searchParams.get('next') || '/admin'
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (authError) {
        throw new Error(authError.message)
      }

      // --- Senior Developer Admin Fix ---
      // If this is the known project owner email, ensure they have the admin role in metadata
      if (email.toLowerCase() === 'b.tuguldur2015@gmail.com') {
        const currentUser = authData.user
        if (currentUser && currentUser.user_metadata?.role !== 'admin') {
          console.log('Self-elevating to admin role...')
          await supabase.auth.updateUser({
            data: { role: 'admin' }
          })
        }
      }

      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="font-marketing text-[var(--color-stone)] min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1920&q=80"
          alt="Modern Architecture"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-slide-up">
        <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden relative group">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--color-warm)]/10 blur-3xl group-hover:bg-[var(--color-warm)]/20 transition-all duration-700" />
          
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-stone)] mb-3">
              Welcome Back
            </h1>
            <p className="text-sm text-[var(--color-stone)]/60 font-medium tracking-wide uppercase">
              Secure Login &bull; Real Estate Access
            </p>
          </div>

          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--color-stone)]/70 uppercase tracking-tighter ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border-0 bg-[var(--color-sand)]/50 px-4 py-3 text-[var(--color-stone)] ring-1 ring-inset ring-black/5 placeholder:text-[var(--color-stone)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-bold text-[var(--color-stone)]/70 uppercase tracking-tighter">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-[var(--color-warm)] uppercase tracking-widest hover:text-[var(--color-stone)] transition-colors">
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border-0 bg-[var(--color-sand)]/50 px-4 py-3 text-[var(--color-stone)] ring-1 ring-inset ring-black/5 placeholder:text-[var(--color-stone)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] transition-all duration-300"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-black/10 text-[var(--color-warm)] focus:ring-[var(--color-warm)]"
              />
              <label htmlFor="remember" className="text-sm text-[var(--color-stone)]/60 font-medium">
                Remember my session
              </label>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl bg-[var(--color-stone)] text-[var(--color-sand)] font-bold text-lg hover:bg-[var(--color-warm)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:translate-y-0 shadow-xl relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-1000" />
              <span className="relative">
                {status === 'loading' ? 'Authenticating…' : 'Sign In Now'}
              </span>
            </button>
          </form>

          {error ? (
            <div className="mt-6 p-4 rounded-xl bg-red-50/50 border border-red-100 animate-fade-in text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          ) : null}

          <div className="mt-10 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-[var(--color-stone)]/60 font-medium">
              Don't have an account yet?{' '}
              <Link
                to="/signup"
                className="text-[var(--color-warm)] font-bold hover:underline underline-offset-4"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

