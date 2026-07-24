'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  User, Building2, Palette, Globe, Sun, Moon, Monitor, Bell, Shield, CreditCard,
  Camera, Check, ChevronRight, Eye, EyeOff, Zap, AlertCircle,
  Mail, FileText, Receipt, AlertTriangle, Lock, Hash, ShieldCheck, HardDrive,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { settingsApi } from '@/lib/api'
import { LOCALES } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { canDo } from '@/lib/permissions'
import TemplateChooser from '@/components/settings/TemplateChooser'

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1').replace(/\/api\/v1\/?$/, '')
function logoUrl(path: string) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_ORIGIN}${path}`
}

type Tab = 'profile' | 'company' | 'branding' | 'language' | 'theme' | 'notifications' | 'security' | 'billing'

const TABS: { key: Tab; icon: React.ElementType }[] = [
  { key: 'profile', icon: User },
  { key: 'company', icon: Building2 },
  { key: 'branding', icon: Palette },
  { key: 'language', icon: Globe },
  { key: 'theme', icon: Sun },
  { key: 'notifications', icon: Bell },
  { key: 'security', icon: Shield },
  { key: 'billing', icon: CreditCard },
]

const THEME_OPTIONS = [
  { key: 'light', icon: Sun, preview: 'bg-white border-2 border-primary-400' },
  { key: 'dark', icon: Moon, preview: 'bg-slate-900 border-2 border-slate-600' },
  { key: 'system', icon: Monitor, preview: 'bg-gradient-to-r from-white to-slate-900 border-2 border-slate-300' },
]

const PRESET_COLORS = [
  { name: 'Bleu', color: '#2563eb', class: 'bg-blue-600' },
  { name: 'Teal', color: '#0d9488', class: 'bg-teal-600' },
  { name: 'Violet', color: '#7c3aed', class: 'bg-violet-600' },
  { name: 'Orange', color: '#ea580c', class: 'bg-orange-600' },
  { name: 'Rose', color: '#e11d48', class: 'bg-rose-600' },
  { name: 'Émeraude', color: '#059669', class: 'bg-emerald-600' },
]

const PLAN_LABELS: Record<string, { label: string; prix: string; features: string[] }> = {
  STARTER: { label: 'Starter', prix: '0',   features: ['5 clients', '5 devis/mois', '5 factures/mois', '5 BL/mois', '2 utilisateurs', '3 relances/mois', '5 emails/mois'] },
  PRO:     { label: 'Pro',     prix: '199', features: ['20 clients', '100 devis/mois', '100 factures/mois', '100 BL/mois', '5 utilisateurs', 'Relances illimitées', 'Emails illimités', 'Journal des ventes', 'Support email 48h'] },
  BUSINESS:{ label: 'Business',prix: '299', features: ['Clients illimités', 'Devis illimités', 'Factures illimitées', 'BL illimités', '12 utilisateurs', 'Emails illimités', 'Journal complet + TVA', 'Support prioritaire 24h'] },
}

const PLAN_ORDER: Record<string, number> = { STARTER: 0, PRO: 1, BUSINESS: 2 }
const WA_OWNER = '447476607473'

const MB = 1024 * 1024
const GB = 1024 * 1024 * 1024
const PLAN_LIMITS_FRONTEND: Record<string, { clients: number; devisParMois: number; facturesParMois: number; bonsLivraisonParMois: number; utilisateurs: number; relancesParMois: number; receiptsParMois: number; depensesParMois: number; storageBytes: number }> = {
  STARTER:  { clients: 5,  devisParMois: 5,   facturesParMois: 5,   bonsLivraisonParMois: 5,   utilisateurs: 2,  relancesParMois: 3,  receiptsParMois: 5,   depensesParMois: 20,  storageBytes: 200 * MB },
  PRO:      { clients: 20, devisParMois: 100, facturesParMois: 100, bonsLivraisonParMois: 100, utilisateurs: 5,  relancesParMois: -1, receiptsParMois: -1,  depensesParMois: 150, storageBytes: 5 * GB   },
  BUSINESS: { clients: -1, devisParMois: -1,  facturesParMois: -1,  bonsLivraisonParMois: -1,  utilisateurs: 12, relancesParMois: -1, receiptsParMois: -1,  depensesParMois: -1,  storageBytes: 20 * GB  },
}

function SaveButton({ onClick, saving, saved, disabled }: { onClick: () => void; saving: boolean; saved: boolean; disabled?: boolean }) {
  const { t } = useTranslation()
  return (
    <button
      onClick={onClick}
      disabled={saving || disabled}
      className={cn(
        'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed',
        saved ? 'bg-green-500 hover:bg-green-600' : 'bg-primary-600 hover:bg-primary-700',
      )}
    >
      {saving ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4" />
      ) : null}
      {saving ? t('common.saving') : saved ? t('common.saved') : t('common.save')}
    </button>
  )
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {msg}
    </p>
  )
}

const PERSONAL_TABS: Tab[] = ['profile', 'language', 'theme', 'security']

export default function SettingsPage() {
  const { t, setLocale } = useTranslation()
  const { setTheme } = useTheme()
  const { user } = useAuth()
  const { toasts, success, error: toastError, removeToast } = useToast()

  const removedPerms: string[] = (user as any)?.permissionsRetirees ?? []
  const hasSettingsPerm = canDo('settings', user?.role, removedPerms)
  const visibleTabs = TABS.filter(tab => hasSettingsPerm || PERSONAL_TABS.includes(tab.key))

  const [activeTab, setActiveTab] = useState<Tab>('profile')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('tab') as Tab | null
    const allowed = hasSettingsPerm ? TABS.map(t => t.key) : PERSONAL_TABS
    if (p && allowed.includes(p as Tab)) setActiveTab(p as Tab)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Per-tab save state ──────────────────────────────────────────────────
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const triggerSaved = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleApiError = useCallback((err: unknown) => {
    const e = err as { response?: { data?: { message?: string | string[]; errors?: string[] } } }
    const msg = e?.response?.data?.message
    if (Array.isArray(msg)) {
      toastError('Données invalides', msg.join(', '))
    } else {
      toastError('Erreur', msg ?? 'Une erreur est survenue.')
    }
  }, [toastError])

  // ─── Profile state ───────────────────────────────────────────────────────
  const [profile, setProfile] = useState({ nom: '', email: '', telephone: '', role: '' })
  const [profileLoading, setProfileLoading] = useState(true)

  // ─── Company state ───────────────────────────────────────────────────────
  const [company, setCompany] = useState({
    nom: '', email: '', telephone: '', adresse: '', ville: '', pays: '', website: '', ice: '', rc: '',
    titulaireCompte: '', banque: '', rib: '', iban: '', swift: '',
    typeCompte: 'pme', activite: '', plan: '',
  })
  const [numbering, setNumbering] = useState({
    prefixeFacture: 'FAC', prefixeDevis: 'DEV', prefixeBL: 'BL',
    prochainNumeroFacture: 1, prochainNumeroDevis: 1, prochainNumeroBL: 1,
  })
  const [companyLoading, setCompanyLoading] = useState(true)

  // ─── Branding state ──────────────────────────────────────────────────────
  const [branding, setBranding] = useState({ logo: '', couleurPrimaire: '#2563eb', templateDocument: 'classic' })
  const [brandingLoading, setBrandingLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('#2563eb')
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  // ─── Preferences state ───────────────────────────────────────────────────
  const [prefs, setPrefs] = useState({ langue: 'fr', theme: 'system', devise: 'MAD', formatDate: 'DD/MM/YYYY', tauxEUR: '' as string, tauxUSD: '' as string, regimeTVA: 'ENCAISSEMENTS' })
  const [prefsLoading, setPrefsLoading] = useState(true)

  // ─── Theme state ─────────────────────────────────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState('system')

  // ─── Notifications state ─────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailNotifications: true,
    notificationsDevis: true,
    notificationsFactures: true,
    notificationsPaiements: true,
    notificationsSysteme: true,
    inAppDevis: true,
    inAppFactures: true,
    inAppPaiements: true,
    inAppSysteme: true,
  })
  const [notifsLoading, setNotifsLoading] = useState(true)

  // ─── Security state ──────────────────────────────────────────────────────
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwForm, setPwForm] = useState({ motDePasseActuel: '', nouveauMotDePasse: '', confirmationMotDePasse: '' })

  // ─── Billing state ───────────────────────────────────────────────────────
  type UsageField = { actuel: number; limite: number }
  const [billing, setBilling] = useState<{
    plan: string
    planDebut: string | null
    planExpiration: string | null
    joursRestants: number | null
    usage: {
      clients: UsageField
      utilisateurs: UsageField
      devisCeMois: UsageField
      facturesCeMois: UsageField
      bonsLivraisonCeMois: UsageField
      relancesCeMois: UsageField
      receiptsCeMois: UsageField
      depensesCeMois: UsageField
      stockage: UsageField
    }
  } | null>(null)

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
  const [billingLoading, setBillingLoading] = useState(true)

  // ─── DGI state ───────────────────────────────────────────────────────────
  const [dgiMode, setDgiMode] = useState(false)
  const [dgiToggling, setDgiToggling] = useState(false)

  // ─── Data loading ─────────────────────────────────────────────────────────
  useEffect(() => {
    settingsApi.getProfile().then(r => {
      const d = r.data?.data ?? r.data
      setProfile({ nom: d.nom ?? '', email: d.email ?? '', telephone: d.telephone ?? '', role: d.role ?? '' })
    }).catch(() => {}).finally(() => setProfileLoading(false))

    settingsApi.getCompany().then(r => {
      const d = r.data?.data ?? r.data
      setCompany({
        nom: d.nom ?? '', email: d.email ?? '', telephone: d.telephone ?? '',
        adresse: d.adresse ?? '', ville: d.ville ?? '', pays: d.pays ?? '',
        website: d.website ?? '', ice: d.ice ?? '', rc: d.rc ?? '',
        titulaireCompte: d.titulaireCompte ?? '', banque: d.banque ?? '',
        rib: d.rib ?? '', iban: d.iban ?? '', swift: d.swift ?? '',
        typeCompte: d.typeCompte ?? 'pme', activite: d.activite ?? '', plan: d.plan ?? '',
      })
      setDgiMode(d.dgiMode ?? false)
      setNumbering({
        prefixeFacture: d.prefixeFacture ?? 'FAC',
        prefixeDevis: d.prefixeDevis ?? 'DEV',
        prefixeBL: d.prefixeBL ?? 'BL',
        prochainNumeroFacture: d.prochainNumeroFacture ?? 1,
        prochainNumeroDevis: d.prochainNumeroDevis ?? 1,
        prochainNumeroBL: d.prochainNumeroBL ?? 1,
      })
    }).catch(() => {}).finally(() => setCompanyLoading(false))

    settingsApi.getBranding().then(r => {
      const d = r.data?.data ?? r.data
      setBranding({ logo: d.logo ?? '', couleurPrimaire: d.couleurPrimaire ?? '#2563eb', templateDocument: d.templateDocument ?? 'classic' })
      setSelectedColor(d.couleurPrimaire ?? '#2563eb')
      setSelectedTemplate(d.templateDocument ?? 'classic')
    }).catch(() => {}).finally(() => setBrandingLoading(false))

    settingsApi.getPreferences().then(r => {
      const d = r.data?.data ?? r.data
      const savedTheme = d.theme ?? 'system'
      const savedLocale = d.langue ?? 'fr'
      setPrefs({ langue: savedLocale, theme: savedTheme, devise: d.devise ?? 'MAD', formatDate: d.formatDate ?? 'DD/MM/YYYY', tauxEUR: d.tauxEUR != null ? String(d.tauxEUR) : '', tauxUSD: d.tauxUSD != null ? String(d.tauxUSD) : '', regimeTVA: d.regimeTVA ?? 'ENCAISSEMENTS' })
      setSelectedTheme(savedTheme)
      setTheme(savedTheme)
      if (['fr', 'en', 'ar'].includes(savedLocale)) setLocale(savedLocale as 'fr' | 'en' | 'ar')
    }).catch(() => {}).finally(() => setPrefsLoading(false))

    settingsApi.getNotifications().then(r => {
      const d = r.data?.data ?? r.data
      setNotifs({
        emailNotifications: d.emailNotifications ?? true,
        notificationsDevis: d.notificationsDevis ?? true,
        notificationsFactures: d.notificationsFactures ?? true,
        notificationsPaiements: d.notificationsPaiements ?? true,
        notificationsSysteme: d.notificationsSysteme ?? true,
        inAppDevis: d.inAppDevis ?? true,
        inAppFactures: d.inAppFactures ?? true,
        inAppPaiements: d.inAppPaiements ?? true,
        inAppSysteme: d.inAppSysteme ?? true,
      })
    }).catch(() => {}).finally(() => setNotifsLoading(false))

    settingsApi.getBilling().then(r => {
      const d = r.data?.data ?? r.data
      const planLimits = PLAN_LIMITS_FRONTEND[d.plan] ?? PLAN_LIMITS_FRONTEND.STARTER
      const normalise = (field: unknown, fallbackLimite: number) => {
        if (field && typeof field === 'object' && 'limite' in (field as object)) return field as { actuel: number; limite: number }
        return { actuel: typeof field === 'number' ? field : 0, limite: fallbackLimite }
      }
      setBilling({
        ...d,
        usage: {
          clients:             normalise(d.usage?.clients,             planLimits.clients),
          utilisateurs:        normalise(d.usage?.utilisateurs,        planLimits.utilisateurs),
          devisCeMois:         normalise(d.usage?.devisCeMois,         planLimits.devisParMois),
          facturesCeMois:      normalise(d.usage?.facturesCeMois,      planLimits.facturesParMois),
          bonsLivraisonCeMois: normalise(d.usage?.bonsLivraisonCeMois, planLimits.bonsLivraisonParMois),
          relancesCeMois:      normalise(d.usage?.relancesCeMois,      planLimits.relancesParMois),
          receiptsCeMois:      normalise(d.usage?.receiptsCeMois,      planLimits.receiptsParMois),
          depensesCeMois:      normalise(d.usage?.depensesCeMois,      planLimits.depensesParMois),
          stockage:            normalise(d.usage?.stockage,            planLimits.storageBytes),
        },
      })
    }).catch(() => {}).finally(() => setBillingLoading(false))
  }, [])

  // ─── Save handlers ────────────────────────────────────────────────────────

  const saveProfile = async () => {
    setFieldErrors({})
    if (!profile.nom.trim()) { setFieldErrors({ nom: 'Le nom est requis.' }); return }
    setSaving(true)
    try {
      await settingsApi.updateProfile({ nom: profile.nom, telephone: profile.telephone })
      success('Profil mis à jour', 'Vos informations ont été enregistrées.')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveCompany = async () => {
    setFieldErrors({})
    if (!company.nom.trim()) { setFieldErrors({ companyNom: 'Le nom de l\'entreprise est requis.' }); return }
    setSaving(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { plan: _plan, ...companyPayload } = company
    try {
      await settingsApi.updateCompany(companyPayload)
      success('Entreprise mise à jour', 'Les informations de votre entreprise ont été enregistrées.')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveNumbering = async () => {
    setSaving(true)
    try {
      await settingsApi.updateCompany(numbering as any)
      success(t('pages.settings.numerotation.saveSuccess'), '')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveBranding = async () => {
    setSaving(true)
    try {
      await settingsApi.updateBranding({ couleurPrimaire: selectedColor, templateDocument: selectedTemplate })
      setBranding(b => ({ ...b, couleurPrimaire: selectedColor, templateDocument: selectedTemplate }))
      success('Identité mise à jour', 'Votre modèle et couleur ont été enregistrés.')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true)
    try {
      const res = await settingsApi.uploadLogo(file)
      const d = res.data?.data ?? res.data
      setBranding(b => ({ ...b, logo: d.logo }))
      success('Logo mis à jour', 'Votre logo a été téléchargé avec succès.')
    } catch (err) { handleApiError(err) }
    finally { setLogoUploading(false) }
  }

  const saveLanguage = async () => {
    setSaving(true)
    try {
      await settingsApi.updatePreferences({
        langue: prefs.langue,
        devise: prefs.devise,
        formatDate: prefs.formatDate,
        tauxEUR: prefs.tauxEUR !== '' ? parseFloat(prefs.tauxEUR) : null,
        tauxUSD: prefs.tauxUSD !== '' ? parseFloat(prefs.tauxUSD) : null,
        regimeTVA: prefs.regimeTVA,
      })
      if (['fr', 'en', 'ar'].includes(prefs.langue)) setLocale(prefs.langue as 'fr' | 'en' | 'ar')
      success('Préférences enregistrées', 'Langue et région mises à jour.')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveTheme = async () => {
    setSaving(true)
    try {
      await settingsApi.updatePreferences({ theme: selectedTheme })
      setPrefs(p => ({ ...p, theme: selectedTheme }))
      setTheme(selectedTheme)
      success('Thème enregistré', `Thème "${selectedTheme}" appliqué.`)
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveNotifications = async () => {
    setSaving(true)
    try {
      await settingsApi.updateNotifications(notifs)
      success('Notifications mises à jour')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const savePassword = async () => {
    setFieldErrors({})
    if (!pwForm.motDePasseActuel) { setFieldErrors({ currentPw: 'Requis.' }); return }
    if (pwForm.nouveauMotDePasse.length < 8) { setFieldErrors({ newPw: 'Minimum 8 caractères.' }); return }
    if (pwForm.nouveauMotDePasse !== pwForm.confirmationMotDePasse) { setFieldErrors({ confirmPw: 'Les mots de passe ne correspondent pas.' }); return }
    setSaving(true)
    try {
      await settingsApi.changePassword(pwForm)
      success('Mot de passe modifié', 'Votre mot de passe a été mis à jour avec succès.')
      setPwForm({ motDePasseActuel: '', nouveauMotDePasse: '', confirmationMotDePasse: '' })
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  // ─── Tab content renderers ────────────────────────────────────────────────

  const renderContent = () => {
    switch (activeTab) {

      // ── PROFILE ──────────────────────────────────────────────────────────
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.profile.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.profile.subtitle')}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-teal-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-xl">
                    {profile.nom ? profile.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : (user?.nom?.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() ?? 'U')}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{profile.nom || user?.nom}</p>
                <p className="text-xs text-slate-500 mt-0.5">{profile.email || user?.email}</p>
                <StatusBadge variant={((profile.role || user?.role) ?? 'admin').toLowerCase() as any} size="sm" />
              </div>
            </div>

            {profileLoading ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.profile.fullName')}</label>
                  <input
                    type="text"
                    value={profile.nom}
                    onChange={e => setProfile(p => ({ ...p, nom: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                  />
                  <FieldError msg={fieldErrors.nom} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.profile.email')}</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.profile.phone')}</label>
                  <input
                    type="tel"
                    value={profile.telephone}
                    onChange={e => setProfile(p => ({ ...p, telephone: e.target.value }))}
                    placeholder="+212 6 XX XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.profile.role')}</label>
                  <input
                    type="text"
                    value={profile.role}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed capitalize"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveProfile} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── COMPANY ──────────────────────────────────────────────────────────
      case 'company': {
        const isFreelancer = company.typeCompte === 'freelancer'
        const isEntrepreneur = company.typeCompte === 'entrepreneur'
        const isPme = company.typeCompte === 'pme'
        const isSimple = isFreelancer || isEntrepreneur

        const nameLabel = isFreelancer
          ? t('pages.settings.company.nameLabelFreelancer')
          : isEntrepreneur
          ? t('pages.settings.company.nameLabelEntrepreneur')
          : t('pages.settings.company.name')

        const typeLabel = isFreelancer
          ? t('pages.settings.company.profileTypeFreelancer')
          : isEntrepreneur
          ? t('pages.settings.company.profileTypeEntrepreneur')
          : t('pages.settings.company.profileTypePme')

        const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'

        return (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.company.title')}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isSimple ? t('pages.settings.company.subtitleSimple') : t('pages.settings.company.subtitlePme')}
                </p>
              </div>
              {!companyLoading && (
                <span className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border-2 border-primary-400 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300">
                  {typeLabel}
                </span>
              )}
            </div>

            {companyLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{nameLabel}</label>
                  <input type="text" value={company.nom}
                    onChange={e => setCompany(c => ({ ...c, nom: e.target.value }))}
                    className={inputCls} />
                  <FieldError msg={fieldErrors.companyNom} />
                </div>

                {/* Activité — freelancer + entrepreneur only */}
                {isSimple && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      {t('pages.settings.company.activite')}
                      <span className="ml-1.5 text-slate-400 font-normal text-[10px]">— {t('pages.settings.company.activiteHint')}</span>
                    </label>
                    <input type="text" value={company.activite}
                      onChange={e => setCompany(c => ({ ...c, activite: e.target.value }))}
                      placeholder={t('pages.settings.company.activitePlaceholder')}
                      className={inputCls} />
                  </div>
                )}

                {/* ICE — entrepreneur + PME only */}
                {(isEntrepreneur || isPme) && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
                      {t('pages.settings.company.ice')}
                      {isEntrepreneur && <span className="ml-1.5 text-slate-400 font-normal text-[10px]">(optionnel)</span>}
                    </label>
                    <input type="text" value={company.ice}
                      onChange={e => setCompany(c => ({ ...c, ice: e.target.value }))}
                      className={inputCls} />
                  </div>
                )}

                {/* RC — PME only */}
                {isPme && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.company.rc')}</label>
                    <input type="text" value={company.rc}
                      onChange={e => setCompany(c => ({ ...c, rc: e.target.value }))}
                      className={inputCls} />
                  </div>
                )}

                {/* Common fields — all types */}
                {([
                  { key: 'telephone', label: t('pages.settings.company.phone') },
                  { key: 'email',     label: t('pages.settings.company.email'), type: 'email' },
                  { key: 'website',   label: t('pages.settings.company.website') },
                  { key: 'adresse',   label: t('pages.settings.company.address'), colSpan: true },
                  { key: 'ville',     label: t('pages.settings.company.city') },
                  { key: 'pays',      label: t('pages.settings.company.country') },
                ] as { key: keyof typeof company; label: string; colSpan?: boolean; type?: string }[]).map(field => (
                  <div key={field.key} className={field.colSpan ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{field.label}</label>
                    <input type={field.type ?? 'text'} value={company[field.key]}
                      onChange={e => setCompany(c => ({ ...c, [field.key]: e.target.value }))}
                      className={inputCls} />
                  </div>
                ))}
              </div>
            )}
            {/* Banking section */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t('pages.settings.banking.title')}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.banking.desc')}</p>
              </div>
              {!companyLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {([
                    { key: 'titulaireCompte', label: t('pages.settings.banking.titulaireCompte'), colSpan: true },
                    { key: 'banque',          label: t('pages.settings.banking.banque') },
                    { key: 'rib',             label: t('pages.settings.banking.rib') },
                    { key: 'iban',            label: t('pages.settings.banking.iban'), colSpan: true },
                    { key: 'swift',           label: t('pages.settings.banking.swift') },
                  ] as { key: keyof typeof company; label: string; colSpan?: boolean }[]).map(field => (
                    <div key={field.key} className={field.colSpan ? 'sm:col-span-2' : ''}>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{field.label}</label>
                      <input
                        type="text"
                        value={company[field.key]}
                        onChange={e => setCompany(c => ({ ...c, [field.key]: e.target.value }))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveCompany} saving={saving} saved={saved} />
            </div>

            {/* ── Numérotation ── */}
          {(() => {
            const isStarter = !company.plan || company.plan === 'STARTER'
            const year = new Date().getFullYear()
            const rows = [
              { labelKey: 'factures', prefixKey: 'prefixeFacture' as const, numKey: 'prochainNumeroFacture' as const },
              { labelKey: 'devis',    prefixKey: 'prefixeDevis'   as const, numKey: 'prochainNumeroDevis'   as const },
              { labelKey: 'bonsLivraison', prefixKey: 'prefixeBL' as const, numKey: 'prochainNumeroBL'      as const },
            ]
            const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all'
            return (
              <div className="card rounded-2xl p-5 space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Hash className="w-4 h-4 text-slate-400" />
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{t('pages.settings.numerotation.title')}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800">Pro & Business</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.numerotation.subtitle')}</p>
                  </div>
                </div>

                {isStarter ? (
                  <div className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                    <Lock className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{t('pages.settings.numerotation.proOnly')}</p>
                    <button
                      onClick={() => setActiveTab('billing')}
                      className="mt-3 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {t('pages.settings.numerotation.voirPlans')} →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {rows.map(({ labelKey, prefixKey, numKey }) => {
                      const prefix = numbering[prefixKey]
                      const nextNum = numbering[numKey]
                      const preview = `${prefix || '???'}-${year}-${String(nextNum || 1).padStart(4, '0')}`
                      return (
                        <div key={prefixKey} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">{t(`pages.settings.numerotation.${labelKey}`)}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                            <div>
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">{t('pages.settings.numerotation.prefixeLabel')}</label>
                              <input
                                type="text"
                                maxLength={10}
                                value={prefix}
                                onChange={e => setNumbering(n => ({ ...n, [prefixKey]: e.target.value.toUpperCase() }))}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">{t('pages.settings.numerotation.prochainNumeroLabel')}</label>
                              <input
                                type="number"
                                min={1}
                                value={nextNum}
                                onChange={e => setNumbering(n => ({ ...n, [numKey]: Math.max(1, parseInt(e.target.value) || 1) }))}
                                className={inputCls}
                              />
                            </div>
                            <div>
                              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">{t('pages.settings.numerotation.apercu')}</label>
                              <div className="px-3.5 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-mono font-bold tracking-wide">
                                {preview}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="flex justify-end pt-1">
                      <SaveButton onClick={saveNumbering} saving={saving} saved={saved} />
                    </div>
                  </div>
                )}
              </div>
            )
            })()}
          </div>
        )
      }

      // ── BRANDING ─────────────────────────────────────────────────────────
      case 'branding':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.branding.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.branding.subtitle')}</p>
            </div>

            {/* Logo upload */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">{t('pages.settings.branding.logo')}</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {branding.logo ? (
                    <img src={logoUrl(branding.logo)} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-black text-sm">S</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    className="hidden"
                    onChange={e => { if (e.target.files?.[0]) handleLogoUpload(e.target.files[0]) }}
                  />
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    disabled={logoUploading}
                    className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {logoUploading ? <span className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-600 rounded-full animate-spin" /> : <Camera className="w-4 h-4" />}
                    {logoUploading ? 'Téléchargement...' : t('pages.settings.branding.uploadLogo')}
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{t('pages.settings.branding.logoHint')}</p>
                </div>
              </div>
            </div>

            {/* Template chooser + color picker */}
            {brandingLoading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : (
              <TemplateChooser
                userPlan={billing?.plan ?? 'STARTER'}
                selectedTemplate={selectedTemplate}
                selectedColor={selectedColor}
                onTemplateChange={setSelectedTemplate}
                onColorChange={setSelectedColor}
                logoUrl={branding.logo ? logoUrl(branding.logo) : undefined}
                companyName={company.nom || undefined}
              />
            )}

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveBranding} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── LANGUAGE ─────────────────────────────────────────────────────────
      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.language.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configurez la langue et le format régional</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 block">{t('pages.settings.language.lang')}</label>
              {prefsLoading ? (
                <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
              ) : (
                <div className="space-y-2">
                  {LOCALES.map(locale => (
                    <button
                      key={locale.code}
                      onClick={() => { setPrefs(p => ({ ...p, langue: locale.code })); setLocale(locale.code) }}
                      className={cn(
                        'w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left',
                        prefs.langue === locale.code
                          ? 'border-primary-400 bg-primary-50 dark:bg-primary-950/40'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{locale.flag}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{locale.label}</p>
                          <p className="text-xs text-slate-500">{locale.dir === 'rtl' ? 'RTL' : 'LTR'}</p>
                        </div>
                      </div>
                      {prefs.langue === locale.code && (
                        <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.language.currency')}</label>
                <select
                  value={prefs.devise}
                  onChange={e => setPrefs(p => ({ ...p, devise: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                >
                  <option value="MAD">MAD — Dirham marocain</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="USD">USD — Dollar américain</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.language.dateFormat')}</label>
                <select
                  value={prefs.formatDate}
                  onChange={e => setPrefs(p => ({ ...p, formatDate: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                >
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>

            {/* ── TVA regime ── */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.language.regimeTVA')}</label>
              <select
                value={prefs.regimeTVA}
                onChange={e => setPrefs(p => ({ ...p, regimeTVA: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
              >
                <option value="ENCAISSEMENTS">{t('pages.settings.language.regimeEncaissements')}</option>
                <option value="DEBITS">{t('pages.settings.language.regimeDebits')}</option>
              </select>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{t('pages.settings.language.regimeTVADesc')}</p>
            </div>

            {/* ── Exchange rates ── */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{t('pages.settings.language.tauxConversion')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('pages.settings.language.tauxDesc')}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.language.tauxEUR')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">1 EUR =</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="10.85"
                      value={prefs.tauxEUR}
                      onChange={e => setPrefs(p => ({ ...p, tauxEUR: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">MAD</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.language.tauxUSD')}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">1 USD =</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="9.90"
                      value={prefs.tauxUSD}
                      onChange={e => setPrefs(p => ({ ...p, tauxUSD: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">MAD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveLanguage} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── THEME ────────────────────────────────────────────────────────────
      case 'theme':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.theme.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choisissez l&apos;apparence de l&apos;interface</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(opt => {
                const Icon = opt.icon
                return (
                  <button
                    key={opt.key}
                    onClick={() => { setSelectedTheme(opt.key); setTheme(opt.key) }}
                    className={cn(
                      'flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all',
                      selectedTheme === opt.key
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                    )}
                  >
                    <div className={cn('w-full h-12 rounded-xl', opt.preview)} />
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t(`pages.settings.theme.${opt.key}`)}</span>
                    </div>
                    {selectedTheme === opt.key && (
                      <div className="w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveTheme} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── NOTIFICATIONS ────────────────────────────────────────────────────
      case 'notifications': {
        const Toggle = ({ fieldKey }: { fieldKey: keyof typeof notifs }) => (
          <button
            onClick={() => setNotifs(prev => ({ ...prev, [fieldKey]: !prev[fieldKey] }))}
            className={cn('relative flex-shrink-0 w-11 h-6 rounded-full transition-all duration-200', notifs[fieldKey] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700')}
          >
            <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200', notifs[fieldKey] && 'translate-x-5')} />
          </button>
        )

        const NotifRow = ({
          icon: Icon, iconColor, iconBg, label, desc, fieldKey,
        }: {
          icon: React.ElementType; iconColor: string; iconBg: string
          label: string; desc: string; fieldKey: keyof typeof notifs
        }) => (
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', iconBg)}>
                <Icon className={cn('w-4 h-4', iconColor)} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
              </div>
            </div>
            <Toggle fieldKey={fieldKey} />
          </div>
        )

        const p = 'pages.settings.notifications'
        const rows = [
          { icon: FileText,     iconColor: 'text-blue-600 dark:text-blue-400',   iconBg: 'bg-blue-50 dark:bg-blue-950/50',   label: t(`${p}.devis`),     desc: t(`${p}.devisDesc`),     emailKey: 'notificationsDevis' as const,     inAppKey: 'inAppDevis' as const },
          { icon: Receipt,      iconColor: 'text-purple-600 dark:text-purple-400', iconBg: 'bg-purple-50 dark:bg-purple-950/50', label: t(`${p}.factures`),  desc: t(`${p}.facturesDesc`),  emailKey: 'notificationsFactures' as const,  inAppKey: 'inAppFactures' as const },
          { icon: CreditCard,   iconColor: 'text-green-600 dark:text-green-400',  iconBg: 'bg-green-50 dark:bg-green-950/50', label: t(`${p}.paiements`), desc: t(`${p}.paiementsDesc`), emailKey: 'notificationsPaiements' as const, inAppKey: 'inAppPaiements' as const },
          { icon: AlertTriangle, iconColor: 'text-orange-600 dark:text-orange-400', iconBg: 'bg-orange-50 dark:bg-orange-950/50', label: t(`${p}.systeme`), desc: t(`${p}.systemeDesc`), emailKey: 'notificationsSysteme' as const, inAppKey: 'inAppSysteme' as const },
        ]

        return (
          <div className="space-y-8">
            {notifsLoading ? (
              <div className="space-y-3">{[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
            ) : (
              <>
                {/* Email section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{t(`${p}.emailSection`)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t(`${p}.emailSectionDesc`)}</p>
                    </div>
                    {billing?.plan === 'STARTER' && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                        Pro & Business
                      </span>
                    )}
                  </div>

                  <div className={cn('space-y-3', billing?.plan === 'STARTER' && 'opacity-50 pointer-events-none select-none')}>
                    {/* Master email toggle */}
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-950/20">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-950/60 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(`${p}.masterEmail`)}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{t(`${p}.masterEmailDesc`)}</p>
                        </div>
                      </div>
                      <Toggle fieldKey="emailNotifications" />
                    </div>

                    {/* Per-type email toggles */}
                    <div className={cn('space-y-2 transition-opacity', !notifs.emailNotifications && 'opacity-40 pointer-events-none')}>
                      {rows.map(r => (
                        <NotifRow key={r.emailKey} icon={r.icon} iconColor={r.iconColor} iconBg={r.iconBg} label={r.label} desc={r.desc} fieldKey={r.emailKey} />
                      ))}
                    </div>
                  </div>

                  {billing?.plan === 'STARTER' && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 text-center pt-1">
                      {t('pages.settings.notifications.starterWarning')}
                    </p>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800" />

                {/* In-app section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{t(`${p}.inAppSection`)}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t(`${p}.inAppSectionDesc`)}</p>
                    </div>
                  </div>
                  {rows.map(r => (
                    <NotifRow key={r.inAppKey} icon={r.icon} iconColor={r.iconColor} iconBg={r.iconBg} label={r.label} desc={r.desc} fieldKey={r.inAppKey} />
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveNotifications} saving={saving} saved={saved} />
            </div>
          </div>
        )
      }

      // ── SECURITY ─────────────────────────────────────────────────────────
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.security.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.security.subtitle')}</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">{t('pages.settings.security.securedTitle')}</p>
                <p className="text-xs text-green-600 dark:text-green-400">{t('pages.settings.security.securedDesc')}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">{t('pages.settings.security.changePassword')}</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.security.currentPassword')}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={pwForm.motDePasseActuel}
                      onChange={e => setPwForm(f => ({ ...f, motDePasseActuel: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    <button onClick={() => setShowCurrentPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError msg={fieldErrors.currentPw} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.security.newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={pwForm.nouveauMotDePasse}
                      onChange={e => setPwForm(f => ({ ...f, nouveauMotDePasse: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    <button onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError msg={fieldErrors.newPw} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{t('pages.settings.security.confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={pwForm.confirmationMotDePasse}
                      onChange={e => setPwForm(f => ({ ...f, confirmationMotDePasse: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pr-10 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    <button onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError msg={fieldErrors.confirmPw} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <SaveButton onClick={savePassword} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── BILLING ──────────────────────────────────────────────────────────
      case 'billing': {
        const ouvrirWhatsApp = (targetPlan: string) => {
          const info = PLAN_LABELS[targetPlan]
          const prix = info.prix === '0' ? 'Gratuit' : `${info.prix} MAD/mois`
          const msg = [
            `Bonjour, je souhaite passer au plan *${info.label}* (${prix}) sur Sayerli.`,
            ``,
            `📧 Email : ${profile.email || user?.email || 'N/A'}`,
            `🏢 Entreprise : ${company.nom || 'N/A'}`,
            `📦 Plan actuel : ${PLAN_LABELS[billing?.plan ?? 'STARTER']?.label}`,
            `🎯 Plan souhaité : ${info.label}`,
            ``,
            `Merci !`,
          ].join('\n')
          window.open(`https://wa.me/${WA_OWNER}?text=${encodeURIComponent(msg)}`, '_blank')
        }

        const usageRows = billing ? [
          { key: 'clients',             label: t('pages.settings.billing.usage.clients'),             field: billing.usage.clients },
          { key: 'devisCeMois',         label: t('pages.settings.billing.usage.devis'),               field: billing.usage.devisCeMois },
          { key: 'facturesCeMois',      label: t('pages.settings.billing.usage.factures'),            field: billing.usage.facturesCeMois },
          { key: 'bonsLivraisonCeMois', label: t('pages.settings.billing.usage.bonsLivraison'),       field: billing.usage.bonsLivraisonCeMois },
          { key: 'utilisateurs',        label: t('pages.settings.billing.usage.utilisateurs'),        field: billing.usage.utilisateurs },
          { key: 'relancesCeMois',      label: t('pages.settings.billing.usage.relances'),            field: billing.usage.relancesCeMois },
          { key: 'receiptsCeMois',      label: t('pages.settings.billing.usage.receipts'),            field: billing.usage.receiptsCeMois },
          { key: 'depensesCeMois',      label: t('pages.settings.billing.usage.depenses'),            field: billing.usage.depensesCeMois },
          { key: 'stockage',            label: t('pages.settings.billing.usage.stockage'),            field: billing.usage.stockage, formatValue: formatBytes },
        ] : []

        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.billing.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.billing.subtitle')}</p>
            </div>

            {billingLoading ? (
              <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : billing ? (
              <>
                {/* ── Current plan card ── */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{t('pages.settings.billing.currentPlan')}</span>
                      </div>
                      <p className="text-2xl font-black">{PLAN_LABELS[billing.plan]?.label ?? billing.plan}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {PLAN_LABELS[billing.plan]?.prix === '0' ? t('pages.settings.billing.free') : `${PLAN_LABELS[billing.plan]?.prix} MAD / ${t('pages.settings.billing.perMonth')}`}
                      </p>
                    </div>
                    <div className="text-right text-sm shrink-0">
                      {billing.planDebut && (
                        <div className="mb-2">
                          <p className="text-xs opacity-70">{t('pages.settings.billing.since')}</p>
                          <p className="font-bold">{new Date(billing.planDebut).toLocaleDateString('fr-MA')}</p>
                        </div>
                      )}
                      {billing.planExpiration ? (
                        <div>
                          <p className="text-xs opacity-70">{t('pages.settings.billing.renewal')}</p>
                          <p className="font-bold">{new Date(billing.planExpiration).toLocaleDateString('fr-MA')}</p>
                          {billing.joursRestants !== null && (
                            <p className="text-xs opacity-80 mt-0.5">
                              {billing.joursRestants === 0 ? t('pages.settings.billing.expiresToday') : `${billing.joursRestants} ${t('pages.settings.billing.daysLeft')}`}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs opacity-70">{t('pages.settings.billing.expiration')}</p>
                          <p className="font-bold text-sm">{t('pages.settings.billing.none')}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {billing.planExpiration && billing.joursRestants !== null && (
                    <div className="mt-4">
                      <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-white/80 transition-all"
                          style={{ width: `${Math.min(100, Math.max(3, (billing.joursRestants / 30) * 100))}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-2">
                    {PLAN_LABELS[billing.plan]?.features.map(f => (
                      <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-white/15 font-medium">{f}</span>
                    ))}
                  </div>
                </div>

                {/* ── Usage section ── */}
                <div className="card rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">{t('pages.settings.billing.planUsage')}</h4>
                  <div className="space-y-4">
                    {usageRows.map(({ key, label, field, formatValue }) => {
                      const unlimited = field.limite === -1
                      const pct = unlimited ? 0 : Math.min(100, Math.round((field.actuel / field.limite) * 100))
                      const atLimit = !unlimited && field.actuel >= field.limite
                      const nearLimit = !unlimited && !atLimit && pct >= 80
                      const barColor = atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-500' : 'bg-primary-500'
                      const displayActuel = formatValue ? formatValue(field.actuel) : String(field.actuel)
                      const displayLimite = unlimited ? '∞' : (formatValue ? formatValue(field.limite) : String(field.limite))
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
                            <span className={cn('font-semibold', atLimit ? 'text-red-500' : nearLimit ? 'text-amber-500' : 'text-slate-500 dark:text-slate-400')}>
                              {`${displayActuel} / ${displayLimite}`}
                            </span>
                          </div>
                          {unlimited ? (
                            <div className="h-1.5 rounded-full bg-primary-100 dark:bg-primary-900/40">
                              <div className="h-full w-full rounded-full bg-primary-200 dark:bg-primary-800/60" />
                            </div>
                          ) : (
                            <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                              <div className={cn('h-full rounded-full transition-all', barColor)} style={{ width: `${Math.max(pct, field.actuel > 0 ? 3 : 0)}%` }} />
                            </div>
                          )}
                          {atLimit && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                              {t('pages.settings.billing.limitReached')}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* ── Storage card ── */}
                {(() => {
                  const s = billing.usage.stockage
                  const unlimited = s.limite === -1
                  const pct = unlimited ? 0 : Math.min(100, Math.round((s.actuel / s.limite) * 100))
                  const atLimit = !unlimited && s.actuel >= s.limite
                  const nearLimit = !unlimited && !atLimit && pct >= 80
                  const barColor = atLimit ? 'bg-red-500' : nearLimit ? 'bg-amber-500' : 'bg-blue-500'
                  const badgeClass = atLimit
                    ? 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                    : nearLimit
                    ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  return (
                    <div className="card rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center flex-shrink-0">
                            <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{t('pages.settings.billing.storage.title')}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('pages.settings.billing.storage.subtitle')}</p>
                          </div>
                        </div>
                        <span className={cn('flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border', badgeClass)}>
                          {unlimited ? '∞' : `${pct}%`}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          {unlimited ? (
                            <div className="h-full w-full rounded-full bg-blue-200 dark:bg-blue-800/60" />
                          ) : (
                            <div
                              className={cn('h-full rounded-full transition-all duration-500', barColor)}
                              style={{ width: `${Math.max(pct, s.actuel > 0 ? 2 : 0)}%` }}
                            />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className={cn('font-semibold', atLimit ? 'text-red-500' : nearLimit ? 'text-amber-500' : 'text-slate-600 dark:text-slate-400')}>
                            {formatBytes(s.actuel)} {t('pages.settings.billing.storage.used')}
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            {t('pages.settings.billing.storage.of')} {unlimited ? '∞' : formatBytes(s.limite)}
                          </span>
                        </div>
                        {atLimit && (
                          <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5">
                            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                            {t('pages.settings.billing.limitReached')}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* ── Plan comparison ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['STARTER', 'PRO', 'BUSINESS'] as const).map(plan => {
                    const info = PLAN_LABELS[plan]
                    const isCurrent = billing.plan === plan
                    const isUpgrade = PLAN_ORDER[plan] > PLAN_ORDER[billing.plan]
                    const isDowngrade = PLAN_ORDER[plan] < PLAN_ORDER[billing.plan]
                    return (
                      <div key={plan} className={cn(
                        'rounded-xl border p-4 transition-all flex flex-col',
                        isCurrent ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/30' : 'border-slate-200 dark:border-slate-700'
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-slate-900 dark:text-white">{info.label}</p>
                          {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-600 text-white font-semibold">{t('pages.settings.billing.current')}</span>}
                        </div>
                        <p className="text-xl font-black text-slate-900 dark:text-white mb-3">
                          {info.prix === '0' ? t('pages.settings.billing.free') : `${info.prix} MAD`}
                          {info.prix !== '0' && <span className="text-xs font-normal text-slate-400 ml-1">/{t('pages.settings.billing.perMonth')}</span>}
                        </p>
                        <ul className="space-y-1.5 mb-4 flex-1">
                          {info.features.map(f => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {!isCurrent && (
                          <button
                            onClick={() => ouvrirWhatsApp(plan)}
                            className={cn(
                              'w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5',
                              isUpgrade
                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            )}
                          >
                            {isUpgrade ? (
                              <>
                                <Zap className="w-3 h-3" />
                                {t('pages.settings.billing.upgradeTo')} {info.label}
                              </>
                            ) : isDowngrade ? (
                              `${t('pages.settings.billing.downgradeTo')} ${info.label}`
                            ) : null}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => {
                      const msg = `Bonjour, je souhaite annuler mon abonnement Sayerli.\n\n📧 Email : ${profile.email || user?.email}\n🏢 Entreprise : ${company.nom}\n📦 Plan actuel : ${PLAN_LABELS[billing.plan]?.label}`
                      window.open(`https://wa.me/${WA_OWNER}?text=${encodeURIComponent(msg)}`, '_blank')
                    }}
                    className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    {t('pages.settings.billing.cancelPlan')}
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {t('pages.settings.billing.waNote')}
                  </p>
                </div>
              </>
            ) : null}

            {/* ── DGI e-Facturation section ── */}
            <div className="mt-8 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t('dgi.title')}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t('dgi.subtitle')}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{t('dgi.modeLabel')}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{t('dgi.modeDesc')}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn(
                      'text-xs font-semibold px-2.5 py-1 rounded-full border',
                      dgiMode
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
                    )}>
                      {dgiMode ? t('dgi.active') : t('dgi.inactive')}
                    </span>
                    <button
                      onClick={async () => {
                        setDgiToggling(true)
                        try {
                          const res = await settingsApi.toggleDGIMode(!dgiMode)
                          const d = res.data?.data ?? res.data
                          setDgiMode(d.dgiMode ?? !dgiMode)
                          success(dgiMode ? 'Mode DGI désactivé.' : 'Mode DGI activé.')
                        } catch (err) {
                          handleApiError(err)
                        } finally {
                          setDgiToggling(false)
                        }
                      }}
                      disabled={dgiToggling}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60',
                        dgiMode ? 'bg-slate-600 hover:bg-slate-700' : 'bg-emerald-600 hover:bg-emerald-700',
                      )}
                    >
                      {dgiToggling && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      {dgiMode ? t('dgi.disableBtn') : t('dgi.enableBtn')}
                    </button>
                  </div>
                </div>

                {!company.ice && (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {t('dgi.iceRequired')}
                  </div>
                )}

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl text-xs text-blue-700 dark:text-blue-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  {t('dgi.stubWarning')}
                </div>
              </div>
            </div>
          </div>
        )
      }

      default:
        return null
    }
  }

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{t('pages.settings.title')}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{t('pages.settings.sub')}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar nav */}
          <aside className="lg:w-52 flex-shrink-0">
            <div className="lg:hidden flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {visibleTabs.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setSaved(false); setFieldErrors({}) }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0',
                    activeTab === key
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t(`pages.settings.tabs.${key}`)}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex flex-col gap-0.5 card rounded-2xl p-2">
              {visibleTabs.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => { setActiveTab(key); setSaved(false); setFieldErrors({}) }}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left',
                    activeTab === key
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800',
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{t(`pages.settings.tabs.${key}`)}</span>
                  </div>
                  <ChevronRight className={cn('w-3.5 h-3.5 flex-shrink-0 transition-opacity', activeTab === key ? 'opacity-100' : 'opacity-0')} />
                </button>
              ))}
            </div>
          </aside>

          <div className="flex-1 card rounded-2xl p-6 min-w-0">
            {renderContent()}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
