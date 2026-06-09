// ── Types ──────────────────────────────────────────────────────────────────────
export type ClientStatus = 'actif' | 'inactif'
export type DevisStatut = 'brouillon' | 'envoye' | 'vu' | 'accepte' | 'refuse'
export type FactureStatut = 'brouillon' | 'envoyee' | 'payee' | 'partielle' | 'en_retard'
export type PaiementMethode = 'cash' | 'virement' | 'carte' | 'cheque' | 'mobile'
export type UtilisateurRole = 'admin' | 'manager' | 'commercial' | 'comptable'

export interface Client {
  id: string; nom: string; email: string; telephone: string
  nomEntreprise: string; status: ClientStatus; notes: string
  totalDevis: number; totalFactures: number; totalPaye: number; createdAt: string
}

export interface DevisLigne {
  id: string; description: string; quantite: number; prixUnitaire: number; total: number
}

export interface Devis {
  id: string; reference: string; clientId: string; clientNom: string; clientEntreprise: string
  statut: DevisStatut; totalHT: number; taxe: number; totalTTC: number
  dateExpiration: string; createdAt: string; lignes: DevisLigne[]
}

export interface Facture {
  id: string; numero: string; clientId: string; clientNom: string; clientEntreprise: string
  statut: FactureStatut; totalHT: number; taxe: number; totalTTC: number; montantPaye: number
  dateEcheance: string; createdAt: string
}

export interface Paiement {
  id: string; factureId: string; factureNumero: string; clientNom: string
  montant: number; methode: PaiementMethode; reference: string; datePaiement: string
}

export interface Utilisateur {
  id: string; nom: string; email: string; role: UtilisateurRole
  actif: boolean; avatar: string; createdAt: string
}

// ── Mock Clients ───────────────────────────────────────────────────────────────
export const MOCK_CLIENTS: Client[] = [
  { id:'c1', nom:'Hassan Oujda', email:'hassan@imprimerie-oujda.ma', telephone:'+212 5 35 12 34 56', nomEntreprise:'Imprimerie Oujda Express', status:'actif', notes:'Client fidèle depuis 2022.', totalDevis:4, totalFactures:3, totalPaye:18400, createdAt:'2022-03-15' },
  { id:'c2', nom:'Aicha Rachidi', email:'aicha@boutique-rachidi.ma', telephone:'+212 6 67 89 01 23', nomEntreprise:'Boutique Mode Rachidi', status:'actif', notes:'E-commerçante.', totalDevis:3, totalFactures:2, totalPaye:12000, createdAt:'2022-07-01' },
  { id:'c3', nom:'Mohamed Ait Brahim', email:'contact@atlas-restaurant.ma', telephone:'+212 5 22 98 76 54', nomEntreprise:'Restaurant Atlas Marrakech', status:'actif', notes:'Restaurant haut de gamme.', totalDevis:2, totalFactures:1, totalPaye:42000, createdAt:'2023-01-10' },
  { id:'c4', nom:'Nadia Berrada', email:'nadia@berrada-consulting.ma', telephone:'+212 6 55 44 33 22', nomEntreprise:'Berrada Consulting', status:'actif', notes:'Consultante RH.', totalDevis:1, totalFactures:1, totalPaye:9800, createdAt:'2023-04-20' },
  { id:'c5', nom:'Youssef El Amrani', email:'youssef@elgroup.ma', telephone:'+212 5 22 11 00 99', nomEntreprise:'El Amrani Group', status:'actif', notes:'Groupe import-export.', totalDevis:5, totalFactures:4, totalPaye:67200, createdAt:'2021-11-05' },
  { id:'c6', nom:'Fatima Zahra Kettani', email:'fz@kettani-immo.ma', telephone:'+212 6 12 22 33 44', nomEntreprise:'Kettani Immobilier', status:'inactif', notes:'Client inactif depuis 6 mois.', totalDevis:2, totalFactures:2, totalPaye:15000, createdAt:'2022-09-12' },
  { id:'c7', nom:'Karim Tazi', email:'karim@studio-tazi.ma', telephone:'+212 6 98 87 76 65', nomEntreprise:'Studio Tazi Design', status:'actif', notes:'Agence créative.', totalDevis:6, totalFactures:5, totalPaye:34500, createdAt:'2023-02-28' },
  { id:'c8', nom:'Sara Benali', email:'sara@benali-pharma.ma', telephone:'+212 5 37 66 55 44', nomEntreprise:'Benali Pharmacie', status:'actif', notes:'Pharmacie — commandes régulières.', totalDevis:3, totalFactures:3, totalPaye:8700, createdAt:'2023-06-15' },
]

