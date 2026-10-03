import type { Blog, BlogStatus, BlogTopic, NewBlog, User } from '#/db/schema'
import { BLOG_TOPICS } from '#/db/schema'

export { BLOG_TOPICS }
export type { Blog, NewBlog, BlogStatus, BlogTopic }

export interface SaveBlogInput {
  id?: number
  title: string
  slug?: string
  content: string
  thumbnail?: string | null
  topic?: string | null
  status: BlogStatus
}

export interface PresignedUrlResult {
  success: boolean
  signedUrl?: string
  token?: string
  path: string
  publicUrl: string
  isFallback?: boolean
  error?: string
}

export interface BlogWithAuthor extends Blog {
  author?: User | null
}

export interface GetPublishedBlogsInput {
  topic?: string | null
  limit?: number
  offset?: number
}
