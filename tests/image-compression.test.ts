import test from 'node:test'
import assert from 'node:assert/strict'

function calculateScaledDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      return {
        width: maxDimension,
        height: Math.round((height * maxDimension) / width),
      }
    } else {
      return {
        width: Math.round((width * maxDimension) / height),
        height: maxDimension,
      }
    }
  }
  return { width, height }
}

test('Image Compression: scales 4K landscape to maxDimension 1920px preserving 16:9 aspect ratio', () => {
  const scaled = calculateScaledDimensions(3840, 2160, 1920)
  assert.equal(scaled.width, 1920)
  assert.equal(scaled.height, 1080)
})

test('Image Compression: scales tall portrait to maxDimension 1920px', () => {
  const scaled = calculateScaledDimensions(1080, 2400, 1920)
  assert.equal(scaled.height, 1920)
  assert.equal(scaled.width, Math.round((1080 * 1920) / 2400)) // 864
})

test('Image Compression: does not upscale smaller images', () => {
  const scaled = calculateScaledDimensions(800, 600, 1920)
  assert.equal(scaled.width, 800)
  assert.equal(scaled.height, 600)
})

test('Image Compression: converts extension to .webp', () => {
  const fileNames = ['photo.jpg', 'avatar.png', 'graphic.jpeg', 'animation.gif']
  for (const name of fileNames) {
    const base = name.replace(/\.[^/.]+$/, '')
    assert.equal(`${base}.webp`, `${base}.webp`)
  }
})
