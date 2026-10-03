import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { BookOpen, SquarePen } from 'lucide-react'
import BlogCard from './BlogCard'
import { BLOG_TOPICS } from '../types'
import type { BlogWithAuthor } from '../types'

interface BlogFeedProps {
  articles: BlogWithAuthor[]
  isLoading?: boolean
  activeTopic?: string
  onTopicChange?: (topic: string) => void
}

const FEED_TABS = [
  { id: 'all', label: 'Semua Artikel' },
  { id: 'for-you', label: 'Untuk Anda' },
  ...BLOG_TOPICS.map((topic) => ({ id: topic, label: topic })),
]

export default function BlogFeed({
  articles,
  isLoading = false,
  activeTopic: externalTopic,
  onTopicChange: externalOnChange,
}: BlogFeedProps) {
  const [internalTopic, setInternalTopic] = useState('all')

  const activeTopic =
    externalTopic !== undefined ? externalTopic : internalTopic
  const handleTopicChange = (topic: string) => {
    if (externalOnChange) {
      externalOnChange(topic)
    } else {
      setInternalTopic(topic)
    }
  }

  const filteredArticles = articles.filter((article) => {
    if (!activeTopic || activeTopic === 'all' || activeTopic === 'for-you') {
      return true
    }
    return article.topic === activeTopic
  })

  return (
    <div className="w-full">
      {/* Editorial horizontal scroll tabs */}
      <nav
        aria-label="Filter Topik Artikel"
        className="flex w-full items-center gap-5 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar scroll-smooth"
      >
        {FEED_TABS.map((tab) => {
          const isActive = activeTopic === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTopicChange(tab.id)}
              className={`relative pb-3 pt-2 text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                isActive
                  ? 'font-bold text-[var(--color-text)]'
                  : 'font-normal text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-text)]" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Loading state */}
      {isLoading ? (
        <div className="divide-y divide-[var(--color-border)] py-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="flex animate-pulse items-start justify-between gap-6 py-7"
            >
              <div className="min-w-0 flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-[var(--color-surface)]" />
                  <div className="h-3 w-28 rounded bg-[var(--color-surface)]" />
                </div>
                <div className="h-5 w-3/4 rounded bg-[var(--color-surface)]" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-full rounded bg-[var(--color-surface)]" />
                  <div className="h-3.5 w-2/3 rounded bg-[var(--color-surface)]" />
                </div>
                <div className="h-3 w-16 rounded bg-[var(--color-surface)]" />
              </div>
              <div className="h-24 w-32 shrink-0 rounded bg-[var(--color-surface)]" />
            </div>
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        /* Empty state */
        <div className="my-10 rounded border border-dashed border-[var(--color-border)] px-6 py-14 text-center">
          <BookOpen className="mx-auto h-9 w-9 text-[var(--color-text-muted)]" />
          <h3 className="mt-3 font-serif text-base font-bold text-[var(--color-text)]">
            Belum ada artikel dalam topik ini
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[var(--color-text-secondary)]">
            Jadilah yang pertama menulis atau pilih kategori topik lainnya untuk
            menjelajahi wawasan akademik terkini.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {activeTopic !== 'all' && (
              <button
                type="button"
                onClick={() => handleTopicChange('all')}
                className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)] cursor-pointer"
              >
                Lihat Semua Topik
              </button>
            )}
            <Link
              to="/write"
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-inverse)] px-4 py-1.5 text-xs font-semibold text-[var(--color-bg)] transition hover:opacity-90 cursor-pointer"
            >
              <SquarePen className="h-3.5 w-3.5" />
              <span>Tulis Artikel</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Articles list */
        <div className="flex flex-col">
          {filteredArticles.map((article) => (
            <BlogCard key={article.id} blog={article} />
          ))}
        </div>
      )}
    </div>
  )
}
