'use client'

import { useState, useEffect } from 'react'

export function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    try {
      const entry = document.cookie
        .split('; ')
        .find(r => r.startsWith('sayerli_token='))
      if (!entry) return
      const token = entry.split('=')[1]
      const payload = JSON.parse(atob(token.split('.')[1]))
      setLoggedIn(typeof payload.exp === 'number' && payload.exp * 1000 > Date.now())
    } catch {
      // malformed token — treat as logged out
    }
  }, [])

  return loggedIn
}
