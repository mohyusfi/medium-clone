import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'
import { ArrowLeft, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await authClient.signIn.email({
        email,
        password,
      })

      if (res.error) {
        setError(
          res.error.message ||
            'Login gagal. Periksa kembali email dan password.',
        )
      } else {
        navigate({ to: '/' })
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Terjadi kesalahan saat masuk.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <header className="flex h-14 w-full items-center justify-between border-b border-[var(--color-border)] px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke beranda</span>
        </Link>
        <Link
          to="/"
          className="font-serif text-lg font-bold tracking-tight text-[var(--color-text)] no-underline"
        >
          Untad Chronicle
        </Link>
        <div className="w-16" />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-text)]">
              Selamat datang kembali
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Masuk untuk membaca, menulis, dan berinteraksi di Untad Chronicle.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-6 border-l-2 border-[var(--color-destructive)] bg-[var(--color-surface)] px-4 py-3 text-xs text-[var(--color-destructive)]"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-[var(--color-text-secondary)]"
              >
                Alamat Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@untad.ac.id"
                className="mt-1.5 h-10 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition focus:border-[var(--color-text)] focus:bg-[var(--color-bg)] focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-[var(--color-text-secondary)]"
                >
                  Kata Sandi
                </label>
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-10 w-full rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)] transition focus:border-[var(--color-text)] focus:bg-[var(--color-bg)] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-10 w-full items-center justify-center rounded-full bg-[var(--color-inverse)] text-xs font-semibold text-[var(--color-bg)] transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Sedang memproses...</span>
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-text-secondary)]">
            Belum memiliki akun?{' '}
            <Link
              to="/register"
              className="font-medium text-[var(--color-text)] underline underline-offset-2 hover:opacity-80"
            >
              Daftar sekarang
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
