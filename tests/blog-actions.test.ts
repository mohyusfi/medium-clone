import test from 'node:test'
import assert from 'node:assert/strict'
import type { BlogStatus } from '../src/db/schema'
import { calculateNextBlogStatus, validateBlogInput } from '../src/server/blogs'

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

  // Explicit status override
  status = calculateNextBlogStatus(status, 'draft')
  assert.equal(status, 'draft')
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

  // Valid title should not throw
  assert.doesNotThrow(() => {
    validateBlogInput({ title: 'Judul Artikel Valid' })
  })
})
