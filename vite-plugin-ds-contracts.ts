import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, basename } from 'node:path'
import type { Plugin } from 'vite'

/**
 * virtual:ds-contracts
 *
 * ds/ui/ 컴포넌트의 "데이터 주도 계약" 정합성을 감사한다.
 *
 * 대상: data 를 다루는 ui 컴포넌트 전체 (ControlProps/커스텀배열/children/필드).
 * 판정: 각 컴포넌트를 분파로 분류하고, canonical(ControlProps) 정합성을
 *       체크리스트로 점수화해 Catalog 페이지에 공급한다.
 */

// Tier = 폴더 경로 (단일 진실 원천, packages/ds/src/headless/INVARIANTS.md 참조).
// 폴더는 `N-<kind>` 포맷 (예: 1-indicator, 8-layout) — 숫자가 의존성 위계를 명시.
// drift = ui/ 직속 또는 미분류 폴더 — lint 또는 tier 폴더로 이동 대상.
export type Kind =
  | 'indicator'     // 시각 토큰: 다른 컴포넌트의 슬롯으로
  | 'action'        // 단일 탭 액션: Button·Switch·Progress
  | 'input'         // 폼 값을 갖는 단일 입력
  | 'collection'    // data zone: CollectionProps={data,onEvent} + useRoving
  | 'composite'     // composition roving: children:ReactNode + useRovingDOM
  | 'overlay'       // surface: Dialog/Disclosure/Tooltip/CommandPalette
  | 'pattern'       // domain content / data viz
  | 'layout'        // primitive: Row/Column/Grid/Carousel
  | 'drift'         // 미분류 — tier 폴더 외부

export type ContractCheck = {
  id: string
  label: string
  pass: boolean
  note?: string
}

export type Contract = {
  name: string
  file: string
  kind: Kind
  role: string | null             // emit 하는 대표 role (복수면 첫 번째)
  propsSignature: string          // 선언 라인
  checks: ContractCheck[]
  score: number                   // pass / total (0..1)
  callSites: number               // 소비처 파일 수
}

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx$/.test(e.name)) out.push(p)
  }
  return out
}

const TIER_KINDS = new Set<Kind>([
  'indicator', 'action', 'input', 'collection', 'composite', 'overlay', 'pattern', 'layout',
])

