import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const G900 = '#0f172a'
const G600 = '#475569'
const G400 = '#94a3b8'
const G200 = '#e2e8f0'
const G050 = '#f8fafc'
const GREEN    = '#16a34a'
const GREEN_BG = '#f0fdf4'
const GREEN_BD = '#bbf7d0'
const WHITE    = '#ffffff'

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire',
  CASH:     'Espèces',
  CHEQUE:   'Chèque',
  CARTE:    'Carte bancaire',
  MOBILE:   'Mobile',
  AUTRE:    'Autre',
}

export interface RecuPDFProps {
  numeroFacture: string
  client: { nom: string; nomEntreprise?: string | null; email?: string | null }
  entreprise: {
    nom: string
    logoUrl?: string | null
    adresse?: string | null
    telephone?: string | null
    email?: string | null
    couleurPrimaire?: string | null
    ice?: string | null
  }
  paiements: { id?: string; montant: number | string; methode: string; datePaiement: string; reference?: string | null }[]
  totalTTC: number | string
  montantPaye: number | string
  generatedAt: string
}

function n(v: number | string): number {
  return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0)
}

function fmt(v: number | string) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' MAD'
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function RecuPDF({
  numeroFacture, client, entreprise, paiements, totalTTC, montantPaye, generatedAt,
}: RecuPDFProps) {
  const brand     = entreprise.couleurPrimaire || '#16a34a'
  const montant   = n(montantPaye)
  const total     = n(totalTTC)
  const restant   = Math.max(0, total - montant)
  const isFullyPaid = restant < 0.01

  const styles = StyleSheet.create({
    page:       { fontFamily: 'Helvetica', fontSize: 9, color: G900, backgroundColor: WHITE, paddingBottom: 50 },
    header:     { backgroundColor: brand, padding: '24 32', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logo:       { width: 40, height: 40, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', objectFit: 'contain' },
    logoPlaceholder: { width: 40, height: 40, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    headerEntNom:  { color: WHITE, fontSize: 14, fontFamily: 'Helvetica-Bold' },
    headerEntSub:  { color: 'rgba(255,255,255,0.7)', fontSize: 8, marginTop: 2 },
    headerRight: { alignItems: 'flex-end' },
    headerTitle: { color: WHITE, fontSize: 10, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
    headerNum:   { color: WHITE, fontSize: 18, fontFamily: 'Helvetica-Bold', marginTop: 2 },
    section:    { paddingHorizontal: 32, paddingVertical: 16 },
    row2:       { flexDirection: 'row', gap: 16 },
    col:        { flex: 1 },
    label:      { color: G400, fontSize: 7, fontFamily: 'Helvetica-Bold', letterSpacing: 0.8, marginBottom: 4, textTransform: 'uppercase' },
    value:      { color: G900, fontSize: 9, fontFamily: 'Helvetica-Bold' },
    valueSub:   { color: G600, fontSize: 8, marginTop: 2 },
    divider:    { height: 1, backgroundColor: G200, marginHorizontal: 32 },
    tableHead:  { flexDirection: 'row', backgroundColor: G050, paddingVertical: 6, paddingHorizontal: 32, borderBottomWidth: 1, borderBottomColor: G200 },
    tableRow:   { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 32, borderBottomWidth: 1, borderBottomColor: G050 },
    tableRowAlt:{ flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 32, borderBottomWidth: 1, borderBottomColor: G050, backgroundColor: G050 },
    thDate:     { width: 80, color: G600, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thMethod:   { flex: 1, color: G600, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thRef:      { width: 100, color: G600, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thAmount:   { width: 80, color: G600, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    tdDate:     { width: 80, color: G900, fontSize: 8 },
    tdMethod:   { flex: 1, color: G600, fontSize: 8 },
    tdRef:      { width: 100, color: G400, fontSize: 8, fontFamily: 'Helvetica-Oblique' },
    tdAmount:   { width: 80, color: GREEN, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    summary:    { marginHorizontal: 32, marginTop: 12, borderWidth: 1, borderColor: G200, borderRadius: 6 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: G200 },
    summaryLabel:{ color: G600, fontSize: 9 },
    summaryVal: { color: G900, fontSize: 9, fontFamily: 'Helvetica-Bold' },
    paidBadge:  { marginHorizontal: 32, marginTop: 12, backgroundColor: GREEN_BG, borderWidth: 1.5, borderColor: GREEN_BD, borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
    paidText:   { color: GREEN, fontSize: 13, fontFamily: 'Helvetica-Bold' },
    paidSub:    { color: GREEN, fontSize: 8, marginTop: 4 },
    partialBadge:{ marginHorizontal: 32, marginTop: 12, backgroundColor: '#fffbeb', borderWidth: 1.5, borderColor: '#fde68a', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 },
    partialText: { color: '#92400e', fontSize: 9 },
    footer:     { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, borderTopColor: G200, paddingVertical: 10, paddingHorizontal: 32, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: G050 },
    footerText: { color: G400, fontSize: 7 },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {entreprise.logoUrl
              ? <Image src={entreprise.logoUrl} style={styles.logo} />
              : (
                <View style={styles.logoPlaceholder}>
                  <Text style={{ color: WHITE, fontSize: 16, fontFamily: 'Helvetica-Bold' }}>
                    {entreprise.nom.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )
            }
            <View>
              <Text style={styles.headerEntNom}>{entreprise.nom}</Text>
              {entreprise.adresse && <Text style={styles.headerEntSub}>{entreprise.adresse}</Text>}
              {entreprise.ice && <Text style={styles.headerEntSub}>ICE : {entreprise.ice}</Text>}
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerTitle}>REÇU DE PAIEMENT</Text>
            <Text style={styles.headerNum}>{numeroFacture}</Text>
          </View>
        </View>

        {/* Client + Date */}
        <View style={[styles.section, styles.row2]}>
          <View style={styles.col}>
            <Text style={styles.label}>Client</Text>
            <Text style={styles.value}>{client.nom}</Text>
            {client.nomEntreprise && <Text style={styles.valueSub}>{client.nomEntreprise}</Text>}
            {client.email && <Text style={styles.valueSub}>{client.email}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Facture</Text>
            <Text style={styles.value}>{numeroFacture}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Émis le</Text>
            <Text style={styles.value}>{generatedAt}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Payment table */}
        <View style={[styles.section, { paddingBottom: 8 }]}>
          <Text style={[styles.label, { marginBottom: 8 }]}>Historique des paiements</Text>
        </View>

        <View style={styles.tableHead}>
          <Text style={styles.thDate}>Date</Text>
          <Text style={styles.thMethod}>Méthode</Text>
          <Text style={styles.thRef}>Référence</Text>
          <Text style={styles.thAmount}>Montant</Text>
        </View>

        {paiements.map((p, i) => (
          <View key={p.id ?? i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.tdDate}>{fmtDate(p.datePaiement)}</Text>
            <Text style={styles.tdMethod}>{METHODE_LABELS[p.methode] ?? p.methode}</Text>
            <Text style={styles.tdRef}>{p.reference || '—'}</Text>
            <Text style={styles.tdAmount}>{fmt(p.montant)}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total facture TTC</Text>
            <Text style={styles.summaryVal}>{fmt(totalTTC)}</Text>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={[styles.summaryLabel, { fontFamily: 'Helvetica-Bold' }]}>Total payé</Text>
            <Text style={[styles.summaryVal, { color: GREEN }]}>{fmt(montantPaye)}</Text>
          </View>
          {!isFullyPaid && (
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: G200, borderBottomWidth: 0 }]}>
              <Text style={styles.summaryLabel}>Reste à payer</Text>
              <Text style={[styles.summaryVal, { color: '#dc2626' }]}>{fmt(restant)}</Text>
            </View>
          )}
        </View>

        {/* Badge */}
        {isFullyPaid ? (
          <View style={styles.paidBadge}>
            <Text style={styles.paidText}>✓  PAYÉ INTÉGRALEMENT</Text>
            <Text style={styles.paidSub}>Merci pour votre confiance — {entreprise.nom}</Text>
          </View>
        ) : (
          <View style={styles.partialBadge}>
            <Text style={styles.partialText}>
              Paiement partiel reçu. Il reste {fmt(restant)} à régler.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Reçu généré automatiquement par {entreprise.nom} via Sayerli</Text>
          <Text style={styles.footerText}>Généré le {generatedAt}</Text>
        </View>

      </Page>
    </Document>
  )
}
