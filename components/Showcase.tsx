'use client'

/**
 * Showcase.tsx — Icons.ai · Xray (cinema reel v5)
 *
 * v5 (2026-05-17): refatorado pra usar o shell canônico
 * <ShowcaseShell> de iconsaiShowcaseShell. Conteúdo das 16 cenas
 * mantido idêntico; toda a infra de viewport/progress/chevrons/chips
 * vem do shell.
 *
 * Estrutura:
 *   PART 1 — Abertura tipográfica (20s, 4 frames × 5s)
 *     A1  Wordmark ai.xray em close (orange → cyan)
 *     A2  Quote "Quer resolver problemas reais da sua empresa?"
 *     A3  Quote "Encontrar soluções customizadas pra sua operação?"
 *     A4  Quote "Você não precisa de uma IA — precisa do Xray."
 *
 *   PART 2 — Tour das telas reais (84s, 12 frames × 7s)
 *     S1..S12 — Hub, Grafo, Problemas, Eisenhower, Kanban, Concorrentes,
 *               Áudios, CRM, Depoimentos, Admin, Construindo, Publicado.
 *
 * Total: 104s. Loop infinito controlado pelo shell.
 */

import { useState } from 'react'
import { ShowcaseShell, type ShowcaseScene } from './showcase-shell'
import './showcase.css'

/* ─── DADOS ────────────────────────────────────────────────────────── */

const EMPRESAS = [
  { nome: 'MagisaTech', setor: 'Tecnologia · Automação', status: 'publicado', cor: '#00d4ff', ini: 'MT' },
  { nome: 'IconsAI',    setor: 'Tecnologia · IA',        status: 'publicado', cor: '#a855f7', ini: 'IA' },
  { nome: 'Magisa',     setor: 'Consultoria pública',    status: 'publicado', cor: '#f97316', ini: 'MG' },
  { nome: 'NR Brasil',  setor: 'Saúde ocupacional',      status: 'publicado', cor: '#22c55e', ini: 'NR' },
  { nome: 'EduVem',     setor: 'Educação',               status: 'rascunho',  cor: '#3b82f6', ini: 'EV' },
  { nome: 'Discovery',  setor: 'Análise de dados',       status: 'publicado', cor: '#ec4899', ini: 'DC' },
] as const

type EmpresaName = (typeof EMPRESAS)[number]['nome']

const EMPRESA_DETAILS: Record<EmpresaName, {
  slug: string
  resumo: string
  ultImport: string
  owner: string
  voz: string
  stats: [string, string][]
  modulos: string[]
}> = {
  MagisaTech: {
    slug: 'magisatech',
    resumo: 'Operação industrial com gargalo entre comercial, ERP e execução. Workspace principal usado como demo do ecossistema.',
    ultImport: 'há 12 min · 14 entrevistas',
    owner: 'Fernando Arbache',
    voz: 'direta · operação first',
    stats: [['Nós do grafo', '128'], ['Problemas críticos', '11'], ['Cards em execução', '4']],
    modulos: ['Grafo causal', 'CRM', 'Kanban', 'Áudios', 'Concorrência'],
  },
  IconsAI: {
    slug: 'iconsai',
    resumo: 'Workspace de branding e pipeline comercial. Mais foco em posicionamento, jornada de compra e handoff entre produtos.',
    ultImport: 'há 31 min · 9 entrevistas',
    owner: 'Time Growth',
    voz: 'consultiva · estratégica',
    stats: [['Nós do grafo', '84'], ['Problemas críticos', '7'], ['Cards em execução', '3']],
    modulos: ['Grafo causal', 'CRM', 'Depoimentos', 'Concorrência'],
  },
  Magisa: {
    slug: 'magisa',
    resumo: 'Consultoria pública com trilha longa de decisão. O Xray organiza dores por secretaria, orçamento e risco institucional.',
    ultImport: 'há 2 h · 21 entrevistas',
    owner: 'Equipe Setor Público',
    voz: 'técnica · institucional',
    stats: [['Nós do grafo', '143'], ['Problemas críticos', '15'], ['Cards em execução', '6']],
    modulos: ['Problemas', 'Kanban', 'CRM', 'Depoimentos'],
  },
  'NR Brasil': {
    slug: 'nr-brasil',
    resumo: 'Saúde ocupacional com prioridade em triagem, compliance e padronização de laudos. Forte volume de áudio e prontuário.',
    ultImport: 'há 7 min · 18 entrevistas',
    owner: 'Operação clínica',
    voz: 'acolhedora · precisa',
    stats: [['Nós do grafo', '116'], ['Problemas críticos', '9'], ['Cards em execução', '5']],
    modulos: ['Áudios', 'Problemas', 'Kanban', 'CRM'],
  },
  EduVem: {
    slug: 'eduvem',
    resumo: 'Projeto em rascunho para retenção de alunos. O workspace ainda está consolidando clusters de evasão e objeções comerciais.',
    ultImport: 'ontem · 6 entrevistas',
    owner: 'Squad Educação',
    voz: 'didática · próxima',
    stats: [['Nós do grafo', '52'], ['Problemas críticos', '4'], ['Cards em execução', '2']],
    modulos: ['Grafo causal', 'CRM', 'Depoimentos'],
  },
  Discovery: {
    slug: 'discovery',
    resumo: 'Workspace que recebe handoff do Discovery e organiza taxonomias, evidências e transcrições para downstream no Xray.',
    ultImport: 'há 4 min · sync automático',
    owner: 'Pipeline de ingestão',
    voz: 'analítica · investigativa',
    stats: [['Nós do grafo', '167'], ['Problemas críticos', '13'], ['Cards em execução', '8']],
    modulos: ['Importação', 'Áudios', 'Grafo causal', 'Admin'],
  },
}

const PROBLEMAS = [
  { titulo: 'Integração de Sistema',          urg: 'crítico', cor: '#ef4444', score: 95, txt: 'Causa raiz operacional — desacoplamento entre ERP, CRM e financeiro gera retrabalho diário.' },
  { titulo: 'Processos manuais sem rastreio', urg: 'alto',    cor: '#f97316', score: 80, txt: 'Sintoma direto da integração: 14 atividades críticas vivem em planilha solta.' },
  { titulo: 'Atendimento de leads frio',      urg: 'alto',    cor: '#f97316', score: 75, txt: 'Ponte entre comercial e operacional. Lead esfria entre cotação e fechamento.' },
  { titulo: 'Treinamento descontinuado',      urg: 'médio',   cor: '#fbbf24', score: 72, txt: 'Ponte pessoas × qualidade. Turnover gera reaprendizado a cada semestre.' },
] as const

const KANBAN_COLS = [
  { slug: 'backlog', nome: 'Backlog', cor: '#737f94', n: 8 },
  { slug: 'doing',   nome: 'Fazendo', cor: '#00d4ff', n: 4 },
  { slug: 'review',  nome: 'Revisão', cor: '#f59e0b', n: 2 },
  { slug: 'done',    nome: 'Feito',   cor: '#22c55e', n: 5 },
] as const

