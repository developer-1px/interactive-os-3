import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import type { Plugin } from 'vite'

/**
 * virtual:ds-audit
 *
 * fn/ 레이어의 건강검진 데이터를 빌드타임에 수집해 Atlas 페이지에 공급한다.
 *
 * 세 축:
 *  1. exports   — fn/*.ts 의 named export 목록 + JSDoc 첫 줄
 *  2. callSites — export 이름을 widget/ui/ 에서 grep 한 역인덱스
 *  3. leaks     — style/widgets/** 에서 hex 리터럴 / var(--ds-*) 직접 참조 등 fn/ 우회 흔적
 */

export type FnExport = {
  name: string
  file: string        // fn/values.ts 등
  doc: string         // JSDoc 첫 줄 (없으면 빈 문자열)
  signature: string   // 선언 라인 한 줄
}

export type CallSite = { file: string; line: number; text: string }

export type Leak = {
  file: string
  line: number
  kind: 'hex' | 'css-var' | 'raw-color'
  snippet: string
}

export type AuditData = {
  exports: FnExport[]
  callSites: Record<string, CallSite[]>
  leaks: Leak[]
}

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p)
  }
  return out
}

const EXPORT_RE = /^export\s+(?:const|function)\s+([a-zA-Z_$][\w$]*)/

const parseExports = (root: string): FnExport[] => {
  const fnDir = join(root, 'src/ds/fn')
  const files = readdirSync(fnDir)
    .filter((f) => /\.ts$/.test(f) && f !== 'index.ts')
    .map((f) => join(fnDir, f))

  const out: FnExport[] = []
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n')
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(EXPORT_RE)
      if (!m) continue
      // JSDoc 첫 줄 추출: export 바로 위 블록에서 `* ...` 첫 문장
      let doc = ''
      for (let j = i - 1; j >= 0; j--) {
        const t = lines[j].trim()
        if (t === '' || t === '//') continue
        if (t.startsWith('//')) { doc = t.replace(/^\/\/\s?/, ''); break }
        if (t.endsWith('*/')) {
          // 블록 주석 위로 올라가며 첫 설명 라인 찾기
          for (let k = j; k >= 0; k--) {
            const s = lines[k].trim()
            if (s.startsWith('/**')) break
            const cleaned = s.replace(/^\*\s?/, '').replace(/\*\/$/, '').trim()
            if (cleaned && !cleaned.startsWith('@')) doc = cleaned
          }
          break
        }
        break
      }
      out.push({
        name: m[1],
        file: '/' + relative(root, file),
        doc,
        signature: lines[i].trim().replace(/\s*\{.*$/, '').replace(/\s*=>.*$/, ''),
      })
    }
  }
  return out
}

const indexCallSites = (root: string, names: string[]): Record<string, CallSite[]> => {
  const out: Record<string, CallSite[]> = Object.fromEntries(names.map((n) => [n, []]))
  const scanDirs = ['src/ds/style/widgets', 'src/ds/ui', 'src/ds/style/shell', 'src/ds/style/states']
    .map((d) => join(root, d))
    .filter((d) => {
      try { return statSync(d).isDirectory() } catch { return false }
    })
  const files = scanDirs.flatMap((d) => walk(d))
  const nameSet = new Set(names)
  for (const file of files) {
    const text = readFileSync(file, 'utf8')
    const lines = text.split('\n')
    // import 구문에서 실제로 가져온 이름만 집계 대상으로 제한 → 오탐 최소화
    const imported = new Set<string>()
    const importMatches = text.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]*\/fn[^'"]*['"]/g)
    for (const m of importMatches) {
      for (const raw of m[1].split(',')) {
        const n = raw.trim().split(/\s+as\s+/)[0].trim()
        if (n) imported.add(n)
      }
    }
    if (imported.size === 0) continue
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const name of imported) {
        if (!nameSet.has(name)) continue
        // 호출 형태만 카운트 (타입 참조 제외)
        const re = new RegExp(`\\b${name}\\s*\\(`)
        if (re.test(line)) {
          out[name].push({ file: '/' + relative(root, file), line: i + 1, text: line.trim() })
        }
      }
    }
  }
  return out
}

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/
const VAR_DIRECT_RE = /var\(\s*--ds-[\w-]+/
const COLOR_KEYWORDS = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/

const detectLeaks = (root: string): Leak[] => {
  const widgetsDir = join(root, 'src/ds/style/widgets')
  if (!statSync(widgetsDir).isDirectory()) return []
  const files = walk(widgetsDir)
  const out: Leak[] = []
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n')
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue
      if (HEX_RE.test(line)) {
        out.push({ file: '/' + relative(root, file), line: i + 1, kind: 'hex', snippet: trimmed })
        continue
      }
      if (VAR_DIRECT_RE.test(line) && !/fn\/|palette\.|values\./.test(line)) {
        out.push({ file: '/' + relative(root, file), line: i + 1, kind: 'css-var', snippet: trimmed })
        continue
      }
      if (COLOR_KEYWORDS.test(line)) {
        out.push({ file: '/' + relative(root, file), line: i + 1, kind: 'raw-color', snippet: trimmed })
      }
    }
  }
  return out
}

export default function dsAudit(): Plugin {
  const VIRTUAL = 'virtual:ds-audit'
  const RESOLVED = '\0' + VIRTUAL

  const build = (): AuditData => {
    const root = process.cwd()
    const exports = parseExports(root)
    const callSites = indexCallSites(root, exports.map((e) => e.name))
    const leaks = detectLeaks(root)
    return { exports, callSites, leaks }
  }

  return {
    name: 'ds-audit',
    resolveId(id) { return id === VIRTUAL ? RESOLVED : null },
    load(id) {
      if (id !== RESOLVED) return
      const data = build()
      return `export const audit = ${JSON.stringify(data)}\n`
    },
    handleHotUpdate({ file, server }) {
      if (/src\/ds\/(fn|style|ui)\//.test(file)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
      }
    },
  }
}
