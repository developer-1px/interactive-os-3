#!/usr/bin/env node
/**
 * lint:ds:flat-layout
 *
 * 정책 — "라우트 페이지는 반드시 FlatLayout(definePage + <Renderer>) 위에 있어야 한다."
 *
 * 깨진 유리창 방지: 어떤 라우트 페이지도 JSX 직접 조립으로 회귀하지 못하도록
 * 정적으로 차단한다. 예외는 없다 — `createFileRoute(...)({ component: X })`로
 * 지정된 모든 페이지 구현 파일은 `<Renderer` 마커를 포함해야 한다.
 *
 * 동작:
 *   1) packages/app/src/routes/*.tsx 중 `createFileRoute` 를 사용하는 entry 파일을 찾는다.
 *   2) 각 entry 의 `component: <Name>` 식별자를 파싱하고,
 *      해당 식별자가 어느 파일에서 import 되었는지 추적한다.
 *   3) 그 파일이 `<Renderer` 마커를 포함하는지 확인한다. 없으면 에러.
 *
 * Limitations:
 *   - `component:` 가 inline 함수( () => ... ) 인 경우는 무시한다 (별도 페이지가 아님).
 *   - re-export chain (한 단계까지)을 따라간다.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ROUTES = resolve(process.cwd(), 'packages/app/src/routes')

function walk(dir) {
  const out = []
  for (const e of readdirSync(dir)) {
    const p = join(dir, e)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (e.endsWith('.tsx')) out.push(p)
  }
  return out
}

function readSrc(p) {
  try { return readFileSync(p, 'utf8') } catch { return '' }
}

/** "./genres/inbox/Inbox" → 절대 파일 경로 (.tsx 시도) */
function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.') && !spec.startsWith('/')) return null
  const base = resolve(dirname(fromFile), spec)
  for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts']) {
    const candidate = base.endsWith(ext) ? base : base + ext
    try { if (statSync(candidate).isFile()) return candidate } catch { /* continue */ }
  }
  return null
}

/** 파일에서 `import { A, B } from './x'` 의 매핑 { A: resolvedPath, ... } 추출 */
function importMap(file, src) {
  const out = {}
  const re = /import\s+(?:type\s+)?(?:\{([^}]+)\}|(\w+))\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src))) {
    const named = m[1], def = m[2], spec = m[3]
    const target = resolveImport(file, spec)
    if (!target) continue
    if (def) out[def] = target
    if (named) {
      for (const part of named.split(',')) {
        const id = part.trim().split(/\s+as\s+/).pop()?.trim()
        if (id) out[id] = target
      }
    }
  }
  return out
}

/** 한 단계 re-export 추적: target 파일에서 `export { Name } from './x'` 가 있으면 따라간다. */
function followReExport(targetFile, name) {
  const src = readSrc(targetFile)
  const re = /export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src))) {
    const names = m[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim())
    if (names.includes(name)) {
      const next = resolveImport(targetFile, m[2])
      if (next) return next
    }
  }
  return targetFile
}

function isFlatLayoutPage(file) {
  const src = readSrc(file)
  // <Renderer 마커가 곧 FlatLayout 의 증거 — definePage 만으로는 부족하다 (build.tsx 제외).
  return /<Renderer\b/.test(src)
}

const violations = []
const okCount = []

const entryFiles = readdirSync(ROUTES)
  .filter(f => f.endsWith('.tsx'))
  .map(f => join(ROUTES, f))
  .filter(f => /createFileRoute\b/.test(readSrc(f)))

for (const entry of entryFiles) {
  const src = readSrc(entry)
  // component: <Identifier>  (inline arrow/function 은 패스)
  const compMatch = src.match(/component\s*:\s*([A-Z][A-Za-z0-9_]*)\b/)
  if (!compMatch) continue
  const compName = compMatch[1]
  // __root__ 은 redirect/Outlet 셸이라 제외
  if (entry.endsWith('__root__.tsx') || entry.endsWith('__root.tsx')) continue

  const imports = importMap(entry, src)
  let target = imports[compName]
  if (!target) {
    // 같은 파일 안에 정의된 component — entry 파일 자체가 페이지 본문이다.
    // `function CompName(` 또는 `const CompName =` 패턴이 있으면 entry 자체를 검사.
    const reLocal = new RegExp(`(?:function|const|let|var)\\s+${compName}\\b`)
    if (reLocal.test(src)) {
      target = entry
    } else {
      continue
    }
  } else {
    // re-export 한 단계 따라가기
    target = followReExport(target, compName)
  }

  if (isFlatLayoutPage(target)) {
    okCount.push({ entry, target, compName })
  } else {
    violations.push({ entry, target, compName })
  }
}

const rel = (p) => p.replace(process.cwd() + '/', '')

if (violations.length === 0) {
  console.log(`✅ flat-layout: 모든 라우트 페이지 ${okCount.length}개가 FlatLayout(<Renderer>) 위에 있습니다.`)
  process.exit(0)
}

console.log('🔴 flat-layout 위반 — 라우트 페이지는 반드시 definePage + <Renderer> 위에 있어야 합니다.\n')
for (const v of violations) {
  console.log(`  ❌ ${rel(v.entry)}`)
  console.log(`     → component: ${v.compName} (${rel(v.target)})`)
  console.log(`     → <Renderer> 마커 없음. JSX 직접 조립 금지 — definePage 로 변환 필요.`)
}
console.log(`\n요약 — 위반 ${violations.length}건 / 정상 ${okCount.length}건`)
console.log('예외 없음. "broken window" 정책 (LLM 회귀 차단).')
process.exit(1)