const KANBAN_CARDS: Record<string, { titulo: string; prio: string; cor: string }[]> = {
  backlog: [
    { titulo: 'Telemetria IoT — piloto 30 máquinas', prio: 'crítica', cor: '#ef4444' },
    { titulo: 'CRM com score de propensão',           prio: 'alta',    cor: '#f97316' },
    { titulo: 'Padronizar contratos rentais',         prio: 'normal',  cor: '#00d4ff' },
  ],
  doing: [
    { titulo: 'Workflow devolução automatizado',      prio: 'crítica', cor: '#ef4444' },
    { titulo: 'Integração ERP × Financeiro',          prio: 'alta',    cor: '#f97316' },
  ],
  review: [
    { titulo: 'Dashboard gerencial v2',                prio: 'alta',    cor: '#f97316' },
  ],
  done: [
    { titulo: 'Auditoria operacional Q1',              prio: 'normal',  cor: '#00d4ff' },
    { titulo: 'Mapeamento entrevistas — 12 pessoas',  prio: 'normal',  cor: '#00d4ff' },
  ],
}

const CONCORRENTES = [
  { nome: 'AutoFlux',   forca: 86, frq: 32, posiciona: 'Mercado regional',        cor: '#ef4444' },
  { nome: 'TechOps',    forca: 74, frq: 41, posiciona: 'Nacional · multi-setor',  cor: '#f97316' },
  { nome: 'ProcessIA',  forca: 62, frq: 58, posiciona: 'Indústria pesada',        cor: '#fbbf24' },
  { nome: 'NeuroBot',   forca: 54, frq: 47, posiciona: 'Industrial',              cor: '#00d4ff' },
] as const

const AUDIOS = [
  { speaker: 'Roberto Lima',  papel: 'Diretor Operações', dur: '18:42', data: '12/04' },
  { speaker: 'Ana Castro',    papel: 'Gestora Comercial', dur: '24:11', data: '12/04' },
  { speaker: 'Pedro Sá',      papel: 'CFO',               dur: '15:38', data: '13/04' },
  { speaker: 'Juliana Rocha', papel: 'Líder de Frota',    dur: '21:05', data: '15/04' },
] as const

const FUNIL = [
  { e: 'Lead',         cor: '#64748b', n: 142 },
  { e: 'Qualificado',  cor: '#00d4ff', n: 78  },
  { e: 'Proposta',     cor: '#3b82f6', n: 41  },
  { e: 'Fechamento',   cor: '#a855f7', n: 18  },
  { e: 'Cliente',      cor: '#22c55e', n: 12  },
] as const

const DEPOIS = [
  { speaker: 'Roberto Lima', tags: ['frota', 'iot', 'manutencao'],   data: '12/04/2026' },
  { speaker: 'Ana Castro',   tags: ['crm', 'ciclo', 'sla'],          data: '12/04/2026' },
  { speaker: 'Pedro Sá',     tags: ['custo', 'roi', 'capex'],        data: '13/04/2026' },
] as const

/* ─── TIMELINE ─────────────────────────────────────────────────────── */

const XS_CYCLE_MS = 104_000

interface NavScene {
  startMs: number
  step: string
  label: string
}

const XS_NAV_SCENES: NavScene[] = [
  { startMs:      0, step: '01', label: 'Abertura · wordmark' },
  { startMs:   5_000, step: '02', label: 'Quote · problemas reais' },
  { startMs:  10_000, step: '03', label: 'Quote · soluções' },
  { startMs:  15_000, step: '04', label: 'Quote · não é IA, é Xray' },
  { startMs:  20_000, step: '05', label: 'Hub · empresas' },
  { startMs:  27_000, step: '06', label: 'Grafo force-directed' },
  { startMs:  34_000, step: '07', label: 'Problemas priorizados' },
  { startMs:  41_000, step: '08', label: 'Eisenhower 2×2' },
  { startMs:  48_000, step: '09', label: 'Kanban' },
  { startMs:  55_000, step: '10', label: 'Concorrentes' },
  { startMs:  62_000, step: '11', label: 'Áudios + waveform' },
  { startMs:  69_000, step: '12', label: 'CRM · funil' },
  { startMs:  76_000, step: '13', label: 'Depoimentos' },
  { startMs:  83_000, step: '14', label: 'Admin · handoff' },
  { startMs:  90_000, step: '15', label: 'Construindo CRM/ERP' },
  { startMs:  97_000, step: '16', label: 'Apps publicadas' },
]

/* ═════════════════════════════════════════════════════════════════════
   HELPERS (componentes reusados pelas cenas)
   ═════════════════════════════════════════════════════════════════════ */

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="xs-browser">
      <div className="xs-browser-bar">
        <div className="xs-browser-dots">
          <i style={{ background: '#ef4444' }} />
          <i style={{ background: '#eab308' }} />
          <i style={{ background: '#22c55e' }} />
        </div>
        <div className="xs-browser-url">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <span>{url}</span>
        </div>
      </div>
      <div className="xs-browser-body">{children}</div>
    </div>
  )
}

function TwText({
  text,
  cycleMs,
  startMs,
  endMs,
  entryDelayMs,
  perWordMs,
  uid,
  className,
}: {
  text: string
  cycleMs: number
  startMs: number
  endMs: number
  entryDelayMs: number
  perWordMs: number
  uid: string
  className: string
}) {
  const words = text.split(/(\s+)/)
  let visibleIdx = 0
  const css: string[] = []
  const spans: React.ReactNode[] = []
  words.forEach((w, i) => {
    if (!w.trim()) {
      spans.push(<span key={i}>{w}</span>)
      return
    }
    const wordStartMs = startMs + entryDelayMs + visibleIdx * perWordMs
    const wordEndMs = endMs - 200
    const wordFadeOutMs = endMs
    const onPct = (wordStartMs / cycleMs) * 100
    const onFullPct = Math.min(100, onPct + 0.05)
    const offStartPct = (wordEndMs / cycleMs) * 100
    const offEndPct = Math.min(100, (wordFadeOutMs / cycleMs) * 100)
    const prePct = Math.max(0, onPct - 0.001)
    const kfName = `xs-tw-${uid}-${visibleIdx}`
    css.push(`@keyframes ${kfName} {
      0% { opacity: 0; }
      ${prePct.toFixed(4)}% { opacity: 0; }
      ${onPct.toFixed(4)}% { opacity: 0; }
      ${onFullPct.toFixed(4)}% { opacity: 1; }
      ${offStartPct.toFixed(4)}% { opacity: 1; }
      ${offEndPct.toFixed(4)}% { opacity: 0; }
      100% { opacity: 0; }
    }`)
    spans.push(
      <span
        key={i}
        className="xs-tw-word"
        style={{
          animationName: kfName,
          animationDuration: `${cycleMs}ms`,
          animationIterationCount: 'infinite',
          animationTimingFunction: 'linear',
          animationFillMode: 'both',
        }}
      >
        {w}
      </span>
    )
    visibleIdx++
  })
  const caretStartMs = startMs + entryDelayMs
  const caretEndMs = endMs
  const caretOnPct = (caretStartMs / cycleMs) * 100
  const caretOffPct = (caretEndMs / cycleMs) * 100
  const caretKf = `xs-tw-caret-${uid}`
  css.push(`@keyframes ${caretKf} {
    0%, ${Math.max(0, caretOnPct - 0.001).toFixed(4)}% { opacity: 0; }
    ${caretOnPct.toFixed(4)}% { opacity: 1; }
    ${caretOffPct.toFixed(4)}% { opacity: 1; }
    ${Math.min(100, caretOffPct + 0.05).toFixed(4)}%, 100% { opacity: 0; }
  }`)
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css.join('\n') }} />
      <span className={className}>
        {spans}
        <span
          className="xs-tw-caret"
          aria-hidden="true"
          style={{
            animationName: caretKf,
            animationDuration: `${cycleMs}ms`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            animationFillMode: 'both',
          }}
        >
          ▌
        </span>
      </span>
    </>
  )
}

