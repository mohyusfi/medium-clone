import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, AlertCircle } from 'lucide-react'
import { getBlogBySlugFn } from '#/features/blog/server/blogs'
import BlogDetail from '#/features/blog/components/BlogDetail'

export const Route = createFileRoute('/_app/story/$slug')({
  loader: async ({ params }) => {
    try {
      const result = await getBlogBySlugFn({ data: { slug: params.slug } })
      return {
        blog: result.blog,
        isAuthor: Boolean(result.isAuthor),
        currentUserId: result.currentUserId ?? null,
        error: null,
      }
    } catch (err: unknown) {
      return {
        blog: null,
        isAuthor: false,
        currentUserId: null,
        error:
          err instanceof Error
            ? err.message
            : 'Artikel tidak ditemukan atau belum dipublikasikan.',
      }
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData?.blog) {
      return {
        meta: [{ title: 'Artikel Tidak Ditemukan - Untad Chronicle' }],
      }
    }
    return {
      meta: [
        { title: `${loaderData.blog.title} - Untad Chronicle` },
        {
          name: 'description',
          content: loaderData.blog.content
            ? loaderData.blog.content.replace(/<[^>]+>/g, '').slice(0, 160)
            : '',
        },
      ],
    }
  },
  component: StoryPage,
})

function StoryPage() {
  const { blog, isAuthor, currentUserId, error } = Route.useLoaderData()

  if (!blog) {
    return (
      <main className="mx-auto min-w-0 max-w-2xl flex-1 px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]">
          <BookOpen className="h-6 w-6 text-[var(--color-text-muted)]" />
        </div>
        <h1 className="mt-5 font-serif text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
          Artikel Tidak Ditemukan
        </h1>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
          {error ||
            'Artikel yang Anda cari mungkin telah dinonaktifkan, diarsipkan oleh penulis, atau URL tidak valid.'}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition hover:border-[var(--color-text)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-w-0 w-full flex-1">
      <BlogDetail
        blog={blog}
        isAuthor={isAuthor}
        currentUserId={currentUserId}
      />
    </main>
  )
}
