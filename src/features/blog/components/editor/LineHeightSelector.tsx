import { useState, useRef, useEffect } from 'react'
import type { Editor } from '@tiptap/react'
import { BetweenVerticalEnd, Check, ChevronDown } from 'lucide-react'

export interface LineHeightOption {
  value: string
  label: string
  approxCm: string
  description: string
}

export const LINE_HEIGHT_OPTIONS: LineHeightOption[] = [
  {
    value: '1.0',
    label: '1.0',
    approxCm: '~0.5 cm',
    description: 'Spasi Tunggal / Rapat',
  },
  {
    value: '1.15',
    label: '1.15',
    approxCm: '~0.65 cm',
    description: 'Proporsional (Default)',
  },
  {
    value: '1.5',
    label: '1.5',
    approxCm: '~0.85 cm',
    description: 'Standar Tugas & Skripsi',
  },
]

interface LineHeightSelectorProps {
  editor: Editor | null
  isCompact?: boolean
}

export default function LineHeightSelector({
  editor,
  isCompact = false,
}: LineHeightSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeLineHeight, setActiveLineHeight] = useState('1.15')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const updateActiveLineHeight = () => {
      const lh =
        editor.getAttributes('paragraph').lineHeight ||
        editor.getAttributes('heading').lineHeight ||
        '1.15'
      setActiveLineHeight(lh)
    }

    updateActiveLineHeight()

    editor.on('transaction', updateActiveLineHeight)
    editor.on('selectionUpdate', updateActiveLineHeight)

    return () => {
      editor.off('transaction', updateActiveLineHeight)
      editor.off('selectionUpdate', updateActiveLineHeight)
    }
  }, [editor])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!editor) return null

  const handleSelect = (value: string) => {
    editor.chain().focus().setLineHeight(value).run()
    setActiveLineHeight(value)
    setIsOpen(false)
  }

  const currentOption =
    LINE_HEIGHT_OPTIONS.find((opt) => opt.value === activeLineHeight) ||
    LINE_HEIGHT_OPTIONS[1]

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded text-xs transition cursor-pointer ${
          isCompact
            ? 'h-6 px-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
            : 'h-7 px-2 border border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        } ${isOpen ? 'bg-[var(--color-surface)] text-[var(--color-text)] border-[var(--color-border)]' : ''}`}
        title={`Jarak Baris: ${currentOption.label} (${currentOption.approxCm})`}
        aria-label="Pengaturan Jarak Baris"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <BetweenVerticalEnd className="h-3.5 w-3.5" />
        <span className="font-mono text-[11px] font-medium leading-none">
          {currentOption.label}
        </span>
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] py-1 shadow-md ring-1 ring-black/5 dark:ring-white/10 animate-in fade-in-0 zoom-in-95 duration-100">
          <div className="px-3 py-1.5 border-b border-[var(--color-border)] mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Jarak Baris (Line Height)
            </span>
          </div>
          {LINE_HEIGHT_OPTIONS.map((option) => {
            const isSelected = activeLineHeight === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`flex w-full items-center justify-between px-3 py-1.5 text-xs text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--color-surface)] font-medium text-[var(--color-text)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      ({option.approxCm})
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)]">
                    {option.description}
                  </span>
                </div>
                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-[var(--color-text)] shrink-0 ml-2" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
