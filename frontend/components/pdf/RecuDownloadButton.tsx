'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import RecuPDF, { type RecuPDFProps } from './RecuPDF'

export default function RecuDownloadButton({
  data,
  label = 'Télécharger le reçu (PDF)',
  loadingLabel = 'Génération…',
  className,
}: {
  data: RecuPDFProps
  label?: string
  loadingLabel?: string
  className?: string
}) {
  return (
    <PDFDownloadLink
      document={<RecuPDF {...data} />}
      fileName={`recu-${data.numeroFacture}-${new Date().toISOString().split('T')[0]}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={
            className ??
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-all'
          }
        >
          {loading
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Download className="w-3.5 h-3.5" />
          }
          {loading ? loadingLabel : label}
        </button>
      )}
    </PDFDownloadLink>
  )
}
