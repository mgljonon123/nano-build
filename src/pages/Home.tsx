import { Link } from "react-router-dom";

// --- Icons ---
function StagingSparkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        d="M12 3v2M12 19v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M3 12h2M19 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        strokeLinecap="round"
      />
      <path
        d="M12 8.5l1.2 2.8 3 .3-2.3 2 0.7 2.9L12 14.8 9.4 16.5l0.7-2.9-2.3-2 3-0.3L12 8.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FastIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function DesignIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  );
}

function EasyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="font-marketing text-[var(--color-stone)] flex-1 flex flex-col w-full bg-[#eee8df]">
      
      {/* 
        HERO SECTION 
        Takes full visible height minus the header. 
      */}
      <section className="w-full relative h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] min-h-[600px] overflow-hidden group">
          {/* Subtle slow zoom on the image to make it feel alive */}
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
            alt="Beautiful staged living room"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] ease-out group-hover:scale-110"
          />
          {/* Premium layered gradient: very dark at bottom to read text, subtle vignette around edges */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)]" />

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-full gap-8 max-w-7xl mx-auto">
            
            {/* Glassmorphic Badge */}
            <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-warm-light)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-warm-light)]"></span>
                </span>
               <span className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase">
                 Revolutionary AI Staging
               </span>
            </div>

            <div className="animate-slide-up delay-100 space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium text-white max-w-4xl mx-auto leading-[1.05] tracking-tight drop-shadow-lg">
                Bring empty rooms to <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#d2b48c] to-[#f5f0e8]">life.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light mt-4">
                Furnish and style bare properties before the first showing. Turn empty photos into inviting spaces in minutes.
              </p>
            </div>

            <div className="animate-fade-in delay-300 mt-4 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/staging"
                className="group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white overflow-hidden transition-all hover:scale-105 hover:bg-emerald-500 hover:shadow-[0_0_40px_rgba(5,150,105,0.4)] ring-1 ring-white/10"
              >
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                <StagingSparkIcon className="w-5 h-5 text-emerald-100 group-hover:rotate-12 transition-transform" />
                <span className="relative z-10">Try AI Staging</span>
              </Link>
            </div>

          </div>
      </section>

      {/* 
        FEATURES SECTION 
      */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[var(--color-forest)]/3 blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[var(--color-stone)] mb-6">
              Why virtually stage your property?
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-muted)]">
              Transform your empty listings into fully furnished homes that attract more buyers, sell faster, and increase the final closing price without the immense cost of traditional staging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            
            {/* Feature 1 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[var(--color-sand)] text-[var(--color-forest)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--color-forest)] group-hover:text-white transition-all duration-300">
                <FastIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-stone)] mb-3">Lightning Fast</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                No need to wait days for movers and designers. Upload a raw photo and receive a beautifully furnished room back in under 60 seconds.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[var(--color-sand)] text-[var(--color-forest)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--color-forest)] group-hover:text-white transition-all duration-300">
                <DesignIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-stone)] mb-3">Stunning Realism</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                Powered by state-of-the-art AI, the lighting, shadows, and reflections of the digital furniture perfectly match your actual room's environment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-[var(--color-sand)] text-[var(--color-forest)] flex items-center justify-center group-hover:scale-110 group-hover:bg-[var(--color-forest)] group-hover:text-white transition-all duration-300">
                <EasyIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-stone)] mb-3">20+ Premium Styles</h3>
              <p className="text-[var(--color-muted)] leading-relaxed">
                From Minimalist Scandinavian to Parisian Chic, instantly swap between world-class interior design styles to match your target demographic.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      {/* 
        FOOTER (Simple Minimal Footer)
      */}
      <footer className="mt-auto border-t border-gray-200 bg-white py-10 px-4 text-center">
        <p className="text-sm text-[var(--color-muted)]">
          © {new Date().getFullYear()} Stay Real Estate & AI Staging. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
