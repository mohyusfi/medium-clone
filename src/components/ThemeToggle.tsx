import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export type ThemeMode = 'light' | 'dark' | 'auto'

export function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto'
  }

  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored
  }

  return 'auto'
}

export function applyThemeMode(mode: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const resolved = mode === 'auto' ? (prefersDark ? 'dark' : 'light') : mode

  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add(resolved)

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', mode)
  }

  document.documentElement.style.colorScheme = resolved
}

export function setTheme(nextMode: ThemeMode) {
  applyThemeMode(nextMode)
  window.localStorage.setItem('theme', nextMode)
  window.dispatchEvent(new CustomEvent('themechange', { detail: nextMode }))
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    const initialMode = getInitialMode()
    setMode(initialMode)
    applyThemeMode(initialMode)

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeMode>
      setMode(customEvent.detail)
    }

    window.addEventListener('themechange', handleThemeChange)
    return () => {
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [])

  useEffect(() => {
    if (mode !== 'auto') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemeMode('auto')

    media.addEventListener('change', onChange)
    return () => {
      media.removeEventListener('change', onChange)
    }
  }, [mode])

  function toggleMode() {
    const nextMode: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light'
    setMode(nextMode)
    setTheme(nextMode)
  }

  const label =
    mode === 'auto' ? 'Mode tema: otomatis (sistem)' : `Mode tema: ${mode}`

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] transition hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
    >
      {mode === 'light' ? (
        <Sun className="h-4 w-4" />
      ) : mode === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Monitor className="h-4 w-4" />
      )}
    </button>
  )
}