// ── Mock Devis ─────────────────────────────────────────────────────────────────
export const MOCK_DEVIS: Devis[] = [
  { id:'d1', reference:'DEV-2024-0042', clientId:'c1', clientNom:'Hassan Oujda', clientEntreprise:'Imprimerie Oujda Express', statut:'accepte', totalHT:8000, taxe:20, totalTTC:9600, dateExpiration:'2024-12-31', createdAt:'2024-11-15', lignes:[{id:'l1',description:'Site web vitrine 5 pages',quantite:1,prixUnitaire:8000,total:8000}] },
  { id:'d2', reference:'DEV-2024-0041', clientId:'c2', clientNom:'Aicha Rachidi', clientEntreprise:'Boutique Mode Rachidi', statut:'envoye', totalHT:18750, taxe:20, totalTTC:22500, dateExpiration:'2024-12-20', createdAt:'2024-11-10', lignes:[{id:'l2',description:'Boutique e-commerce',quantite:1,prixUnitaire:12000,total:12000},{id:'l3',description:'Campagne Meta Ads 3 mois',quantite:3,prixUnitaire:2250,total:6750}] },
  { id:'d3', reference:'DEV-2024-0040', clientId:'c3', clientNom:'Mohamed Ait Brahim', clientEntreprise:'Restaurant Atlas Marrakech', statut:'vu', totalHT:35000, taxe:20, totalTTC:42000, dateExpiration:'2024-12-15', createdAt:'2024-11-05', lignes:[{id:'l4',description:'Refonte identité visuelle',quantite:1,prixUnitaire:10000,total:10000},{id:'l5',description:'Application réservation',quantite:1,prixUnitaire:25000,total:25000}] },
  { id:'d4', reference:'DEV-2024-0039', clientId:'c7', clientNom:'Karim Tazi', clientEntreprise:'Studio Tazi Design', statut:'brouillon', totalHT:15000, taxe:20, totalTTC:18000, dateExpiration:'2025-01-15', createdAt:'2024-11-20', lignes:[{id:'l6',description:'Identité visuelle complète',quantite:1,prixUnitaire:15000,total:15000}] },
  { id:'d5', reference:'DEV-2024-0038', clientId:'c5', clientNom:'Youssef El Amrani', clientEntreprise:'El Amrani Group', statut:'refuse', totalHT:45000, taxe:20, totalTTC:54000, dateExpiration:'2024-11-30', createdAt:'2024-10-25', lignes:[{id:'l7',description:'ERP sur mesure',quantite:1,prixUnitaire:45000,total:45000}] },
  { id:'d6', reference:'DEV-2024-0037', clientId:'c4', clientNom:'Nadia Berrada', clientEntreprise:'Berrada Consulting', statut:'accepte', totalHT:8000, taxe:20, totalTTC:9600, dateExpiration:'2024-12-10', createdAt:'2024-10-20', lignes:[{id:'l8',description:'Site web consulting',quantite:1,prixUnitaire:8000,total:8000}] },
]

// ── Mock Factures ──────────────────────────────────────────────────────────────
export const MOCK_FACTURES: Facture[] = [
  { id:'f1', numero:'FAC-2024-0018', clientId:'c1', clientNom:'Hassan Oujda', clientEntreprise:'Imprimerie Oujda Express', statut:'payee', totalHT:8000, taxe:20, totalTTC:9600, montantPaye:9600, dateEcheance:'2024-11-30', createdAt:'2024-11-16' },
  { id:'f2', numero:'FAC-2024-0017', clientId:'c2', clientNom:'Aicha Rachidi', clientEntreprise:'Boutique Mode Rachidi', statut:'partielle', totalHT:10000, taxe:20, totalTTC:12000, montantPaye:6000, dateEcheance:'2024-12-20', createdAt:'2024-11-01' },
  { id:'f3', numero:'FAC-2024-0016', clientId:'c7', clientNom:'Karim Tazi', clientEntreprise:'Studio Tazi Design', statut:'en_retard', totalHT:12500, taxe:20, totalTTC:15000, montantPaye:0, dateEcheance:'2024-11-10', createdAt:'2024-10-15' },
  { id:'f4', numero:'FAC-2024-0015', clientId:'c5', clientNom:'Youssef El Amrani', clientEntreprise:'El Amrani Group', statut:'envoyee', totalHT:18000, taxe:20, totalTTC:21600, montantPaye:0, dateEcheance:'2024-12-31', createdAt:'2024-11-12' },
  { id:'f5', numero:'FAC-2024-0014', clientId:'c3', clientNom:'Mohamed Ait Brahim', clientEntreprise:'Restaurant Atlas Marrakech', statut:'payee', totalHT:35000, taxe:20, totalTTC:42000, montantPaye:42000, dateEcheance:'2024-11-15', createdAt:'2024-10-20' },
  { id:'f6', numero:'FAC-2024-0013', clientId:'c4', clientNom:'Nadia Berrada', clientEntreprise:'Berrada Consulting', statut:'brouillon', totalHT:6500, taxe:20, totalTTC:7800, montantPaye:0, dateEcheance:'2025-01-15', createdAt:'2024-11-22' },
]

