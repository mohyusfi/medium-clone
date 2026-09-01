import { createFileRoute } from '@tanstack/react-router'
import Footer from '#/components/Footer'

export const Route = createFileRoute('/_app/about')({
  component: About,
})

function About() {
  return (
    <main className="min-w-0 w-full flex-1 px-0 py-12 min-[900px]:px-8 max-w-3xl">
      <article className="prose prose-neutral max-w-none">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)]">
          About Untad Chronicle
        </p>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl">
          A quiet, content-first editorial publication.
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          Untad Chronicle dirancang untuk menyajikan karya tulis, publikasi
          riset, dan opini mendalam dengan kenyamanan membaca setara media cetak
          modern. Fokus kami adalah hierarki tipografi murni, ritme vertikal,
          dan kejelasan konten tanpa gangguan dekorasi yang tidak perlu.
        </p>
        <hr className="my-8 border-[var(--color-border)]" />
        <h2 className="font-serif text-xl font-bold text-[var(--color-text)]">
          Prinsip Desain
        </h2>
        <ul className="list-disc pl-5 text-sm text-[var(--color-text-secondary)] space-y-2">
          <li>
            <strong>Editorial Clarity over Decoration</strong>: Konten tulisan
            adalah fokus utama.
          </li>
          <li>
            <strong>Neutral Color Palette</strong>: Dominasi monokromatis dengan
            aksen kuning terkontrol.
          </li>
          <li>
            <strong>Subtle Structural Rules</strong>: Pembatas 1px halus
            menggantikan card melayang.
          </li>
        </ul>
      </article>
      <div className="mt-12">
        <Footer />
      </div>
    </main>
  )
}
