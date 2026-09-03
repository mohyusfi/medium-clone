import type { Editor } from '@tiptap/react'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Terminal,
  Underline as UnderlineIcon,
  Undo,
  Unlink,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor | null
  onOpenImageModal: () => void
}

export default function EditorToolbar({
  editor,
  onOpenImageModal,
}: EditorToolbarProps) {
  if (!editor) return null

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
    <div className="sticky top-12 z-20 flex w-full flex-wrap items-center justify-between gap-1 border-y border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 py-1.5 backdrop-blur-xs sm:px-8">
      <div className="flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('paragraph') &&
            !editor.isActive('heading') &&
            !editor.isActive('blockquote')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Paragraf"
          aria-label="Paragraf"
        >
          <Pilcrow className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Judul 1 (Heading 1)"
          aria-label="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Judul 2 (Heading 2)"
          aria-label="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Judul 3 (Heading 3)"
          aria-label="Heading 3"
        >
          <Heading3 className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Tebal (Ctrl+B)"
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Miring (Ctrl+I)"
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('underline')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Garis Bawah (Ctrl+U)"
          aria-label="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('strike')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Coret"
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('code')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Kode Inline"
          aria-label="Inline Code"
        >
          <Code className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('blockquote')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Kutipan (Blockquote)"
          aria-label="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('codeBlock')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Blok Kode"
          aria-label="Code Block"
        >
          <Terminal className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Daftar Poin"
          aria-label="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Daftar Nomor"
          aria-label="Ordered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-xs text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
          title="Garis Pembatas"
          aria-label="Horizontal Rule"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <div className="mx-1 h-4 w-px bg-[var(--color-border)]" />

        <button
          type="button"
          onClick={handleSetLink}
          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs transition cursor-pointer ${
            editor.isActive('link')
              ? 'bg-[var(--color-surface)] text-[var(--color-text)] font-semibold ring-1 ring-[var(--color-border)]'
              : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]'
          }`}
          title="Sisipkan Tautan"
          aria-label="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="inline-flex h-7 w-7 items-center justify-center rounded text-xs text-[var(--color-destructive)] transition hover:bg-[var(--color-surface)] cursor-pointer"
            title="Hapus Tautan"
            aria-label="Unlink"
          >
            <Unlink className="h-3.5 w-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenImageModal}
          className="inline-flex h-7 items-center gap-1 rounded px-2 text-xs font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
          title="Sisipkan Gambar"
          aria-label="Insert Image"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Gambar</span>
        </button>
      </div>

      <div className="hidden sm:flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-xs text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Batal (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="inline-flex h-7 w-7 items-center justify-center rounded text-xs text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          title="Ulangi (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
