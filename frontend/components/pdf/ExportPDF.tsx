import {
  Document, Page, View, Text, Image, StyleSheet,
} from '@react-pdf/renderer'

/* ─── colours (use brand or fallback) ─────────────────────────── */

const WHITE    = '#ffffff'
const GREY_900 = '#0f172a'
const GREY_700 = '#334155'
const GREY_600 = '#475569'
const GREY_400 = '#94a3b8'
const GREY_200 = '#e2e8f0'
const GREY_100 = '#f1f5f9'
const GREY_050 = '#f8fafc'

/* ─── helpers ─────────────────────────────────────────────────── */

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

/* ─── generic table ────────────────────────────────────────────── */

interface ColDef { label: string; flex: number }

function HeaderRow({ cols, brand }: { cols: ColDef[]; brand: string }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: GREY_100, borderBottomWidth: 1, borderBottomColor: GREY_200, paddingVertical: 4, paddingHorizontal: 8 }}>
      {cols.map((c, i) => (
        <Text key={i} style={{ flex: c.flex, fontSize: 7, fontFamily: 'Helvetica-Bold', color: brand }}>{c.label.toUpperCase()}</Text>
      ))}
    </View>
  )
}

function DataRow({ values, cols, alt }: { values: string[]; cols: ColDef[]; alt: boolean }) {
  return (
    <View style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: GREY_200, paddingVertical: 4, paddingHorizontal: 8, backgroundColor: alt ? GREY_050 : WHITE }}>
      {values.map((v, i) => (
        <Text key={i} style={{ flex: cols[i]?.flex ?? 1, fontSize: 7.5, color: GREY_900 }}>{v || '—'}</Text>
      ))}
    </View>
  )
}

/* ─── section wrapper ──────────────────────────────────────────── */

function Section({ title, count, brand, children }: { title: string; count: number; brand: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 16 }} wrap={false}>
      <View style={{ backgroundColor: brand, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 3 }}>
        <Text style={{ color: WHITE, fontSize: 8.5, fontFamily: 'Helvetica-Bold' }}>{title}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 7.5, marginLeft: 6 }}>({count})</Text>
      </View>
      {children}
    </View>
  )
}

/* ─── KPI card ─────────────────────────────────────────────────── */

function KpiCard({ label, value, brand }: { label: string; value: string; brand: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: WHITE, borderWidth: 1, borderColor: GREY_200, borderRadius: 4, padding: 8, marginHorizontal: 3, alignItems: 'center' }}>
      <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: brand }}>{value}</Text>
      <Text style={{ fontSize: 6.5, color: GREY_600, marginTop: 2, textAlign: 'center' }}>{label}</Text>
    </View>
  )
}

/* ─── column definitions ───────────────────────────────────────── */

const COLS_CLIENTS: ColDef[] = [
  { label: 'Nom', flex: 2.2 }, { label: 'Email', flex: 2.5 }, { label: 'Téléphone', flex: 1.5 },
  { label: 'Entreprise', flex: 2 }, { label: 'Statut', flex: 0.8 }, { label: 'Date', flex: 1.2 },
]

const COLS_DEVIS: ColDef[] = [
  { label: 'Référence', flex: 1.8 }, { label: 'Client', flex: 2.5 }, { label: 'Statut', flex: 1 },
  { label: 'Total HT', flex: 1.5 }, { label: 'Total TTC', flex: 1.5 }, { label: 'Expiration', flex: 1.2 }, { label: 'Date', flex: 1.2 },
]

const COLS_FACTURES: ColDef[] = [
  { label: 'N° Facture', flex: 1.5 }, { label: 'Client', flex: 2.5 }, { label: 'Statut', flex: 1 },
  { label: 'Total TTC', flex: 1.5 }, { label: 'Payé', flex: 1.5 }, { label: 'Reste', flex: 1.5 },
  { label: 'Échéance', flex: 1.2 }, { label: 'Date', flex: 1.2 },
]

