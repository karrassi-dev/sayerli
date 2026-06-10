import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer'

const PRIMARY    = '#2563eb'
const PRIMARY_10 = '#eff6ff'
const GREY_900   = '#0f172a'
const GREY_600   = '#475569'
const GREY_400   = '#94a3b8'
const GREY_200   = '#e2e8f0'
const GREY_50    = '#f8fafc'
const WHITE      = '#ffffff'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: GREY_900,
    backgroundColor: WHITE,
    paddingBottom: 40,
  },
  brandBar: { height: 5, backgroundColor: PRIMARY },
  content: { paddingHorizontal: 30, paddingTop: 20 },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: GREY_200,
  },
  companyName: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: PRIMARY },
  companyMeta: { fontSize: 7.5, color: GREY_600, marginTop: 2 },
  reportTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: GREY_900, textAlign: 'right' },
  reportMeta: { fontSize: 7.5, color: GREY_600, marginTop: 3, textAlign: 'right' },

  /* Section */
  section: { marginBottom: 16 },
  sectionBar: {
    backgroundColor: PRIMARY,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: { color: WHITE, fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  sectionCount: { color: 'rgba(255,255,255,0.7)', fontSize: 7.5, marginLeft: 6 },

  /* Table */
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: GREY_50,
    borderBottomWidth: 1,
    borderBottomColor: GREY_200,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: GREY_200,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tableRowAlt: { backgroundColor: PRIMARY_10 },
  cellHeader: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: GREY_600 },
  cell: { fontSize: 7.5, color: GREY_900 },
  noData: {
    fontSize: 8,
    color: GREY_400,
    fontStyle: 'italic',
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: GREY_200,
  },

  /* Footer */
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: GREY_200,
    paddingTop: 5,
  },
  footerText: { fontSize: 7, color: GREY_400 },
})

/* ─── helpers ─────────────────────────────────────────────── */

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtMoney(v: string | number | null | undefined) {
  if (v === null || v === undefined || v === '') return '—'
  const n = Number(v)
  return n.toLocaleString('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD'
}

const STATUS_FR: Record<string, string> = {
  BROUILLON: 'Brouillon', ENVOYE: 'Envoyé', VU: 'Vu', ACCEPTE: 'Accepté', REFUSE: 'Refusé',
  ENVOYEE: 'Envoyée', PAYEE: 'Payée', PARTIELLE: 'Partielle', EN_RETARD: 'En retard', ANNULEE: 'Annulée',
  CASH: 'Espèces', VIREMENT: 'Virement', CARTE: 'Carte', CHEQUE: 'Chèque', MOBILE: 'Mobile', AUTRE: 'Autre',
}

/* ─── generic table row ────────────────────────────────────── */

interface ColDef { label: string; flex: number }

function HeaderRow({ cols }: { cols: ColDef[] }) {
  return (
    <View style={styles.tableHeaderRow}>
      {cols.map((c, i) => (
        <Text key={i} style={[styles.cellHeader, { flex: c.flex }]}>{c.label.toUpperCase()}</Text>
      ))}
    </View>
  )
}

function DataRow({ values, cols, alt }: { values: string[]; cols: ColDef[]; alt: boolean }) {
  return (
    <View style={[styles.tableRow, alt ? styles.tableRowAlt : {}]}>
      {values.map((v, i) => (
        <Text key={i} style={[styles.cell, { flex: cols[i]?.flex ?? 1 }]}>{v || '—'}</Text>
      ))}
    </View>
  )
}

/* ─── section wrapper ──────────────────────────────────────── */

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <View style={styles.section} wrap={false}>
      <View style={styles.sectionBar}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCount}>({count})</Text>
      </View>
      {children}
    </View>
  )
}

/* ─── column definitions ───────────────────────────────────── */

const COLS_CLIENTS: ColDef[] = [
  { label: 'Nom', flex: 2.2 },
  { label: 'Email', flex: 2.5 },
  { label: 'Téléphone', flex: 1.5 },
  { label: 'Entreprise', flex: 2 },
  { label: 'Statut', flex: 0.8 },
  { label: 'Date', flex: 1.2 },
]

const COLS_DEVIS: ColDef[] = [
  { label: 'Référence', flex: 1.8 },
  { label: 'Client', flex: 2.5 },
  { label: 'Statut', flex: 1 },
  { label: 'Total HT', flex: 1.5 },
  { label: 'Total TTC', flex: 1.5 },
  { label: 'Expiration', flex: 1.2 },
  { label: 'Date', flex: 1.2 },
]

