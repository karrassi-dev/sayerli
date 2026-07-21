'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Share2, RefreshCw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { graphApi } from '@/lib/api'
import type { GraphData } from '@/components/dashboard/ui/GraphView'

const GraphView = dynamic(() => import('@/components/dashboard/ui/GraphView'), { ssr: false })

export default function GraphePage() {
  const { t, dir } = useTranslation()
  const [data, setData] = useState<GraphData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await graphApi.getData()
      const payload = res.data?.data ?? res.data
      setData(payload)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div dir={dir}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t('graph.title')}
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 ml-11">
            {t('graph.sub')}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {t('graph.refresh')}
        </button>
      </div>

      {loading && (
        <div
          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4"
          style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}
        >
          <div className="relative w-16 h-16">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border-2 border-violet-500/40 animate-ping"
                style={{ animationDelay: `${i * 0.3}s`, animationDuration: '1.5s' }}
              />
            ))}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-violet-500 to-blue-500" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{t('graph.loading')}</p>
        </div>
      )}

      {error && !loading && (
        <div
          className="w-full rounded-2xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 flex flex-col items-center justify-center gap-3"
          style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}
        >
          <p className="text-red-600 dark:text-red-400 font-semibold">{t('graph.error')}</p>
          <button
            onClick={load}
            className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-300 underline"
          >
            {t('graph.retry')}
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <GraphView data={data} />
      )}
    </div>
  )
}
