#!/usr/bin/env node
// Generated style contract lint.
//
// 목표: className 자체가 아니라 arbitrary className을 금지한다. DS 내부
// defineStyleContract()가 만든 class boundary 아래에서만 selector를 허용하고,
// pilot 컴포넌트(RoleCard)가 다시 ReactNode slot으로 열리지 않게 막는다.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

const findings = []
const add = (file, line, message, snippet = '') => {
  findings.push({ file, line, message, snippet: snippet.trim().slice(0, 120) })
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === '.git') continue
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) yield* walk(p)
    else if (/\.(ts|tsx)$/.test(name)) yield p
  }
}

const styleRoot = join(ROOT, 'packages/ds/src')
for (const file of walk(styleRoot)) {
  const text = readFileSync(file, 'utf8')
  if (!text.includes('defineStyleContract(')) continue

  const rel = relative(ROOT, file)
  const lines = text.split('\n')
  let insideTemplate = false
  let templateStartLine = 0

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.includes('css`')) {
      insideTemplate = true
      templateStartLine = i + 1
      continue
    }

    if (!insideTemplate) continue

    if (trimmed === '`,' || trimmed === '`' || trimmed.endsWith('`,') || trimmed.endsWith('`')) {
      insideTemplate = false
      continue
    }

    if (looksLikeSelector(trimmed) && !isContractScopedSelector(trimmed)) {
      add(file, i + 1, 'style contract selector must start with "&" or an at-rule inside generated class boundary', trimmed)
    }

    if (/className\s*=/.test(line)) {
      add(file, i + 1, 'style contracts should not embed JSX className strings', trimmed)
    }
  }

  if (!/export const css[A-Z][A-Za-z0-9]*\s*=\s*\(\)\s*=>\s*[A-Za-z0-9]+Style\.css/.test(text)) {
    add(file, 1, 'style contract file should expose legacy cssX() bridge returning <owner>Style.css', rel)
  }

  if (insideTemplate) {
    add(file, templateStartLine, 'unterminated css template in style contract', '')
  }
}

const roleCard = join(ROOT, 'packages/ds/src/features/RoleCard.tsx')
if (statExists(roleCard)) {
  const text = readFileSync(roleCard, 'utf8')
  const checks = [
    { pattern: /\bReactNode\b/, message: 'RoleCard pilot must not expose ReactNode slots' },
    { pattern: /\bactions\??\s*:/, message: 'RoleCard pilot must not expose actions prop' },
    { pattern: /\bmeta\??\s*:\s*ReactNode\b/, message: 'RoleCard meta must stay data-shaped, not JSX-shaped' },
    { pattern: /\bicon\??\s*:\s*ReactNode\b/, message: 'RoleCard icon must stay an icon token, not JSX' },
  ]
  for (const check of checks) {
    const match = text.match(check.pattern)
    if (match?.index != null) add(roleCard, lineOf(text, match.index), check.message, lineAt(text, match.index))
  }

  if (!text.includes('className={roleCardStyle.classes.root}')) {
    add(roleCard, 1, 'RoleCard root must use generated roleCardStyle.classes.root boundary', '')
  }
}

const roleCategory = join(ROOT, 'apps/edu-portal-admin/src/pages/RoleCategory.tsx')
if (statExists(roleCategory)) {
  const text = readFileSync(roleCategory, 'utf8')
  const checks = [
    { pattern: /\bactions\s*:/, message: 'RoleCategory must not pass JSX actions into RoleCard' },
    { pattern: /\bmeta\s*:\s*</, message: 'RoleCategory must not pass JSX meta into RoleCard' },
    { pattern: /<button\b/, message: 'RoleCategory must use RoleCard action intents or DS Button, not raw button' },
    { pattern: /component:\s*['"]RoleCard['"][\s\S]*?<Switch\b/, message: 'RoleCategory must not inline Switch inside RoleCard props' },
  ]
  for (const check of checks) {
    const match = text.match(check.pattern)
    if (match?.index != null) add(roleCategory, lineOf(text, match.index), check.message, lineAt(text, match.index))
  }

  if (!text.includes('id: c.id')) {
    add(roleCategory, 1, 'RoleCategory must pass entity id into RoleCard intents', '')
  }
}

const courseCard = join(ROOT, 'packages/ds/src/features/CourseCard.tsx')
if (statExists(courseCard)) {
  const text = readFileSync(courseCard, 'utf8')
  const checks = [
    { pattern: /\bReactNode\b/, message: 'CourseCard pilot must not expose ReactNode slots' },
    { pattern: /\bactions\??\s*:/, message: 'CourseCard pilot must not expose actions prop' },
    { pattern: /\bmeta\??\s*:\s*ReactNode\b/, message: 'CourseCard meta must stay data-shaped, not JSX-shaped' },
    { pattern: /\babbr\??\s*:\s*ReactNode\b/, message: 'CourseCard abbr must stay text-shaped, not JSX-shaped' },
    { pattern: /\bfooter\??\s*:\s*ReactNode\b/, message: 'CourseCard footer must stay owned by CourseCard' },
  ]
  for (const check of checks) {
    const match = text.match(check.pattern)
    if (match?.index != null) add(courseCard, lineOf(text, match.index), check.message, lineAt(text, match.index))
  }

  if (!text.includes('className={courseCardStyle.classes.root}')) {
    add(courseCard, 1, 'CourseCard root must use generated courseCardStyle.classes.root boundary', '')
  }
}

const courseCategory = join(ROOT, 'apps/edu-portal-admin/src/pages/CourseCategory.tsx')
if (statExists(courseCategory)) {
  const text = readFileSync(courseCategory, 'utf8')
  const checks = [
    { pattern: /\bactions\s*:/, message: 'CourseCategory must not pass JSX actions into CourseCard' },
    { pattern: /\bmeta\s*:\s*</, message: 'CourseCategory must not pass JSX meta into CourseCard' },
    { pattern: /\bfooter\s*:/, message: 'CourseCategory must not pass footer slot into CourseCard' },
    { pattern: /<button\b/, message: 'CourseCategory must use CourseCard action intents or DS Button, not raw button' },
    { pattern: /component:\s*['"]CourseCard['"][\s\S]*?<Switch\b/, message: 'CourseCategory must not inline Switch inside CourseCard props' },
  ]
  for (const check of checks) {
    const match = text.match(check.pattern)
    if (match?.index != null) add(courseCategory, lineOf(text, match.index), check.message, lineAt(text, match.index))
  }

  if (!text.includes('id: c.id')) {
    add(courseCategory, 1, 'CourseCategory must pass entity id into CourseCard intents', '')
  }
}

findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)

if (findings.length === 0) {
  console.log('✅ style-contract 위반 없음.')
  process.exit(0)
}

console.log(`❌ style-contract 위반 ${findings.length}건`)
for (const f of findings) {
  console.log(`- ${relative(ROOT, f.file)}:${f.line} ${f.message}`)
  if (f.snippet) console.log(`  ↳ ${f.snippet}`)
}
process.exit(1)

function looksLikeSelector(trimmed) {
  if (!trimmed.endsWith('{')) return false
  if (trimmed.includes('${')) return false
  return true
}

function isContractScopedSelector(trimmed) {
  return trimmed.startsWith('&') || trimmed.startsWith('@media') || trimmed.startsWith('@container') || trimmed.startsWith('@supports')
}

function statExists(path) {
  try {
    statSync(path)
    return true
  } catch {
    return false
  }
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

function lineAt(text, index) {
  const lines = text.split('\n')
  return lines[lineOf(text, index) - 1] ?? ''
}
