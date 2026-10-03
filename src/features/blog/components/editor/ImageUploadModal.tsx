import { useState, useRef } from 'react'
import {
  Image as ImageIcon,
  Link as LinkIcon,
  UploadCloud,
  X,
} from 'lucide-react'
import { uploadImageWithPresignedUrl } from '#/features/blog/lib/image-compression'

interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (data: { url: string; alt?: string }) => void
}

export default function ImageUploadModal({
  isOpen,
  onClose,
  onInsert,
}: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setErrorMessage('Harap pilih file gambar (JPEG, PNG, WebP, GIF)')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal adalah 10MB')
      return
    }

    setErrorMessage(null)
    setFile(selectedFile)

    const reader = new FileReader()
    reader.onload = () => {
      setFilePreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0] as File | undefined
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (activeTab === 'url') {
      if (!imageUrl.trim()) {
        setErrorMessage('URL gambar tidak boleh kosong')
        return
      }
      onInsert({ url: imageUrl.trim(), alt: altText.trim() })
      handleClose()
      return
    }

    if (!file) {
      setErrorMessage('Silakan pilih gambar terlebih dahulu')
      return
    }

    setIsUploading(true)

    try {
      const res = await uploadImageWithPresignedUrl(file, file.name)
      onInsert({ url: res.url, alt: altText.trim() })
      handleClose()
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Gagal mengompresi dan mengunggah gambar.'
      setErrorMessage(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setFilePreview(null)
    setImageUrl('')
    setAltText('')
    setErrorMessage(null)
    setIsUploading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        <button
          type="button"
          onClick={handleClose}
          disabled={isUploading}
          className="absolute right-4 top-4 rounded-md p-1 text-[var(--color-text-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-text)] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="font-serif text-lg font-bold text-[var(--color-text)]">
          Sisipkan Gambar
        </h3>

        {/* Tab switcher */}
        <div className="mt-4 flex border-b border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('upload')
              setErrorMessage(null)
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[var(--color-text)] text-[var(--color-text)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Unggah dari Perangkat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('url')
              setErrorMessage(null)
            }}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-medium transition cursor-pointer ${
              activeTab === 'url'
                ? 'border-[var(--color-text)] text-[var(--color-text)]'
                : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
            }`}
          >
            <LinkIcon className="h-4 w-4" />
            <span>Tautan URL</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {activeTab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                }}
              />

              {!filePreview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] p-8 text-center transition hover:border-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]/50 cursor-pointer"
                >
                  <ImageIcon className="h-8 w-8 text-[var(--color-text-muted)]" />
                  <p className="mt-2 text-xs font-medium text-[var(--color-text)]">
                    Klik atau seret gambar ke sini
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                    Otomatis dikompresi ke WebP (maks 1920px, kualitas 80%)
                  </p>
                </div>
              ) : (
                <div className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
                  <div className="flex max-h-48 items-center justify-center p-2">
                    <img
                      src={filePreview}
                      alt="Pratinjau"
                      className="max-h-44 object-contain rounded"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setFilePreview(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
                URL Gambar
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="mt-1.5 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-text)] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
              Teks Alternatif (Alt text)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Deskripsi gambar untuk aksesibilitas..."
              className="mt-1.5 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-text)] focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-[var(--color-destructive)]">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUploading}
              className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface)] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading || (activeTab === 'upload' && !file)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-text)] px-4 py-1.5 text-xs font-medium text-[var(--color-bg)] transition hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-bg)] border-t-transparent" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <span>Sisipkan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
