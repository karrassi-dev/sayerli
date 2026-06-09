import axios from 'axios'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'sayerli_token'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove(TOKEN_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth
export const authApi = {
  login: (email: string, motDePasse: string) =>
    api.post('/auth/connexion', { email, motDePasse }),
  register: (data: {
    nomEntreprise: string
    emailEntreprise: string
    nomAdmin: string
    emailAdmin: string
    motDePasse: string
    telephoneEntreprise?: string
  }) => api.post('/auth/inscription', data),
  profile: () => api.get('/auth/profil'),
}

// Clients
export const clientsApi = {
  list: (recherche?: string) =>
    api.get('/clients', { params: recherche ? { recherche } : {} }),
  get: (id: string) => api.get(`/clients/${id}`),
  create: (data: unknown) => api.post('/clients', data),
  update: (id: string, data: unknown) => api.patch(`/clients/${id}`, data),
  delete: (id: string) => api.delete(`/clients/${id}`),
  stats: (id: string) => api.get(`/clients/${id}/statistiques`),
}

// Devis
export const devisApi = {
  list: (params?: { statut?: string; clientId?: string; recherche?: string }) =>
    api.get('/devis', { params }),
  get: (id: string) => api.get(`/devis/${id}`),
  create: (data: unknown) => api.post('/devis', data),
  update: (id: string, data: unknown) => api.put(`/devis/${id}`, data),
  updateStatus: (id: string, statut: string) =>
    api.patch(`/devis/${id}/statut`, { statut }),
  generateLink: (id: string) => api.post(`/devis/${id}/lien-public`),
  convertToInvoice: (id: string) => api.post(`/devis/${id}/convertir-facture`),
  delete: (id: string) => api.delete(`/devis/${id}`),
}

// Public devis (no auth required)
const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

export const publicDevisApi = {
  get: (token: string) => publicApi.get(`/public/devis/${token}`),
  accept: (token: string) => publicApi.post(`/public/devis/${token}/accepter`),
  refuse: (token: string) => publicApi.post(`/public/devis/${token}/refuser`),
}

// Factures
export const facturesApi = {
  list: (params?: { statut?: string; clientId?: string; recherche?: string }) =>
    api.get('/factures', { params }),
  get: (id: string) => api.get(`/factures/${id}`),
  create: (data: unknown) => api.post('/factures', data),
  update: (id: string, data: unknown) => api.put(`/factures/${id}`, data),
  updateStatus: (id: string, statut: string) =>
    api.patch(`/factures/${id}/statut`, { statut }),
  dashboard: () => api.get('/factures/tableau-de-bord'),
  delete: (id: string) => api.delete(`/factures/${id}`),
}

// Paiements
export const paiementsApi = {
  list: (params?: { factureId?: string; methode?: string; recherche?: string }) =>
    api.get('/paiements', { params }),
  get: (id: string) => api.get(`/paiements/${id}`),
  create: (data: unknown) => api.post('/paiements', data),
  update: (id: string, data: unknown) => api.patch(`/paiements/${id}`, data),
  delete: (id: string) => api.delete(`/paiements/${id}`),
  stats: () => api.get('/paiements/statistiques'),
}

// Équipe
export const equipeApi = {
  list: (params?: { recherche?: string }) =>
    api.get('/equipe', { params }),
  get: (id: string) => api.get(`/equipe/${id}`),
  invite: (data: unknown) => api.post('/equipe', data),
  update: (id: string, data: unknown) => api.patch(`/equipe/${id}`, data),
  disable: (id: string) => api.patch(`/equipe/${id}/desactiver`),
  enable: (id: string) => api.patch(`/equipe/${id}/activer`),
  delete: (id: string) => api.delete(`/equipe/${id}`),
}

// Invitation (public — no auth)
export const invitationApi = {
  accept: (token: string, motDePasse: string) =>
    publicApi.post(`/invitation/${token}`, { motDePasse }),
}

// Notifications
export const notificationsApi = {
  list: (nonLues?: boolean) =>
    api.get('/notifications', { params: nonLues ? { nonLues: 'true' } : {} }),
  count: () => api.get('/notifications/compteur'),
  markRead: (id: string) => api.patch(`/notifications/${id}/lire`),
  markAllRead: () => api.patch('/notifications/tout-lire'),
}

// Entreprise
export const entrepriseApi = {
  get: () => api.get('/entreprise'),
  stats: () => api.get('/entreprise/statistiques'),
  update: (data: unknown) => api.patch('/entreprise', data),
}

// Dashboard Analytics
export const dashboardApi = {
  analytics: () => api.get('/dashboard/analytics'),
}

// Settings
export const settingsApi = {
  // Profile
  getProfile: () => api.get('/settings/profile'),
  updateProfile: (data: { nom?: string; telephone?: string }) =>
    api.patch('/settings/profile', data),

  // Company
  getCompany: () => api.get('/settings/company'),
  updateCompany: (data: {
    nom?: string; ice?: string; rc?: string; telephone?: string;
    email?: string; website?: string; adresse?: string; ville?: string; pays?: string;
  }) => api.patch('/settings/company', data),

  // Branding
  getBranding: () => api.get('/settings/branding'),
  updateBranding: (data: { couleurPrimaire?: string; logo?: string }) =>
    api.patch('/settings/branding', data),
  uploadLogo: (file: File) => {
    const form = new FormData()
    form.append('logo', file)
    return api.post('/settings/branding/logo', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Preferences
  getPreferences: () => api.get('/settings/preferences'),
  updatePreferences: (data: { langue?: string; theme?: string; devise?: string; formatDate?: string }) =>
    api.patch('/settings/preferences', data),

  // Notifications
  getNotifications: () => api.get('/settings/notifications'),
  updateNotifications: (data: {
    emailNotifications?: boolean; notificationsDevis?: boolean;
    notificationsFactures?: boolean; notificationsPaiements?: boolean; notificationsSysteme?: boolean;
  }) => api.patch('/settings/notifications', data),

  // Security
  changePassword: (data: {
    motDePasseActuel: string; nouveauMotDePasse: string; confirmationMotDePasse: string;
  }) => api.post('/settings/change-password', data),

  // Billing
  getBilling: () => api.get('/settings/billing'),
}

// Token helpers
export const setToken = (token: string) =>
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' })

export const getToken = () => Cookies.get(TOKEN_KEY)

export const removeToken = () => Cookies.remove(TOKEN_KEY)
