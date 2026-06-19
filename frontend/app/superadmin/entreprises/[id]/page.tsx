'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { superAdminApi } from '@/lib/api'
import { ArrowLeft, Building2, Users, FileText, Receipt, TrendingUp, CreditCard } from 'lucide-react'

interface Utilisateur {
  id: string
  nom: string
  prenom: string | null
  email: string
  role: string
  actif: boolean
  dernierAcces: string | null
  createdAt: string
}

interface DevisRow {
  id: string
  reference: string
  statut: string
  totalTTC: string
  createdAt: string
}

interface FactureRow {
  id: string
  numeroFacture: string
  statut: string
  totalTTC: string
  montantPaye: string
  createdAt: string
}

interface Detail {
  id: string
  nom: string
  email: string
  telephone: string | null
  adresse: string | null
  ville: string | null
  pays: string | null
  ice: string | null
  rc: string | null
  website: string | null
  banque: string | null
  rib: string | null
  iban: string | null
  plan: string
  planDebut: string | null
  planExpiration: string | null
  createdAt: string
  utilisateurs: Utilisateur[]
  devis: DevisRow[]
  factures: FactureRow[]
  stats: {
    nombreUtilisateurs: number
    nombreDevis: number
    nombreFactures: number
    nombreClients: number
    nombrePaiements: number
    caTotal: number
    tauxConversion: number
  }
}

const PLAN_COLORS: Record<string, string> = {
  STARTER: 'bg-slate-700 text-slate-200',
  PRO: 'bg-blue-700 text-blue-100',
  BUSINESS: 'bg-purple-700 text-purple-100',
}

const STATUT_COLORS: Record<string, string> = {
  BROUILLON: 'text-slate-400',
  ENVOYE: 'text-blue-400',
  ENVOYEE: 'text-blue-400',
  ACCEPTE: 'text-green-400',
  PAYEE: 'text-green-400',
  REFUSE: 'text-red-400',
  ANNULEE: 'text-red-400',
  PARTIELLE: 'text-yellow-400',
  EN_RETARD: 'text-orange-400',
  VU: 'text-purple-400',
  VUE: 'text-purple-400',
}

function fmt(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtAmount(val: string | number) {
  return Number(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD'
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ElementType; label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-500" />
        <p className="text-slate-400 text-xs uppercase tracking-wide">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function EntrepriseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<'equipe' | 'devis' | 'factures'>('equipe')

  useEffect(() => {
    superAdminApi
      .getEntrepriseDetail(id)
      .then((res) => setDetail(res.data?.data ?? res.data))
      .catch(() => setError('Impossible de charger les données.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="py-20 text-center text-slate-500">Chargement...</div>
  if (error || !detail) return <div className="py-20 text-center text-red-400">{error ?? 'Introuvable'}</div>

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/superadmin')}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">{detail.nom}</h1>
          <p className="text-slate-400 text-sm mt-0.5">{detail.email}</p>
          {detail.telephone && <p className="text-slate-500 text-xs">{detail.telephone}</p>}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${PLAN_COLORS[detail.plan] ?? ''}`}>
            {detail.plan}
          </span>
          <span className="text-slate-500 text-xs">
            Inscrit le {fmt(detail.createdAt)}
          </span>
          {detail.planExpiration && (
            <span className="text-slate-500 text-xs">
              Plan expire le {fmt(detail.planExpiration)}
            </span>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={Users} label="Utilisateurs" value={detail.stats.nombreUtilisateurs} />
        <StatCard icon={Building2} label="Clients" value={detail.stats.nombreClients} />
        <StatCard icon={FileText} label="Devis" value={detail.stats.nombreDevis} />
        <StatCard icon={Receipt} label="Factures" value={detail.stats.nombreFactures} />
        <StatCard icon={CreditCard} label="Paiements" value={detail.stats.nombrePaiements} />
        <StatCard
          icon={TrendingUp}
          label="CA Total"
          value={fmtAmount(detail.stats.caTotal)}
          sub={`Taux conv. ${detail.stats.tauxConversion}%`}
        />
      </div>

      {/* Company info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {[
          ['ICE', detail.ice],
          ['RC', detail.rc],
          ['Ville', detail.ville],
          ['Pays', detail.pays],
          ['Site web', detail.website],
          ['Banque', detail.banque],
          ['RIB', detail.rib],
          ['IBAN', detail.iban],
        ].map(([label, val]) =>
          val ? (
            <div key={label as string}>
              <p className="text-slate-500 text-xs">{label}</p>
              <p className="text-slate-200 mt-0.5 break-all">{val}</p>
            </div>
          ) : null,
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit">
        {(['equipe', 'devis', 'factures'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {t === 'equipe' ? 'Équipe' : t === 'devis' ? 'Devis' : 'Factures'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'equipe' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Nom</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Rôle</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Dernier accès</th>
                <th className="text-center px-4 py-3">Actif</th>
              </tr>
            </thead>
            <tbody>
              {detail.utilisateurs.map((u) => (
                <tr key={u.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-slate-100">
                    {u.prenom ? `${u.prenom} ${u.nom}` : u.nom}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{u.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-500">{fmt(u.dernierAcces)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`w-2 h-2 rounded-full inline-block ${u.actif ? 'bg-green-400' : 'bg-red-500'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'devis' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Référence</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-right px-4 py-3">Total TTC</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {detail.devis.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-slate-500">Aucun devis.</td></tr>
              ) : detail.devis.map((d) => (
                <tr key={d.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-slate-100 font-mono text-xs">{d.reference}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${STATUT_COLORS[d.statut] ?? 'text-slate-400'}`}>
                    {d.statut}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-200">{fmtAmount(d.totalTTC)}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-slate-500">{fmt(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'factures' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Numéro</th>
                <th className="text-left px-4 py-3">Statut</th>
                <th className="text-right px-4 py-3">Total TTC</th>
                <th className="text-right px-4 py-3 hidden sm:table-cell">Payé</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {detail.factures.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-slate-500">Aucune facture.</td></tr>
              ) : detail.factures.map((f) => (
                <tr key={f.id} className="border-b border-slate-800 last:border-0">
                  <td className="px-4 py-3 text-slate-100 font-mono text-xs">{f.numeroFacture}</td>
                  <td className={`px-4 py-3 text-xs font-medium ${STATUT_COLORS[f.statut] ?? 'text-slate-400'}`}>
                    {f.statut}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-200">{fmtAmount(f.totalTTC)}</td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell text-green-400">{fmtAmount(f.montantPaye)}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-500">{fmt(f.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
