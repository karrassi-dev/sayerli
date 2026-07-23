import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

export interface SignedDocuments {
  signedXml: string;
  signedPdf: Buffer;
  hash: string;
}

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(SignatureService.name);

  /**
   * STUB — returns documents unsigned with a SHA-256 hash of the PDF.
   * Replace with a real XAdES/PAdES provider (CNCE-accredited) when
   * the DGI/Simpl-TVA API contract is published.
   */
  async sign(xml: string, pdf: Buffer): Promise<SignedDocuments> {
    this.logger.warn('[STUB] Signature service is not yet integrated with a qualified provider.');

    const hash = crypto.createHash('sha256').update(pdf).digest('hex');

    // Real implementation: submit xml+pdf to signature API, get back signed versions.
    // const { signedXml, signedPdf } = await this.signatureProvider.sign(xml, pdf);
    return {
      signedXml: xml,
      signedPdf: pdf,
      hash,
    };
  }
}