// folder = tier 의 단일 진실 원천. 폴더 포맷은 `N-<kind>` (예: 1-indicator).
// tier 폴더 외부(ui/ 직속 또는 미분류 폴더)는 drift.
const classifyKind = (file: string): Kind => {
  const m = file.match(/\/ui\/(\d+-)?([a-z]+)\//)
  if (!m) return 'drift'
  const kind = m[2] as Kind
  return TIER_KINDS.has(kind) ? kind : 'drift'
}

const extractRole = (src: string): string | null => {
  const m = src.match(/role=["']([\w-]+)["']/)
  return m ? m[1] : null
}

const extractPropsSig = (src: string, name: string): string => {
  const re = new RegExp(`export\\s+(?:function|const)\\s+${name}\\b[^{]*`)
  const m = src.match(re)
  return m ? m[0].trim().replace(/\s+/g, ' ') : ''
}

const extractExportNames = (src: string): string[] => {
  const out: string[] = []
  for (const m of src.matchAll(/^export\s+(?:function|const)\s+([A-Z][\w]*)/gm)) {
    out.push(m[1])
  }
  return out
}

const buildChecks = (src: string, kind: Kind): ContractCheck[] => {
  const afterExport = src.split(/\bexport\s+(?:function|const)/)[1] ?? ''
  const hasCollectionProps = /\bCollectionProps\b/.test(src) && /\{\s*data\b/.test(src)
  const hasUseRoving = /\buseRoving\b/.test(src)
  const hasUseRovingDOM = /\buseRovingDOM\b/.test(src)
  const bannedVariant = /^\s*(variant|size)\s*[?:]/m.test(afterExport)
  const emitsRole = /role=["'][\w-]+["']/.test(src)
    || /aria-\w+=/.test(src)
    || /<(dialog|button|input|select|textarea|details|summary|ol|ul|li|figure|figcaption|meter|progress|article|nav|header|footer|section)\b/i.test(src)

  // tier 별 계약 — folder = tier 가설을 코드가 따르는지.
  const noVariant: ContractCheck = { id: 'no-variant', label: 'variant/size prop 없음', pass: !bannedVariant }
  const ariaEmit:  ContractCheck = { id: 'aria-role-emit', label: 'ARIA role/semantic emit', pass: emitsRole }
  const noRoving:  ContractCheck = { id: 'no-roving', label: 'roving 무관', pass: !hasUseRoving && !hasUseRovingDOM }

  const tierContract: Record<Kind, ContractCheck[]> = {
    indicator: [noRoving, noVariant, ariaEmit],
    action: [
      { id: 'native-action',  label: '네이티브 button/input wrap',         pass: /<(button|input)\b/i.test(src) },
      noVariant, ariaEmit,
    ],
    input: [
      { id: 'native-input',   label: '네이티브 input/select/textarea wrap', pass: /<(input|select|textarea|meter|progress)\b/i.test(src) },
      noVariant, ariaEmit,
    ],
    collection: [
      { id: 'data-prop',      label: 'CollectionProps + {data, onEvent}',  pass: hasCollectionProps },
      { id: 'roving',         label: 'useRoving 사용',                     pass: hasUseRoving },
      noVariant, ariaEmit,
    ],
    composite: [
      { id: 'roving-dom',     label: 'useRovingDOM 사용',                  pass: hasUseRovingDOM || /role=["']group["']|role=["']row["']/.test(src) },
      noVariant, ariaEmit,
    ],
    overlay: [
      { id: 'native-surface', label: '네이티브 dialog/popover/details',    pass: /<(dialog|details)\b|popover=/i.test(src) || /role=["'](dialog|tooltip|alertdialog)["']/.test(src) },
      noVariant,
    ],
    pattern: [noRoving, noVariant, ariaEmit],
    layout: [noRoving, noVariant],
    drift: [
      { id: 'in-tier-folder', label: 'tier 폴더 안에 있어야 함',            pass: false },
    ],
  }

  return tierContract[kind]
}

const scanContracts = (root: string, callSiteCounts: Record<string, number>): Contract[] => {
  const uiDir = join(root, 'packages/ds/src/ui')
  const files = walk(uiDir)
  const out: Contract[] = []

  for (const file of files) {
    const src = readFileSync(file, 'utf8')
    const names = extractExportNames(src)
    if (names.length === 0) continue
    // 기본 컴포넌트 이름 = 파일명
    const primary = basename(file, '.tsx')
    const name = names.includes(primary) ? primary : names[0]

    const kind = classifyKind(file)
    const role = extractRole(src)
    const propsSignature = extractPropsSig(src, name)
    const checks = buildChecks(src, kind)
    const pass = checks.filter((c) => c.pass).length
    const score = pass / checks.length

    out.push({
      name,
      file: '/' + relative(root, file),
      kind,
      role,
      propsSignature,
      checks,
      score,
      callSites: callSiteCounts[name] ?? 0,
    })
  }
  return out
}

const countCallSites = (root: string, names: string[]): Record<string, number> => {
  const out: Record<string, number> = Object.fromEntries(names.map((n) => [n, 0]))
  const scanDirs = ['packages/app/src/routes', 'packages/ds/src/widgets', 'packages/ds/src/style/widgets']
    .map((d) => join(root, d))
    .filter((d) => { try { return statSync(d).isDirectory() } catch { return false } })
  const files = scanDirs.flatMap((d) => walkAll(d))
  const nameSet = new Set(names)
  const seen: Record<string, Set<string>> = {}
  for (const f of files) {
    const text = readFileSync(f, 'utf8')
    const imported = new Set<string>()
    for (const m of text.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]*(?:ds|ds\/ui)[^'"]*['"]/g)) {
      for (const raw of m[1].split(',')) {
        const n = raw.trim().split(/\s+as\s+/)[0].trim()
        if (n) imported.add(n)
      }
    }
    for (const n of imported) {
      if (!nameSet.has(n)) continue
      const re = new RegExp(`<${n}[\\s/>]`)
      if (re.test(text)) {
        (seen[n] ??= new Set()).add(f)
      }
    }
  }
  for (const n of names) out[n] = seen[n]?.size ?? 0
  return out
}

const walkAll = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walkAll(p, out)
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p)
  }
  return out
}

export const buildContracts = (root: string): Contract[] => {
  const uiDir = join(root, 'packages/ds/src/ui')
  const files = walk(uiDir)
  const names: string[] = []
  for (const f of files) {
    for (const n of extractExportNames(readFileSync(f, 'utf8'))) names.push(n)
  }
  const callSiteCounts = countCallSites(root, names)
  return scanContracts(root, callSiteCounts)
}

export default function dsContracts(): Plugin {
  const VIRTUAL = 'virtual:ds-contracts'
  const RESOLVED = '\0' + VIRTUAL

  return {
    name: 'ds-contracts',
    resolveId(id) { return id === VIRTUAL ? RESOLVED : null },
    load(id) {
      if (id !== RESOLVED) return
      const contracts = buildContracts(process.cwd())
      return `export const contracts = ${JSON.stringify(contracts)}\n`
    },
    handleHotUpdate({ file, server }) {
      if (/src\/ds\/ui\//.test(file) || /src\/routes\//.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
