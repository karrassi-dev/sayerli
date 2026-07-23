import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const G900 = '#111827'
const G800 = '#1f2937'
const G600 = '#4b5563'
const G400 = '#9ca3af'
const G200 = '#e5e7eb'
const G100 = '#f3f4f6'
const G050 = '#f9fafb'
const WHITE = '#ffffff'
const GREEN_BG = '#f0fdf4'
const GREEN    = '#15803d'
const AMBER_BG = '#fffbeb'
const AMBER    = '#92400e'

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
    rc?: string | null
  }
  paiements: { id?: string; montant: number | string; methode: string; datePaiement: string; reference?: string | null }[]
  totalTTC: number | string
  montantPaye: number | string
  rasActif?: boolean
  rasTaux?: number | string
  rasMontant?: number | string
  generatedAt: string
  devise?: string
}

function n(v: number | string): number {
  return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0)
}

const LOCALE_MAP: Record<string, string> = { MAD: 'fr-MA', EUR: 'fr-FR', USD: 'en-US' }

function makeFmt(devise: string) {
  const locale = LOCALE_MAP[devise] ?? 'fr-MA'
  return (v: number | string) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n(v)) + ' ' + devise
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const ORANGE = '#ea580c'

export default function RecuPDF({
  numeroFacture, client, entreprise, paiements, totalTTC, montantPaye,
  rasActif = false, rasTaux = 30, rasMontant = 0,
  generatedAt, devise = 'MAD',
}: RecuPDFProps) {
  const fmt = makeFmt(devise)
  const brand     = entreprise.couleurPrimaire || '#16a34a'
  const total     = n(totalTTC)
  const cumul     = n(montantPaye)
  const effRasMontant = rasActif
    ? (n(rasMontant) > 0 ? n(rasMontant) : Math.round(total * n(rasTaux) * 100) / 10000)
    : 0
  const netAPayer   = rasActif ? total - effRasMontant : total
  const restant     = Math.max(0, netAPayer - cumul)
  const isFullyPaid = restant < 0.01

  // Single payment (we always receive one payment per receipt)
  const p = paiements[0]

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 9,
      color: G900,
      backgroundColor: WHITE,
    },

    // ── HEADER: logo + company name ──
    pageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 40,
      paddingTop: 28,
      paddingBottom: 18,
      gap: 12,
    },
    logoBox: {
      width: 44,
      height: 44,
      objectFit: 'contain',
    },
    logoPlaceholder: {
      width: 44,
      height: 44,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: brand,
    },
    companyName: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 18,
      color: G900,
    },
    companyActivity: {
      fontSize: 8,
      color: G400,
      marginTop: 2,
    },

    // ── STRIPE ──
    stripe1: { height: 10, backgroundColor: brand },
    stripe2: { height: 3, backgroundColor: brand, opacity: 0.35 },

    // ── TITLE ──
    titleBlock: {
      paddingVertical: 18,
      alignItems: 'center',
    },
    title: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 13,
      color: brand,
    },

    // ── SERVICE BLOCK ──
    serviceBox: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 40,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: G200,
      borderRadius: 4,
      padding: 10,
      gap: 10,
    },
    serviceLogoBox: {
      width: 40,
      height: 40,
      borderWidth: 1,
      borderColor: G200,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    serviceLogoImg: { width: 36, height: 36, objectFit: 'contain' },
    serviceLogoPlaceholder: {
      width: 40,
      height: 40,
      borderRadius: 3,
      backgroundColor: brand,
      justifyContent: 'center',
      alignItems: 'center',
    },
    serviceTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, color: G900 },
    serviceSubtitle: { fontSize: 8, color: G600, marginTop: 2 },
    serviceAddress: { fontSize: 7, color: G400, marginTop: 1 },

    // ── INFO GRID ──
    infoGrid: {
      flexDirection: 'row',
      marginHorizontal: 40,
      marginBottom: 20,
      gap: 24,
    },
    infoCol: { flex: 1 },
    infoRow: { flexDirection: 'row', marginBottom: 4 },
    infoLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: G900, width: 60 },
    infoValue: { fontSize: 8, color: G600, flex: 1 },

    // ── TABLE ──
    tableLabel: {
      marginHorizontal: 40,
      marginBottom: 5,
      fontFamily: 'Helvetica-Bold',
      fontSize: 9,
      color: brand,
    },
    tableHead: {
      flexDirection: 'row',
      marginHorizontal: 40,
      backgroundColor: brand,
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    thDesc:   { flex: 1,   color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thRef:    { width: 90, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thAmt:    { width: 80, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    thDate:   { width: 60, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

    tableRow: {
      flexDirection: 'row',
      marginHorizontal: 40,
      paddingVertical: 6,
      paddingHorizontal: 8,
      borderBottomWidth: 1,
      borderBottomColor: G200,
    },
    tdDesc:  { flex: 1,   fontSize: 8, color: G800 },
    tdRef:   { width: 90, fontSize: 8, color: G600, fontFamily: 'Helvetica-Oblique' },
    tdAmt:   { width: 80, fontSize: 8, color: G900, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    tdDate:  { width: 60, fontSize: 8, color: G600, textAlign: 'right' },

    summaryRow: {
      flexDirection: 'row',
      marginHorizontal: 40,
      paddingVertical: 5,
      paddingHorizontal: 8,
      backgroundColor: G100,
      borderBottomWidth: 1,
      borderBottomColor: G200,
    },
    summaryLabel: { flex: 1, fontSize: 8, color: G600 },
    summaryAmt:   { width: 80, fontSize: 8, fontFamily: 'Helvetica-Bold', color: G900, textAlign: 'right' },
    summaryPlaceholder: { width: 60 },

    statusRow: {
      flexDirection: 'row',
      marginHorizontal: 40,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },
    statusLabel: { flex: 1, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    statusAmt:   { width: 80, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

    // ── NOTE ──
    note: {
      marginHorizontal: 40,
      marginTop: 20,
      fontSize: 8,
      color: G400,
      lineHeight: 1.5,
    },
    noteBold: { fontFamily: 'Helvetica-Bold', color: G600 },

    // ── FOOTER ──
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      borderTopWidth: 1,
      borderTopColor: G200,
      paddingVertical: 8,
      paddingHorizontal: 40,
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: G050,
    },
    footerText: { color: G400, fontSize: 7 },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ── TITLE ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Reçu de Paiement</Text>
        </View>

        {/* ── SERVICE BLOCK ── */}
        <View style={styles.serviceBox}>
          {entreprise.logoUrl ? (
            <View style={styles.serviceLogoBox}>
              <Image src={entreprise.logoUrl} style={styles.serviceLogoImg} />
            </View>
          ) : (
            <View style={styles.serviceLogoPlaceholder}>
              <Text style={{ color: WHITE, fontSize: 14, fontFamily: 'Helvetica-Bold' }}>
                {entreprise.nom.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.serviceTitle}>Paiement Facture {numeroFacture}</Text>
            <Text style={styles.serviceSubtitle}>{entreprise.nom}</Text>
            {entreprise.adresse && <Text style={styles.serviceAddress}>{entreprise.adresse}</Text>}
          </View>
        </View>

        {/* ── INFO GRID ── */}
        <View style={styles.infoGrid}>
          {/* Left column */}
          <View style={styles.infoCol}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client :</Text>
              <Text style={styles.infoValue}>{client.nom}</Text>
            </View>
            {client.nomEntreprise && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Entreprise :</Text>
                <Text style={styles.infoValue}>{client.nomEntreprise}</Text>
              </View>
            )}
            {client.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email :</Text>
                <Text style={styles.infoValue}>{client.email}</Text>
              </View>
            )}
            {entreprise.ice && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ICE :</Text>
                <Text style={styles.infoValue}>{entreprise.ice}</Text>
              </View>
            )}
          </View>
          {/* Right column */}
          <View style={styles.infoCol}>
            {p && (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Montant :</Text>
                  <Text style={[styles.infoValue, { fontFamily: 'Helvetica-Bold', color: G900 }]}>{fmt(p.montant)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Méthode :</Text>
                  <Text style={styles.infoValue}>{METHODE_LABELS[p.methode] ?? p.methode}</Text>
                </View>
                {p.reference && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Référence :</Text>
                    <Text style={styles.infoValue}>{p.reference}</Text>
                  </View>
                )}
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date :</Text>
                  <Text style={styles.infoValue}>{fmtDate(p.datePaiement)}</Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── TABLE LABEL ── */}
        <Text style={styles.tableLabel}>Détails du paiement</Text>

        {/* ── TABLE HEADER ── */}
        <View style={styles.tableHead}>
          <Text style={styles.thDesc}>Description</Text>
          <Text style={styles.thRef}>Référence</Text>
          <Text style={styles.thAmt}>Montant</Text>
          <Text style={styles.thDate}>Date</Text>
        </View>

        {/* ── TABLE ROW ── */}
        {p && (
          <View style={styles.tableRow}>
            <Text style={styles.tdDesc}>{METHODE_LABELS[p.methode] ?? p.methode}</Text>
            <Text style={styles.tdRef}>{p.reference || '—'}</Text>
            <Text style={styles.tdAmt}>{fmt(p.montant)}</Text>
            <Text style={styles.tdDate}>{fmtDate(p.datePaiement)}</Text>
          </View>
        )}

        {/* ── RAS breakdown (when applicable) ── */}
        {rasActif && (
          <>
            <View style={[styles.summaryRow, { backgroundColor: '#fff7ed' }]}>
              <Text style={[styles.summaryLabel, { flex: 1, color: ORANGE }]}>Total TTC facture</Text>
              <Text style={[styles.summaryAmt, { color: ORANGE }]}>{fmt(total)}</Text>
              <Text style={styles.summaryPlaceholder}></Text>
            </View>
            <View style={[styles.summaryRow, { backgroundColor: '#fff7ed' }]}>
              <Text style={[styles.summaryLabel, { flex: 1, color: ORANGE }]}>Retenue à la source (RAS {n(rasTaux)}%)</Text>
              <Text style={[styles.summaryAmt, { color: ORANGE }]}>−{fmt(effRasMontant)}</Text>
              <Text style={styles.summaryPlaceholder}></Text>
            </View>
            <View style={[styles.summaryRow, { backgroundColor: '#ffedd5', borderTopWidth: 1, borderTopColor: '#fed7aa' }]}>
              <Text style={[styles.summaryLabel, { flex: 1, fontFamily: 'Helvetica-Bold', color: '#9a3412' }]}>Net à payer (hors RAS)</Text>
              <Text style={[styles.summaryAmt, { color: '#9a3412' }]}>{fmt(netAPayer)}</Text>
              <Text style={styles.summaryPlaceholder}></Text>
            </View>
          </>
        )}

        {/* ── SUMMARY: cumul payé ── */}
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { flex: 1 }]}>Cumul payé sur cette facture</Text>
          <Text style={styles.summaryAmt}>{fmt(cumul)}</Text>
          <Text style={styles.summaryPlaceholder}></Text>
        </View>

        {/* ── STATUS: reste / paid ── */}
        <View style={[styles.statusRow, { backgroundColor: isFullyPaid ? GREEN_BG : AMBER_BG }]}>
          <Text style={[styles.statusLabel, { color: isFullyPaid ? GREEN : AMBER, flex: 1 }]}>
            {isFullyPaid ? '✓  Facture entièrement réglée' : 'Reste à payer'}
          </Text>
          <Text style={[styles.statusAmt, { color: isFullyPaid ? GREEN : AMBER }]}>
            {isFullyPaid ? `0,00 ${devise}` : fmt(restant)}
          </Text>
          <Text style={styles.summaryPlaceholder}></Text>
        </View>

        {/* ── NOTE ── */}
        <View style={styles.note}>
          <Text>
            <Text style={styles.noteBold}>N.B : </Text>
            Ce reçu a été généré automatiquement par {entreprise.nom} via Sayerli.
            {entreprise.email ? ` Pour toute question : ${entreprise.email}.` : ''}
          </Text>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Généré le {generatedAt} · Ref. {numeroFacture}</Text>
          <Text style={styles.footerText}>sayerli.com</Text>
        </View>

      </Page>
    </Document>
  )
}
