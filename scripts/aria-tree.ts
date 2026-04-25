#!/usr/bin/env tsx
/**
 * aria-tree — 정적 ARIA 트리 프린터.
 *
 * 핵심 통찰: 각 라우트의 build*Page(state) 함수는 순수 데이터
 * ({entities, relationships})를 반환한다. 브라우저·dev 서버·puppeteer 없이
 * tsx 런타임에서 직접 호출하여 트리를 그릴 수 있다.
 *
 * 사용:
 *   pnpm exec tsx scripts/aria-tree.ts                       # 등록된 모든 라우트
 *   pnpm exec tsx scripts/aria-tree.ts genres-chat           # 특정 슬러그
 *   pnpm exec tsx scripts/aria-tree.ts --write               # __snapshots__/aria-static/<slug>.txt 저장
 *   pnpm exec tsx scripts/aria-tree.ts --json                # JSON 라인으로 위반·노드 출력 (LLM 루프용)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ROOT, type NormalizedData, type Entity, type Event } from '../src/ds'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const outDir = resolve(root, '__snapshots__/aria-static')

// ─── route registry ────────────────────────────────────────────────────────────
// 각 라우트의 build*Page를 import하고 최소 stub state를 공급한다.
// 추가 라우트는 fixture 한 줄을 더하면 된다.

const emptyNav = () => ({
  data: { entities: { [ROOT]: { id: ROOT, data: {} } }, relationships: {} } as NormalizedData,
  onEvent: (_: Event) => {},
})
const noop = () => {}

interface Fixture { slug: string; build: () => Promise<NormalizedData> }

const fixtures: Fixture[] = [
  {
    slug: 'genres-chat',
    build: async () => {
      const { buildChatPage } = await import('../src/routes/genres/chat/build')
      return buildChatPage({
        active: 'ds', draft: '', stream: {},
        setActive: noop, setDraft: noop, send: noop,
        pubNav: emptyNav(), dmNav: emptyNav(),
      })
    },
  },
  {
    slug: 'genres-inbox',
    build: async () => {
      const { buildInboxPage } = await import('../src/routes/genres/inbox/build')
      return buildInboxPage({
        folder: 'inbox', selectedId: '',
        setFolder: noop, setSelected: noop,
        folderNav: emptyNav(),
      })
    },
  },
  {
    slug: 'genres-feed',
    build: async () => {
      const { buildFeedPage } = await import('../src/routes/genres/feed/build')
      return buildFeedPage({
        liked: new Set<string>(), toggle: noop,
        nav: emptyNav(),
      })
    },
  },
]

// ─── ARIA mapping ──────────────────────────────────────────────────────────────
// FlatLayout NodeType → 의미적 ARIA role (실제 Renderer가 박는 태그/role과 동치).

// Renderer 실제 매핑(검증됨):
//  - Main/Nav/Aside: 항상 main/navigation/complementary
//  - Header/Footer: 최상위에서만 banner/contentinfo, 다른 landmark에 중첩되면 generic
//  - Section: accessible name(label/labelledBy/heading) 있을 때만 region
//  - Row/Column/Grid: label|labelledBy 있을 때만 group, 아니면 generic <div>
const LANDMARK_ANCESTORS = new Set(['Main', 'Nav', 'Aside', 'Section'])

function roleOf(type: string, d: any, ancestorTypes: string[]): string {
  const named = Boolean(d.label || d.labelledBy || d.heading)
  switch (type) {
    case 'Main': return 'main'
    case 'Nav': return 'navigation'
    case 'Aside': return 'complementary'
    case 'Header': return ancestorTypes.some(t => LANDMARK_ANCESTORS.has(t)) ? 'generic(header)' : 'banner'
    case 'Footer': return ancestorTypes.some(t => LANDMARK_ANCESTORS.has(t)) ? 'generic(footer)' : 'contentinfo'
    case 'Section': return named ? 'region' : 'generic(section)'
    case 'Row': case 'Column': case 'Grid': return named ? 'group' : `generic(${type.toLowerCase()})`
    case 'Text': return `text:${d.variant ?? 'body'}`
    case 'Ui': return `ui:${d.component ?? '?'}`
    default: return type.toLowerCase()
  }
}

interface Violation { slug: string; id: string; rule: string; detail: string }

function ariaLabelOf(d: any): string | undefined {
  return d?.label ?? d?.props?.['aria-label']
}

function formatNode(id: string, ent: Entity | undefined, depth: number, ancestorTypes: string[]): string {
  const d: any = ent?.data ?? {}
  const type = d.type ?? '?'
  const role = roleOf(type, d, ancestorTypes)
  const label = ariaLabelOf(d)
  const rd = d.roledescription
  const content = typeof d.content === 'string' && d.content.length < 40 ? `“${d.content}”` : ''
  const labelStr = label ? ` "${label}"` : ''
  const rdStr = rd ? ` ⟨${rd}⟩` : ''
  const indent = '  '.repeat(depth)
  return `${indent}${role}${labelStr}${rdStr}${content ? ' ' + content : ''}  · #${id}`
}

function checkNode(slug: string, id: string, ent: Entity | undefined): Violation[] {
  const out: Violation[] = []
  const d: any = ent?.data ?? {}
  const type = d.type
  // R1: landmark 누락 라벨 (Nav/Aside/Section은 label 권장)
  if ((type === 'Nav' || type === 'Aside' || type === 'Section') && !d.label && !d.labelledBy) {
    out.push({ slug, id, rule: 'landmark-needs-label', detail: `${type} without label` })
  }
  // R2: interactive Ui에 접근 가능한 이름 누락
  const interactive = new Set(['Button', 'ToolbarButton', 'Toolbar', 'Listbox', 'Tab', 'TabList', 'Switch', 'Checkbox', 'Input', 'Textarea', 'Select', 'Popover', 'Dialog', 'Sheet'])
  if (type === 'Ui' && interactive.has(d.component)) {
    const props = d.props ?? {}
    const hasName = props['aria-label'] || props['aria-labelledby'] || props.label || (typeof d.content === 'string' && d.content.length > 0)
    if (!hasName) out.push({ slug, id, rule: 'no-accessible-name', detail: `${d.component} has no aria-label/labelledby/content` })
  }
  // R3: raw role escape hatch (props.role 직접 지정 — no-escape-hatches 메모리)
  if (d.props?.role) out.push({ slug, id, rule: 'raw-role-escape-hatch', detail: `role="${d.props.role}"` })
  return out
}

function walk(slug: string, page: NormalizedData, jsonMode: boolean): { lines: string[]; violations: Violation[] } {
  const lines: string[] = []
  const violations: Violation[] = []
  const seen = new Set<string>()
  const recur = (id: string, depth: number, ancestorTypes: string[]) => {
    if (seen.has(id)) { lines.push('  '.repeat(depth) + `↺ cycle ${id}`); return }
    seen.add(id)
    const ent = page.entities[id]
    const t = (ent?.data as any)?.type
    if (id !== ROOT) lines.push(formatNode(id, ent, depth, ancestorTypes))
    // Section.heading 가상 자식 — Renderer가 자동 삽입하는 <h1..h4>
    const heading = (ent?.data as any)?.heading
    if (t === 'Section' && heading) {
      lines.push('  '.repeat(depth + 1) + `text:${heading.variant ?? 'h2'} (auto) “${heading.content ?? ''}”  · #${id}-h`)
    }
    violations.push(...checkNode(slug, id, ent))
    const nextAncestors = id === ROOT ? [] : [...ancestorTypes, t]
    const kids = page.relationships[id] ?? []
    for (const k of kids) recur(k, id === ROOT ? 0 : depth + 1, nextAncestors)
  }
  recur(ROOT, 0, [])
  // orphan 검사: entities 중 트리에 안 들어간 것
  for (const id of Object.keys(page.entities)) {
    if (!seen.has(id) && id !== ROOT) violations.push({ slug, id, rule: 'orphan-entity', detail: 'entity not reachable from ROOT' })
  }
  return { lines, violations }
}

// ─── main ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const WRITE = args.includes('--write')
const JSON_MODE = args.includes('--json')
const filter = args.filter(a => !a.startsWith('--'))

async function main() {
  const targets = filter.length ? fixtures.filter(f => filter.includes(f.slug)) : fixtures
  if (WRITE) mkdirSync(outDir, { recursive: true })

  let allViolations: Violation[] = []
  for (const f of targets) {
    try {
      const page = await f.build()
      const { lines, violations } = walk(f.slug, page, JSON_MODE)
      allViolations.push(...violations)
      if (JSON_MODE) {
        for (const v of violations) process.stdout.write(JSON.stringify(v) + '\n')
      } else {
        const body = `\n========== ${f.slug} ==========\n` + lines.join('\n') +
          (violations.length ? '\n\n-- violations --\n' + violations.map(v => `  ! [${v.rule}] ${v.id}: ${v.detail}`).join('\n') : '\n\n(no violations)')
        process.stdout.write(body + '\n')
        if (WRITE) writeFileSync(resolve(outDir, `${f.slug}.txt`), body + '\n')
      }
    } catch (e: any) {
      process.stderr.write(`[aria-tree] ✗ ${f.slug}: ${e?.message ?? e}\n`)
    }
  }
  if (!JSON_MODE && allViolations.length) {
    process.stderr.write(`\n[aria-tree] ${allViolations.length} violation(s) total\n`)
    process.exit(1)
  }
}

main().catch(e => { process.stderr.write(`[aria-tree] fatal ${e}\n`); process.exit(2) })
