'use client'

import { motion } from 'framer-motion'
import { Briefcase, User, Building2 } from 'lucide-react'

export type RoleType = 'entrepreneur' | 'freelancer' | 'pme'

interface RoleOption {
  key: RoleType
  icon: React.ReactNode
  name: string
  desc: string
}

interface RoleSelectorProps {
  value: RoleType
  onChange: (v: RoleType) => void
  isDark: boolean
  labels: { entrepreneur: string; freelance: string; pme: string }
  descs:  { entrepreneur: string; freelance: string; pme: string }
  legend: string
  sublabel: string
}

export function RoleSelector({ value, onChange, isDark, labels, descs, legend, sublabel }: RoleSelectorProps) {
  const options: RoleOption[] = [
    { key: 'entrepreneur', icon: <Briefcase className="w-5 h-5" />, name: labels.entrepreneur, desc: descs.entrepreneur },
    { key: 'freelancer',   icon: <User        className="w-5 h-5" />, name: labels.freelance,   desc: descs.freelance },
    { key: 'pme',          icon: <Building2   className="w-5 h-5" />, name: labels.pme,         desc: descs.pme },
  ]

  return (
    <div>
      <div className="mb-3">
        <p
          className="text-sm font-semibold mb-0.5"
          style={{ color: isDark ? 'rgba(245,243,255,0.92)' : '#1e1743' }}
        >
          {legend}
        </p>
        <p className="text-xs" style={{ color: isDark ? 'rgba(245,243,255,0.45)' : 'rgba(30,23,67,0.52)' }}>
          {sublabel}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {options.map(opt => {
          const active = value === opt.key
          return (
            <motion.button
              key={opt.key}
              type="button"
              onClick={() => onChange(opt.key)}
              whileTap={{ scale: 0.97 }}
              animate={active ? { scale: 1.02 } : { scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 24 }}
              className="relative text-left rounded-2xl p-3 outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              style={{
                border: active
                  ? '1.5px solid #7c6cff'
                  : isDark
                    ? '1.5px solid rgba(255,255,255,0.08)'
                    : '1.5px solid rgba(30,23,67,0.11)',
                background: active
                  ? isDark
                    ? 'rgba(124,108,255,0.13)'
                    : 'rgba(99,91,255,0.07)'
                  : isDark
                    ? 'rgba(255,255,255,0.03)'
                    : 'rgba(30,23,67,0.02)',
                transition: 'border 0.18s, background 0.18s',
                cursor: 'pointer',
              }}
            >
              {/* Active indicator dot */}
              {active && (
                <motion.span
                  layoutId="roleActive"
                  className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full"
                  style={{ background: '#7c6cff' }}
                />
              )}

              {/* Icon */}
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-xl mb-2"
                style={{
                  background: active
                    ? isDark ? 'rgba(124,108,255,0.22)' : 'rgba(99,91,255,0.12)'
                    : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,23,67,0.06)',
                  color: active ? '#7c6cff' : isDark ? 'rgba(245,243,255,0.45)' : 'rgba(30,23,67,0.45)',
                  transition: 'background 0.18s, color 0.18s',
                }}
              >
                {opt.icon}
              </span>

              <p
                className="text-xs font-semibold leading-tight mb-0.5"
                style={{ color: active ? (isDark ? '#a78bfa' : '#4f3ef7') : isDark ? 'rgba(245,243,255,0.75)' : '#1e1743' }}
              >
                {opt.name}
              </p>
              <p
                className="text-[10.5px] leading-snug"
                style={{ color: isDark ? 'rgba(245,243,255,0.38)' : 'rgba(30,23,67,0.50)' }}
              >
                {opt.desc}
              </p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
