import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'node:fs'
import path from 'node:path'

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export const uploadImageFn = createServerFn({ method: 'POST' })
  .validator((data: { name: string; type: string; base64: string }) => data)
  .handler(async ({ data }) => {
    const { name, type, base64 } = data

    if (!ALLOWED_MIME_TYPES[type]) {
      throw new Error(`Format file tidak didukung: ${type}`)
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error('Ukuran file melebihi batas maksimal 5MB')
    }

    const ext = ALLOWED_MIME_TYPES[type]
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30)
    const fileName = `img_${Date.now()}_${safeName || 'upload'}.${ext}`
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')

    await fs.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    return {
      success: true,
      url: `/uploads/${fileName}`,
    }
  })
