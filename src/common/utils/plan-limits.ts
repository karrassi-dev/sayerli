import { HttpException, HttpStatus } from '@nestjs/common';
import { PlanType } from '@prisma/client';

export interface PlanLimits {
  clients: number;
  devisParMois: number;
  facturesParMois: number;
  utilisateurs: number;
  relancesParMois: number;
  receiptsEmailsParMois: number;
  journalDesVentes: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  STARTER:  { clients: 3,  devisParMois: 5,  facturesParMois: 5,  utilisateurs: 1, relancesParMois: 3,  receiptsEmailsParMois: 5,   journalDesVentes: false },
  PRO:      { clients: 20, devisParMois: 20, facturesParMois: 20, utilisateurs: 1, relancesParMois: -1, receiptsEmailsParMois: -1,  journalDesVentes: true  },
  BUSINESS: { clients: -1, devisParMois: -1, facturesParMois: -1, utilisateurs: 3, relancesParMois: -1, receiptsEmailsParMois: -1,  journalDesVentes: true  },
};

export function verifierLimite(
  resource: 'clients' | 'devis' | 'factures' | 'utilisateurs' | 'relances' | 'receipts',
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
