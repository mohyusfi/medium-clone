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

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1 rounded text-xs transition cursor-pointer ${
          isCompact
            ? 'h-7 w-7 justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            : 'h-7 px-2 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
        } ${
          isOpen || activeLineHeight !== '1.15'
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
            : ''
        }`}
        title={`Spasi Baris: ${activeLineHeight}`}
        aria-label="Pengaturan Spasi Baris"
        aria-expanded={isOpen}
      >
        <BetweenVerticalEnd className="h-3.5 w-3.5 shrink-0" />
        {!isCompact && (
          <>
            <span className="font-mono text-[11px]">{activeLineHeight}</span>
            <ChevronDown className="h-3 w-3 opacity-60" />
          </>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 min-w-[210px] rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-1 shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100 ${
            isCompact ? 'left-0 top-full' : 'left-0 top-full'
          }`}
        >
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Spasi Baris (Line Spacing)
          </div>

          <div className="flex flex-col gap-0.5">
            {LINE_HEIGHT_OPTIONS.map((option) => {
              const isSelected = activeLineHeight === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(option.value)}
                  className={`flex w-full items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--color-surface)] font-semibold text-[var(--color-text)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-[var(--color-text)]">
                        Spasi {option.label}
                      </span>
                      <span className="rounded bg-[var(--color-surface)] px-1 py-0.2 text-[10px] font-mono text-[var(--color-text-muted)] border border-[var(--color-border)]">
                        {option.approxCm}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--color-text-muted)]">
                      {option.description}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-text)] ml-2" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
