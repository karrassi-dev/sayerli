import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer'

const G900 = '#0f172a'
const G700 = '#334155'
const G600 = '#475569'
const G400 = '#94a3b8'
const G200 = '#e2e8f0'
const G100 = '#f1f5f9'
const G050 = '#f8fafc'
const GREEN    = '#16a34a'
const GREEN_BG = '#f0fdf4'
const GREEN_BD = '#bbf7d0'
const BLUE     = '#1d4ed8'
const BLUE_L   = '#3b82f6'
const BLUE_BG  = '#eff6ff'
const BLUE_BD  = '#bfdbfe'
const AMBER_TX = '#92400e'
const AMBER_BG = '#fffbeb'
const AMBER_BD = '#fde68a'
const WHITE    = '#ffffff'

const METHODE_LABELS: Record<string, string> = {
  VIREMENT: 'Virement bancaire',
  CASH:     'Espèces',
  CHEQUE:   'Chèque',
  CARTE:    'Carte bancaire',
  AUTRE:    'Autre',
}

export interface FacturePDFProps {
  numeroFacture: string
  createdAt: string
  dateEcheance: string | null
  notes: string | null
  totalHT: number
  taxe: number
  totalTTC: number
  remise?: number
  devise?: string
  montantDejaPayeAvant: number
  lignes: { description: string; quantite: number; prixUnitaire: number }[]
  devisReference: string | null
  client: { nom: string; email: string | null; telephone: string | null; nomEntreprise: string | null }
  entreprise: {
    nom: string; email: string | null; telephone: string | null; adresse: string | null
    logoUrl: string | null; couleurPrimaire: string | null; ice: string | null; rc: string | null
    activite?: string | null
  }
  declaration: {
    montant: number
    methode: string
    reference: string
    message: string
    datePaiement: string
    submittedAt: string
  }
}

