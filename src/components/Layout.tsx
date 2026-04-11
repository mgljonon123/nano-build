import { Link, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

function OrbixLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse
        cx="22"
        cy="16"
        rx="12"
        ry="9"
        transform="rotate(-32 22 16)"
        stroke="currentColor"
        strokeWidth="2.25"
      />
      <ellipse
        cx="28"
        cy="16"
        rx="12"
        ry="9"
        transform="rotate(32 28 16)"
        stroke="currentColor"
        strokeWidth="2.25"
      />
    </svg>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const authed = Boolean(user);
  const location = useLocation();
  const email = user?.email;

  const navLink = (to: string, label: string, active: boolean) => (
    <Link
      to={to}
      className={
        active
          ? "text-[var(--color-forest)] font-semibold"
          : "text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] transition-colors"
      }
    >
      {label}
    </Link>
  );

  return (
    <div className="flex-1 flex flex-col w-full">
      <header className="bg-white border-b border-gray-100/80 relative z-50 font-marketing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-[4.5rem] flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-[var(--color-stone)] shrink-0"
            aria-label="Home"
          >
            <OrbixLogo className="w-10 h-7" />
          </Link>
          <nav className="hidden md:flex items-center justify-center gap-6 lg:gap-10 flex-1 text-sm font-medium">
            {navLink("/", "Home", location.pathname === "/")}
            <a
              href="#about"
              className="text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] transition-colors"
            >
              About Us
            </a>
            {/* <details className="relative group">
              <summary className="list-none cursor-pointer flex items-center gap-0.5 text-[var(--color-stone)]/80 hover:text-[var(--color-stone)] transition-colors [&::-webkit-details-marker]:hidden">
                Pages
                <ChevronDown className="w-4 h-4 opacity-70" />
              </summary>
              <div className="absolute left-0 top-full pt-2 z-50 min-w-[180px]">
                <div className="rounded-xl border border-gray-100 bg-white py-2 shadow-lg text-sm">
                  <Link
                    to="/staging"
                    className="block px-4 py-2 text-[var(--color-stone)]/90 hover:bg-gray-50"
                    onClick={(e) => {
                      const details = e.currentTarget.closest("details");
                      if (details) details.removeAttribute("open");
                    }}
                  >
                    AI Staging
                  </Link>
            
                </div>
              </div>
            </details> */}
            {navLink(
              "/contact",
              "Contact Us",
              location.pathname === "/contact",
            )}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {!authed ? (
              <Link
                to="/login"
                className="hidden sm:inline text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-stone)] px-2 py-1.5"
              >
                Sign in
              </Link>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="hidden sm:inline text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-stone)]"
                >
                  Admin
                </Link>
                {email ? (
                  <span className="hidden lg:inline max-w-[140px] truncate text-xs text-[var(--color-muted)]">
                    {email}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                  className="hidden sm:inline text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-stone)]"
                >
                  Logout
                </button>
              </>
            )}
            <Link
              to="/staging"
              className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
            >
              Try AI Staging
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