function Caption({
  step, title, desc, badge, sceneIdx,
}: { step: string; title: string; desc: string; badge?: string; sceneIdx: number }) {
  const navIdx = sceneIdx + 4
  const startMs = XS_NAV_SCENES[navIdx].startMs
  const nextStartMs = navIdx + 1 < XS_NAV_SCENES.length
    ? XS_NAV_SCENES[navIdx + 1].startMs
    : XS_CYCLE_MS
  const endMs = nextStartMs - 100
  const TITLE_ENTRY_MS = 600
  const TITLE_TYPEWRITER_MS = 1600
  const DESC_ENTRY_MS = TITLE_ENTRY_MS + TITLE_TYPEWRITER_MS + 200
  const titlePerWord = Math.min(140, TITLE_TYPEWRITER_MS / Math.max(1, title.split(/\s+/).length))
  const descPerWord = Math.min(110, 2400 / Math.max(1, desc.split(/\s+/).length))
  return (
    <aside className="xs-cap">
      <div className="xs-cap-step">{step}</div>
      <TwText
        text={title}
        cycleMs={XS_CYCLE_MS}
        startMs={startMs}
        endMs={endMs}
        entryDelayMs={TITLE_ENTRY_MS}
        perWordMs={titlePerWord}
        uid={`s${sceneIdx + 1}t`}
        className="xs-cap-title"
      />
      <TwText
        text={desc}
        cycleMs={XS_CYCLE_MS}
        startMs={startMs}
        endMs={endMs}
        entryDelayMs={DESC_ENTRY_MS}
        perWordMs={descPerWord}
        uid={`s${sceneIdx + 1}d`}
        className="xs-cap-desc"
      />
      {badge && (
        <div className="xs-cap-badge">
          <span className="xs-cap-badge-dot" />
          {badge}
        </div>
      )}
      <div className="xs-cap-sig">
        <span className="xs-cap-sig-line" />
        <span className="xs-cap-sig-text">ai.xray · cinema reel</span>
      </div>
    </aside>
  )
}

function EmpresaShell({
  active,
  children,
}: {
  active: 'dashboard' | 'grafo' | 'problemas' | 'solucoes' | 'kanban' | 'audios' | 'crm' | 'depoimentos' | 'concorrentes'
  children: React.ReactNode
}) {
  const nav = [
    { k: 'grafo',         l: 'Grafo' },
    { k: 'problemas',     l: 'Problemas' },
    { k: 'solucoes',      l: 'Soluções' },
    { k: 'kanban',        l: 'Kanban' },
    { k: 'concorrentes',  l: 'Concorrência' },
    { k: 'audios',        l: 'Áudios' },
    { k: 'crm',           l: 'CRM' },
    { k: 'depoimentos',   l: 'Depoimentos' },
  ] as const
  return (
    <div className="xs-emp-shell">
      <div className="xs-emp-hdr">
        <div className="xs-hdr-logo">
          <span className="xs-aix-ai">ai</span><span className="xs-aix-dot">.</span><span className="xs-aix-xray">xray</span>
          <span className="xs-bread">/ magisatech / {active}</span>
        </div>
        <div className="xs-hdr-user">
          <div className="xs-hdr-name">Fernando Arbache</div>
          <div className="xs-hdr-role">SUPERADMINISTRADOR</div>
        </div>
      </div>
      <div className="xs-emp-grid">
        <aside className="xs-side">
          <div className="xs-side-emp">
            <div className="xs-side-logo">MT</div>
            <div>
              <div className="xs-side-name">MagisaTech</div>
              <div className="xs-side-setor">Tecnologia · Automação</div>
            </div>
          </div>
          <nav className="xs-side-nav">
            {nav.map(n => (
              <span key={n.k} className={`xs-side-link ${active === n.k ? 'xs-side-link-on' : ''}`}>{n.l}</span>
            ))}
          </nav>
        </aside>
        <div className="xs-emp-content">{children}</div>
      </div>
    </div>
  )
}

