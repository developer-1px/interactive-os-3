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

export type Kind = 'controlProps' | 'customArray' | 'childrenDriven' | 'fieldDriven' | 'stateless'

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

const classifyKind = (src: string): Kind => {
  const hasControl = /ControlProps/.test(src) && /\{\s*data\s*,\s*onEvent/.test(src)
  if (hasControl) return 'controlProps'
  // children destructure
  if (/export\s+function\s+\w+\s*\(\s*\{[^}]*\bchildren\b/.test(src)) return 'childrenDriven'
  // custom array prop: entries/bars/items/rows/columns as own prop named in destructure
  if (/export\s+function\s+\w+\s*\(\s*\{\s*(entries|bars|items|rows|columns)\b/.test(src)) return 'customArray'
  // field-driven content widget: many own props, no data/children array
  if (/export\s+function\s+\w+\s*\(\s*\{/.test(src)) return 'fieldDriven'
  return 'stateless'
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
  const isControl = kind === 'controlProps'
  const afterExport = src.split(/\bexport\s+(?:function|const)/)[1] ?? ''
  const slotEscape = /@slot\s+children/.test(src)
  const hasChildren = !slotEscape && /\{[^}]*\bchildren\b[^}]*\}/.test((afterExport.split(/[}]\s*:/)[0] ?? afterExport))
  const selfAttach = /useRoving\b/.test(src) || /composeAxes\b/.test(src) || /onKeyDown\s*=\s*\{/.test(src)
  const rovingRole = /\b(useRoving|composeAxes|navigate\s*\()/.test(src)
  const bannedVariant = /^\s*(variant|size)\s*[?:]/m.test(afterExport)
  const emitsRole = /role=["'][\w-]+["']/.test(src)
    || /aria-\w+=/.test(src)
    || /<(dialog|button|input|select|textarea|details|summary)\b/i.test(src)

  return [
    { id: 'data-prop', label: 'data prop (ControlProps)', pass: isControl },
    { id: 'on-event',  label: 'onEvent 단발 이벤트', pass: isControl },
    { id: 'no-children', label: 'children 금지 (item slot)', pass: !hasChildren },
    { id: 'roving-self-attach', label: 'roving self-attach', pass: !rovingRole || selfAttach },
    { id: 'no-variant', label: 'variant/size prop 없음', pass: !bannedVariant },
    { id: 'aria-role-emit', label: 'ARIA role/semantic emit', pass: emitsRole },
  ]
}

const scanContracts = (root: string, callSiteCounts: Record<string, number>): Contract[] => {
  const uiDir = join(root, 'src/ds/ui')
  const files = walk(uiDir)
  const out: Contract[] = []

  for (const file of files) {
    const src = readFileSync(file, 'utf8')
    const names = extractExportNames(src)
    if (names.length === 0) continue
    // 기본 컴포넌트 이름 = 파일명
    const primary = basename(file, '.tsx')
    const name = names.includes(primary) ? primary : names[0]

    const kind = classifyKind(src)
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
  const scanDirs = ['src/routes', 'src/ds/widgets', 'src/ds/style/widgets']
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
  const uiDir = join(root, 'src/ds/ui')
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
