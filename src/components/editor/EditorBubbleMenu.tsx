import { useEffect, useState, useRef } from 'react'
import type { Editor } from '@tiptap/react'
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  Quote,
  Strikethrough,
  Underline as UnderlineIcon,
} from 'lucide-react'

interface EditorBubbleMenuProps {
  editor: Editor | null
}

export default function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editor) return

    const updateMenu = () => {
      const { state, view } = editor
      const { selection } = state

      if (selection.empty || !view.hasFocus()) {
        setIsVisible(false)
        return
      }

      const nativeSelection = window.getSelection()
      if (!nativeSelection || nativeSelection.rangeCount === 0) {
        setIsVisible(false)
        return
      }

      const range = nativeSelection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      if (rect.width === 0 || rect.height === 0) {
        setIsVisible(false)
        return
      }

      const menuWidth = menuRef.current?.offsetWidth || 260
      const left = Math.max(
        12,
        Math.min(
          window.innerWidth - menuWidth - 12,
          rect.left + rect.width / 2 - menuWidth / 2,
        ),
      )
      const top = Math.max(10, rect.top - 44)

      setPosition({ top, left })
      setIsVisible(true)
    }

    editor.on('selectionUpdate', updateMenu)
    editor.on('blur', () => {
      setTimeout(() => {
        if (!menuRef.current?.contains(document.activeElement)) {
          setIsVisible(false)
        }
      }, 150)
    })

    return () => {
      editor.off('selectionUpdate', updateMenu)
    }
  }, [editor])

  if (!editor || !isVisible) return null

  const handleSetLink = () => {
    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Masukkan alamat URL tautan:', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    const formattedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: formattedUrl })
      .run()
  }

  return (
    <div
      ref={menuRef}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-1 shadow-lg backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('bold')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Bold"
      >
        <Bold className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('italic')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Italic"
      >
        <Italic className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('underline')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Underline"
      >
        <UnderlineIcon className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('strike')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Strikethrough"
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </button>

      <div className="mx-0.5 h-3.5 w-px bg-[var(--color-border)]" />

      <button
        type="button"
        onClick={handleSetLink}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('link')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Link"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Subheading"
      >
        <Heading2 className="h-3.5 w-3.5" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
          editor.isActive('blockquote')
            ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold'
            : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
        }`}
        title="Quote"
      >
        <Quote className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
