'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import DeclarationTVAPDF, { type DeclarationTVAPDFProps } from './DeclarationTVAPDF'

export default function DeclarationTVADownloadButton({
  data,
  debut,
  fin,
  label,
  loadingLabel,
}: {
  data: DeclarationTVAPDFProps
  debut: string
  fin: string
  label: string
  loadingLabel: string
}) {
  return (
    <PDFDownloadLink
      document={<DeclarationTVAPDF {...data} />}
      fileName={`declaration-tva-${debut}-${fin}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 transition-all"
        >
          {loading
            ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Download className="w-3.5 h-3.5" />}
          {loading ? loadingLabel : label}
        </button>
      )}
    </PDFDownloadLink>
  )
}
