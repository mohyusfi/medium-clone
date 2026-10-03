import test from 'node:test'
import assert from 'node:assert/strict'
import {
  calculateScaledDimensions,
  BLOG_TOPICS,
  BlogCard,
  BlogFeed,
  BlogDetail,
  BlogTopicSelect,
  CoverImageUploader,
  ImageUploadModal,
  EditorToolbar,
  EditorBubbleMenu,
  LineHeightSelector,
  LineHeight,
  LINE_HEIGHT_OPTIONS,
} from '../src/features/blog'

test('Frontend Image Compression: calculateScaledDimensions behaves correctly', () => {
  // Landscape scaling
  const landscape = calculateScaledDimensions(3840, 2160, 1920)
  assert.equal(landscape.width, 1920)
  assert.equal(landscape.height, 1080)

  // Portrait scaling
  const portrait = calculateScaledDimensions(1080, 2160, 1920)
  assert.equal(portrait.height, 1920)
  assert.equal(portrait.width, 960)

  // Square scaling
  const square = calculateScaledDimensions(3000, 3000, 1920)
  assert.equal(square.width, 1920)
  assert.equal(square.height, 1920)

  // No upscaling for smaller images
  const small = calculateScaledDimensions(1200, 800, 1920)
  assert.equal(small.width, 1200)
  assert.equal(small.height, 800)
})

test('Frontend Blog Topics: includes all 8 standardized topics', () => {
  assert.equal(BLOG_TOPICS.length, 8)
  const expectedTopics = [
    'Teknologi',
    'Riset Untad',
    'Kecerdasan Buatan',
    'Sulawesi Tengah',
    'Data Science',
    'Software Engineering',
    'Lingkungan Hidup',
    'Akademik',
  ]
  for (const topic of expectedTopics) {
    assert.ok(
      (BLOG_TOPICS as readonly string[]).includes(topic),
      `BLOG_TOPICS should include ${topic}`,
    )
  }
})

test('Frontend Barrel Exports: all components and utilities are properly exported', () => {
  assert.equal(typeof BlogCard, 'function')
  assert.equal(typeof BlogFeed, 'function')
  assert.equal(typeof BlogDetail, 'function')
  assert.equal(typeof BlogTopicSelect, 'function')
  assert.equal(typeof CoverImageUploader, 'function')
  assert.equal(typeof ImageUploadModal, 'function')
  assert.equal(typeof EditorToolbar, 'function')
  assert.equal(typeof EditorBubbleMenu, 'function')
  assert.equal(typeof LineHeightSelector, 'function')
  assert.ok(LineHeight, 'LineHeight extension must be exported')
  assert.ok(
    Array.isArray(LINE_HEIGHT_OPTIONS),
    'LINE_HEIGHT_OPTIONS must be an array',
  )
  assert.equal(LINE_HEIGHT_OPTIONS.length, 3)
})

test('Frontend Editorial Text Processing: clean snippet and read time calculation', () => {
  const htmlContent =
    '<h1>Judul Artikel</h1><p>Ini adalah <strong>paragraf pertama</strong> dengan informasi riset kebencanaan Untad di Lembah Palu.</p>'
  const snippet = htmlContent
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  assert.equal(
    snippet,
    'Judul Artikel Ini adalah paragraf pertama dengan informasi riset kebencanaan Untad di Lembah Palu.',
  )

  const words = snippet.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  assert.equal(minutes, 1)
})
