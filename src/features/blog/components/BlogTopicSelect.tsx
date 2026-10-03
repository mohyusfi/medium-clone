import { useId } from 'react'
import { Tag } from 'lucide-react'
import { BLOG_TOPICS } from '../types'
import type { BlogTopic } from '../types'

interface BlogTopicSelectProps {
  value?: string | null
  onChange: (topic: BlogTopic | null) => void
  disabled?: boolean
  className?: string
  id?: string
}

export default function BlogTopicSelect({
  value,
  onChange,
  disabled = false,
  className = '',
  id: customId,
}: BlogTopicSelectProps) {
  const generatedId = useId()
  const selectId = customId || generatedId

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor={selectId} className="sr-only">
        Pilih Kategori Topik Artikel
      </label>
      <div className="pointer-events-none absolute left-3 flex items-center text-[var(--color-text-muted)]">
        <Tag className="h-3.5 w-3.5" />
      </div>
      <select
        id={selectId}
        value={value || ''}
        disabled={disabled}
        onChange={(e) => {
          const val = e.target.value
          onChange(val ? (val as BlogTopic) : null)
        }}
        className="h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-8 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)] focus:border-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-text)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer appearance-none"
      >
        <option value="">Pilih Topik (Opsional)</option>
        {BLOG_TOPICS.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2.5 flex items-center text-[var(--color-text-muted)]">
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  )
}