function AdminShell({
  active,
  children,
}: { active: 'dashboard' | 'empresas'; children: React.ReactNode }) {
  const nav = [
    { k: 'dashboard', l: 'Dashboard' },
    { k: 'empresas',  l: 'Empresas' },
    { k: 'usuarios',  l: 'Usuários' },
    { k: 'conteudos', l: 'Conteúdos' },
    { k: 'embeddings', l: 'Embeddings' },
    { k: 'jobs',       l: 'Jobs' },
  ] as const
  return (
    <div className="xs-emp-shell xs-admin-shell">
      <div className="xs-emp-hdr xs-admin-hdr">
        <div className="xs-hdr-logo">
          <span className="xs-aix-ai">ai</span><span className="xs-aix-dot">.</span><span className="xs-aix-xray">xray</span>
          <span className="xs-bread xs-bread-admin">/ admin / {active}</span>
        </div>
        <div className="xs-hdr-user">
          <div className="xs-hdr-name">Fernando Arbache</div>
          <div className="xs-hdr-role xs-hdr-role-admin">ADMINISTRAÇÃO</div>
        </div>
      </div>
      <div className="xs-emp-grid">
        <aside className="xs-side xs-side-admin">
          <div className="xs-side-emp">
            <div className="xs-side-logo xs-side-logo-admin">AD</div>
            <div>
              <div className="xs-side-name">Admin</div>
              <div className="xs-side-setor">Ecossistema Xray</div>
            </div>
          </div>
          <nav className="xs-side-nav">
            {nav.map(n => (
              <span key={n.k} className={`xs-side-link ${active === n.k ? 'xs-side-link-on xs-side-link-admin-on' : ''}`}>{n.l}</span>
            ))}
          </nav>
        </aside>
        <div className="xs-emp-content xs-admin-content">{children}</div>
      </div>
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   SCENE RENDERERS — 16 cenas, conteúdo idêntico ao v4.
   Cada uma retorna JSX que vai dentro de .icx-scene do shell.
   ═════════════════════════════════════════════════════════════════════ */

function RenderA1() {
  return (
    <div className="xs-type xs-aA1">
      <div className="xs-type-kicker">
        <span className="xs-type-kicker-dot" />
        XRAY · INTELIGÊNCIA EMPRESARIAL
      </div>
      <div className="xs-type-stage">
        <h1 className="xs-wordmark">
          <span className="xs-wm-ai">ai</span>
          <span className="xs-wm-dot">.</span>
          <span className="xs-wm-xray">xray</span>
        </h1>
        <div className="xs-type-sub">Encontre. Diagnostique. Resolva.</div>
      </div>
    </div>
  )
}

function RenderA2() {
  return (
    <div className="xs-type xs-aA2">
      <div className="xs-type-kicker">
        <span className="xs-type-kicker-dot" />
        XRAY · INTELIGÊNCIA EMPRESARIAL
      </div>
      <div className="xs-type-stage">
        <p className="xs-quote-big">
          <span className="xs-qb-line">Quer resolver problemas <span className="xs-qb-em">reais</span></span>
          <span className="xs-qb-line">da sua empresa,</span>
          <span className="xs-qb-line">de qualquer natureza?</span>
          <span className="xs-qb-caret" />
        </p>
      </div>
    </div>
  )
}

function RenderA3() {
  return (
    <div className="xs-type xs-aA3">
      <div className="xs-type-kicker">
        <span className="xs-type-kicker-dot" />
        XRAY · INTELIGÊNCIA EMPRESARIAL
      </div>
      <div className="xs-type-stage">
        <p className="xs-quote-big">
          <span className="xs-qb-line">Encontrar <span className="xs-qb-em">soluções customizadas</span></span>
          <span className="xs-qb-line">que se encaixem</span>
          <span className="xs-qb-line">na sua operação?</span>
          <span className="xs-qb-caret" />
        </p>
      </div>
    </div>
  )
}

function RenderA4() {
  return (
    <div className="xs-type xs-aA4">
      <div className="xs-type-kicker">
        <span className="xs-type-kicker-dot" />
        XRAY · INTELIGÊNCIA EMPRESARIAL
      </div>
      <div className="xs-type-stage xs-type-stage-final">
        <p className="xs-quote-big xs-quote-final">
          <span className="xs-qb-line">Você não precisa de</span>
          <span className="xs-qb-line">uma <span className="xs-qb-strike">IA</span> —</span>
          <span className="xs-qb-line">precisa do <span className="xs-qb-x">Xray</span>.</span>
        </p>
        <div className="xs-closer">
          <div className="xs-closer-mark">X-RAY</div>
          <p className="xs-closer-body">
            entrega o melhor <strong>matemático</strong>, <strong>estatístico</strong>, <strong>financeiro</strong>,
            <strong> tributarista</strong>, <strong>jurídico</strong> e <strong>estratégico</strong> em alguns cliques.
          </p>
          <div className="xs-closer-tag">único e incomparável</div>
        </div>
      </div>
    </div>
  )
}

function RenderS1() {
  const [selected, setSelected] = useState<EmpresaName>('MagisaTech')
  const empresa = EMPRESAS.find((item) => item.nome === selected) ?? EMPRESAS[0]
  const detail = EMPRESA_DETAILS[empresa.nome]
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/hub">
        <div className="xs-hub-mock xs-hub-mock-interactive">
          <div className="xs-emp-hdr">
            <div className="xs-hdr-logo">
              <span className="xs-aix-ai">ai</span><span className="xs-aix-dot">.</span><span className="xs-aix-xray">xray</span>
            </div>
            <div className="xs-hdr-user">
              <div className="xs-hdr-name">Fernando Arbache</div>
              <div className="xs-hdr-role">SUPERADMINISTRADOR</div>
            </div>
          </div>
          <div className="xs-hub-top">
            <p className="xs-sub">{EMPRESAS.length} empresas no ecossistema</p>
            <div className="xs-hub-live">
              <span className="xs-hub-live-dot" />
              clique em uma empresa para abrir o workspace
            </div>
          </div>
          <div className="xs-hub-layout">
            <div className="xs-grid xs-grid--interactive">
              {EMPRESAS.map(e => {
                const isSelected = e.nome === selected
                const workspace = EMPRESA_DETAILS[e.nome]
                return (
                  <button
                    key={e.nome}
                    type="button"
                    className={`xs-card xs-card-button${isSelected ? ' xs-card-selected' : ''}`}
                    style={{ ['--accent' as string]: e.cor }}
                    onClick={() => setSelected(e.nome)}
                    aria-pressed={isSelected}
                  >
                    <div className="xs-card-head">
                      <div className="xs-card-logo" style={{ background: e.cor + '22', color: e.cor, border: `1px solid ${e.cor}55` }}>{e.ini}</div>
                      <span className={`xs-pill xs-pill-${e.status}`}>{e.status}</span>
                    </div>
                    <h3 className="xs-card-name">{e.nome}</h3>
                    <p className="xs-card-setor">setor: {e.setor}</p>
                    <div className="xs-card-meta-row">
                      <span className="xs-card-meta">{workspace.stats[0][1]} nós</span>
                      <span className="xs-card-meta">{workspace.ultImport}</span>
                    </div>
                    <div className="xs-card-cta" style={{ color: e.cor }}>
                      {isSelected ? 'Workspace aberto →' : 'Abrir workspace →'}
                    </div>
                  </button>
                )
              })}
            </div>

            <aside className="xs-hub-detail" style={{ ['--accent' as string]: empresa.cor }}>
              <div className="xs-hub-detail-head">
                <span className="xs-hub-detail-kicker">workspace ativo</span>
                <span className={`xs-pill xs-pill-${empresa.status}`}>{empresa.status}</span>
              </div>
              <div className="xs-hub-detail-titleRow">
                <div className="xs-side-logo" style={{ background: empresa.cor + '20', color: empresa.cor, border: `1px solid ${empresa.cor}55` }}>{empresa.ini}</div>
                <div>
                  <div className="xs-hub-detail-title">{empresa.nome}</div>
                  <div className="xs-hub-detail-path">xray.iconsai.ai/{detail.slug}/grafo</div>
                </div>
              </div>
              <p className="xs-hub-detail-copy">{detail.resumo}</p>
              <div className="xs-hub-detail-meta">
                <div><span>owner</span><strong>{detail.owner}</strong></div>
                <div><span>último import</span><strong>{detail.ultImport}</strong></div>
                <div><span>voz da empresa</span><strong>{detail.voz}</strong></div>
              </div>
              <div className="xs-hub-stats">
                {detail.stats.map(([label, value]) => (
                  <div key={label} className="xs-hub-stat">
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
              <div className="xs-hub-modules">
                {detail.modulos.map((item) => (
                  <span key={item} className="xs-hub-module">{item}</span>
                ))}
              </div>
              <div className="xs-hub-actions">
                <button type="button" className="xs-hub-action xs-hub-action-primary">Abrir grafo</button>
                <button type="button" className="xs-hub-action">Ver CRM</button>
              </div>
            </aside>
          </div>
        </div>
      </BrowserFrame>
      <Caption
        sceneIdx={0}
        step="01 / 12"
        title="Hub de empresas"
        desc="Cada card é uma empresa analisada. Cor primária, setor e status de publicação. O superadmin vê todas; o cliente, apenas a sua."
      />
    </div>
  )
}

function RenderS2() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/grafo">
        <EmpresaShell active="grafo">
          <div className="xs-graph-wrap">
            <div className="xs-graph-filters">
              <span className="xs-chip xs-chip-on">Problemas</span>
              <span className="xs-chip">Oportunidades</span>
              <span className="xs-chip xs-chip-mini">⟳ force layout</span>
              <span className="xs-chip xs-chip-mini">{`◯ nós: 11`}</span>
              <span className="xs-chip xs-chip-mini">{`↔ arestas: 16`}</span>
              <span className="xs-graph-status">Ajustando peso da conexão…</span>
            </div>
            <svg className="xs-svg" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid meet">
              <defs>
                <radialGradient id="haloP" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor="rgba(239,68,68,0.35)" />
                  <stop offset="100%" stopColor="rgba(239,68,68,0)" />
                </radialGradient>
                <radialGradient id="haloC" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor="rgba(0,212,255,0.32)" />
                  <stop offset="100%" stopColor="rgba(0,212,255,0)" />
                </radialGradient>
                <radialGradient id="haloH" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"  stopColor="rgba(168,85,247,0.42)" />
                  <stop offset="100%" stopColor="rgba(168,85,247,0)" />
                </radialGradient>
              </defs>
              <g className="xs-edges-bundle" fill="none">
                <line className="xs-edge xs-edge-w-hi  xs-eA" x1="290" y1="180" x2="158" y2="92"  />
                <line className="xs-edge xs-edge-w-md  xs-eB" x1="290" y1="180" x2="450" y2="90"  />
                <line className="xs-edge xs-edge-w-md  xs-eC" x1="290" y1="180" x2="138" y2="252" />
                <line className="xs-edge xs-edge-w-lo  xs-eD" x1="290" y1="180" x2="442" y2="276" />
                <line className="xs-edge xs-edge-w-md  xs-eE" x1="290" y1="180" x2="498" y2="198" />
                <line className="xs-edge xs-edge-w-lo  xs-eF" x1="290" y1="180" x2="88"  y2="178" />
                <line className="xs-edge xs-edge-w-lo  xs-eK" x1="290" y1="180" x2="232" y2="92"  />
                <line className="xs-edge xs-edge-w-md  xs-eL" x1="290" y1="180" x2="368" y2="252" />
                <line className="xs-edge xs-edge-w-md  xs-eDrag1 xs-edge-onboard" x1="430" y1="156" x2="290" y2="180" />
                <line className="xs-edge xs-edge-w-md  xs-eDrag2 xs-edge-onboard" x1="430" y1="156" x2="498" y2="198" />
                <line className="xs-edge xs-edge-w-lo  xs-eDrag3 xs-edge-onboard" x1="430" y1="156" x2="450" y2="90"  />
                <line className="xs-edge xs-edge-w-lo  xs-eG" x1="158" y1="92"  x2="88"  y2="178" />
                <line className="xs-edge xs-edge-w-lo  xs-eH" x1="450" y1="90"  x2="498" y2="198" />
                <line className="xs-edge xs-edge-w-lo  xs-eI" x1="138" y1="252" x2="442" y2="276" />
                <line className="xs-edge xs-edge-w-lo  xs-eJ" x1="232" y1="92"  x2="158" y2="92"  />
                <line className="xs-edge xs-edge-w-lo  xs-eM" x1="368" y1="252" x2="442" y2="276" />
              </g>
              <g className="xs-edge-labels" fontFamily="JetBrains Mono" fontSize="9" fontWeight={700}>
                <g className="xs-elbl xs-elbl-hi">
                  <rect x="200" y="125" width="36" height="14" rx="3" />
                  <text x="218" y="135" textAnchor="middle">0.89</text>
                </g>
                <g className="xs-elbl xs-elbl-mdH">
                  <rect x="350" y="125" width="36" height="14" rx="3" />
                  <text x="368" y="135" textAnchor="middle">0.62</text>
                </g>
                <g className="xs-elbl xs-elbl-md">
                  <rect x="358" y="172" width="36" height="14" rx="3" />
                  <text x="376" y="182" textAnchor="middle">0.71</text>
                </g>
                <g className="xs-elbl xs-elbl-lo">
                  <rect x="200" y="222" width="36" height="14" rx="3" />
                  <text x="218" y="232" textAnchor="middle">0.34</text>
                </g>
                <g className="xs-elbl xs-elbl-lo2">
                  <rect x="358" y="222" width="36" height="14" rx="3" />
                  <text x="376" y="232" textAnchor="middle">0.42</text>
                </g>
              </g>
              <g className="xs-halos">
                <circle className="xs-halo xs-h1" cx="158" cy="92"  r="28" fill="url(#haloP)" />
                <circle className="xs-halo xs-h4" cx="450" cy="90"  r="26" fill="url(#haloC)" />
                <circle className="xs-halo xs-h7" cx="290" cy="180" r="38" fill="url(#haloH)" />
                <circle className="xs-halo xs-h8" cx="430" cy="156" r="22" fill="url(#haloC)" />
              </g>
              <g className="xs-nodes">
                <g className="xs-node xs-n1"><circle cx="158" cy="92"  r="14" fill="#ef4444" /></g>
                <g className="xs-node xs-n2"><circle cx="138" cy="252" r="11" fill="#ef4444" /></g>
                <g className="xs-node xs-n3"><circle cx="88"  cy="178" r="9"  fill="#f97316" /></g>
                <g className="xs-node xs-n4"><circle cx="450" cy="90"  r="13" fill="#00d4ff" /></g>
                <g className="xs-node xs-n5"><circle cx="442" cy="276" r="10" fill="#00d4ff" /></g>
                <g className="xs-node xs-n6"><circle cx="498" cy="198" r="9"  fill="#22c55e" /></g>
                <g className="xs-node xs-n9"><circle cx="232" cy="92"  r="8"  fill="#fbbf24" /></g>
                <g className="xs-node xs-n10"><circle cx="368" cy="252" r="9" fill="#22c55e" /></g>
                <g className="xs-node xs-n7"><circle cx="290" cy="180" r="18" fill="#a855f7" /></g>
                <g className="xs-node xs-n8 xs-node-drag"><circle cx="430" cy="156" r="11" fill="#00d4ff" /></g>
              </g>
              <g className="xs-svg-labels" fontFamily="Plus Jakarta Sans" fontWeight={700} fill="#eaf0f6">
                <text x="158" y="120" textAnchor="middle" fontSize="9.5" className="xs-nl">Integração</text>
                <text x="232" y="76"  textAnchor="middle" fontSize="9" className="xs-nl">Treino</text>
                <text x="138" y="280" textAnchor="middle" fontSize="9" className="xs-nl">Processos</text>
                <text x="88"  y="200" textAnchor="middle" fontSize="9" className="xs-nl">Leads frios</text>
                <text x="450" y="74"  textAnchor="middle" fontSize="9.5" className="xs-nl">Dashboard</text>
                <text x="498" y="220" textAnchor="middle" fontSize="9" className="xs-nl">Mobile</text>
                <text x="442" y="298" textAnchor="middle" fontSize="9" className="xs-nl">Telemetria</text>
                <text x="368" y="278" textAnchor="middle" fontSize="9" className="xs-nl">Workflow</text>
                <text x="290" y="206" textAnchor="middle" fontSize="10" className="xs-nl xs-nl-hub">MagisaTech</text>
                <text x="430" y="184" textAnchor="middle" fontSize="9" className="xs-nl xs-nl-drag">Onboarding</text>
              </g>
              <g className="xs-cursor-g">
                <circle className="xs-cursor-halo" cx="0" cy="0" r="14" />
                <path className="xs-cursor-arrow" d="M0 0 L0 14 L4 10 L8 16 L10 14 L6 8 L12 8 Z" fill="#eaf0f6" stroke="#0a0e1a" strokeWidth="0.6" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={1}
        step="02 / 12"
        title="Grafo MagisaTech"
        desc="Empresa virou rede: cada nó é um problema, oportunidade, processo ou pessoa. Tamanho = centralidade, cor = urgência. Reorganiza ao vivo conforme novas evidências chegam."
      />
    </div>
  )
}

function RenderS3() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/problemas">
        <EmpresaShell active="problemas">
          <div className="xs-section-title">Problemas por centralidade <span className="xs-section-meta">{PROBLEMAS.length} itens · score 0–100</span></div>
          <div className="xs-problist">
            {PROBLEMAS.map(p => (
              <div key={p.titulo} className="xs-probcard" style={{ borderLeft: `3px solid ${p.cor}` }}>
                <div className="xs-probhead">
                  <span className="xs-probtitle">{p.titulo}</span>
                  <span className="xs-probpill" style={{ background: `${p.cor}1f`, color: p.cor }}>{p.urg}</span>
                  <div className="xs-probbar">
                    <div className="xs-probbar-fill" style={{ width: `${p.score}%`, background: p.cor }} />
                  </div>
                  <span className="xs-probpct">{p.score}%</span>
                </div>
                <p className="xs-probtxt">{p.txt}</p>
              </div>
            ))}
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={2}
        step="03 / 12"
        title="Problemas priorizados"
        desc="Score de centralidade no grafo: o quanto cada problema impacta os outros. Causa raiz primeiro, sintomas depois. Sem achismo."
      />
    </div>
  )
}

