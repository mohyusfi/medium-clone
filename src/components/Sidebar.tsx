import { Link } from '@tanstack/react-router'
import {
  Home,
  Bookmark,
  User,
  BookOpen,
  Info,
  Plus,
  Compass,
} from 'lucide-react'

interface SidebarProps {
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  isRoute?: boolean
  hideOnDesktop?: boolean
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/', icon: Home, isRoute: true },
  {
    label: 'About',
    href: '/about',
    icon: Info,
    isRoute: true,
    // hideOnDesktop: true,
  },
  // { label: 'Library', href: '#library', icon: Bookmark, isRoute: false },
  // { label: 'Profile', href: '#profile', icon: User, isRoute: false },
  { label: 'Stories', href: '#stories', icon: BookOpen, isRoute: false },
]

const followingItems = [
  { name: 'Dr. Ir. Andi M.', tag: 'Untad Forestry' },
  { name: 'Palu Tech Review', tag: 'Publication' },
  { name: 'Prof. Hasan Basri', tag: 'Academician' },
  { name: 'Untad Journal IT', tag: 'Publication' },
]

export default function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const content = (
    <aside className="flex flex-col gap-6 py-6 text-sm">
      <nav aria-label="Main Navigation">
        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {navItems.map((item) => {
            const Icon = item.icon
            const liClassName = item.hideOnDesktop
              ? 'min-[900px]:hidden'
              : undefined

            if (item.isRoute) {
              return (
                <li key={item.label} className={liClassName}>
                  <Link
                    to={item.href as '/' | '/about'}
                    onClick={onCloseMobile}
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className:
                        'font-bold text-[var(--color-text)] bg-[var(--color-surface)]',
                    }}
                    inactiveProps={{
                      className:
                        'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]',
                    }}
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors no-underline"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            }

            return (
              <li key={item.label} className={liClassName}>
                <a
                  href={item.href}
                  onClick={onCloseMobile}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--color-text-secondary)] transition-colors no-underline hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-border)] pt-5">
        <div className="mb-3 px-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
            Following
          </span>
          <Link
            to="/about"
            className="text-[11px] text-[var(--color-text-muted)] hover:text-[var(--color-text)] no-underline"
          >
            Manage
          </Link>
        </div>

        <ul className="flex flex-col gap-1 list-none m-0 p-0">
          {followingItems.map((item) => (
            <li key={item.name}>
              <a
                href={`#${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs text-[var(--color-text-secondary)] no-underline transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-medium text-[var(--color-text)]">
                  {item.name.charAt(0)}
                </div>
                <div className="flex flex-col truncate">
                  <span className="truncate font-medium text-[var(--color-text)] leading-tight">
                    {item.name}
                  </span>
                  <span className="truncate text-[10px] text-[var(--color-text-muted)]">
                    {item.tag}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#discover-writers"
          className="mt-3 flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] no-underline transition hover:text-[var(--color-text)]"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Find writers & publications</span>
        </a>
      </div>

      <div className="border-t border-[var(--color-border)] pt-5">
        <a
          href="#explore"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-xs text-[var(--color-text-secondary)] no-underline transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]"
        >
          <Compass className="h-4 w-4 shrink-0" />
          <span>Explore Archives</span>
        </a>
      </div>
    </aside>
  )

  return (
    <>
      <div className="hidden min-[900px]:block w-52 shrink-0 border-r border-[var(--color-border)] pr-6">
        <div className="sticky top-16">{content}</div>
      </div>

      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex min-[900px]:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-64 max-w-[80vw] bg-[var(--color-bg)] px-4 shadow-xl border-r border-[var(--color-border)] h-full overflow-y-auto">
            <div className="pt-4">{content}</div>
          </div>
        </div>
      )}
    </>
  )
}
