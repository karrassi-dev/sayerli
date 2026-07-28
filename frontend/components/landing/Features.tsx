'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Users, FileText, Truck, Receipt, CreditCard, BarChart3,
  UserCog, Globe, BookOpen, Bell, Check, Search, TrendingUp,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const INTERVAL_MS = 4000

const FEATURES = [
  { key: 'crm',           icon: Users,      color: '#3b82f6', num: '01' },
  { key: 'devis',         icon: FileText,   color: '#14b8a6', num: '02' },
  { key: 'bonsLivraison', icon: Truck,      color: '#f59e0b', num: '03' },
  { key: 'factures',      icon: Receipt,    color: '#8b5cf6', num: '04' },
  { key: 'paiements',     icon: CreditCard, color: '#f97316', num: '05' },
  { key: 'analytics',     icon: BarChart3,  color: '#ec4899', num: '06' },
  { key: 'team',          icon: UserCog,    color: '#94a3b8', num: '07' },
  { key: 'portal',        icon: Globe,      color: '#6366f1', num: '08' },
  { key: 'catalogue',     icon: BookOpen,   color: '#22c55e', num: '09' },
  { key: 'relances',      icon: Bell,       color: '#ef4444', num: '10' },
]

/* ── Always-dark product mock per feature ─────────────────────────── */
function FeatureMock({ idx }: { idx: number }) {
  const d = {
    text:   'rgba(255,255,255,0.85)',
    muted:  'rgba(255,255,255,0.38)',
    dim:    'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.08)',
  }

  const mocks = [
    /* 01 — CRM Clients */
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: d.muted }} />
        <span className="text-xs" style={{ color: d.muted }}>Rechercher un client...</span>
      </div>
      {[
        { name: 'Atlas Marketing',  type: 'ENTREPRISE', ca: '84 200 MAD', ok: true,  color: '#3b82f6' },
        { name: 'Hassan Oujda',     type: 'FREELANCE',  ca: '12 400 MAD', ok: true,  color: '#14b8a6' },
        { name: 'Restaurant Atlas', type: 'ENTREPRISE', ca: '7 800 MAD',  ok: false, color: '#f97316' },
      ].map(({ name, type, ca, ok, color }) => (
        <div key={name} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black" style={{ background: `${color}20`, color }}>
              {name[0]}
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: d.text }}>{name}</div>
              <div className="text-[10px] mt-0.5 px-1.5 py-0.5 rounded-full inline-block" style={{ background: `${color}18`, color }}>{type}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: d.text }}>{ca}</div>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              {ok ? <Check className="w-3 h-3" style={{ color: '#10b981' }} /> : <span className="text-[10px]" style={{ color: '#f59e0b' }}>⚠</span>}
            </div>
          </div>
        </div>
      ))}
      <button className="w-full py-2 rounded-xl text-xs font-bold text-white mt-1" style={{ background: '#3b82f6' }}>
        + Nouveau client
      </button>
    </div>,

    /* 02 — Devis */
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono mb-0.5" style={{ color: d.muted }}>DEV-2026-0052</div>
          <div className="text-sm font-bold" style={{ color: d.text }}>Atlas Marketing</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(20,184,166,0.15)', color: '#2dd4bf' }}>Brouillon</span>
      </div>
      {[
        { desc: 'Design logo',        prix: '5 000' },
        { desc: 'Site vitrine',       prix: '12 000' },
        { desc: 'Réseaux sociaux ×3', prix: '7 000' },
      ].map(({ desc, prix }) => (
        <div key={desc} className="flex justify-between text-xs py-1.5" style={{ borderBottom: `1px solid ${d.border}` }}>
          <span style={{ color: 'rgba(255,255,255,0.62)' }}>{desc}</span>
          <span className="font-semibold" style={{ color: d.text }}>{prix} MAD</span>
        </div>
      ))}
      <div className="flex justify-between pt-1 items-center">
        <span className="text-xs" style={{ color: d.muted }}>Total TTC</span>
        <span className="text-base font-black" style={{ color: '#2dd4bf' }}>24 000 MAD</span>
      </div>
      <div className="flex gap-2 pt-1">
        <button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#25d366', color: '#fff' }}>📱 WhatsApp</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: d.dim, color: 'rgba(255,255,255,0.6)', border: `1px solid ${d.border}` }}>✉ Email</button>
      </div>
    </div>,

    /* 03 — Bons de livraison */
    <div className="space-y-2.5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[10px] font-mono mb-0.5" style={{ color: d.muted }}>BL-2026-0018</div>
          <div className="text-sm font-bold" style={{ color: d.text }}>Atlas Marketing</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>Envoyé</span>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: d.muted }}>Articles</div>
      {['Design logo', 'Site vitrine', 'Réseaux sociaux'].map((item, i) => (
        <div key={item} className="flex items-center gap-2.5 py-1.5" style={{ borderBottom: `1px solid ${d.border}` }}>
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
            <span className="text-[9px] font-bold" style={{ color: '#fbbf24' }}>{i + 1}</span>
          </div>
          <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
          <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#10b981' }} />
        </div>
      ))}
      <div className="flex gap-2 mt-1">
        <button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#f59e0b', color: '#fff' }}>✓ Marquer livré</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>→ Facture</button>
      </div>
    </div>,

    /* 04 — Factures */
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="text-[10px] font-mono mb-0.5" style={{ color: d.muted }}>FAC-2026-0031</div>
          <div className="text-sm font-bold" style={{ color: d.text }}>Atlas Marketing</div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>PARTIELLE</span>
      </div>
      <div className="rounded-xl p-3 space-y-2" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
        {[
          { l: 'Total TTC',     v: '24 000 MAD', c: d.text    },
          { l: 'Remise',        v: '−2 000 MAD', c: '#f59e0b' },
          { l: 'Payé',          v: '14 000 MAD', c: '#10b981' },
          { l: 'Reste à payer', v: '8 000 MAD',  c: '#ef4444' },
        ].map(({ l, v, c }) => (
          <div key={l} className="flex justify-between text-xs">
            <span style={{ color: d.muted }}>{l}</span>
            <span className="font-bold" style={{ color: c }}>{v}</span>
          </div>
        ))}
      </div>
      <div>
        <div className="flex justify-between text-[10px] mb-1.5" style={{ color: d.muted }}>
          <span>Progression paiement</span><span>58%</span>
        </div>
        <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div className="h-1.5 rounded-full" style={{ width: '58%', background: 'linear-gradient(to right, #8b5cf6, #a78bfa)' }} />
        </div>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 py-2 rounded-xl text-xs font-bold" style={{ background: '#8b5cf6', color: '#fff' }}>↓ PDF</button>
        <button className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{ background: d.dim, color: 'rgba(255,255,255,0.6)', border: `1px solid ${d.border}` }}>📱 Envoyer</button>
      </div>
    </div>,

    /* 05 — Paiements */
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold" style={{ color: d.text }}>Paiements récents</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.15)', color: '#fb923c' }}>Ce mois</span>
      </div>
      {[
        { client: 'Atlas Marketing', amount: '14 000 MAD', method: 'Virement',    done: true  },
        { client: 'Hassan Oujda',    amount: '5 200 MAD',  method: 'Cash',        done: true  },
        { client: 'Rest. Atlas',     amount: '7 800 MAD',  method: 'En attente',  done: false },
      ].map(({ client, amount, method, done }) => (
        <div key={client} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
          <div>
            <div className="text-xs font-semibold" style={{ color: d.text }}>{client}</div>
            <div className="text-[10px] mt-0.5" style={{ color: d.muted }}>{method}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold" style={{ color: done ? '#10b981' : '#f59e0b' }}>{amount}</div>
            <div className="text-[10px] mt-0.5" style={{ color: done ? '#10b981' : '#f59e0b' }}>
              {done ? '✓ Encaissé' : '⏳ Attente'}
            </div>
          </div>
        </div>
      ))}
      <div className="rounded-xl px-3 py-2.5 mt-1" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
        <div className="flex justify-between text-xs">
          <span style={{ color: d.muted }}>Total encaissé</span>
          <span className="font-black" style={{ color: '#fb923c' }}>19 200 MAD</span>
        </div>
      </div>
    </div>,

    /* 06 — Analytics */
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        {[
          { l: 'CA ce mois',    v: '84 200 MAD', c: '#ec4899' },
          { l: 'Recouvrement',  v: '94%',        c: '#06b6d4' },
          { l: 'En attente',    v: '12 400 MAD', c: '#f59e0b' },
          { l: 'Clients actifs',v: '47',          c: '#10b981' },
        ].map(({ l, v, c }) => (
          <div key={l} className="rounded-xl p-2.5" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
            <div className="text-[10px] mb-1" style={{ color: d.muted }}>{l}</div>
            <div className="text-sm font-black" style={{ color: c }}>{v}</div>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-1 h-12 px-1">
        {[38, 52, 41, 68, 55, 84].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? 'linear-gradient(to top, #ec4899, #f472b6)' : 'rgba(236,72,153,0.22)' }} />
        ))}
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)' }}>
        <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#ec4899' }} />
        <span className="text-xs font-semibold" style={{ color: '#ec4899' }}>+18.4% vs mois dernier</span>
      </div>
    </div>,

    /* 07 — Équipe */
    <div className="space-y-2.5">
      <div className="text-xs font-bold mb-3" style={{ color: d.text }}>Membres de l&apos;équipe</div>
      {[
        { initials: 'KH', name: 'Karrassi Hamza', role: 'Admin',      color: '#94a3b8', online: true  },
        { initials: 'SI', name: 'Sara Idrissi',    role: 'Commercial', color: '#14b8a6', online: false },
        { initials: 'AB', name: 'Ahmed Benali',    role: 'Comptable',  color: '#8b5cf6', online: true  },
      ].map(({ initials, name, role, color, online }) => (
        <div key={name} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: `${color}20`, color }}>
              {initials}
            </div>
            <div>
              <div className="text-xs font-semibold" style={{ color: d.text }}>{name}</div>
              <div className="text-[10px] mt-0.5 px-1.5 py-0.5 rounded-full inline-block" style={{ background: `${color}18`, color }}>{role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: online ? '#10b981' : 'rgba(255,255,255,0.2)' }} />
            <span className="text-[10px]" style={{ color: online ? '#10b981' : d.muted }}>{online ? 'En ligne' : 'Hors ligne'}</span>
          </div>
        </div>
      ))}
      <button className="w-full py-2 rounded-xl text-xs font-semibold mt-1" style={{ background: 'rgba(148,163,184,0.15)', color: '#cbd5e1', border: '1px solid rgba(148,163,184,0.25)' }}>
        + Inviter un membre
      </button>
    </div>,

    /* 08 — Portail client */
    <div className="space-y-2.5">
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0" style={{ background: '#6366f1', color: '#fff' }}>S</div>
        <div>
          <div className="text-xs font-black" style={{ color: '#818cf8' }}>Sayerli</div>
          <div className="text-[10px]" style={{ color: d.muted }}>Bonjour Hassan Oujda 👋</div>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: d.muted }}>Devis en attente</div>
      <div className="rounded-xl p-3" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
        <div className="flex justify-between items-center mb-2">
          <div>
            <div className="text-[10px] font-mono" style={{ color: d.muted }}>DEV-2026-0052</div>
            <div className="text-xs font-bold" style={{ color: d.text }}>24 000 MAD</div>
          </div>
          <button className="px-3 py-1.5 rounded-xl text-[10px] font-bold" style={{ background: '#6366f1', color: '#fff' }}>Accepter ✓</button>
        </div>
        <div className="text-[10px]" style={{ color: d.muted }}>Design logo · Site vitrine · Réseaux</div>
      </div>
      <div className="flex justify-between items-center px-3 py-2.5 rounded-xl" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
        <div>
          <div className="text-[10px] font-mono" style={{ color: d.muted }}>FAC-2026-0031</div>
          <div className="text-xs font-semibold" style={{ color: d.text }}>14 000 MAD payée</div>
        </div>
        <Check className="w-4 h-4" style={{ color: '#10b981' }} />
      </div>
    </div>,

    /* 09 — Catalogue */
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-1" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: d.muted }} />
        <span className="text-xs" style={{ color: d.muted }}>Rechercher un produit...</span>
      </div>
      {[
        { name: 'Design logo',  type: 'SERVICE', prix: '5 000 MAD',  unite: 'unité',  color: '#22c55e' },
        { name: 'Dév. web',     type: 'SERVICE', prix: '15 000 MAD', unite: 'projet', color: '#22c55e' },
        { name: 'Impression',   type: 'PRODUIT', prix: '250 MAD',    unite: 'page',   color: '#14b8a6' },
      ].map(({ name, type, prix, unite, color }) => (
        <div key={name} className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: d.dim, border: `1px solid ${d.border}` }}>
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: `${color}18`, color }}>{type}</div>
            <span className="text-xs font-semibold truncate" style={{ color: d.text }}>{name}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color }}>{prix}</div>
              <div className="text-[9px]" style={{ color: d.muted }}>/{unite}</div>
            </div>
            <button className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black" style={{ background: `${color}20`, color }}>+</button>
          </div>
        </div>
      ))}
      <button className="w-full py-2 rounded-xl text-xs font-bold mt-1" style={{ background: '#22c55e', color: '#fff' }}>
        Ajouter au devis
      </button>
    </div>,

    /* 10 — Relances */
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <span className="text-xs font-semibold" style={{ color: d.text }}>Relances automatiques</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
          <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Actif</span>
        </div>
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: d.muted }}>Planification</div>
      <div className="flex gap-2">
        {[{ l: 'J−3' }, { l: 'J−0' }, { l: 'J+7' }].map(({ l }) => (
          <div key={l} className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
            <div className="text-xs font-bold" style={{ color: '#10b981' }}>{l}</div>
            <Check className="w-3 h-3 mx-auto mt-0.5" style={{ color: '#10b981' }} />
          </div>
        ))}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: d.muted }}>Envois récents</div>
      {[
        { client: 'Atlas Marketing', time: 'Hier 08:00',    done: true  },
        { client: 'Hassan Oujda',    time: "Auj. 08:00",    done: true  },
        { client: 'Rest. Atlas',     time: 'Prévu demain',  done: false },
      ].map(({ client, time, done }) => (
        <div key={client} className="flex justify-between items-center text-xs py-1.5" style={{ borderBottom: `1px solid ${d.border}` }}>
          <span style={{ color: 'rgba(255,255,255,0.65)' }}>{client}</span>
          <div className="flex items-center gap-1.5">
            <span style={{ color: d.muted }}>{time}</span>
            {done ? <Check className="w-3 h-3" style={{ color: '#10b981' }} /> : <span style={{ color: '#f59e0b' }}>⏳</span>}
          </div>
        </div>
      ))}
    </div>,
  ]

  return mocks[idx] ?? mocks[0]
}

