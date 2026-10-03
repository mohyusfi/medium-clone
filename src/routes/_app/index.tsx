import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getPublishedBlogsFn } from '#/features/blog/server/blogs'
import BlogFeed from '#/features/blog/components/BlogFeed'
import DiscoveryRail from '#/components/DiscoveryRail'

export const Route = createFileRoute('/_app/')({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: typeof search.topic === 'string' ? search.topic : undefined,
  }),
  loaderDeps: ({ search: { topic } }) => ({ topic }),
  loader: async ({ deps: { topic } }) => {
    try {
      const articles = await getPublishedBlogsFn({
        data: { topic: topic || null },
      })
      return { articles }
    } catch {
      return { articles: [] }
    }
  },
  component: Home,
})

function Home() {
  const { articles } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate()

  const handleTopicChange = (newTopic: string) => {
    navigate({
      to: '/',
      search: {
        topic:
          newTopic === 'all' || newTopic === 'for-you' ? undefined : newTopic,
      },
    })
  }

  return (
    <>
      <main className="min-w-0 w-full flex-1 px-0 py-6 min-[900px]:px-8 min-[1200px]:max-w-[680px]">
        <BlogFeed
          articles={articles}
          activeTopic={search.topic || 'all'}
          onTopicChange={handleTopicChange}
        />
      </main>

      <div className="hidden min-[1200px]:block w-[340px] shrink-0 border-l border-[var(--color-border)] pl-8">
        <div className="sticky top-16">
          <DiscoveryRail />
        </div>
      </div>
    </>
  )
}
