'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// SVG coordinate space — viewBox "30.24 -2 899.52 964" (amCharts Mercator)
// Computed via Mercator projection from geographic coordinates
const CITIES = [
  { name: 'Tanger',     x: 560.5, y: 14.0,  r: 4.5 },
  { name: 'Rabat',      x: 511.7, y: 133.9, r: 4.5 },
  { name: 'Casablanca', x: 475.7, y: 163.0, r: 6   },
  { name: 'Fès',        x: 598.4, y: 133.2, r: 4.5 },
  { name: 'Marrakech',  x: 456.8, y: 293.8, r: 4.5 },
  { name: 'Agadir',     x: 380.6, y: 373.2, r: 4   },
  { name: 'Laâyoune',  x: 210.1, y: 582.4, r: 3.5 },
  { name: 'Dakhla',     x: 80.9,  y: 797.2, r: 3.5 },
]

const CONNECTIONS = [
  [0, 3], // Tanger ↔ Fès
  [0, 1], // Tanger ↔ Rabat
  [1, 2], // Rabat ↔ Casablanca
  [2, 3], // Casablanca ↔ Fès
  [2, 4], // Casablanca ↔ Marrakech
  [4, 5], // Marrakech ↔ Agadir
  [5, 6], // Agadir ↔ Laâyoune
  [6, 7], // Laâyoune ↔ Dakhla
]

interface Particle { id: number; cx: number; cy: number; r: number; dur: number; delay: number }
const PARTICLES: Particle[] = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  cx: 50 + Math.sin(i * 2.4) * 420 + Math.cos(i * 1.1) * 180,
  cy: 50 + Math.cos(i * 1.7) * 460 + Math.sin(i * 0.9) * 180,
  r: 1 + (i % 3) * 0.7,
  dur: 5 + (i % 7) * 1.3,
  delay: (i % 6) * 0.9,
}))

export function MoroccoMap() {
  const [pathsHtml, setPathsHtml] = useState<string>('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/moroccoHigh.svg')
      .then(r => r.text())
      .then(text => {
        // Strip outer <svg> wrapper — keep only inner <path> elements
        const inner = text.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>[\s\S]*$/, '')
        // Filter out the tiny "MA-XX" label paths (d="MA-12" etc.) and comments
        const cleaned = inner
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/<path[^>]*d="MA-\d+"[^>]*\/>/g, '')
        setPathsHtml(cleaned)
        setReady(true)
      })
      .catch(() => setReady(true)) // fail silently
  }, [])

  return (
    <div className="relative w-full h-full select-none" aria-hidden>
      {/* Radial background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 55% 42%, rgba(99,91,255,0.22) 0%, rgba(99,91,255,0.06) 55%, transparent 80%)',
          filter: 'blur(12px)',
        }}
      />

      <AnimatePresence>
        {ready && (
          <motion.svg
            key="map"
            viewBox="30.24 -2 899.52 964"
            className="relative w-full h-full"
            style={{ overflow: 'visible' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <defs>
              {/* Outer glow for path stroke */}
              <filter id="mapGlow" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* City dot glow */}
              <filter id="dotGlow" x="-150%" y="-150%" width="400%" height="400%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              {/* Animated gradient for paths */}
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="rgba(99,91,255,0.18)" />
                <stop offset="100%" stopColor="rgba(124,108,255,0.08)" />
              </linearGradient>
              <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="60%" y2="100%">
                <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="50%"  stopColor="#7c6cff" stopOpacity="1" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.8" />
              </linearGradient>

              <style>{`
                @keyframes mapPulse {
                  0%, 100% { opacity: 0.75; }
                  50%       { opacity: 1; }
                }
                @keyframes dotPulse {
                  0%, 100% { opacity: 0.6; transform: scale(1); }
                  50%       { opacity: 1;   transform: scale(1.4); }
                }
                @keyframes lineFlow {
                  to { stroke-dashoffset: -32; }
                }
                @keyframes particleDrift {
                  0%   { opacity: 0; transform: translate(0, 0); }
                  25%  { opacity: 0.55; }
                  75%  { opacity: 0.55; }
                  100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
                }
                .ma-region {
                  fill: url(#fillGrad);
                  stroke: url(#strokeGrad);
                  stroke-width: 1.5;
                  filter: url(#mapGlow);
                  animation: mapPulse 4s ease-in-out infinite;
                }
              `}</style>
            </defs>

            {/* ── Morocco regions (loaded from SVG file) ─── */}
            <motion.g
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{ transformOrigin: '480px 480px' }}
              // Apply class to all child paths via CSS
              className="[&>path]:ma-region"
              dangerouslySetInnerHTML={{ __html: pathsHtml }}
            />

            {/* ── Floating particles ───────────────────────── */}
            {PARTICLES.map(p => (
              <circle
                key={p.id}
                cx={p.cx} cy={p.cy} r={p.r}
                fill="rgba(167,139,250,0.5)"
                style={{
                  animation: `particleDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
                  // @ts-expect-error CSS custom property
                  '--dx': `${Math.sin(p.id) * 25}px`,
                  '--dy': `${Math.cos(p.id) * 25}px`,
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
                  stroke="rgba(139,92,246,0.45)"
                  strokeWidth="1.2"
                  strokeDasharray="8 6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
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
                transition={{ delay: 1.6 + i * 0.1, duration: 0.4, type: 'spring', stiffness: 300 }}
                style={{ transformOrigin: `${city.x}px ${city.y}px` }}
              >
                {/* Outer pulse ring */}
                <circle
                  cx={city.x} cy={city.y}
                  r={city.r * 3}
                  fill="rgba(124,108,255,0.12)"
                  style={{
                    animation: `dotPulse ${2.2 + i * 0.25}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    transformOrigin: `${city.x}px ${city.y}px`,
                  }}
                />
                {/* Middle ring */}
                <circle
                  cx={city.x} cy={city.y}
                  r={city.r * 1.8}
                  fill="rgba(124,108,255,0.2)"
                  filter="url(#dotGlow)"
                />
                {/* Core dot */}
                <circle
                  cx={city.x} cy={city.y}
                  r={city.r}
                  fill="#a78bfa"
                  filter="url(#dotGlow)"
                />
                {/* White centre */}
                <circle
                  cx={city.x} cy={city.y}
                  r={city.r * 0.4}
                  fill="rgba(255,255,255,0.95)"
                />
              </motion.g>
            ))}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  )
}
