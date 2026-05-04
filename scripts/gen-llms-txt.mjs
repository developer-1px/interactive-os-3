#!/usr/bin/env node
/**
 * gen-llms-txt.mjs — typedoc JSON → llms.txt
 *
 * https://llmstxt.org/ 명세에 따라 한 줄 요약 인덱스를 생성한다.
 *
 * 사용:
 *   cd packages/headless && npx typedoc --json ../../docs/api.json
 *   node scripts/gen-llms-txt.mjs > llms.txt
 *
 * 또는 npm script:
 *   pnpm docs:llms
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(new URL('..', import.meta.url).pathname)
const JSON_PATH = path.join(ROOT, 'docs/api.json')

if (!fs.existsSync(JSON_PATH)) {
  console.error(`❌ ${JSON_PATH} not found. Run typedoc first:`)
  console.error(`   cd packages/headless && npx typedoc --json ../../docs/api.json`)
  process.exit(1)
}

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'))

const firstLine = (s = '') =>
  s
    .replace(/```[\s\S]*?```/g, '')
    .replace(/@example[\s\S]*$/m, '')
    .replace(/@see\s+\S+/g, '')
    .replace(/\{@link\s+([^}]+)\}/g, '$1')
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')
    .trim()

const summaryOf = (node) => {
  const parts = []
  for (const c of node.comment?.summary ?? []) parts.push(c.text ?? '')
  const sigSummary = node.signatures?.[0]?.comment?.summary
  if (sigSummary) for (const c of sigSummary) parts.push(c.text ?? '')
  return firstLine(parts.join(''))
}

const seeOf = (node) => {
  const tags = [
    ...(node.comment?.blockTags ?? []),
    ...(node.signatures?.[0]?.comment?.blockTags ?? []),
  ]
  const see = tags.find((t) => t.tag === '@see')
  if (!see) return ''
  const text = (see.content ?? []).map((c) => c.text ?? '').join('').trim()
  const url = text.match(/https?:\S+/)?.[0]
  return url ?? ''
}

const KIND_ORDER = {
  patterns: 1, axes: 2, state: 3, store: 4,
  roving: 5, key: 6, gesture: 7, local: 8, index: 9,
}

const out = []
out.push('# @p/headless')
out.push('')
out.push(
  'ARIA 행동 인프라(Behavior infrastructure for WAI-ARIA). Roving tabindex, axis composition, 24 APG patterns — zero markup vocabulary, zero CSS.',
)
out.push('')
out.push('> Headless package — 시각은 소비자가 Tailwind utility class로 직접 구성. 이름·구조는 W3C ARIA/APG 어휘 그대로.')
out.push('')

const modules = (data.children ?? [])
  .filter((m) => m.kind === 2) // Module
  .sort((a, b) => (KIND_ORDER[a.name] ?? 99) - (KIND_ORDER[b.name] ?? 99))

for (const mod of modules) {
  out.push(`## ${mod.name}`)
  const modSummary = summaryOf(mod)
  if (modSummary) out.push('', modSummary)
  out.push('')

  const exports = (mod.children ?? []).filter(
    (c) => c.kind !== 2 && !c.flags?.isPrivate && !c.flags?.isInternal,
  )

  for (const ex of exports) {
    const summary = summaryOf(ex) || '(undocumented)'
    const see = seeOf(ex)
    const suffix = see ? ` ${see}` : ''
    out.push(`- **${ex.name}** — ${summary}${suffix}`)
  }
  out.push('')
}

out.push('## Optional')
out.push('')
out.push('- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/): 정본 어휘 출처')
out.push('- [INVARIANTS.md](packages/headless/INVARIANTS.md): 헤드리스 invariant')
out.push('- [PATTERNS.md](packages/headless/PATTERNS.md): pattern recipe 시그니처')
out.push('')

process.stdout.write(out.join('\n'))
