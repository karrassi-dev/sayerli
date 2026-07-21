'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow, Background, Controls, MiniMap, MarkerType,
  useNodesState, useEdgesState, BackgroundVariant,
  type Node, type Edge, type NodeProps,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useTheme } from 'next-themes'
import { Users, FileText, Receipt, Truck, CreditCard, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'

// ─── Types ───────────────────────────────────────────────────────────────────

export type NodeType = 'client' | 'devis' | 'facture' | 'bl' | 'paiement'

export interface RawNode {
  id: string
  type: NodeType
  rawId: string
  label: string
  sublabel: string | null
  status: string | null
  amount: number | null
}

export interface RawEdge {
  id: string
  source: string
  target: string
  edgeType: string
}

export interface GraphData {
  nodes: RawNode[]
  edges: RawEdge[]
}

// ─── Node config ─────────────────────────────────────────────────────────────

const NODE_CONFIG: Record<NodeType, { color: string; bg: string; icon: React.ElementType; darkBg: string }> = {
  client:   { color: '#3b82f6', bg: 'bg-blue-500',   darkBg: '#1e40af', icon: Users },
  devis:    { color: '#8b5cf6', bg: 'bg-violet-500', darkBg: '#5b21b6', icon: FileText },
  facture:  { color: '#10b981', bg: 'bg-emerald-500',darkBg: '#065f46', icon: Receipt },
  bl:       { color: '#f59e0b', bg: 'bg-amber-500',  darkBg: '#92400e', icon: Truck },
  paiement: { color: '#64748b', bg: 'bg-slate-400',  darkBg: '#334155', icon: CreditCard },
}

const STATUS_COLORS: Record<string, string> = {
  BROUILLON: '#94a3b8',
  ENVOYE: '#3b82f6',
  VU: '#8b5cf6',
  ACCEPTE: '#10b981',
  REFUSE: '#ef4444',
  EXPIRE: '#f97316',
  ANNULEE: '#ef4444',
  PAYEE: '#10b981',
  PARTIELLE: '#f59e0b',
  EN_RETARD: '#ef4444',
  LIVRE: '#10b981',
  EN_COURS: '#3b82f6',
}

// ─── Layout algorithm ────────────────────────────────────────────────────────

function computeLayout(rawNodes: RawNode[], rawEdges: RawEdge[]): Record<string, { x: number; y: number }> {
  const childrenOf: Record<string, string[]> = {}
  rawEdges.forEach(e => {
    if (!childrenOf[e.source]) childrenOf[e.source] = []
    childrenOf[e.source].push(e.target)
  })

  const positions: Record<string, { x: number; y: number }> = {}
  const clients = rawNodes.filter(n => n.type === 'client')
  const cols = Math.ceil(Math.sqrt(clients.length))
  const CLIENT_SPACING_X = 700
  const CLIENT_SPACING_Y = 600
  const DOC_RADIUS = 180

  clients.forEach((client, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    const cx = col * CLIENT_SPACING_X
    const cy = row * CLIENT_SPACING_Y
    positions[client.id] = { x: cx, y: cy }

    const children = childrenOf[client.id] ?? []
    children.forEach((childId, j) => {
      if (positions[childId]) return
      const angle = (j / Math.max(children.length, 1)) * 2 * Math.PI - Math.PI / 2
      positions[childId] = {
        x: cx + Math.cos(angle) * DOC_RADIUS,
        y: cy + Math.sin(angle) * DOC_RADIUS,
      }

      const grandchildren = childrenOf[childId] ?? []
      grandchildren.forEach((gcId, k) => {
        if (positions[gcId]) return
        const gcAngle = angle + ((k - (grandchildren.length - 1) / 2) * 0.6)
        positions[gcId] = {
          x: positions[childId].x + Math.cos(gcAngle) * DOC_RADIUS * 0.8,
          y: positions[childId].y + Math.sin(gcAngle) * DOC_RADIUS * 0.8,
        }

        const ggchildren = childrenOf[gcId] ?? []
        ggchildren.forEach((ggId, m) => {
          if (positions[ggId]) return
          const ggAngle = gcAngle + ((m - (ggchildren.length - 1) / 2) * 0.5)
          positions[ggId] = {
            x: positions[gcId].x + Math.cos(ggAngle) * DOC_RADIUS * 0.65,
            y: positions[gcId].y + Math.sin(ggAngle) * DOC_RADIUS * 0.65,
          }
        })
      })
    })
  })

  // Position orphan nodes (no parent edge)
  rawNodes.forEach((n, i) => {
    if (!positions[n.id]) {
      positions[n.id] = { x: i * 200, y: -300 }
    }
  })

  return positions
}

// ─── Custom node component ────────────────────────────────────────────────────

interface GraphNodeData {
  label: string
  sublabel: string | null
  status: string | null
  amount: number | null
  nodeType: NodeType
  highlighted: boolean
  dimmed: boolean
  onHover: (id: string | null) => void
  nodeId: string
  [key: string]: unknown
}

function GraphNode({ data }: NodeProps) {
  const d = data as GraphNodeData
  const cfg = NODE_CONFIG[d.nodeType]
  const Icon = cfg.icon

  return (
    <div
      onMouseEnter={() => d.onHover(d.nodeId)}
      onMouseLeave={() => d.onHover(null)}
      className="select-none cursor-pointer"
      style={{
        opacity: d.dimmed ? 0.2 : 1,
        transition: 'all 0.2s ease',
        filter: d.highlighted ? `drop-shadow(0 0 12px ${cfg.color})` : 'none',
        transform: d.highlighted ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-2xl border text-white font-semibold text-xs whitespace-nowrap shadow-lg"
        style={{
          background: d.highlighted ? cfg.color : `${cfg.color}cc`,
          borderColor: d.highlighted ? '#fff' : `${cfg.color}66`,
          backdropFilter: 'blur(8px)',
          minWidth: d.nodeType === 'client' ? 110 : 90,
        }}
      >
        <div
          className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          <Icon className="w-3 h-3" />
        </div>
        <span className="truncate max-w-[120px]">{d.label}</span>
        {d.status && (
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: STATUS_COLORS[d.status] ?? '#94a3b8' }}
          />
        )}
      </div>
    </div>
  )
}

const nodeTypes = { graphNode: GraphNode }

// ─── Hover popup ──────────────────────────────────────────────────────────────

function HoverCard({
  node,
  onNavigate,
  onMouseEnter,
  onMouseLeave,
}: {
  node: RawNode | null
  onNavigate: (type: NodeType, id: string) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const { t } = useTranslation()
  if (!node) return null
  const cfg = NODE_CONFIG[node.type]
  const Icon = cfg.icon

  const typeLabel: Record<NodeType, string> = {
    client:   t('graph.nodeTypes.client'),
    devis:    t('graph.nodeTypes.devis'),
    facture:  t('graph.nodeTypes.facture'),
    bl:       t('graph.nodeTypes.bl'),
    paiement: t('graph.nodeTypes.paiement'),
  }

  const statusLabel: Record<string, string> = {
    BROUILLON: t('graph.status.brouillon'),
    ENVOYE: t('graph.status.envoye'),
    VU: t('graph.status.vu'),
    ACCEPTE: t('graph.status.accepte'),
    REFUSE: t('graph.status.refuse'),
    EXPIRE: t('graph.status.expire'),
    ANNULEE: t('graph.status.annulee'),
    PAYEE: t('graph.status.payee'),
    PARTIELLE: t('graph.status.partielle'),
    EN_RETARD: t('graph.status.enRetard'),
    LIVRE: t('graph.status.livre'),
    EN_COURS: t('graph.status.enCours'),
  }

  return (
    <div
      className="absolute bottom-6 right-6 z-50 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-4 pointer-events-auto"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: cfg.color }}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{typeLabel[node.type]}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{node.label}</p>
        </div>
      </div>
      <div className="space-y-1.5">
        {node.status && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('graph.popup.status')}</span>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${STATUS_COLORS[node.status]}22`, color: STATUS_COLORS[node.status] }}
            >
              {statusLabel[node.status] ?? node.status}
            </span>
          </div>
        )}
        {node.amount != null && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('graph.popup.amount')}</span>
            <span className="text-xs font-bold text-slate-900 dark:text-white">{node.amount.toLocaleString('fr-MA')} MAD</span>
          </div>
        )}
        {node.sublabel && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">{t('graph.popup.type')}</span>
            <span className="text-xs text-slate-700 dark:text-slate-300 capitalize">{node.sublabel.toLowerCase()}</span>
          </div>
        )}
      </div>
      {node.type !== 'paiement' && (
        <button
          className="mt-3 w-full text-xs font-semibold py-1.5 rounded-xl border transition-all hover:opacity-80"
          style={{ borderColor: cfg.color, color: cfg.color }}
          onClick={() => onNavigate(node.type, node.rawId)}
        >
          {t('graph.popup.open')} →
        </button>
      )}
    </div>
  )
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

const FILTER_TYPES: NodeType[] = ['client', 'devis', 'facture', 'bl', 'paiement']

function FilterBar({
  active,
  onToggle,
  counts,
}: {
  active: Set<NodeType>
  onToggle: (t: NodeType) => void
  counts: Record<NodeType, number>
}) {
  const { t } = useTranslation()
  const labels: Record<NodeType, string> = {
    client:   t('graph.nodeTypes.client'),
    devis:    t('graph.nodeTypes.devis'),
    facture:  t('graph.nodeTypes.facture'),
    bl:       t('graph.nodeTypes.bl'),
    paiement: t('graph.nodeTypes.paiement'),
  }
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_TYPES.map(type => {
        const cfg = NODE_CONFIG[type]
        const isOn = active.has(type)
        return (
          <button
            key={type}
            onClick={() => onToggle(type)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
              isOn
                ? 'text-white border-transparent'
                : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-transparent',
            )}
            style={isOn ? { background: cfg.color, borderColor: cfg.color } : {}}
          >
            <cfg.icon className="w-3 h-3" />
            {labels[type]}
            <span
              className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                isOn ? 'bg-white/25 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
              )}
            >
              {counts[type] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Main GraphView ────────────────────────────────────────────────────────────

export default function GraphView({ data }: { data: GraphData }) {
  const { resolvedTheme } = useTheme()
  const { t, dir } = useTranslation()
  const isDark = resolvedTheme === 'dark'

  const [activeFilters, setActiveFilters] = useState<Set<NodeType>>(new Set(FILTER_TYPES))
  const [search, setSearch] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced hover: 300ms grace period so mouse can travel from node to popup
  const handleHover = useCallback((id: string | null) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    if (id !== null) {
      setHoveredId(id)
    } else {
      hoverTimeout.current = setTimeout(() => setHoveredId(null), 300)
    }
  }, [])

  const handlePopupEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
  }, [])

  const handlePopupLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setHoveredId(null), 150)
  }, [])

  const positions = useMemo(() => computeLayout(data.nodes, data.edges), [data.nodes, data.edges])

  const counts = useMemo(() => {
    const c: Record<NodeType, number> = { client: 0, devis: 0, facture: 0, bl: 0, paiement: 0 }
    data.nodes.forEach(n => { c[n.type] = (c[n.type] ?? 0) + 1 })
    return c
  }, [data.nodes])

  // Compute which nodes are connected to the hovered node
  const connectedIds = useMemo(() => {
    if (!hoveredId) return new Set<string>()
    const connected = new Set<string>([hoveredId])
    data.edges.forEach(e => {
      if (e.source === hoveredId) connected.add(e.target)
      if (e.target === hoveredId) connected.add(e.source)
    })
    return connected
  }, [hoveredId, data.edges])

  const hoveredNode = useMemo(
    () => hoveredId ? data.nodes.find(n => n.id === hoveredId) ?? null : null,
    [hoveredId, data.nodes],
  )

  const filteredNodeIds = useMemo(() => {
    const searchLower = search.toLowerCase()
    return new Set(
      data.nodes
        .filter(n => activeFilters.has(n.type))
        .filter(n => !searchLower || n.label.toLowerCase().includes(searchLower))
        .map(n => n.id),
    )
  }, [data.nodes, activeFilters, search])

  const rfNodes: Node[] = useMemo(() =>
    data.nodes
      .filter(n => filteredNodeIds.has(n.id))
      .map(n => ({
        id: n.id,
        type: 'graphNode',
        position: positions[n.id] ?? { x: 0, y: 0 },
        data: {
          label: n.label,
          sublabel: n.sublabel,
          status: n.status,
          amount: n.amount,
          nodeType: n.type,
          nodeId: n.id,
          highlighted: hoveredId ? connectedIds.has(n.id) : false,
          dimmed: hoveredId ? !connectedIds.has(n.id) : false,
          onHover: handleHover,
        } satisfies GraphNodeData,
      })),
  [data.nodes, filteredNodeIds, positions, hoveredId, connectedIds])

  const EDGE_COLORS: Record<string, string> = {
    'client-devis':      NODE_CONFIG.devis.color,
    'client-facture':    NODE_CONFIG.facture.color,
    'client-bl':         NODE_CONFIG.bl.color,
    'devis-facture':     NODE_CONFIG.facture.color,
    'devis-bl':          NODE_CONFIG.bl.color,
    'facture-paiement':  NODE_CONFIG.paiement.color,
  }

  const EDGE_LABELS: Record<string, string> = {
    'client-devis':     t('graph.edgeLabels.clientDevis'),
    'client-facture':   t('graph.edgeLabels.clientFacture'),
    'client-bl':        t('graph.edgeLabels.clientBl'),
    'devis-facture':    t('graph.edgeLabels.devisFacture'),
    'devis-bl':         t('graph.edgeLabels.devisBl'),
    'facture-paiement': t('graph.edgeLabels.facturePaiement'),
  }

  const rfEdges: Edge[] = useMemo(() =>
    data.edges
      .filter(e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target))
      .map(e => {
        const isHighlighted = hoveredId
          ? connectedIds.has(e.source) && connectedIds.has(e.target)
          : false
        const isDimmed = hoveredId ? !isHighlighted : false
        const baseColor = EDGE_COLORS[e.edgeType] ?? '#6366f1'
        const strokeColor = isHighlighted ? baseColor : (isDark ? '#475569' : '#94a3b8')
        return {
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'default',
          pathOptions: { curvature: 0.6 },
          animated: isHighlighted,
          label: isHighlighted ? (EDGE_LABELS[e.edgeType] ?? '') : '',
          labelStyle: {
            fontSize: 10,
            fontWeight: 600,
            fill: baseColor,
          },
          labelBgStyle: {
            fill: isDark ? '#0f172a' : '#ffffff',
            fillOpacity: 0.85,
          },
          labelBgPadding: [4, 6] as [number, number],
          labelBgBorderRadius: 6,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: isHighlighted ? 14 : 10,
            height: isHighlighted ? 14 : 10,
            color: strokeColor,
          },
          style: {
            stroke: strokeColor,
            strokeWidth: isHighlighted ? 2.5 : 1.5,
            opacity: isDimmed ? 0.06 : isHighlighted ? 1 : 0.65,
            transition: 'all 0.2s ease',
          },
        }
      }),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [data.edges, filteredNodeIds, hoveredId, connectedIds, isDark, t])

  const [nodes, setNodes, onNodesChange] = useNodesState(rfNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges)

  // Sync nodes/edges when data or filters change
  useEffect(() => { setNodes(rfNodes) }, [rfNodes]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setEdges(rfEdges) }, [rfEdges]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleFilter = useCallback((type: NodeType) => {
    setActiveFilters(prev => {
      const next = new Set(prev)
      if (next.has(type)) next.delete(type)
      else next.add(type)
      return next
    })
  }, [])

  const handleNavigate = useCallback((type: NodeType, id: string) => {
    const routes: Record<NodeType, string> = {
      client: '/dashboard/clients',
      devis: '/dashboard/devis',
      facture: '/dashboard/factures',
      bl: '/dashboard/bons-livraison',
      paiement: '/dashboard/paiements',
    }
    window.location.href = routes[type]
  }, [])

  const isEmpty = data.nodes.length === 0

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
      style={{ height: 'calc(100vh - 220px)', minHeight: 500 }}
      dir={dir}
    >
      {/* Controls bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('graph.searchPlaceholder')}
            className="pl-8 pr-8 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 w-48"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-2 border border-slate-200 dark:border-slate-700">
          <FilterBar active={activeFilters} onToggle={toggleFilter} counts={counts} />
        </div>
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-50 dark:bg-slate-950">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-900 dark:text-white font-bold text-lg">{t('graph.empty.title')}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t('graph.empty.sub')}</p>
        </div>
      )}

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        onPaneClick={() => setHoveredId(null)}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={isDark ? '#334155' : '#cbd5e1'}
          style={{ background: isDark ? '#0f172a' : '#f8fafc' }}
        />
        <Controls
          style={{
            background: isDark ? '#1e293b' : '#fff',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 12,
          }}
        />
        <MiniMap
          style={{
            background: isDark ? '#1e293b' : '#f1f5f9',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 12,
          }}
          nodeColor={n => NODE_CONFIG[(n.data as GraphNodeData).nodeType]?.color ?? '#94a3b8'}
          maskColor={isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)'}
        />
      </ReactFlow>

      {/* Hover popup */}
      <HoverCard
        node={hoveredNode}
        onNavigate={handleNavigate}
        onMouseEnter={handlePopupEnter}
        onMouseLeave={handlePopupLeave}
      />
    </div>
  )
}
