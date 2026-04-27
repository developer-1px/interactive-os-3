#!/usr/bin/env tsx
/**
 * CSS declaration 빈도 감사 — 축(헬퍼/토큰) 누락 후보 발견.
 *
 * 모든 css`...` 리터럴에서 `prop: value` 단위로 빈도를 집계한다.
 * ${pad(2)} 같은 보간은 audit-ds-css.ts 와 동일하게 placeholder 로 마스킹되어,
 * "동일 보간식 = 동일 키" 로 정규화된다.
 *
 * 출력 3종:
 *   1. raw 값 누수 — placeholder 안 들어간 declaration 중 N회 이상 반복
 *      (= 토큰/헬퍼로 흡수돼야 할 magic value)
 *   2. helper 반복 — placeholder 들어간 동일 declaration 중 N회 이상
 *      (= 같이 쓰이는 묶음 → recipe/mixin 후보)
 *   3. 파일별 helper 적용률 — placeholder declaration 비율 낮은 파일 = 흡수 대상
 *
 * 사용:  pnpm tsx scripts/audit-css-decls.ts [--min N] [--top K]
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parseRules, normDecls } from '../packages/ds/src/style/audit'

const ROOT = new URL('..', import.meta.url).pathname
const SCAN_ROOTS = ['packages/ds/src']

const MIN = Number(process.argv.find((a) => a.startsWith('--min='))?.slice(6)) || 3
const TOP = Number(process.argv.find((a) => a.startsWith('--top='))?.slice(6)) || 40

// ── walk *.style.ts + style/**/*.ts ────────────────────────────────────
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.(style\.ts|styles\.ts)$/.test(name) || p.includes('/style/')) {
      if (/\.ts$/.test(name) && !/\.d\.ts$/.test(name)) out.push(p)
    }
  }
  return out
}

// ── extract css`...` (audit-ds-css.ts 와 동일) ──────────────────────────
function extractCssBlocks(src: string): string[] {
  const out: string[] = []
  const re = /\bcss`/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    const start = m.index + m[0].length
    let i = start
    let depth = 0
    while (i < src.length) {
      const c = src[i]
      if (c === '\\') { i += 2; continue }
      if (c === '$' && src[i + 1] === '{') { depth++; i += 2; continue }
      if (c === '}' && depth > 0) { depth--; i++; continue }
      if (c === '`' && depth === 0) break
      i++
    }
    out.push(src.slice(start, i))
    re.lastIndex = i + 1
  }
  return out
}

function maskInterp(s: string): string {
  let out = ''
  let i = 0
  while (i < s.length) {
    if (s[i] === '$' && s[i + 1] === '{') {
      let depth = 1
      i += 2
      const start = i
      while (i < s.length && depth > 0) {
        if (s[i] === '{') depth++
        else if (s[i] === '}') depth--
        if (depth > 0) i++
      }
      const expr = s.slice(start, i).trim().replace(/\s+/g, ' ')
      const slug = expr.replace(/[^A-Za-z0-9]/g, '_').slice(0, 40)
      out += `__ph_${slug}__`
      i++
    } else {
      out += s[i++]
    }
  }
  return out
}

// ── collect ────────────────────────────────────────────────────────────
type Occ = { file: string; selector: string }
const counter = new Map<string, Occ[]>()
const fileStat = new Map<string, { total: number; withPh: number }>()

const files: string[] = []
for (const r of SCAN_ROOTS) walk(join(ROOT, r), files)

for (const file of files) {
  const src = readFileSync(file, 'utf8')
  const rel = relative(ROOT, file)
  const blocks = extractCssBlocks(src)
  for (const b of blocks) {
    for (const rule of parseRules(maskInterp(b))) {
      const decls = normDecls(rule.body).split(';').filter(Boolean)
      for (const d of decls) {
        const norm = d.trim()
        if (!norm.includes(':')) continue
        const key = norm
        const arr = counter.get(key) ?? []
        arr.push({ file: rel, selector: rule.selector })
        counter.set(key, arr)
        const fs = fileStat.get(rel) ?? { total: 0, withPh: 0 }
        fs.total++
        if (norm.includes('__ph_')) fs.withPh++
        fileStat.set(rel, fs)
      }
    }
  }
}

// ── partition ──────────────────────────────────────────────────────────
const entries = [...counter.entries()].filter(([, occ]) => occ.length >= MIN)
const rawLeak = entries.filter(([k]) => !k.includes('__ph_')).sort((a, b) => b[1].length - a[1].length)
const helperRepeat = entries.filter(([k]) => k.includes('__ph_')).sort((a, b) => b[1].length - a[1].length)

const trim = (s: string, n = 90) => (s.length > n ? s.slice(0, n) + '…' : s)
const fmtKey = (k: string) => k.replace(/__ph_([A-Za-z0-9_]+)__/g, (_, s) => `\${${s.replace(/_/g, '·')}}`)

console.log(`\n🩹 raw value leak — top ${Math.min(TOP, rawLeak.length)} (≥${MIN}회)`)
console.log(`   placeholder 없이 raw 값으로 등장하는 declaration. 토큰/헬퍼 등재 후보.\n`)
for (const [key, occ] of rawLeak.slice(0, TOP)) {
  const files = new Set(occ.map((o) => o.file)).size
  console.log(`   ×${occ.length.toString().padStart(3)}  ${files}f  ${trim(key)}`)
}

console.log(`\n🔁 helper-call repeat — top ${Math.min(TOP, helperRepeat.length)} (≥${MIN}회)`)
console.log(`   동일 helper 호출이 반복 — 단독 declaration 으로 떼어낼 mixin/recipe 후보.\n`)
for (const [key, occ] of helperRepeat.slice(0, TOP)) {
  const files = new Set(occ.map((o) => o.file)).size
  console.log(`   ×${occ.length.toString().padStart(3)}  ${files}f  ${trim(fmtKey(key))}`)
}

const ratio = [...fileStat.entries()]
  .filter(([, s]) => s.total >= 5)
  .map(([f, s]) => ({ file: f, total: s.total, withPh: s.withPh, pct: s.withPh / s.total }))
  .sort((a, b) => a.pct - b.pct)

console.log(`\n📉 helper adoption — bottom 20 (총 declaration ≥5)`)
console.log(`   placeholder 비율 낮은 파일 = raw 값으로 작성된 비중 큰 파일.\n`)
for (const r of ratio.slice(0, 20)) {
  const pct = (r.pct * 100).toFixed(0).padStart(3)
  console.log(`   ${pct}%  ${r.withPh}/${r.total}  ${r.file}`)
}

console.log(`\n— scanned ${files.length} files · ${[...counter.values()].reduce((s, v) => s + v.length, 0)} declarations · keys ${counter.size}\n`)