// ── Mock Paiements ─────────────────────────────────────────────────────────────
export const MOCK_PAIEMENTS: Paiement[] = [
  { id:'p1', factureId:'f1', factureNumero:'FAC-2024-0018', clientNom:'Hassan Oujda', montant:9600, methode:'virement', reference:'VIR-2024-1125', datePaiement:'2024-11-25' },
  { id:'p2', factureId:'f2', factureNumero:'FAC-2024-0017', clientNom:'Aicha Rachidi', montant:6000, methode:'cash', reference:'CASH-2024-1105', datePaiement:'2024-11-05' },
  { id:'p3', factureId:'f5', factureNumero:'FAC-2024-0014', clientNom:'Mohamed Ait Brahim', montant:21000, methode:'virement', reference:'VIR-2024-1028', datePaiement:'2024-10-28' },
  { id:'p4', factureId:'f5', factureNumero:'FAC-2024-0014', clientNom:'Mohamed Ait Brahim', montant:21000, methode:'virement', reference:'VIR-2024-1115', datePaiement:'2024-11-15' },
  { id:'p5', factureId:'f1', factureNumero:'FAC-2024-0018', clientNom:'Hassan Oujda', montant:5000, methode:'carte', reference:'CB-2024-1101', datePaiement:'2024-11-01' },
]

// ── Mock Team ──────────────────────────────────────────────────────────────────
export const MOCK_EQUIPE: Utilisateur[] = [
  { id:'u1', nom:'Youssef El Amrani', email:'youssef@atlas-digital.ma', role:'admin', actif:true, avatar:'YE', createdAt:'2022-01-01' },
  { id:'u2', nom:'Fatima Zahra Benali', email:'fatima@atlas-digital.ma', role:'commercial', actif:true, avatar:'FZ', createdAt:'2022-03-15' },
  { id:'u3', nom:'Karim Tazi', email:'karim@atlas-digital.ma', role:'comptable', actif:true, avatar:'KT', createdAt:'2022-06-01' },
  { id:'u4', nom:'Sara Alaoui', email:'sara@atlas-digital.ma', role:'manager', actif:true, avatar:'SA', createdAt:'2023-01-10' },
  { id:'u5', nom:'Omar Benali', email:'omar@atlas-digital.ma', role:'commercial', actif:false, avatar:'OB', createdAt:'2023-04-01' },
]

// ── Dashboard Stats ────────────────────────────────────────────────────────────
export const MOCK_DASHBOARD_STATS = {
  caTotal: 207800,
  caMois: 84200,
  caMoisDernier: 71000,
  evolutionCA: 18.6,
  totalClients: 47,
  nouveauxClientsMois: 5,
  totalDevis: 38,
  devisAcceptes: 28,
  totalFactures: 24,
  facturesPayees: 18,
  facturesEnAttente: 4,
  facturesEnRetard: 2,
  paiementsEnAttente: 23400,
}

export const MOCK_CHART_DATA = [
  { mois: 'Jan', valeur: 38000 },
  { mois: 'Fév', valeur: 52000 },
  { mois: 'Mar', valeur: 44000 },
  { mois: 'Avr', valeur: 67000 },
  { mois: 'Mai', valeur: 58000 },
  { mois: 'Jun', valeur: 78000 },
  { mois: 'Jul', valeur: 65000 },
  { mois: 'Aoû', valeur: 89000 },
  { mois: 'Sep', valeur: 72000 },
  { mois: 'Oct', valeur: 95000 },
  { mois: 'Nov', valeur: 84200 },
  { mois: 'Déc', valeur: 0 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
export function formatMAD(n: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n) + ' MAD'
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'short', year: 'numeric' })
}
