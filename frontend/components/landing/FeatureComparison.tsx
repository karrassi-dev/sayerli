'use client'

import {
  AlertTriangle, ArrowRight,
  FileSpreadsheet, Clock, FileText, EyeOff, Users, MessageCircle,
  LayoutDashboard, CreditCard, FileCheck, BarChart3, Globe, Bell,
  Check, Zap, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { useTranslation } from '@/hooks/useTranslation'

const BEFORE_ICONS = [FileSpreadsheet, Clock, FileText, EyeOff, Users, MessageCircle]
const AFTER_ICONS  = [LayoutDashboard, CreditCard, FileCheck, BarChart3, Globe, Bell]

// ── Before card ───────────────────────────────────────────────────────
function BeforeCard({ items, visible }: { items: string[]; visible: boolean }) {
  const { t } = useTranslation()
  return (
    <div
      className="rounded-2xl overflow-hidden border border-red-200 dark:border-red-500/20 bg-white dark:bg-[#130d0d] flex flex-col h-full"
      style={{
        animation: visible ? 'flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) 100ms both' : 'none',
        boxShadow: '0 0 0 1px rgba(239,68,68,0.08), 0 8px 40px rgba(239,68,68,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-red-50 dark:bg-red-950/40 border-b border-red-100 dark:border-red-500/15">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 dark:text-red-500 mb-0.5">
            {t('comparison.before.badge')}
          </p>
          <h3 className="text-xl font-black text-red-600 dark:text-red-400">
            {t('comparison.before.title')}
          </h3>
        </div>
        {/* Excel X logo */}
        <div className="w-11 h-11 rounded-xl bg-[#1d6f42] flex items-center justify-center flex-shrink-0 shadow-lg">
          <span className="text-white font-black text-lg leading-none">X</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 divide-y divide-red-100 dark:divide-red-500/10">
        {items.map((item, i) => {
          const Icon = BEFORE_ICONS[i] ?? FileText
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3.5 group"
              style={{
                animation: visible ? `flipInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${200 + i * 60}ms both` : 'none',
              }}
            >
              {/* Left icon */}
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-50 dark:bg-red-950/40">
                <Icon className="w-3.5 h-3.5 text-red-400 dark:text-red-500" />
              </div>

              {/* Text */}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-white/70">
                {item}
              </span>

              {/* Warning icon */}
              <AlertTriangle className="w-4 h-4 text-red-400 dark:text-red-500 flex-shrink-0 opacity-80" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── After card ────────────────────────────────────────────────────────
function AfterCard({ items, visible }: { items: string[]; visible: boolean }) {
  const { t } = useTranslation()
  return (
    <div
      className="rounded-2xl overflow-hidden border border-indigo-200 dark:border-indigo-500/25 bg-white dark:bg-[#0d0e1a] flex flex-col h-full"
      style={{
        animation: visible ? 'flipInUp 0.65s cubic-bezier(0.16,1,0.3,1) 180ms both' : 'none',
        boxShadow: '0 0 0 1px rgba(99,102,241,0.1), 0 8px 40px rgba(99,102,241,0.08)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-indigo-50 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-500/15">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-0.5">
            {t('comparison.after.badge')}
          </p>
          <h3 className="text-xl font-black text-indigo-600 dark:text-indigo-300">
            {t('comparison.after.title')}
          </h3>
        </div>
        {/* Sayerli S logo */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            boxShadow: '0 0 16px rgba(99,102,241,0.4)',
          }}
        >
          <span className="text-white font-black text-lg leading-none">S</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 divide-y divide-indigo-100 dark:divide-indigo-500/10">
        {items.map((item, i) => {
          const Icon = AFTER_ICONS[i] ?? Check
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-3.5 group"
              style={{
                animation: visible ? `flipInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${280 + i * 60}ms both` : 'none',
              }}
            >
              {/* Left icon */}
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.12)' }}
              >
                <Icon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
              </div>

              {/* Text */}
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-white/80">
                {item}
              </span>

              {/* Check */}
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-100 dark:bg-emerald-900/40">
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Center connector ──────────────────────────────────────────────────
function Connector({ statSpeed, statTime, visible }: {
  statSpeed: string
  statTime: string
  visible: boolean
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-4 md:py-0"
      style={{ animation: visible ? 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 300ms both' : 'none' }}
    >
      {/* Stat chip top */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
        style={{ boxShadow: '0 2px 12px rgba(16,185,129,0.12)' }}
      >
        <TrendingUp className="w-3 h-3" />
        {statSpeed}
      </div>

      {/* Arrow circle */}
      <div
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 0 0 4px rgba(99,102,241,0.15), 0 8px 24px rgba(99,102,241,0.3)',
        }}
      >
        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white rtl:rotate-180" />
      </div>

      {/* Stat chip bottom */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400"
        style={{ boxShadow: '0 2px 12px rgba(99,102,241,0.1)' }}
      >
        <Zap className="w-3 h-3" />
        {statTime}
      </div>
    </div>
  )
}

// ── Social proof bar ──────────────────────────────────────────────────
function SocialProof({ text, visible }: { text: string; visible: boolean }) {
  const avatarColors = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899']
  const initials     = ['H', 'A', 'K', 'N']

  return (
    <div
      className="mt-8 flex justify-center"
      style={{ animation: visible ? 'flipInUp 0.6s cubic-bezier(0.16,1,0.3,1) 700ms both' : 'none' }}
    >
      <div
        className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 sm:px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
        style={{ boxShadow: '0 0 0 1px rgba(99,102,241,0.06), 0 4px 24px rgba(0,0,0,0.06)' }}
      >
        {/* Overlapping avatars */}
        <div className="flex -space-x-2 flex-shrink-0">
          {avatarColors.map((color, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ring-2 ring-white dark:ring-slate-900 flex-shrink-0"
              style={{ background: color }}
            >
              {initials[i]}
            </div>
          ))}
        </div>

        {/* Text */}
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 text-center">
          {text}
        </span>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
            <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            S
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────
export function FeatureComparison() {
  const { t, tArray } = useTranslation()
  const { ref, visible } = useScrollAnimation(0.05)

  const beforeItems = tArray('comparison.before.items')
  const afterItems  = tArray('comparison.after.items')

  return (
    <section
      ref={ref}
      className="relative py-20 sm:py-28 overflow-hidden bg-slate-50 dark:bg-[#07080f]"
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.045) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden dark:block"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.12]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.06] dark:opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.6) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
      </div>

      {/* Floating decorative chips — desktop only */}
      <div className="hidden lg:block">
        {/* Top-right: quote accepted */}
        <div
          className="absolute top-24 end-8 xl:end-16 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-500/25 shadow-lg"
          style={{
            animation: visible ? 'popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) 800ms both' : 'none',
            boxShadow: '0 4px 20px rgba(16,185,129,0.12)',
          }}
        >
          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-none">Devis accepté</p>
            <p className="text-[10px] text-slate-400 mt-0.5">il y a 2 min</p>
          </div>
        </div>

        {/* Bottom-left: payment notification */}
        <div
          className="absolute bottom-28 start-8 xl:start-16 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-500/25 shadow-lg"
          style={{
            animation: visible ? 'popIn 0.55s cubic-bezier(0.34,1.56,0.64,1) 900ms both' : 'none',
            boxShadow: '0 4px 20px rgba(99,102,241,0.1)',
          }}
        >
          <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 leading-none">+8 400 MAD</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Paiement reçu</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div
          className={cn(
            'text-center mb-12 sm:mb-16 transition-all duration-700',
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-semibold mb-5">
            <Zap className="w-3.5 h-3.5" />
            {t('comparison.badge')}
          </span>
          <h2 className="section-title mb-4">{t('comparison.title')}</h2>
          <p className="section-sub">{t('comparison.sub')}</p>
        </div>

        {/* ── Mobile: stacked ── */}
        <div className="flex flex-col gap-4 md:hidden">
          <BeforeCard items={beforeItems} visible={visible} />
          <Connector statSpeed={t('comparison.statSpeed')} statTime={t('comparison.statTime')} visible={visible} />
          <AfterCard items={afterItems} visible={visible} />
        </div>

        {/* ── Tablet / Desktop: side by side ── */}
        <div className="hidden md:grid md:grid-cols-[1fr_96px_1fr] lg:grid-cols-[1fr_112px_1fr] gap-4 items-center">
          <BeforeCard items={beforeItems} visible={visible} />
          <Connector statSpeed={t('comparison.statSpeed')} statTime={t('comparison.statTime')} visible={visible} />
          <AfterCard items={afterItems} visible={visible} />
        </div>

        {/* Social proof */}
        <SocialProof text={t('comparison.social')} visible={visible} />

      </div>
    </section>
  )
}
