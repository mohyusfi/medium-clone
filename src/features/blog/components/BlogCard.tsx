import { Link } from '@tanstack/react-router'
import type { BlogWithAuthor } from '../types'

interface BlogCardProps {
  blog: BlogWithAuthor
}

function extractTextSnippet(htmlContent: string, maxLength = 160): string {
  if (!htmlContent) return ''
  const clean = htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= maxLength) return clean
  return `${clean.slice(0, maxLength)}...`
}

function calculateReadTime(text: string): string {
  const clean = text.replace(/<[^>]+>/g, ' ').trim()
  if (!clean) return '1 menit'
  const words = clean.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min baca`
}

function formatBlogDate(dateValue?: Date | string | null): string {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BlogCard({ blog }: BlogCardProps) {
  const authorName = blog.author?.name || 'Untad Academician'
  const authorImage = blog.author?.image
  const snippet = extractTextSnippet(blog.content)
  const dateFormatted = formatBlogDate(blog.publishedAt || blog.createdAt)
  const readTime = calculateReadTime(blog.content)

  return (
    <article className="group flex flex-row items-start justify-between gap-4 border-b border-[var(--color-border)] py-6 sm:gap-6 sm:py-7 transition-colors">
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          {/* Author header */}
          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <Link
              to="/profile/$userId"
              params={{ userId: blog.userId }}
              className="flex items-center gap-2 transition hover:text-[var(--color-text)]"
            >
              <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-semibold text-[var(--color-text)]">
                {authorImage ? (
                  <img
                    src={authorImage}
                    alt={authorName}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  authorName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="truncate font-medium text-[var(--color-text)]">
                {authorName}
              </span>
            </Link>

            {dateFormatted && (
              <>
                <span className="text-[var(--color-text-muted)]">·</span>
                <span className="shrink-0 text-[var(--color-text-muted)]">
                  {dateFormatted}
                </span>
              </>
            )}
          </div>

          {/* Title and snippet */}
          <Link
            to="/story/$slug"
            params={{ slug: blog.slug }}
            className="group/title block no-underline"
          >
            <h2 className="mb-1.5 font-serif text-lg font-bold leading-snug tracking-tight text-[var(--color-text)] transition-colors group-hover/title:underline sm:text-xl">
              {blog.title}
            </h2>
            {snippet && (
              <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                {snippet}
              </p>
            )}
          </Link>
        </div>

        {/* Footer meta */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
          <span>{readTime}</span>
          {blog.topic && (
            <span className="rounded-full bg-[var(--color-surface)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
              {blog.topic}
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail */}
      {blog.thumbnail && (
        <Link
          to="/story/$slug"
          params={{ slug: blog.slug }}
          className="h-20 w-24 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface)] transition group-hover:opacity-95 sm:h-24 sm:w-32"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </Link>
      )}
    </article>
  )
}
