'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import DevisPDF, { type DevisPDFProps } from './DevisPDF'

export default function DevisDownloadButton({
  data, brand, label, loadingLabel,
}: {
  data: DevisPDFProps
  brand: string
  label: string
  loadingLabel: string
}) {
  return (
    <PDFDownloadLink
      document={<DevisPDF {...data} />}
      fileName={`${data.reference}-accepte.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          style={{ backgroundColor: brand }}
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {loading ? loadingLabel : label}
        </button>
      )}
    </PDFDownloadLink>
  )
}
