#!/usr/bin/env node
/**
 * 단방향 import 그래프 가드 — packages/ds/src/<layer>/ 의 cross-layer import 가
 * 허용된 방향만 따르는지 검사.
 *
 * PRD: prd-immutable-anchor.md (3-layer reorg) Phase 1
 * 의도: tokens / headless / ui / content / devices 5층 단방향 그래프를 선언으로 강제.
 *
 * 두 모드:
 *   1) 일괄 검사: `node scripts/hooks/guard-import-graph.mjs`
 *   2) PreToolUse(Write|Edit) 훅: stdin JSON 으로 단일 파일만 검사
 *
 * 룰은 프로젝트 진화에 맞춰 갱신. Phase 2 이후 신규 layer (tokens, headless 등) 등장 시
 * RULES 에 추가하면 자동으로 검사 대상에 들어간다 (folder 존재 시에만).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(__dirname, '..', '..')
const DS_SRC = join(REPO_ROOT, 'packages/ds/src')

// 각 layer 가 import 할 수 있는 layer 목록.
// 빈 배열 = 외부 layer import 0건 허용 (외부 dep 만 OK).
// "self" 는 자기 layer 내부.
const RULES = {
  // ─── 현재 (Phase 1) — 카테고리 분기 ─────────────────────────────────
  palette:     { deps: [] },
  foundations: { deps: ['palette'] },
  core:        { deps: [] },
  style:       { deps: ['foundations', 'palette', 'core'] },
  parts:       { deps: ['foundations', 'palette', 'core', 'style'] },
  ui:          { deps: ['foundations', 'palette', 'core', 'style', 'parts'] },
  layout:      { deps: ['foundations', 'palette', 'core', 'style', 'parts', 'ui'] },
  devices:     { deps: ['foundations', 'palette', 'core', 'style', 'ui'] },

  // ─── 목표 (Phase 2 이후) — 레이어 분기 ──────────────────────────────
  // 폴더 신설 시 자동 활성화
  tokens:   { deps: [] },
  headless: { deps: ['tokens'] },
  // ui / content / devices 는 위에 이미 있으니 곱사리. Phase 2 에서 deps 갱신.
  content:  { deps: ['tokens', 'headless', 'ui'] },
}

// 알려진 예외 — 정당한 이유로 허용하는 cross-layer import.
// 형식: { file: '<path-relative-to-DS_SRC>', allow: ['<layer>', ...], reason: '...' }
const KNOWN_EXCEPTIONS = [
  // 예: layout/registry 가 ui/* 전수 import 하는 점은 PRD Phase 2 에서 인덱스 경유로 정리 예정
]

/** 어느 layer 에 속하는 파일인가? `packages/ds/src/<layer>/...` 의 layer 추출 */
function layerOf(absPath) {
  const rel = relative(DS_SRC, absPath)
  if (rel.startsWith('..')) return null
  const parts = rel.split('/')
  return parts[0] ?? null
}

