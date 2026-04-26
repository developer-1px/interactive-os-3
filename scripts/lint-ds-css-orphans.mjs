#!/usr/bin/env node
/**
 * css 누락 감지 — packages/ds/src/style/widgets/** 아래 css 정의 파일이 widgets/index.ts에 등록되지 않은 경우를 차단.
 *
 * widgets/index.ts 가 등록한 css 함수만 widgets() 결과에 포함되므로,
 * 파일이 존재해도 index.ts 에서 import 되지 않으면 런타임에 스타일이 사라진다 (unstyled widget).
 *
 * 사용:  node scripts/lint-ds-css-orphans.mjs           # repo 전체 검사
 *        node scripts/lint-ds-css-orphans.mjs <files…>  # changed-only (pre-commit)
 *
 * exit 0 통과 / exit 1 위반.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const WIDGETS = join(ROOT, 'packages/ds/src/style/widgets')
const INDEX = join(WIDGETS, 'index.ts')

function walk(dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) out.push(...walk(p))
    else if (st.isFile() && p.endsWith('.ts') && p !== INDEX) out.push(p)
  }
  return out
}

// 등록부는 두 군데일 수 있다:
//   1. widgets/index.ts — widgets() cascade layer 등록
//   2. packages/ds/src/index.ts — content cascade layer 등록 (parts 보다 후순위)
// 둘 중 하나라도 import 되면 런타임에 스타일 살아있음.
const indexSrc = readFileSync(INDEX, 'utf8')
const dsRootIndexSrc = readFileSync(join(ROOT, 'packages/ds/src/index.ts'), 'utf8')
const files = walk(WIDGETS)

const orphans = []
for (const file of files) {
  const relWidgets = './' + relative(WIDGETS, file).replace(/\.ts$/, '')
  const relDsRoot = './style/widgets/' + relative(WIDGETS, file).replace(/\.ts$/, '')
  const widgetsRe = new RegExp(`from\\s+['"]${relWidgets.replace(/[.+]/g, '\\$&')}['"]`)
  const rootRe = new RegExp(`from\\s+['"]${relDsRoot.replace(/[.+]/g, '\\$&')}['"]`)
  if (!widgetsRe.test(indexSrc) && !rootRe.test(dsRootIndexSrc)) {
    orphans.push(relWidgets)
  }
}

// changed-only 모드: 인자로 받은 파일과 교집합만 보고
const argv = process.argv.slice(2)
let report = orphans
if (argv.length > 0) {
  const changed = new Set(
    argv.map((f) => './' + relative(WIDGETS, join(ROOT, f)).replace(/\.ts$/, '')),
  )
  report = orphans.filter((o) => changed.has(o))
}

if (report.length === 0) process.exit(0)

console.error('🔴 css 누락 — widgets/index.ts에 등록되지 않은 css 정의 파일:')
for (const rel of report) console.error(`   - packages/ds/src/style/widgets/${rel.replace(/^\.\//, '')}.ts`)
console.error('')
console.error('가이드: packages/ds/src/style/widgets/index.ts 상단에 import 추가 + widgets() 배열에 호출 추가.')
console.error('       파일이 더 이상 필요 없다면 삭제. (오프 상태로 남기지 말 것)')
process.exit(1)
