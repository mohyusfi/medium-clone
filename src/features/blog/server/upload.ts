import { createServerFn } from '@tanstack/react-start'
import { supabase, SUPABASE_STORAGE_BUCKET } from '#/server/supabase'
import type { PresignedUrlResult } from '../types'

export type { PresignedUrlResult }

const GLOBAL_STORAGE_KEY = Symbol.for('tanstack-start:start-storage-context')
const globalObj = globalThis as Record<string | symbol, unknown>
if (globalObj[GLOBAL_STORAGE_KEY]) {
  const storeContext = globalObj[GLOBAL_STORAGE_KEY] as {
    getStore: () => unknown
  }
  const originalGetStore = storeContext.getStore.bind(storeContext)
  storeContext.getStore = () => {
    return originalGetStore() ?? { startOptions: {} }
  }
}

export function generatePresignedUploadPath(filename: string): string {
  const safeName = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(0, 30)
  return `blog-images/${Date.now()}_${safeName || 'image'}.webp`
}

export const createPresignedUploadUrlFn = createServerFn({ method: 'POST' })
  .validator((data: { filename: string; fileType?: string }) => data)
  .handler(async ({ data }): Promise<PresignedUrlResult> => {
    const { filename } = data
    const filePath = generatePresignedUploadPath(filename)

    if (!supabase) {
      throw new Error(
        'Supabase Storage tidak terkonfigurasi. Pastikan variabel lingkungan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY atau SUPABASE_ANON_KEY sudah disetel.',
      )
    }

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
    }
  })

export const uploadImageFn = createServerFn({ method: 'POST' })
  .validator(
    (data: { name: string; type: string; base64: string; path?: string }) =>
      data,
  )
  .handler(async () => {
    throw new Error(
      'Upload gambar langsung melalui Base64 dinonaktifkan (0% server bandwidth). Gunakan Presigned URL Supabase.',
    )
  })

export function extractStoragePathFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null
  try {
    const bucket = SUPABASE_STORAGE_BUCKET || 'untad-chronicle'
    const pattern = new RegExp(`(?:${bucket}|untad-chronicle)\\/([^?#]+)`)
    const match = url.match(pattern)
    return match ? decodeURIComponent(match[1]) : null
  } catch {
    return null
  }
}

export const deleteStorageFilesFn = createServerFn({ method: 'POST' })
  .validator((data: { urls: string[] }) => data)
  .handler(async ({ data }) => {
    const { urls } = data
    if (urls.length === 0) {
      return { success: true, count: 0, removed: [] }
    }

    const paths = Array.from(
      new Set(
        urls
          .map(extractStoragePathFromUrl)
          .filter((path): path is string => Boolean(path)),
      ),
    )

    if (paths.length === 0) {
      return { success: true, count: 0, removed: [] }
    }

    if (!supabase) {
      throw new Error(
        'Supabase Storage tidak terkonfigurasi. Pastikan variabel lingkungan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY atau SUPABASE_ANON_KEY sudah disetel.',
      )
    }

    const { data: removeData, error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove(paths)

    if (error) {
      throw new Error(`Gagal menghapus file dari storage: ${error.message}`)
    }

    return {
      success: true,
      count: paths.length,
      removed: paths,
      data: removeData,
    }
  })
