import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StatutFacture, DGIStatut, Prisma } from '@prisma/client';
import { UBLService } from './ubl.service';
import { PDFService } from './pdf.service';
import { SignatureService } from './signature.service';
import { SimplTVAService } from './simpl-tva.service';
import { DGIR2Service } from './dgi-r2.service';

type FacturePourDGI = Prisma.FactureGetPayload<{
  include: {
    client: true;
    lignes: true;
    entreprise: true;
  };
}>;

export interface DGIPipelineResult {
  publicToken: string;
  lienPublic: string;
  dgiClearanceId: string;
}

@Injectable()
export class DGIService {
  private readonly logger = new Logger(DGIService.name);

  constructor(
    private prisma: PrismaService,
    private ublService: UBLService,
    private pdfService: PDFService,
    private signatureService: SignatureService,
    private simplTvaService: SimplTVAService,
    private r2Service: DGIR2Service,
  ) {}

  async envoyerAvecDGI(facture: FacturePourDGI): Promise<DGIPipelineResult> {
    this.logger.log(`[DGI] Starting pipeline for facture ${facture.numeroFacture}`);

    // Step 1 — mark as pending clearance
    await this.prisma.facture.update({
      where: { id: facture.id },
      data: {
        statut: StatutFacture.CLEARANCE_EN_COURS,
        dgiMode: true,
        dgiStatut: DGIStatut.EN_ATTENTE,
        dgiSoumisAt: new Date(),
      },
    });

    try {
      // Step 2 — generate UBL 2.1 XML
      const xml = this.ublService.generate(facture);
      this.logger.log(`[DGI] UBL generated (${xml.length} bytes)`);

      // Step 3 — generate server-side PDF
      const pdfBuffer = await this.pdfService.generate(facture);
      this.logger.log(`[DGI] PDF generated (${pdfBuffer.length} bytes)`);

      // Step 4 — sign (stub until CNCE-accredited provider is integrated)
      const { signedXml, signedPdf, hash } = await this.signatureService.sign(xml, pdfBuffer);

      // Step 5 — submit to Simpl-TVA (stub until DGI API is published)
      const { clearanceId, clearedAt } = await this.simplTvaService.submit(
        signedXml,
        signedPdf,
        facture.numeroFacture,
      );
      this.logger.log(`[DGI] Clearance obtained: ${clearanceId}`);

      // Step 6 — store immutable artifacts in R2
      const year = new Date().getFullYear().toString();
      const { xmlKey, pdfKey } = await this.r2Service.store({
        entrepriseId: facture.entrepriseId,
        factureId: facture.id,
        year,
        xml: Buffer.from(signedXml, 'utf-8'),
        pdf: signedPdf,
      });

      // Step 7 — persist DGI metadata and flip to ENVOYEE
      await this.prisma.facture.update({
        where: { id: facture.id },
        data: {
          statut: StatutFacture.ENVOYEE,
          dateEnvoi: clearedAt,
          dgiStatut: DGIStatut.VALIDEE,
          dgiClearanceId: clearanceId,
          dgiValideAt: clearedAt,
          xmlStorageKey: xmlKey,
          pdfStorageKey: pdfKey,
          documentHash: hash,
        },
      });

      this.logger.log(`[DGI] Pipeline complete for ${facture.numeroFacture}`);
      return {
        publicToken: facture.publicToken,
        lienPublic: `/public/factures/${facture.publicToken}`,
        dgiClearanceId: clearanceId,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'DGI pipeline error';
      this.logger.error(`[DGI] Pipeline failed for ${facture.numeroFacture}: ${message}`);

      await this.prisma.facture.update({
        where: { id: facture.id },
        data: {
          statut: StatutFacture.REJETEE_DGI,
          dgiStatut: DGIStatut.REJETEE,
          dgiRaisonRejet: message,
        },
      });

      throw new BadRequestException(`Échec de la soumission DGI : ${message}`);
    }
  }

  async getDocumentUrl(pdfStorageKey: string): Promise<string> {
    return this.r2Service.presignedUrl(pdfStorageKey);
  }

  async getXmlUrl(xmlStorageKey: string): Promise<string> {
    return this.r2Service.presignedUrl(xmlStorageKey);
  }
}
