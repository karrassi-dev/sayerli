import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

type FacturePourUBL = Prisma.FactureGetPayload<{
  include: {
    client: true;
    lignes: true;
    entreprise: true;
  };
}>;

@Injectable()
export class UBLService {
  generate(facture: FacturePourUBL): string {
    const dev = facture.devise ?? 'MAD';
    const issueDate = this.fmtDate(facture.createdAt);
    const dueDate = facture.dateEcheance ? this.fmtDate(facture.dateEcheance) : issueDate;
    const totalHT = Number(facture.totalHT);
    const totalTTC = Number(facture.totalTTC);
    const taxe = Number(facture.taxe);
    const remise = Number(facture.remise ?? 0);
    const montantTVA = totalTTC - totalHT;

    const lignesXML = facture.lignes
      .map((l, i) => {
        const qty = Number(l.quantite);
        const pu = Number(l.prixUnitaire);
        const lineTotal = qty * pu;
        return `
  <cac:InvoiceLine>
    <cbc:ID>${i + 1}</cbc:ID>
    <cbc:InvoicedQuantity unitCode="C62">${qty.toFixed(3)}</cbc:InvoicedQuantity>
    <cbc:LineExtensionAmount currencyID="${dev}">${lineTotal.toFixed(2)}</cbc:LineExtensionAmount>
    <cac:Item>
      <cbc:Description>${this.escapeXml(l.description)}</cbc:Description>
      <cac:ClassifiedTaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${taxe.toFixed(2)}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>TVA</cbc:ID></cac:TaxScheme>
      </cac:ClassifiedTaxCategory>
    </cac:Item>
    <cac:Price>
      <cbc:PriceAmount currencyID="${dev}">${pu.toFixed(2)}</cbc:PriceAmount>
    </cac:Price>
  </cac:InvoiceLine>`.trim();
      })
      .join('\n  ');

    return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>urn:dgi.ma:simpl-tva:2026:efacture:1.0</cbc:CustomizationID>
  <cbc:ProfileID>efacture-maroc</cbc:ProfileID>
  <cbc:ID>${this.escapeXml(facture.numeroFacture)}</cbc:ID>
  <cbc:IssueDate>${issueDate}</cbc:IssueDate>
  <cbc:DueDate>${dueDate}</cbc:DueDate>
  <cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>${dev}</cbc:DocumentCurrencyCode>
  <cbc:TaxCurrencyCode>MAD</cbc:TaxCurrencyCode>
  ${facture.notes ? `<cbc:Note>${this.escapeXml(facture.notes)}</cbc:Note>` : ''}

  <cac:AccountingSupplierParty>
    <cac:Party>
      ${facture.entreprise.ice ? `<cac:PartyIdentification><cbc:ID schemeID="ICE">${this.escapeXml(facture.entreprise.ice)}</cbc:ID></cac:PartyIdentification>` : ''}
      ${facture.entreprise.rc ? `<cac:PartyIdentification><cbc:ID schemeID="RC">${this.escapeXml(facture.entreprise.rc)}</cbc:ID></cac:PartyIdentification>` : ''}
      <cac:PartyName><cbc:Name>${this.escapeXml(facture.entreprise.nom)}</cbc:Name></cac:PartyName>
      <cac:PostalAddress>
        ${facture.entreprise.adresse ? `<cbc:StreetName>${this.escapeXml(facture.entreprise.adresse)}</cbc:StreetName>` : ''}
        ${facture.entreprise.ville ? `<cbc:CityName>${this.escapeXml(facture.entreprise.ville)}</cbc:CityName>` : ''}
        <cac:Country><cbc:IdentificationCode>MA</cbc:IdentificationCode></cac:Country>
      </cac:PostalAddress>
      <cac:Contact>
        ${facture.entreprise.email ? `<cbc:ElectronicMail>${this.escapeXml(facture.entreprise.email)}</cbc:ElectronicMail>` : ''}
        ${facture.entreprise.telephone ? `<cbc:Telephone>${this.escapeXml(facture.entreprise.telephone)}</cbc:Telephone>` : ''}
      </cac:Contact>
    </cac:Party>
  </cac:AccountingSupplierParty>

  <cac:AccountingCustomerParty>
    <cac:Party>
      ${facture.client.ice ? `<cac:PartyIdentification><cbc:ID schemeID="ICE">${this.escapeXml(facture.client.ice)}</cbc:ID></cac:PartyIdentification>` : ''}
      <cac:PartyName><cbc:Name>${this.escapeXml(facture.client.nomEntreprise ?? facture.client.nom)}</cbc:Name></cac:PartyName>
      <cac:Contact>
        ${facture.client.email ? `<cbc:ElectronicMail>${this.escapeXml(facture.client.email)}</cbc:ElectronicMail>` : ''}
        ${facture.client.telephone ? `<cbc:Telephone>${this.escapeXml(facture.client.telephone)}</cbc:Telephone>` : ''}
      </cac:Contact>
    </cac:Party>
  </cac:AccountingCustomerParty>

  <cac:PaymentMeans>
    <cbc:PaymentMeansCode>30</cbc:PaymentMeansCode>
    ${facture.entreprise.rib ? `<cac:PayeeFinancialAccount><cbc:ID>${this.escapeXml(facture.entreprise.rib)}</cbc:ID></cac:PayeeFinancialAccount>` : ''}
  </cac:PaymentMeans>

  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="MAD">${montantTVA.toFixed(2)}</cbc:TaxAmount>
    <cac:TaxSubtotal>
      <cbc:TaxableAmount currencyID="MAD">${totalHT.toFixed(2)}</cbc:TaxableAmount>
      <cbc:TaxAmount currencyID="MAD">${montantTVA.toFixed(2)}</cbc:TaxAmount>
      <cac:TaxCategory>
        <cbc:ID>S</cbc:ID>
        <cbc:Percent>${taxe.toFixed(2)}</cbc:Percent>
        <cac:TaxScheme><cbc:ID>TVA</cbc:ID></cac:TaxScheme>
      </cac:TaxCategory>
    </cac:TaxSubtotal>
  </cac:TaxTotal>

  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="${dev}">${(totalHT + remise).toFixed(2)}</cbc:LineExtensionAmount>
    <cbc:TaxExclusiveAmount currencyID="${dev}">${totalHT.toFixed(2)}</cbc:TaxExclusiveAmount>
    <cbc:TaxInclusiveAmount currencyID="${dev}">${totalTTC.toFixed(2)}</cbc:TaxInclusiveAmount>
    ${remise > 0 ? `<cbc:AllowanceTotalAmount currencyID="${dev}">${remise.toFixed(2)}</cbc:AllowanceTotalAmount>` : ''}
    <cbc:PayableAmount currencyID="${dev}">${totalTTC.toFixed(2)}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>

  ${lignesXML}
</Invoice>`;
  }

  private fmtDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private escapeXml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