const COLS_FACTURES: ColDef[] = [
  { label: 'N° Facture', flex: 1.5 },
  { label: 'Client', flex: 2.5 },
  { label: 'Statut', flex: 1 },
  { label: 'Total TTC', flex: 1.5 },
  { label: 'Payé', flex: 1.5 },
  { label: 'Reste', flex: 1.5 },
  { label: 'Échéance', flex: 1.2 },
  { label: 'Date', flex: 1.2 },
]

const COLS_PAIEMENTS: ColDef[] = [
  { label: 'Facture', flex: 1.5 },
  { label: 'Client', flex: 2.5 },
  { label: 'Montant', flex: 1.5 },
  { label: 'Méthode', flex: 1.2 },
  { label: 'Référence', flex: 2 },
  { label: 'Date', flex: 1.2 },
]

/* ─── main component ───────────────────────────────────────── */

export interface ExportPDFProps {
  data: {
    clients?: any[]
    devis?: any[]
    factures?: any[]
    paiements?: any[]
  }
  meta: {
    entrepriseName: string
    periode: string
    generatedAt: string
  }
}

export default function ExportPDF({ data, meta }: ExportPDFProps) {
  const { clients, devis, factures, paiements } = data

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.brandBar} fixed />

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.companyName}>{meta.entrepriseName}</Text>
              <Text style={styles.companyMeta}>sayerli — Gestion commerciale</Text>
            </View>
            <View>
              <Text style={styles.reportTitle}>RAPPORT D&apos;EXPORTATION</Text>
              <Text style={styles.reportMeta}>Période : {meta.periode}</Text>
              <Text style={styles.reportMeta}>Généré le {meta.generatedAt}</Text>
            </View>
          </View>

          {/* Clients */}
          {clients !== undefined && (
            <Section title="Clients" count={clients.length}>
              <HeaderRow cols={COLS_CLIENTS} />
              {clients.length === 0
                ? <Text style={styles.noData}>Aucun client pour cette période.</Text>
                : clients.map((c, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_CLIENTS} values={[
                    c.nom,
                    c.email || '',
                    c.telephone || '',
                    c.nomEntreprise || '',
                    c.actif ? 'Actif' : 'Inactif',
                    fmtDate(c.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {/* Devis */}
          {devis !== undefined && (
            <Section title="Devis" count={devis.length}>
              <HeaderRow cols={COLS_DEVIS} />
              {devis.length === 0
                ? <Text style={styles.noData}>Aucun devis pour cette période.</Text>
                : devis.map((d, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_DEVIS} values={[
                    d.reference,
                    d.client?.nom || '',
                    STATUS_FR[d.statut] || d.statut,
                    fmtMoney(d.totalHT),
                    fmtMoney(d.totalTTC),
                    fmtDate(d.dateExpiration),
                    fmtDate(d.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {/* Factures */}
          {factures !== undefined && (
            <Section title="Factures" count={factures.length}>
              <HeaderRow cols={COLS_FACTURES} />
              {factures.length === 0
                ? <Text style={styles.noData}>Aucune facture pour cette période.</Text>
                : factures.map((f, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_FACTURES} values={[
                    f.numeroFacture,
                    f.client?.nom || '',
                    STATUS_FR[f.statut] || f.statut,
                    fmtMoney(f.totalTTC),
                    fmtMoney(f.montantPaye),
                    fmtMoney(Number(f.totalTTC) - Number(f.montantPaye)),
                    fmtDate(f.dateEcheance),
                    fmtDate(f.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {/* Paiements */}
          {paiements !== undefined && (
            <Section title="Paiements" count={paiements.length}>
              <HeaderRow cols={COLS_PAIEMENTS} />
              {paiements.length === 0
                ? <Text style={styles.noData}>Aucun paiement pour cette période.</Text>
                : paiements.map((p, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_PAIEMENTS} values={[
                    p.facture?.numeroFacture || '',
                    p.facture?.client?.nom || '',
                    fmtMoney(p.montant),
                    STATUS_FR[p.methode] || p.methode,
                    p.reference || '',
                    fmtDate(p.datePaiement),
                  ]} />
                ))
              }
            </Section>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{meta.entrepriseName} — Exporté via sayerli</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
