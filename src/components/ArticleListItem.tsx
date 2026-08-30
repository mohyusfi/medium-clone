import { Bookmark, Sparkles, MessageCircle, MoreHorizontal } from 'lucide-react'

export interface ArticleItem {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  author: {
    name: string
    avatar?: string
    publication?: string
  }
  topic?: string
  stars?: number | string
  comments?: number
  thumbnail?: string
  isMemberOnly?: boolean
}

interface ArticleListItemProps {
  article: ArticleItem
}

export default function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <article className="group flex flex-row items-start justify-between gap-4 border-b border-[var(--color-border)] py-6 sm:gap-6 sm:py-8">
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[10px] font-semibold text-[var(--color-text)]">
              {article.author.avatar ? (
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                article.author.name.charAt(0)
              )}
            </div>
            <span className="truncate font-medium text-[var(--color-text)]">
              {article.author.name}
            </span>
            {article.author.publication && (
              <>
                <span className="text-[var(--color-text-muted)]">in</span>
                <span className="truncate font-medium text-[var(--color-text)]">
                  {article.author.publication}
                </span>
              </>
            )}
            <span className="text-[var(--color-text-muted)]">·</span>
            <span className="shrink-0 text-[var(--color-text-muted)]">
              {article.date}
            </span>
          </div>

          <a
            href={`#article-${article.id}`}
            className="group/title block no-underline"
          >
            <h2 className="mb-1.5 font-serif text-base font-bold leading-snug text-[var(--color-text)] transition-colors group-hover/title:text-[var(--color-text-secondary)] sm:text-xl md:text-[22px]">
              {article.title}
            </h2>
            <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
              {article.description}
            </p>
          </a>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {article.isMemberOnly && (
              <span
                className="inline-flex items-center text-[var(--color-accent)]"
                title="Member-only story"
              >
                <Sparkles className="h-3.5 w-3.5 fill-[var(--color-accent)]" />
              </span>
            )}
            <span>{article.readTime}</span>
            {article.topic && (
              <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--color-text-secondary)]">
                {article.topic}
              </span>
            )}
            {article.stars && (
              <span className="hidden items-center gap-1 min-[480px]:inline-flex">
                <span>★</span> {article.stars}
              </span>
            )}
            {typeof article.comments === 'number' && (
              <span className="hidden items-center gap-1 min-[480px]:inline-flex">
                <MessageCircle className="h-3.5 w-3.5" />
                {article.comments}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Bookmark story"
              className="rounded p-1 text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="More options"
              className="rounded p-1 text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {article.thumbnail && (
        <div className="shrink-0 self-start sm:self-center">
          <a
            href={`#article-${article.id}`}
            className="block overflow-hidden rounded-[3px] border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <img
              src={article.thumbnail}
              alt=""
              className="h-16 w-20 object-cover transition-transform duration-300 group-hover:scale-105 min-[400px]:h-20 min-[400px]:w-28 sm:h-24 sm:w-36 md:h-28 md:w-40"
              loading="lazy"
            />
          </a>
        </div>
      )}
    </article>
  )
}
