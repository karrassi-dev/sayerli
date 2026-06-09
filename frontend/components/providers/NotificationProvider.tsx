'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { notificationsApi, settingsApi } from '@/lib/api'
import { NotificationBannerContainer, BannerItem } from '@/components/dashboard/NotificationBanner'

interface Prefs {
  inAppDevis: boolean
  inAppFactures: boolean
  inAppPaiements: boolean
  inAppSysteme: boolean
}

const DEVIS_TYPES    = ['DEVIS_ENVOYE', 'DEVIS_ACCEPTE', 'DEVIS_REFUSE', 'DEVIS_VU']
const FACTURE_TYPES  = ['FACTURE_CREEE', 'FACTURE_ENVOYEE', 'FACTURE_VUE', 'FACTURE_PAYEE', 'FACTURE_PARTIELLE']
const PAIEMENT_TYPES = ['PAIEMENT_RECU', 'DECLARATION_RECUE']
const SYSTEME_TYPES  = ['RAPPEL_ECHEANCE']

function isBannerAllowed(type: string, prefs: Prefs): boolean {
  if (DEVIS_TYPES.includes(type))    return prefs.inAppDevis
  if (FACTURE_TYPES.includes(type))  return prefs.inAppFactures
  if (PAIEMENT_TYPES.includes(type)) return prefs.inAppPaiements
  if (SYSTEME_TYPES.includes(type))  return prefs.inAppSysteme
  return true
}

interface NotificationContextType {
  unreadCount: number
  refresh: () => void
}

const NotificationContext = createContext<NotificationContextType>({ unreadCount: 0, refresh: () => {} })

export function useNotificationContext() {
  return useContext(NotificationContext)
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [banners, setBanners] = useState<BannerItem[]>([])
  const seenIds = useRef<Set<string>>(new Set())
  const initialized = useRef(false)
  const prefs = useRef<Prefs>({ inAppDevis: true, inAppFactures: true, inAppPaiements: true, inAppSysteme: true })

  // Load preferences once on mount
  useEffect(() => {
    settingsApi.getNotifications().then(r => {
      const d = r.data?.data ?? r.data
      prefs.current = {
        inAppDevis:     d.inAppDevis     ?? true,
        inAppFactures:  d.inAppFactures  ?? true,
        inAppPaiements: d.inAppPaiements ?? true,
        inAppSysteme:   d.inAppSysteme   ?? true,
      }
    }).catch(() => {})
  }, [])

  const fetchAndCheck = useCallback(async () => {
    try {
      const res = await notificationsApi.list(true)
      const notifications: BannerItem[] = res.data?.data ?? res.data ?? []
      setUnreadCount(notifications.length)

      if (!initialized.current) {
        notifications.forEach(n => seenIds.current.add(n.id))
        initialized.current = true
        return
      }

      const fresh = notifications.filter(n => !seenIds.current.has(n.id))
      fresh.forEach(n => seenIds.current.add(n.id))

      const allowed = fresh.filter(n => isBannerAllowed(n.type, prefs.current))
      if (allowed.length > 0) setBanners(prev => [...prev, ...allowed])
    } catch {}
  }, [])

  useEffect(() => {
    fetchAndCheck()
    const interval = setInterval(fetchAndCheck, 30_000)
    return () => clearInterval(interval)
  }, [fetchAndCheck])

  const dismissBanner = useCallback((id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id))
    notificationsApi.markRead(id).catch(() => {})
    setUnreadCount(c => Math.max(0, c - 1))
  }, [])

  const refresh = useCallback(() => { fetchAndCheck() }, [fetchAndCheck])

  return (
    <NotificationContext.Provider value={{ unreadCount, refresh }}>
      {children}
      <NotificationBannerContainer banners={banners} onDismiss={dismissBanner} />
    </NotificationContext.Provider>
  )
}
