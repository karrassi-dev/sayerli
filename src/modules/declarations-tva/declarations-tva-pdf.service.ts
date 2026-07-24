import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';

export interface DeclarationTVAData {
  entrepriseNom: string;
  periode: { debut: string; fin: string };
  regime: string;
  groupes: { taux: number; baseHT: number; tva: number; count: number }[];
  totalBaseHT: number;
  totalTVA: number;
  groupesDepenses: { taux: number; montantHT: number; tva: number; count: number }[];
  totalBaseHTDepenses: number;
  totalTVADeductible: number;
  totalTVANette: number;
  generatedAt: string;
}

const GREEN  = '#16a34a';
const AMBER  = '#d97706';
const BLUE   = '#1d4ed8';
const DARK   = '#111827';
const GRAY   = '#6B7280';
const BORDER = '#E5E7EB';
const LIGHT  = '#F9FAFB';
const WHITE  = '#FFFFFF';

@Injectable()
export class DeclarationTVAPDFService {
  async generate(data: DeclarationTVAData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const W = 495;
      const fmt = (v: number) =>
        new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' MAD';
      const regimeLabel = data.regime === 'DEBITS' ? 'Débits' : 'Encaissements';

      let y = 50;

      // Header bar
      doc.rect(50, y, W, 4).fill(GREEN);
      y += 14;

      // Title
      doc.fontSize(18).fillColor(GREEN).font('Helvetica-Bold').text('Déclaration TVA', 50, y);
      y += 24;
      doc.fontSize(9).fillColor(GRAY).font('Helvetica')
        .text('Document généré automatiquement — à titre indicatif', 50, y);
      y += 20;

      // Company + meta
      doc.fontSize(12).fillColor(DARK).font('Helvetica-Bold').text(data.entrepriseNom, 50, y);
      y += 16;
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text(`Période : ${data.periode.debut} au ${data.periode.fin}`, 50, y)
        .text(`Régime : ${regimeLabel}`, 320, y);
      y += 20;

      // Green divider
      doc.moveTo(50, y).lineTo(50 + W, y).strokeColor(GREEN).lineWidth(2).stroke();
      y += 18;

      // ── Section 1: TVA Collectée ──────────────────────────────────────────────
      doc.fontSize(9).fillColor(GREEN).font('Helvetica-Bold')
        .text('DÉTAIL PAR TAUX DE TVA', 50, y);
      y += 14;

      doc.rect(50, y, W, 20).fill(DARK);
      doc.fontSize(7).fillColor(WHITE).font('Helvetica-Bold')
        .text('Taux TVA', 58, y + 6, { width: W * 0.3 })
        .text('Base HT (MAD)', 58 + W * 0.3, y + 6, { width: W * 0.35, align: 'right' })
        .text('TVA collectée (MAD)', 58 + W * 0.65, y + 6, { width: W * 0.33, align: 'right' });
      y += 20;

      if (data.groupes.length === 0) {
        doc.fontSize(8).fillColor(GRAY).font('Helvetica')
          .text('Aucun paiement ou facture sur cette période.', 58, y + 4);
        y += 22;
      } else {
        data.groupes.forEach((g, i) => {
          if (i % 2 === 1) doc.rect(50, y, W, 18).fill(LIGHT);
          doc.fontSize(8).fillColor(DARK).font('Helvetica')
            .text(g.taux === 0 ? 'Exonéré (0%)' : `${g.taux}%`, 58, y + 4, { width: W * 0.3 })
            .text(fmt(g.baseHT), 58 + W * 0.3, y + 4, { width: W * 0.35, align: 'right' });
          doc.font('Helvetica-Bold')
            .text(fmt(g.tva), 58 + W * 0.65, y + 4, { width: W * 0.33, align: 'right' });
          doc.moveTo(50, y + 18).lineTo(50 + W, y + 18).strokeColor(BORDER).lineWidth(0.5).stroke();
          y += 18;
        });
      }

      // Total row (green)
      doc.rect(50, y, W, 22).fill(GREEN);
      doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold')
        .text('TOTAL', 58, y + 6, { width: W * 0.3 })
        .text(fmt(data.totalBaseHT), 58 + W * 0.3, y + 6, { width: W * 0.35, align: 'right' })
        .text(fmt(data.totalTVA), 58 + W * 0.65, y + 6, { width: W * 0.33, align: 'right' });
      y += 22 + 18;

      // ── Section 2: TVA Déductible ─────────────────────────────────────────────
      doc.fontSize(9).fillColor(AMBER).font('Helvetica-Bold')
        .text('TVA DÉDUCTIBLE (DÉPENSES)', 50, y);
      y += 14;

      if (data.groupesDepenses.length === 0) {
        doc.rect(50, y, W, 22).fill(LIGHT);
        doc.fontSize(8).fillColor(GRAY).font('Helvetica')
          .text('Aucune dépense avec TVA sur cette période.', 58, y + 6);
        y += 22 + 18;
      } else {
        doc.rect(50, y, W, 20).fill(AMBER);
        doc.fontSize(7).fillColor(WHITE).font('Helvetica-Bold')
          .text('Taux TVA', 58, y + 6, { width: W * 0.3 })
          .text('Montant HT (MAD)', 58 + W * 0.3, y + 6, { width: W * 0.35, align: 'right' })
          .text('TVA déductible (MAD)', 58 + W * 0.65, y + 6, { width: W * 0.33, align: 'right' });
        y += 20;

        data.groupesDepenses.forEach((g, i) => {
          if (i % 2 === 1) doc.rect(50, y, W, 18).fill(LIGHT);
          doc.fontSize(8).fillColor(DARK).font('Helvetica')
            .text(g.taux === 0 ? 'Exonéré (0%)' : `${g.taux}%`, 58, y + 4, { width: W * 0.3 })
            .text(fmt(g.montantHT), 58 + W * 0.3, y + 4, { width: W * 0.35, align: 'right' });
          doc.font('Helvetica-Bold')
            .text(fmt(g.tva), 58 + W * 0.65, y + 4, { width: W * 0.33, align: 'right' });
          doc.moveTo(50, y + 18).lineTo(50 + W, y + 18).strokeColor(BORDER).lineWidth(0.5).stroke();
          y += 18;
        });

        // Total row (amber)
        doc.rect(50, y, W, 22).fill(AMBER);
        doc.fontSize(8).fillColor(WHITE).font('Helvetica-Bold')
          .text('TOTAL', 58, y + 6, { width: W * 0.3 })
          .text(fmt(data.totalBaseHTDepenses), 58 + W * 0.3, y + 6, { width: W * 0.35, align: 'right' })
          .text(fmt(data.totalTVADeductible), 58 + W * 0.65, y + 6, { width: W * 0.33, align: 'right' });
        y += 22 + 18;
      }

      // ── Section 3: TVA Nette ──────────────────────────────────────────────────
      doc.fontSize(9).fillColor(BLUE).font('Helvetica-Bold')
        .text('TVA NETTE À PAYER', 50, y);
      y += 14;

      const boxH = 88;
      doc.rect(50, y, W, boxH).fill('#EFF6FF');
      doc.rect(50, y, W, boxH).stroke('#BFDBFE');

      // TVA collectée row
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('TVA collectée', 66, y + 12);
      doc.fillColor(GREEN).font('Helvetica-Bold')
        .text(`+${fmt(data.totalTVA)}`, 66, y + 12, { width: W - 32, align: 'right' });

      // TVA déductible row
      doc.fontSize(8).fillColor(GRAY).font('Helvetica')
        .text('TVA déductible', 66, y + 32);
      doc.fillColor(AMBER).font('Helvetica-Bold')
        .text(`-${fmt(data.totalTVADeductible)}`, 66, y + 32, { width: W - 32, align: 'right' });

      // Separator
      doc.moveTo(66, y + 54).lineTo(50 + W - 16, y + 54).strokeColor('#BFDBFE').lineWidth(1).stroke();

      // TVA nette row
      doc.fontSize(10).fillColor(BLUE).font('Helvetica-Bold')
        .text('TVA nette à payer', 66, y + 62);
      doc.fontSize(13).fillColor(BLUE).font('Helvetica-Bold')
        .text(fmt(data.totalTVANette), 66, y + 60, { width: W - 32, align: 'right' });

      y += boxH + 20;

      // Footer
      const footerY = Math.min(y, 760);
      doc.moveTo(50, footerY).lineTo(50 + W, footerY).strokeColor(BORDER).lineWidth(0.5).stroke();
      doc.fontSize(7).fillColor(GRAY).font('Helvetica')
        .text(`Générée le ${data.generatedAt} · ${data.entrepriseNom}`, 50, footerY + 7, { width: W / 2 })
        .text('sayerli.com — Document à titre indicatif', 50, footerY + 7, { width: W, align: 'right' });

      doc.end();
    });
  }
}
