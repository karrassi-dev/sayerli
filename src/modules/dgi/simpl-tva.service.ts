import { Injectable, Logger } from '@nestjs/common';

export interface SimplTVASubmitResult {
  clearanceId: string;
  clearedAt: Date;
}

@Injectable()
export class SimplTVAService {
  private readonly logger = new Logger(SimplTVAService.name);

  /**
   * STUB — simulates DGI Simpl-TVA clearance API.
   * Returns a fake clearance ID immediately (synchronous approval).
   *
   * Real implementation: POST to Simpl-TVA API with signed XML + PDF,
   * receive clearance stamp and reference from DGI.
   * API contract: not yet published by DGI/xHub (expected 2026).
   */
  async submit(
    _signedXml: string,
    _signedPdf: Buffer,
    numeroFacture: string,
  ): Promise<SimplTVASubmitResult> {
    this.logger.warn(`[STUB] Simpl-TVA submission for ${numeroFacture} — using fake clearance.`);

    await new Promise(r => setTimeout(r, 80)); // simulate network latency

    return {
      clearanceId: `DGI-STUB-${Date.now()}-${numeroFacture.replace(/[^A-Z0-9]/gi, '')}`,
      clearedAt: new Date(),
    };
  }
}
