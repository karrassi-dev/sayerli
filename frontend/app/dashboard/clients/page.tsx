'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Users, UserPlus, Eye, Pencil, Trash2, Phone, Mail, Building2, TrendingUp, AlertCircle } from 'lucide-react'
import { PageHeader } from '@/components/dashboard/ui/PageHeader'
import { StatsCard } from '@/components/dashboard/ui/StatsCard'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { SearchFilter } from '@/components/dashboard/ui/SearchFilter'
import { ActionMenu } from '@/components/dashboard/ui/ActionMenu'
import { Pagination } from '@/components/dashboard/ui/Pagination'
import { EmptyState } from '@/components/dashboard/ui/EmptyState'
import { Modal, ConfirmModal } from '@/components/dashboard/ui/Modal'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { PlanLimitModal } from '@/components/billing/PlanLimitModal'
import { useTranslation } from '@/hooks/useTranslation'
import { useToast } from '@/hooks/useToast'
import { clientsApi } from '@/lib/api'
import { cn } from '@/lib/utils'

interface ApiClient {
  id: string
  nom: string
  email: string | null
  telephone: string | null
  nomEntreprise: string | null
  notes: string | null
  actif: boolean
  createdAt: string
  updatedAt: string
  _count?: { devis: number; factures: number }
}

interface ClientForm {
  nom: string
  email: string
  telephone: string
  nomEntreprise: string
  notes: string
}

const EMPTY_FORM: ClientForm = { nom: '', email: '', telephone: '', nomEntreprise: '', notes: '' }
const PER_PAGE = 6

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}

