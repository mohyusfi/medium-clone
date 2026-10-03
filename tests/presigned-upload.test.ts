import test from 'node:test'
import assert from 'node:assert/strict'
import { SUPABASE_STORAGE_BUCKET } from '../src/server/supabase'
import { generatePresignedUploadPath } from '../src/server/upload'

test('Supabase Config: bucket name matches untad-chronicle specification', () => {
  assert.equal(SUPABASE_STORAGE_BUCKET, 'untad-chronicle')
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
