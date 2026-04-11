import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    const fullName = String(data.get('fullName') || '').trim()
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setStatus('idle')
      return
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            role: 'member',
          },
        },
      })

      if (authError) throw authError

      if (authData.user && !authData.session) {
        setError('success: Perfect! Please check your email on web to confirm your account.')
        alert('Perfect! Please check your email on web to confirm your account.')
        navigate('/login')
      } else if (authData.session) {
        setError('success: Welcome! Your account is ready. Redirecting...')
        setTimeout(() => {
          window.location.href = '/admin'
        }, 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setStatus('idle')
    }
  }

  return (
    <div className="font-marketing text-[var(--color-stone)] min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80"
          alt="Modern Villa"
          className="w-full h-full object-cover scale-105 animate-fade-in"
        />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-8 animate-slide-up delay-100">
        <div className="glass-card rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden relative group">
          {/* Subtle Accent Glow */}
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[var(--color-warm)]/10 blur-3xl group-hover:bg-[var(--color-warm)]/20 transition-all duration-700" />
          
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl sm:text-5xl text-[var(--color-stone)] mb-3">
              Join Us
            </h1>
            <p className="text-sm text-[var(--color-stone)]/60 font-medium tracking-wide uppercase">
              Start Your Real Estate Journey
            </p>
          </div>

          <form className="grid grid-cols-1 gap-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--color-stone)]/70 uppercase tracking-tighter ml-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                required
                placeholder="John Doe"
                className="w-full rounded-xl border-0 bg-[var(--color-sand)]/50 px-4 py-3 text-[var(--color-stone)] ring-1 ring-inset ring-black/5 placeholder:text-[var(--color-stone)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--color-stone)]/70 uppercase tracking-tighter ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="john@example.com"
                className="w-full rounded-xl border-0 bg-[var(--color-sand)]/50 px-4 py-3 text-[var(--color-stone)] ring-1 ring-inset ring-black/5 placeholder:text-[var(--color-stone)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[var(--color-stone)]/70 uppercase tracking-tighter ml-1">
                Create Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border-0 bg-[var(--color-sand)]/50 px-4 py-3 text-[var(--color-stone)] ring-1 ring-inset ring-black/5 placeholder:text-[var(--color-stone)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] transition-all duration-300"
              />
            </div>

            <div className="py-2">
              <p className="text-[11px] text-[var(--color-stone)]/50 leading-relaxed text-center px-4">
                By creating an account, you agree to our <span className="text-[var(--color-warm)] font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[var(--color-warm)] font-bold cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-4 rounded-xl bg-[var(--color-stone)] text-[var(--color-sand)] font-bold text-lg hover:bg-[var(--color-warm)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:translate-y-0 shadow-lg relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] -translate-x-full group-hover/btn:translate-x-[250%] transition-transform duration-1000" />
              <span className="relative">
                {status === 'loading' ? 'Creating Account…' : 'Get Started Now'}
              </span>
            </button>
          </form>

          {error ? (
            <div className={`mt-6 p-4 rounded-xl animate-fade-in text-center ${
              error.startsWith('success:') 
                ? 'bg-green-50/50 border border-green-100 text-green-600' 
                : 'bg-red-50/50 border border-red-100 text-red-600'
            }`}>
              <p className="text-sm font-medium">
                {error.replace('success: ', '')}
              </p>
            </div>
          ) : null}

          <div className="mt-10 pt-8 border-t border-black/5 text-center">
            <p className="text-sm text-[var(--color-stone)]/60 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[var(--color-warm)] font-bold hover:underline underline-offset-4"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
