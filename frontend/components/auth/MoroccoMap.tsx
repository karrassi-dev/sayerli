'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// ViewBox: 0 0 300 420
// Formula: x = (lon + 17) * 18.75,  y = (36 - lat) * 28
const MOROCCO_PATH = `
  M208,6
  L214,3 L220,2 L228,5 L234,10 L240,14 L245,17 L256,17 L264,19 L273,23 L279,31 L281,37
  L285,55 L290,82 L292,109 L290,137 L286,162 L279,187 L268,212 L252,227 L237,232
  L208,234 L178,235 L157,236
  L156,270 L155,300 L155,335 L154,372 L155,414
  L120,416 L80,417 L40,416 L0,414
  L5,400 L12,380 L18,362 L21,344
  L28,326 L36,310 L43,294 L52,278 L62,263 L71,249
  L82,232 L91,217 L101,204 L111,199
  L126,186 L132,183 L141,176 L139,157 L137,154
  L135,126 L146,104 L159,78 L163,76 L176,67 L180,64
  L191,56 L195,48 L201,31 L204,22 L206,14 L210,8 L208,6
  Z
`

const CITIES = [
  { name: 'Tanger',      x: 210, y: 6,   size: 3.5 },
  { name: 'Rabat',       x: 191, y: 56,  size: 4 },
  { name: 'Casablanca',  x: 176, y: 67,  size: 5 },
  { name: 'Fès',         x: 225, y: 56,  size: 3.5 },
  { name: 'Marrakech',   x: 169, y: 123, size: 4 },
  { name: 'Agadir',      x: 139, y: 157, size: 3.5 },
  { name: 'Laâyoune',   x: 71,  y: 249, size: 3 },
  { name: 'Dakhla',      x: 21,  y: 344, size: 3 },
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

interface Particle {
  id: number
  x: number
  y: number
  r: number
  dur: number
  delay: number
  dx: number
  dy: number
}

function genParticles(n = 28): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 300,
    y: Math.random() * 420,
    r: 0.6 + Math.random() * 1.2,
    dur: 6 + Math.random() * 8,
    delay: Math.random() * 6,
    dx: (Math.random() - 0.5) * 18,
    dy: (Math.random() - 0.5) * 18,
  }))
}

export function MoroccoMap() {
  const [particles] = useState<Particle[]>(() => genParticles(28))
  const [tick, setTick] = useState(0)

  // Pulse tick for glow animation
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" aria-hidden>
      {/* Radial glow behind map */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '85%',
          paddingBottom: '120%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(99,91,255,0.18) 0%, rgba(124,108,255,0.08) 40%, transparent 70%)',
          filter: 'blur(18px)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      <svg
        viewBox="0 0 300 420"
        className="relative z-10"
        style={{ width: '75%', maxHeight: '80vh', overflow: 'visible' }}
      >
        <defs>
          {/* Neon purple stroke gradient */}
          <linearGradient id="neonStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#a78bfa" />
            <stop offset="50%"  stopColor="#7c6cff" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          {/* Map fill gradient */}
          <linearGradient id="mapFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1e1b4b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0f0c29" stopOpacity="0.3" />
          </linearGradient>

          {/* Glow filter for the map outline */}
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* City glow filter */}
          <filter id="cityGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Animated dash for connection lines */}
          <style>{`
            @keyframes dashFlow {
              to { stroke-dashoffset: -24; }
            }
            @keyframes cityPulse {
              0%, 100% { opacity: 0.7; r: 3px; }
              50%       { opacity: 1;   r: 5px; }
            }
            @keyframes particleDrift {
              0%   { opacity: 0; }
              20%  { opacity: 0.6; }
              80%  { opacity: 0.6; }
              100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
            }
          `}</style>
        </defs>

        {/* ── Floating particles ────────────────────────── */}
        {particles.map(p => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill="rgba(167,139,250,0.55)"
            style={{
              animation: `particleDrift ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
              // @ts-expect-error CSS custom property
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`,
            }}
          />
        ))}

        {/* ── Country fill (Morocco shape) ──────────────── */}
        <motion.path
          d={MOROCCO_PATH}
          fill="url(#mapFill)"
          stroke="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        />

        {/* ── Country outline — neon glow ───────────────── */}
        {/* Soft outer glow */}
        <path
          d={MOROCCO_PATH}
          fill="none"
          stroke="rgba(124,108,255,0.25)"
          strokeWidth="6"
          filter="url(#neonGlow)"
        />
        {/* Sharp neon edge */}
        <motion.path
          d={MOROCCO_PATH}
          fill="none"
          stroke="url(#neonStroke)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />

        {/* ── Connection lines between cities ──────────── */}
        {CONNECTIONS.map(([a, b], i) => {
          const ca = CITIES[a], cb = CITIES[b]
          const len = Math.hypot(cb.x - ca.x, cb.y - ca.y)
          return (
            <motion.line
              key={i}
              x1={ca.x} y1={ca.y}
              x2={cb.x} y2={cb.y}
              stroke="rgba(139,92,246,0.35)"
              strokeWidth="0.7"
              strokeDasharray="6 4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + i * 0.1, duration: 0.6 }}
              style={{
                animation: `dashFlow ${1.5 + len / 80}s linear infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          )
        })}

        {/* ── City dots ─────────────────────────────────── */}
        {CITIES.map((city, i) => (
          <motion.g
            key={city.name}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 2 + i * 0.12, duration: 0.4, type: 'spring' }}
          >
            {/* Outer glow ring */}
            <circle
              cx={city.x} cy={city.y}
              r={city.size * 2.2}
              fill="rgba(139,92,246,0.12)"
              style={{ animation: `cityPulse ${2 + i * 0.3}s ease-in-out infinite`, animationDelay: `${i * 0.25}s` }}
            />
            {/* Dot */}
            <circle
              cx={city.x} cy={city.y}
              r={city.size}
              fill="#7c6cff"
              filter="url(#cityGlow)"
            />
            {/* White center */}
            <circle
              cx={city.x} cy={city.y}
              r={city.size * 0.38}
              fill="rgba(255,255,255,0.9)"
            />
          </motion.g>
        ))}
      </svg>
    </div>
  )
}
