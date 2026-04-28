#!/usr/bin/env tsx
/**
 * CSS 자가 수렴 루프 — audit-css-decls 가 발견한 raw 누수 중
 * 1:1 토큰 매핑이 확실한 케이스만 codemod 로 흡수한다.
 *
 * 현재 흡수 규칙:
 *   - font-weight: 400 → ${weight('regular')}
 *   - font-weight: 500 → ${weight('medium')}
 *   - font-weight: 600 → ${weight('semibold')}
 *   - font-weight: 700 → ${weight('bold')}
 *   - font-weight: 800 → ${weight('extrabold')}
 *
 * 다른 raw 값(display:flex·margin:0 등)은 mixin 설계가 필요해 자동화 ❌.
 * 새 규칙 추가는 RULES 배열에만 — codemod 본체는 1곳.
 *
 * 사용:  pnpm tsx scripts/converge-css.ts          # dry-run
 *        pnpm tsx scripts/converge-css.ts --apply  # 실제 적용
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { execSync } from 'node:child_process'

const ROOT = new URL('..', import.meta.url).pathname
const APPLY = process.argv.includes('--apply')

type Rule = { match: RegExp; replace: string | ((...args: string[]) => string); importName: string }

const weightMap: Record<string, string> = {
  '400': 'regular', '500': 'medium', '600': 'semibold', '700': 'bold', '800': 'extrabold',
}
const RULES: Rule[] = [
  ...Object.entries(weightMap).map(([n, name]) => ({
    match: new RegExp(`font-weight:\\s*${n}\\s*;`, 'g'),
    replace: `font-weight: \${weight('${name}')};`,
    importName: 'weight',
  })),
  // 원형/full pill — 50% 금지, pill 토큰으로 통일 (9999px 캡)
  {
    match: /border-radius:\s*(?:50%|9999px|999px)\s*;/g,
    replace: `border-radius: \${radius('pill')};`,
    importName: 'radius',
  },
  // text color 의 dim(N) → role-based text(role)
  // N 값에 따른 매핑은 의미를 보고 결정 — 같은 수치라도 의미 다르면 별 role 로 분기 가능
  {
    match: /color:\s*\$\{dim\((\d+)\)\}\s*;/g,
    replace: (m: string, n: string) => {
      const v = Number(n)
      const role = v <= 60 ? 'mute' : v <= 75 ? 'subtle' : 'default'
      return `color: \${text('${role}')};`
    },
    importName: 'text',
  },
  {
    match: /border-color:\s*\$\{dim\(\d+\)\}\s*;/g,
    replace: `border-color: \${border('subtle')};`,
    importName: 'border',
  },
  // neutral(N) 직접 매핑 — palette index → semantic role
  {
    match: /color:\s*\$\{neutral\((\d)\)\}\s*;/g,
    replace: (_m: string, n: string) => {
      const role = n === '9' ? 'strong' : n === '8' ? 'default' : n === '7' ? 'subtle' : 'mute'
      return `color: \${text('${role}')};`
    },
    importName: 'text',
  },
  {
    match: /background(?:-color)?:\s*\$\{neutral\(([123])\)\}\s*;/g,
    replace: (_m: string, n: string) => {
      const role = n === '1' ? 'subtle' : n === '2' ? 'muted' : 'raised'
      return `background: \${surface('${role}')};`
    },
    importName: 'surface',
  },
  // tint(accent(), N) → accentTint(role) — N 값에 따른 의미 매핑
  {
    match: /\$\{tint\(accent\(\),\s*(\d+)\)\}/g,
    replace: (_m: string, n: string) => {
      const v = Number(n)
      const role = v <= 8 ? 'softest' : v <= 14 ? 'soft' : v <= 25 ? 'medium' : v <= 50 ? 'border' : v <= 70 ? 'glow' : 'strong'
      return `\${accentTint('${role}')}`
    },
    importName: 'accentTint',
  },
  // tint('CanvasText'|'Canvas', N) → surfaceTint(role)
  {
    match: /\$\{tint\(['"]CanvasText['"],\s*(\d+)\)\}/g,
    replace: (_m: string, n: string) => {
      const role = Number(n) <= 5 ? 'glass' : 'overlay'
      return `\${surfaceTint('${role}')}`
    },
    importName: 'surfaceTint',
  },
  {
    match: /\$\{tint\(['"]Canvas['"],\s*\d+\)\}/g,
    replace: `\${surfaceTint('highlight')}`,
    importName: 'surfaceTint',
  },
  // tint(status('tone'), N) and `tint(`${status('tone')}`, N) → statusTint(tone, role)
  {
    match: /\$\{tint\(status\(['"](success|warning|danger)['"]\),\s*(\d+)\)\}/g,
    replace: (_m: string, tone: string, n: string) => {
      const v = Number(n)
      const role = v <= 20 ? 'soft' : v <= 50 ? 'border' : 'medium'
      return `\${statusTint('${tone}', '${role}')}`
    },
    importName: 'statusTint',
  },
  // 백틱 nested 형: `tint(`${status('danger')}`, N)`
  {
    match: /\$\{tint\(`\$\{status\(['"](success|warning|danger)['"]\)\}`,\s*(\d+)\)\}/g,
    replace: (_m: string, tone: string, n: string) => {
      const v = Number(n)
      const role = v <= 20 ? 'soft' : v <= 50 ? 'border' : 'medium'
      return `\${statusTint('${tone}', '${role}')}`
    },
    importName: 'statusTint',
  },
  // dim(N) — color 매핑 끝, 나머지는 currentTint role (background/shadow/gradient stop)
  {
    match: /\$\{dim\((\d+)\)\}/g,
    replace: (_m: string, n: string) => {
      const v = Number(n)
      const role = v <= 3 ? 'subtle' : v <= 8 ? 'soft' : v <= 15 ? 'medium' : v <= 60 ? 'strong' : 'deep'
      return `\${currentTint('${role}')}`
    },
    importName: 'currentTint',
  },
  // bare neutral() = neutral(9) = text('strong')
  {
    match: /color:\s*\$\{neutral\(\)\}\s*;/g,
    replace: `color: \${text('strong')};`,
    importName: 'text',
  },
  // mix(color, 70, 'CanvasText') — 그라데이션 딥 스탑 → gradientDeep(color)
  // accent / status('tone') 두 형태 모두 처리. 백틱 nested 형도.
  {
    match: /\$\{mix\(accent\(\),\s*70,\s*['"]CanvasText['"]\)\}/g,
    replace: `\${gradientDeep(accent())}`,
    importName: 'gradientDeep',
  },
  {
    match: /\$\{mix\(`\$\{accent\(\)\}`,\s*70,\s*['"]CanvasText['"]\)\}/g,
    replace: `\${gradientDeep(accent())}`,
    importName: 'gradientDeep',
  },
  {
    match: /\$\{mix\(status\(['"](success|warning|danger)['"]\),\s*70,\s*['"]CanvasText['"]\)\}/g,
    replace: (_m: string, tone: string) => `\${gradientDeep(status('${tone}'))}`,
    importName: 'gradientDeep',
  },
  // mix(status('tone'), 4) — Canvas 와 4% 블렌드 = soft status surface
  {
    match: /\$\{mix\(status\(['"](success|warning|danger)['"]\),\s*\d+\)\}/g,
    replace: (_m: string, tone: string) => `\${statusTint('${tone}', 'soft')}`,
    importName: 'statusTint',
  },
  // font+weight 페어 → typography(role) — 같은 줄 또는 인접 줄.
  // (font('size'), weight('w')) 매핑 표 — 빈도 audit 기반 role 등재.
  ...(() => {
    const PAIRS: Array<[string, string, string]> = [
      ['md', 'regular',    'body'],
      ['md', 'semibold',   'bodyStrong'],
      ['md', 'bold',       'bodyStrong'],
      ['sm', 'regular',    'caption'],
      ['sm', 'medium',     'label'],
      ['sm', 'semibold',   'captionStrong'],
      ['sm', 'bold',       'captionStrong'],
      ['xs', 'regular',    'micro'],
      ['xs', 'medium',     'micro'],
      ['xs', 'semibold',   'microStrong'],
      ['xs', 'bold',       'microStrong'],
      ['lg', 'semibold',   'heading'],
      ['lg', 'bold',       'heading'],
      ['xl', 'semibold',   'headingStrong'],
      ['xl', 'bold',       'headingStrong'],
      ['2xl', 'semibold',  'display'],
      ['2xl', 'bold',      'display'],
    ]
    return PAIRS.flatMap(([size, w, role]): Rule[] => {
      // ${font('size')} 또는 var(--ds-text-size) 둘 다 매칭 — 같은 의미
      const f = `(?:\\$\\{font\\(['"]${size}['"]\\)\\}|var\\(--ds-text-${size}\\))`
      const wt = `\\$\\{weight\\(['"]${w}['"]\\)\\}`
      return [
        {
          match: new RegExp(`font-size:\\s*${f};\\s*font-weight:\\s*${wt};`, 'g'),
          replace: `\${typography('${role}')};`,
          importName: 'typography',
        },
        {
          match: new RegExp(`font-size:\\s*${f};\\s+font-weight:\\s*${wt};`, 'gs'),
          replace: `\${typography('${role}')};`,
          importName: 'typography',
        },
        {
          match: new RegExp(`font-weight:\\s*${wt};\\s+font-size:\\s*${f};`, 'gs'),
          replace: `\${typography('${role}')};`,
          importName: 'typography',
        },
      ]
    })
  })(),
]

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) walk(p, out)
    else if (/\.ts$/.test(name) && !/\.d\.ts$/.test(name) &&
             (/\.(style|styles)\.ts$/.test(name) || /\/(style|styles)\.ts$/.test(p) || p.includes('/style/'))) out.push(p)
  }
  return out
}

function ensureImport(src: string, name: string): string {
  // import { ... } from '...tokens/semantic...'
  // foundations barrel import — `tokens/semantic` 또는 상대경로 `../foundations` 모두 허용
  const re = /import\s*\{([^}]*)\}\s*from\s*(['"][^'"]*foundations['"])/
  const m = src.match(re)
  if (!m) return src // 알 수 없는 import 패턴 — 손대지 않음
  const names = m[1].split(',').map((s) => s.trim()).filter(Boolean)
  if (names.includes(name)) return src
  names.push(name)
  names.sort()
  return src.replace(re, `import { ${names.join(', ')} } from ${m[2]}`)
}

// scope: packages/ds + apps + showcase (단, theme creator 등 raw 정당 케이스는 ensureImport 가 자동 skip)
const files = [
  ...walk(join(ROOT, 'packages/ds/src')),
  ...walk(join(ROOT, 'apps')),
  ...walk(join(ROOT, 'showcase')),
]
let changed = 0
let totalReplacements = 0
const touched: { file: string; n: number }[] = []

for (const file of files) {
  let src = readFileSync(file, 'utf8')
  let n = 0
  const needs = new Set<string>()
  for (const r of RULES) {
    const before = src
    src = src.replace(r.match, (...args: string[]) => {
      n++
      return typeof r.replace === 'function' ? r.replace(...args) : r.replace
    })
    if (src !== before) needs.add(r.importName)
  }
  if (n === 0) continue
  for (const name of needs) src = ensureImport(src, name)
  if (APPLY) writeFileSync(file, src)
  touched.push({ file: relative(ROOT, file), n })
  changed++
  totalReplacements += n
}

console.log(`\n${APPLY ? '✏️  applied' : '👀 dry-run'} — ${changed} files, ${totalReplacements} replacements\n`)
for (const t of touched) console.log(`   ${String(t.n).padStart(3)}× ${t.file}`)

if (!APPLY) {
  console.log(`\n   --apply 로 실제 적용. 다음 단계:`)
  console.log(`     pnpm tsx scripts/converge-css.ts --apply`)
  console.log(`     npx tsc -b --noEmit`)
  console.log(`     pnpm tsx scripts/audit-css-decls.ts --min=4 --top=10`)
  process.exit(0)
}

// ── re-measure ─────────────────────────────────────────────────────────
console.log(`\n🔍 re-running audit...\n`)
try {
  execSync('npx tsc -b --noEmit', { cwd: ROOT, stdio: 'inherit' })
} catch {
  console.error('❌ tsc 실패 — 수동 확인 필요')
  process.exit(1)
}
execSync('pnpm tsx scripts/audit-css-decls.ts --min=4 --top=10', { cwd: ROOT, stdio: 'inherit' })
