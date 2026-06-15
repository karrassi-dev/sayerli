'use client'

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Download } from 'lucide-react'
import FactureSimplePDF, { type FactureSimplePDFProps } from './FactureSimplePDF'

export default function FactureSimpleDownloadButton({
  data,
  label = 'Télécharger la facture PDF',
  loadingLabel = 'Génération en cours...',
  className,
  template,
}: {
  data: FactureSimplePDFProps
  label?: string
  loadingLabel?: string
  className?: string
  template?: string
}) {
  return (
    <PDFDownloadLink
      document={<FactureSimplePDF {...data} template={template ?? data.template} />}
      fileName={`facture-${data.numeroFacture}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className={
            className ??
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-all'
          }
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          {loading ? loadingLabel : label}
        </button>
      )}
    </PDFDownloadLink>
  )
}
