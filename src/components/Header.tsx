import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Bell,
  LogOut,
  Menu,
  Search,
  Shield,
  SquarePen,
  User,
  X,
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { authClient } from '@/lib/auth-client'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsUserMenuOpen(false)
          navigate({ to: '/' })
        },
      },
    })
  }

  return (
    <header className="sticky top-0 z-40 flex h-12 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex h-full w-full max-w-[1340px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {isMobileSearchOpen ? (
          <div className="flex h-full w-full items-center gap-2 sm:hidden">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--color-text-muted)]" />
              <input
                type="search"
                autoFocus
                placeholder="Cari artikel, topik, penulis..."
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsMobileSearchOpen(false)
                  }
                }}
                className="h-8 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-colors focus:border-[var(--color-text-secondary)] focus:bg-[var(--color-bg)] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              aria-label="Tutup pencarian"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  aria-label="Buka menu navigasi"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] min-[900px]:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}

              <Link
                to="/"
                className="truncate font-serif text-lg font-bold tracking-tight text-[var(--color-text)] no-underline transition-opacity hover:opacity-85 sm:text-xl md:text-2xl"
              >
                Untad Chronicle
              </Link>
            </div>

            <div className="hidden min-w-0 flex-1 items-center justify-center px-4 sm:flex">
              <div className="relative w-full max-w-[280px] md:max-w-[360px] lg:max-w-[420px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  type="search"
                  placeholder="Cari artikel, topik, penulis..."
                  className="h-8 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-text-secondary)] focus:bg-[var(--color-bg)] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Pencarian artikel"
                className="inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] sm:hidden"
              >
                <Search className="h-4 w-4" />
              </button>

              <Link
                to="/about"
                className="hidden text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)] min-[900px]:inline-block"
              >
                About
              </Link>

              {user ? (
                <Link
                  to="/write"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)]"
                >
                  <SquarePen className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)]"
                >
                  <SquarePen className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Link>
              )}

              {user && (
                <button
                  type="button"
                  aria-label="Notifikasi"
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                </button>
              )}

              <ThemeToggle />

              {!isPending && !user && (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)]"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-flex items-center rounded-full bg-[var(--color-inverse)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-bg)] transition hover:opacity-90"
                  >
                    Get started
                  </Link>
                </div>
              )}

              {user && (
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="Menu akun pengguna"
                    className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)] transition hover:border-[var(--color-text-secondary)] cursor-pointer"
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded border border-[var(--color-border)] bg-[var(--color-bg)] py-1.5 shadow-sm">
                      <div className="border-b border-[var(--color-border)] px-4 py-2.5">
                        <div className="truncate text-xs font-semibold text-[var(--color-text)]">
                          {user.name}
                        </div>
                        <div className="truncate text-[11px] text-[var(--color-text-secondary)]">
                          {user.email}
                        </div>
                        {user.role === 'admin' && (
                          <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text)]">
                            <Shield className="h-3 w-3 text-[var(--color-accent)]" />
                            <span>Administrator</span>
                          </div>
                        )}
                      </div>

                      <div className="py-1">
                        <Link
                          to="/write"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-text)] transition hover:bg-[var(--color-surface)]"
                        >
                          <SquarePen className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                          <span>Tulis Cerita</span>
                        </Link>
                        <Link
                          to="/"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-[var(--color-text)] transition hover:bg-[var(--color-surface)]"
                        >
                          <User className="h-3.5 w-3.5 text-[var(--color-text-secondary)]" />
                          <span>Profil Saya</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-left text-xs text-[var(--color-destructive)] transition hover:bg-[var(--color-surface)] cursor-pointer"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>Keluar (Sign Out)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}
