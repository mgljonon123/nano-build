import { Link } from 'react-router-dom'

export default function Signup() {
  return (
    <section className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 sm:px-6 bg-white/60">
      <div className="max-w-md w-full bg-white/90 border border-[var(--color-warm-light)]/40 rounded-2xl shadow-sm p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl sm:text-4xl text-[var(--color-stone)]">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[var(--color-stone)]/70">
            Save favorite homes and manage your listings.
          </p>
        </div>

        <form className="space-y-5">
          <div className="text-left">
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2.5 text-[var(--color-stone)] placeholder:text-[var(--color-stone)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] bg-white/80"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2.5 text-[var(--color-stone)] placeholder:text-[var(--color-stone)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] bg-white/80"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="Create a password"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2.5 text-[var(--color-stone)] placeholder:text-[var(--color-stone)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] bg-white/80"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-[var(--color-stone)] mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              required
              placeholder="Repeat your password"
              className="w-full rounded-lg border border-[var(--color-warm-light)]/60 px-3 py-2.5 text-[var(--color-stone)] placeholder:text-[var(--color-stone)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-warm)] bg-white/80"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 rounded-lg bg-[var(--color-stone)] text-[var(--color-sand)] font-medium hover:bg-[var(--color-warm)] transition-colors"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-stone)]/70">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[var(--color-warm)] font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  )
}

