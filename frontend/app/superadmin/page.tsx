'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { superAdminApi } from '@/lib/api'
import { Building2, Users, FileText, Receipt, TrendingUp, RefreshCw } from 'lucide-react'

interface EntrepriseRow {
  id: string
  nom: string
  email: string
  plan: 'STARTER' | 'PRO' | 'BUSINESS'
  createdAt: string
  planExpiration: string | null
  nombreUtilisateurs: number
  nombreDevis: number
  nombreFactures: number
  nombreClients: number
  enLigne: boolean
  dernierAcces: string | null
}

const PLAN_COLORS: Record<string, string> = {
  STARTER: 'bg-slate-700 text-slate-200',
  PRO: 'bg-blue-700 text-blue-100',
  BUSINESS: 'bg-purple-700 text-purple-100',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function SuperAdminPage() {
  const router = useRouter()
  const [entreprises, setEntreprises] = useState<EntrepriseRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await superAdminApi.getEntreprises()
      setEntreprises(res.data?.data ?? res.data)
    } catch {
      setError('Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filtered = entreprises.filter(
    (e) =>
      e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()),
  )

  const byPlan = {
    STARTER: entreprises.filter((e) => e.plan === 'STARTER').length,
    PRO: entreprises.filter((e) => e.plan === 'PRO').length,
    BUSINESS: entreprises.filter((e) => e.plan === 'BUSINESS').length,
  }

  return (
    <div className="space-y-6">
      {/* Stats top row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Total entreprises</p>
          <p className="text-3xl font-bold text-white">{entreprises.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">STARTER</p>
          <p className="text-3xl font-bold text-slate-300">{byPlan.STARTER}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">PRO</p>
          <p className="text-3xl font-bold text-blue-400">{byPlan.PRO}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">BUSINESS</p>
          <p className="text-3xl font-bold text-purple-400">{byPlan.BUSINESS}</p>
        </div>
      </div>

      {/* Search + refresh */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={load}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Rafraîchir
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Chargement...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-400">{error}</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Entreprise</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Plan</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Inscrit le</th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">
                  <Users className="w-4 h-4 inline" />
                </th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">
                  <FileText className="w-4 h-4 inline" />
                </th>
                <th className="text-center px-4 py-3 hidden sm:table-cell">
                  <Receipt className="w-4 h-4 inline" />
                </th>
                <th className="text-center px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    Aucune entreprise trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    onClick={() => router.push(`/superadmin/entreprises/${e.id}`)}
                    className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-100">{e.nom}</p>
                      <p className="text-slate-500 text-xs">{e.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${PLAN_COLORS[e.plan]}`}>
                        {e.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-400">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-center text-slate-300">
                      {e.nombreUtilisateurs}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-center text-slate-300">
                      {e.nombreDevis}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-center text-slate-300">
                      {e.nombreFactures}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
                          e.enLigne
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${e.enLigne ? 'bg-green-400' : 'bg-slate-500'}`}
                        />
                        {e.enLigne ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
