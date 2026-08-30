import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import FeedTabs from '../components/FeedTabs'
import ArticleListItem from '../components/ArticleListItem'
import type { ArticleItem } from '../components/ArticleListItem'
import DiscoveryRail from '../components/DiscoveryRail'

export const Route = createFileRoute('/')({ component: Home })

const sampleArticles: ArticleItem[] = [
  {
    id: '1',
    title:
      'Membedah Arsitektur TanStack Start: SSR Cepat dan Tipografi Tanpa Kerumitan',
    description:
      'Bagaimana memanfaatkan Vite 8, Nitro adapter, dan model routing berbasis berkas untuk menghasilkan pengalaman membaca digital yang instan dan responsif.',
    date: 'Aug 28',
    readTime: '6 min read',
    author: {
      name: 'Rahmat Hidayat',
      publication: 'Palu Tech Review',
    },
    topic: 'Software Engineering',
    stars: 342,
    comments: 24,
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    isMemberOnly: true,
  },
  {
    id: '2',
    title:
      'Studi Geologi Sesar Palu-Koro: Evaluasi Ketahanan Infrastruktur Sipil',
    description:
      'Hasil survei lapangan dan pemodelan mikrotremor terbaru di wilayah Lembah Palu untuk standar konstruksi tahan gempa jangka panjang.',
    date: 'Aug 25',
    readTime: '11 min read',
    author: {
      name: 'Dr. Ir. Andi M.',
      publication: 'Untad Civil Research',
    },
    topic: 'Riset Untad',
    stars: 512,
    comments: 38,
    thumbnail:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3',
    title:
      'Mengapa Tipografi Editorial Mengalahkan Pola Desain SaaS yang Klise',
    description:
      'Pentingnya kembali ke esensi publikasi digital: hierarki pembacaan alami, pembatas struktural 1px, dan penataan ruang tanpa kartu terapung yang berlebihan.',
    date: 'Aug 21',
    readTime: '5 min read',
    author: {
      name: 'Sarah Nurhaliza',
    },
    topic: 'Desain Editorial',
    stars: 218,
    comments: 15,
    thumbnail:
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '4',
    title:
      'Modernisasi Rantai Pasok Kakao Sulawesi Tengah dengan Pemantauan IoT',
    description:
      'Eksperimen lapangan pemantauan suhu dan kelembaban fermentasi biji kakao di pedalaman Sigi untuk meningkatkan nilai ekspor petani lokal.',
    date: 'Aug 18',
    readTime: '8 min read',
    author: {
      name: 'Laboratorium Agroteknologi',
      publication: 'Fakultas Pertanian Untad',
    },
    topic: 'Agrikultur',
    stars: 184,
    comments: 9,
    thumbnail:
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    isMemberOnly: true,
  },
  {
    id: '5',
    title:
      'Membangun Model Prediksi Erosi Tanah Menggunakan Citra Satelit Landsat 9',
    description:
      'Metodologi pengolahan data geospasial DAS Palu dengan algoritma Random Forest untuk mitigasi sedimentasi perairan teluk.',
    date: 'Aug 14',
    readTime: '14 min read',
    author: {
      name: 'Tim Geosains Untad',
    },
    topic: 'Data Science',
    stars: 429,
    comments: 31,
  },
]

function Home() {
  const [activeTab, setActiveTab] = useState('for-you')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const filteredArticles = sampleArticles.filter((article) => {
    if (activeTab === 'featured') {
      return (Number(article.stars) || 0) > 300
    }
    if (activeTab === 'academic') {
      return (
        article.topic === 'Riset Untad' ||
        article.topic === 'Agrikultur' ||
        article.topic === 'Data Science'
      )
    }
    if (activeTab === 'technology') {
      return (
        article.topic === 'Software Engineering' ||
        article.topic === 'Desain Editorial'
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />

      <div className="mx-auto flex max-w-[1340px] justify-center px-4 sm:px-6 lg:px-8">
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        <main className="min-w-0 max-w-[680px] flex-1 border-x-0 min-[900px]:border-x border-[var(--color-border)] px-0 min-[900px]:px-8 py-6">
          <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex flex-col">
            {filteredArticles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>

          <div className="pt-8 text-center">
            <button
              type="button"
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2 text-xs font-semibold text-[var(--color-text)] transition hover:border-[var(--color-text)] hover:bg-[var(--color-bg)]"
            >
              Load more stories
            </button>
          </div>
        </main>

        <div className="hidden min-[1200px]:block w-[320px] shrink-0 pl-8">
          <div className="sticky top-16">
            <DiscoveryRail />
          </div>
        </div>
      </div>
    </div>
  )
}
