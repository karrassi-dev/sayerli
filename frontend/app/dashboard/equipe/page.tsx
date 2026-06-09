'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  UserCog, UserPlus, Users, Shield, Trash2, Mail,
  Crown, BarChart2, Pencil, UserX, UserCheck, Search, Check,
} from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { PlanLimitModal } from '@/components/billing/PlanLimitModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { equipeApi, authApi } from '@/lib/api'
import { cn } from '@/lib/utils'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ApiMembre {
  id: string
  prenom: string | null
  nom: string
  nomComplet: string
  email: string
  telephone: string | null
  role: string
  statut: 'ACTIF' | 'EN_ATTENTE' | 'DESACTIVE'
  dernierAcces: string | null
  createdAt: string
}

interface InviteForm {
  prenom: string
  nom: string
  email: string
  telephone: string
  role: string
}

interface EditForm {
  prenom: string
  nom: string
  telephone: string
  role: string
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

type RoleKey = 'ADMIN' | 'MANAGER' | 'COMMERCIAL' | 'COMPTABLE'

const ROLE_COLORS: Record<RoleKey, string> = {
  ADMIN:      'from-primary-500 to-primary-600',
  MANAGER:    'from-teal-500 to-teal-600',
  COMMERCIAL: 'from-orange-500 to-amber-600',
  COMPTABLE:  'from-purple-500 to-violet-600',
}

const ROLE_BG: Record<RoleKey, string> = {
  ADMIN:      'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800',
  MANAGER:    'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
  COMMERCIAL: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  COMPTABLE:  'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
}

const ROLE_ICONS: Record<RoleKey, React.ElementType> = {
  ADMIN: Crown, MANAGER: BarChart2, COMMERCIAL: Users, COMPTABLE: Shield,
}

const ROLE_PERMISSIONS: Record<RoleKey, string[]> = {
  ADMIN:      ['Accès total', 'Gestion équipe', 'Paramètres', 'Facturation'],
  MANAGER:    ['Gestion clients', 'Devis & factures', 'Paiements', 'Rapports'],
  COMMERCIAL: ['Gestion clients', 'Créer des devis', 'Voir les factures'],
  COMPTABLE:  ['Voir les factures', 'Enregistrer paiements', 'Rapports financiers'],
}

const ROLES: RoleKey[] = ['ADMIN', 'MANAGER', 'COMMERCIAL', 'COMPTABLE']

const EMPTY_INVITE: InviteForm = { prenom: '', nom: '', email: '', telephone: '', role: 'COMMERCIAL' }
const EMPTY_EDIT: EditForm = { prenom: '', nom: '', telephone: '', role: 'COMMERCIAL' }

// ── Component ─────────────────────────────────────────────────────────────────

export default function EquipePage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [membres, setMembres] = useState<ApiMembre[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState<InviteForm>(EMPTY_INVITE)
  const [inviteErrors, setInviteErrors] = useState<Record<string, string>>({})
  const [limitModal, setLimitModal] = useState<{ resource: 'utilisateurs'; limite: number; actuel: number } | null>(null)

  const [editTarget, setEditTarget] = useState<ApiMembre | null>(null)
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT)
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})

  const [selectedMember, setSelectedMember] = useState<ApiMembre | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiMembre | null>(null)
  const [disableTarget, setDisableTarget] = useState<ApiMembre | null>(null)
  const [enableTarget, setEnableTarget] = useState<ApiMembre | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchMembres = useCallback(async (q?: string) => {
    setLoading(true)
    try {
      const res = await equipeApi.list(q ? { recherche: q } : undefined)
      const data = res.data?.data ?? res.data ?? []
      setMembres(Array.isArray(data) ? data : [])
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status !== 403) toastError('Erreur', 'Impossible de charger l\'équipe.')
      if (status === 403) setMembres([])
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchMembres()
    authApi.profile().then(res => {
      const u = res.data?.data ?? res.data
      setCurrentUserId(u?.id ?? null)
      setCurrentUserRole(u?.role ?? null)
    }).catch(() => {})
  }, [fetchMembres])

  useEffect(() => {
    const timer = setTimeout(() => fetchMembres(search || undefined), 300)
    return () => clearTimeout(timer)
  }, [search, fetchMembres])

  // ── Computed ───────────────────────────────────────────────────────────────

  const isAdmin = currentUserRole === 'ADMIN'
  const activeCount = membres.filter(m => m.statut === 'ACTIF').length

  // ── Role key helper ────────────────────────────────────────────────────────

  function roleKey(role: string): RoleKey {
    return (ROLES.includes(role as RoleKey) ? role : 'COMMERCIAL') as RoleKey
  }

  function statutVariant(statut: string): 'actif' | 'en_attente' | 'inactif' {
    if (statut === 'ACTIF') return 'actif'
    if (statut === 'EN_ATTENTE') return 'en_attente'
    return 'inactif'
  }

  // ── Invite ─────────────────────────────────────────────────────────────────

  function validateInvite(): boolean {
    const errors: Record<string, string> = {}
    if (!inviteForm.prenom.trim()) errors.prenom = t('pages.equipe.invite.prenomRequired')
    if (!inviteForm.nom.trim()) errors.nom = t('pages.equipe.invite.nomRequired')
    if (!inviteForm.email.trim()) errors.email = t('pages.equipe.invite.emailRequired')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.email)) errors.email = t('pages.equipe.invite.emailInvalid')
    setInviteErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleInvite() {
    if (!validateInvite()) return
    setSaving(true)
    try {
      await equipeApi.invite({
        prenom: inviteForm.prenom.trim(),
        nom: inviteForm.nom.trim(),
        email: inviteForm.email.trim(),
        telephone: inviteForm.telephone.trim() || undefined,
        role: inviteForm.role,
      })
      success(t('pages.equipe.inviteSuccess'))
      setInviteOpen(false)
      setInviteForm(EMPTY_INVITE)
      fetchMembres()
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { message?: string; errors?: { limite?: number; actuel?: number } } } }
      if (e?.response?.status === 402) {
        setInviteOpen(false)
        const errs = e.response!.data?.errors
        setLimitModal({ resource: 'utilisateurs', limite: errs?.limite ?? 1, actuel: errs?.actuel ?? 1 })
      } else {
        const msg = e?.response?.data?.message
        toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? "Impossible d'envoyer l'invitation."))
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Edit ───────────────────────────────────────────────────────────────────

  function openEdit(m: ApiMembre) {
    setEditForm({
      prenom: m.prenom ?? '',
      nom: m.nom,
      telephone: m.telephone ?? '',
      role: m.role,
    })
    setEditErrors({})
    setEditTarget(m)
  }

  function validateEdit(): boolean {
    const errors: Record<string, string> = {}
    if (!editForm.nom.trim()) errors.nom = t('pages.equipe.invite.nomRequired')
    setEditErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleEdit() {
    if (!validateEdit() || !editTarget) return
    setSaving(true)
    try {
      await equipeApi.update(editTarget.id, {
        prenom: editForm.prenom.trim() || undefined,
        nom: editForm.nom.trim(),
        telephone: editForm.telephone.trim() || undefined,
        role: editForm.role,
      })
      success(t('pages.equipe.editSuccess'))
      setEditTarget(null)
      fetchMembres()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : 'Impossible de modifier le membre.')
    } finally {
      setSaving(false)
    }
  }

  // ── Disable / Enable ───────────────────────────────────────────────────────

  async function handleDisable() {
    if (!disableTarget) return
    try {
      await equipeApi.disable(disableTarget.id)
      success(t('pages.equipe.disableSuccess'))
      setDisableTarget(null)
      if (selectedMember?.id === disableTarget.id) setSelectedMember(null)
      fetchMembres()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : 'Impossible de désactiver ce compte.')
    }
  }

  async function handleEnable() {
    if (!enableTarget) return
    try {
      await equipeApi.enable(enableTarget.id)
      success(t('pages.equipe.enableSuccess'))
      setEnableTarget(null)
      fetchMembres()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : 'Impossible de réactiver ce compte.')
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await equipeApi.delete(deleteTarget.id)
      success(t('pages.equipe.deleteSuccess'))
      setDeleteTarget(null)
      if (selectedMember?.id === deleteTarget.id) setSelectedMember(null)
      fetchMembres()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : 'Impossible de retirer ce membre.')
    }
  }

  async function handleResendInvite(membre: ApiMembre) {
    try {
      await equipeApi.resendInvite(membre.id)
      success('Invitation renvoyée', `Un email a été envoyé à ${membre.email}`)
    } catch {
      toastError('Erreur', 'Impossible de renvoyer l\'invitation.')
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <PageHeader
        title={t('pages.equipe.title')}
        sub={t('pages.equipe.sub')}
        actions={
          isAdmin ? (
            <button className="btn-primary text-sm" onClick={() => { setInviteForm(EMPTY_INVITE); setInviteErrors({}); setInviteOpen(true) }}>
              <UserPlus className="w-4 h-4" />
              {t('pages.equipe.inviteMember')}
            </button>
          ) : null
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center">
              <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.equipe.stats.total')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '—' : membres.length}</p>
        </div>
        <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-green-50 dark:bg-green-950/50 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.equipe.stats.active')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{loading ? '—' : activeCount}</p>
        </div>
        <div className="card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{t('pages.equipe.stats.roles')}</span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">4</p>
        </div>
      </div>

      {/* Search */}
      {membres.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('pages.equipe.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 transition-all"
          />
        </div>
      )}

      {loading ? (
        <div className="card rounded-2xl p-12 text-center text-slate-400 text-sm">Chargement…</div>
      ) : membres.length === 0 ? (
        <div className="card rounded-2xl">
          <EmptyState
            icon={UserCog}
            title={t('pages.equipe.empty.title')}
            desc={t('pages.equipe.empty.desc')}
            action={isAdmin ? { label: t('pages.equipe.inviteMember'), onClick: () => setInviteOpen(true) } : undefined}
            color="blue"
          />
        </div>
      ) : (
        <>
          {/* Members grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {membres.map(membre => {
              const rk = roleKey(membre.role)
              const RoleIcon = ROLE_ICONS[rk]
              const isMe = membre.id === currentUserId
              return (
                <div
                  key={membre.id}
                  className={cn('card rounded-2xl p-5 border cursor-pointer hover:shadow-lg transition-all group relative', ROLE_BG[rk])}
                  onClick={() => setSelectedMember(membre)}
                >
                  {isMe && (
                    <span className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-semibold">
                      Vous
                    </span>
                  )}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={cn('w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-105 transition-transform', ROLE_COLORS[rk])}>
                      <span className="text-white font-black text-sm">{initials(membre.nomComplet)}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{membre.nomComplet}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{membre.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge variant={membre.role.toLowerCase() as 'admin' | 'manager' | 'commercial' | 'comptable'} size="sm" />
                      {membre.statut !== 'ACTIF' && (
                        <StatusBadge variant={statutVariant(membre.statut)} size="sm" />
                      )}
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/60 dark:bg-slate-900/40 flex items-center justify-center flex-shrink-0">
                      <RoleIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/60 dark:border-slate-700/50">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {t('pages.equipe.col.joined')} {formatDate(membre.createdAt)}
                    </p>
                  </div>
                </div>
              )
            })}

            {/* Invite placeholder */}
            {isAdmin && (
              <button
                onClick={() => { setInviteForm(EMPTY_INVITE); setInviteErrors({}); setInviteOpen(true) }}
                className="card rounded-2xl p-5 border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-3 text-center hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all group min-h-[160px]"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 flex items-center justify-center transition-colors">
                  <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t('pages.equipe.inviteMember')}
                </p>
              </button>
            )}
          </div>

          {/* Role permissions reference */}
          <div className="card rounded-2xl p-6">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Permissions par rôle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ROLES.map(role => {
                const RoleIcon = ROLE_ICONS[role]
                return (
                  <div key={role} className={cn('rounded-xl p-4 border', ROLE_BG[role])}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', ROLE_COLORS[role])}>
                        <RoleIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <StatusBadge variant={role.toLowerCase() as 'admin' | 'manager' | 'commercial' | 'comptable'} size="sm" />
                    </div>
                    <ul className="space-y-1.5">
                      {ROLE_PERMISSIONS[role].map(perm => (
                        <li key={perm} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 opacity-50" />
                          {perm}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Member Detail Modal ─────────────────────────────────────────────── */}
      <Modal
        open={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.nomComplet ?? ''}
        size="md"
      >
        {selectedMember && (() => {
          const rk = roleKey(selectedMember.role)
          const RoleIcon = ROLE_ICONS[rk]
          const isMe = selectedMember.id === currentUserId
          return (
            <div className="space-y-4">
              <div className={cn('flex items-center gap-4 p-4 rounded-2xl border', ROLE_BG[rk])}>
                <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center flex-shrink-0 shadow-md', ROLE_COLORS[rk])}>
                  <span className="text-white font-black text-lg">{initials(selectedMember.nomComplet)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white">{selectedMember.nomComplet}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedMember.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <StatusBadge variant={selectedMember.role.toLowerCase() as 'admin' | 'manager' | 'commercial' | 'comptable'} />
                    <StatusBadge variant={statutVariant(selectedMember.statut)} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{t('pages.equipe.col.email')}</p>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{selectedMember.email}</p>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{t('pages.equipe.col.joined')}</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{formatDate(selectedMember.createdAt)}</p>
                </div>
                {selectedMember.telephone && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-xs text-slate-400 mb-1">Téléphone</p>
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{selectedMember.telephone}</p>
                  </div>
                )}
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">Dernier accès</p>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{formatDate(selectedMember.dernierAcces)}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <RoleIcon className="w-4 h-4 text-slate-500" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Permissions</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ROLE_PERMISSIONS[rk].map(perm => (
                    <span key={perm} className="text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">{perm}</span>
                  ))}
                </div>
              </div>

              {isAdmin && !isMe && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => { setSelectedMember(null); openEdit(selectedMember) }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                    Modifier
                  </button>
                  {selectedMember.statut === 'ACTIF' ? (
                    <button
                      onClick={() => { setSelectedMember(null); setDisableTarget(selectedMember) }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-all"
                    >
                      <UserX className="w-4 h-4" />
                      Désactiver
                    </button>
                  ) : selectedMember.statut === 'EN_ATTENTE' ? (
                    <button
                      onClick={() => { handleResendInvite(selectedMember); setSelectedMember(null) }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      Renvoyer l'invitation
                    </button>
                  ) : selectedMember.statut === 'DESACTIVE' ? (
                    <button
                      onClick={() => { setSelectedMember(null); setEnableTarget(selectedMember) }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      Réactiver
                    </button>
                  ) : null}
                  <button
                    onClick={() => { setSelectedMember(null); setDeleteTarget(selectedMember) }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Retirer
                  </button>
                </div>
              )}
            </div>
          )
        })()}
      </Modal>

      {/* ── Invite Modal ────────────────────────────────────────────────────── */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title={t('pages.equipe.invite.title')}
        size="md"
        footer={
          <>
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {t('common.cancel')}
            </button>
            <button onClick={handleInvite} disabled={saving} className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {saving ? t('pages.equipe.invite.sending') : t('pages.equipe.invite.sendInvite')}
            </button>
          </>
        }
      >
        <InviteFormFields
          form={inviteForm}
          errors={inviteErrors}
          onChange={(k, v) => { setInviteForm(f => ({ ...f, [k]: v })); setInviteErrors(e => { const n = { ...e }; delete n[k]; return n }) }}
          t={t}
        />
      </Modal>

      {/* ── Edit Modal ──────────────────────────────────────────────────────── */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={t('pages.equipe.edit.title')}
        size="md"
        footer={
          <>
            <button onClick={() => setEditTarget(null)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              {t('common.cancel')}
            </button>
            <button onClick={handleEdit} disabled={saving} className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0">
              {saving ? t('common.saving') : t('common.save')}
            </button>
          </>
        }
      >
        {editTarget && (
          <EditFormFields
            form={editForm}
            errors={editErrors}
            onChange={(k, v) => { setEditForm(f => ({ ...f, [k]: v })); setEditErrors(e => { const n = { ...e }; delete n[k]; return n }) }}
            t={t}
          />
        )}
      </Modal>

      {/* ── Disable Modal ───────────────────────────────────────────────────── */}
      <ConfirmModal
        open={!!disableTarget}
        onClose={() => setDisableTarget(null)}
        onConfirm={handleDisable}
        title={t('pages.equipe.disableTitle')}
        message={t('pages.equipe.disableMessage').replace('{nom}', disableTarget?.nomComplet ?? '')}
        confirmLabel="Désactiver"
        danger
      />

      {/* ── Enable Modal ────────────────────────────────────────────────────── */}
      <ConfirmModal
        open={!!enableTarget}
        onClose={() => setEnableTarget(null)}
        onConfirm={handleEnable}
        title={t('pages.equipe.enableTitle')}
        message={t('pages.equipe.enableMessage').replace('{nom}', enableTarget?.nomComplet ?? '')}
        confirmLabel="Réactiver"
      />

      {/* ── Delete Modal ────────────────────────────────────────────────────── */}
      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.equipe.deleteTitle')}
        message={t('pages.equipe.deleteMessage').replace('{nom}', deleteTarget?.nomComplet ?? '')}
        confirmLabel="Retirer"
        danger
      />

      {limitModal && (
        <PlanLimitModal
          open={!!limitModal}
          onClose={() => setLimitModal(null)}
          resource={limitModal.resource}
          limite={limitModal.limite}
          actuel={limitModal.actuel}
        />
      )}
    </div>
  )
}

// ── InviteFormFields ──────────────────────────────────────────────────────────

type RoleKey2 = 'ADMIN' | 'MANAGER' | 'COMMERCIAL' | 'COMPTABLE'

const ROLE_COLORS2: Record<RoleKey2, string> = {
  ADMIN: 'from-primary-500 to-primary-600',
  MANAGER: 'from-teal-500 to-teal-600',
  COMMERCIAL: 'from-orange-500 to-amber-600',
  COMPTABLE: 'from-purple-500 to-violet-600',
}
const ROLE_BG2: Record<RoleKey2, string> = {
  ADMIN: 'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800',
  MANAGER: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
  COMMERCIAL: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  COMPTABLE: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
}
const ROLE_ICONS2: Record<RoleKey2, React.ElementType> = {
  ADMIN: Crown, MANAGER: BarChart2, COMMERCIAL: Users, COMPTABLE: Shield,
}

interface InviteFormFieldsProps {
  form: InviteForm
  errors: Record<string, string>
  onChange: (key: keyof InviteForm, val: string) => void
  t: (k: string) => string
}

function InviteFormFields({ form, errors, onChange, t }: InviteFormFieldsProps) {
  const inputClass = (err?: string) => cn(
    'w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all',
    err
      ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20'
      : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-400',
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.equipe.invite.prenom')} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.prenom} onChange={e => onChange('prenom', e.target.value)} className={inputClass(errors.prenom)} placeholder="Mohammed" />
          {errors.prenom && <p className="text-xs text-red-500 mt-1">{errors.prenom}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.equipe.invite.nom')} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.nom} onChange={e => onChange('nom', e.target.value)} className={inputClass(errors.nom)} placeholder="Benali" />
          {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.equipe.invite.email')} <span className="text-red-500">*</span>
        </label>
        <input type="email" value={form.email} onChange={e => onChange('email', e.target.value)} className={inputClass(errors.email)} placeholder="collaborateur@entreprise.ma" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.equipe.invite.phone')}
        </label>
        <input type="tel" value={form.telephone} onChange={e => onChange('telephone', e.target.value)} className={inputClass()} placeholder="+212 6XX XXX XXX" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          {t('pages.equipe.invite.role')} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['ADMIN', 'MANAGER', 'COMMERCIAL', 'COMPTABLE'] as RoleKey2[]).map(role => {
            const RoleIcon = ROLE_ICONS2[role]
            const isSelected = form.role === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => onChange('role', role)}
                className={cn(
                  'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all relative',
                  isSelected
                    ? cn('border-2', ROLE_BG2[role])
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', ROLE_COLORS2[role])}>
                  <RoleIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t(`pages.equipe.roles.${role.toLowerCase()}.label`)}</p>
                  <p className="text-xs text-slate-400 truncate">{t(`pages.equipe.roles.${role.toLowerCase()}.desc`)}</p>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-start gap-2.5">
        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          {t('pages.equipe.invite.emailHint')}
        </p>
      </div>
    </div>
  )
}

// ── EditFormFields ────────────────────────────────────────────────────────────

interface EditFormFieldsProps {
  form: EditForm
  errors: Record<string, string>
  onChange: (key: keyof EditForm, val: string) => void
  t: (k: string) => string
}

function EditFormFields({ form, errors, onChange, t }: EditFormFieldsProps) {
  const inputClass = (err?: string) => cn(
    'w-full px-3 py-2.5 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-all',
    err
      ? 'border-red-300 dark:border-red-600 focus:ring-red-500/20'
      : 'border-slate-200 dark:border-slate-700 focus:ring-primary-500/20 focus:border-primary-400',
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.equipe.invite.prenom')}
          </label>
          <input type="text" value={form.prenom} onChange={e => onChange('prenom', e.target.value)} className={inputClass()} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            {t('pages.equipe.invite.nom')} <span className="text-red-500">*</span>
          </label>
          <input type="text" value={form.nom} onChange={e => onChange('nom', e.target.value)} className={inputClass(errors.nom)} />
          {errors.nom && <p className="text-xs text-red-500 mt-1">{errors.nom}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
          {t('pages.equipe.invite.phone')}
        </label>
        <input type="tel" value={form.telephone} onChange={e => onChange('telephone', e.target.value)} className={inputClass()} placeholder="+212 6XX XXX XXX" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          {t('pages.equipe.invite.role')} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['ADMIN', 'MANAGER', 'COMMERCIAL', 'COMPTABLE'] as RoleKey2[]).map(role => {
            const RoleIcon = ROLE_ICONS2[role]
            const isSelected = form.role === role
            return (
              <button
                key={role}
                type="button"
                onClick={() => onChange('role', role)}
                className={cn(
                  'flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all relative',
                  isSelected
                    ? cn('border-2', ROLE_BG2[role])
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                )}
              >
                <div className={cn('w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0', ROLE_COLORS2[role])}>
                  <RoleIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{t(`pages.equipe.roles.${role.toLowerCase()}.label`)}</p>
                  <p className="text-xs text-slate-400 truncate">{t(`pages.equipe.roles.${role.toLowerCase()}.desc`)}</p>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
