import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Bell,
  Bookmark,
  Info,
  Menu,
  Monitor,
  Moon,
  Search,
  SquarePen,
  Sun,
  User,
  X,
} from 'lucide-react'
import type { ThemeMode } from './ThemeToggle'
import ThemeToggle, { getInitialMode, setTheme } from './ThemeToggle'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('auto')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrentTheme(getInitialMode())
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>
      setCurrentTheme(customEvent.detail)
    }
    window.addEventListener('themechange', handleThemeChange)
    return () => {
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [])

  useEffect(() => {
    if (!isProfileOpen) return

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isProfileOpen])

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
                placeholder="Search stories, topics, authors..."
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
              aria-label="Close search"
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
                  aria-label="Toggle navigation menu"
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
                  placeholder="Search stories, topics, authors..."
                  className="h-8 w-full rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-colors duration-150 focus:border-[var(--color-text-secondary)] focus:bg-[var(--color-bg)] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(true)}
                aria-label="Search stories"
                className="inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] sm:hidden"
              >
                <Search className="h-4 w-4" />
              </button>

              <a
                href="#write"
                className="hidden items-center gap-1.5 text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)] min-[900px]:inline-flex"
              >
                <SquarePen className="h-4 w-4" />
                <span className="hidden sm:inline">Write</span>
              </a>

              <button
                type="button"
                aria-label="Notifications"
                className="relative inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              </button>

              <div className="hidden min-[900px]:inline-flex">
                <ThemeToggle />
              </div>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  aria-label="Toggle profile menu"
                  aria-expanded={isProfileOpen}
                  className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)] transition hover:border-[var(--color-text)] focus:outline-none cursor-pointer"
                >
                  U
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2 shadow-lg z-50">
                    <div className="border-b border-[var(--color-border)] px-3 pb-2.5 pt-1">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)]">
                          U
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-xs font-semibold text-[var(--color-text)]">
                            Untad Academician
                          </span>
                          <span className="truncate text-[11px] text-[var(--color-text-muted)]">
                            member@untad.ac.id
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <a
                        href="#write"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center md:hidden gap-2.5 px-3 py-2 text-xs text-[var(--color-text-secondary)] no-underline transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                      >
                        <SquarePen className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                        <span>Write</span>
                      </a>

                      <a
                        href="#profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--color-text-secondary)] no-underline transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                      >
                        <User className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                        <span>Profile</span>
                      </a>

                      <a
                        href="#library"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-[var(--color-text-secondary)] no-underline transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                      >
                        <Bookmark className="h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                        <span>Library</span>
                      </a>
                    </div>

                    <div className="border-t border-[var(--color-border)] mt-1 px-3 pt-2.5 pb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Appearance
                      </span>
                      <div className="mt-1.5 grid grid-cols-3 gap-1 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
                        <button
                          type="button"
                          onClick={() => setTheme('light')}
                          className={`flex items-center justify-center gap-1 rounded py-1 text-[11px] font-medium transition cursor-pointer ${
                            currentTheme === 'light'
                              ? 'bg-[var(--color-bg)] text-[var(--color-text)] shadow-xs font-semibold'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          <Sun className="h-3 w-3" />
                          <span>Light</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`flex items-center justify-center gap-1 rounded py-1 text-[11px] font-medium transition cursor-pointer ${
                            currentTheme === 'dark'
                              ? 'bg-[var(--color-bg)] text-[var(--color-text)] shadow-xs font-semibold'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          <Moon className="h-3 w-3" />
                          <span>Dark</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('auto')}
                          className={`flex items-center justify-center gap-1 rounded py-1 text-[11px] font-medium transition cursor-pointer ${
                            currentTheme === 'auto'
                              ? 'bg-[var(--color-bg)] text-[var(--color-text)] shadow-xs font-semibold'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                          }`}
                        >
                          <Monitor className="h-3 w-3" />
                          <span>Auto</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