function RenderS4() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/solucoes">
        <EmpresaShell active="solucoes">
          <div className="xs-section-title">
            Soluções · Matriz de Eisenhower
            <span className="xs-eisen-flash">Prioridade re-atribuída → Urgente · Importante</span>
          </div>
          <div className="xs-eisen-grid">
            <div className="xs-eisen-quad xs-eq1">
              <div className="xs-eisen-h" style={{ color: '#ef4444' }}>Q1 · Fazer agora</div>
              <div className="xs-eisen-sub">Urgente + Importante</div>
              <div className="xs-soldcard"><div className="xs-soltitle">Padrões de Clientes</div><div className="xs-solmeta"><span className="xs-solroi">15 problemas</span><span className="xs-solroi xs-solroi-hi">ROI fundamental</span></div></div>
              <div className="xs-soldcard"><div className="xs-soltitle">Integração Bancária</div><div className="xs-solmeta"><span className="xs-solroi">6 problemas</span><span className="xs-solroi xs-solroi-hi">ROI muito alto</span></div></div>
              <div className="xs-soldcard xs-soldcard-slot" aria-hidden="true" />
            </div>
            <div className="xs-eisen-quad xs-eq2">
              <div className="xs-eisen-h" style={{ color: '#3b82f6' }}>Q2 · Agendar</div>
              <div className="xs-eisen-sub">Importante, não urgente</div>
              <div className="xs-soldcard"><div className="xs-soltitle">Site + IA Descritiva</div><div className="xs-solmeta"><span className="xs-solroi">5 problemas</span><span className="xs-solroi">ROI alto</span></div></div>
              <div className="xs-soldcard"><div className="xs-soltitle">Dashboard + IA</div><div className="xs-solmeta"><span className="xs-solroi">15 problemas</span><span className="xs-solroi">ROI alto (LP)</span></div></div>
            </div>
            <div className="xs-eisen-quad xs-eq3">
              <div className="xs-eisen-h" style={{ color: '#eab308' }}>Q3 · Fazer depois</div>
              <div className="xs-eisen-sub">Urgente, não importante</div>
              <div className="xs-soldcard"><div className="xs-soltitle">Script de acolhimento</div><div className="xs-solmeta"><span className="xs-solroi">2 problemas</span><span className="xs-solroi">ROI médio</span></div></div>
            </div>
            <div className="xs-eisen-quad xs-eq4">
              <div className="xs-eisen-h" style={{ color: '#64748b' }}>Q4 · Eliminar</div>
              <div className="xs-eisen-sub">Nem urgente, nem importante</div>
              <div className="xs-soldcard"><div className="xs-soltitle">Checklist cadastro</div><div className="xs-solmeta"><span className="xs-solroi">1 problema</span><span className="xs-solroi xs-solroi-lo">ROI baixo</span></div></div>
            </div>
            <div className="xs-eisen-ghost" aria-hidden="true">
              <div className="xs-soldcard xs-soldcard-ghost">
                <div className="xs-soltitle">Onboarding automatizado</div>
                <div className="xs-solmeta">
                  <span className="xs-solroi">8 problemas</span>
                  <span className="xs-solroi xs-solroi-hi">ROI alto</span>
                </div>
              </div>
            </div>
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={3}
        step="04 / 12"
        title="Plano em 4 quadrantes"
        desc="Cada solução cai em urgência × importância, com ROI estimado e quantos problemas resolve. O backlog executável sai pronto daqui."
      />
    </div>
  )
}

