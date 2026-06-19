export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 px-6 py-4 flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest bg-red-600 text-white px-2 py-0.5 rounded">
            Super Admin
          </span>
          <span className="text-slate-400 text-sm font-medium">Sayerli — Console interne</span>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </div>
    </>
  )
}
