import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

test('Dark Mode: styles.css maps prose tokens to editorial design variables', () => {
  const cssPath = path.resolve(process.cwd(), 'src/styles.css')
  const cssContent = fs.readFileSync(cssPath, 'utf8')

  assert.ok(
    cssContent.includes('--tw-prose-bold: var(--color-text)'),
    'src/styles.css must map --tw-prose-bold to var(--color-text)',
  )
  assert.ok(
    cssContent.includes('--tw-prose-body: var(--color-text)'),
    'src/styles.css must map --tw-prose-body to var(--color-text)',
  )
  assert.ok(
    cssContent.includes('--tw-prose-invert-bold: var(--color-text)'),
    'src/styles.css must map --tw-prose-invert-bold to var(--color-text)',
  )
})

test('Dark Mode: about.tsx includes dark:prose-invert for proper dark typography', () => {
  const aboutPath = path.resolve(process.cwd(), 'src/routes/_app/about.tsx')
  const aboutContent = fs.readFileSync(aboutPath, 'utf8')

  assert.ok(
    aboutContent.includes('dark:prose-invert'),
    'about.tsx article tag must include dark:prose-invert class',
  )
  assert.ok(
    aboutContent.includes('<strong>Editorial Clarity over Decoration</strong>'),
    'about.tsx should maintain strong editorial text',
  )
})
