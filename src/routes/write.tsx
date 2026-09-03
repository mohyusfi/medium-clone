import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useId } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import LinkExtension from '@tiptap/extension-link'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Save,
  Send,
  Sliders,
  Sparkles,
  X,
} from 'lucide-react'
import EditorToolbar from '#/components/editor/EditorToolbar'
import EditorBubbleMenu from '#/components/editor/EditorBubbleMenu'
import ImageUploadModal from '#/components/editor/ImageUploadModal'
import CoverImageUploader from '#/components/editor/CoverImageUploader'
import ThemeToggle from '#/components/ThemeToggle'
import { saveBlogFn } from '#/server/blogs'
import { uploadImageFn } from '#/server/upload'

export const Route = createFileRoute('/write')({
  component: WritePage,
})

const DRAFT_STORAGE_KEY = 'untad_article_draft_v1'

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function WritePage() {
  const [isMounted, setIsMounted] = useState(false)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [isCustomSlug, setIsCustomSlug] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'draft' | 'published'>(
    'idle',
  )
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
    slug?: string
  } | null>(null)
  const [savedAtText, setSavedAtText] = useState<string>('Draf lokal siap')
  const [showSlugEditor, setShowSlugEditor] = useState(false)
  const [createdBlogId, setCreatedBlogId] = useState<number | undefined>(
    undefined,
  )

  const titleInputRef = useRef<HTMLTextAreaElement>(null)
  const slugInputId = useId()

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class:
            'text-[var(--color-text)] underline underline-offset-4 font-medium',
        },
      }),
      Placeholder.configure({
        placeholder: 'Mulai tulis artikel, catatan riset, atau opini Anda...',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[420px] text-[17px] leading-relaxed',
      },
      handleDrop: (_view, event) => {
        const files = event.dataTransfer?.files
        if (files && files.length > 0 && files[0].type.startsWith('image/')) {
          event.preventDefault()
          handleDirectImageUpload(files[0])
          return true
        }
        return false
      },
      handlePaste: (_view, event) => {
        const items = event.clipboardData?.items
        if (items) {
          for (const item of items) {
            if (item.type.startsWith('image/')) {
              const file = item.getAsFile()
              if (file) {
                event.preventDefault()
                handleDirectImageUpload(file)
                return true
              }
            }
          }
        }
        return false
      },
    },
    onUpdate: () => {
      setHasUnsavedChanges(true)
    },
  })

  const handleDirectImageUpload = async (file: File) => {
    if (!editor) return

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result as string
      try {
        const res = await uploadImageFn({
          data: {
            name: file.name,
            type: file.type,
            base64,
          },
        })
        editor.chain().focus().setImage({ src: res.url, alt: file.name }).run()
      } catch {
        editor.chain().focus().setImage({ src: base64, alt: file.name }).run()
      }
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !editor) return

    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft)
        if (parsed.title) setTitle(parsed.title)
        if (parsed.slug) {
          setSlug(parsed.slug)
          setIsCustomSlug(true)
        }
        if (parsed.coverImage) setCoverImage(parsed.coverImage)
        if (parsed.content) {
          editor.commands.setContent(parsed.content)
        }
        if (parsed.blogId) {
          setCreatedBlogId(parsed.blogId)
        }
        setSavedAtText('Draf dipulihkan dari lokal')
      }
    } catch {
      // ignore draft parse error
    }
  }, [isMounted, editor])

  useEffect(() => {
    if (!isMounted || !editor) return

    const timer = setTimeout(() => {
      try {
        const draftData = {
          title,
          slug,
          coverImage,
          content: editor.getHTML(),
          blogId: createdBlogId,
          updatedAt: new Date().toISOString(),
        }
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData))
        const timeStr = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        })
        setSavedAtText(`Tersimpan lokal ${timeStr}`)
      } catch {
        // ignore storage quota error
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [
    title,
    slug,
    coverImage,
    editor?.state.doc,
    isMounted,
    createdBlogId,
    editor,
  ])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    setHasUnsavedChanges(true)

    if (!isCustomSlug) {
      setSlug(generateSlug(newTitle))
    }

    if (titleInputRef.current) {
      titleInputRef.current.style.height = 'auto'
      titleInputRef.current.style.height = `${titleInputRef.current.scrollHeight}px`
    }
  }

  const handleInsertImage = (data: { url: string; alt?: string }) => {
    if (!editor) return
    editor.chain().focus().setImage({ src: data.url, alt: data.alt }).run()
    setHasUnsavedChanges(true)
  }

  const handleSave = async (status: 'draft' | 'published') => {
    if (!title.trim()) {
      setNotification({
        type: 'error',
        message: 'Mohon isi judul artikel sebelum menyimpan.',
      })
      titleInputRef.current?.focus()
      return
    }

    if (!editor) return

    const contentHtml = editor.getHTML()
    const finalSlug = slug.trim() || generateSlug(title)

    setIsSaving(true)
    setNotification(null)

    try {
      const res = await saveBlogFn({
        data: {
          id: createdBlogId,
          title: title.trim(),
          slug: finalSlug,
          content: contentHtml,
          thumbnail: coverImage,
          status,
        },
      })

      setCreatedBlogId(res.blogId)
      setSaveStatus(status)
      setHasUnsavedChanges(false)
      setNotification({
        type: 'success',
        message:
          status === 'published'
            ? 'Artikel berhasil dipublikasikan secara langsung!'
            : 'Draf artikel berhasil disimpan ke database.',
        slug: res.slug,
      })
    } catch (err: unknown) {
      const errMessage =
        err instanceof Error
          ? err.message
          : 'Gagal menyimpan artikel ke server.'
      setNotification({
        type: 'error',
        message: errMessage,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const editorText = editor?.getText() || ''
  const wordCount = editorText.trim()
    ? editorText.trim().split(/\s+/).length
    : 0
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--color-text-muted)]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="sticky top-0 z-30 flex h-12 w-full items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 px-4 backdrop-blur-xs sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[var(--color-text)] text-sm hidden sm:inline">
              Untad Chronicle
            </span>
            <span className="hidden sm:inline text-xs text-[var(--color-text-muted)]">
              /
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {saveStatus === 'published' ? 'Published' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>{savedAtText}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {wordCount} kata (~{readTimeMinutes} mnt)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-text)] hover:text-[var(--color-text)] cursor-pointer disabled:opacity-50"
          >
            {isSaving && saveStatus === 'draft' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span className="hidden sm:inline">Simpan Draf</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-text)] px-3.5 text-xs font-medium text-[var(--color-bg)] transition hover:opacity-90 cursor-pointer disabled:opacity-50"
          >
            {isSaving && saveStatus === 'published' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
            <span>Publikasikan</span>
          </button>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)]">
            U
          </div>
        </div>
      </header>

      {notification && (
        <div
          className={`flex items-center justify-between border-b px-4 py-2.5 sm:px-8 text-xs ${
            notification.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
              : 'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
            )}
            <span>{notification.message}</span>
            {notification.slug && (
              <Link
                to="/"
                className="ml-2 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
              >
                <span>Lihat Cerita</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="rounded p-1 hover:opacity-75 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <EditorToolbar
        editor={editor}
        onOpenImageModal={() => setIsImageModalOpen(true)}
      />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 md:py-12">
        <CoverImageUploader value={coverImage} onChange={setCoverImage} />

        <div className="mb-4">
          <textarea
            ref={titleInputRef}
            value={title}
            onChange={handleTitleChange}
            placeholder="Judul Cerita..."
            rows={1}
            className="w-full resize-none overflow-hidden bg-transparent font-serif text-3xl font-bold tracking-tight text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none sm:text-4xl md:text-5xl"
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[var(--color-text-muted)]">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
            <span className="truncate max-w-[280px] sm:max-w-md font-mono text-[11px]">
              story/{slug || 'judul-cerita'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowSlugEditor((prev) => !prev)}
            className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
          >
            <Sliders className="h-2.5 w-2.5" />
            <span>{showSlugEditor ? 'Tutup' : 'Ubah Slug'}</span>
          </button>
        </div>

        {showSlugEditor && (
          <div className="mb-6 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
            <label
              htmlFor={slugInputId}
              className="block text-xs font-medium text-[var(--color-text)]"
            >
              Kustomisasi Slug URL
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id={slugInputId}
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(generateSlug(e.target.value))
                  setIsCustomSlug(true)
                  setHasUnsavedChanges(true)
                }}
                placeholder="judul-artikel-kustom"
                className="h-8 flex-1 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 text-xs text-[var(--color-text)] focus:border-[var(--color-text)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setSlug(generateSlug(title))
                  setIsCustomSlug(false)
                }}
                className="inline-flex h-8 items-center gap-1 rounded border border-[var(--color-border)] px-2.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          <EditorBubbleMenu editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </main>

      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onInsert={handleInsertImage}
      />
    </div>
  )
}
