export type PermissionKey =
  | 'clients.read' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'devis.read' | 'devis.create' | 'devis.edit' | 'devis.delete' | 'devis.send'
  | 'factures.read' | 'factures.create' | 'factures.edit' | 'factures.delete'
  | 'factures.send' | 'factures.relance' | 'factures.annuler'
  | 'paiements.read' | 'paiements.create' | 'paiements.delete' | 'paiements.declarations'
  | 'export' | 'dashboard' | 'catalogue.read' | 'catalogue.manage'
  | 'equipe.read' | 'equipe.manage' | 'settings' | 'billing'
  | 'bons-livraison.read' | 'bons-livraison.manage'

export const ALL_PERMISSIONS: PermissionKey[] = [
  'clients.read','clients.create','clients.edit','clients.delete',
  'devis.read','devis.create','devis.edit','devis.delete','devis.send',
  'factures.read','factures.create','factures.edit','factures.delete','factures.send','factures.relance','factures.annuler',
  'paiements.read','paiements.create','paiements.delete','paiements.declarations',
  'export','dashboard','catalogue.read','catalogue.manage',
  'equipe.read','equipe.manage','settings','billing',
  'bons-livraison.read','bons-livraison.manage',
]

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  'clients.read': 'Voir les clients',
  'clients.create': 'Créer des clients',
  'clients.edit': 'Modifier des clients',
  'clients.delete': 'Supprimer des clients',
  'devis.read': 'Voir les devis',
  'devis.create': 'Créer des devis',
  'devis.edit': 'Modifier des devis',
  'devis.delete': 'Supprimer des devis',
  'devis.send': 'Envoyer des devis',
  'factures.read': 'Voir les factures',
  'factures.create': 'Créer des factures',
  'factures.edit': 'Modifier des factures',
  'factures.delete': 'Supprimer des factures',
  'factures.send': 'Envoyer des factures',
  'factures.relance': 'Relancer les factures',
  'factures.annuler': 'Annuler des factures',
  'paiements.read': 'Voir les paiements',
  'paiements.create': 'Enregistrer des paiements',
  'paiements.delete': 'Supprimer des paiements',
  'paiements.declarations': 'Approuver les déclarations de paiement',
  'export': 'Exporter le journal des ventes',
  'dashboard': 'Accès au tableau de bord',
  'catalogue.read': 'Voir le catalogue',
  'catalogue.manage': 'Gérer le catalogue',
  'equipe.read': "Voir l'équipe",
  'equipe.manage': "Gérer l'équipe",
  'settings': 'Paramètres entreprise',
  'billing': 'Facturation & Plan',
  'bons-livraison.read': 'Voir les bons de livraison',
  'bons-livraison.manage': 'Créer/modifier des bons de livraison',
}

export const ROLE_LABELS: Record<string, string> = {
  PROPRIETAIRE: 'Propriétaire',
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  DAF: 'Directeur Financier (DAF)',
  COMPTABLE: 'Comptable',
  COMPTABLE_EXTERNE: 'Comptable Externe / Fiduciaire',
  RESPONSABLE_RECOUVREMENT: 'Responsable Recouvrement',
  CAISSIER: 'Caissier',
  COMMERCIAL: 'Commercial',
  COMMERCIAL_PROPRE: 'Agent Commercial (isolé)',
  ASSISTANT: 'Assistant Administratif',
  ASSOCIE: 'Associé / Investisseur',
}

export const ROLE_DESCRIPTIONS: Record<string, string> = {
  ADMIN: "Accès total sauf facturation. Gère toute l'équipe.",
  MANAGER: 'Gestion opérationnelle complète. Pas de paramètres.',
  DAF: 'Lecture financière + export. Ne crée rien.',
  COMPTABLE: 'Paiements et exports. Comptable interne salarié.',
  COMPTABLE_EXTERNE: 'Fiduciaire externe. Lecture seule + export.',
  RESPONSABLE_RECOUVREMENT: "Relances et encaissements d'impayés uniquement.",
  CAISSIER: 'Enregistre les paiements reçus. Accès caisse uniquement.',
  COMMERCIAL: 'Gestion clients et devis. Voit tout le portefeuille.',
  COMMERCIAL_PROPRE: 'Comme Commercial, mais uniquement ses propres clients.',
  ASSISTANT: 'Prépare les documents. Ne peut pas envoyer ni valider.',
  ASSOCIE: 'Associé silencieux. Lecture des KPIs uniquement.',
}

