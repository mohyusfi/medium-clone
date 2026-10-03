import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, desc, eq, ne } from 'drizzle-orm'
import { db } from '#/db/index'
import type { BlogStatus } from '#/db/schema'
import { BLOG_TOPICS, blogs, users } from '#/db/schema'
import { auth } from '@/lib/auth'
import type { SaveBlogInput } from '../types'

export type { SaveBlogInput }

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

async function getOrCreateDefaultAuthorId(): Promise<string> {
  const existingAuthor = await db.query.users.findFirst({
    where: eq(users.email, 'user@chronicle.untad.ac.id'),
  })

  if (existingAuthor) {
    return existingAuthor.id
  }

  const defaultUser = await db.query.users.findFirst({
    where: eq(users.email, 'member@untad.ac.id'),
  })

  if (defaultUser) {
    return defaultUser.id
  }

  const [inserted] = await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      name: 'Untad Academician',
      email: 'member@untad.ac.id',
      role: 'user',
    })
    .returning({ id: users.id })

  return inserted.id
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    return session?.user.id ?? null
  } catch {
    return null
  }
}

async function resolveAuthorId(): Promise<string> {
  const sessionUserId = await getCurrentUserId()
  if (sessionUserId) {
    return sessionUserId
  }
  return await getOrCreateDefaultAuthorId()
}

async function ensureUniqueSlug(
  rawSlug: string,
  currentId?: number,
): Promise<string> {
  const baseSlug =
    rawSlug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'untitled-story'

  let candidateSlug = baseSlug
  let counter = 1

  for (;;) {
    const existing = await db.query.blogs.findFirst({
      where: currentId
        ? and(eq(blogs.slug, candidateSlug), ne(blogs.id, currentId))
        : eq(blogs.slug, candidateSlug),
    })

    if (!existing) {
      return candidateSlug
    }

    candidateSlug = `${baseSlug}-${counter}`
    counter++
  }
}

export function validateBlogInput(data: { title: string }): void {
  if (!data.title.trim()) {
    throw new Error('Judul artikel tidak boleh kosong')
  }
}

export function validateBlogTopic(topic?: string | null): void {
  if (!topic) return
  const trimmed = topic.trim()
  if (trimmed && !(BLOG_TOPICS as readonly string[]).includes(trimmed)) {
    throw new Error(
      `Topik tidak valid: "${trimmed}". Pilihan topik yang valid: ${BLOG_TOPICS.join(', ')}`,
    )
  }
}

export function calculateNextBlogStatus(
  currentStatus: BlogStatus,
  requestedStatus?: BlogStatus,
): BlogStatus {
  if (requestedStatus) return requestedStatus
  return currentStatus === 'published' ? 'archived' : 'published'
}

export const saveBlogFn = createServerFn({ method: 'POST' })
  .validator((data: SaveBlogInput) => data)
  .handler(async ({ data }) => {
    const { id, title, slug, content, thumbnail, topic, status } = data

    validateBlogInput({ title })
    validateBlogTopic(topic)

    const authorId = await resolveAuthorId()
    const uniqueSlug = await ensureUniqueSlug(slug || title, id)
    const sanitizedTopic = topic?.trim() || null
    const now = new Date()

    if (id) {
      const existing = await db.query.blogs.findFirst({
        where: eq(blogs.id, id),
      })

      if (!existing) {
        throw new Error('Artikel tidak ditemukan')
      }

      if (existing.userId !== authorId) {
        throw new Error('Anda tidak memiliki izin untuk mengedit artikel ini')
      }

      await db
        .update(blogs)
        .set({
          title: title.trim(),
          slug: uniqueSlug,
          content,
          thumbnail: thumbnail || null,
          topic: sanitizedTopic,
          status,
          publishedAt:
            status === 'published' ? existing.publishedAt || now : null,
          updatedAt: now,
        })
        .where(eq(blogs.id, id))

      return {
        success: true,
        blogId: id,
        slug: uniqueSlug,
      }
    }

    const [inserted] = await db
      .insert(blogs)
      .values({
        userId: authorId,
        title: title.trim(),
        slug: uniqueSlug,
        content,
        thumbnail: thumbnail || null,
        topic: sanitizedTopic,
        status,
        publishedAt: status === 'published' ? now : null,
      })
      .returning({ id: blogs.id })

    return {
      success: true,
      blogId: inserted.id,
      slug: uniqueSlug,
    }
  })

