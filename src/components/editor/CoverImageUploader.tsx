import { useRef, useState } from 'react'
import { Image as ImageIcon, Trash2, Upload, X } from 'lucide-react'
import { uploadImageFn } from '#/server/upload'

interface CoverImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
}

export default function CoverImageUploader({
  value,
  onChange,
}: CoverImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setIsUploading(true)

    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      try {
        const res = await uploadImageFn({
          data: {
            name: file.name,
            type: file.type,
            base64,
          },
        })
        onChange(res.url)
      } catch {
        onChange(base64)
      }
    } catch {
      setErrorMessage('Gagal memproses gambar cover.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    onChange(urlInput.trim())
    setUrlInput('')
    setShowUrlInput(false)
  }

  if (value) {
    return (
      <div className="relative mb-8 w-full group">
        <div className="relative aspect-21/9 max-h-[360px] w-full overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]">
          <img
            src={value}
            alt="Cover preview"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-2 opacity-90 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/90 px-2.5 text-xs font-medium text-[var(--color-text)] shadow-xs backdrop-blur-xs transition hover:bg-[var(--color-bg)] cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Ganti Cover</span>
          </button>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/90 px-2.5 text-xs font-medium text-[var(--color-destructive)] shadow-xs backdrop-blur-xs transition hover:bg-[var(--color-bg)] cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Hapus</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    )
  }

  return (
    <div className="mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-text-secondary)] hover:text-[var(--color-text)] cursor-pointer disabled:opacity-50"
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>{isUploading ? 'Mengunggah...' : 'Tambah Cover Gambar'}</span>
        </button>

        {!showUrlInput ? (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="text-xs text-[var(--color-text-muted)] underline-offset-4 hover:underline hover:text-[var(--color-text-secondary)] cursor-pointer"
          >
            atau tempel URL
          </button>
        ) : (
          <form onSubmit={handleApplyUrl} className="flex items-center gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              autoFocus
              className="h-7 w-64 rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-2 text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-text)] focus:outline-none"
            />
            <button
              type="submit"
              className="h-7 rounded bg-[var(--color-text)] px-2.5 text-xs font-medium text-[var(--color-bg)] hover:opacity-90 cursor-pointer"
            >
              Gunakan
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-[var(--color-destructive)]">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
