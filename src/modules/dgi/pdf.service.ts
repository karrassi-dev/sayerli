import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { Prisma } from '@prisma/client';

type FacturePourPDF = Prisma.FactureGetPayload<{
  include: {
    client: true;
    lignes: true;
    entreprise: true;
  };
}>;

const GRAY = '#6B7280';
const DARK = '#111827';
const LIGHT = '#F9FAFB';
const BORDER = '#E5E7EB';

@Injectable()
export class PDFService {
  async generate(facture: FacturePourPDF): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const brand = facture.entreprise.couleurPrimaire ?? '#2563eb';
      const dev = facture.devise ?? 'MAD';
      const W = 595 - 100; // page width minus margins

      // Header bar
      doc.rect(50, 50, W, 3).fill(brand);

      // Company name
      doc.moveDown(0.5);
      doc.fontSize(18).fillColor(DARK).font('Helvetica-Bold')
        .text(facture.entreprise.nom, 50, 65, { width: W / 2 });

      // Invoice label top-right
      doc.fontSize(10).fillColor(GRAY).font('Helvetica')
        .text('FACTURE', 50 + W / 2, 65, { width: W / 2, align: 'right' });
      doc.fontSize(20).fillColor(DARK).font('Helvetica-Bold')
        .text(facture.numeroFacture, 50 + W / 2, 78, { width: W / 2, align: 'right' });

      // Company details
      let y = 105;
      doc.fontSize(8).fillColor(GRAY).font('Helvetica');
      if (facture.entreprise.adresse)
        doc.text(facture.entreprise.adresse, 50, y, { width: W / 2 }), (y += 11);
      if (facture.entreprise.email)
        doc.text(facture.entreprise.email, 50, y, { width: W / 2 }), (y += 11);
      if (facture.entreprise.telephone)
        doc.text(facture.entreprise.telephone, 50, y, { width: W / 2 }), (y += 11);
      if (facture.entreprise.ice)
        doc.text(`ICE : ${facture.entreprise.ice}`, 50, y, { width: W / 2 }), (y += 11);
      if (facture.entreprise.rc)
        doc.text(`RC : ${facture.entreprise.rc}`, 50, y, { width: W / 2 }), (y += 11);

      // Divider
      y = Math.max(y, 150);
      doc.moveTo(50, y).lineTo(50 + W, y).strokeColor(BORDER).lineWidth(1).stroke();
      y += 15;

      // Emetteur / Destinataire
      doc.fontSize(7).fillColor(GRAY).font('Helvetica').text('ÉMETTEUR', 50, y);
      doc.text('DESTINATAIRE', 50 + W / 2, y);
      y += 12;

      doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold')
        .text(facture.entreprise.nom, 50, y, { width: W / 2 - 10 });
      doc.text(facture.client.nomEntreprise ?? facture.client.nom, 50 + W / 2, y, { width: W / 2 });
      y += 13;

      doc.fontSize(8).fillColor(GRAY).font('Helvetica');
      if (facture.client.email)
        doc.text(facture.client.email, 50 + W / 2, y, { width: W / 2 }), (y += 11);
      if (facture.client.telephone)
        doc.text(facture.client.telephone, 50 + W / 2, y, { width: W / 2 }), (y += 11);
      if (facture.client.ice)
        doc.text(`ICE : ${facture.client.ice}`, 50 + W / 2, y, { width: W / 2 }), (y += 11);

      y = Math.max(y, 210);
      y += 10;

      // Dates row
      doc.moveTo(50, y).lineTo(50 + W, y).strokeColor(BORDER).lineWidth(0.5).stroke();
      y += 8;
      doc.fontSize(7).fillColor(GRAY).font('Helvetica').text("DATE D'ÉMISSION", 50, y);
      if (facture.dateEcheance)
        doc.text("DATE D'ÉCHÉANCE", 200, y);
      y += 11;
      doc.fontSize(9).fillColor(DARK).font('Helvetica-Bold')
        .text(this.fmtDate(facture.createdAt), 50, y);
      if (facture.dateEcheance)
        doc.text(this.fmtDate(facture.dateEcheance), 200, y);
      y += 20;

      // Table header
      doc.rect(50, y, W, 22).fill(DARK);
      doc.fontSize(7).fillColor('#FFFFFF').font('Helvetica-Bold')
        .text('DÉSIGNATION', 58, y + 7, { width: W * 0.5 })
        .text('QTÉ', 58 + W * 0.5, y + 7, { width: W * 0.12, align: 'center' })
        .text('P.U. HT', 58 + W * 0.62, y + 7, { width: W * 0.18, align: 'right' })
        .text('TOTAL HT', 58 + W * 0.8, y + 7, { width: W * 0.18, align: 'right' });
      y += 22;

