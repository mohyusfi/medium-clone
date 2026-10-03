import test from 'node:test'
import assert from 'node:assert/strict'
import { BLOG_TOPICS } from '../src/db/schema'
import type { BlogStatus, BlogTopic } from '../src/db/schema'
import {
  calculateNextBlogStatus,
  validateBlogInput,
  validateBlogTopic,
} from '../src/server/blogs'

export function extractStoragePathFromUrl(
  url: string,
  bucket: string = 'untad-chronicle',
): string | null {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const pathname = decodeURIComponent(parsed.pathname)
    const regex = new RegExp(
      `^/storage/v1/(?:object/(?:public/|sign/)?|s3/|render/image/public/)?${bucket}/(.+)$`,
    )
    const match = pathname.match(regex)
    if (match && match[1]) {
      return match[1]
    }

    const fallbackRegex = new RegExp(`^/?${bucket}/(.+)$`)
    const fallbackMatch = pathname.match(fallbackRegex)
    if (fallbackMatch && fallbackMatch[1]) {
      return fallbackMatch[1]
    }

    return null
  } catch {
    return null
  }
}

export function replaceLocalDataUrlsWithRemote(
  htmlContent: string,
  urlMap: Map<string, string> | Record<string, string>,
): string {
  if (!htmlContent) return ''
  const entries =
    urlMap instanceof Map
      ? Array.from(urlMap.entries())
      : Object.entries(urlMap)

  let result = htmlContent
  for (const [dataUrl, remoteUrl] of entries) {
    result = result.split(dataUrl).join(remoteUrl)
  }
  return result
}

test('extractStoragePathFromUrl: extracts relative path from public storage URL', () => {
  const publicUrl =
    'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/public/untad-chronicle/blog-images/1727938491_photo.webp'
  const extracted = extractStoragePathFromUrl(publicUrl)
  assert.equal(extracted, 'blog-images/1727938491_photo.webp')
})

test('extractStoragePathFromUrl: extracts relative path from signed URL with query tokens', () => {
  const signedUrl =
    'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/sign/untad-chronicle/blog-images/1727938491_photo.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz'
  const extracted = extractStoragePathFromUrl(signedUrl)
  assert.equal(extracted, 'blog-images/1727938491_photo.webp')
})

test('extractStoragePathFromUrl: extracts relative path from S3 compatibility endpoint', () => {
  const s3Url =
    'https://legvolvdggmssalmiojh.storage.supabase.co/storage/v1/s3/untad-chronicle/blog-images/figure-1.webp'
  const extracted = extractStoragePathFromUrl(s3Url)
  assert.equal(extracted, 'blog-images/figure-1.webp')
})

test('extractStoragePathFromUrl: decodes URI encoded path components', () => {
  const encodedUrl =
    'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/public/untad-chronicle/blog-images/untad%20campus%20lake.webp'
  const extracted = extractStoragePathFromUrl(encodedUrl)
  assert.equal(extracted, 'blog-images/untad campus lake.webp')
})

test('extractStoragePathFromUrl: handles custom buckets and nested directory structures', () => {
  const customBucketUrl =
    'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/public/custom-media/documents/2026/report.pdf'
  const extracted = extractStoragePathFromUrl(customBucketUrl, 'custom-media')
  assert.equal(extracted, 'documents/2026/report.pdf')
})

test('extractStoragePathFromUrl: returns null for invalid, non-bucket, or empty URLs', () => {
  assert.equal(extractStoragePathFromUrl(''), null)
  assert.equal(extractStoragePathFromUrl('   '), null)
  assert.equal(extractStoragePathFromUrl('invalid-url-string'), null)
  assert.equal(
    extractStoragePathFromUrl('https://example.com/other/path.webp'),
    null,
  )
  assert.equal(
    extractStoragePathFromUrl(
      'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/public/other-bucket/file.webp',
      'untad-chronicle',
    ),
    null,
  )
})

test('Image Replacement: replaces single local dataURL with remote S3/Supabase URL', () => {
  const dataUrl =
    'data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA=='
  const remoteUrl =
    'https://legvolvdggmssalmiojh.supabase.co/storage/v1/object/public/untad-chronicle/blog-images/cover.webp'
  const initialHtml = `<p>Pengenalan kampus:</p><img src="${dataUrl}" alt="Cover Untad" /><p>Akhir kata.</p>`

  const replaced = replaceLocalDataUrlsWithRemote(initialHtml, {
    [dataUrl]: remoteUrl,
  })

  assert.equal(
    replaced,
    `<p>Pengenalan kampus:</p><img src="${remoteUrl}" alt="Cover Untad" /><p>Akhir kata.</p>`,
  )
  assert.ok(!replaced.includes('data:image/webp;base64'))
  assert.ok(replaced.includes('alt="Cover Untad"'))
})

