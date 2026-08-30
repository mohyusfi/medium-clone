import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[var(--color-border)] py-8 text-xs text-[var(--color-text-muted)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="m-0">
          &copy; {year} Untad Chronicle. An editorial reading experience.
        </p>
        <div className="flex items-center gap-4">
          <Link to="/" className="no-underline hover:text-[var(--color-text)]">
            Home
          </Link>
          <Link
            to="/about"
            className="no-underline hover:text-[var(--color-text)]"
          >
            About
          </Link>
          <a
            href="https://tanstack.com/start"
            target="_blank"
            rel="noreferrer"
            className="no-underline hover:text-[var(--color-text)]"
          >
            TanStack Start
          </a>
        </div>
      </div>
    </footer>
  )
}
