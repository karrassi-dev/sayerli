import { HttpException, HttpStatus } from '@nestjs/common';
import { PlanType } from '@prisma/client';

export const PLAN_LIMITS: Record<PlanType, { clients: number; devisParMois: number; facturesParMois: number; utilisateurs: number }> = {
  STARTER:  { clients: 5,  devisParMois: 10, facturesParMois: 10, utilisateurs: 1  },
  PRO:      { clients: -1, devisParMois: -1, facturesParMois: -1, utilisateurs: 5  },
  BUSINESS: { clients: -1, devisParMois: -1, facturesParMois: -1, utilisateurs: -1 },
};

export function verifierLimite(
  resource: 'clients' | 'devis' | 'factures' | 'utilisateurs',
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
