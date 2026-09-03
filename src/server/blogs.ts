import { createServerFn } from '@tanstack/react-start'
import { eq, and, ne } from 'drizzle-orm'
import { db } from '#/db/index'
import { blogs, users } from '#/db/schema'

export interface SaveBlogInput {
  id?: number
  title: string
  slug: string
  content: string
  thumbnail?: string | null
  status: 'draft' | 'published'
}

async function getOrCreateDefaultAuthorId(): Promise<number> {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, 'member@untad.ac.id'),
  })

  if (existingUser) {
    return existingUser.id
  }

  const [insertResult] = await db.insert(users).values({
    name: 'Untad Academician',
    email: 'member@untad.ac.id',
    password: 'password_demo_untad',
    role: 'user',
  })

  return insertResult.insertId
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

    const userId = await getOrCreateDefaultAuthorId()
    const uniqueSlug = await ensureUniqueSlug(slug || title, id)
    const now = new Date()

    if (id) {
      await db
        .update(blogs)
        .set({
          title,
          slug: uniqueSlug,
          content,
          thumbnail: thumbnail || null,
          status,
          published_at: status === 'published' ? now : null,
          updated_at: now,
        })
        .where(eq(blogs.id, id))

      return {
        success: true,
        blogId: id,
        slug: uniqueSlug,
      }
    }

    const [inserted] = await db.insert(blogs).values({
      user_id: userId,
      title,
      slug: uniqueSlug,
      content,
      thumbnail: thumbnail || null,
      status,
      published_at: status === 'published' ? now : null,
    })

    return {
      success: true,
      blogId: inserted.insertId,
      slug: uniqueSlug,
    }
  })
