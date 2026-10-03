import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { and, count, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { blogs, follows, users } from '@/db/schema'
import { auth } from '@/lib/auth'

export const getUserProfileFn = createServerFn({ method: 'GET' })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data: { userId } }) => {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return null
    }

    let currentUserId: string | null = null
    try {
      const request = getRequest()
      const session = await auth.api.getSession({
        headers: request.headers,
      })
      currentUserId = session?.user.id ?? null
    } catch {
      // unauthenticated
    }

    const [followerRecord] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, userId))

    const [followingRecord] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, userId))

    const isSelf = currentUserId === userId

    let isFollowing = false
    if (currentUserId && !isSelf) {
      const followRecord = await db.query.follows.findFirst({
        where: and(
          eq(follows.followerId, currentUserId),
          eq(follows.followingId, userId),
        ),
      })
      isFollowing = !!followRecord
    }

    const userBlogs = await db.query.blogs.findMany({
      where: isSelf
        ? eq(blogs.userId, userId)
        : and(eq(blogs.userId, userId), eq(blogs.status, 'published')),
      orderBy: [desc(blogs.createdAt)],
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
      },
      followersCount: Number(followerRecord.count),
      followingCount: Number(followingRecord.count),
      articlesCount: userBlogs.length,
      isFollowing,
      isSelf,
      currentUserId,
      articles: userBlogs,
    }
  })

export const toggleFollowFn = createServerFn({ method: 'POST' })
  .validator((data: { targetUserId: string }) => data)
  .handler(async ({ data: { targetUserId } }) => {
    if (!targetUserId) {
      throw new Error('Target User ID is required')
    }

    const request = getRequest()
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session?.user.id) {
      throw new Error('Anda harus masuk untuk mengikuti akun ini.')
    }

    const followerId = session.user.id
    if (followerId === targetUserId) {
      throw new Error('Anda tidak dapat mengikuti diri sendiri.')
    }

    const existingFollow = await db.query.follows.findFirst({
      where: and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, targetUserId),
      ),
    })

    let isFollowing = false

    if (existingFollow) {
      await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, followerId),
            eq(follows.followingId, targetUserId),
          ),
        )
      isFollowing = false
    } else {
      await db.insert(follows).values({
        followerId,
        followingId: targetUserId,
      })
      isFollowing = true
    }

    const [followerRecord] = await db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, targetUserId))

    return {
      isFollowing,
      followersCount: Number(followerRecord.count),
    }
  })
