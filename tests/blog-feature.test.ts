import test from 'node:test'
import assert from 'node:assert/strict'
import { AsyncLocalStorage } from 'node:async_hooks'
import { BLOG_TOPICS, blogs } from '../src/db/schema'
import type { BlogStatus, BlogTopic } from '../src/db/schema'
import {
  calculateNextBlogStatus,
  getBlogByIdFn,
  getBlogBySlugFn,
  getPublishedBlogsFn,
  saveBlogFn,
  toggleBlogStatusFn,
  validateBlogInput,
  validateBlogTopic,
} from '../src/server/blogs'

test('Database Schema: blogs table has topic column', () => {
  assert.ok(blogs.topic, 'blogs.topic column should exist in schema')
  assert.equal(typeof blogs.topic, 'object')
})

test('Database Schema: BLOG_TOPICS definition and BlogTopic types', () => {
  assert.ok(Array.isArray(BLOG_TOPICS), 'BLOG_TOPICS must be an array')
  assert.equal(
    BLOG_TOPICS.length,
    8,
    'BLOG_TOPICS must have 8 standardized topics',
  )
  assert.ok(
    (BLOG_TOPICS as readonly string[]).includes('Software Engineering'),
    'Software Engineering should be in BLOG_TOPICS',
  )
  assert.ok(
    (BLOG_TOPICS as readonly string[]).includes('Data Science'),
    'Data Science should be in BLOG_TOPICS',
  )
  assert.ok(
    (BLOG_TOPICS as readonly string[]).includes('Riset Untad'),
    'Riset Untad should be in BLOG_TOPICS',
  )

  const sampleTopic: BlogTopic = 'Software Engineering'
  assert.equal(sampleTopic, 'Software Engineering')
})

test('Database Schema: BlogStatus union support', () => {
  const validStatuses: BlogStatus[] = ['draft', 'published', 'archived']
  assert.equal(validStatuses.length, 3)

  const sampleBlog = {
    id: 1,
    title: 'Test Article',
    slug: 'test-article',
    status: 'archived' as BlogStatus,
    topic: 'Software Engineering',
  }
  assert.equal(sampleBlog.status, 'archived')
  assert.equal(sampleBlog.topic, 'Software Engineering')
})

test('Database Schema: blogs table has required columns', () => {
  assert.ok(blogs.id, 'blogs.id should exist')
  assert.ok(blogs.userId, 'blogs.userId should exist')
  assert.ok(blogs.title, 'blogs.title should exist')
  assert.ok(blogs.slug, 'blogs.slug should exist')
  assert.ok(blogs.content, 'blogs.content should exist')
  assert.ok(blogs.status, 'blogs.status should exist')
  assert.ok(blogs.thumbnail, 'blogs.thumbnail should exist')
  assert.ok(blogs.topic, 'blogs.topic should exist')
  assert.ok(blogs.publishedAt, 'blogs.publishedAt should exist')
  assert.ok(blogs.createdAt, 'blogs.createdAt should exist')
  assert.ok(blogs.updatedAt, 'blogs.updatedAt should exist')
})

test('Blog Validation: rejects empty or whitespace title', () => {
  assert.throws(
    () => {
      validateBlogInput({ title: '' })
    },
    {
      message: 'Judul artikel tidak boleh kosong',
    },
  )

  assert.throws(
    () => {
      validateBlogInput({ title: '    ' })
    },
    {
      message: 'Judul artikel tidak boleh kosong',
    },
  )

  assert.doesNotThrow(() => {
    validateBlogInput({ title: 'Judul Artikel Valid' })
  })
})

test('Blog Validation: validates topic against BLOG_TOPICS', () => {
  assert.doesNotThrow(() => {
    validateBlogTopic('Software Engineering')
  })
  assert.doesNotThrow(() => {
    validateBlogTopic(undefined)
  })
  assert.doesNotThrow(() => {
    validateBlogTopic(null)
  })
  assert.doesNotThrow(() => {
    validateBlogTopic('')
  })

  assert.throws(
    () => {
      validateBlogTopic('Topik Yang Tidak Ada')
    },
    (err: Error) => {
      return (
        err instanceof Error &&
        err.message.includes('Topik tidak valid') &&
        err.message.includes('Pilihan topik yang valid')
      )
    },
  )
})

