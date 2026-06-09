import { Sidebar } from '@/components/dashboard/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div className="flex h-screen bg-slate-50 dark:bg-[#0a0a0f] overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto md:pt-0 pt-16">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
