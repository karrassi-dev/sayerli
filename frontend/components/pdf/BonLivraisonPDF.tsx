import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const G900 = '#111827'
const G600 = '#4b5563'
const G400 = '#9ca3af'
const G200 = '#e5e7eb'
const G100 = '#f3f4f6'
const G050 = '#f9fafb'
const WHITE = '#ffffff'

export interface BonLivraisonPDFProps {
  reference: string
  createdAt: string
  dateLivraison?: string | null
  notes?: string | null
  client: {
    nom: string
    nomEntreprise?: string | null
    email?: string | null
    telephone?: string | null
    ice?: string | null
  }
  entreprise: {
    nom: string
    logo?: string | null
    email?: string | null
    telephone?: string | null
    adresse?: string | null
    ville?: string | null
    couleurPrimaire?: string | null
    ice?: string | null
    rc?: string | null
  }
  lignes: { description: string; quantite: number | string; unite?: string | null; ordre?: number }[]
  devisRef?: string | null
}

function n(v: number | string): number {
  return typeof v === 'string' ? parseFloat(v) || 0 : (v ?? 0)
}

function fmtDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-MA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function fmtQty(v: number | string) {
  const num = n(v)
  return num % 1 === 0 ? String(num) : num.toFixed(2)
}

export default function BonLivraisonPDF({
  reference, createdAt, dateLivraison, notes, client, entreprise, lignes, devisRef,
}: BonLivraisonPDFProps) {
  const brand = entreprise.couleurPrimaire || '#16a34a'

  const styles = StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 9, color: G900, backgroundColor: WHITE },

    stripe1: { height: 8, backgroundColor: brand },
    stripe2: { height: 2.5, backgroundColor: brand, opacity: 0.35 },

    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 40, paddingTop: 22, paddingBottom: 16, gap: 14 },
    logoBox: { width: 44, height: 44, objectFit: 'contain' },
    logoPlaceholder: { width: 44, height: 44, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: brand },
    companyName: { fontFamily: 'Helvetica-Bold', fontSize: 16, color: G900 },
    companyDetail: { fontSize: 7.5, color: G400, marginTop: 1 },

    docTitle: { paddingVertical: 14, alignItems: 'center' },
    docTitleText: { fontFamily: 'Helvetica-Bold', fontSize: 14, color: brand },
    docSubRef: { fontSize: 9, color: G600, marginTop: 3 },

    infoGrid: { flexDirection: 'row', marginHorizontal: 40, marginBottom: 18, gap: 20 },
    infoCol: { flex: 1, borderWidth: 1, borderColor: G200, borderRadius: 4, padding: 10 },
    infoHeader: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: brand, marginBottom: 6, textTransform: 'uppercase' },
    infoRow: { flexDirection: 'row', marginBottom: 3 },
    infoLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: G900, width: 55 },
    infoValue: { fontSize: 8, color: G600, flex: 1 },

    tableLabel: { marginHorizontal: 40, marginBottom: 4, fontFamily: 'Helvetica-Bold', fontSize: 8.5, color: brand },
    tableHead: { flexDirection: 'row', marginHorizontal: 40, backgroundColor: brand, paddingVertical: 6, paddingHorizontal: 8 },
    thDesc: { flex: 1, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold' },
    thQty: { width: 50, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    thUnit: { width: 55, color: WHITE, fontSize: 8, fontFamily: 'Helvetica-Bold', textAlign: 'right' },

    tableRow: {
      flexDirection: 'row', marginHorizontal: 40, paddingVertical: 7, paddingHorizontal: 8,
      borderBottomWidth: 1, borderBottomColor: G200,
    },
    tableRowAlt: { backgroundColor: G050 },
    tdDesc: { flex: 1, fontSize: 8, color: G900 },
    tdQty: { width: 50, fontSize: 8, color: G900, fontFamily: 'Helvetica-Bold', textAlign: 'right' },
    tdUnit: { width: 55, fontSize: 8, color: G600, textAlign: 'right' },

    notesBlock: { marginHorizontal: 40, marginTop: 16, borderLeftWidth: 2.5, borderLeftColor: brand, paddingLeft: 8 },
    notesLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: G900, marginBottom: 3 },
    notesText: { fontSize: 8, color: G600, lineHeight: 1.5 },

    signatureBlock: { marginHorizontal: 40, marginTop: 24, flexDirection: 'row', gap: 20 },
    signatureCol: { flex: 1, borderWidth: 1, borderColor: G200, borderRadius: 4, padding: 10, minHeight: 64 },
    signatureLabel: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: G900, marginBottom: 4 },
    signatureHint: { fontSize: 7, color: G400, fontFamily: 'Helvetica-Oblique' },

    footer: {
      position: 'absolute', bottom: 0, left: 0, right: 0,
      borderTopWidth: 1, borderTopColor: G200,
      paddingVertical: 7, paddingHorizontal: 40,
      flexDirection: 'row', justifyContent: 'space-between', backgroundColor: G050,
    },
    footerText: { color: G400, fontSize: 7 },
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* Top stripe */}
        <View style={styles.stripe1} />
        <View style={styles.stripe2} />

        {/* Header: logo + company */}
        <View style={styles.header}>
          {entreprise.logo ? (
            <Image src={entreprise.logo} style={styles.logoBox} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={{ color: WHITE, fontSize: 16, fontFamily: 'Helvetica-Bold' }}>
                {entreprise.nom.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text style={styles.companyName}>{entreprise.nom}</Text>
            {entreprise.adresse && <Text style={styles.companyDetail}>{entreprise.adresse}{entreprise.ville ? `, ${entreprise.ville}` : ''}</Text>}
            {entreprise.telephone && <Text style={styles.companyDetail}>{entreprise.telephone}</Text>}
            {entreprise.email && <Text style={styles.companyDetail}>{entreprise.email}</Text>}
          </View>
        </View>

        {/* Doc title */}
        <View style={styles.docTitle}>
          <Text style={styles.docTitleText}>BON DE LIVRAISON</Text>
          <Text style={styles.docSubRef}>{reference}{devisRef ? `  ·  Réf. devis : ${devisRef}` : ''}</Text>
        </View>

        {/* Info grid: dates left / client right */}
        <View style={styles.infoGrid}>
          <View style={styles.infoCol}>
            <Text style={styles.infoHeader}>Informations</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Référence :</Text>
              <Text style={[styles.infoValue, { fontFamily: 'Helvetica-Bold' }]}>{reference}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date :</Text>
              <Text style={styles.infoValue}>{fmtDate(createdAt)}</Text>
            </View>
            {dateLivraison && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Livraison :</Text>
                <Text style={styles.infoValue}>{fmtDate(dateLivraison)}</Text>
              </View>
            )}
            {entreprise.ice && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ICE :</Text>
                <Text style={styles.infoValue}>{entreprise.ice}</Text>
              </View>
            )}
            {entreprise.rc && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>RC :</Text>
                <Text style={styles.infoValue}>{entreprise.rc}</Text>
              </View>
            )}
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoHeader}>Destinataire</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Client :</Text>
              <Text style={[styles.infoValue, { fontFamily: 'Helvetica-Bold' }]}>{client.nom}</Text>
            </View>
            {client.nomEntreprise && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Société :</Text>
                <Text style={styles.infoValue}>{client.nomEntreprise}</Text>
              </View>
            )}
            {client.ice && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ICE :</Text>
                <Text style={styles.infoValue}>{client.ice}</Text>
              </View>
            )}
            {client.email && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email :</Text>
                <Text style={styles.infoValue}>{client.email}</Text>
              </View>
            )}
            {client.telephone && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tél. :</Text>
                <Text style={styles.infoValue}>{client.telephone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Lines table */}
        <Text style={styles.tableLabel}>Articles livrés</Text>
        <View style={styles.tableHead}>
          <Text style={styles.thDesc}>Désignation</Text>
          <Text style={styles.thQty}>Qté</Text>
          <Text style={styles.thUnit}>Unité</Text>
        </View>
        {lignes.map((l, i) => (
          <View key={i} style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}>
            <Text style={styles.tdDesc}>{l.description}</Text>
            <Text style={styles.tdQty}>{fmtQty(l.quantite)}</Text>
            <Text style={styles.tdUnit}>{l.unite || '—'}</Text>
          </View>
        ))}

        {/* Notes */}
        {notes && (
          <View style={styles.notesBlock}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}

        {/* Signature block */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Signature du fournisseur</Text>
            <Text style={styles.signatureHint}>{entreprise.nom}</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text style={styles.signatureLabel}>Signature et cachet client</Text>
            <Text style={styles.signatureHint}>Lu et approuvé — Bon pour livraison reçue</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{reference} · Généré le {fmtDate(new Date().toISOString())}</Text>
          <Text style={styles.footerText}>sayerli.com</Text>
        </View>

      </Page>
    </Document>
  )
}