export const getBlogByIdFn = createServerFn({ method: 'GET' })
  .validator((data: { id: number }) => data)
  .handler(async ({ data: { id } }) => {
    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
      with: {
        author: true,
      },
    })

    if (!blog) {
      throw new Error('Artikel tidak ditemukan')
    }

    const currentUserId = await getCurrentUserId()
    const isAuthor = Boolean(currentUserId && currentUserId === blog.userId)

    if (!isAuthor && blog.status !== 'published') {
      throw new Error('Artikel tidak ditemukan atau belum dipublikasikan')
    }

    return {
      blog,
      isAuthor,
      currentUserId,
    }
  })

export const getBlogBySlugFn = createServerFn({ method: 'GET' })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data: { slug } }) => {
    if (!slug || !slug.trim()) {
      throw new Error('Slug artikel tidak boleh kosong')
    }

    const blog = await db.query.blogs.findFirst({
      where: eq(blogs.slug, slug.trim()),
      with: {
        author: true,
      },
    })

    if (!blog) {
      throw new Error('Artikel tidak ditemukan')
    }

    const currentUserId = await getCurrentUserId()
    const isAuthor = Boolean(currentUserId && currentUserId === blog.userId)

    if (!isAuthor && blog.status !== 'published') {
      throw new Error('Artikel tidak ditemukan atau belum dipublikasikan')
    }

    return {
      ...blog,
      blog,
      isAuthor,
      currentUserId,
    }
  })

export const getPublishedBlogsFn = createServerFn({ method: 'GET' })
  .validator(
    (data?: { topic?: string | null; limit?: number; offset?: number }) => data,
  )
  .handler(async ({ data }) => {
    const topic = data?.topic?.trim()
    const limit = data?.limit
    const offset = data?.offset

    const conditions = [eq(blogs.status, 'published')]

    if (
      topic &&
      topic.toLowerCase() !== 'all' &&
      topic.toLowerCase() !== 'semua'
    ) {
      conditions.push(eq(blogs.topic, topic))
    }

    const publishedBlogs = await db.query.blogs.findMany({
      where: and(...conditions),
      with: {
        author: true,
      },
      orderBy: [desc(blogs.publishedAt), desc(blogs.createdAt)],
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    })

    return publishedBlogs
  })

export const toggleBlogStatusFn = createServerFn({ method: 'POST' })
  .validator((data: { id: number; status?: BlogStatus }) => data)
  .handler(async ({ data: { id, status: requestedStatus } }) => {
    const existing = await db.query.blogs.findFirst({
      where: eq(blogs.id, id),
    })

    if (!existing) {
      throw new Error('Artikel tidak ditemukan')
    }

    const currentUserId = await getCurrentUserId()
    const authorId = currentUserId || (await getOrCreateDefaultAuthorId())
    if (existing.userId !== authorId) {
      throw new Error(
        'Anda tidak memiliki izin untuk mengubah status artikel ini',
      )
    }

    const nextStatus = calculateNextBlogStatus(existing.status, requestedStatus)

    const now = new Date()
    await db
      .update(blogs)
      .set({
        status: nextStatus,
        publishedAt:
          nextStatus === 'published' ? existing.publishedAt || now : null,
        updatedAt: now,
      })
      .where(eq(blogs.id, id))

    return {
      success: true,
      blogId: id,
      previousStatus: existing.status,
      status: nextStatus,
    }
  })
