'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authApi, setToken, removeToken } from '@/lib/api'

interface User {
  id: string
  nom: string
  email: string
  role: string
}

interface Entreprise {
  id: string
  nom: string
  email: string
  devise: string
  plan: string
}

interface AuthState {
  user: User | null
  entreprise: Entreprise | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    entreprise: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    const token = Cookies.get('sayerli_token')
    if (token) {
      authApi.profile()
        .then((res) => {
          const data = res.data?.data || res.data
          setState({ user: data, entreprise: data?.entreprise || null, loading: false, error: null })
        })
        .catch(() => {
          removeToken()
          setState({ user: null, entreprise: null, loading: false, error: null })
        })
    } else {
      setState((s) => ({ ...s, loading: false }))
    }
  }, [])

  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await authApi.login(email, password)
      const data = res.data?.data || res.data
      setToken(data.accessToken)
      setState({
        user: data.utilisateur,
        entreprise: data.entreprise,
        loading: false,
        error: null,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur de connexion'
      setState((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const register = async (formData: {
    nomEntreprise: string
    emailEntreprise: string
    nomAdmin: string
    emailAdmin: string
    motDePasse: string
    telephoneEntreprise?: string
    typeCompte?: string
  }) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const res = await authApi.register(formData)
      const data = res.data?.data || res.data
      setState((s) => ({ ...s, loading: false, error: null }))
      router.push(`/verification-email?email=${encodeURIComponent(formData.emailAdmin)}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur d\'inscription'
      setState((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const logout = () => {
    removeToken()
    setState({ user: null, entreprise: null, loading: false, error: null })
    router.push('/')
  }

  return { ...state, login, register, logout, isAuthenticated: !!state.user }
}
