import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <aside
      aria-label="Announcement"
      className="relative z-50 w-full border-b border-black/10 bg-[var(--color-accent)] text-xs text-black"
    >
      <div className="mx-auto flex h-10 w-full max-w-[1340px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap pr-2">
          <span className="inline-flex items-center gap-1 rounded bg-black/10 px-1.5 py-0.5 font-semibold text-[11px]">
            <Sparkles className="h-3 w-3" /> Welcome Offer
          </span>
          <span className="hidden sm:inline">
            Get unlimited access to quality journalism and editorial essays.
          </span>
          <span className="sm:hidden">Unlimited editorial access.</span>
          <a
            href="#pricing"
            className="font-bold underline underline-offset-2 transition-opacity hover:opacity-80"
          >
            Upgrade now
          </a>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
          className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-black/70 transition hover:bg-black/10 hover:text-black"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  )
}
