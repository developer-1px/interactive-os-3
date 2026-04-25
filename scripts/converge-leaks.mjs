#!/usr/bin/env node
// 1차 소급 적용: widget의 raw var(--ds-*) → 이미 존재하는 fn 호출로 치환.
// 신규 fn 헬퍼 도입 없이 안전하게 색·radius만 수렴.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = 'src/ds/style/widgets'

// 토큰명(--ds- 뒤) → 치환 표현. 정확히 `var(--ds-NAME)` 매치, 뒤에 `-`이 오면 매치 안 됨.
const REPLACEMENTS = [
  ['accent-on',  `\${onAccent()}`,         'onAccent'],
  ['accent',     `\${accent()}`,           'accent'],
  ['border',     `\${border()}`,           'border'],
  ['muted',      `\${muted()}`,            'muted'],
  ['bg',         `\${bg()}`,               'bg'],
  ['fg',         `\${fg()}`,               'fg'],
  ['danger',     `\${status('danger')}`,   'status'],
  ['success',    `\${status('success')}`,  'status'],
  ['warning',    `\${status('warning')}`,  'status'],
  ['radius-sm',  `\${radius('sm')}`,       'radius'],
  ['radius-md',  `\${radius('md')}`,       'radius'],
  ['radius-lg',  `\${radius('lg')}`,       'radius'],
  ['radius-pill',`\${radius('pill')}`,     'radius'],
]

const walk = (dir, out = []) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/\.tsx?$/.test(e.name)) out.push(p)
  }
  return out
}

const findFnImport = (src) => {
  const re = /import\s*\{([^}]+)\}\s*from\s*(['"][^'"]*\/fn(?:['"]|\/[^'"]*['"]))\s*;?/
  const m = src.match(re)
  if (!m) return null
  return { full: m[0], names: m[1].split(',').map(s => s.trim()).filter(Boolean), from: m[2] }
}

const ensureImports = (src, needed) => {
  const cur = findFnImport(src)
  if (cur) {
    const have = new Set(cur.names.map(n => n.split(/\s+as\s+/)[0]))
    const add = [...needed].filter(n => !have.has(n))
    if (add.length === 0) return src
    const merged = [...cur.names, ...add].sort().join(', ')
    return src.replace(cur.full, `import { ${merged} } from ${cur.from}\n`)
  }
  // fn import가 없는 widget. 깊이별 상대경로 추정 ../../../fn (widgets/X/file.ts 기준)
  const rel = `'../../../fn'`
  const line = `import { ${[...needed].sort().join(', ')} } from ${rel}`
  if (/^import /m.test(src)) {
    return src.replace(/^((?:import .*(?:\n|$))+)/m, `$1${line}\n`)
  }
  return `${line}\n${src}`
}

const convert = (src) => {
  const lines = src.split('\n')
  const used = new Set()
  let count = 0
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const t = line.trim()
    if (t.startsWith('//') || t.startsWith('*')) continue
    for (const [token, repl, fn] of REPLACEMENTS) {
      // 정확 매치: var(--ds-TOKEN) — TOKEN 뒤가 ) 또는 공백
      const re = new RegExp(`var\\(\\s*--ds-${token}\\s*\\)`, 'g')
      if (re.test(line)) {
        line = line.replace(re, repl)
        used.add(fn)
        count++
      }
    }
    lines[i] = line
  }
  return { src: lines.join('\n'), used: [...used], count }
}

const files = walk(ROOT)
let touched = 0
let total = 0
for (const file of files) {
  const orig = readFileSync(file, 'utf8')
  const { src, used, count } = convert(orig)
  if (count === 0) continue
  const out = used.length > 0 ? ensureImports(src, new Set(used)) : src
  writeFileSync(file, out)
  touched++
  total += count
  console.log(`✓ ${file.replace('src/ds/style/widgets/', '')} +${count} (${used.join(',')})`)
}
console.log(`\n${touched} files, ${total} leaks converged`)
