import test from 'node:test'
import assert from 'node:assert/strict'
import { blogs } from '../src/db/schema'
import type { BlogStatus, Blog, NewBlog } from '../src/db/schema'

test('Database Schema: BlogStatus union support', () => {
  const validStatuses: BlogStatus[] = ['draft', 'published', 'archived']
  assert.equal(validStatuses.length, 3)

  const sampleBlog: Partial<Blog> = {
    id: 1,
    title: 'Test Article',
    slug: 'test-article',
    status: 'archived',
  }

  assert.equal(sampleBlog.status, 'archived')
})

test('Database Schema: blogs table has required columns', () => {
  assert.ok(blogs.id, 'blogs.id should exist')
  assert.ok(blogs.userId, 'blogs.userId should exist')
  assert.ok(blogs.title, 'blogs.title should exist')
  assert.ok(blogs.slug, 'blogs.slug should exist')
  assert.ok(blogs.content, 'blogs.content should exist')
  assert.ok(blogs.status, 'blogs.status should exist')
  assert.ok(blogs.thumbnail, 'blogs.thumbnail should exist')
  assert.ok(blogs.publishedAt, 'blogs.publishedAt should exist')
  assert.ok(blogs.createdAt, 'blogs.createdAt should exist')
  assert.ok(blogs.updatedAt, 'blogs.updatedAt should exist')
})
