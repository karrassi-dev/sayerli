import {
  Document, Page, View, Text, Image, StyleSheet, Font,
} from '@react-pdf/renderer'

Font.register({
  family: 'Helvetica',
  fonts: [],
})

const GREY_900 = '#0f172a'
const GREY_600 = '#475569'
const GREY_400 = '#94a3b8'
const GREY_100 = '#f1f5f9'
const GREY_200 = '#e2e8f0'
const GREEN    = '#16a34a'
const GREEN_BG = '#f0fdf4'
const GREEN_BD = '#bbf7d0'
const RED      = '#dc2626'

export interface DevisPDFProps {
  reference: string
  createdAt: string
  dateExpiration: string | null
  dateAcceptation: string
  notes: string | null
  totalHT: number
  remise: number
  taxe: number
  totalTTC: number
  lignes: { description: string; quantite: number; prixUnitaire: number; total: number }[]
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  entreprise: {
    nom: string; email: string | null; telephone: string | null; adresse: string | null
    logoUrl: string | null; couleurPrimaire: string | null; ice: string | null; rc: string | null
  }
}

function fmt(v: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' MAD'
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('fr-MA', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DevisPDF({
  reference, createdAt, dateExpiration, dateAcceptation, notes,
  totalHT, remise, taxe, totalTTC, lignes, client, entreprise,
}: DevisPDFProps) {
  const brand = entreprise.couleurPrimaire || '#2563eb'
  const tva = totalTTC - totalHT
  const sousTotal = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', paddingTop: 0, paddingBottom: 40, paddingHorizontal: 0 },

    // Brand bar
    brandBar: { height: 5, backgroundColor: brand },

    body: { paddingHorizontal: 44 },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 32, paddingBottom: 24 },
    logoBox: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    logoImg: { width: 52, height: 52, objectFit: 'contain', borderRadius: 8 },
    logoInitial: {
      width: 52, height: 52, borderRadius: 8,
      backgroundColor: brand,
      alignItems: 'center', justifyContent: 'center',
    },
    logoInitialText: { color: '#fff', fontSize: 22, fontFamily: 'Helvetica-Bold' },
    companyName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: GREY_900 },
    companyDetail: { fontSize: 9, color: GREY_600, marginTop: 2 },

    // Reference block (top right)
    refBlock: { alignItems: 'flex-end' },
    refLabel: { fontSize: 8, color: brand, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5, textTransform: 'uppercase' },
    refValue: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: GREY_900, marginTop: 2 },
    acceptedBadge: {
      flexDirection: 'row', alignItems: 'center', gap: 4,
      marginTop: 6, paddingHorizontal: 10, paddingVertical: 4,
      backgroundColor: GREEN_BG, borderRadius: 20,
      borderWidth: 1, borderColor: GREEN_BD,
    },
    acceptedBadgeText: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: GREEN },

    // Divider
    divider: { height: 1, backgroundColor: GREY_200, marginBottom: 20 },

    // De / Pour columns
    columns: { flexDirection: 'row', gap: 14, marginBottom: 20 },
    col: { flex: 1, backgroundColor: GREY_100, borderRadius: 8, padding: 14 },
    colLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GREY_400, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
    colName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: GREY_900, marginBottom: 3 },
    colDetail: { fontSize: 9, color: GREY_600, marginBottom: 2 },

    // Dates row
    datesRow: { flexDirection: 'row', gap: 10, marginBottom: 24, flexWrap: 'wrap' },
    datePill: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 10, paddingVertical: 5,
      backgroundColor: GREY_100, borderRadius: 6,
    },
    datePillText: { fontSize: 9, color: GREY_600 },
    datePillBold: { fontFamily: 'Helvetica-Bold' },
    acceptDatePill: {
      flexDirection: 'row', alignItems: 'center', gap: 5,
      paddingHorizontal: 10, paddingVertical: 5,
      backgroundColor: GREEN_BG, borderRadius: 6,
      borderWidth: 1, borderColor: GREEN_BD,
    },
    acceptDateText: { fontSize: 9, color: GREEN },
    acceptDateBold: { fontFamily: 'Helvetica-Bold', color: GREEN },

    // Table
    table: { marginBottom: 20 },
    tableHeader: {
      flexDirection: 'row', backgroundColor: brand,
      borderTopLeftRadius: 6, borderTopRightRadius: 6,
      paddingVertical: 9, paddingHorizontal: 12,
    },
    thDesc: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase' },
    thNum:  { width: 50, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'center' },
    thRight: { width: 80, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#fff', letterSpacing: 0.8, textTransform: 'uppercase', textAlign: 'right' },

    tableRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: GREY_200 },
    tableRowAlt: { backgroundColor: GREY_100 },
    tdDesc: { flex: 1, fontSize: 9.5, color: GREY_900, paddingRight: 8 },
    tdNum:  { width: 50, fontSize: 9.5, color: GREY_600, textAlign: 'center' },
    tdRight: { width: 80, fontSize: 9.5, color: GREY_600, textAlign: 'right' },
    tdTotal: { width: 80, fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: GREY_900, textAlign: 'right' },

    // Totals
    totalsWrap: { alignItems: 'flex-end', marginBottom: 24 },
    totalsBox: { width: 240 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    totalLabel: { fontSize: 9.5, color: GREY_600 },
    totalValue: { fontSize: 9.5, color: GREY_600 },
    totalDiscount: { fontSize: 9.5, color: RED },
    totalDivider: { height: 1, backgroundColor: GREY_200, marginVertical: 6 },
    totalTTCRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
    totalTTCLabel: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: GREY_900 },
    totalTTCValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: brand },

    // Notes
    notesBox: {
      backgroundColor: '#fffbeb', borderRadius: 8, padding: 14,
      borderWidth: 1, borderColor: '#fde68a', marginBottom: 24,
    },
    notesLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#92400e', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
    notesText: { fontSize: 9.5, color: '#78350f', lineHeight: 1.5 },

    // Acceptance certificate
    certBox: {
      borderWidth: 1.5, borderColor: GREEN_BD, borderRadius: 10,
      backgroundColor: GREEN_BG, padding: 18, marginBottom: 24,
    },
    certHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    certCheck: { fontSize: 14, color: GREEN },
    certTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: GREEN },
    certBodyText: { fontSize: 9.5, color: '#166534', lineHeight: 1.6 },
    certDate: { marginTop: 8, fontSize: 9, color: '#15803d', fontFamily: 'Helvetica-Bold' },

    // Footer
    footer: {
      marginTop: 12, paddingTop: 14, paddingHorizontal: 44,
      borderTopWidth: 1, borderTopColor: GREY_200,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    footerText: { fontSize: 8, color: GREY_400 },
    footerBrand: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: GREY_600 },
  })

  return (
    <Document title={`${reference} — Devis accepté`} author={entreprise.nom} subject="Devis accepté">
      <Page size="A4" style={s.page}>
        {/* Brand bar */}
        <View style={s.brandBar} />

        <View style={s.body}>
          {/* Header */}
          <View style={s.header}>
            <View style={s.logoBox}>
              {entreprise.logoUrl ? (
                <Image src={entreprise.logoUrl} style={s.logoImg} />
              ) : (
                <View style={s.logoInitial}>
                  <Text style={s.logoInitialText}>{entreprise.nom.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              <View>
                <Text style={s.companyName}>{entreprise.nom}</Text>
                {entreprise.email && <Text style={s.companyDetail}>{entreprise.email}</Text>}
                {entreprise.telephone && <Text style={s.companyDetail}>{entreprise.telephone}</Text>}
                {entreprise.adresse && <Text style={s.companyDetail}>{entreprise.adresse}</Text>}
              </View>
            </View>

            <View style={s.refBlock}>
              <Text style={s.refLabel}>DEVIS</Text>
              <Text style={s.refValue}>{reference}</Text>
              <View style={s.acceptedBadge}>
                <Text style={s.acceptedBadgeText}>✓  ACCEPTÉ</Text>
              </View>
            </View>
          </View>

          <View style={s.divider} />

          {/* De / Pour */}
          <View style={s.columns}>
            <View style={s.col}>
              <Text style={s.colLabel}>De</Text>
              <Text style={s.colName}>{entreprise.nom}</Text>
              {entreprise.adresse ? <Text style={s.colDetail}>{entreprise.adresse}</Text> : null}
              {entreprise.email ? <Text style={s.colDetail}>{entreprise.email}</Text> : null}
              {entreprise.telephone ? <Text style={s.colDetail}>{entreprise.telephone}</Text> : null}
              {entreprise.ice ? <Text style={s.colDetail}>ICE : {entreprise.ice}</Text> : null}
              {entreprise.rc ? <Text style={s.colDetail}>RC : {entreprise.rc}</Text> : null}
            </View>
            <View style={s.col}>
              <Text style={s.colLabel}>Pour</Text>
              <Text style={s.colName}>{client.nom}</Text>
              {client.nomEntreprise ? <Text style={s.colDetail}>{client.nomEntreprise}</Text> : null}
              {client.email ? <Text style={s.colDetail}>{client.email}</Text> : null}
              {client.telephone ? <Text style={s.colDetail}>{client.telephone}</Text> : null}
            </View>
          </View>

          {/* Dates */}
          <View style={s.datesRow}>
            <View style={s.datePill}>
              <Text style={s.datePillText}>
                Émis le <Text style={s.datePillBold}>{fmtDate(createdAt)}</Text>
              </Text>
            </View>
            {dateExpiration && (
              <View style={s.datePill}>
                <Text style={s.datePillText}>
                  Valide jusqu&apos;au <Text style={s.datePillBold}>{fmtDate(dateExpiration)}</Text>
                </Text>
              </View>
            )}
            <View style={s.acceptDatePill}>
              <Text style={s.acceptDateText}>
                ✓  Accepté le <Text style={s.acceptDateBold}>{fmtDateTime(dateAcceptation)}</Text>
              </Text>
            </View>
          </View>

          {/* Table */}
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={s.thDesc}>Désignation</Text>
              <Text style={s.thNum}>Qté</Text>
              <Text style={s.thRight}>P.U. HT</Text>
              <Text style={s.thRight}>Total HT</Text>
            </View>
            {lignes.map((l, i) => (
              <View key={i} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
                <Text style={s.tdDesc}>{l.description}</Text>
                <Text style={s.tdNum}>{l.quantite}</Text>
                <Text style={s.tdRight}>{fmt(l.prixUnitaire)}</Text>
                <Text style={s.tdTotal}>{fmt(l.quantite * l.prixUnitaire)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={s.totalsWrap}>
            <View style={s.totalsBox}>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Sous-total HT</Text>
                <Text style={s.totalValue}>{fmt(sousTotal)}</Text>
              </View>
              {remise > 0 && (
                <View style={s.totalRow}>
                  <Text style={s.totalLabel}>Remise</Text>
                  <Text style={s.totalDiscount}>−{fmt(remise)}</Text>
                </View>
              )}
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>TVA {taxe}%</Text>
                <Text style={s.totalValue}>{fmt(tva)}</Text>
              </View>
              <View style={s.totalDivider} />
              <View style={s.totalTTCRow}>
                <Text style={s.totalTTCLabel}>Total TTC</Text>
                <Text style={s.totalTTCValue}>{fmt(totalTTC)}</Text>
              </View>
            </View>
          </View>

          {/* Notes */}
          {notes && (
            <View style={s.notesBox}>
              <Text style={s.notesLabel}>Notes</Text>
              <Text style={s.notesText}>{notes}</Text>
            </View>
          )}

          {/* Acceptance certificate */}
          <View style={s.certBox}>
            <View style={s.certHeader}>
              <Text style={s.certCheck}>✓</Text>
              <Text style={s.certTitle}>Acceptation électronique</Text>
            </View>
            <Text style={s.certBodyText}>
              Ce devis ({reference}) a été accepté électroniquement par {client.nom}
              {client.nomEntreprise ? ` (${client.nomEntreprise})` : ''}.
              {'\n'}
              L&apos;acceptation vaut accord sur l&apos;ensemble des prestations et montants décrits dans ce document.
            </Text>
            <Text style={s.certDate}>Date d&apos;acceptation : {fmtDateTime(dateAcceptation)}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>{reference} — Document généré le {fmtDate(new Date().toISOString())}</Text>
          <Text style={s.footerBrand}>Sayerli · Logiciel de gestion pour PME marocaines</Text>
        </View>
      </Page>
    </Document>
  )
}
