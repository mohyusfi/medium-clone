import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Header from '#/components/Header'
import Sidebar from '#/components/Sidebar'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Header onToggleSidebar={() => setIsMobileSidebarOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1340px] justify-between px-4 sm:px-6 lg:px-8">
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
        <Outlet />
      </div>
    </div>
  )
}
