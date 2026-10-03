import test from 'node:test'
import assert from 'node:assert/strict'
import { generatePresignedUploadPath } from '../src/server/upload'

interface DraftImageItem {
  id: string
  localDataUrl: string
  filename: string
  remoteUrl?: string
}

function processDraftImageBatch(
  images: DraftImageItem[],
  uploadSimulator: (filename: string) => { path: string; publicUrl: string },
): {
  urlMap: Map<string, string>
  uploadedPaths: string[]
} {
  const urlMap = new Map<string, string>()
  const uploadedPaths: string[] = []

  for (const img of images) {
    const { path, publicUrl } = uploadSimulator(img.filename)
    urlMap.set(img.localDataUrl, publicUrl)
    uploadedPaths.push(path)
  }

  return { urlMap, uploadedPaths }
}

test('Draft Image Upload: generates sanitized paths with timestamp and webp extension', () => {
  const filename = 'diagram riset 2026!@#.png'
  const generatedPath = generatePresignedUploadPath(filename)

  assert.ok(generatedPath.startsWith('blog-images/'))
  assert.ok(generatedPath.endsWith('.webp'))
  assert.ok(!generatedPath.includes('!@#'))
  assert.ok(generatedPath.includes('diagramriset2026'))
})

test('Draft Image Upload: batch processing maps all draft images to remote URLs', () => {
  const draftImages: DraftImageItem[] = [
    {
      id: 'img-1',
      localDataUrl: 'data:image/webp;base64,DATA1',
      filename: 'figure1.png',
    },
    {
      id: 'img-2',
      localDataUrl: 'data:image/webp;base64,DATA2',
      filename: 'figure2.jpg',
    },
  ]

  const fakeUploadSimulator = (filename: string) => {
    const path = generatePresignedUploadPath(filename)
    return {
      path,
      publicUrl: `https://supabase.co/storage/v1/object/public/untad-chronicle/${path}`,
    }
  }

  const result = processDraftImageBatch(draftImages, fakeUploadSimulator)

  assert.equal(result.uploadedPaths.length, 2)
  assert.equal(result.urlMap.size, 2)
  assert.ok(result.urlMap.has('data:image/webp;base64,DATA1'))
  assert.ok(result.urlMap.has('data:image/webp;base64,DATA2'))

  const url1 = result.urlMap.get('data:image/webp;base64,DATA1')
  const url2 = result.urlMap.get('data:image/webp;base64,DATA2')

  assert.ok(
    url1?.startsWith(
      'https://supabase.co/storage/v1/object/public/untad-chronicle/blog-images/',
    ),
  )
  assert.ok(
    url2?.startsWith(
      'https://supabase.co/storage/v1/object/public/untad-chronicle/blog-images/',
    ),
  )
  assert.notEqual(url1, url2)
})

test('Draft Image Upload: preserves draft integrity when batch is empty', () => {
  const result = processDraftImageBatch([], () => ({
    path: '',
    publicUrl: '',
  }))

  assert.equal(result.uploadedPaths.length, 0)
  assert.equal(result.urlMap.size, 0)
})
