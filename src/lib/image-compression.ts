import { createPresignedUploadUrlFn, uploadImageFn } from '#/server/upload'

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

/**
 * Compresses an image file to WebP format using HTML5 Canvas.
 * Default settings: max width/height 1920px, quality 80%.
 */
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

      let { width, height } = img

      // Scale down if larger than maxDimension while preserving aspect ratio
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Gagal menginisialisasi Canvas 2D context.'))
        return
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height)

      // Convert canvas to WebP blob
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

/**
 * Uploads an image after compressing it to WebP.
 * Requests presigned URL from backend and uploads directly to Supabase storage.
 */
export async function uploadImageWithPresignedUrl(
  inputFile: File | Blob,
  originalName = 'image.webp',
): Promise<{ url: string; compressedSize: number }> {
  const compressed = await compressImageToWebP(inputFile, originalName)

  try {
    const presigned = await createPresignedUploadUrlFn({
      data: {
        filename: compressed.file.name,
        fileType: 'image/webp',
      },
    })

    if (!presigned.isFallback && presigned.signedUrl) {
      // Upload directly to Supabase storage via PUT request
      const uploadRes = await fetch(presigned.signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'image/webp',
        },
        body: compressed.blob,
      })

      if (!uploadRes.ok) {
        throw new Error(`Upload ke storage gagal: status ${uploadRes.status}`)
      }

      return {
        url: presigned.publicUrl,
        compressedSize: compressed.compressedSize,
      }
    }

    // Fallback: direct server upload
    const res = await uploadImageFn({
      data: {
        name: compressed.file.name,
        type: 'image/webp',
        base64: compressed.dataUrl,
        path: presigned.path,
      },
    })

    return {
      url: res.url,
      compressedSize: compressed.compressedSize,
    }
  } catch {
    // Ultimate fallback if storage API fails: upload base64 to server
    const fallbackRes = await uploadImageFn({
      data: {
        name: compressed.file.name,
        type: 'image/webp',
        base64: compressed.dataUrl,
      },
    })

    return {
      url: fallbackRes.url,
      compressedSize: compressed.compressedSize,
    }
  }
}