function RenderS5() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/kanban">
        <EmpresaShell active="kanban">
          <div className="xs-section-title">Kanban · execução das soluções <span className="xs-section-meta">arraste entre colunas</span></div>
          <div className="xs-kanban">
            {KANBAN_COLS.map(col => (
              <div key={col.slug} className={`xs-kcol xs-kcol-${col.slug}`} style={{ ['--kcol' as string]: col.cor }}>
                <div className="xs-kcol-head">
                  <span className="xs-kcol-swatch" style={{ background: col.cor }} />
                  <span className="xs-kcol-name">{col.nome}</span>
                  <span className={`xs-kcol-n xs-kcol-n-${col.slug}`}>
                    <span className="xs-kn-from">{col.n}</span>
                    <span className="xs-kn-to">
                      {col.slug === 'doing' ? col.n - 1 : col.slug === 'review' ? col.n + 1 : col.n}
                    </span>
                  </span>
                </div>
                <div className="xs-kcol-list">
                  {(KANBAN_CARDS[col.slug] || []).map(c => (
                    <div key={c.titulo} className="xs-kcard">
                      <div className="xs-kcard-prio" style={{ background: c.cor }} />
                      <div className="xs-kcard-title">{c.titulo}</div>
                      <div className="xs-kcard-meta">
                        <span className="xs-kchip" style={{ background: c.cor + '1f', color: c.cor, borderColor: c.cor + '55' }}>{c.prio}</span>
                        <span className="xs-kchip-mono">prazo: 12/05</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="xs-kghost">
              <div className="xs-kcard">
                <div className="xs-kcard-prio" style={{ background: '#ef4444' }} />
                <div className="xs-kcard-title">Workflow devolução automatizado</div>
                <div className="xs-kcard-meta">
                  <span className="xs-kchip" style={{ background: '#ef44441f', color: '#ef4444', borderColor: '#ef444455' }}>crítica</span>
                  <span className="xs-kchip-mono">→ review</span>
                </div>
              </div>
            </div>
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={4}
        step="05 / 12"
        title="Kanban executivo"
        desc="Cada coluna é um estado: backlog, fazendo, revisão, feito. Os cards do Eisenhower viram tarefas reais; arrastar muda o estado e dispara webhooks."
      />
    </div>
  )
}

function RenderS6() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/concorrentes">
        <EmpresaShell active="concorrentes">
          <div className="xs-section-title">Concorrência mapeada <span className="xs-section-meta">força × fraqueza</span></div>
          <div className="xs-conc">
            <div className="xs-conc-h">
              <span>Concorrente</span>
              <span>Posicionamento</span>
              <span>Força</span>
              <span>Fraqueza</span>
              <span>Delta</span>
            </div>
            {CONCORRENTES.map(c => {
              const delta = c.forca - c.frq
              return (
                <div key={c.nome} className="xs-conc-r">
                  <span className="xs-conc-name"><i style={{ background: c.cor }} /> {c.nome}</span>
                  <span className="xs-conc-pos">{c.posiciona}</span>
                  <span className="xs-conc-bar xs-conc-bar-pos">
                    <span className="xs-conc-fill" style={{ width: `${c.forca}%`, background: '#22c55e' }} />
                    <span className="xs-conc-num">{c.forca}</span>
                  </span>
                  <span className="xs-conc-bar xs-conc-bar-neg">
                    <span className="xs-conc-fill" style={{ width: `${c.frq}%`, background: '#ef4444' }} />
                    <span className="xs-conc-num">{c.frq}</span>
                  </span>
                  <span className={`xs-conc-delta ${delta > 0 ? 'xs-conc-delta-pos' : 'xs-conc-delta-neg'}`}>
                    {delta > 0 ? `+${delta}` : delta}
                  </span>
                </div>
              )
            })}
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={5}
        step="06 / 12"
        title="Concorrência em uma tela"
        desc="Tabela comparativa com barras de força e fraqueza por player. O delta mostra onde está o respiro de mercado."
      />
    </div>
  )
}

function RenderS7() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/audios">
        <EmpresaShell active="audios">
          <div className="xs-section-title">Coleta de áudios <span className="xs-section-meta">{AUDIOS.length} gravações · transcrição completa</span></div>
          <div className="xs-aud">
            {AUDIOS.map((a, i) => (
              <div key={a.speaker} className={`xs-aud-r ${i === 0 ? 'xs-aud-playing' : ''}`}>
                <div className="xs-aud-play">
                  {i === 0 ? <span className="xs-aud-pause" /> : <span className="xs-aud-tri" />}
                </div>
                <div className="xs-aud-info">
                  <div className="xs-aud-name">{a.speaker}</div>
                  <div className="xs-aud-papel">{a.papel}</div>
                </div>
                <div className="xs-aud-wave">
                  {Array.from({ length: 36 }).map((_, k) => (
                    <span
                      key={k}
                      className={`xs-aud-bar ${i === 0 ? 'xs-aud-bar-live' : ''}`}
                      style={{ ['--k' as string]: k }}
                    />
                  ))}
                </div>
                <div className="xs-aud-dur">
                  {i === 0 ? (
                    <span className="xs-aud-dur-live" aria-label="Reproduzindo">
                      <span className="xs-aud-dur-m">0</span>
                      <span>:</span>
                      <span className="xs-aud-dur-s">00</span>
                    </span>
                  ) : (
                    a.dur
                  )}
                </div>
                <div className="xs-aud-data">{a.data}</div>
              </div>
            ))}
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={6}
        step="07 / 12"
        title="Voz crua, transcrição rastreável"
        desc="Cada entrevista vira waveform navegável. O speaker em destaque está sendo reproduzido; transcrição e tags ficam linkadas ao grafo."
      />
    </div>
  )
}

