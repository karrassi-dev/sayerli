'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { notificationsApi } from '@/lib/api'
import { NotificationBannerContainer, BannerItem } from '@/components/dashboard/NotificationBanner'

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
      if (fresh.length > 0) setBanners(prev => [...prev, ...fresh])
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
