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
    typeCompte?: string
  }) => api.post('/auth/inscription', data),
  profile: () => api.get('/auth/profil'),
  selectCompany: (selectToken: string, utilisateurId: string) =>
    api.post('/auth/selectionner-entreprise', { selectToken, utilisateurId }),
  mesEntreprises: () => api.get('/auth/mes-entreprises'),
  changerEntreprise: (utilisateurId: string) =>
    api.post('/auth/changer-entreprise', { utilisateurId }),
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
  portalLink: (id: string) => api.get(`/clients/${id}/lien-portal`),
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
  duplicate: (id: string) => api.post(`/devis/${id}/dupliquer`),
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

export const portalApi = {
  get: (token: string) => publicApi.get(`/public/portal/${token}`),
  acceptDevis: (token: string, devisId: string) =>
    publicApi.post(`/public/portal/${token}/devis/${devisId}/accepter`),
}

// Invitation public info (no auth required)
export const invitationInfoApi = {
  info: (token: string) => publicApi.get(`/invitation/${token}/info`),
  accept: (token: string, motDePasse?: string) =>
    publicApi.post(`/invitation/${token}`, motDePasse ? { motDePasse } : {}),
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
  send: (id: string) => api.post(`/factures/${id}/envoyer`),
  relancer: (id: string) => api.post(`/factures/${id}/relancer`),
  annuler: (id: string) => api.patch(`/factures/${id}/annuler`),
  dashboard: () => api.get('/factures/tableau-de-bord'),
  delete: (id: string) => api.delete(`/factures/${id}`),
  // Declarations
  declarations: (statut?: string) =>
    api.get('/factures/declarations', { params: statut ? { statut } : {} }),
  approveDeclaration: (id: string) =>
    api.patch(`/factures/declarations/${id}/approuver`),
  rejectDeclaration: (id: string, raison?: string) =>
    api.patch(`/factures/declarations/${id}/rejeter`, { raison }),
}

// Public factures (no auth required)
export const publicFacturesApi = {
  get: (token: string) => publicApi.get(`/public/factures/${token}`),
  declarer: (token: string, data: unknown) =>
    publicApi.post(`/public/factures/${token}/declarer-paiement`, data),
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
  resendInvite: (id: string) => api.post(`/equipe/${id}/reinviter`),
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
  delete: (id: string) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete('/notifications'),
}

// Bons de livraison
export const bonsLivraisonApi = {
  list: (params?: { statut?: string; clientId?: string; recherche?: string }) =>
    api.get('/bons-livraison', { params }),
  get: (id: string) => api.get(`/bons-livraison/${id}`),
  create: (data: unknown) => api.post('/bons-livraison', data),
  update: (id: string, data: unknown) => api.put(`/bons-livraison/${id}`, data),
  delete: (id: string) => api.delete(`/bons-livraison/${id}`),
  creerDepuisDevis: (devisId: string) => api.post(`/bons-livraison/depuis-devis/${devisId}`),
  envoyer: (id: string) => api.post(`/bons-livraison/${id}/envoyer`),
  marquerLivre: (id: string) => api.post(`/bons-livraison/${id}/marquer-livre`),
  dupliquer: (id: string) => api.post(`/bons-livraison/${id}/dupliquer`),
  convertirEnFacture: (id: string) => api.post(`/bons-livraison/${id}/convertir-en-facture`),
  grouperEnFacture: (data: { blIds: string[]; clientId: string }) => api.post('/bons-livraison/grouper-en-facture', data),
}

export const publicBLApi = {
  get: (token: string) => publicApi.get(`/public/bl/${token}`),
  confirmerReception: (token: string) => publicApi.post(`/public/bl/${token}/confirmer-reception`),
}

// Entreprise
export const entrepriseApi = {
  get: () => api.get('/entreprise'),
  stats: () => api.get('/entreprise/statistiques'),
  update: (data: unknown) => api.patch('/entreprise', data),
}

// Catalogue produits & services
export const catalogueApi = {
  list:   (recherche?: string, type?: string) => api.get('/catalogue', { params: { ...(recherche ? { recherche } : {}), ...(type ? { type } : {}) } }),
  create: (data: unknown) => api.post('/catalogue', data),
  update: (id: string, data: unknown) => api.patch(`/catalogue/${id}`, data),
  delete: (id: string) => api.delete(`/catalogue/${id}`),
}

// Dashboard Analytics
export const dashboardApi = {
  analytics: (typeClient?: string) => api.get('/dashboard/analytics', { params: typeClient ? { typeClient } : undefined }),
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
    titulaireCompte?: string; banque?: string; rib?: string; iban?: string; swift?: string;
  }) => api.patch('/settings/company', data),

  // Branding
  getBranding: () => api.get('/settings/branding'),
  updateBranding: (data: { couleurPrimaire?: string; logo?: string; templateDocument?: string }) =>
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
  updatePreferences: (data: { langue?: string; theme?: string; devise?: string; formatDate?: string; tauxEUR?: number | null; tauxUSD?: number | null; regimeTVA?: string }) =>
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

// Export
export const exportApi = {
  data: (params: { types: string; dateDebut?: string; dateFin?: string }) =>
    api.get('/export/data', { params }),
}

export const declarationsTvaApi = {
  calculer: (params: { debut: string; fin: string; tauxEUR?: number; tauxUSD?: number }) =>
    api.get('/declarations-tva/calculer', { params }),
}

// Graph
export const graphApi = {
  getData: () => api.get('/graph'),
}

// Contact
export const contactApi = {
  submit: (data: {
    name: string
    email: string
    phone?: string
    company?: string
    subject: string
    message: string
  }) => api.post('/contact', data),
}

// Super Admin
export const superAdminApi = {
  getEntreprises: () => api.get('/super-admin/entreprises'),
  getEntrepriseDetail: (id: string) => api.get(`/super-admin/entreprises/${id}`),
}

// Token helpers
export const setToken = (token: string) =>
  Cookies.set(TOKEN_KEY, token, { expires: 7, sameSite: 'strict' })

export const getToken = () => Cookies.get(TOKEN_KEY)

export const removeToken = () => Cookies.remove(TOKEN_KEY)