const CURRENCY_LOCALE: Record<string, string> = { MAD: 'fr-MA', EUR: 'fr-FR', USD: 'en-US' }
function fmt(v: number, devise = 'MAD') {
  const locale = CURRENCY_LOCALE[devise] ?? 'fr-MA'
  const currency = CURRENCY_LOCALE[devise] ? devise : 'MAD'
  return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v)
}
function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric' })
}
function fmtDateTime(d: string) {
  return new Date(d).toLocaleString('fr-MA', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function FacturePDF({
  numeroFacture, createdAt, dateEcheance, notes, totalHT, taxe, totalTTC,
  remise = 0, devise = 'MAD', montantDejaPayeAvant, lignes, devisReference, client, entreprise, declaration,
}: FacturePDFProps) {
  const f = (v: number) => fmt(v, devise)
  const brand = entreprise.couleurPrimaire || '#2563eb'
  const sousTotal = lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0)
  const tva = totalTTC - totalHT
  const totalPaidAfter = montantDejaPayeAvant + declaration.montant
  const resteApres = Math.max(0, totalTTC - totalPaidAfter)
  const isFullyPaid = resteApres < 0.01
  const pctPaid = totalTTC > 0 ? Math.min(100, (totalPaidAfter / totalTTC) * 100) : 0
  const pctBefore = totalTTC > 0 ? Math.min(100, (montantDejaPayeAvant / totalTTC) * 100) : 0
  const methodeLabel = METHODE_LABELS[declaration.methode] ?? declaration.methode

  const s = StyleSheet.create({
    page: { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 36 },
    brandBar: { height: 4, backgroundColor: brand },
    body: { paddingHorizontal: 40, paddingTop: 24 },

    // Header
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    logoImg: { width: 44, height: 44, objectFit: 'contain', borderRadius: 6 },
    logoInitial: { width: 44, height: 44, borderRadius: 6, backgroundColor: brand, alignItems: 'center', justifyContent: 'center' },
    logoInitialTxt: { color: WHITE, fontSize: 18, fontFamily: 'Helvetica-Bold' },
    coName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: G900 },
    coDetail: { fontSize: 8, color: G600, marginTop: 1.5 },
    refBlock: { alignItems: 'flex-end' },
    refLbl: { fontSize: 7.5, color: brand, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
    refVal: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: G900, marginTop: 1 },
    devisRef: { fontSize: 7.5, color: G400, marginTop: 3 },
    badge: {
      marginTop: 5, paddingHorizontal: 9, paddingVertical: 3,
      backgroundColor: BLUE_BG, borderRadius: 20, borderWidth: 1, borderColor: BLUE_BD,
    },
    badgeTxt: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: BLUE },

    // Divider
    divider: { height: 1, backgroundColor: G200, marginBottom: 14 },

    // De / Pour
    cols: { flexDirection: 'row', gap: 10, marginBottom: 14 },
    col: { flex: 1, backgroundColor: G100, borderRadius: 7, padding: 11 },
    colLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 1, marginBottom: 6 },
    colName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: G900, marginBottom: 2 },
    colDetail: { fontSize: 8, color: G600, marginBottom: 1.5 },

    // Dates
    datesRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
    pill: { paddingHorizontal: 9, paddingVertical: 4, backgroundColor: G100, borderRadius: 5 },
    pillTxt: { fontSize: 8, color: G600 },
    pillBold: { fontFamily: 'Helvetica-Bold' },
    pillAmber: { paddingHorizontal: 9, paddingVertical: 4, backgroundColor: AMBER_BG, borderRadius: 5, borderWidth: 1, borderColor: AMBER_BD },
    pillAmberTxt: { fontSize: 8, color: AMBER_TX },

    // Table
    tbl: { marginBottom: 16 },
    tblHead: { flexDirection: 'row', backgroundColor: brand, borderRadius: 5, paddingVertical: 8, paddingHorizontal: 10 },
    tHead: { flex: 1, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.8 },
    tHeadN: { width: 44, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.8, textAlign: 'center' },
    tHeadR: { width: 76, fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.8, textAlign: 'right' },
    tRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: G200 },
    tRowAlt: { backgroundColor: G050 },
    tD: { flex: 1, fontSize: 9, color: G900, paddingRight: 6 },
    tN: { width: 44, fontSize: 9, color: G600, textAlign: 'center' },
    tR: { width: 76, fontSize: 9, color: G600, textAlign: 'right' },
    tRBold: { width: 76, fontSize: 9, fontFamily: 'Helvetica-Bold', color: G900, textAlign: 'right' },

    // Totals
    totalsWrap: { alignItems: 'flex-end', marginBottom: 18 },
    totalsBox: { width: 220 },
    totRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
    totLbl: { fontSize: 9, color: G600 },
    totVal: { fontSize: 9, color: G600 },
    totDiv: { height: 1, backgroundColor: G200, marginVertical: 5 },
    totTTCRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
    totTTCLbl: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: G900 },
    totTTCVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: brand },

    // Progress bar section
    progressBox: {
      borderRadius: 8, backgroundColor: G050, borderWidth: 1, borderColor: G200,
      padding: 14, marginBottom: 14,
    },
    progressTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: G400, letterSpacing: 1, marginBottom: 10 },
    progressTrack: { height: 7, backgroundColor: G200, borderRadius: 4, marginBottom: 4, overflow: 'hidden' },
    progressFilled: { height: 7, borderRadius: 4 },
    progressPct: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: G600, marginBottom: 10 },
    progressStats: { flexDirection: 'row', justifyContent: 'space-between' },
    pStat: { alignItems: 'center', flex: 1 },
    pStatLbl: { fontSize: 7.5, color: G400, marginBottom: 2 },
    pStatVal: { fontSize: 9.5, fontFamily: 'Helvetica-Bold' },
    pStatSep: { width: 1, backgroundColor: G200 },

    // Declaration section
    declSection: { marginBottom: 14 },
    declHeader: {
      backgroundColor: BLUE, borderTopLeftRadius: 7, borderTopRightRadius: 7,
      paddingVertical: 8, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    declHeaderTxt: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.8 },
    declHeaderAmt: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WHITE },
    declBody: {
      borderWidth: 1, borderTopWidth: 0, borderColor: BLUE_BD,
      borderBottomLeftRadius: 7, borderBottomRightRadius: 7,
      backgroundColor: BLUE_BG, padding: 12,
    },
    declRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
    declCell: { flex: 1, backgroundColor: WHITE, borderRadius: 5, padding: 8, borderWidth: 1, borderColor: BLUE_BD },
    declCellFull: { backgroundColor: WHITE, borderRadius: 5, padding: 8, borderWidth: 1, borderColor: BLUE_BD, marginBottom: 8 },
    declLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: BLUE_L, letterSpacing: 0.7, marginBottom: 3 },
    declVal: { fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: G900 },
    declValSub: { fontSize: 9, color: G700 },

    // Notes
    notesBox: { backgroundColor: AMBER_BG, borderRadius: 7, padding: 11, borderWidth: 1, borderColor: AMBER_BD, marginBottom: 14 },
    notesLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: AMBER_TX, letterSpacing: 0.8, marginBottom: 4 },
    notesTxt: { fontSize: 8.5, color: '#78350f', lineHeight: 1.5 },

    // Pending notice
    pendingBox: {
      borderRadius: 7, padding: 11, borderWidth: 1,
      borderColor: isFullyPaid ? GREEN_BD : G200,
      backgroundColor: isFullyPaid ? GREEN_BG : G100,
      marginBottom: 14,
    },
    pendingTitle: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: isFullyPaid ? GREEN : G700, marginBottom: 4 },
    pendingTxt: { fontSize: 8.5, color: isFullyPaid ? '#166534' : G600, lineHeight: 1.5 },

    // Footer
    footer: {
      marginTop: 10, paddingTop: 10, paddingHorizontal: 40,
      borderTopWidth: 1, borderTopColor: G200,
      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    footerTxt: { fontSize: 7.5, color: G400 },
    footerBrand: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: G600 },
  })

  // Progress bar segments as absolute widths (595 - 80px padding = 515pt wide, inner box ~490pt)
  const TRACK_W = 455
  const filledW = Math.round((pctPaid / 100) * TRACK_W)
  const beforeW = Math.round((pctBefore / 100) * TRACK_W)

  return (
    <Document title={`Déclaration — ${numeroFacture}`} author={entreprise.nom} subject="Déclaration de paiement">
      <Page size="A4" style={s.page}>
        <View style={s.brandBar} />
        <View style={s.body}>

          {/* ── Header ── */}
          <View style={s.header}>
            <View style={s.logoRow}>
              {entreprise.logoUrl
                ? <Image src={entreprise.logoUrl} style={s.logoImg} />
                : <View style={s.logoInitial}><Text style={s.logoInitialTxt}>{entreprise.nom.charAt(0).toUpperCase()}</Text></View>
              }
              <View>
                <Text style={s.coName}>{entreprise.nom}</Text>
                {entreprise.activite && <Text style={s.coDetail}>{entreprise.activite}</Text>}
                {entreprise.email && <Text style={s.coDetail}>{entreprise.email}</Text>}
                {entreprise.telephone && <Text style={s.coDetail}>{entreprise.telephone}</Text>}
                {entreprise.adresse ? <Text style={s.coDetail}>{entreprise.adresse}</Text> : null}
              </View>
            </View>
            <View style={s.refBlock}>
              <Text style={s.refLbl}>FACTURE</Text>
              <Text style={s.refVal}>{numeroFacture}</Text>
              {devisReference && <Text style={s.devisRef}>Devis : {devisReference}</Text>}
              <View style={s.badge}><Text style={s.badgeTxt}>PAIEMENT DECLARE</Text></View>
            </View>
          </View>

          <View style={s.divider} />

          {/* ── De / Pour ── */}
          <View style={s.cols}>
            <View style={s.col}>
              <Text style={s.colLbl}>DE</Text>
              <Text style={s.colName}>{entreprise.nom}</Text>
              {entreprise.activite ? <Text style={s.colDetail}>{entreprise.activite}</Text> : null}
              {entreprise.adresse ? <Text style={s.colDetail}>{entreprise.adresse}</Text> : null}
              {entreprise.email ? <Text style={s.colDetail}>{entreprise.email}</Text> : null}
              {entreprise.telephone ? <Text style={s.colDetail}>{entreprise.telephone}</Text> : null}
              {entreprise.ice ? <Text style={s.colDetail}>ICE : {entreprise.ice}</Text> : null}
              {entreprise.rc ? <Text style={s.colDetail}>RC : {entreprise.rc}</Text> : null}
            </View>
            <View style={s.col}>
              <Text style={s.colLbl}>POUR</Text>
              <Text style={s.colName}>{client.nom}</Text>
              {client.nomEntreprise ? <Text style={s.colDetail}>{client.nomEntreprise}</Text> : null}
              {client.email ? <Text style={s.colDetail}>{client.email}</Text> : null}
              {client.telephone ? <Text style={s.colDetail}>{client.telephone}</Text> : null}
            </View>
          </View>

          {/* ── Dates ── */}
          <View style={s.datesRow}>
            <View style={s.pill}>
              <Text style={s.pillTxt}>Emise le <Text style={s.pillBold}>{fmtDate(createdAt)}</Text></Text>
            </View>
            {dateEcheance && (
              <View style={s.pillAmber}>
                <Text style={s.pillAmberTxt}>Echeance <Text style={{ fontFamily: 'Helvetica-Bold' }}>{fmtDate(dateEcheance)}</Text></Text>
              </View>
            )}
          </View>

          {/* ── Lines table ── */}
          <View style={s.tbl}>
            <View style={s.tblHead}>
              <Text style={s.tHead}>DESIGNATION</Text>
              <Text style={s.tHeadN}>QTE</Text>
              <Text style={s.tHeadR}>P.U. HT</Text>
              <Text style={s.tHeadR}>TOTAL HT</Text>
            </View>
            {lignes.map((l, i) => (
              <View key={i} style={[s.tRow, i % 2 === 1 ? s.tRowAlt : {}]}>
                <Text style={s.tD}>{l.description}</Text>
                <Text style={s.tN}>{l.quantite}</Text>
                <Text style={s.tR}>{f(l.prixUnitaire)}</Text>
                <Text style={s.tRBold}>{f(l.quantite * l.prixUnitaire)}</Text>
              </View>
            ))}
          </View>

          {/* ── Totals ── */}
          <View style={s.totalsWrap}>
            <View style={s.totalsBox}>
              <View style={s.totRow}>
                <Text style={s.totLbl}>Sous-total HT</Text>
                <Text style={s.totVal}>{f(sousTotal)}</Text>
              </View>
              {remise > 0 && (
                <View style={s.totRow}>
                  <Text style={s.totLbl}>Remise</Text>
                  <Text style={[s.totVal, { color: '#dc2626' }]}>−{f(remise)}</Text>
                </View>
              )}
              <View style={s.totRow}>
                <Text style={s.totLbl}>TVA {taxe}%</Text>
                <Text style={s.totVal}>{f(tva)}</Text>
              </View>
              <View style={s.totDiv} />
              <View style={s.totTTCRow}>
                <Text style={s.totTTCLbl}>Total TTC</Text>
                <Text style={s.totTTCVal}>{f(totalTTC)}</Text>
              </View>
            </View>
          </View>

          {/* ── Payment progress ── */}
          <View style={s.progressBox}>
            <Text style={s.progressTitle}>PROGRESSION DU PAIEMENT</Text>

            {/* Track */}
            <View style={s.progressTrack}>
              {/* Previously paid segment */}
              {beforeW > 0 && (
                <View style={{ position: 'absolute', left: 0, top: 0, height: 7, width: beforeW, backgroundColor: GREEN, borderRadius: 4 }} />
              )}
              {/* This declaration segment */}
              {filledW > beforeW && (
                <View style={{ position: 'absolute', left: beforeW, top: 0, height: 7, width: filledW - beforeW, backgroundColor: brand, borderRadius: 4 }} />
              )}
            </View>
            <Text style={s.progressPct}>{Math.round(pctPaid)}% regle (apres cette declaration)</Text>

            {/* Stats row */}
            <View style={s.progressStats}>
              <View style={s.pStat}>
                <Text style={s.pStatLbl}>Total TTC</Text>
                <Text style={[s.pStatVal, { color: G700 }]}>{f(totalTTC)}</Text>
              </View>
              <View style={s.pStatSep} />
              {montantDejaPayeAvant > 0 && (
                <>
                  <View style={s.pStat}>
                    <Text style={s.pStatLbl}>Deja regle</Text>
                    <Text style={[s.pStatVal, { color: GREEN }]}>{f(montantDejaPayeAvant)}</Text>
                  </View>
                  <View style={s.pStatSep} />
                </>
              )}
              <View style={s.pStat}>
                <Text style={s.pStatLbl}>Cette declaration</Text>
                <Text style={[s.pStatVal, { color: brand }]}>{f(declaration.montant)}</Text>
              </View>
              <View style={s.pStatSep} />
              <View style={s.pStat}>
                <Text style={s.pStatLbl}>Reste du</Text>
                <Text style={[s.pStatVal, { color: isFullyPaid ? GREEN : AMBER_TX }]}>
                  {isFullyPaid ? 'Regle' : fmt(resteApres)}
                </Text>
              </View>
            </View>
          </View>

          {/* ── Declaration details ── */}
          <View style={s.declSection}>
            <View style={s.declHeader}>
              <Text style={s.declHeaderTxt}>DECLARATION DE PAIEMENT</Text>
              <Text style={s.declHeaderAmt}>{f(declaration.montant)}</Text>
            </View>
            <View style={s.declBody}>
              <View style={s.declRow}>
                <View style={s.declCell}>
                  <Text style={s.declLbl}>METHODE</Text>
                  <Text style={s.declVal}>{methodeLabel}</Text>
                </View>
                <View style={s.declCell}>
                  <Text style={s.declLbl}>DATE DE PAIEMENT</Text>
                  <Text style={s.declVal}>{fmtDate(declaration.datePaiement)}</Text>
                </View>
                <View style={s.declCell}>
                  <Text style={s.declLbl}>ENVOYEE LE</Text>
                  <Text style={s.declVal}>{fmtDateTime(declaration.submittedAt)}</Text>
                </View>
              </View>
              {declaration.reference ? (
                <View style={s.declCellFull}>
                  <Text style={s.declLbl}>REFERENCE DE PAIEMENT</Text>
                  <Text style={s.declVal}>{declaration.reference}</Text>
                </View>
              ) : null}
              {declaration.message ? (
                <View style={{ ...s.declCellFull, marginBottom: 0 }}>
                  <Text style={s.declLbl}>MESSAGE</Text>
                  <Text style={s.declValSub}>{declaration.message}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* ── Notes ── */}
          {notes && (
            <View style={s.notesBox}>
              <Text style={s.notesLbl}>NOTES</Text>
              <Text style={s.notesTxt}>{notes}</Text>
            </View>
          )}

          {/* ── Status notice ── */}
          <View style={s.pendingBox}>
            <Text style={s.pendingTitle}>
              {isFullyPaid ? 'Facture entierement reglee (en attente de confirmation)' : 'En cours de verification'}
            </Text>
            <Text style={s.pendingTxt}>
              {isFullyPaid
                ? `Vous avez declare le reglement total de la facture ${numeroFacture}. ${entreprise.nom} va confirmer la reception du paiement sous peu.`
                : `Cette declaration a ete transmise a ${entreprise.nom} et sera examinee sous peu. Le paiement sera confirme definitivamente apres verification. Conservez ce document comme preuve de votre declaration.`
              }
            </Text>
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={s.footer}>
          <Text style={s.footerTxt}>{numeroFacture} — Declaration du {fmtDate(declaration.submittedAt)}</Text>
          <Text style={s.footerBrand}>Sayerli · Logiciel de gestion pour PME marocaines</Text>
        </View>
      </Page>
    </Document>
  )
}
