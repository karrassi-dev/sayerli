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

export interface FactureSimplePDFProps {
  numeroFacture: string
  createdAt: string
  dateEcheance: string | null
  notes: string | null
  totalHT: number
  taxe: number
  totalTTC: number
  devisReference: string | null
  template?: string
  lignes: { description: string; quantite: number; prixUnitaire: number }[]
  client: {
    nom: string
    email: string | null
    telephone: string | null
    nomEntreprise: string | null
  }
  entreprise: {
    nom: string
    email: string | null
    telephone: string | null
    adresse: string | null
    logoUrl: string | null
    ice: string | null
    rc: string | null
    titulaireCompte: string | null
    banque: string | null
    rib: string | null
    iban: string | null
    swift: string | null
  }
}

function fmt(v: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' MAD'
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ── Template config ───────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

export default function FactureSimplePDF({
  numeroFacture, createdAt, dateEcheance, notes, totalHT, taxe, totalTTC,
  devisReference, template = 'classic', lignes, client, entreprise,
}: FactureSimplePDFProps) {
  const brand = '#2563eb' // brand color comes via template config, but entreprise doesn't pass it here
  const tva = totalTTC - totalHT
  const hasBankInfo = entreprise.titulaireCompte || entreprise.rib || entreprise.iban || entreprise.banque
  const cfg = tplConfig(template, brand)

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 44 },
    topBorder: { height: 3, backgroundColor: cfg.topBar ?? 'transparent' },
    sidebar: { flexDirection: 'row' },
    sidebarStrip: { width: 5, backgroundColor: cfg.sidebar ?? 'transparent' },
    body: { paddingHorizontal: 44, paddingTop: cfg.bandedHeader ? 0 : 28, flex: 1 },

    // Banded header (corporate, stripe, bold)
    bandedHeader: { paddingHorizontal: 40, paddingVertical: 20, backgroundColor: cfg.headerBg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },

    // Standard header
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
    refSub: { fontSize: 8, color: cfg.headerSubText, marginTop: 2 },

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
    totDiv: { height: 1, backgroundColor: G200 },
    totTTCRow: {
      flexDirection: 'row', justifyContent: 'space-between',
      paddingVertical: 9, paddingHorizontal: 12,
      backgroundColor: cfg.totalBg,
    },
    totTTCLbl: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: cfg.totalText },
    totTTCVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: cfg.totalText },

    bankBox: { borderWidth: 1, borderColor: G200, borderRadius: 4, marginBottom: 16, overflow: 'hidden' },
    bankHeader: { backgroundColor: G900, paddingVertical: 7, paddingHorizontal: 12 },
    bankHeaderTxt: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 1 },
    bankGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 8 },
    bankItem: { width: '47%' },
    bankLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 0.8, marginBottom: 2 },
    bankVal: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: G900 },
    bankRef: { backgroundColor: G100, paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: G200 },
    bankRefLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 0.8, marginBottom: 2 },
    bankRefVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: G900 },

    notesBox: { borderWidth: 1, borderColor: G200, borderRadius: 4, padding: 11, marginBottom: 16 },
    notesLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 0.8, marginBottom: 4 },
    notesTxt: { fontSize: 8.5, color: G700, lineHeight: 1.5 },

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
      <Text style={s.refLabel}>FACTURE</Text>
      <Text style={s.refVal}>{numeroFacture}</Text>
      {devisReference && <Text style={s.refSub}>Devis : {devisReference}</Text>}
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

      {/* Emetteur / Destinataire */}
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
        {dateEcheance && (
          <View>
            <Text style={s.dateLbl}>DATE D'ÉCHÉANCE</Text>
            <Text style={s.dateVal}>{fmtDate(dateEcheance)}</Text>
          </View>
        )}
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
            <Text style={s.totVal}>{fmt(totalHT)}</Text>
          </View>
          <View style={s.totRow}>
            <Text style={s.totLbl}>TVA {taxe}%</Text>
            <Text style={s.totVal}>{fmt(totalTTC - totalHT)}</Text>
          </View>
          <View style={s.totDiv} />
          <View style={s.totTTCRow}>
            <Text style={s.totTTCLbl}>TOTAL TTC</Text>
            <Text style={s.totTTCVal}>{fmt(totalTTC)}</Text>
          </View>
        </View>
      </View>

      {/* Bank info */}
      {hasBankInfo && (
        <View style={s.bankBox}>
          <View style={s.bankHeader}>
            <Text style={s.bankHeaderTxt}>INFORMATIONS DE PAIEMENT — VIREMENT BANCAIRE</Text>
          </View>
          <View style={s.bankGrid}>
            {entreprise.titulaireCompte && (
              <View style={s.bankItem}>
                <Text style={s.bankLbl}>BÉNÉFICIAIRE</Text>
                <Text style={s.bankVal}>{entreprise.titulaireCompte}</Text>
              </View>
            )}
            {entreprise.banque && (
              <View style={s.bankItem}>
                <Text style={s.bankLbl}>BANQUE</Text>
                <Text style={s.bankVal}>{entreprise.banque}</Text>
              </View>
            )}
            {entreprise.rib && (
              <View style={s.bankItem}>
                <Text style={s.bankLbl}>RIB</Text>
                <Text style={s.bankVal}>{entreprise.rib}</Text>
              </View>
            )}
            {entreprise.iban && (
              <View style={s.bankItem}>
                <Text style={s.bankLbl}>IBAN</Text>
                <Text style={s.bankVal}>{entreprise.iban}</Text>
              </View>
            )}
            {entreprise.swift && (
              <View style={s.bankItem}>
                <Text style={s.bankLbl}>BIC / SWIFT</Text>
                <Text style={s.bankVal}>{entreprise.swift}</Text>
              </View>
            )}
          </View>
          <View style={s.bankRef}>
            <Text style={s.bankRefLbl}>RÉFÉRENCE À MENTIONNER LORS DU VIREMENT</Text>
            <Text style={s.bankRefVal}>{numeroFacture}</Text>
          </View>
        </View>
      )}

      {/* Notes */}
      {notes && (
        <View style={s.notesBox}>
          <Text style={s.notesLbl}>NOTES</Text>
          <Text style={s.notesTxt}>{notes}</Text>
        </View>
      )}
    </View>
  )

  return (
    <Document title={`Facture ${numeroFacture}`} author={entreprise.nom} subject="Facture">
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
          <Text style={s.footerTxt}>{entreprise.nom} · {numeroFacture} · {fmtDate(createdAt)}</Text>
          <Text style={s.footerBrand}>Sayerli · Logiciel de gestion pour PME marocaines</Text>
        </View>
      </Page>
    </Document>
  )
}