function RenderS8() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/crm">
        <EmpresaShell active="crm">
          <div className="xs-section-title">CRM · Funil de vendas</div>
          <div className="xs-funil">
            {FUNIL.map((f, i) => (
              <div
                key={f.e}
                className="xs-funil-stage"
                style={{
                  background: `${f.cor}1f`,
                  border: `1px solid ${f.cor}55`,
                  clipPath: i < FUNIL.length - 1 ? 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)' : undefined,
                  color: f.cor,
                }}
              >
                <div className="xs-funil-name">{f.e}</div>
                <div className="xs-funil-num">{f.n}</div>
              </div>
            ))}
          </div>
          <div className="xs-section-title">Perfis de cliente</div>
          <div className="xs-cliente-grid">
            <div className="xs-cliente"><div className="xs-cliente-t">Construtora regional</div><div className="xs-cliente-d">Obra de médio porte, ciclo 6 meses, demanda recorrente.</div><div className="xs-cliente-c">Ciclo: 6 meses · LTV R$ 240k</div></div>
            <div className="xs-cliente"><div className="xs-cliente-t">Empreiteira pública</div><div className="xs-cliente-d">Licitação, pagamento em 60 dias, contratos longos.</div><div className="xs-cliente-c">Ciclo: 12 meses · LTV R$ 880k</div></div>
            <div className="xs-cliente"><div className="xs-cliente-t">Indústria de mineração</div><div className="xs-cliente-d">Frota dedicada, contrato anual, SLA 24h.</div><div className="xs-cliente-c">Ciclo: 24 meses · LTV R$ 1.4M</div></div>
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={7}
        step="08 / 12"
        title="Funil + perfis"
        desc="Estágios com volume real e perfis de cliente caracterizados — ciclo médio, LTV e SLA esperado. Comercial alinhado ao operacional."
      />
    </div>
  )
}

function RenderS9() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/magisatech/depoimentos">
        <EmpresaShell active="depoimentos">
          <div className="xs-section-title">Transcrições e depoimentos <span className="xs-section-meta">{DEPOIS.length} registros</span></div>
          <div className="xs-tbl">
            <div className="xs-tbl-h">
              <span>Speaker</span><span>Tags</span><span>Data</span>
            </div>
            {DEPOIS.map(d => (
              <div key={d.speaker} className="xs-tbl-r">
                <span className="xs-tbl-c1">{d.speaker}</span>
                <span className="xs-tbl-c2">
                  {d.tags.map(t => <span key={t} className="xs-tag">{t}</span>)}
                </span>
                <span className="xs-tbl-c3">{d.data}</span>
              </div>
            ))}
          </div>
          <div className="xs-quote">
            <span className="xs-quote-mark">“</span>
            A gente sabe que tem frota parada — só não sabe quanto custou na semana passada.
            <span className="xs-quote-author">— Roberto Lima, Diretor de Operações</span>
          </div>
        </EmpresaShell>
      </BrowserFrame>
      <Caption
        sceneIdx={8}
        step="09 / 12"
        title="Voz da empresa"
        desc="Todo problema do grafo é rastreável até a transcrição original. Evidência viva, não opinião — quem falou, quando e em qual contexto."
      />
    </div>
  )
}

function RenderS10() {
  return (
    <div className="xs-scene">
      <BrowserFrame url="xray.iconsai.ai/admin/empresas">
        <AdminShell active="empresas">
          <div className="xs-admin-eyebrow">CATÁLOGO</div>
          <div className="xs-admin-titleRow">
            <h2 className="xs-admin-title">Empresas</h2>
            <div className="xs-disco-badge" title="Integração Discovery → Xray">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><polyline points="12 5 19 12 12 19" />
              </svg>
              <span>← Importado via <strong>Discovery</strong></span>
            </div>
          </div>
          <div className="xs-emp-table">
            <div className="xs-emp-th">
              <span>Empresa</span><span>Setor</span><span>Nós</span><span>Status</span><span>Origem</span>
            </div>
            {EMPRESAS.map(e => (
              <div key={e.nome} className="xs-emp-tr">
                <span className="xs-emp-cell-name"><i className="xs-emp-bullet" style={{ background: e.cor }} /> {e.nome}</span>
                <span className="xs-emp-cell-mono">{e.setor}</span>
                <span className="xs-emp-cell-num">{120 + e.nome.length * 23}</span>
                <span><span className={`xs-pill xs-pill-${e.status}`}>{e.status}</span></span>
                <span className="xs-emp-cell-import">discovery.iconsai.ai</span>
              </div>
            ))}
          </div>
        </AdminShell>
      </BrowserFrame>
      <Caption
        sceneIdx={9}
        step="10 / 12"
        title="Discovery → Xray"
        desc="Cada empresa é importada do Discovery — a plataforma de coleta que alimenta o Xray com transcrições, nós e taxonomias prontos."
        badge="DISCOVERY → XRAY"
      />
    </div>
  )
}

