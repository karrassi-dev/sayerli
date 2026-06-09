'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from 'next-themes'
import {
  User, Building2, Palette, Globe, Sun, Moon, Monitor, Bell, Shield, CreditCard,
  Camera, Check, ChevronRight, Eye, EyeOff, Zap, AlertCircle,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { StatusBadge } from '@/components/dashboard/ui/StatusBadge'
import { ToastContainer } from '@/components/dashboard/ui/Toast'
import { settingsApi } from '@/lib/api'
import { LOCALES } from '@/lib/i18n'
import { cn } from '@/lib/utils'

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
  STARTER: { label: 'Starter', prix: '0', features: ['5 clients', '10 devis/mois', '1 utilisateur'] },
  PRO:     { label: 'Pro',     prix: '299', features: ['Clients illimités', 'Devis illimités', '5 utilisateurs'] },
  BUSINESS:{ label: 'Business',prix: '599', features: ['Tout Pro', 'Utilisateurs illimités', 'API accès'] },
}

function SaveButton({ onClick, saving, saved, disabled }: { onClick: () => void; saving: boolean; saved: boolean; disabled?: boolean }) {
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
      {saving ? 'Enregistrement...' : saved ? 'Enregistré !' : 'Enregistrer'}
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

export default function SettingsPage() {
  const { t, setLocale } = useTranslation()
  const { setTheme } = useTheme()
  const { user } = useAuth()
  const { toasts, success, error: toastError, removeToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('profile')

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
  })
  const [companyLoading, setCompanyLoading] = useState(true)

  // ─── Branding state ──────────────────────────────────────────────────────
  const [branding, setBranding] = useState({ logo: '', couleurPrimaire: '#2563eb' })
  const [brandingLoading, setBrandingLoading] = useState(true)
  const [selectedColor, setSelectedColor] = useState('#2563eb')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)

  // ─── Preferences state ───────────────────────────────────────────────────
  const [prefs, setPrefs] = useState({ langue: 'fr', theme: 'system', devise: 'MAD', formatDate: 'DD/MM/YYYY' })
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
  })
  const [notifsLoading, setNotifsLoading] = useState(true)

  // ─── Security state ──────────────────────────────────────────────────────
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwForm, setPwForm] = useState({ motDePasseActuel: '', nouveauMotDePasse: '', confirmationMotDePasse: '' })

  // ─── Billing state ───────────────────────────────────────────────────────
  const [billing, setBilling] = useState<{ plan: string; planExpiration: string | null; usage: { clients: number; utilisateurs: number }; limits: { prix: number } } | null>(null)
  const [billingLoading, setBillingLoading] = useState(true)

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
      })
    }).catch(() => {}).finally(() => setCompanyLoading(false))

    settingsApi.getBranding().then(r => {
      const d = r.data?.data ?? r.data
      setBranding({ logo: d.logo ?? '', couleurPrimaire: d.couleurPrimaire ?? '#2563eb' })
      setSelectedColor(d.couleurPrimaire ?? '#2563eb')
    }).catch(() => {}).finally(() => setBrandingLoading(false))

    settingsApi.getPreferences().then(r => {
      const d = r.data?.data ?? r.data
      const savedTheme = d.theme ?? 'system'
      const savedLocale = d.langue ?? 'fr'
      setPrefs({ langue: savedLocale, theme: savedTheme, devise: d.devise ?? 'MAD', formatDate: d.formatDate ?? 'DD/MM/YYYY' })
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
      })
    }).catch(() => {}).finally(() => setNotifsLoading(false))

    settingsApi.getBilling().then(r => {
      setBilling(r.data?.data ?? r.data)
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
    try {
      await settingsApi.updateCompany(company)
      success('Entreprise mise à jour', 'Les informations de votre entreprise ont été enregistrées.')
      triggerSaved()
    } catch (err) { handleApiError(err) }
    finally { setSaving(false) }
  }

  const saveBranding = async () => {
    setSaving(true)
    try {
      await settingsApi.updateBranding({ couleurPrimaire: selectedColor })
      setBranding(b => ({ ...b, couleurPrimaire: selectedColor }))
      success('Identité mise à jour', 'Votre couleur principale a été enregistrée.')
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
      await settingsApi.updatePreferences({ langue: prefs.langue, devise: prefs.devise, formatDate: prefs.formatDate })
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
              <p className="text-xs text-slate-500 dark:text-slate-400">Vos informations personnelles</p>
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
      case 'company':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.company.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Informations légales et coordonnées de votre entreprise</p>
            </div>
            {companyLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { key: 'nom', label: t('pages.settings.company.name'), colSpan: true, errorKey: 'companyNom' },
                  { key: 'ice', label: t('pages.settings.company.ice') },
                  { key: 'rc', label: t('pages.settings.company.rc') },
                  { key: 'telephone', label: t('pages.settings.company.phone') },
                  { key: 'email', label: t('pages.settings.company.email'), type: 'email' },
                  { key: 'website', label: t('pages.settings.company.website') },
                  { key: 'adresse', label: t('pages.settings.company.address'), colSpan: true },
                  { key: 'ville', label: t('pages.settings.company.city') },
                  { key: 'pays', label: t('pages.settings.company.country') },
                ] as { key: keyof typeof company; label: string; colSpan?: boolean; type?: string; errorKey?: string }[]).map(field => (
                  <div key={field.key} className={field.colSpan ? 'sm:col-span-2' : ''}>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">{field.label}</label>
                    <input
                      type={field.type ?? 'text'}
                      value={company[field.key]}
                      onChange={e => setCompany(c => ({ ...c, [field.key]: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
                    />
                    {field.errorKey && <FieldError msg={fieldErrors[field.errorKey]} />}
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
          </div>
        )

      // ── BRANDING ─────────────────────────────────────────────────────────
      case 'branding':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.branding.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Personnalisez l&apos;apparence de vos documents</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 block">{t('pages.settings.branding.logo')}</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                  {branding.logo ? (
                    <img src={logoUrl(branding.logo)} alt="Logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-black">S</span>
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
                  <p className="text-xs text-slate-400 mt-1.5">PNG, JPG ou SVG — max 2MB</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 block">{t('pages.settings.branding.primaryColor')}</label>
              {brandingLoading ? (
                <div className="flex gap-3">{[1,2,3,4,5,6].map(i => <div key={i} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
              ) : (
                <div className="flex flex-wrap gap-3 items-center">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.color}
                      onClick={() => setSelectedColor(c.color)}
                      title={c.name}
                      className={cn('w-9 h-9 rounded-xl transition-all hover:scale-110 relative', c.class)}
                    >
                      {selectedColor === c.color && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </span>
                      )}
                    </button>
                  ))}
                  <div className="flex items-center gap-2">
                    <div className="relative w-9 h-9">
                      <input
                        type="color"
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                        className="w-9 h-9 rounded-xl border-0 cursor-pointer p-0 opacity-0 absolute inset-0"
                      />
                      <div className="w-9 h-9 rounded-xl border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center pointer-events-none" style={{ backgroundColor: selectedColor }}>
                        {!PRESET_COLORS.find(c => c.color === selectedColor) && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{selectedColor}</span>
                  </div>
                </div>
              )}
            </div>

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
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.notifications.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gérez les alertes et notifications</p>
            </div>

            {notifsLoading ? (
              <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}</div>
            ) : (
              <div className="space-y-3">
                {([
                  { key: 'emailNotifications' as const, labelKey: 'pages.settings.notifications.email' },
                  { key: 'notificationsDevis' as const, labelKey: 'pages.settings.notifications.devisAccepted' },
                  { key: 'notificationsFactures' as const, labelKey: 'pages.settings.notifications.invoiceOverdue' },
                  { key: 'notificationsPaiements' as const, labelKey: 'pages.settings.notifications.paymentReceived' },
                  { key: 'notificationsSysteme' as const, labelKey: 'pages.settings.notifications.email' },
                ]).map(n => (
                  <div key={n.key} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', notifs[n.key] ? 'bg-green-100 dark:bg-green-950/50' : 'bg-slate-100 dark:bg-slate-800')}>
                        <Bell className={cn('w-4 h-4', notifs[n.key] ? 'text-green-600 dark:text-green-400' : 'text-slate-400')} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t(n.labelKey)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Notification par email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                      className={cn('relative w-11 h-6 rounded-full transition-all', notifs[n.key] ? 'bg-primary-600' : 'bg-slate-200 dark:bg-slate-700')}
                    >
                      <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform', notifs[n.key] && 'translate-x-5')} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <SaveButton onClick={saveNotifications} saving={saving} saved={saved} />
            </div>
          </div>
        )

      // ── SECURITY ─────────────────────────────────────────────────────────
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.security.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gérez la sécurité de votre compte</p>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-300">Compte sécurisé</p>
                <p className="text-xs text-green-600 dark:text-green-400">Authentification JWT active — Session valide</p>
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
      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{t('pages.settings.billing.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gérez votre abonnement Sayerli</p>
            </div>

            {billingLoading ? (
              <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ) : billing ? (
              <>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 text-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-80">Plan actuel</span>
                      </div>
                      <p className="text-2xl font-black">{PLAN_LABELS[billing.plan]?.label ?? billing.plan}</p>
                      <p className="text-sm opacity-80 mt-1">
                        {PLAN_LABELS[billing.plan]?.prix === '0' ? 'Gratuit' : `${PLAN_LABELS[billing.plan]?.prix} MAD / mois`}
                      </p>
                    </div>
                    {billing.planExpiration && (
                      <div className="text-right">
                        <p className="text-xs opacity-70 mb-1">Renouvellement</p>
                        <p className="text-sm font-bold">{new Date(billing.planExpiration).toLocaleDateString('fr-MA')}</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap gap-2">
                    {PLAN_LABELS[billing.plan]?.features.map(f => (
                      <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-white/15 font-medium">{f}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(['STARTER', 'PRO', 'BUSINESS'] as const).map(plan => {
                    const info = PLAN_LABELS[plan]
                    const isCurrent = billing.plan === plan
                    return (
                      <div key={plan} className={cn('rounded-xl border p-4 transition-all', isCurrent ? 'border-primary-400 bg-primary-50/50 dark:bg-primary-950/30' : 'border-slate-200 dark:border-slate-700')}>
                        <div className="flex items-center justify-between mb-3">
                          <p className="font-bold text-slate-900 dark:text-white">{info.label}</p>
                          {isCurrent && <span className="text-xs px-2 py-0.5 rounded-full bg-primary-600 text-white font-semibold">Actuel</span>}
                        </div>
                        <p className="text-xl font-black text-slate-900 dark:text-white mb-3">{info.prix === '0' ? 'Gratuit' : `${info.prix} MAD`}</p>
                        <ul className="space-y-1.5 mb-4">
                          {info.features.map(f => (
                            <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                              <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        {!isCurrent && (
                          <button className="w-full py-2 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            {info.prix > PLAN_LABELS[billing.plan]?.prix ? t('pages.settings.billing.upgrade') : 'Downgrade'}
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors">
                    {t('pages.settings.billing.cancelPlan')}
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )

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
              {TABS.map(({ key, icon: Icon }) => (
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
              {TABS.map(({ key, icon: Icon }) => (
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