export const ROLE_DEFAULTS: Record<string, PermissionKey[]> = {
  PROPRIETAIRE: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.delete','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage',
    'equipe.read','equipe.manage','settings','billing',
    'bons-livraison.read','bons-livraison.manage',
  ],
  ADMIN: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.delete','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage',
    'equipe.read','equipe.manage','settings',
    'bons-livraison.read','bons-livraison.manage',
  ],
  MANAGER: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage','equipe.read',
    'bons-livraison.read','bons-livraison.manage',
  ],
  DAF: ['factures.read','paiements.read','paiements.declarations','export','dashboard','equipe.read','bons-livraison.read'],
  COMPTABLE: ['factures.read','paiements.read','paiements.create','paiements.declarations','export','dashboard','bons-livraison.read'],
  COMPTABLE_EXTERNE: ['clients.read','factures.read','paiements.read','paiements.declarations','export','dashboard','bons-livraison.read'],
  RESPONSABLE_RECOUVREMENT: ['clients.read','factures.read','factures.relance','paiements.create','paiements.declarations'],
  CAISSIER: ['factures.read','paiements.create'],
  COMMERCIAL: ['clients.read','clients.create','clients.edit','clients.delete','devis.read','devis.create','devis.edit','devis.delete','devis.send','factures.read','dashboard','catalogue.read','catalogue.manage','bons-livraison.read','bons-livraison.manage'],
  COMMERCIAL_PROPRE: ['clients.read','clients.create','clients.edit','devis.read','devis.create','devis.edit','devis.send','factures.read','dashboard','catalogue.read','bons-livraison.read','bons-livraison.manage'],
  ASSISTANT: ['clients.read','clients.create','clients.edit','devis.read','devis.create','devis.edit','factures.read','factures.create','factures.edit','catalogue.read','bons-livraison.read','bons-livraison.manage'],
  ASSOCIE: ['factures.read','dashboard','bons-livraison.read'],
}

export const INVITABLE_ROLES = Object.keys(ROLE_DEFAULTS).filter(r => r !== 'PROPRIETAIRE')

export const ROLE_COLORS: Record<string, string> = {
  PROPRIETAIRE:             'from-yellow-500 to-amber-600',
  ADMIN:                    'from-primary-500 to-primary-600',
  MANAGER:                  'from-teal-500 to-teal-600',
  DAF:                      'from-blue-500 to-blue-700',
  COMPTABLE:                'from-purple-500 to-violet-600',
  COMPTABLE_EXTERNE:        'from-violet-500 to-purple-700',
  RESPONSABLE_RECOUVREMENT: 'from-red-500 to-rose-600',
  CAISSIER:                 'from-green-500 to-emerald-600',
  COMMERCIAL:               'from-orange-500 to-amber-600',
  COMMERCIAL_PROPRE:        'from-orange-400 to-orange-600',
  ASSISTANT:                'from-slate-400 to-slate-600',
  ASSOCIE:                  'from-indigo-400 to-indigo-600',
}

export const ROLE_BG: Record<string, string> = {
  PROPRIETAIRE:             'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
  ADMIN:                    'bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-800',
  MANAGER:                  'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
  DAF:                      'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
  COMPTABLE:                'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
  COMPTABLE_EXTERNE:        'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
  RESPONSABLE_RECOUVREMENT: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
  CAISSIER:                 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800',
  COMMERCIAL:               'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
  COMMERCIAL_PROPRE:        'bg-orange-50 dark:bg-orange-950/40 border-orange-100 dark:border-orange-900',
  ASSISTANT:                'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700',
  ASSOCIE:                  'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
}
