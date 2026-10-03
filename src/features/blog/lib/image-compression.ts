import { createPresignedUploadUrlFn } from '#/features/blog/server/upload'

export interface CompressionOptions {
  maxDimension?: number
  quality?: number
}

export interface CompressionResult {
  blob: Blob
  file: File
  dataUrl: string
  originalSize: number
  compressedSize: number
  width: number
  height: number
}

export function calculateScaledDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      return {
        width: maxDimension,
        height: Math.round((height * maxDimension) / width),
      }
    } else {
      return {
        width: Math.round((width * maxDimension) / height),
        height: maxDimension,
      }
    }
  }
  return { width, height }
}

export async function compressImageToWebP(
  inputFile: File | Blob,
  fileName = 'image.webp',
  options: CompressionOptions = {},
): Promise<CompressionResult> {
  const { maxDimension = 1920, quality = 0.8 } = options
  const originalSize = inputFile.size

  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(inputFile)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)

      const { width, height } = calculateScaledDimensions(
        img.width,
        img.height,
        maxDimension,
      )

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Gagal menginisialisasi Canvas 2D context.'))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Gagal mengompresi gambar ke WebP.'))
            return
          }

          const baseName = fileName.replace(/\.[^/.]+$/, '')
          const finalFileName = `${baseName}.webp`
          const file = new File([blob], finalFileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          })

          const dataUrl = canvas.toDataURL('image/webp', quality)

          resolve({
            blob,
            file,
            dataUrl,
            originalSize,
            compressedSize: blob.size,
            width,
            height,
          })
        },
        'image/webp',
        quality,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Gagal memuat berkas gambar untuk dikompresi.'))
    }

    img.src = objectUrl
  })
}

export async function uploadImageWithPresignedUrl(
  inputFile: File | Blob,
  originalName = 'image.webp',
): Promise<{ url: string; compressedSize: number }> {
  const compressed = await compressImageToWebP(inputFile, originalName)

  const presigned = await createPresignedUploadUrlFn({
    data: {
      filename: compressed.file.name,
      fileType: 'image/webp',
    },
  })

  if (!presigned.signedUrl) {
    throw new Error(
      presigned.error ||
        'Gagal mendapatkan Presigned Upload URL dari penyimpanan Supabase.',
    )
  }

  const uploadRes = await fetch(presigned.signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'image/webp',
    },
    body: compressed.blob,
  })

  if (!uploadRes.ok) {
    throw new Error(
      `Unggah gambar ke Supabase Storage gagal dengan status: ${uploadRes.status}`,
    )
  }

  return {
    url: presigned.publicUrl,
    compressedSize: compressed.compressedSize,
  }
}
