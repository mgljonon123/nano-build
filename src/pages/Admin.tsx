export default function Admin() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white/60">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl">
              Admin dashboard
            </h1>
            <p className="mt-2 text-sm text-[var(--color-stone)]/70">
              Frontend‑only view for managing listings and staging jobs.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-[var(--color-stone)] text-[var(--color-sand)] text-sm font-medium hover:bg-[var(--color-warm)] transition-colors">
              New listing
            </button>
            <button className="px-4 py-2 rounded-full border border-[var(--color-warm-light)]/60 text-sm font-medium text-[var(--color-stone)] hover:bg-white transition-colors">
              New staging job
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl bg-white border border-[var(--color-warm-light)]/40 p-5">
            <p className="text-xs font-medium text-[var(--color-stone)]/60 uppercase tracking-wide">
              Total listings
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-stone)]">
              24
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone)]/60">
              Static demo metric – wire to backend later.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-warm-light)]/40 p-5">
            <p className="text-xs font-medium text-[var(--color-stone)]/60 uppercase tracking-wide">
              Staging jobs
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-stone)]">
              12
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone)]/60">
              Frontend placeholder value.
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[var(--color-warm-light)]/40 p-5">
            <p className="text-xs font-medium text-[var(--color-stone)]/60 uppercase tracking-wide">
              Pending approvals
            </p>
            <p className="mt-3 text-3xl font-semibold text-[var(--color-stone)]">
              3
            </p>
            <p className="mt-1 text-xs text-[var(--color-stone)]/60">
              For UI only – no real logic yet.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-[var(--color-warm-light)]/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-[var(--color-stone)]">
                Recent listings
              </h2>
              <span className="text-xs text-[var(--color-stone)]/60">
                Demo data
              </span>
            </div>
            <ul className="divide-y divide-[var(--color-warm-light)]/30 text-sm">
              <li className="py-3 flex justify-between">
                <span>Sunny 2BR in Kreuzberg</span>
                <span className="text-[var(--color-stone)]/60">Draft</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>Penthouse near Tiergarten</span>
                <span className="text-[var(--color-stone)]/60">Published</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>Cozy studio in Mitte</span>
                <span className="text-[var(--color-stone)]/60">Pending</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-warm-light)]/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg text-[var(--color-stone)]">
                Recent staging jobs
              </h2>
              <span className="text-xs text-[var(--color-stone)]/60">
                Demo data
              </span>
            </div>
            <ul className="divide-y divide-[var(--color-warm-light)]/30 text-sm">
              <li className="py-3 flex justify-between">
                <span>Loft living room • Modern</span>
                <span className="text-[var(--color-stone)]/60">Completed</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>Altbau kitchen • Scandinavian</span>
                <span className="text-[var(--color-stone)]/60">Queued</span>
              </li>
              <li className="py-3 flex justify-between">
                <span>Bedroom • Ultra Luxury</span>
                <span className="text-[var(--color-stone)]/60">Running</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
