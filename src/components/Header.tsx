import { Link } from '@tanstack/react-router'
import { Search, SquarePen, Bell, Menu } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-12 w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)] px-6 sm:px-8">
      <div className="flex items-center gap-3 sm:gap-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] min-[900px]:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <Link
          to="/"
          className="font-serif text-2xl font-bold tracking-tight text-[var(--color-text)] no-underline transition-opacity hover:opacity-85"
        >
          Untad Chronicle
        </Link>

        <div className="relative hidden items-center sm:flex">
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="search"
            placeholder="Search stories, topics, authors..."
            className="h-8 w-48 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition-all focus:w-64 focus:border-[var(--color-text)] focus:bg-[var(--color-bg)] focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Search stories"
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

        <a
          href="#write"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)]"
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

        <ThemeToggle />

        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)]">
          U
        </div>
      </div>
    </header>
  )
}