test('Blog Status Transitions: draft -> published -> archived -> published', () => {
  let status: BlogStatus = 'draft'
  assert.equal(status, 'draft')

  // Publish
  status = 'published'
  assert.equal(status, 'published')

  // Deactivate (Archive) via calculateNextBlogStatus
  status = calculateNextBlogStatus(status)
  assert.equal(status, 'archived')

  // Reactivate via calculateNextBlogStatus
  status = calculateNextBlogStatus(status)
  assert.equal(status, 'published')

  // Explicit status override to draft
  status = calculateNextBlogStatus(status, 'draft')
  assert.equal(status, 'draft')
})

test('Server Functions Contract: verify all blog server functions are registered and exported', () => {
  assert.ok(typeof saveBlogFn === 'function', 'saveBlogFn should be a function')
  assert.ok(
    typeof getBlogByIdFn === 'function',
    'getBlogByIdFn should be a function',
  )
  assert.ok(
    typeof getBlogBySlugFn === 'function',
    'getBlogBySlugFn should be a function',
  )
  assert.ok(
    typeof getPublishedBlogsFn === 'function',
    'getPublishedBlogsFn should be a function',
  )
  assert.ok(
    typeof toggleBlogStatusFn === 'function',
    'toggleBlogStatusFn should be a function',
  )
})

test('Server Function getBlogBySlugFn: rejects empty or whitespace slug', async () => {
  const sym = Symbol.for('tanstack-start:start-storage-context')
  const storage =
    (globalThis as unknown as Record<symbol, unknown>)[sym] ||
    new AsyncLocalStorage()
  ;(globalThis as unknown as Record<symbol, unknown>)[sym] = storage

  await (
    storage as AsyncLocalStorage<{
      startOptions: unknown
    }>
  ).run({ startOptions: {} }, async () => {
    await assert.rejects(
      async () => {
        await getBlogBySlugFn({ data: { slug: '' } })
      },
      {
        message: 'Slug artikel tidak boleh kosong',
      },
      'Should reject empty slug',
    )

    await assert.rejects(
      async () => {
        await getBlogBySlugFn({ data: { slug: '   ' } })
      },
      {
        message: 'Slug artikel tidak boleh kosong',
      },
      'Should reject whitespace-only slug',
    )
  })
})

test('Archived Article Access: simulates access check logic for non-author on archived article', () => {
  function verifyPublicArticleAccess(
    blog: { userId: string; status: BlogStatus },
    currentUserId: string | null,
  ) {
    const isAuthor = Boolean(currentUserId && currentUserId === blog.userId)
    if (!isAuthor && blog.status !== 'published') {
      throw new Error('Artikel tidak ditemukan atau belum dipublikasikan')
    }
    return { canAccess: true, isAuthor }
  }

  // Published article can be accessed by public/anonymous
  const publishedBlog = { userId: 'author-123', status: 'published' as const }
  assert.doesNotThrow(() => {
    const access = verifyPublicArticleAccess(publishedBlog, null)
    assert.equal(access.canAccess, true)
    assert.equal(access.isAuthor, false)
  })

  // Archived article cannot be accessed by stranger / anonymous
  const archivedBlog = { userId: 'author-123', status: 'archived' as const }
  assert.throws(
    () => {
      verifyPublicArticleAccess(archivedBlog, null)
    },
    {
      message: 'Artikel tidak ditemukan atau belum dipublikasikan',
    },
  )
  assert.throws(
    () => {
      verifyPublicArticleAccess(archivedBlog, 'stranger-456')
    },
    {
      message: 'Artikel tidak ditemukan atau belum dipublikasikan',
    },
  )

  // Archived article can be viewed by author
  assert.doesNotThrow(() => {
    const access = verifyPublicArticleAccess(archivedBlog, 'author-123')
    assert.equal(access.canAccess, true)
    assert.equal(access.isAuthor, true)
  })
})