const COLS_PAIEMENTS: ColDef[] = [
  { label: 'Facture', flex: 1.5 }, { label: 'Client', flex: 2.5 }, { label: 'Montant', flex: 1.5 },
  { label: 'Méthode', flex: 1.2 }, { label: 'Référence', flex: 2 }, { label: 'Date', flex: 1.2 },
]

/* ─── main component ───────────────────────────────────────────── */

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
    logo?: string | null
    adresse?: string | null
    ville?: string | null
    telephone?: string | null
    email?: string | null
    ice?: string | null
    rc?: string | null
    couleurPrimaire?: string | null
  }
}

export default function ExportPDF({ data, meta }: ExportPDFProps) {
  const { clients, devis, factures, paiements } = data
  const brand = meta.couleurPrimaire || '#2563eb'

  /* summary KPIs */
  const totalDevisTTC = (devis ?? []).reduce((s, d) => s + Number(d.totalTTC || 0), 0)
  const totalFacturesTTC = (factures ?? []).reduce((s, f) => s + Number(f.totalTTC || 0), 0)
  const totalPaiements = (paiements ?? []).reduce((s, p) => s + Number(p.montant || 0), 0)

  const companyLine2 = [meta.adresse, meta.ville].filter(Boolean).join(', ')
  const companyLine3 = [meta.telephone, meta.email].filter(Boolean).join('  ·  ')
  const companyLine4 = [meta.ice ? `ICE: ${meta.ice}` : null, meta.rc ? `RC: ${meta.rc}` : null].filter(Boolean).join('  ·  ')

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={{ fontFamily: 'Helvetica', fontSize: 8.5, color: GREY_900, backgroundColor: WHITE, paddingBottom: 44 }}>

        {/* top brand bar */}
        <View style={{ height: 6, backgroundColor: brand }} fixed />

        <View style={{ paddingHorizontal: 30, paddingTop: 18 }}>

          {/* ── header ── */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: GREY_200 }}>

            {/* left: logo + company */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, flex: 1 }}>
              {meta.logo
                ? <Image src={meta.logo} style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6 }} />
                : (
                  <View style={{ width: 48, height: 48, borderRadius: 6, backgroundColor: brand, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: WHITE, fontSize: 20, fontFamily: 'Helvetica-Bold' }}>{meta.entrepriseName.charAt(0).toUpperCase()}</Text>
                  </View>
                )
              }
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontFamily: 'Helvetica-Bold', color: brand }}>{meta.entrepriseName}</Text>
                {companyLine2 ? <Text style={{ fontSize: 7, color: GREY_600, marginTop: 2 }}>{companyLine2}</Text> : null}
                {companyLine3 ? <Text style={{ fontSize: 7, color: GREY_600, marginTop: 1.5 }}>{companyLine3}</Text> : null}
                {companyLine4 ? <Text style={{ fontSize: 7, color: GREY_400, marginTop: 1.5 }}>{companyLine4}</Text> : null}
              </View>
            </View>

            {/* right: report info */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 17, fontFamily: 'Helvetica-Bold', color: GREY_900 }}>RAPPORT D&apos;EXPORTATION</Text>
              <View style={{ marginTop: 6, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 7.5, color: GREY_600 }}>Période : <Text style={{ fontFamily: 'Helvetica-Bold', color: GREY_700 }}>{meta.periode}</Text></Text>
                <Text style={{ fontSize: 7.5, color: GREY_600, marginTop: 2 }}>Généré le {meta.generatedAt}</Text>
                <Text style={{ fontSize: 7.5, color: GREY_600, marginTop: 2 }}>sayerli — Gestion commerciale</Text>
              </View>
            </View>
          </View>

          {/* ── KPI summary row ── */}
          <View style={{ flexDirection: 'row', marginHorizontal: -3, marginBottom: 18 }}>
            {clients !== undefined && (
              <KpiCard brand={brand} label="Clients" value={String(clients.length)} />
            )}
            {devis !== undefined && (
              <KpiCard brand={brand} label="Total devis TTC" value={fmtMoney(totalDevisTTC)} />
            )}
            {factures !== undefined && (
              <KpiCard brand={brand} label="Total factures TTC" value={fmtMoney(totalFacturesTTC)} />
            )}
            {paiements !== undefined && (
              <KpiCard brand={brand} label="Paiements reçus" value={fmtMoney(totalPaiements)} />
            )}
          </View>

          {/* ── tables ── */}

          {clients !== undefined && (
            <Section title="Clients" count={clients.length} brand={brand}>
              <HeaderRow cols={COLS_CLIENTS} brand={brand} />
              {clients.length === 0
                ? <Text style={{ fontSize: 8, color: GREY_400, fontStyle: 'italic', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: GREY_200 }}>Aucun client pour cette période.</Text>
                : clients.map((c, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_CLIENTS} values={[
                    c.nom, c.email || '', c.telephone || '', c.nomEntreprise || '',
                    c.actif ? 'Actif' : 'Inactif', fmtDate(c.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {devis !== undefined && (
            <Section title="Devis" count={devis.length} brand={brand}>
              <HeaderRow cols={COLS_DEVIS} brand={brand} />
              {devis.length === 0
                ? <Text style={{ fontSize: 8, color: GREY_400, fontStyle: 'italic', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: GREY_200 }}>Aucun devis pour cette période.</Text>
                : devis.map((d, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_DEVIS} values={[
                    d.reference, d.client?.nom || '', STATUS_FR[d.statut] || d.statut,
                    fmtMoney(d.totalHT), fmtMoney(d.totalTTC),
                    fmtDate(d.dateExpiration), fmtDate(d.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {factures !== undefined && (
            <Section title="Factures" count={factures.length} brand={brand}>
              <HeaderRow cols={COLS_FACTURES} brand={brand} />
              {factures.length === 0
                ? <Text style={{ fontSize: 8, color: GREY_400, fontStyle: 'italic', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: GREY_200 }}>Aucune facture pour cette période.</Text>
                : factures.map((f, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_FACTURES} values={[
                    f.numeroFacture, f.client?.nom || '', STATUS_FR[f.statut] || f.statut,
                    fmtMoney(f.totalTTC), fmtMoney(f.montantPaye),
                    fmtMoney(Number(f.totalTTC) - Number(f.montantPaye)),
                    fmtDate(f.dateEcheance), fmtDate(f.createdAt),
                  ]} />
                ))
              }
            </Section>
          )}

          {paiements !== undefined && (
            <Section title="Paiements" count={paiements.length} brand={brand}>
              <HeaderRow cols={COLS_PAIEMENTS} brand={brand} />
              {paiements.length === 0
                ? <Text style={{ fontSize: 8, color: GREY_400, fontStyle: 'italic', paddingVertical: 10, paddingHorizontal: 10, textAlign: 'center', borderBottomWidth: 0.5, borderBottomColor: GREY_200 }}>Aucun paiement pour cette période.</Text>
                : paiements.map((p, i) => (
                  <DataRow key={i} alt={i % 2 === 1} cols={COLS_PAIEMENTS} values={[
                    p.facture?.numeroFacture || '', p.facture?.client?.nom || '',
                    fmtMoney(p.montant), STATUS_FR[p.methode] || p.methode,
                    p.reference || '', fmtDate(p.datePaiement),
                  ]} />
                ))
              }
            </Section>
          )}
        </View>

        {/* ── footer ── */}
        <View style={{ position: 'absolute', bottom: 16, left: 30, right: 30, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: GREY_200, paddingTop: 6 }} fixed>
          <Text style={{ fontSize: 7, color: GREY_400 }}>{meta.entrepriseName} — Exporté via sayerli</Text>
          <Text
            style={{ fontSize: 7, color: GREY_400 }}
            render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>

      </Page>
    </Document>
  )
}
