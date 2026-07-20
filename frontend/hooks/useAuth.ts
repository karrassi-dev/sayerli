'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { authApi, setToken, removeToken } from '@/lib/api'

export interface CompanyInfo {
  utilisateurId: string
  entrepriseId: string
  nom: string
  plan: string
  role: string
}

interface User {
  id: string
  nom: string
  prenom?: string | null
  email: string
  role: string
  permissionsRetirees: string[]
}

interface Entreprise {
  id: string
  nom: string
  email: string
  devise: string
  plan: string
  typeCompte: string
  activite: string | null
  tauxEUR?: number | null
  tauxUSD?: number | null
}

interface AuthState {
  user: User | null
  entreprise: Entreprise | null
  companies: CompanyInfo[]
  loading: boolean
  error: string | null
}

const COMPANIES_KEY = 'sayerli_companies'

function saveCompanies(companies: CompanyInfo[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies))
  }
}

function loadCompanies(): CompanyInfo[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(COMPANIES_KEY) || '[]')
  } catch {
    return []
  }
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    entreprise: null,
    companies: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const token = Cookies.get('sayerli_token')
    if (token) {
      authApi.profile()
        .then((res) => {
          const data = res.data?.data || res.data
          const savedCompanies = loadCompanies()
          setState({
            user: data,
            entreprise: data?.entreprise || null,
            companies: savedCompanies,
            loading: false,
            error: null,
          })
          // Refresh company list in background
          authApi.mesEntreprises().then(r => {
            const list: CompanyInfo[] = r.data?.data || r.data || []
            saveCompanies(list)
            setState(s => ({ ...s, companies: list }))
          }).catch(() => {})
        })
        .catch(() => {
          removeToken()
          localStorage.removeItem(COMPANIES_KEY)
          setState({ user: null, entreprise: null, companies: [], loading: false, error: null })
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

      // Multi-company: redirect to company picker
      if (data.requiresCompanySelect) {
        saveCompanies(data.companies || [])
        setState((s) => ({ ...s, loading: false, error: null }))
        // Store select token temporarily in sessionStorage
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sayerli_select_token', data.selectToken)
        }
        router.push('/selectionner-entreprise')
        return
      }

      // Single company — normal flow
      setToken(data.accessToken)
      saveCompanies(data.companies || [])
      setState({
        user: data.utilisateur,
        entreprise: data.entreprise,
        companies: data.companies || [],
        loading: false,
        error: null,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur de connexion'
      setState((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const selectCompany = async (utilisateurId: string) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const selectToken = typeof window !== 'undefined'
        ? sessionStorage.getItem('sayerli_select_token') || ''
        : ''
      const res = await authApi.selectCompany(selectToken, utilisateurId)
      const data = res.data?.data || res.data
      setToken(data.accessToken)
      saveCompanies(data.companies || [])
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('sayerli_select_token')
      }
      setState({
        user: data.utilisateur,
        entreprise: data.entreprise,
        companies: data.companies || [],
        loading: false,
        error: null,
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur de sélection'
      setState((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const switchCompany = async (utilisateurId: string) => {
    try {
      const res = await authApi.changerEntreprise(utilisateurId)
      const data = res.data?.data || res.data
      setToken(data.accessToken)
      setState(s => ({
        ...s,
        user: data.utilisateur,
        entreprise: data.entreprise,
      }))
      router.push('/dashboard')
      // Force page reload to clear any cached company-specific state
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Erreur'
      console.error('switchCompany error:', msg)
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
      await authApi.register(formData)
      setState((s) => ({ ...s, loading: false, error: null }))
      router.push(`/verification-email?email=${encodeURIComponent(formData.emailAdmin)}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Erreur d'inscription"
      setState((s) => ({ ...s, loading: false, error: msg }))
    }
  }

  const logout = () => {
    removeToken()
    localStorage.removeItem(COMPANIES_KEY)
    if (typeof window !== 'undefined') sessionStorage.removeItem('sayerli_select_token')
    setState({ user: null, entreprise: null, companies: [], loading: false, error: null })
    router.push('/')
  }

  return { ...state, login, selectCompany, switchCompany, register, logout, isAuthenticated: !!state.user }
}
