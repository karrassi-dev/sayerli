'use client'

import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FeaturePlanModal } from '@/components/billing/FeaturePlanModal'

export type TemplateId = 'classic' | 'minimal' | 'stripe' | 'corporate' | 'bold' | 'elegant'
type PlanId = 'STARTER' | 'PRO' | 'BUSINESS'

const PLAN_ORDER: Record<string, number> = { STARTER: 0, PRO: 1, BUSINESS: 2 }
const PLAN_LABEL: Record<string, { label: string; color: string }> = {
  STARTER: { label: 'STARTER', color: 'bg-emerald-100 text-emerald-700' },
  PRO:     { label: 'PRO',     color: 'bg-violet-100 text-violet-700' },
  BUSINESS:{ label: 'BUSINESS',color: 'bg-amber-100 text-amber-700' },
}

function canUse(userPlan: string, templatePlan: string) {
  return (PLAN_ORDER[userPlan] ?? 0) >= (PLAN_ORDER[templatePlan] ?? 0)
}

// ── Template definitions ──────────────────────────────────────────────────────

interface TemplateDef {
  id: TemplateId
  name: string
  plan: PlanId
  Thumb: (props: { color: string }) => React.ReactElement
}

function ThumbClassic({ color }: { color: string }) {
  return (
    <div className="w-full h-full bg-white p-2 flex flex-col gap-1">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-1">
          <div className="w-5 h-5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex flex-col gap-0.5">
            <div className="h-1 w-10 bg-gray-800 rounded" />
            <div className="h-0.5 w-7 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="h-0.5 w-5 bg-gray-400 rounded" />
          <div className="h-1.5 w-9 bg-gray-800 rounded" />
        </div>
      </div>
      <div className="h-px bg-gray-200 my-0.5" />
      <div className="flex gap-1">
        {[0, 1].map(i => (
          <div key={i} className="flex-1 flex flex-col gap-0.5">
            <div className="h-0.5 w-3 bg-gray-400" />
            <div className="h-0.5 w-7 bg-gray-700 rounded" />
            <div className="h-0.5 w-5 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
      <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
        <div className="h-2 rounded-sm flex items-center px-1 gap-1 bg-gray-900">
          <div className="h-0.5 flex-1 bg-white/60 rounded" />
          <div className="h-0.5 w-4 bg-white/60 rounded" />
          <div className="h-0.5 w-4 bg-white/60 rounded" />
        </div>
        {[0, 1, 2].map(i => (
          <div key={i} className={cn('flex gap-1 h-1.5 items-center px-1', i % 2 === 1 ? 'bg-gray-50' : '')}>
            <div className="h-0.5 flex-1 bg-gray-300 rounded" />
            <div className="h-0.5 w-4 bg-gray-300 rounded" />
            <div className="h-0.5 w-4 bg-gray-400 rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-0.5">
        <div className="h-2 w-16 rounded-sm flex items-center justify-between px-1 bg-gray-900">
          <div className="h-0.5 w-5 bg-white/70 rounded" />
          <div className="h-0.5 w-5 bg-white/70 rounded" />
        </div>
      </div>
    </div>
  )
}

function ThumbMinimal({ color }: { color: string }) {
  return (
    <div className="w-full h-full bg-white p-2 flex flex-col gap-1">
      <div className="h-0.5 w-full rounded" style={{ backgroundColor: color }} />
      <div className="flex justify-between items-center mt-0.5">
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-9 bg-gray-800 rounded" />
          <div className="h-0.5 w-6 bg-gray-300 rounded" />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="h-0.5 w-4 bg-gray-400 rounded" />
          <div className="h-1 w-8 bg-gray-700 rounded" />
        </div>
      </div>
      <div className="h-px bg-gray-100" />
      <div className="flex gap-1">
        {[0,1].map(i => (
          <div key={i} className="flex-1 flex flex-col gap-0.5">
            {[4,7,5,6].map((w, j) => <div key={j} className="h-0.5 bg-gray-300 rounded" style={{ width: `${w * 7}%` }} />)}
          </div>
        ))}
      </div>
      <div className="h-px bg-gray-100" />
      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex gap-1 border-b border-gray-200 pb-0.5">
          <div className="h-0.5 flex-1 bg-gray-500 rounded" />
          <div className="h-0.5 w-4 bg-gray-500 rounded" />
          <div className="h-0.5 w-4 bg-gray-500 rounded" />
        </div>
        {[0,1,2].map(i => (
          <div key={i} className="flex gap-1 h-1 items-center">
            <div className="h-0.5 flex-1 bg-gray-200 rounded" />
            <div className="h-0.5 w-4 bg-gray-200 rounded" />
            <div className="h-0.5 w-4 bg-gray-300 rounded" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-1 mt-0.5">
        <div className="h-0.5 w-5 bg-gray-400 rounded mt-1" />
        <div className="h-1 w-7 rounded" style={{ backgroundColor: color + '30' }}>
          <div className="h-full w-full rounded" style={{ backgroundColor: color, opacity: 0.7 }} />
        </div>
      </div>
    </div>
  )
}

function ThumbStripe({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 h-4 flex items-center px-2 gap-1" style={{ backgroundColor: color }}>
        <div className="h-1 w-5 bg-white/80 rounded" />
        <div className="flex-1" />
        <div className="h-0.5 w-6 bg-white/60 rounded" />
        <div className="h-1 w-7 bg-white rounded" />
      </div>
      <div className="flex-1 bg-white p-1.5 flex flex-col gap-0.5">
        <div className="flex gap-1">
          {[0,1].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 w-3 bg-gray-400" />
              <div className="h-0.5 w-6 bg-gray-700 rounded" />
              <div className="h-0.5 w-5 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
          <div className="h-2 flex items-center px-1 rounded-sm" style={{ backgroundColor: color + '25' }}>
            <div className="h-0.5 flex-1 rounded" style={{ backgroundColor: color + '90' }} />
          </div>
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-1 h-1.5 items-center px-0.5">
              <div className="h-0.5 flex-1 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-2 w-14 rounded-sm flex items-center px-1" style={{ backgroundColor: color }}>
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ThumbCorporate({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 p-2 flex justify-between items-start" style={{ backgroundColor: color }}>
        <div className="flex flex-col gap-0.5">
          <div className="h-1.5 w-10 bg-white rounded" />
          <div className="h-0.5 w-7 bg-white/60 rounded" />
          <div className="h-0.5 w-5 bg-white/50 rounded" />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className="h-0.5 w-4 bg-white/50 rounded" />
          <div className="h-1.5 w-9 bg-white rounded" />
        </div>
      </div>
      <div className="flex-1 bg-white p-1.5 flex flex-col gap-0.5">
        <div className="flex gap-1">
          {[0,1].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 w-3 bg-gray-400" />
              <div className="h-0.5 w-6 bg-gray-700 rounded" />
              <div className="h-0.5 w-5 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
          <div className="h-2 flex items-center px-1 rounded-sm" style={{ backgroundColor: color }}>
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
          {[0,1,2].map(i => (
            <div key={i} className={cn('flex gap-1 h-1.5 items-center px-0.5', i % 2 === 1 ? 'bg-gray-50' : '')}>
              <div className="h-0.5 flex-1 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-2 w-14 rounded-sm flex items-center px-1" style={{ backgroundColor: color }}>
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ThumbBold({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-shrink-0 p-2 flex items-center gap-1.5 bg-gray-900">
        <div className="w-5 h-5 rounded flex-shrink-0" style={{ backgroundColor: color }} />
        <div className="flex flex-col gap-0.5">
          <div className="h-1 w-9 bg-white rounded" />
          <div className="h-0.5 w-6 bg-white/40 rounded" />
        </div>
        <div className="flex-1" />
        <div className="flex flex-col items-end gap-0.5">
          <div className="h-0.5 w-4 bg-white/40 rounded" />
          <div className="h-1 w-8 bg-white/80 rounded" />
        </div>
      </div>
      <div className="flex-1 bg-white p-1.5 flex flex-col gap-0.5">
        <div className="flex gap-1">
          {[0,1].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-0.5">
              <div className="h-0.5 w-2 rounded" style={{ backgroundColor: color }} />
              <div className="h-0.5 w-7 bg-gray-700 rounded" />
              <div className="h-0.5 w-5 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="h-px bg-gray-100" />
        <div className="flex-1 flex flex-col gap-0.5">
          <div className="h-2 flex items-center px-1 rounded-sm bg-gray-900">
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-1 h-1.5 items-center px-0.5">
              <div className="h-0.5 flex-1 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-2 w-14 flex items-center px-1 gap-1 bg-gray-900 rounded-sm">
            <div className="h-0.5 w-4 rounded" style={{ backgroundColor: color + '80' }} />
            <div className="h-0.5 w-5 bg-white/80 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ThumbElegant({ color }: { color: string }) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="flex flex-shrink-0 p-2 gap-1.5 border-b border-gray-100">
        <div className="w-1 rounded-full self-stretch" style={{ backgroundColor: color }} />
        <div className="flex-1 flex justify-between items-start">
          <div className="flex flex-col gap-0.5">
            <div className="h-1.5 w-10 bg-gray-800 rounded" />
            <div className="h-0.5 w-6 bg-gray-400 rounded" />
            <div className="h-0.5 w-5 bg-gray-300 rounded" />
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <div className="h-0.5 w-4 bg-gray-400 rounded" />
            <div className="h-1.5 w-8 bg-gray-800 rounded" />
            <div className="h-1 w-8 rounded mt-0.5" style={{ background: `linear-gradient(to right, ${color}30, ${color}60)`, border: `1px solid ${color}40` }} />
          </div>
        </div>
      </div>
      <div className="flex-1 p-1.5 flex flex-col gap-0.5">
        <div className="flex gap-1">
          {[0,1].map(i => (
            <div key={i} className="flex-1 flex flex-col gap-0.5 pl-1" style={{ borderLeft: i === 1 ? `2px solid ${color}40` : 'none' }}>
              <div className="h-0.5 w-2 rounded" style={{ backgroundColor: color }} />
              <div className="h-0.5 w-7 bg-gray-700 rounded" />
              <div className="h-0.5 w-5 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-0.5 mt-0.5">
          <div className="h-2 flex items-center px-1 rounded-sm" style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }}>
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-1 h-1.5 items-center px-0.5" style={{ backgroundColor: i % 2 === 1 ? color + '08' : '' }}>
              <div className="h-0.5 flex-1 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-200 rounded" />
              <div className="h-0.5 w-4 bg-gray-300 rounded" />
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <div className="h-2 w-14 rounded-sm flex items-center px-1" style={{ background: `linear-gradient(to right, ${color}, ${color}bb)` }}>
            <div className="h-0.5 w-full bg-white/70 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}

const TEMPLATES: TemplateDef[] = [
  { id: 'classic',   name: 'Classic',   plan: 'STARTER',  Thumb: ThumbClassic },
  { id: 'minimal',   name: 'Minimal',   plan: 'STARTER',  Thumb: ThumbMinimal },
  { id: 'stripe',    name: 'Stripe',    plan: 'STARTER',  Thumb: ThumbStripe },
  { id: 'corporate', name: 'Corporate', plan: 'PRO',      Thumb: ThumbCorporate },
  { id: 'bold',      name: 'Bold',      plan: 'PRO',      Thumb: ThumbBold },
  { id: 'elegant',   name: 'Élégant',   plan: 'BUSINESS', Thumb: ThumbElegant },
]

// ── Live preview ──────────────────────────────────────────────────────────────

const SAMPLE = {
  numero: 'FAC-2026-0001',
  date: '15 juin 2026',
  echeance: '15 juillet 2026',
  emetteur: { nom: 'Votre Entreprise', email: 'contact@entreprise.ma', tel: '+212 522 123 456', ice: '001234567000089', adresse: '123 Bd Mohammed V, Casablanca' },
  client: { nom: 'Entreprise ABC', contact: 'Karim El Fassi', adresse: '45 Rue Hassan II, Rabat' },
  lignes: [
    { description: 'Prestation de conseil', qte: 10, pu: 500, total: 5000 },
    { description: 'Développement application', qte: 1, pu: 2000, total: 2000 },
    { description: 'Formation équipe', qte: 2, pu: 700, total: 1400 },
  ],
  totalHT: 8400,
  tva: 1680,
  totalTTC: 10080,
}

function fmt(v: number) {
  return new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' MAD'
}

function PreviewClassic({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {logoUrl
            ? <img src={logoUrl} alt="" className="h-10 w-auto object-contain" />
            : <div className="w-10 h-10 rounded flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ backgroundColor: color }}>{nom.charAt(0)}</div>
          }
          <div>
            <p className="text-sm font-bold text-gray-900">{nom}</p>
            <p className="text-xs text-gray-500">{SAMPLE.emetteur.email}</p>
            <p className="text-xs text-gray-500">{SAMPLE.emetteur.tel}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-[9px] font-bold text-gray-400 tracking-widest">FACTURE</p>
          <p className="text-lg font-black text-gray-900">{SAMPLE.numero}</p>
          <p className="text-[10px] text-gray-400">{SAMPLE.date}</p>
        </div>
      </div>
      <div className="border-t border-gray-200 mx-6" />
      <div className="px-6 py-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">ÉMETTEUR</p>
          <p className="font-semibold">{nom}</p>
          <p className="text-gray-500">{SAMPLE.emetteur.adresse}</p>
          <p className="text-gray-500">ICE : {SAMPLE.emetteur.ice}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">DESTINATAIRE</p>
          <p className="font-semibold">{SAMPLE.client.nom}</p>
          <p className="text-gray-500">{SAMPLE.client.contact}</p>
          <p className="text-gray-500">{SAMPLE.client.adresse}</p>
        </div>
      </div>
      <div className="px-6 pb-3">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-3 py-2 text-left text-[9px] font-bold text-white tracking-widest">DÉSIGNATION</th>
              <th className="px-3 py-2 text-center text-[9px] font-bold text-white tracking-widest w-8">QTÉ</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold text-white tracking-widest w-16">P.U.</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold text-white tracking-widest w-20">TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 1 ? '#f9fafb' : '' }}>
                <td className="px-3 py-1.5 text-gray-900 font-medium border-b border-gray-100">{l.description}</td>
                <td className="px-3 py-1.5 text-center text-gray-500 border-b border-gray-100">{l.qte}</td>
                <td className="px-3 py-1.5 text-right text-gray-500 border-b border-gray-100">{fmt(l.pu)}</td>
                <td className="px-3 py-1.5 text-right font-bold text-gray-900 border-b border-gray-100">{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <div className="w-48 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between bg-gray-900 text-white font-bold px-3 py-2 mt-1">
            <span>TOTAL TTC</span><span>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-[9px] text-gray-400 text-center">Généré par <strong>Sayerli</strong> · Logiciel de gestion pour PME marocaines</p>
      </div>
    </div>
  )
}

function PreviewMinimal({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div style={{ height: 3, backgroundColor: color }} />
      <div className="px-6 pt-4 pb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {logoUrl
            ? <img src={logoUrl} alt="" className="h-8 w-auto object-contain" />
            : <div className="w-8 h-8 rounded flex items-center justify-center text-white font-black flex-shrink-0" style={{ backgroundColor: color }}>{nom.charAt(0)}</div>
          }
          <div>
            <p className="text-sm font-bold text-gray-900">{nom}</p>
            <p className="text-xs text-gray-400">{SAMPLE.emetteur.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-400 tracking-widest">FACTURE</p>
          <p className="text-base font-black text-gray-900">{SAMPLE.numero}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 mx-6" />
      <div className="px-6 py-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}> ÉMETTEUR</p>
          <p className="font-semibold text-gray-900">{nom}</p>
          <p className="text-gray-400">{SAMPLE.emetteur.adresse}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}>DESTINATAIRE</p>
          <p className="font-semibold text-gray-900">{SAMPLE.client.nom}</p>
          <p className="text-gray-400">{SAMPLE.client.adresse}</p>
        </div>
      </div>
      <div className="border-t border-gray-100 mx-6" />
      <div className="px-6 pb-3 pt-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="pb-1.5 text-left text-[9px] font-bold text-gray-500 tracking-widest">DÉSIGNATION</th>
              <th className="pb-1.5 text-center text-[9px] font-bold text-gray-500 tracking-widest w-8">QTÉ</th>
              <th className="pb-1.5 text-right text-[9px] font-bold text-gray-500 tracking-widest w-20">TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="py-1.5 text-gray-800">{l.description}</td>
                <td className="py-1.5 text-center text-gray-400">{l.qte}</td>
                <td className="py-1.5 text-right text-gray-800">{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <div className="w-44 text-xs space-y-0.5">
          <div className="flex justify-between text-gray-500"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between text-gray-500"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between font-bold pt-1 border-t border-gray-200" style={{ color }}>
            <span>TOTAL TTC</span><span>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewStripe({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div className="px-6 py-3 flex items-center justify-between" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-2">
          {logoUrl
            ? <img src={logoUrl} alt="" className="h-7 w-auto object-contain" />
            : <div className="w-7 h-7 rounded bg-white/20 flex items-center justify-center text-white font-black flex-shrink-0">{nom.charAt(0)}</div>
          }
          <p className="text-sm font-bold text-white">{nom}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/60 tracking-widest">FACTURE</p>
          <p className="text-sm font-black text-white">{SAMPLE.numero}</p>
        </div>
      </div>
      <div className="px-6 py-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">ÉMETTEUR</p>
          <p className="font-semibold text-gray-900">{nom}</p>
          <p className="text-gray-400">{SAMPLE.emetteur.ice && `ICE : ${SAMPLE.emetteur.ice}`}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">DESTINATAIRE</p>
          <p className="font-semibold text-gray-900">{SAMPLE.client.nom}</p>
          <p className="text-gray-400">{SAMPLE.client.adresse}</p>
        </div>
      </div>
      <div className="px-6 pb-3">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: color + '18' }}>
              <th className="px-3 py-2 text-left text-[9px] font-bold tracking-widest" style={{ color }}>DÉSIGNATION</th>
              <th className="px-3 py-2 text-center text-[9px] font-bold tracking-widest w-8" style={{ color }}>QTÉ</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold tracking-widest w-20" style={{ color }}>TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-3 py-1.5 text-gray-800 font-medium">{l.description}</td>
                <td className="px-3 py-1.5 text-center text-gray-500">{l.qte}</td>
                <td className="px-3 py-1.5 text-right font-bold text-gray-900">{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <div className="w-44 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between font-bold px-3 py-2 mt-1 text-white rounded" style={{ backgroundColor: color }}>
            <span>TOTAL TTC</span><span>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewCorporate({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div className="px-6 py-5 flex items-start justify-between" style={{ backgroundColor: color }}>
        <div className="flex items-center gap-3">
          {logoUrl
            ? <img src={logoUrl} alt="" className="h-10 w-auto object-contain rounded" />
            : <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center text-white font-black text-lg flex-shrink-0">{nom.charAt(0)}</div>
          }
          <div>
            <p className="text-sm font-bold text-white">{nom}</p>
            <p className="text-xs text-white/70">{SAMPLE.emetteur.email}</p>
            <p className="text-xs text-white/70">{SAMPLE.emetteur.adresse}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-white/60 tracking-widest">FACTURE</p>
          <p className="text-lg font-black text-white">{SAMPLE.numero}</p>
          <p className="text-[10px] text-white/60">{SAMPLE.date}</p>
        </div>
      </div>
      <div className="px-6 py-3 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">ÉMETTEUR</p>
          <p className="font-semibold text-gray-900">{nom}</p>
          <p className="text-gray-500">{SAMPLE.emetteur.ice && `ICE : ${SAMPLE.emetteur.ice}`}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold text-gray-400 tracking-widest mb-1">DESTINATAIRE</p>
          <p className="font-semibold text-gray-900">{SAMPLE.client.nom}</p>
          <p className="text-gray-500">{SAMPLE.client.contact}</p>
        </div>
      </div>
      <div className="px-6 pb-3">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: color }}>
              <th className="px-3 py-2 text-left text-[9px] font-bold text-white tracking-widest">DÉSIGNATION</th>
              <th className="px-3 py-2 text-center text-[9px] font-bold text-white tracking-widest w-8">QTÉ</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold text-white tracking-widest w-20">TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} className={cn('border-b border-gray-100', i % 2 === 1 ? 'bg-gray-50' : '')}>
                <td className="px-3 py-1.5 text-gray-900 font-medium">{l.description}</td>
                <td className="px-3 py-1.5 text-center text-gray-500">{l.qte}</td>
                <td className="px-3 py-1.5 text-right font-bold text-gray-900">{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <div className="w-44 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-600"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between font-bold px-3 py-2 mt-1 text-white rounded" style={{ backgroundColor: color }}>
            <span>TOTAL TTC</span><span>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewBold({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div className="px-6 py-4 flex items-center gap-4 bg-gray-900">
        {logoUrl
          ? <img src={logoUrl} alt="" className="h-10 w-auto object-contain rounded" />
          : <div className="w-10 h-10 rounded flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ backgroundColor: color }}>{nom.charAt(0)}</div>
        }
        <div className="flex-1">
          <p className="text-sm font-bold text-white">{nom}</p>
          <p className="text-xs text-gray-400">{SAMPLE.emetteur.email}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-500 tracking-widest">FACTURE</p>
          <p className="text-lg font-black text-white">{SAMPLE.numero}</p>
        </div>
      </div>
      <div className="px-6 py-3 grid grid-cols-2 gap-4 text-xs border-b border-gray-100">
        <div>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}>ÉMETTEUR</p>
          <p className="font-semibold text-gray-900">{nom}</p>
          <p className="text-gray-500">{SAMPLE.emetteur.adresse}</p>
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}>DESTINATAIRE</p>
          <p className="font-semibold text-gray-900">{SAMPLE.client.nom}</p>
          <p className="text-gray-500">{SAMPLE.client.adresse}</p>
        </div>
      </div>
      <div className="px-6 pb-3 pt-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-3 py-2 text-left text-[9px] font-bold text-white tracking-widest">DÉSIGNATION</th>
              <th className="px-3 py-2 text-center text-[9px] font-bold text-white tracking-widest w-8">QTÉ</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold text-white tracking-widest w-20">TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-3 py-1.5 text-gray-900 font-medium">{l.description}</td>
                <td className="px-3 py-1.5 text-center text-gray-500">{l.qte}</td>
                <td className="px-3 py-1.5 text-right font-bold" style={{ color }}>{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <div className="w-44 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-500"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-500"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between font-bold px-3 py-2 mt-1 bg-gray-900 text-white">
            <span>TOTAL TTC</span><span style={{ color }}>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function PreviewElegant({ color, logoUrl, companyName }: { color: string; logoUrl?: string; companyName?: string }) {
  const nom = companyName || SAMPLE.emetteur.nom
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm text-gray-900 font-sans">
      <div className="flex border-b border-gray-100">
        <div className="w-1.5 flex-shrink-0" style={{ background: `linear-gradient(to bottom, ${color}, ${color}88)` }} />
        <div className="flex-1 px-5 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {logoUrl
              ? <img src={logoUrl} alt="" className="h-10 w-auto object-contain" />
              : <div className="w-10 h-10 rounded border-2 flex items-center justify-center font-black text-lg flex-shrink-0" style={{ borderColor: color, color }}>{nom.charAt(0)}</div>
            }
            <div>
              <p className="text-sm font-bold text-gray-900">{nom}</p>
              <p className="text-xs text-gray-500">{SAMPLE.emetteur.email}</p>
              <p className="text-xs text-gray-500">{SAMPLE.emetteur.adresse}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold tracking-widest mb-0.5" style={{ color }}>FACTURE</p>
            <p className="text-lg font-black text-gray-900">{SAMPLE.numero}</p>
            <div className="inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1" style={{ backgroundColor: color + '18', color }}>
              {SAMPLE.date}
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-3 grid grid-cols-2 gap-4 text-xs border-b border-gray-100">
        <div className="pl-2" style={{ borderLeft: `2px solid ${color}40` }}>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}>ÉMETTEUR</p>
          <p className="font-semibold text-gray-900">{nom}</p>
          <p className="text-gray-500">{SAMPLE.emetteur.ice && `ICE : ${SAMPLE.emetteur.ice}`}</p>
        </div>
        <div className="pl-2" style={{ borderLeft: `2px solid ${color}40` }}>
          <p className="text-[9px] font-bold tracking-widest mb-1" style={{ color }}>DESTINATAIRE</p>
          <p className="font-semibold text-gray-900">{SAMPLE.client.nom}</p>
          <p className="text-gray-500">{SAMPLE.client.contact}</p>
        </div>
      </div>
      <div className="px-5 pb-3 pt-2">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }}>
              <th className="px-3 py-2 text-left text-[9px] font-bold text-white tracking-widest">DÉSIGNATION</th>
              <th className="px-3 py-2 text-center text-[9px] font-bold text-white tracking-widest w-8">QTÉ</th>
              <th className="px-3 py-2 text-right text-[9px] font-bold text-white tracking-widest w-20">TOTAL HT</th>
            </tr>
          </thead>
          <tbody>
            {SAMPLE.lignes.map((l, i) => (
              <tr key={i} className="border-b border-gray-100" style={{ backgroundColor: i % 2 === 1 ? color + '06' : '' }}>
                <td className="px-3 py-1.5 text-gray-900 font-medium">{l.description}</td>
                <td className="px-3 py-1.5 text-center text-gray-500">{l.qte}</td>
                <td className="px-3 py-1.5 text-right font-bold text-gray-900">{fmt(l.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 pb-5 flex justify-end">
        <div className="w-44 text-xs">
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-500"><span>Sous-total HT</span><span>{fmt(SAMPLE.totalHT)}</span></div>
          <div className="flex justify-between py-1 border-b border-gray-100 text-gray-500"><span>TVA 20%</span><span>{fmt(SAMPLE.tva)}</span></div>
          <div className="flex justify-between font-bold px-3 py-2 mt-1 text-white" style={{ background: `linear-gradient(to right, ${color}, ${color}cc)` }}>
            <span>TOTAL TTC</span><span>{fmt(SAMPLE.totalTTC)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const PREVIEW_MAP: Record<TemplateId, (props: { color: string; logoUrl?: string; companyName?: string }) => React.ReactElement> = {
  classic:   PreviewClassic,
  minimal:   PreviewMinimal,
  stripe:    PreviewStripe,
  corporate: PreviewCorporate,
  bold:      PreviewBold,
  elegant:   PreviewElegant,
}

// ── Main component ────────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { color: '#7c3aed', name: 'Violet' },
  { color: '#2563eb', name: 'Bleu' },
  { color: '#0f172a', name: 'Ardoise' },
  { color: '#16a34a', name: 'Vert' },
  { color: '#dc2626', name: 'Rouge' },
  { color: '#ea580c', name: 'Orange' },
  { color: '#0891b2', name: 'Cyan' },
  { color: '#111827', name: 'Noir' },
]

interface TemplateChooserProps {
  userPlan: string
  selectedTemplate: string
  selectedColor: string
  onTemplateChange: (t: string) => void
  onColorChange: (c: string) => void
  logoUrl?: string
  companyName?: string
}

export default function TemplateChooser({
  userPlan,
  selectedTemplate,
  selectedColor,
  onTemplateChange,
  onColorChange,
  logoUrl,
  companyName,
}: TemplateChooserProps) {
  const [upgradeTarget, setUpgradeTarget] = useState<TemplateDef | null>(null)

  const handleSelect = (tpl: TemplateDef) => {
    if (!canUse(userPlan, tpl.plan)) {
      setUpgradeTarget(tpl)
      return
    }
    onTemplateChange(tpl.id)
  }

  const Preview = PREVIEW_MAP[(selectedTemplate as TemplateId) ?? 'classic'] ?? PreviewClassic

  return (
    <div className="space-y-6">

      {/* ── Template grid + live preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Template grid */}
        <div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Modèle de document</p>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map(tpl => {
              const locked = !canUse(userPlan, tpl.plan)
              const selected = selectedTemplate === tpl.id
              const planMeta = PLAN_LABEL[tpl.plan]
              return (
                <button
                  key={tpl.id}
                  onClick={() => handleSelect(tpl)}
                  className={cn(
                    'relative rounded-xl border-2 overflow-hidden transition-all text-left group',
                    selected
                      ? 'border-primary-500 shadow-md shadow-primary-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-600',
                    locked && 'opacity-60',
                  )}
                  style={{ aspectRatio: '4/5' }}
                >
                  {/* Thumbnail */}
                  <div className="absolute inset-0 overflow-hidden">
                    <tpl.Thumb color={selectedColor} />
                  </div>

                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shadow">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Lock overlay */}
                  {locked && (
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white dark:bg-slate-800 rounded-lg px-2 py-1 shadow flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Upgrade</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom label */}
                  <div className="absolute bottom-0 inset-x-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-2 py-1 flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate">{tpl.name}</span>
                    {tpl.plan !== 'STARTER' && (
                      <span className={cn('text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0', planMeta.color)}>
                        {planMeta.label}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Aperçu en direct</p>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 overflow-auto max-h-[420px]">
            <Preview color={selectedColor} logoUrl={logoUrl} companyName={companyName} />
          </div>
        </div>
      </div>

      {/* ── Color picker ── */}
      <div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Couleur principale</p>
        <div className="flex flex-wrap gap-2 items-center">
          {PRESET_COLORS.map(c => (
            <button
              key={c.color}
              onClick={() => onColorChange(c.color)}
              title={c.name}
              className="w-8 h-8 rounded-full transition-all hover:scale-110 relative flex items-center justify-center"
              style={{ backgroundColor: c.color }}
            >
              {selectedColor === c.color && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
          {/* Custom color */}
          <div className="relative w-8 h-8">
            <input
              type="color"
              value={selectedColor}
              onChange={e => onColorChange(e.target.value)}
              className="w-8 h-8 rounded-full border-0 cursor-pointer p-0 opacity-0 absolute inset-0"
            />
            <div
              className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-center justify-center pointer-events-none"
              style={{ backgroundColor: selectedColor }}
            >
              {!PRESET_COLORS.find(c => c.color === selectedColor) && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono ml-1">{selectedColor}</span>
        </div>
      </div>

      <FeaturePlanModal
        open={!!upgradeTarget}
        onClose={() => setUpgradeTarget(null)}
        featureName={upgradeTarget ? `Le modèle ${upgradeTarget.name}` : ''}
        requiredPlan={upgradeTarget?.plan as 'PRO' | 'BUSINESS' ?? 'PRO'}
        title="Modèle non inclus dans votre plan"
      />
    </div>
  )
}
