import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, eq, ne } from 'drizzle-orm'
import { db } from '#/db/index'
import type { BlogStatus } from '#/db/schema'
import { blogs, users } from '#/db/schema'
import { auth } from '@/lib/auth'

export interface SaveBlogInput {
  id?: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  status: BlogStatus
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

async function resolveAuthorId(): Promise<string> {
  try {
    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })
    if (session?.user.id) {
      return session.user.id
    }
  } catch {
    // Fallback if no request context or unauthenticated
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

export const saveBlogFn = createServerFn({ method: 'POST' })
  .validator((data: SaveBlogInput) => data)
  .handler(async ({ data }) => {
    const { id, title, slug, content, thumbnail, status } = data

    if (!title.trim()) {
      throw new Error('Judul artikel tidak boleh kosong')
    }

    const userId = await resolveAuthorId()
    const uniqueSlug = await ensureUniqueSlug(slug || title, id)
    const now = new Date()

    if (id) {
      const existing = await db.query.blogs.findFirst({
        where: eq(blogs.id, id),
      })

      if (!existing) {
        throw new Error('Artikel tidak ditemukan')
      }

      if (existing.userId !== userId) {
        throw new Error('Anda tidak memiliki izin untuk mengedit artikel ini')
      }

      await db
        .update(blogs)
        .set({
          title: title.trim(),
          slug: uniqueSlug,
          content,
          thumbnail: thumbnail || null,
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
        userId,
        title: title.trim(),
        slug: uniqueSlug,
        content,
        thumbnail: thumbnail || null,
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

    const currentUserId = await resolveAuthorId()
    const isAuthor = currentUserId === blog.userId

    if (!isAuthor && blog.status !== 'published') {
      throw new Error('Artikel tidak ditemukan atau belum dipublikasikan')
    }

    return {
      blog,
      isAuthor,
      currentUserId,
    }
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

    const currentUserId = await resolveAuthorId()
    if (existing.userId !== currentUserId) {
      throw new Error('Anda tidak memiliki izin untuk mengubah status artikel ini')
    }

    let nextStatus: BlogStatus
    if (requestedStatus) {
      nextStatus = requestedStatus
    } else {
      nextStatus = existing.status === 'published' ? 'archived' : 'published'
    }

    const now = new Date()
    await db
      .update(blogs)
      .set({
        status: nextStatus,
        publishedAt: nextStatus === 'published' ? existing.publishedAt || now : null,
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
