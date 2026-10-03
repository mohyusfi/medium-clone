import test from 'node:test'
import assert from 'node:assert/strict'
import { AsyncLocalStorage } from 'node:async_hooks'
import {
  SUPABASE_STORAGE_BUCKET,
  normalizeSupabaseUrl,
} from '../src/server/supabase'
import {
  generatePresignedUploadPath,
  createPresignedUploadUrlFn,
} from '../src/server/upload'

test('Supabase Config: bucket name matches untad-chronicle specification', () => {
  assert.equal(SUPABASE_STORAGE_BUCKET, 'untad-chronicle')
})

test('normalizeSupabaseUrl: normalizes S3 storage endpoint to standard project URL', () => {
  const s3Url = 'https://legvolvdggmssalmiojh.storage.supabase.co/storage/v1/s3'
  assert.equal(
    normalizeSupabaseUrl(s3Url),
    'https://legvolvdggmssalmiojh.supabase.co',
  )
})

test('normalizeSupabaseUrl: strips trailing slashes', () => {
  assert.equal(
    normalizeSupabaseUrl('https://xyz.supabase.co/'),
    'https://xyz.supabase.co',
  )
  assert.equal(
    normalizeSupabaseUrl('https://xyz.supabase.co///'),
    'https://xyz.supabase.co',
  )
})

test('normalizeSupabaseUrl: preserves valid standard URL without modification', () => {
  assert.equal(
    normalizeSupabaseUrl('https://xyz.supabase.co'),
    'https://xyz.supabase.co',
  )
})

test('normalizeSupabaseUrl: returns empty string for empty or whitespace-only inputs', () => {
  assert.equal(normalizeSupabaseUrl(''), '')
  assert.equal(normalizeSupabaseUrl('   '), '')
})

test('Presigned Upload: creates valid sanitized path in blog-images folder', () => {
  const path = generatePresignedUploadPath('my test image!@#$%.png')

  assert.ok(
    path.startsWith('blog-images/'),
    'Path should start with blog-images/',
  )
  assert.ok(path.endsWith('.webp'), 'Path should end with .webp')
  assert.ok(!path.includes('!@#$%'), 'Path should sanitize unsafe characters')
  assert.ok(
    path.includes('mytestimage'),
    'Path should contain sanitized file name',
  )
})

test('Presigned Upload: truncates extremely long filenames and handles fallback for empty names', () => {
  const longName = 'a'.repeat(100) + '.png'
  const pathLong = generatePresignedUploadPath(longName)
  const filenamePart = pathLong
    .replace('blog-images/', '')
    .replace(/\.webp$/, '')
  const sanitized = filenamePart.split('_').slice(1).join('_')
  assert.ok(
    sanitized.length <= 30,
    'Sanitized filename should not exceed 30 chars',
  )

  const fallbackPath = generatePresignedUploadPath('$$$.png')
  assert.ok(
    fallbackPath.includes('image.webp'),
    'Should use fallback "image" name when all characters are stripped',
  )
})

test('Presigned Upload: disabled fallback throws error when Supabase credentials are missing', async () => {
  // When Supabase is not configured in environment, creating presigned URL must fail/throw
  // and NOT quietly return a fallback to local server (/uploads/...)
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
        await createPresignedUploadUrlFn({
          data: { filename: 'test-article-cover.png' },
        })
      },
      (err: Error) => {
        // Must reject with Supabase error, not fallback to local uploads
        return err instanceof Error && /supabase/i.test(err.message)
      },
      'Should reject with Supabase configuration error when Supabase client is unavailable',
    )
  })
})
