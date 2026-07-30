'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// SVG coordinate space — viewBox "30.24 -2 899.52 964" (amCharts Mercator)
// City positions computed via Mercator projection from geographic coordinates
const CITIES = [
  { name: 'Tanger',     x: 560.5, y:  14.0, r: 4.5 },
  { name: 'Rabat',      x: 511.7, y: 133.9, r: 4.5 },
  { name: 'Casablanca', x: 475.7, y: 163.0, r: 6.0 },
  { name: 'Fès',        x: 598.4, y: 133.2, r: 4.5 },
  { name: 'Marrakech',  x: 456.8, y: 293.8, r: 4.5 },
  { name: 'Agadir',     x: 380.6, y: 373.2, r: 4.0 },
  { name: 'Laâyoune',  x: 210.1, y: 582.4, r: 3.5 },
  { name: 'Dakhla',     x:  80.9, y: 797.2, r: 3.5 },
]

const CONNECTIONS = [
  [0, 3], [0, 1], [1, 2], [2, 3],
  [2, 4], [4, 5], [5, 6], [6, 7],
]

interface Particle { id: number; cx: number; cy: number; r: number; dur: number; delay: number }
const PARTICLES: Particle[] = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  cx: 100 + Math.sin(i * 2.4) * 350 + Math.cos(i * 1.1) * 150,
  cy: 100 + Math.cos(i * 1.7) * 380 + Math.sin(i * 0.9) * 150,
  r: 1 + (i % 3) * 0.8,
  dur: 5 + (i % 7) * 1.4,
  delay: (i % 6) * 0.8,
}))

// Regex to extract real geographic path `d` values (ignoring short MA-XX label paths)
const PATH_RE = /\bd="(M[^"]{30,})"/g

export function MoroccoMap() {
  const [pathDs, setPathDs] = useState<string[]>([])
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    fetch('/moroccoHigh.svg')
      .then(r => r.text())
      .then(text => {
        const ds: string[] = []
        let m: RegExpExecArray | null
        while ((m = PATH_RE.exec(text)) !== null) {
          ds.push(m[1])
        }
        setPathDs(ds)
        setReady(true)
      })
      .catch(() => setReady(true))
  }, [])

  return (
    <div className="relative w-full h-full select-none" aria-hidden>
      {/* Radial glow behind map */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 75% 60% at 55% 40%, rgba(99,91,255,0.24) 0%, rgba(99,91,255,0.07) 55%, transparent 80%)',
          filter: 'blur(14px)',
        }}
      />

      <AnimatePresence>
        {ready && (
          <motion.svg
            key="map"
            viewBox="30.24 -2 899.52 964"
            className="relative w-full h-full"
            style={{ overflow: 'visible' }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, ease: 'easeOut' }}
          >
            <defs>
              <filter id="mapGlow" x="-15%" y="-15%" width="130%" height="130%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="mapStroke" x1="0%" y1="0%" x2="60%" y2="100%">
                <stop offset="0%"   stopColor="#818cf8" stopOpacity="1"   />
                <stop offset="50%"  stopColor="#7c6cff" stopOpacity="1"   />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
              </linearGradient>
              <style>{`
                @keyframes mapPulse {
                  0%, 100% { opacity: 0.8; }
                  50%       { opacity: 1;   }
                }
                @keyframes dotPulse {
                  0%, 100% { r: 1px; opacity: 0.5; }
                  50%       { r: 2px; opacity: 1;   }
                }
                @keyframes lineFlow {
                  to { stroke-dashoffset: -32; }
                }
                @keyframes particleDrift {
                  0%   { opacity: 0; }
                  25%  { opacity: 0.6; }
                  75%  { opacity: 0.6; }
                  100% { opacity: 0; transform: translate(var(--pdx), var(--pdy)); }
                }
              `}</style>
            </defs>

            {/* ── Morocco region paths ─────────────────────── */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.0 }}
              style={{ animation: 'mapPulse 4s ease-in-out infinite' }}
            >
              {pathDs.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="rgba(99,91,255,0.16)"
                  stroke="url(#mapStroke)"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                  filter="url(#mapGlow)"
                />
              ))}
            </motion.g>

            {/* ── Floating particles ───────────────────────── */}
            {PARTICLES.map(p => (
              <circle
                key={p.id}
                cx={p.cx} cy={p.cy} r={p.r}
                fill="rgba(167,139,250,0.55)"
                style={{
                  animation: `particleDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
                  // @ts-expect-error custom property
                  '--pdx': `${Math.sin(p.id) * 22}px`,
                  '--pdy': `${Math.cos(p.id) * 22}px`,
                }}
              />
            ))}

            {/* ── Connection lines ─────────────────────────── */}
            {CONNECTIONS.map(([a, b], i) => {
              const ca = CITIES[a], cb = CITIES[b]
              return (
                <motion.line
                  key={i}
                  x1={ca.x} y1={ca.y} x2={cb.x} y2={cb.y}
                  stroke="rgba(139,92,246,0.5)"
                  strokeWidth="1.4"
                  strokeDasharray="9 6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                  style={{ animation: `lineFlow ${1.8 + i * 0.15}s linear infinite` }}
                />
              )
            })}

            {/* ── City dots ────────────────────────────────── */}
            {CITIES.map((city, i) => (
              <motion.g
                key={city.name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + i * 0.1, duration: 0.4, type: 'spring', stiffness: 280 }}
                style={{ transformOrigin: `${city.x}px ${city.y}px` }}
              >
                {/* Outer pulse ring */}
                <circle
                  cx={city.x} cy={city.y}
                  r={city.r * 3.2}
                  fill="rgba(124,108,255,0.10)"
                  style={{
                    animation: `dotPulse ${2 + i * 0.28}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    transformOrigin: `${city.x}px ${city.y}px`,
                  }}
                />
                {/* Mid ring */}
                <circle cx={city.x} cy={city.y} r={city.r * 1.9} fill="rgba(124,108,255,0.22)" filter="url(#dotGlow)" />
                {/* Core */}
                <circle cx={city.x} cy={city.y} r={city.r} fill="#a78bfa" filter="url(#dotGlow)" />
                {/* White centre */}
                <circle cx={city.x} cy={city.y} r={city.r * 0.4} fill="rgba(255,255,255,0.95)" />
              </motion.g>
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  )
}
