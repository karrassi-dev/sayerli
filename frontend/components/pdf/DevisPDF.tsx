import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer'

const G900 = '#111827'
const G700 = '#374151'
const G600 = '#4B5563'
const G400 = '#9CA3AF'
const G200 = '#E5E7EB'
const G100 = '#F9FAFB'
const WHITE = '#FFFFFF'
const GREEN = '#16a34a'
const GREEN_BG = '#f0fdf4'
const GREEN_BD = '#bbf7d0'

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
  template?: string
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

function tplConfig(template: string, brand: string) {
  switch (template) {
    case 'corporate':
    case 'stripe':
      return {
        bandedHeader: true,
        headerBg: brand,
        headerText: WHITE,
        headerSubText: WHITE + 'bb',
        tableHeadBg: brand,
        tableHeadText: WHITE,
        totalBg: brand,
        totalText: WHITE,
        labelColor: G400,
        topBar: null as string | null,
        sidebar: null as string | null,
        logoInitialBg: WHITE + '33',
        logoInitialText: WHITE,
      }
    case 'bold':
      return {
        bandedHeader: true,
        headerBg: G900,
        headerText: WHITE,
        headerSubText: G400,
        tableHeadBg: G900,
        tableHeadText: WHITE,
        totalBg: G900,
        totalText: brand,
        labelColor: brand,
        topBar: null,
        sidebar: null,
        logoInitialBg: brand,
        logoInitialText: WHITE,
      }
    case 'elegant':
      return {
        bandedHeader: false,
        headerBg: WHITE,
        headerText: G900,
        headerSubText: G600,
        tableHeadBg: brand,
        tableHeadText: WHITE,
        totalBg: brand,
        totalText: WHITE,
        labelColor: brand,
        topBar: null,
        sidebar: brand,
        logoInitialBg: WHITE,
        logoInitialText: brand,
      }
    case 'minimal':
      return {
        bandedHeader: false,
        headerBg: WHITE,
        headerText: G900,
        headerSubText: G600,
        tableHeadBg: G100,
        tableHeadText: brand,
        totalBg: WHITE,
        totalText: brand,
        labelColor: brand,
        topBar: brand,
        sidebar: null,
        logoInitialBg: brand,
        logoInitialText: WHITE,
      }
    default: // classic
      return {
        bandedHeader: false,
        headerBg: WHITE,
        headerText: G900,
        headerSubText: G600,
        tableHeadBg: G900,
        tableHeadText: WHITE,
        totalBg: G900,
        totalText: WHITE,
        labelColor: G400,
        topBar: G900,
        sidebar: null,
        logoInitialBg: G900,
        logoInitialText: WHITE,
      }
  }
}

