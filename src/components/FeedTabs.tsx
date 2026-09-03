interface FeedTabsProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  tabs?: { id: string; label: string }[]
}

const defaultTabs = [
  { id: 'for-you', label: 'For you' },
  { id: 'following', label: 'Following' },
]

export default function FeedTabs({
  activeTab,
  onTabChange,
  tabs = defaultTabs,
}: FeedTabsProps) {
  return (
    <div className="flex w-full items-center gap-6 border-b border-[var(--color-border)] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-3 pt-2 text-sm whitespace-nowrap transition-colors ${
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
    </div>
  )
}