      // Table rows
      facture.lignes.forEach((l, i) => {
        const rowH = 20;
        if (i % 2 === 1) doc.rect(50, y, W, rowH).fill(LIGHT);
        const qty = Number(l.quantite);
        const pu = Number(l.prixUnitaire);
        doc.fontSize(8).fillColor(DARK).font('Helvetica')
          .text(l.description, 58, y + 5, { width: W * 0.5 - 8 })
          .text(String(qty), 58 + W * 0.5, y + 5, { width: W * 0.12, align: 'center' })
          .text(this.fmt(pu, dev), 58 + W * 0.62, y + 5, { width: W * 0.18, align: 'right' });
        doc.font('Helvetica-Bold')
          .text(this.fmt(qty * pu, dev), 58 + W * 0.8, y + 5, { width: W * 0.18, align: 'right' });
        doc.moveTo(50, y + rowH).lineTo(50 + W, y + rowH).strokeColor(BORDER).lineWidth(0.5).stroke();
        y += rowH;
      });

      y += 15;

      // Totals block (right-aligned)
      const totX = 50 + W / 2;
      const totW = W / 2;
      const totalHT = Number(facture.totalHT);
      const totalTTC = Number(facture.totalTTC);
      const taxe = Number(facture.taxe);
      const remise = Number(facture.remise ?? 0);
      const montantTVA = totalTTC - totalHT;

      const totRow = (label: string, value: string, bold = false, bg?: string) => {
        if (bg) doc.rect(totX, y, totW, 18).fill(bg);
        doc.fontSize(8)
          .fillColor(bg ? '#FFFFFF' : GRAY)
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(label, totX + 8, y + 4, { width: totW * 0.55 })
          .text(value, totX + 8, y + 4, { width: totW - 16, align: 'right' });
        doc.moveTo(totX, y + 18).lineTo(totX + totW, y + 18).strokeColor(BORDER).lineWidth(0.5).stroke();
        y += 18;
      };

      totRow('Sous-total HT', this.fmt(totalHT + remise, dev));
      if (remise > 0) totRow(`Remise`, `−${this.fmt(remise, dev)}`);
      totRow(`TVA ${taxe}%`, this.fmt(montantTVA, dev));
      totRow('TOTAL TTC', this.fmt(totalTTC, dev), true, DARK);

      if (facture.rasActif) {
        const rasM = Number(facture.rasMontant ?? 0);
        const net = totalTTC - rasM;
        y += 2;
        totRow(`RAS (${Number(facture.rasTaux)}%)`, `−${this.fmt(rasM, dev)}`);
        totRow('NET À PAYER', this.fmt(net, dev), true, '#EA580C');
      }

      // Notes
      if (facture.notes) {
        y += 20;
        doc.rect(50, y, W, 14).fill(DARK);
        doc.fontSize(7).fillColor('#FFFFFF').font('Helvetica-Bold').text('NOTES', 58, y + 3);
        y += 14;
        doc.rect(50, y, W, 28).fill(LIGHT);
        doc.fontSize(8).fillColor(GRAY).font('Helvetica')
          .text(facture.notes, 58, y + 6, { width: W - 16 });
        y += 28;
      }

      // Bank info
      if (facture.entreprise.rib || facture.entreprise.iban) {
        y += 15;
        doc.rect(50, y, W, 14).fill(DARK);
        doc.fontSize(7).fillColor('#FFFFFF').font('Helvetica-Bold')
          .text('INFORMATIONS DE PAIEMENT', 58, y + 3);
        y += 14;
        doc.fontSize(8).fillColor(DARK).font('Helvetica');
        if (facture.entreprise.titulaireCompte)
          doc.text(`Bénéficiaire : ${facture.entreprise.titulaireCompte}`, 58, y + 6), (y += 12);
        if (facture.entreprise.banque)
          doc.text(`Banque : ${facture.entreprise.banque}`, 58, y + 6), (y += 12);
        if (facture.entreprise.rib)
          doc.text(`RIB : ${facture.entreprise.rib}`, 58, y + 6), (y += 12);
        if (facture.entreprise.iban)
          doc.text(`IBAN : ${facture.entreprise.iban}`, 58, y + 6), (y += 12);
        y += 6;
      }

      // Footer
      const footerY = 780;
      doc.moveTo(50, footerY).lineTo(50 + W, footerY).strokeColor(BORDER).lineWidth(0.5).stroke();
      doc.fontSize(7).fillColor(GRAY).font('Helvetica')
        .text('Document généré électroniquement par Sayerli · Logiciel de facturation pour PME marocaines', 50, footerY + 6, { width: W, align: 'center' });

      doc.end();
    });
  }

  private fmtDate(d: Date): string {
    return d.toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  private fmt(v: number, dev = 'MAD'): string {
    const locale: Record<string, string> = { MAD: 'fr-MA', EUR: 'fr-FR', USD: 'en-US' };
    return new Intl.NumberFormat(locale[dev] ?? 'fr-MA', {
      style: 'currency', currency: dev, minimumFractionDigits: 2, maximumFractionDigits: 2,
    }).format(v);
  }
}