export default function DevisPDF({
  reference, createdAt, dateExpiration, dateAcceptation, notes,
  totalHT, remise, taxe, totalTTC, template = 'classic', lignes, client, entreprise,
}: DevisPDFProps) {
  const brand = entreprise.couleurPrimaire || '#2563eb'
  const tva = totalTTC - totalHT
  const sousTotal = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const cfg = tplConfig(template, brand)

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 44 },
    topBorder: { height: 3, backgroundColor: cfg.topBar ?? 'transparent' },
    sidebar: { flexDirection: 'row' },
    sidebarStrip: { width: 5, backgroundColor: cfg.sidebar ?? 'transparent' },
    body: { paddingHorizontal: 44, paddingTop: cfg.bandedHeader ? 0 : 28, flex: 1 },

    bandedHeader: { paddingHorizontal: 40, paddingVertical: 20, backgroundColor: cfg.headerBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },

    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    logoImg: { width: 48, height: 48, objectFit: 'contain' },
    logoInitial: { width: 48, height: 48, borderRadius: 4, backgroundColor: cfg.logoInitialBg, alignItems: 'center', justifyContent: 'center' },
    logoInitialTxt: { color: cfg.logoInitialText, fontSize: 20, fontFamily: 'Helvetica-Bold' },
    coName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: cfg.headerText },
    coDetail: { fontSize: 8, color: cfg.headerSubText, marginTop: 2 },
    refBlock: { alignItems: 'flex-end' },
    refLabel: { fontSize: 7.5, color: cfg.headerSubText, letterSpacing: 1.5, fontFamily: 'Helvetica-Bold' },
    refVal: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: cfg.headerText, marginTop: 2 },
    acceptedBadge: {
      marginTop: 6, paddingHorizontal: 8, paddingVertical: 3,
      backgroundColor: GREEN_BG, borderRadius: 10,
      borderWidth: 1, borderColor: GREEN_BD,
      alignSelf: 'flex-end',
    },
    acceptedBadgeTxt: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: GREEN },

    divider: { height: 1, backgroundColor: G200, marginBottom: 18 },

    cols: { flexDirection: 'row', gap: 0, marginBottom: 18 },
    col: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
    colFirst: { flex: 1, paddingRight: 12, paddingVertical: 10 },
    colSep: { width: 1, backgroundColor: G200 },
    colLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: cfg.labelColor, letterSpacing: 1.5, marginBottom: 6 },
    colName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: G900, marginBottom: 3 },
    colDetail: { fontSize: 8.5, color: G600, marginBottom: 2 },

    datesRow: { flexDirection: 'row', gap: 24, marginBottom: 20, paddingTop: 12, paddingBottom: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: G200 },
    dateLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: cfg.labelColor, letterSpacing: 1, marginBottom: 3 },
    dateVal: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: G900 },
    acceptDateLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GREEN, letterSpacing: 1, marginBottom: 3 },
    acceptDateVal: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: GREEN },

    tbl: { marginBottom: 18 },
    tblHead: { flexDirection: 'row', backgroundColor: cfg.tableHeadBg, paddingVertical: 8, paddingHorizontal: 10, borderWidth: template === 'minimal' ? 1 : 0, borderColor: brand },
    tHead: { flex: 1, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: cfg.tableHeadText, letterSpacing: 1 },
    tHeadN: { width: 40, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: cfg.tableHeadText, letterSpacing: 1, textAlign: 'center' },
    tHeadR: { width: 80, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: cfg.tableHeadText, letterSpacing: 1, textAlign: 'right' },
    tRow: { flexDirection: 'row', paddingVertical: 9, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: G200 },
    tRowAlt: { backgroundColor: G100 },
    tD: { flex: 1, fontSize: 9, color: G900, paddingRight: 6 },
    tN: { width: 40, fontSize: 9, color: G700, textAlign: 'center' },
    tR: { width: 80, fontSize: 9, color: G700, textAlign: 'right' },
    tRBold: { width: 80, fontSize: 9, fontFamily: 'Helvetica-Bold', color: G900, textAlign: 'right' },

    totalsWrap: { alignItems: 'flex-end', marginBottom: 20 },
    totalsBox: { width: 240, borderWidth: 1, borderColor: G200, borderRadius: 4, overflow: 'hidden' },
    totRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 12 },
    totLbl: { fontSize: 9, color: G600 },
    totVal: { fontSize: 9, color: G600 },
    totDiscount: { fontSize: 9, color: '#dc2626' },
    totDiv: { height: 1, backgroundColor: G200 },
    totTTCRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      paddingVertical: 9, paddingHorizontal: 12,
      backgroundColor: cfg.totalBg,
    },
    totTTCLbl: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: cfg.totalText },
    totTTCVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: cfg.totalText },

    notesBox: { borderWidth: 1, borderColor: G200, borderRadius: 4, padding: 11, marginBottom: 16 },
    notesLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 0.8, marginBottom: 4 },
    notesTxt: { fontSize: 8.5, color: G700, lineHeight: 1.5 },

    certBox: { borderWidth: 1.5, borderColor: GREEN_BD, borderRadius: 6, backgroundColor: GREEN_BG, padding: 16, marginBottom: 16 },
    certHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    certCheck: { fontSize: 12, color: GREEN },
    certTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: GREEN },
    certBody: { fontSize: 8.5, color: '#166534', lineHeight: 1.6 },
    certDate: { marginTop: 6, fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#15803d' },

    footer: {
      marginTop: 12, paddingTop: 10, paddingHorizontal: 44,
      borderTopWidth: 1, borderTopColor: G200,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    footerTxt: { fontSize: 7.5, color: G400 },
    footerBrand: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: G700 },
  })

  const logoNode = entreprise.logoUrl
    ? <Image src={entreprise.logoUrl} style={s.logoImg} />
    : <View style={s.logoInitial}><Text style={s.logoInitialTxt}>{entreprise.nom.charAt(0).toUpperCase()}</Text></View>

  const headerInfo = (
    <>
      {logoNode}
      <View>
        <Text style={s.coName}>{entreprise.nom}</Text>
        {entreprise.adresse && <Text style={s.coDetail}>{entreprise.adresse}</Text>}
        {entreprise.email && <Text style={s.coDetail}>{entreprise.email}</Text>}
        {entreprise.telephone && <Text style={s.coDetail}>{entreprise.telephone}</Text>}
        {entreprise.ice && <Text style={s.coDetail}>ICE : {entreprise.ice}</Text>}
        {entreprise.rc && <Text style={s.coDetail}>RC : {entreprise.rc}</Text>}
      </View>
    </>
  )

  const refBlock = (
    <View style={s.refBlock}>
      <Text style={s.refLabel}>DEVIS</Text>
      <Text style={s.refVal}>{reference}</Text>
      <View style={s.acceptedBadge}>
        <Text style={s.acceptedBadgeTxt}>✓  ACCEPTÉ</Text>
      </View>
    </View>
  )

  const innerContent = (
    <View style={s.body}>

      {/* Header */}
      {cfg.bandedHeader ? null : (
        <View style={s.header}>
          <View style={s.logoRow}>{headerInfo}</View>
          {refBlock}
        </View>
      )}

      {!cfg.bandedHeader && <View style={s.divider} />}

      {/* Émetteur / Destinataire */}
      <View style={s.cols}>
        <View style={s.colFirst}>
          <Text style={s.colLbl}>ÉMETTEUR</Text>
          <Text style={s.colName}>{entreprise.nom}</Text>
          {entreprise.adresse && <Text style={s.colDetail}>{entreprise.adresse}</Text>}
          {entreprise.email && <Text style={s.colDetail}>{entreprise.email}</Text>}
          {entreprise.telephone && <Text style={s.colDetail}>{entreprise.telephone}</Text>}
          {entreprise.ice && <Text style={s.colDetail}>ICE : {entreprise.ice}</Text>}
          {entreprise.rc && <Text style={s.colDetail}>RC : {entreprise.rc}</Text>}
        </View>
        <View style={s.colSep} />
        <View style={s.col}>
          <Text style={s.colLbl}>DESTINATAIRE</Text>
          <Text style={s.colName}>{client.nom}</Text>
          {client.nomEntreprise && <Text style={s.colDetail}>{client.nomEntreprise}</Text>}
          {client.email && <Text style={s.colDetail}>{client.email}</Text>}
          {client.telephone && <Text style={s.colDetail}>{client.telephone}</Text>}
        </View>
      </View>

      {/* Dates */}
      <View style={s.datesRow}>
        <View>
          <Text style={s.dateLbl}>DATE D'ÉMISSION</Text>
          <Text style={s.dateVal}>{fmtDate(createdAt)}</Text>
        </View>
        {dateExpiration && (
          <View>
            <Text style={s.dateLbl}>VALIDE JUSQU'AU</Text>
            <Text style={s.dateVal}>{fmtDate(dateExpiration)}</Text>
          </View>
        )}
        <View>
          <Text style={s.acceptDateLbl}>DATE D'ACCEPTATION</Text>
          <Text style={s.acceptDateVal}>{fmtDate(dateAcceptation)}</Text>
        </View>
      </View>

      {/* Lines table */}
      <View style={s.tbl}>
        <View style={s.tblHead}>
          <Text style={s.tHead}>DÉSIGNATION</Text>
          <Text style={s.tHeadN}>QTÉ</Text>
          <Text style={s.tHeadR}>P.U. HT</Text>
          <Text style={s.tHeadR}>TOTAL HT</Text>
        </View>
        {lignes.map((l, i) => (
          <View key={i} style={[s.tRow, i % 2 === 1 ? s.tRowAlt : {}]}>
            <Text style={s.tD}>{l.description}</Text>
            <Text style={s.tN}>{l.quantite}</Text>
            <Text style={s.tR}>{fmt(l.prixUnitaire)}</Text>
            <Text style={s.tRBold}>{fmt(l.quantite * l.prixUnitaire)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={s.totalsWrap}>
        <View style={s.totalsBox}>
          <View style={s.totRow}>
            <Text style={s.totLbl}>Sous-total HT</Text>
            <Text style={s.totVal}>{fmt(sousTotal)}</Text>
          </View>
          {remise > 0 && (
            <View style={s.totRow}>
              <Text style={s.totLbl}>Remise</Text>
              <Text style={s.totDiscount}>−{fmt(remise)}</Text>
            </View>
          )}
          <View style={s.totRow}>
            <Text style={s.totLbl}>TVA {taxe}%</Text>
            <Text style={s.totVal}>{fmt(tva)}</Text>
          </View>
          <View style={s.totDiv} />
          <View style={s.totTTCRow}>
            <Text style={s.totTTCLbl}>TOTAL TTC</Text>
            <Text style={s.totTTCVal}>{fmt(totalTTC)}</Text>
          </View>
        </View>
      </View>

      {/* Notes */}
      {notes && (
        <View style={s.notesBox}>
          <Text style={s.notesLbl}>NOTES</Text>
          <Text style={s.notesTxt}>{notes}</Text>
        </View>
      )}

      {/* Acceptance certificate */}
      <View style={s.certBox}>
        <View style={s.certHeader}>
          <Text style={s.certCheck}>✓</Text>
          <Text style={s.certTitle}>Acceptation électronique</Text>
        </View>
        <Text style={s.certBody}>
          Ce devis ({reference}) a été accepté électroniquement par {client.nom}
          {client.nomEntreprise ? ` (${client.nomEntreprise})` : ''}.
          {'\n'}
          L&apos;acceptation vaut accord sur l&apos;ensemble des prestations et montants décrits dans ce document.
        </Text>
        <Text style={s.certDate}>Date d&apos;acceptation : {fmtDateTime(dateAcceptation)}</Text>
      </View>
    </View>
  )

  return (
    <Document title={`${reference} — Devis accepté`} author={entreprise.nom} subject="Devis accepté">
      <Page size="A4" style={s.page}>

        {/* Top bar (classic/minimal) */}
        {cfg.topBar && <View style={s.topBorder} />}

        {/* Banded header (corporate/stripe/bold) */}
        {cfg.bandedHeader && (
          <View style={s.bandedHeader}>
            <View style={s.logoRow}>{headerInfo}</View>
            {refBlock}
          </View>
        )}

        {/* Elegant sidebar wrapper */}
        {template === 'elegant' ? (
          <View style={s.sidebar}>
            <View style={s.sidebarStrip} />
            {innerContent}
          </View>
        ) : innerContent}

        {/* Footer */}
        <View style={s.footer}>
          <Text style={s.footerTxt}>{entreprise.nom} · {reference} · {fmtDate(createdAt)}</Text>
          <Text style={s.footerBrand}>Sayerli · Logiciel de gestion pour PME marocaines</Text>
        </View>
      </Page>
    </Document>
  )
}
