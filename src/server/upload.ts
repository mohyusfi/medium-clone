import { createServerFn } from '@tanstack/react-start'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { supabase, SUPABASE_STORAGE_BUCKET } from './supabase'

export interface PresignedUrlResult {
  success: boolean
  signedUrl?: string
  token?: string
  path: string
  publicUrl: string
  isFallback?: boolean
}

export const createPresignedUploadUrlFn = createServerFn({ method: 'POST' })
  .validator((data: { filename: string; fileType?: string }) => data)
  .handler(async ({ data }) => {
    const { filename } = data
    const safeName = filename
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 30)
    const filePath = `blog-images/${Date.now()}_${safeName || 'image'}.webp`

    if (supabase) {
      const { data: signData, error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .createSignedUploadUrl(filePath)

      if (error) {
        throw new Error(`Gagal membuat presigned upload URL: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath)

      return {
        success: true,
        signedUrl: signData.signedUrl,
        token: signData.token,
        path: signData.path,
        publicUrl: publicUrlData.publicUrl,
        isFallback: false,
      } as PresignedUrlResult
    }

    return {
      success: true,
      path: filePath,
      publicUrl: `/uploads/${path.basename(filePath)}`,
      isFallback: true,
    } as PresignedUrlResult
  })

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024

export const uploadImageFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { name: string; type: string; base64: string; path?: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const { name, type, base64, path: customPath } = data

    if (!ALLOWED_MIME_TYPES[type]) {
      throw new Error(`Format file tidak didukung: ${type}`)
    }

    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new Error('Ukuran file melebihi batas maksimal 10MB')
    }

    if (supabase && customPath) {
      const { error } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(customPath, buffer, {
          contentType: type,
          upsert: true,
        })

      if (!error) {
        const { data: publicUrlData } = supabase.storage
          .from(SUPABASE_STORAGE_BUCKET)
          .getPublicUrl(customPath)

        return {
          success: true,
          url: publicUrlData.publicUrl,
        }
      }
    }

    const ext = ALLOWED_MIME_TYPES[type]
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30)
    const fileName = customPath
      ? path.basename(customPath)
      : `img_${Date.now()}_${safeName || 'upload'}.${ext}`
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')

    await fs.mkdir(uploadsDir, { recursive: true })
    const filePath = path.join(uploadsDir, fileName)
    await fs.writeFile(filePath, buffer)

    return {
      success: true,
      url: `/uploads/${fileName}`,
    }
  })
