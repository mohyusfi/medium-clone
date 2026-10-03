import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import {
  Archive,
  ArrowLeft,
  Clock,
  Edit3,
  Loader2,
  RotateCcw,
} from 'lucide-react'
import { useServerFn } from '@tanstack/react-start'
import { toggleBlogStatusFn } from '../server/blogs'
import type { BlogWithAuthor } from '../types'

interface BlogDetailProps {
  blog: BlogWithAuthor
  isAuthor?: boolean
  currentUserId?: string | null
  onStatusChange?: (newStatus: string) => void
}

function calculateReadTime(text: string): string {
  const clean = text ? text.replace(/<[^>]+>/g, ' ').trim() : ''
  if (!clean) return '1 menit baca'
  const words = clean.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} menit baca`
}

export default function BlogDetail({
  blog,
  isAuthor = false,
  onStatusChange,
}: BlogDetailProps) {
  const navigate = useNavigate()
  const toggleBlogStatus = useServerFn(toggleBlogStatusFn)

  const [currentStatus, setCurrentStatus] = useState(blog.status)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const authorName = blog.author?.name || 'Untad Academician'
  const authorImage = blog.author?.image
  const readTime = calculateReadTime(blog.content)

  const formattedDate = new Date(
    blog.publishedAt || blog.createdAt,
  ).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const handleToggleStatus = async () => {
    setIsTogglingStatus(true)
    setActionError(null)

    const nextStatus = currentStatus === 'published' ? 'archived' : 'published'

    try {
      const res = await toggleBlogStatus({
        data: { id: blog.id, status: nextStatus },
      })
      setCurrentStatus(res.status)
      if (onStatusChange) {
        onStatusChange(res.status)
      }
    } catch (err: unknown) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Gagal memperbarui status artikel.',
      )
    } finally {
      setIsTogglingStatus(false)
    }
  }

  return (
    <article className="mx-auto w-full max-w-[740px] px-4 py-8 sm:px-6 sm:py-12">
      {/* Back button */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Author toolbar if is author */}
      {isAuthor && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[var(--color-text)]">
              Status Artikel:
            </span>
            {currentStatus === 'published' && (
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Dipublikasikan
              </span>
            )}
            {currentStatus === 'archived' && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                Non-aktif (Diarsipkan)
              </span>
            )}
            {currentStatus === 'draft' && (
              <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
                Draf
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/write"
              search={{ id: blog.id }}
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)] cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Cerita</span>
            </Link>

            {currentStatus === 'published' && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-xs font-medium text-[var(--color-destructive)] transition hover:border-[var(--color-destructive)] hover:bg-[var(--color-surface)] cursor-pointer disabled:opacity-50"
                title="Sembunyikan artikel dari feed publik"
              >
                {isTogglingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Archive className="h-3.5 w-3.5" />
                )}
                <span>Non-aktifkan</span>
              </button>
            )}

            {currentStatus === 'archived' && (
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isTogglingStatus}
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-500/20 cursor-pointer disabled:opacity-50"
                title="Publikasikan kembali artikel"
              >
                {isTogglingStatus ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
                <span>Aktifkan Kembali</span>
              </button>
            )}
          </div>

          {actionError && (
            <p className="w-full text-xs text-[var(--color-destructive)]">
              {actionError}
            </p>
          )}
        </div>
      )}

      {/* Header section */}
      <header className="mb-8">
        {blog.topic && (
          <div className="mb-3">
            <span className="inline-block rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
              {blog.topic}
            </span>
          </div>
        )}

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[var(--color-text)] leading-[1.2]">
          {blog.title}
        </h1>

        {/* Author & metadata */}
        <div className="mt-6 flex items-center justify-between border-y border-[var(--color-border)] py-4 text-xs">
          <div className="flex items-center gap-3">
            <Link
              to="/profile/$userId"
              params={{ userId: blog.userId }}
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-sm font-semibold text-[var(--color-text)] transition hover:opacity-90"
            >
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                authorName.charAt(0).toUpperCase()
              )}
            </Link>

            <div>
              <Link
                to="/profile/$userId"
                params={{ userId: blog.userId }}
                className="font-medium text-[var(--color-text)] transition hover:underline"
              >
                {authorName}
              </Link>
              <div className="mt-0.5 flex items-center gap-2 text-[var(--color-text-muted)]">
                <span>{formattedDate}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {blog.thumbnail && (
        <div className="mb-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full object-cover max-h-[480px]"
          />
        </div>
      )}

      {/* Main article content with editorial prose typography */}
      <section
        className="prose prose-neutral dark:prose-invert max-w-none text-[17px] leading-[1.75] text-[var(--color-text)] [&_h1]:font-serif [&_h2]:font-serif [&_h3]:font-serif [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-text)] [&_blockquote]:italic [&_img]:rounded-md [&_img]:border [&_img]:border-[var(--color-border)]"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Author footer box */}
      <footer className="mt-14 border-t border-[var(--color-border)] pt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/profile/$userId"
              params={{ userId: blog.userId }}
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-base font-semibold text-[var(--color-text)]"
            >
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="h-full w-full object-cover"
                />
              ) : (
                authorName.charAt(0).toUpperCase()
              )}
            </Link>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Ditulis oleh
              </p>
              <Link
                to="/profile/$userId"
                params={{ userId: blog.userId }}
                className="font-serif text-base font-bold text-[var(--color-text)] transition hover:underline"
              >
                {authorName}
              </Link>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)] cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Jelajahi Artikel Lain</span>
          </Link>
        </div>
      </footer>
    </article>
  )
}
