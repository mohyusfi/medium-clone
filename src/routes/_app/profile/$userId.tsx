import { useEffect, useState } from 'react'
import {
  createFileRoute,
  Link,
  useNavigate,
  useRouter,
} from '@tanstack/react-router'
import {
  Archive,
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Edit3,
  Loader2,
  Plus,
  RotateCcw,
  SquarePen,
} from 'lucide-react'
import { useServerFn } from '@tanstack/react-start'
import { getUserProfileFn, toggleFollowFn } from '@/server/users'
import { toggleBlogStatusFn } from '@/server/blogs'

export const Route = createFileRoute('/_app/profile/$userId')({
  loader: async ({ params }) => {
    return await getUserProfileFn({ data: { userId: params.userId } })
  },
  component: ProfilePage,
})

function ProfilePage() {
  const data = Route.useLoaderData()
  const navigate = useNavigate()
  const router = useRouter()
  const toggleFollow = useServerFn(toggleFollowFn)
  const toggleBlogStatus = useServerFn(toggleBlogStatusFn)

  const [isFollowing, setIsFollowing] = useState(data?.isFollowing ?? false)
  const [followersCount, setFollowersCount] = useState(
    data?.followersCount ?? 0,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (data) {
      setIsFollowing(data.isFollowing)
      setFollowersCount(data.followersCount)
    }
  }, [data])

  if (!data) {
    return (
      <main className="mx-auto min-w-0 max-w-3xl flex-1 px-4 py-16 sm:px-6">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-[var(--color-text)]">
            Profil Pengguna Tidak Ditemukan
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Pengguna yang Anda cari mungkin telah dihapus atau tautan tidak
            valid.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const { user, followingCount, isSelf, currentUserId, articles } = data

  const handleToggleFollow = async () => {
    if (!currentUserId) {
      navigate({ to: '/login' })
      return
    }

    if (isSelf) return

    setErrorMessage(null)
    setIsSubmitting(true)

    // Optimistic UI update
    const nextFollowingState = !isFollowing
    const nextFollowersCount = nextFollowingState
      ? followersCount + 1
      : Math.max(0, followersCount - 1)

    setIsFollowing(nextFollowingState)
    setFollowersCount(nextFollowersCount)

    try {
      const result = await toggleFollow({ data: { targetUserId: user.id } })
      setIsFollowing(result.isFollowing)
      setFollowersCount(result.followersCount)
      await router.invalidate()
    } catch (err: unknown) {
      // Revert optimistic update on failure
      setIsFollowing(!nextFollowingState)
      setFollowersCount(followersCount)
      const msg =
        err instanceof Error ? err.message : 'Gagal memperbarui status ikuti.'
      setErrorMessage(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (blogId: number, currentStatus: string) => {
    setActionLoadingId(blogId)
    setErrorMessage(null)
    try {
      const nextStatus =
        currentStatus === 'published' ? 'archived' : 'published'
      await toggleBlogStatus({ data: { id: blogId, status: nextStatus } })
      await router.invalidate()
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Gagal memperbarui status artikel.',
      )
    } finally {
      setActionLoadingId(null)
    }
  }

  const formattedDate = new Date(user.createdAt).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="mx-auto min-w-0 w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <div className="border-b border-[var(--color-border)] pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-serif text-2xl font-bold text-[var(--color-text)]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl font-bold tracking-tight text-[var(--color-text)] sm:text-3xl">
                  {user.name}
                </h1>
                {user.role === 'admin' && (
                  <span className="rounded bg-[var(--color-surface)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
                    Admin
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                {user.email}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Bergabung {formattedDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>{articles.length} Artikel</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {isSelf ? (
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
                  Profil Anda
                </span>
                <Link
                  to="/write"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-inverse)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-bg)] transition hover:opacity-90"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                  <span>Tulis Cerita</span>
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleToggleFollow}
                disabled={isSubmitting}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${
                  isFollowing
                    ? 'border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] hover:border-[var(--color-destructive)] hover:text-[var(--color-destructive)]'
                    : 'bg-[var(--color-inverse)] text-[var(--color-bg)] hover:opacity-90'
                }`}
              >
                {isSubmitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : isFollowing ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span>Mengikuti</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ikuti</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 border-l-2 border-[var(--color-destructive)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-destructive)]">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 flex items-center gap-6 border-t border-[var(--color-border)] pt-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[var(--color-text)]">
              {followersCount}
            </span>
            <span className="text-[var(--color-text-secondary)]">Pengikut</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[var(--color-text)]">
              {followingCount}
            </span>
            <span className="text-[var(--color-text-secondary)]">
              Mengikuti
            </span>
          </div>
        </div>
      </div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[var(--color-text)]">
            Cerita & Publikasi
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            {articles.length} publikasi
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="rounded border border-dashed border-[var(--color-border)] py-12 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-[var(--color-text-muted)]" />
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
              {isSelf
                ? 'Anda belum menerbitkan tulisan apa pun.'
                : 'Penulis ini belum menerbitkan artikel.'}
            </p>
            {isSelf && (
              <div className="mt-4">
                <Link
                  to="/write"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-inverse)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-bg)] transition hover:opacity-90"
                >
                  <SquarePen className="h-3.5 w-3.5" />
                  <span>Mulai Menulis</span>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {articles.map((item) => {
              const itemDate = item.publishedAt
                ? new Date(item.publishedAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })

              // Strip HTML tags for clean description snippet
              const textSnippet = item.content
                ? item.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...'
                : ''

              return (
                <article key={item.id} className="py-6 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2 text-[11px] text-[var(--color-text-muted)]">
                        <span>{itemDate}</span>
                        {item.status === 'draft' && (
                          <>
                            <span>·</span>
                            <span className="rounded bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-text-secondary)]">
                              Draf
                            </span>
                          </>
                        )}
                        {item.status === 'archived' && (
                          <>
                            <span>·</span>
                            <span className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                              Non-aktif (Diarsipkan)
                            </span>
                          </>
                        )}
                        {item.status === 'published' && isSelf && (
                          <>
                            <span>·</span>
                            <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                              Dipublikasikan
                            </span>
                          </>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold text-[var(--color-text)] transition hover:underline">
                        <Link to="/write" search={{ id: item.id }}>
                          {item.title}
                        </Link>
                      </h3>
                      {textSnippet && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                          {textSnippet}
                        </p>
                      )}

                      {isSelf && (
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            to="/write"
                            search={{ id: item.id }}
                            className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-text)] hover:text-[var(--color-text)]"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>

                          {item.status === 'published' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(item.id, item.status)
                              }
                              disabled={actionLoadingId === item.id}
                              className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-destructive)] hover:text-[var(--color-destructive)] cursor-pointer disabled:opacity-50"
                              title="Sembunyikan artikel dari publik"
                            >
                              {actionLoadingId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Archive className="h-3 w-3" />
                              )}
                              <span>Non-aktifkan</span>
                            </button>
                          )}

                          {item.status === 'archived' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleStatus(item.id, item.status)
                              }
                              disabled={actionLoadingId === item.id}
                              className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-500/20 cursor-pointer disabled:opacity-50"
                              title="Aktifkan dan publikasikan kembali artikel"
                            >
                              {actionLoadingId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <RotateCcw className="h-3 w-3" />
                              )}
                              <span>Aktifkan</span>
                            </button>
                          )}

                          {item.status === 'draft' && (
                            <Link
                              to="/write"
                              search={{ id: item.id }}
                              className="inline-flex items-center gap-1 rounded border border-[var(--color-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text)]"
                            >
                              <span>Lanjutkan Draf</span>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                    {item.thumbnail && (
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface)] sm:h-24 sm:w-32">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
