export type PermissionKey =
  | 'clients.read' | 'clients.create' | 'clients.edit' | 'clients.delete'
  | 'devis.read' | 'devis.create' | 'devis.edit' | 'devis.delete' | 'devis.send'
  | 'factures.read' | 'factures.create' | 'factures.edit' | 'factures.delete'
  | 'factures.send' | 'factures.relance' | 'factures.annuler'
  | 'paiements.read' | 'paiements.create' | 'paiements.delete' | 'paiements.declarations'
  | 'export' | 'dashboard' | 'catalogue.read' | 'catalogue.manage'
  | 'equipe.read' | 'equipe.manage' | 'settings' | 'billing'

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
}

export const ROLE_DEFAULTS: Record<string, PermissionKey[]> = {
  PROPRIETAIRE: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.delete','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage',
    'equipe.read','equipe.manage','settings','billing',
  ],
  ADMIN: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.delete','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage',
    'equipe.read','equipe.manage','settings',
  ],
  MANAGER: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read','factures.create','factures.edit','factures.send','factures.relance','factures.annuler',
    'paiements.read','paiements.create','paiements.delete','paiements.declarations',
    'export','dashboard','catalogue.read','catalogue.manage','equipe.read',
  ],
  DAF: [
    'factures.read','paiements.read','paiements.declarations',
    'export','dashboard','equipe.read',
  ],
  COMPTABLE: [
    'factures.read','paiements.read','paiements.create','paiements.declarations',
    'export','dashboard',
  ],
  COMPTABLE_EXTERNE: [
    'clients.read',
    'factures.read','paiements.read','paiements.declarations',
    'export','dashboard',
  ],
  RESPONSABLE_RECOUVREMENT: [
    'clients.read',
    'factures.read','factures.relance',
    'paiements.create','paiements.declarations',
  ],
  CAISSIER: [
    'factures.read',
    'paiements.create',
  ],
  COMMERCIAL: [
    'clients.read','clients.create','clients.edit','clients.delete',
    'devis.read','devis.create','devis.edit','devis.delete','devis.send',
    'factures.read',
    'dashboard','catalogue.read','catalogue.manage',
  ],
  COMMERCIAL_PROPRE: [
    'clients.read','clients.create','clients.edit',
    'devis.read','devis.create','devis.edit','devis.send',
    'factures.read',
    'dashboard','catalogue.read',
  ],
  ASSISTANT: [
    'clients.read','clients.create','clients.edit',
    'devis.read','devis.create','devis.edit',
    'factures.read','factures.create','factures.edit',
    'catalogue.read',
  ],
  ASSOCIE: [
    'factures.read',
    'dashboard',
  ],
}

export function roleHasPermission(role: string, permissionsRetirees: string[], permission: PermissionKey): boolean {
  const defaults = ROLE_DEFAULTS[role] ?? []
  if (!defaults.includes(permission)) return false
  return !permissionsRetirees.includes(permission)
}
