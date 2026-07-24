import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const G900 = '#111827'
const G700 = '#374151'
const G500 = '#6b7280'
const G200 = '#e5e7eb'
const G100 = '#f3f4f6'
const WHITE = '#ffffff'
const BRAND = '#16a34a'

function fmt(v: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
}

export interface DeclarationTVAPDFProps {
  entrepriseNom: string
  periode: { debut: string; fin: string }
  regime: string
  groupes: { taux: number; baseHT: number; tva: number; count: number }[]
  totalBaseHT: number
  totalTVA: number
  groupesDepenses: { taux: number; montantHT: number; tva: number; count: number }[]
  totalBaseHTDepenses: number
  totalTVADeductible: number
  totalTVANette: number
  conversions: { devise: string; count: number; totalOriginal: number; totalMAD: number; taux: number }[]
  facturesPartielles: { numero: string; totalTTC: number; montantPaye: number; restant: number; devise: string }[]
  generatedAt: string
}

export default function DeclarationTVAPDF({
  entrepriseNom, periode, regime, groupes, totalBaseHT, totalTVA,
  groupesDepenses, totalBaseHTDepenses, totalTVADeductible, totalTVANette,
  conversions, facturesPartielles, generatedAt,
}: DeclarationTVAPDFProps) {
  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: G900, backgroundColor: WHITE, padding: 40 },
    header: { marginBottom: 24 },
    title: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: BRAND },
    subtitle: { fontSize: 9, color: G500, marginTop: 3 },
    company: { fontFamily: 'Helvetica-Bold', fontSize: 11, color: G900, marginTop: 12 },
    meta: { flexDirection: 'row', gap: 24, marginTop: 6 },
    metaItem: { fontSize: 8, color: G700 },
    metaLabel: { fontFamily: 'Helvetica-Bold', color: G900 },
    divider: { height: 2, backgroundColor: BRAND, marginVertical: 16 },
    sectionTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: BRAND, marginBottom: 6, textTransform: 'uppercase' },
    tableHead: { flexDirection: 'row', backgroundColor: BRAND, paddingVertical: 6, paddingHorizontal: 8 },
    th: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: WHITE },
    tableRow: { flexDirection: 'row', paddingVertical: 5, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: G200 },
    rowAlt: { backgroundColor: G100 },
    td: { fontSize: 8, color: G700 },
    tdBold: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: G900 },
    col1: { width: '30%' },
    col2: { width: '35%', textAlign: 'right' },
    col3: { width: '35%', textAlign: 'right' },
    totalRow: { flexDirection: 'row', paddingVertical: 7, paddingHorizontal: 8, backgroundColor: BRAND },
    totalLabel: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: WHITE, width: '30%' },
    totalAmt: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: WHITE, width: '35%', textAlign: 'right' },
    note: { fontSize: 7, color: G500, marginTop: 8, lineHeight: 1.5 },
    footer: { position: 'absolute', bottom: 24, left: 40, right: 40, borderTopWidth: 1, borderTopColor: G200, paddingTop: 6, flexDirection: 'row', justifyContent: 'space-between' },
    footerText: { fontSize: 7, color: G500 },
    partRow: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: G200 },
    convRow: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: G200 },
  })

  const regimeLabel = regime === 'ENCAISSEMENTS' ? 'Encaissements' : 'Débits'

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Déclaration TVA</Text>
          <Text style={s.subtitle}>Document généré automatiquement — à titre indicatif</Text>
          <Text style={s.company}>{entrepriseNom}</Text>
          <View style={s.meta}>
            <Text style={s.metaItem}><Text style={s.metaLabel}>Période : </Text>{periode.debut} au {periode.fin}</Text>
            <Text style={s.metaItem}><Text style={s.metaLabel}>Régime : </Text>{regimeLabel}</Text>
          </View>
        </View>

        <View style={s.divider} />

        {/* TVA table */}
        <Text style={s.sectionTitle}>Détail par taux de TVA</Text>
        <View style={s.tableHead}>
          <Text style={[s.th, s.col1]}>Taux TVA</Text>
          <Text style={[s.th, s.col2]}>Base HT (MAD)</Text>
          <Text style={[s.th, s.col3]}>TVA collectée (MAD)</Text>
        </View>
        {groupes.map((g, i) => (
          <View key={g.taux} style={[s.tableRow, i % 2 === 1 ? s.rowAlt : {}]}>
            <Text style={[s.td, s.col1]}>{g.taux === 0 ? 'Exonéré (0%)' : `${g.taux}%`}</Text>
            <Text style={[s.tdBold, s.col2]}>{fmt(g.baseHT)} MAD</Text>
            <Text style={[s.tdBold, s.col3]}>{fmt(g.tva)} MAD</Text>
          </View>
        ))}
        <View style={s.totalRow}>
          <Text style={s.totalLabel}>TOTAL</Text>
          <Text style={s.totalAmt}>{fmt(totalBaseHT)} MAD</Text>
          <Text style={s.totalAmt}>{fmt(totalTVA)} MAD</Text>
        </View>

        {/* TVA Déductible */}
        <View style={{ marginTop: 20 }}>
          <Text style={s.sectionTitle}>TVA Déductible (Dépenses)</Text>
          {groupesDepenses.length === 0 ? (
            <Text style={[s.note, { marginTop: 4 }]}>Aucune dépense avec TVA sur cette période.</Text>
          ) : (
            <>
              <View style={s.tableHead}>
                <Text style={[s.th, s.col1]}>Taux TVA</Text>
                <Text style={[s.th, s.col2]}>Montant HT (MAD)</Text>
                <Text style={[s.th, s.col3]}>TVA déductible (MAD)</Text>
              </View>
              {groupesDepenses.map((g, i) => (
                <View key={g.taux} style={[s.tableRow, i % 2 === 1 ? s.rowAlt : {}]}>
                  <Text style={[s.td, s.col1]}>{g.taux === 0 ? 'Exonéré (0%)' : `${g.taux}%`}</Text>
                  <Text style={[s.tdBold, s.col2]}>{fmt(g.montantHT)} MAD</Text>
                  <Text style={[s.tdBold, s.col3]}>{fmt(g.tva)} MAD</Text>
                </View>
              ))}
              <View style={[s.totalRow, { backgroundColor: '#d97706' }]}>
                <Text style={s.totalLabel}>TOTAL</Text>
                <Text style={s.totalAmt}>{fmt(totalBaseHTDepenses)} MAD</Text>
                <Text style={s.totalAmt}>{fmt(totalTVADeductible)} MAD</Text>
              </View>
            </>
          )}
        </View>

        {/* TVA Nette à Payer */}
        <View style={{ marginTop: 20, padding: 12, backgroundColor: '#eff6ff', borderRadius: 6 }}>
          <Text style={[s.sectionTitle, { color: '#1d4ed8', marginBottom: 8 }]}>TVA Nette à Payer</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={[s.td, { color: G700 }]}>TVA collectée</Text>
            <Text style={[s.tdBold, { color: '#16a34a' }]}>+{fmt(totalTVA)} MAD</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={[s.td, { color: G700 }]}>TVA déductible</Text>
            <Text style={[s.tdBold, { color: '#d97706' }]}>-{fmt(totalTVADeductible)} MAD</Text>
          </View>
          <View style={{ height: 1, backgroundColor: '#bfdbfe', marginBottom: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 10, color: '#1e3a8a' }}>TVA nette à payer</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 12, color: '#1d4ed8' }}>{fmt(totalTVANette)} MAD</Text>
          </View>
        </View>

        {/* Conversions */}
        {conversions.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={s.sectionTitle}>Conversions de devises</Text>
            <View style={s.tableHead}>
              <Text style={[s.th, { width: '20%' }]}>Devise</Text>
              <Text style={[s.th, { width: '20%', textAlign: 'right' }]}>Nb</Text>
              <Text style={[s.th, { width: '30%', textAlign: 'right' }]}>Total original</Text>
              <Text style={[s.th, { width: '30%', textAlign: 'right' }]}>Total MAD</Text>
            </View>
            {conversions.map((c, i) => (
              <View key={c.devise} style={[s.convRow, i % 2 === 1 ? s.rowAlt : {}]}>
                <Text style={[s.td, { width: '20%' }]}>{c.devise} (1 {c.devise} = {c.taux} MAD)</Text>
                <Text style={[s.td, { width: '20%', textAlign: 'right' }]}>{c.count}</Text>
                <Text style={[s.td, { width: '30%', textAlign: 'right' }]}>{fmt(c.totalOriginal)} {c.devise}</Text>
                <Text style={[s.tdBold, { width: '30%', textAlign: 'right' }]}>{fmt(c.totalMAD)} MAD</Text>
              </View>
            ))}
            <Text style={s.note}>Les taux de change sont ceux configurés dans vos paramètres au moment de la génération.</Text>
          </View>
        )}

        {/* Partial invoices */}
        {facturesPartielles.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={s.sectionTitle}>Factures partiellement payées ({facturesPartielles.length})</Text>
            <View style={s.tableHead}>
              <Text style={[s.th, { width: '25%' }]}>N° Facture</Text>
              <Text style={[s.th, { width: '25%', textAlign: 'right' }]}>Total TTC</Text>
              <Text style={[s.th, { width: '25%', textAlign: 'right' }]}>Payé</Text>
              <Text style={[s.th, { width: '25%', textAlign: 'right' }]}>Restant</Text>
            </View>
            {facturesPartielles.map((f, i) => (
              <View key={f.numero} style={[s.partRow, i % 2 === 1 ? s.rowAlt : {}]}>
                <Text style={[s.td, { width: '25%' }]}>{f.numero}</Text>
                <Text style={[s.td, { width: '25%', textAlign: 'right' }]}>{fmt(f.totalTTC)} {f.devise}</Text>
                <Text style={[s.td, { width: '25%', textAlign: 'right' }]}>{fmt(f.montantPaye)} {f.devise}</Text>
                <Text style={[s.tdBold, { width: '25%', textAlign: 'right' }]}>{fmt(f.restant)} {f.devise}</Text>
              </View>
            ))}
            <Text style={s.note}>Le reste à payer sera déclaré lors de son encaissement (régime encaissements).</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Généré le {generatedAt} · {entrepriseNom}</Text>
          <Text style={s.footerText}>sayerli.com — Document à titre indicatif</Text>
        </View>

      </Page>
    </Document>
  )
}
