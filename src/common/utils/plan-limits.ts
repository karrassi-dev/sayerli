import { HttpException, HttpStatus } from '@nestjs/common';
import { PlanType } from '@prisma/client';

export interface PlanLimits {
  clients: number;
  devisParMois: number;
  facturesParMois: number;
  bonsLivraisonParMois: number;
  utilisateurs: number;
  relancesParMois: number;
  receiptsEmailsParMois: number;
  journalDesVentes: boolean;
  depensesParMois: number;
  depensesStorageBytes: number;
}

// -1 = unlimited
const MB = 1024 * 1024;
const GB = 1024 * MB;

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  STARTER:  { clients: 5,  devisParMois: 5,   facturesParMois: 5,   bonsLivraisonParMois: 5,   utilisateurs: 2,  relancesParMois: 3,  receiptsEmailsParMois: 5,   journalDesVentes: false, depensesParMois: 20,  depensesStorageBytes: 200 * MB },
  PRO:      { clients: 20, devisParMois: 100, facturesParMois: 100, bonsLivraisonParMois: 100, utilisateurs: 5,  relancesParMois: -1, receiptsEmailsParMois: -1,  journalDesVentes: true,  depensesParMois: 150, depensesStorageBytes: 5 * GB   },
  BUSINESS: { clients: -1, devisParMois: -1,  facturesParMois: -1,  bonsLivraisonParMois: -1,  utilisateurs: 12, relancesParMois: -1, receiptsEmailsParMois: -1,  journalDesVentes: true,  depensesParMois: -1,  depensesStorageBytes: 20 * GB  },
};

export function verifierLimite(
  resource: 'clients' | 'devis' | 'factures' | 'bons-livraison' | 'utilisateurs' | 'relances' | 'receipts' | 'depenses',
  actuel: number,
  limite: number,
) {
  if (limite === -1 || actuel < limite) return;
  throw new HttpException(
    {
      message: 'PLAN_LIMIT',
      errors: { code: 'PLAN_LIMIT', resource, limite, actuel },
    },
    HttpStatus.PAYMENT_REQUIRED,
  );
}