function initials(nom: string) {
  return nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

function ClientFormFields({
  form, formErrors, onChange,
}: {
  form: ClientForm
  formErrors: Record<string, string>
  onChange: (field: keyof ClientForm, value: string) => void
}) {
  const { t } = useTranslation()
  const inputClass = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
  const labelClass = 'text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block'

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          {t('pages.clients.form.nom')} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.nom}
          onChange={e => onChange('nom', e.target.value)}
          className={inputClass}
          autoFocus
        />
        {formErrors.nom && (
          <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />{formErrors.nom}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('pages.clients.form.email')}</label>
          <input
            type="email"
            value={form.email}
            onChange={e => onChange('email', e.target.value)}
            className={inputClass}
          />
          {formErrors.email && (
            <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" />{formErrors.email}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>{t('pages.clients.form.phone')}</label>
          <input
            type="tel"
            value={form.telephone}
            onChange={e => onChange('telephone', e.target.value)}
            placeholder="+212 6 XX XX XX XX"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('pages.clients.form.company')}</label>
        <input
          type="text"
          value={form.nomEntreprise}
          onChange={e => onChange('nomEntreprise', e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>{t('pages.clients.form.notes')}</label>
        <textarea
          value={form.notes}
          onChange={e => onChange('notes', e.target.value)}
          rows={3}
          placeholder={t('pages.clients.form.notesPlaceholder')}
          className={cn(inputClass, 'resize-none')}
        />
      </div>
    </div>
  )
}

export default function ClientsPage() {
  const { t } = useTranslation()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const [clients, setClients] = useState<ApiClient[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState(false)

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [page, setPage] = useState(1)

  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ApiClient | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ApiClient | null>(null)
  const [limitModal, setLimitModal] = useState<{ resource: 'clients'; limite: number; actuel: number } | null>(null)

  const [form, setForm] = useState<ClientForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchClients = useCallback(async (q?: string) => {
    setLoading(true)
    setApiError(false)
    try {
      const res = await clientsApi.list(q)
      const data = res.data?.data ?? res.data
      setClients(Array.isArray(data) ? data : [])
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchClients() }, [fetchClients])

  const [pendingCreate, setPendingCreate] = useState(false)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('action') === 'create') {
      setPendingCreate(true)
      window.history.replaceState(null, '', '/dashboard/clients')
    }
  }, [])
  useEffect(() => {
    if (pendingCreate && !loading) { setPendingCreate(false); openCreate() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingCreate, loading])

  const handleSearch = (v: string) => {
    setSearch(v)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => fetchClients(v.trim() || undefined), 400)
  }

  const handleFilterChange = (k: string, v: string) => {
    setFilters(f => ({ ...f, [k]: v }))
    setPage(1)
  }

  // Client-side status filter on top of server-side search results
  const filtered = clients.filter(c => {
    const status = c.actif ? 'actif' : 'inactif'
    return !filters.status || status === filters.status
  })
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const stats = {
    total: clients.length,
    actifs: clients.filter(c => c.actif).length,
    newThisMonth: clients.filter(c => new Date(c.createdAt) >= thisMonthStart).length,
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!form.nom.trim()) errors.nom = t('pages.clients.form.nomRequired')
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      errors.email = t('pages.clients.form.emailInvalid')
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleFormChange = (field: keyof ClientForm, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    if (formErrors[field]) setFormErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setFormErrors({})
    setCreateOpen(true)
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setSaving(true)
    try {
      const payload: Record<string, string> = { nom: form.nom.trim() }
      if (form.email.trim()) payload.email = form.email.trim()
      if (form.telephone.trim()) payload.telephone = form.telephone.trim()
      if (form.nomEntreprise.trim()) payload.nomEntreprise = form.nomEntreprise.trim()
      if (form.notes.trim()) payload.notes = form.notes.trim()
      await clientsApi.create(payload)
      setCreateOpen(false)
      success(t('pages.clients.createSuccess'))
      fetchClients(search.trim() || undefined)
    } catch (err: unknown) {
      const e = err as { response?: { status?: number; data?: { code?: string; message?: string | string[]; limite?: number; actuel?: number } } }
      if (e?.response?.status === 402 || e?.response?.data?.code === 'PLAN_LIMIT') {
        setCreateOpen(false)
        setLimitModal({ resource: 'clients', limite: e.response!.data?.limite ?? 5, actuel: e.response!.data?.actuel ?? 5 })
      } else {
        const msg = e?.response?.data?.message
        toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Une erreur est survenue.'))
      }
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (c: ApiClient) => {
    setForm({
      nom: c.nom,
      email: c.email ?? '',
      telephone: c.telephone ?? '',
      nomEntreprise: c.nomEntreprise ?? '',
      notes: c.notes ?? '',
    })
    setFormErrors({})
    setSelectedClient(null)
    setEditTarget(c)
  }

  const handleEdit = async () => {
    if (!editTarget || !validateForm()) return
    setSaving(true)
    try {
      const payload: Record<string, string | undefined> = {
        nom: form.nom.trim(),
        email: form.email.trim() || undefined,
        telephone: form.telephone.trim() || undefined,
        nomEntreprise: form.nomEntreprise.trim() || undefined,
        notes: form.notes.trim() || undefined,
      }
      await clientsApi.update(editTarget.id, payload)
      setEditTarget(null)
      success(t('pages.clients.editSuccess'))
      fetchClients(search.trim() || undefined)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string | string[] } } }
      const msg = e?.response?.data?.message
      toastError('Erreur', Array.isArray(msg) ? msg.join(', ') : (msg ?? 'Une erreur est survenue.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await clientsApi.delete(deleteTarget.id)
      setDeleteTarget(null)
      success(t('pages.clients.deleteSuccess'))
      fetchClients(search.trim() || undefined)
    } catch {
      toastError('Erreur', 'Impossible de supprimer ce client.')
    } finally {
      setDeleting(false)
    }
  }

  const formFooter = (onSubmit: () => void) => (
    <>
      <button
        onClick={() => { setCreateOpen(false); setEditTarget(null) }}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
      >
        {t('common.cancel')}
      </button>
      <button
        onClick={onSubmit}
        disabled={saving}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
      >
        {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {t('common.save')}
      </button>
    </>
  )

  return (
    <div>
      <PageHeader
        title={t('pages.clients.title')}
        sub={t('pages.clients.sub')}
        actions={
          <button className="btn-primary text-sm" onClick={openCreate}>
            <UserPlus className="w-4 h-4" />
            {t('pages.clients.addClient')}
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatsCard label={t('pages.clients.stats.total')} value={loading ? '—' : stats.total} icon={Users} color="blue" />
        <StatsCard label={t('pages.clients.stats.active')} value={loading ? '—' : stats.actifs} icon={Users} color="green" />
        <StatsCard label={t('pages.clients.stats.newThisMonth')} value={loading ? '—' : stats.newThisMonth} icon={UserPlus} color="teal" />
        <StatsCard label={t('pages.clients.stats.totalRevenue')} value="—" icon={TrendingUp} color="purple" />
      </div>

      {/* Search & Filters */}
      <SearchFilter
        value={search}
        onChange={handleSearch}
        placeholder={t('pages.clients.searchPlaceholder')}
        filters={[{
          key: 'status',
          label: t('common.status'),
          options: [
            { value: 'actif', label: t('statuses.actif') },
            { value: 'inactif', label: t('statuses.inactif') },
          ],
        }]}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Table */}
      <div className="card rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : apiError ? (
          <EmptyState
            icon={Users}
            title="Erreur de chargement"
            desc="Impossible de charger les clients. Vérifiez votre connexion."
            color="blue"
          />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('pages.clients.empty.title')}
            desc={t('pages.clients.empty.desc')}
            action={{ label: t('pages.clients.addClient'), onClick: openCreate }}
            color="blue"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    {[
                      t('pages.clients.col.name'),
                      t('pages.clients.col.company'),
                      t('pages.clients.col.contact'),
                      t('pages.clients.col.status'),
                      t('pages.clients.col.created'),
                      '',
                    ].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {paginated.map(client => (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">{initials(client.nom)}</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{client.nom}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          {client.nomEntreprise || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-0.5">
                          {client.email && (
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 flex-shrink-0" />{client.email}
                            </div>
                          )}
                          {client.telephone && (
                            <div className="text-xs text-slate-500 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 flex-shrink-0" />{client.telephone}
                            </div>
                          )}
                          {!client.email && !client.telephone && <span className="text-xs text-slate-400">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge variant={client.actif ? 'actif' : 'inactif'} dot />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{formatDate(client.createdAt)}</td>
                      <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                        <ActionMenu items={[
                          { label: t('common.view'), icon: Eye, onClick: () => setSelectedClient(client) },
                          { label: t('common.edit'), icon: Pencil, onClick: () => openEdit(client) },
                          { label: t('common.delete'), icon: Trash2, onClick: () => setDeleteTarget(client), variant: 'danger', separator: true },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {paginated.map(client => (
                <div
                  key={client.id}
                  className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  onClick={() => setSelectedClient(client)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{initials(client.nom)}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{client.nom}</p>
                        <p className="text-xs text-slate-500">{client.nomEntreprise || '—'}</p>
                      </div>
                    </div>
                    <StatusBadge variant={client.actif ? 'actif' : 'inactif'} dot size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{client.email || client.telephone || '—'}</span>
                    <span className="text-slate-400">{formatDate(client.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3">
              <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
            </div>
          </>
        )}
      </div>

      {/* Detail modal */}
      <Modal
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        title={selectedClient?.nom ?? ''}
        size="lg"
      >
        {selectedClient && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-black">{initials(selectedClient.nom)}</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{selectedClient.nom}</h3>
                <p className="text-sm text-slate-500">{selectedClient.nomEntreprise || '—'}</p>
                <StatusBadge variant={selectedClient.actif ? 'actif' : 'inactif'} dot size="sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: t('pages.clients.form.email'), value: selectedClient.email || '—' },
                { label: t('pages.clients.form.phone'), value: selectedClient.telephone || '—' },
                { label: t('pages.clients.col.created'), value: formatDate(selectedClient.createdAt) },
                { label: 'Devis', value: String(selectedClient._count?.devis ?? '—') },
              ].map(row => (
                <div key={row.label} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <p className="text-xs text-slate-400 mb-1">{row.label}</p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-white">{row.value}</p>
                </div>
              ))}
            </div>

            {selectedClient.notes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 mb-1">{t('pages.clients.form.notes')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{selectedClient.notes}</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button className="flex-1 btn-primary text-sm py-2.5" onClick={() => openEdit(selectedClient)}>
                {t('common.edit')}
              </button>
              <button
                onClick={() => { setDeleteTarget(selectedClient); setSelectedClient(null) }}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
              >
                {t('common.delete')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title={t('pages.clients.create')}
        footer={formFooter(handleCreate)}
      >
        <ClientFormFields form={form} formErrors={formErrors} onChange={handleFormChange} />
      </Modal>

      {/* Edit modal */}
      <Modal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        title={t('pages.clients.edit')}
        footer={formFooter(handleEdit)}
      >
        <ClientFormFields form={form} formErrors={formErrors} onChange={handleFormChange} />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget && !deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={t('pages.clients.deleteTitle')}
        message={t('pages.clients.deleteMessage').replace('{nom}', deleteTarget?.nom ?? '')}
        confirmLabel={t('common.delete')}
        danger
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
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
