'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import {
  FileText, Receipt, CheckCircle, XCircle, Clock, AlertCircle,
  Mail, Phone, Globe, Loader2, Check, ArrowRight, ExternalLink,
  Sun, Moon,
} from 'lucide-react'
import { portalApi } from '@/lib/api'

// ── Helpers ───────────────────────────────────────────────────────────────────

function n(v: number | string) { return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0) }

function formatMAD(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire', CASH: 'Espèces', CHEQUE: 'Chèque',
  CARTE: 'Carte bancaire', MOBILE: 'Mobile', AUTRE: 'Autre',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalPaiement {
  id: string; montant: number | string; methode: string
  datePaiement: string; reference: string | null
}
interface PortalDevis {
  id: string; reference: string; statut: string
  totalHT: number | string; remise: number | string
  taxe: number | string; totalTTC: number | string
  dateExpiration: string | null; dateAcceptation: string | null
  dateRefus: string | null; createdAt: string; notes: string | null
  lienPublic: { token: string; expiration: string } | null
}
interface PortalFacture {
  id: string; numeroFacture: string; statut: string
  totalHT: number | string; taxe: number | string
  totalTTC: number | string; montantPaye: number | string
  dateEcheance: string | null; createdAt: string
  publicToken: string; paiements: PortalPaiement[]
}
interface PortalData {
  id: string; nom: string; email: string | null
  telephone: string | null; nomEntreprise: string | null
  entreprise: {
    nom: string; logo: string | null; couleurPrimaire: string | null
    email: string | null; telephone: string | null
    adresse: string | null; website: string | null
  }
  devis: PortalDevis[]; factures: PortalFacture[]
}

// ── Status config ─────────────────────────────────────────────────────────────

type StatusInfo = { label: string; lightBg: string; lightText: string; darkBg: string; darkText: string; icon: React.ElementType }

const DEVIS_STATUS: Record<string, StatusInfo> = {
  ENVOYE:  { label: 'En attente', lightBg: '#eff6ff', lightText: '#1d4ed8', darkBg: '#1e3a5f', darkText: '#93c5fd', icon: Clock },
  VU:      { label: 'Consulté',   lightBg: '#f5f3ff', lightText: '#7c3aed', darkBg: '#3b1f6e', darkText: '#c4b5fd', icon: Clock },
  ACCEPTE: { label: 'Accepté',    lightBg: '#f0fdf4', lightText: '#15803d', darkBg: '#14432a', darkText: '#86efac', icon: CheckCircle },
  REFUSE:  { label: 'Refusé',     lightBg: '#fef2f2', lightText: '#dc2626', darkBg: '#4c1d1d', darkText: '#fca5a5', icon: XCircle },
  EXPIRE:  { label: 'Expiré',     lightBg: '#f1f5f9', lightText: '#64748b', darkBg: '#334155', darkText: '#94a3b8', icon: AlertCircle },
}

const FACTURE_STATUS: Record<string, StatusInfo> = {
  ENVOYEE:   { label: 'À régler',  lightBg: '#eff6ff', lightText: '#1d4ed8', darkBg: '#1e3a5f', darkText: '#93c5fd', icon: Clock },
  VUE:       { label: 'Vue',       lightBg: '#f5f3ff', lightText: '#7c3aed', darkBg: '#3b1f6e', darkText: '#c4b5fd', icon: Clock },
  PARTIELLE: { label: 'Partielle', lightBg: '#fffbeb', lightText: '#b45309', darkBg: '#4a2c0a', darkText: '#fcd34d', icon: AlertCircle },
  EN_RETARD: { label: 'En retard', lightBg: '#fef2f2', lightText: '#dc2626', darkBg: '#4c1d1d', darkText: '#fca5a5', icon: AlertCircle },
  PAYEE:     { label: 'Payée',     lightBg: '#f0fdf4', lightText: '#15803d', darkBg: '#14432a', darkText: '#86efac', icon: CheckCircle },
}

function Badge({ info, dark }: { info: StatusInfo; dark: boolean }) {
  const Icon = info.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
      style={{ backgroundColor: dark ? info.darkBg : info.lightBg, color: dark ? info.darkText : info.lightText }}
    >
      <Icon className="w-3 h-3" />
      {info.label}
    </span>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PortalPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData]           = useState<PortalData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [accepting, setAccepting] = useState<string | null>(null)
  const [accepted, setAccepted]   = useState<Set<string>>(new Set())
  const [tab, setTab]             = useState<'factures' | 'devis' | 'recus'>('factures')
  const [dark, setDark]           = useState(false)

  useEffect(() => {
    if (localStorage.getItem('portal-theme') === 'dark') setDark(true)
  }, [])

  const toggleDark = () => setDark(prev => {
    localStorage.setItem('portal-theme', !prev ? 'dark' : 'light')
    return !prev
  })

  const fetchPortal = useCallback(async () => {
    try {
      const res = await portalApi.get(token)
      setData(res.data?.data ?? res.data)
    } catch { setError(true) }
    finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetchPortal() }, [fetchPortal])

  const handleAccept = async (devisId: string) => {
    setAccepting(devisId)
    try {
      await portalApi.acceptDevis(token, devisId)
      setAccepted(prev => new Set([...prev, devisId]))
      setData(prev => prev ? {
        ...prev,
        devis: prev.devis.map(d => d.id === devisId ? { ...d, statut: 'ACCEPTE' } : d),
      } : prev)
    } catch { /* ignore */ }
    finally { setAccepting(null) }
  }

  // ── Theme tokens ──
  const t = {
    bg:          dark ? '#0f172a' : '#f8fafc',
    headerBg:    dark ? '#1e293b' : '#ffffff',
    headerBorder:dark ? '#334155' : '#e2e8f0',
    card:        dark ? '#1e293b' : '#ffffff',
    cardBorder:  dark ? '#334155' : '#e2e8f0',
    tabBar:      dark ? '#1e293b' : '#f1f5f9',
    tabActive:   dark ? '#334155' : '#ffffff',
    tabText:     dark ? '#94a3b8' : '#64748b',
    tabActiveText:dark ? '#f1f5f9' : '#0f172a',
    text:        dark ? '#f1f5f9' : '#0f172a',
    textSub:     dark ? '#94a3b8' : '#64748b',
    textMuted:   dark ? '#64748b' : '#94a3b8',
    border:      dark ? '#334155' : '#e2e8f0',
    inputBg:     dark ? '#334155' : '#f8fafc',
    iconBg:      dark ? '#334155' : '#f1f5f9',
    btnBorder:   dark ? '#475569' : '#e2e8f0',
    btnText:     dark ? '#cbd5e1' : '#475569',
    btnHover:    dark ? '#334155' : '#f8fafc',
    progressBg:  dark ? '#334155' : '#f1f5f9',
    greenBg:     dark ? '#14432a' : '#f0fdf4',
    greenText:   dark ? '#86efac' : '#15803d',
    amberBg:     dark ? '#4a2c0a' : '#fffbeb',
    amberText:   dark ? '#fcd34d' : '#b45309',
    summaryText: dark ? '#f1f5f9' : '#0f172a',
  }

  const brand = data?.entreprise.couleurPrimaire || '#6366f1'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: dark ? '#0f172a' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 style={{ width: 32, height: 32, color: '#94a3b8', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  if (error || !data) return (
    <div style={{ minHeight: '100vh', background: dark ? '#0f172a' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ textAlign: 'center', maxWidth: 320 }}>
        <AlertCircle style={{ width: 48, height: 48, color: '#94a3b8', margin: '0 auto 16px' }} />
        <p style={{ color: t.text, fontWeight: 600, marginBottom: 8 }}>Portail introuvable</p>
        <p style={{ color: t.textSub, fontSize: 14 }}>Ce lien portail est invalide ou a été désactivé.</p>
      </div>
    </div>
  )

  const allRecus: { facture: PortalFacture; paiement: PortalPaiement }[] = []
  data.factures.forEach(f => f.paiements?.forEach(p => allRecus.push({ facture: f, paiement: p })))
  allRecus.sort((a, b) => new Date(b.paiement.datePaiement).getTime() - new Date(a.paiement.datePaiement).getTime())

  const tabs = [
    { key: 'factures' as const, label: 'Factures', count: data.factures.length, icon: Receipt },
    { key: 'devis'    as const, label: 'Devis',    count: data.devis.length,    icon: FileText },
    { key: 'recus'    as const, label: 'Reçus',    count: allRecus.length,      icon: CheckCircle },
  ]

  return (
    <div style={{ minHeight: '100vh', background: t.bg, transition: 'background .2s, color .2s' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}`,
        transition: 'background .2s',
      }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          {data.entreprise.logo ? (
            <img src={data.entreprise.logo} alt={data.entreprise.nom} style={{ height: 32, width: 'auto', objectFit: 'contain', borderRadius: 6 }} />
          ) : (
            <div style={{ width: 32, height: 32, borderRadius: 8, background: brand, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {data.entreprise.nom.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 700, color: t.text, fontSize: 14, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.entreprise.nom}</p>
            <p style={{ fontSize: 11, color: t.textMuted }}>Espace client</p>
          </div>
          {/* Toggle */}
          <button
            onClick={toggleDark}
            title={dark ? 'Mode clair' : 'Mode sombre'}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              border: `1px solid ${t.headerBorder}`,
              background: t.inputBg, color: t.textSub,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background .2s',
            }}
          >
            {dark ? <Sun style={{ width: 15, height: 15 }} /> : <Moon style={{ width: 15, height: 15 }} />}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── WELCOME ── */}
        <div style={{ paddingTop: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0 }}>
            Bonjour, {data.nomEntreprise || data.nom} 👋
          </h1>
          <p style={{ fontSize: 14, color: t.textSub, marginTop: 4 }}>
            Retrouvez ici tous vos documents avec {data.entreprise.nom}.
          </p>
        </div>

        {/* ── SUMMARY ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: data.factures.length !== 1 ? 'Factures' : 'Facture', value: data.factures.length, color: t.summaryText },
            { label: 'Devis', value: data.devis.length, color: t.summaryText },
            { label: allRecus.length !== 1 ? 'Reçus' : 'Reçu', value: allRecus.length, color: dark ? '#86efac' : '#16a34a' },
          ].map(item => (
            <div key={item.label} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: 12, textAlign: 'center', transition: 'background .2s' }}>
              <p style={{ fontSize: 22, fontWeight: 900, color: item.color, margin: 0 }}>{item.value}</p>
              <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{item.label}</p>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', gap: 4, background: t.tabBar, borderRadius: 14, padding: 4, transition: 'background .2s' }}>
          {tabs.map(tb => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '8px 6px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, transition: 'all .15s',
                background: tab === tb.key ? t.tabActive : 'transparent',
                color: tab === tb.key ? t.tabActiveText : t.tabText,
                boxShadow: tab === tb.key ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <tb.icon style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tb.label}</span>
              {tb.count > 0 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, borderRadius: 999,
                  width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: tab === tb.key ? (dark ? '#334155' : '#e2e8f0') : (dark ? '#334155' : '#e2e8f0'),
                  color: t.textSub,
                }}>
                  {tb.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── FACTURES ── */}
        {tab === 'factures' && (
          <section>
            <SectionTitle icon={Receipt} title="Factures" count={data.factures.length} brand={brand} t={t} />
            {data.factures.length === 0
              ? <Empty message="Aucune facture pour le moment." t={t} />
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {data.factures.map(facture => {
                    const status = FACTURE_STATUS[facture.statut] ?? FACTURE_STATUS['ENVOYEE']
                    const montantPaye = n(facture.montantPaye)
                    const totalTTC   = n(facture.totalTTC)
                    const restant    = Math.max(0, totalTTC - montantPaye)
                    const progress   = totalTTC > 0 ? Math.min(100, (montantPaye / totalTTC) * 100) : 0
                    const isPayee    = facture.statut === 'PAYEE'
                    const isOverdue  = facture.statut === 'EN_RETARD'
                    const accent     = isPayee ? '#10b981' : isOverdue ? '#ef4444' : brand
                    return (
                      <div key={facture.id} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: 'hidden', transition: 'background .2s' }}>
                        <div style={{ height: 3, background: accent }} />
                        <div style={{ padding: 16 }}>
                          {/* Header row */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: isPayee ? (dark ? '#14432a' : '#f0fdf4') : t.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Receipt style={{ width: 15, height: 15, color: isPayee ? (dark ? '#86efac' : '#16a34a') : t.textSub }} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{facture.numeroFacture}</p>
                                <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                                  {facture.dateEcheance ? `Échéance ${formatDate(facture.dateEcheance)}` : formatDate(facture.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Badge info={status} dark={dark} />
                          </div>
                          {/* Amount */}
                          <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 20, fontWeight: 900, color: t.text, margin: 0 }}>{formatMAD(totalTTC)}</p>
                            {facture.statut === 'PARTIELLE' && (
                              <p style={{ fontSize: 11, color: dark ? t.amberText : '#b45309', marginTop: 3 }}>
                                Payé {formatMAD(montantPaye)} · Reste {formatMAD(restant)}
                              </p>
                            )}
                          </div>
                          {/* Progress */}
                          {facture.statut === 'PARTIELLE' && (
                            <div style={{ height: 4, background: t.progressBg, borderRadius: 4, marginBottom: 12, overflow: 'hidden' }}>
                              <div style={{ height: '100%', background: '#f59e0b', borderRadius: 4, width: `${progress}%` }} />
                            </div>
                          )}
                          {isPayee && (
                            <div style={{ height: 4, background: dark ? '#14432a' : '#d1fae5', borderRadius: 4, marginBottom: 12 }}>
                              <div style={{ height: '100%', background: '#10b981', borderRadius: 4, width: '100%' }} />
                            </div>
                          )}
                          {/* Action */}
                          <a
                            href={`/public/factures/${facture.publicToken}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: `1px solid ${t.btnBorder}`, background: 'transparent', color: t.btnText, fontSize: 12, fontWeight: 600, textDecoration: 'none', transition: 'background .15s' }}
                          >
                            <ExternalLink style={{ width: 13, height: 13 }} />
                            Voir la facture
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </section>
        )}

        {/* ── DEVIS ── */}
        {tab === 'devis' && (
          <section>
            <SectionTitle icon={FileText} title="Devis" count={data.devis.length} brand={brand} t={t} />
            {data.devis.length === 0
              ? <Empty message="Aucun devis pour le moment." t={t} />
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {data.devis.map(devis => {
                    const isExpired  = !!(devis.dateExpiration && new Date(devis.dateExpiration) < new Date())
                    const st         = isExpired && devis.statut !== 'ACCEPTE' ? 'EXPIRE' : devis.statut
                    const status     = DEVIS_STATUS[st] ?? DEVIS_STATUS['ENVOYE']
                    const canAccept  = !isExpired && !accepted.has(devis.id) && !['ACCEPTE', 'REFUSE', 'EXPIRE'].includes(devis.statut)
                    const isAccepted = accepted.has(devis.id) || devis.statut === 'ACCEPTE'
                    return (
                      <div key={devis.id} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: 'hidden', transition: 'background .2s' }}>
                        <div style={{ height: 3, background: isAccepted ? '#10b981' : brand }} />
                        <div style={{ padding: 16 }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                              <div style={{ width: 32, height: 32, borderRadius: 8, background: `${brand}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText style={{ width: 15, height: 15, color: brand }} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{devis.reference}</p>
                                <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                                  {devis.dateExpiration ? `Valable jusqu'au ${formatDate(devis.dateExpiration)}` : formatDate(devis.createdAt)}
                                </p>
                              </div>
                            </div>
                            <Badge info={status} dark={dark} />
                          </div>
                          <div style={{ marginBottom: 12 }}>
                            <p style={{ fontSize: 20, fontWeight: 900, color: t.text, margin: 0 }}>{formatMAD(devis.totalTTC)}</p>
                            {n(devis.remise) > 0 && <p style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>Remise : {formatMAD(devis.remise)}</p>}
                          </div>
                          {devis.notes && (
                            <p style={{ fontSize: 12, color: t.textSub, background: t.inputBg, borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>{devis.notes}</p>
                          )}
                          <div style={{ display: 'flex', gap: 8 }}>
                            {devis.lienPublic && (
                              <a
                                href={`/public/devis/${devis.lienPublic.token}`}
                                target="_blank" rel="noopener noreferrer"
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: `1px solid ${t.btnBorder}`, color: t.btnText, fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                              >
                                <ExternalLink style={{ width: 13, height: 13 }} />
                                Voir le détail
                              </a>
                            )}
                            {canAccept && (
                              <button
                                onClick={() => handleAccept(devis.id)}
                                disabled={accepting === devis.id}
                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, border: 'none', background: brand, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: accepting === devis.id ? 0.7 : 1 }}
                              >
                                {accepting === devis.id ? <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} /> : <Check style={{ width: 13, height: 13 }} />}
                                {accepting === devis.id ? 'En cours…' : 'Accepter'}
                              </button>
                            )}
                            {isAccepted && (
                              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: dark ? '#14432a' : '#f0fdf4', color: dark ? '#86efac' : '#15803d', fontSize: 12, fontWeight: 600 }}>
                                <CheckCircle style={{ width: 13, height: 13 }} /> Accepté
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }
          </section>
        )}

        {/* ── REÇUS ── */}
        {tab === 'recus' && (
          <section>
            <SectionTitle icon={CheckCircle} title="Reçus de paiement" count={allRecus.length} brand="#10b981" t={t} />
            {allRecus.length === 0
              ? <Empty message="Aucun reçu disponible pour le moment." t={t} />
              : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {allRecus.map(({ facture, paiement }) => (
                    <div key={paiement.id} style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, overflow: 'hidden', transition: 'background .2s' }}>
                      <div style={{ height: 3, background: '#10b981' }} />
                      <div style={{ padding: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: dark ? '#14432a' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <CheckCircle style={{ width: 15, height: 15, color: dark ? '#86efac' : '#16a34a' }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: t.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{facture.numeroFacture}</p>
                            <p style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{formatDate(paiement.datePaiement)}</p>
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, background: dark ? '#14432a' : '#f0fdf4', color: dark ? '#86efac' : '#15803d', padding: '2px 8px', borderRadius: 999 }}>Reçu</span>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <p style={{ fontSize: 20, fontWeight: 900, color: dark ? '#86efac' : '#16a34a', margin: 0 }}>{formatMAD(paiement.montant)}</p>
                          <p style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>
                            {METHODE_LABELS[paiement.methode] ?? paiement.methode}
                            {paiement.reference ? ` · ${paiement.reference}` : ''}
                          </p>
                        </div>
                        <a
                          href={`/public/factures/${facture.publicToken}/recu?p=${paiement.id}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', borderRadius: 8, background: '#16a34a', color: '#fff', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}
                        >
                          <ArrowRight style={{ width: 13, height: 13 }} />
                          Voir &amp; télécharger le reçu
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </section>
        )}

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: `1px solid ${t.border}`, paddingTop: 20, paddingBottom: 24 }}>
          <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 12, fontWeight: 600 }}>Nous contacter</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {data.entreprise.email && (
              <a href={`mailto:${data.entreprise.email}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textSub, textDecoration: 'none' }}>
                <Mail style={{ width: 13, height: 13 }} /> {data.entreprise.email}
              </a>
            )}
            {data.entreprise.telephone && (
              <a href={`tel:${data.entreprise.telephone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textSub, textDecoration: 'none' }}>
                <Phone style={{ width: 13, height: 13 }} /> {data.entreprise.telephone}
              </a>
            )}
            {data.entreprise.website && (
              <a href={data.entreprise.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.textSub, textDecoration: 'none' }}>
                <Globe style={{ width: 13, height: 13 }} /> Site web
              </a>
            )}
          </div>
          <p style={{ fontSize: 11, color: t.textMuted, marginTop: 20 }}>Propulsé par Sayerli</p>
        </footer>

      </main>
    </div>
  )
}

// ── Small sub-components ──────────────────────────────────────────────────────

function SectionTitle({ icon: Icon, title, count, brand, t }: {
  icon: React.ElementType; title: string; count: number; brand: string
  t: { text: string; textMuted: string }
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: `${brand}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon style={{ width: 17, height: 17, color: brand }} />
      </div>
      <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{title}</span>
      <span style={{ fontSize: 13, color: t.textMuted }}>({count})</span>
    </div>
  )
}

function Empty({ message, t }: { message: string; t: { card: string; cardBorder: string; textMuted: string } }) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.cardBorder}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center' }}>
      <p style={{ fontSize: 14, color: t.textMuted }}>{message}</p>
    </div>
  )
}
