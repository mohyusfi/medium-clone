import { Sparkles, Plus } from 'lucide-react'

const staffPicks = [
  {
    id: 'sp-1',
    author: 'Fakultas Teknik Untad',
    title: 'Penerapan Sensor IoT untuk Mitigasi Bencana di Lembah Palu',
    date: 'Aug 24',
  },
  {
    id: 'sp-2',
    author: 'Rahmat Hidayat',
    title: 'Membangun Arsitektur Microservices dengan TypeScript & Nitro',
    date: 'Aug 20',
  },
  {
    id: 'sp-3',
    author: 'Laboratorium Botani',
    title: 'Eksplorasi Keanekaragaman Endemik di Kawasan Lore Lindu',
    date: 'Aug 17',
  },
]

const recommendedTopics = [
  'Teknologi',
  'Riset Untad',
  'Kecerdasan Buatan',
  'Sulawesi Tengah',
  'Data Science',
  'Software Engineering',
  'Lingkungan Hidup',
  'Akademik',
]

const whoToFollow = [
  {
    name: 'Pusat Studi Kebencanaan Untad',
    description: 'Riset mitigasi gempa & likuefaksi Palu.',
    initials: 'PS',
  },
  {
    name: 'Himatif Untad',
    description: 'Himpunan Mahasiswa Teknologi Informasi Untad.',
    initials: 'HI',
  },
  {
    name: 'Dr. Sarah Nurhaliza',
    description: 'Dosen Teknik Informatika & Peneliti AI.',
    initials: 'SN',
  },
]

const footerLinks = [
  'Help',
  'Status',
  'About',
  'Careers',
  'Press',
  'Blog',
  'Privacy',
  'Terms',
  'Text to speech',
]

export default function DiscoveryRail() {
  return (
    <aside className="flex flex-col gap-8 py-6 text-sm">
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-text)]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
            Staff Picks
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {staffPicks.map((pick) => (
            <article key={pick.id} className="group">
              <div className="mb-1 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[9px] font-semibold text-[var(--color-text)]">
                  {pick.author.charAt(0)}
                </div>
                <span className="font-medium text-[var(--color-text)] truncate max-w-[200px]">
                  {pick.author}
                </span>
              </div>
              <a
                href={`#staff-pick-${pick.id}`}
                className="font-serif text-sm font-bold leading-snug text-[var(--color-text)] no-underline transition hover:text-[var(--color-text-secondary)]"
              >
                {pick.title}
              </a>
              <div className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                {pick.date}
              </div>
            </article>
          ))}
        </div>

        <a
          href="#staff-picks"
          className="mt-4 inline-block text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text)]"
        >
          See the full list →
        </a>
      </section>

      <section className="border-t border-[var(--color-border)] pt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
          Recommended Topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {recommendedTopics.map((topic) => (
            <a
              key={topic}
              href={`#topic-${topic.toLowerCase().replace(/\s+/g, '-')}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs text-[var(--color-text)] no-underline transition hover:border-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              <span>{topic}</span>
              <Plus className="h-3 w-3 text-[var(--color-text-muted)]" />
            </a>
          ))}
        </div>
        <a
          href="#topics"
          className="mt-4 inline-block text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text)]"
        >
          See more topics →
        </a>
      </section>

      <section className="border-t border-[var(--color-border)] pt-6">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--color-text)]">
          Who to follow
        </h2>
        <div className="flex flex-col gap-4">
          {whoToFollow.map((author) => (
            <div
              key={author.name}
              className="flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-text)]">
                  {author.initials}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-xs text-[var(--color-text)] leading-tight">
                    {author.name}
                  </span>
                  <p className="mt-0.5 text-[11px] leading-normal text-[var(--color-text-secondary)] line-clamp-2">
                    {author.description}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="shrink-0 rounded-full border border-[var(--color-text)] px-3 py-1 text-xs font-medium text-[var(--color-text)] transition hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
        <a
          href="#writers"
          className="mt-4 inline-block text-xs text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text)]"
        >
          See more suggestions →
        </a>
      </section>

      <footer className="border-t border-[var(--color-border)] pt-6">
        <nav
          aria-label="Footer links"
          className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-[var(--color-text-muted)]"
        >
          {footerLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
              className="no-underline hover:text-[var(--color-text)]"
            >
              {link}
            </a>
          ))}
        </nav>
        <p className="mt-3 text-[11px] text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} Untad Chronicle. Editorial reading
          platform.
        </p>
      </footer>
    </aside>
  )
}