test('Image Replacement: replaces multiple distinct dataURLs and preserves other HTML attributes', () => {
  const dataUrl1 = 'data:image/webp;base64,AAA111'
  const dataUrl2 = 'data:image/webp;base64,BBB222'
  const remoteUrl1 =
    'https://supabase.co/storage/v1/object/public/untad-chronicle/blog-images/1.webp'
  const remoteUrl2 =
    'https://supabase.co/storage/v1/object/public/untad-chronicle/blog-images/2.webp'

  const html = `
    <article>
      <h2>Riset Teknologi</h2>
      <img src="${dataUrl1}" alt="Diagram 1" class="rounded-lg shadow" />
      <p>Deskripsi tengah...</p>
      <img src="${dataUrl2}" alt="Diagram 2" data-caption="Hasil Evaluasi" />
    </article>
  `

  const urlMap = new Map([
    [dataUrl1, remoteUrl1],
    [dataUrl2, remoteUrl2],
  ])

  const replaced = replaceLocalDataUrlsWithRemote(html, urlMap)

  assert.ok(!replaced.includes(dataUrl1))
  assert.ok(!replaced.includes(dataUrl2))
  assert.ok(replaced.includes(`src="${remoteUrl1}"`))
  assert.ok(replaced.includes(`src="${remoteUrl2}"`))
  assert.ok(replaced.includes('class="rounded-lg shadow"'))
  assert.ok(replaced.includes('data-caption="Hasil Evaluasi"'))
})

test('Image Replacement: replaces duplicated occurrences of the same dataURL consistently', () => {
  const dataUrl = 'data:image/webp;base64,DUPLICATE123'
  const remoteUrl =
    'https://supabase.co/storage/v1/object/public/untad-chronicle/blog-images/dup.webp'

  const html = `<img src="${dataUrl}" /><p>Teks</p><img src="${dataUrl}" />`
  const replaced = replaceLocalDataUrlsWithRemote(html, {
    [dataUrl]: remoteUrl,
  })

  assert.equal(
    replaced,
    `<img src="${remoteUrl}" /><p>Teks</p><img src="${remoteUrl}" />`,
  )
})

test('Blog Publication Validation: valid blog input with topic Teknologi and status published', () => {
  const blogData = {
    title: 'Perkembangan AI dan Machine Learning di Untad',
    topic: 'Teknologi' as BlogTopic,
    content:
      '<p>Inovasi pembelajaran berbasis komputasi modern di Tadulako.</p>',
    status: 'published' as BlogStatus,
  }

  assert.doesNotThrow(() => {
    validateBlogInput({ title: blogData.title })
  })

  assert.doesNotThrow(() => {
    validateBlogTopic(blogData.topic)
  })

  assert.ok(
    (BLOG_TOPICS as readonly string[]).includes(blogData.topic),
    'Teknologi must be an accepted topic in BLOG_TOPICS',
  )
  assert.equal(blogData.status, 'published')
  assert.ok(blogData.content.length > 0)
})

test('Blog Publication Validation: throws error when publication title is missing or whitespace', () => {
  assert.throws(
    () => {
      validateBlogInput({ title: '' })
    },
    { message: 'Judul artikel tidak boleh kosong' },
  )

  assert.throws(
    () => {
      validateBlogInput({ title: '   \n  \t ' })
    },
    { message: 'Judul artikel tidak boleh kosong' },
  )
})

test('Blog Publication Validation: throws error when publication topic is not in BLOG_TOPICS', () => {
  assert.throws(
    () => {
      validateBlogTopic('TopicSembarangan')
    },
    (err: Error) => {
      return (
        err.message.includes('Topik tidak valid: "TopicSembarangan"') &&
        err.message.includes('Pilihan topik yang valid:')
      )
    },
  )
})

test('Blog Publication Validation: status transitions maintain integrity', () => {
  assert.equal(calculateNextBlogStatus('draft', 'published'), 'published')
  assert.equal(calculateNextBlogStatus('published', 'archived'), 'archived')
  assert.equal(calculateNextBlogStatus('archived', 'published'), 'published')
  assert.equal(calculateNextBlogStatus('published'), 'archived')
  assert.equal(calculateNextBlogStatus('draft'), 'published')
})
