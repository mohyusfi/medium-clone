import { useState, useRef } from 'react'
import {
  Image as ImageIcon,
  Link as LinkIcon,
  UploadCloud,
  X,
} from 'lucide-react'
import { uploadImageFn } from '#/server/upload'

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

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file maksimal adalah 5MB')
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

    if (!file || !filePreview) {
      setErrorMessage('Silakan pilih gambar terlebih dahulu')
      return
    }

    setIsUploading(true)

    try {
      try {
        const res = await uploadImageFn({
          data: {
            name: file.name,
            type: file.type,
            base64: filePreview,
          },
        })

        onInsert({ url: res.url, alt: altText.trim() })
      } catch {
        onInsert({ url: filePreview, alt: altText.trim() })
      }
      handleClose()
    } catch {
      setErrorMessage('Gagal mengunggah gambar.')
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
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-3">
          <h3 className="text-base font-semibold text-[var(--color-text)]">
            Sisipkan Gambar
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 border-b border-[var(--color-border)] pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'upload'
                ? 'border-[var(--color-text)] text-[var(--color-text)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            <span>Unggah Berkas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 pb-2 text-xs font-medium border-b-2 transition cursor-pointer ${
              activeTab === 'url'
                ? 'border-[var(--color-text)] text-[var(--color-text)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
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
                  const selected = e.target.files?.[0]
                  if (selected) handleFileSelect(selected)
                }}
              />

              {!filePreview ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center transition hover:border-[var(--color-text-muted)] cursor-pointer"
                >
                  <UploadCloud className="h-8 w-8 text-[var(--color-text-muted)]" />
                  <p className="mt-2 text-xs font-medium text-[var(--color-text)]">
                    Klik atau seret gambar ke area ini
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                    PNG, JPG, WebP, GIF (Maks. 5MB)
                  </p>
                </div>
              ) : (
                <div className="relative rounded-lg border border-[var(--color-border)] p-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-h-48 w-full rounded object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setFilePreview(null)
                    }}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-1 text-white hover:bg-black/80 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)]">
                URL Gambar
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="mt-1 h-8 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-text)] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--color-text)]">
              Teks Alternatif (Alt Text) — Opsional
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Deskripsi singkat isi gambar..."
              className="mt-1 h-8 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-text)] focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="text-xs text-[var(--color-destructive)]">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-[var(--color-border)] pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-8 rounded-md border border-[var(--color-border)] px-3 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUploading || (activeTab === 'upload' && !file)}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[var(--color-text)] px-3.5 text-xs font-medium text-[var(--color-bg)] transition hover:opacity-90 cursor-pointer disabled:opacity-50"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{isUploading ? 'Mengunggah...' : 'Sisipkan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