/** import 문의 specifier 에서 ds 내부 layer 를 추론 */
function importedLayer(specifier, fromFile) {
  // 1) 절대 alias `@p/ds/<layer>/...`
  const alias = specifier.match(/^@p\/ds\/([^/]+)/)
  if (alias) return alias[1]

  // 2) 상대 경로 `../<layer>/...` — DS_SRC 기준 normalize
  if (specifier.startsWith('.')) {
    const abs = resolve(dirname(fromFile), specifier)
    const rel = relative(DS_SRC, abs)
    if (rel.startsWith('..')) return null // ds 외부
    return rel.split('/')[0] ?? null
  }
  return null // 외부 패키지
}

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '_demos'])
function* walkTs(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(ent.name)) continue
    const full = join(dir, ent.name)
    if (ent.isDirectory()) yield* walkTs(full)
    else if (/\.(ts|tsx|mts|cts)$/.test(ent.name)) yield full
  }
}

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)[^'"]*\s+from\s+['"]([^'"]+)['"]/g

function checkFile(absPath) {
  const fromLayer = layerOf(absPath)
  if (!fromLayer) return []
  const rule = RULES[fromLayer]
  if (!rule) return [] // 룰이 없는 layer 는 통과

  const content = readFileSync(absPath, 'utf8')
  const violations = []
  let m
  while ((m = IMPORT_RE.exec(content)) !== null) {
    const spec = m[1]
    const target = importedLayer(spec, absPath)
    if (!target) continue
    if (target === fromLayer) continue
    if (!RULES[target]) continue // 알 수 없는 layer (외부)
    if (rule.deps.includes(target)) continue

    const relFile = relative(REPO_ROOT, absPath)
    const isException = KNOWN_EXCEPTIONS.some(
      (e) => e.file === relative(DS_SRC, absPath) && e.allow.includes(target),
    )
    if (isException) continue

    violations.push({
      file: relFile,
      fromLayer,
      target,
      spec,
    })
  }
  return violations
}

// ─── 두 모드 분기 ────────────────────────────────────────────────────────
// 기본: 스캔 모드. PreToolUse 훅으로 쓸 때는 `--hook` 플래그 명시.
const isHookMode = process.argv.includes('--hook')
let stdinData = ''

if (isHookMode) {
  process.stdin.on('data', (c) => (stdinData += c))
  process.stdin.on('end', () => runHook())
} else {
  runScan()
}

function runHook() {
  let input
  try {
    input = JSON.parse(stdinData)
  } catch {
    process.exit(0)
  }
  const file = input?.tool_input?.file_path
  if (!file || !/\.(ts|tsx|mts)$/.test(file)) process.exit(0)
  if (!file.includes('packages/ds/src/')) process.exit(0)

  // Edit 의 경우 디스크 콘텐츠는 아직 옛 버전 — new content 우선
  const newContent = input?.tool_input?.content ?? input?.tool_input?.new_string
  let violations
  if (newContent !== undefined && existsSync(file)) {
    // 변경 후 콘텐츠를 임시로 검사하기 위해 in-memory 검사
    violations = checkContent(newContent, file)
  } else if (existsSync(file)) {
    violations = checkFile(file)
  } else {
    process.exit(0)
  }

  if (violations.length === 0) process.exit(0)

  console.error('🔴 import graph 위반 — packages/ds 단방향 룰 어김')
  for (const v of violations) {
    console.error(`  ${v.file}: ${v.fromLayer}/ ⊅ ${v.target}/  (import: ${v.spec})`)
  }
  console.error(`\n룰: scripts/hooks/guard-import-graph.mjs RULES`)
  process.exit(2)
}

function checkContent(content, filePath) {
  const fromLayer = layerOf(filePath)
  if (!fromLayer) return []
  const rule = RULES[fromLayer]
  if (!rule) return []
  const violations = []
  let m
  // 정규식 lastIndex 새로 init
  const re = /(?:^|\n)\s*(?:import|export)[^'"]*\s+from\s+['"]([^'"]+)['"]/g
  while ((m = re.exec(content)) !== null) {
    const target = importedLayer(m[1], filePath)
    if (!target || target === fromLayer || !RULES[target]) continue
    if (rule.deps.includes(target)) continue
    violations.push({ file: relative(REPO_ROOT, filePath), fromLayer, target, spec: m[1] })
  }
  return violations
}

function runScan() {
  if (!existsSync(DS_SRC)) {
    console.error(`DS_SRC not found: ${DS_SRC}`)
    process.exit(1)
  }
  const allViolations = []
  let scanned = 0
  for (const f of walkTs(DS_SRC)) {
    scanned += 1
    const vs = checkFile(f)
    allViolations.push(...vs)
  }

  console.log(`스캔: ${scanned} 파일 · 위반: ${allViolations.length}`)
  if (allViolations.length === 0) {
    console.log('OK — 단방향 import 그래프 유지됨')
    process.exit(0)
  }
  // 그룹핑
  const byLayer = new Map()
  for (const v of allViolations) {
    const k = `${v.fromLayer}/ ⊅ ${v.target}/`
    if (!byLayer.has(k)) byLayer.set(k, [])
    byLayer.get(k).push(v)
  }
  for (const [k, vs] of byLayer) {
    console.log(`\n🔴 ${k}  (${vs.length}건)`)
    for (const v of vs.slice(0, 10)) {
      console.log(`  ${v.file}  ← ${v.spec}`)
    }
    if (vs.length > 10) console.log(`  ... + ${vs.length - 10}건`)
  }
  process.exit(1)
}