function RenderS11() {
  return (
    <div className="xs-scene">
      <div className="xs-build-stage">
        <div className="xs-build-hero">
          <div className="xs-build-kicker">
            <span className="xs-build-kicker-dot" />
            XRAY · CONSTRUTOR DE IA
          </div>
          <h1 className="xs-build-headline">
            Quer produzir sua solução de IA<br />
            e colocar no ar?
          </h1>
          <p className="xs-build-sub">
            Em poucos cliques, o Xray transforma seu diagnóstico em aplicação publicada.
          </p>
        </div>

        <div className="xs-build-cards">
          <div className="xs-build-card xs-build-card-crm">
            <div className="xs-build-card-head">
              <div className="xs-build-card-icon xs-build-card-icon-crm">CRM</div>
              <div className="xs-build-card-meta">
                <div className="xs-build-card-title">CRM customizado MagisaTech</div>
                <div className="xs-build-card-sub">apps.iconsai.ai/crm-magisatech</div>
              </div>
              <div className="xs-build-card-spin" aria-hidden="true">
                <span className="xs-build-spinner" />
                <span className="xs-build-card-status">Compilando…</span>
              </div>
            </div>
            <div className="xs-build-progress">
              <div className="xs-build-progress-fill xs-build-progress-crm" />
            </div>
            <div className="xs-build-feats">
              <div className="xs-build-feat xs-build-feat-1"><span className="xs-build-feat-check">✓</span> Pipeline de vendas</div>
              <div className="xs-build-feat xs-build-feat-2"><span className="xs-build-feat-check">✓</span> Lead scoring</div>
              <div className="xs-build-feat xs-build-feat-3"><span className="xs-build-feat-check">✓</span> Integração WhatsApp</div>
              <div className="xs-build-feat xs-build-feat-4"><span className="xs-build-feat-check">✓</span> Dashboard executivo</div>
            </div>
          </div>

          <div className="xs-build-card xs-build-card-erp">
            <div className="xs-build-card-head">
              <div className="xs-build-card-icon xs-build-card-icon-erp">ERP</div>
              <div className="xs-build-card-meta">
                <div className="xs-build-card-title">ERP customizado MagisaTech</div>
                <div className="xs-build-card-sub">apps.iconsai.ai/erp-magisatech</div>
              </div>
              <div className="xs-build-card-spin" aria-hidden="true">
                <span className="xs-build-spinner" />
                <span className="xs-build-card-status">Compilando…</span>
              </div>
            </div>
            <div className="xs-build-progress">
              <div className="xs-build-progress-fill xs-build-progress-erp" />
            </div>
            <div className="xs-build-feats">
              <div className="xs-build-feat xs-build-feat-1"><span className="xs-build-feat-check">✓</span> Estoque</div>
              <div className="xs-build-feat xs-build-feat-2"><span className="xs-build-feat-check">✓</span> Financeiro</div>
              <div className="xs-build-feat xs-build-feat-3"><span className="xs-build-feat-check">✓</span> Compras</div>
              <div className="xs-build-feat xs-build-feat-4"><span className="xs-build-feat-check">✓</span> Fiscal NF-e</div>
            </div>
          </div>
        </div>
      </div>
      <Caption
        sceneIdx={10}
        step="11 / 12"
        title="Do diagnóstico ao deploy"
        desc="O Xray pega tudo que aprendeu — grafo, problemas, soluções, voz da empresa — e monta duas aplicações sob medida. Pipeline montando, dependências resolvendo, features marcadas em sequência."
        badge="MAGISATECH · BUILD LIVE"
      />
    </div>
  )
}

function RenderS12() {
  return (
    <div className="xs-scene">
      <div className="xs-pub-stage">
        <div className="xs-pub-headline">
          <span className="xs-pub-eyebrow">PUBLICADO · LIVE</span>
          <h2>Apps no ar.</h2>
          <p>Customizadas pra MagisaTech. Inteligência artificial proprietária do Xray.</p>
        </div>
        <div className="xs-pub-grid">
          <div className="xs-pub-app xs-pub-app-crm">
            <div className="xs-pub-app-head">
              <div className="xs-pub-app-icon xs-pub-app-icon-crm">CRM</div>
              <div className="xs-pub-app-meta">
                <div className="xs-pub-app-name">CRM MagisaTech</div>
                <div className="xs-pub-app-url">apps.iconsai.ai/crm-magisatech</div>
              </div>
              <div className="xs-pub-badge">
                <span className="xs-pub-badge-dot" />
                PUBLICADO ✓
              </div>
            </div>
            <div className="xs-pub-app-stats">
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">47</span><span className="xs-pub-stat-lbl">leads no funil</span></div>
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">12</span><span className="xs-pub-stat-lbl">oportunidades</span></div>
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">R$ 2.4M</span><span className="xs-pub-stat-lbl">pipeline</span></div>
            </div>
            <div className="xs-pub-actions">
              <span className="xs-pub-btn xs-pub-btn-primary">Abrir CRM →</span>
              <span className="xs-pub-btn xs-pub-btn-ghost">Compartilhar</span>
            </div>
          </div>

          <div className="xs-pub-app xs-pub-app-erp">
            <div className="xs-pub-app-head">
              <div className="xs-pub-app-icon xs-pub-app-icon-erp">ERP</div>
              <div className="xs-pub-app-meta">
                <div className="xs-pub-app-name">ERP MagisaTech</div>
                <div className="xs-pub-app-url">apps.iconsai.ai/erp-magisatech</div>
              </div>
              <div className="xs-pub-badge">
                <span className="xs-pub-badge-dot" />
                PUBLICADO ✓
              </div>
            </div>
            <div className="xs-pub-app-stats">
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">R$ 18.7K</span><span className="xs-pub-stat-lbl">em estoque</span></div>
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">23</span><span className="xs-pub-stat-lbl">pedidos hoje</span></div>
              <div className="xs-pub-stat"><span className="xs-pub-stat-num">91%</span><span className="xs-pub-stat-lbl">acurácia inventário</span></div>
            </div>
            <div className="xs-pub-actions">
              <span className="xs-pub-btn xs-pub-btn-primary">Abrir ERP →</span>
              <span className="xs-pub-btn xs-pub-btn-ghost">Compartilhar</span>
            </div>
          </div>
        </div>
        <div className="xs-pub-footer">
          <span className="xs-pub-foot-bolt">⚡</span>
          <span>Construído em <strong>3.2s</strong></span>
          <span className="xs-pub-foot-sep">·</span>
          <span>Customizado pra MagisaTech</span>
          <span className="xs-pub-foot-sep">·</span>
          <span>IA proprietária</span>
        </div>
      </div>
      <Caption
        sceneIdx={11}
        step="12 / 12"
        title="Sua IA, no ar."
        desc="Diagnóstico vira app vivo. URL própria, métricas reais, IA proprietária do Xray rodando atrás. Compartilhar é um clique. É isso que o Xray entrega — fim a fim."
        badge="LIVE · MAGISATECH"
      />
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════════
   SCENES — composição pro shell
   ═════════════════════════════════════════════════════════════════════ */

const RENDERERS: Array<() => React.ReactNode> = [
  RenderA1, RenderA2, RenderA3, RenderA4,
  RenderS1, RenderS2, RenderS3, RenderS4, RenderS5, RenderS6,
  RenderS7, RenderS8, RenderS9, RenderS10, RenderS11, RenderS12,
]

const XRAY_SCENES: ShowcaseScene[] = XS_NAV_SCENES.map((sc, i) => {
  const next = i + 1 < XS_NAV_SCENES.length ? XS_NAV_SCENES[i + 1].startMs : XS_CYCLE_MS
  const Renderer = RENDERERS[i]
  return {
    id: sc.step,
    startMs: sc.startMs,
    durationMs: next - sc.startMs,
    label: sc.label,
    render: () => <Renderer />,
  }
})

/* ═════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL — só compõe o shell
   ═════════════════════════════════════════════════════════════════════ */

export default function Showcase() {
  return (
    <ShowcaseShell
      scenes={XRAY_SCENES}
      accentColor="#00d4ff"
      productEyebrow="XRAY · INTELIGÊNCIA EMPRESARIAL"
      productName="ai.xray"
    />
  )
}