/* ── Main component ─────────────────────────────────────────────────── */
export function Features() {
  const { t } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)
  const [active, setActive] = useState(0)
  const [progKey, setProgKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const advance = useCallback(() => {
    setActive(p => (p + 1) % FEATURES.length)
    setProgKey(k => k + 1)
  }, [])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(advance, INTERVAL_MS)
  }, [advance])

  useEffect(() => {
    resetTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [resetTimer])

  const selectFeature = (i: number) => {
    setActive(i)
    setProgKey(k => k + 1)
    resetTimer()
  }

  const feat = FEATURES[active]
  const FeatIcon = feat.icon

  return (
    <section
      id="features"
      ref={ref}
      className="relative py-16 sm:py-24 overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #08090f, #0d0f18)' }}
    >
      {/* Background glow shifts with active feature */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full opacity-20"
          style={{ background: `radial-gradient(ellipse, ${feat.color}40 0%, transparent 70%)`, transition: 'background 0.6s ease' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className={cn('text-center mb-12 sm:mb-16 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span
            className="inline-block px-4 py-1.5 rounded-full border text-sm font-semibold mb-5"
            style={{ background: `${feat.color}15`, borderColor: `${feat.color}35`, color: feat.color, transition: 'all 0.4s ease' }}
          >
            {t('features.badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('features.sub')}
          </p>
        </div>

        {/* ── Mobile: horizontal scrollable pills ── */}
        <div className="lg:hidden mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
          <div className="flex gap-2 w-max">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <button
                  key={f.key}
                  onClick={() => selectFeature(i)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0"
                  style={active === i
                    ? { background: `${f.color}20`, border: `1px solid ${f.color}45`, color: f.color }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{f.num}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={cn('transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">

            {/* ── Left: feature list (desktop) ── */}
            <div className="hidden lg:flex flex-col gap-0.5 w-[272px] flex-shrink-0">
              {FEATURES.map((f, i) => {
                const Icon = f.icon
                const isActive = active === i
                return (
                  <button
                    key={f.key}
                    onClick={() => selectFeature(i)}
                    className="group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left transition-all duration-200 w-full"
                    style={isActive
                      ? { background: `${f.color}12`, border: `1px solid ${f.color}30` }
                      : { background: 'transparent', border: '1px solid transparent' }
                    }
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={isActive
                        ? { background: f.color, boxShadow: `0 0 12px ${f.color}50` }
                        : { background: 'rgba(255,255,255,0.06)' }
                      }
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold mb-0.5" style={{ color: isActive ? f.color : 'rgba(255,255,255,0.25)' }}>
                        {f.num}
                      </div>
                      <div className="text-sm font-semibold leading-snug truncate" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }}>
                        {t(`features.${f.key}.title`)}
                      </div>
                    </div>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-all duration-200"
                      style={{ background: isActive ? f.color : 'transparent' }}
                    />
                  </button>
                )
              })}
            </div>

            {/* ── Right: mock + description ── */}
            <div className="flex-1 w-full min-w-0">
              <div className="flex flex-col sm:flex-row gap-5">

                {/* Product mock */}
                <div className="w-full sm:w-[280px] lg:w-[300px] flex-shrink-0">
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: '#0f1117',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 40px ${feat.color}12`,
                      transition: 'box-shadow 0.5s ease',
                    }}
                  >
                    {/* macOS chrome */}
                    <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#181a22', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
                      <div className="flex-1 mx-2 rounded px-2 py-0.5 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>sayerli.com/dashboard</span>
                      </div>
                    </div>

                    {/* Feature content — key triggers step-in animation */}
                    <div className="p-4 min-h-[280px] flex flex-col">
                      <div key={active} className="step-in flex-1">
                        <FeatureMock idx={active} />
                      </div>
                    </div>

                    {/* Auto-progress bar */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', height: 2 }}>
                      <div
                        key={progKey}
                        className="prog-fill h-full rounded-full"
                        style={{ background: feat.color, transition: 'background 0.4s ease' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Step info panel */}
                <div className="hidden sm:flex flex-col justify-center py-2 sm:py-4">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-4 w-fit"
                    style={{ background: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}30`, transition: 'all 0.4s ease' }}
                  >
                    <FeatIcon className="w-3 h-3" />
                    {feat.num} / {String(FEATURES.length).padStart(2, '0')}
                  </div>

                  <h3
                    key={`title-${active}`}
                    className="step-in text-xl sm:text-2xl lg:text-3xl font-black text-white mb-3 leading-tight"
                  >
                    {t(`features.${feat.key}.title`)}
                  </h3>

                  <p
                    key={`desc-${active}`}
                    className="step-in text-sm sm:text-base text-slate-400 leading-relaxed mb-6 max-w-sm"
                  >
                    {t(`features.${feat.key}.desc`)}
                  </p>

                  {/* Dot pagination */}
                  <div className="flex gap-1.5 flex-wrap">
                    {FEATURES.map((f, i) => (
                      <button
                        key={f.key}
                        onClick={() => selectFeature(i)}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: active === i ? 20 : 8,
                          height: 8,
                          background: active === i ? feat.color : 'rgba(255,255,255,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: current feature info (below mock) ── */}
        <div className="sm:hidden mt-5">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold mb-3 w-fit"
            style={{ background: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}30` }}
          >
            <FeatIcon className="w-3 h-3" />
            {feat.num} / {String(FEATURES.length).padStart(2, '0')}
          </div>
          <h3 key={`m-title-${active}`} className="step-in text-xl font-black text-white mb-2 leading-tight">
            {t(`features.${feat.key}.title`)}
          </h3>
          <p key={`m-desc-${active}`} className="step-in text-sm text-slate-400 leading-relaxed mb-4">
            {t(`features.${feat.key}.desc`)}
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {FEATURES.map((f, i) => (
              <button
                key={f.key}
                onClick={() => selectFeature(i)}
                className="rounded-full transition-all duration-300"
                style={{ width: active === i ? 20 : 8, height: 8, background: active === i ? feat.color : 'rgba(255,255,255,0.15)' }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
