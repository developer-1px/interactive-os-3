import type { NormalizedData } from '../types'
import type { NodeType } from './nodes'

/**
 * Fragment kind — defineLayout vs defineWidget 의 시맨틱 경계를 코드로 강제.
 *
 * - `'layout'`: 페이지 시각 골격 + 슬롯. Nav/Aside/Ui 금지 (widget·component 영역).
 *   Main/Header/Footer 는 page-level 구조 landmark 로 허용.
 * - `'widget'`: landmark 1개 이상을 owner 로 가져야 한다 (Nav/Aside/Header/Footer/Main).
 */
export type FragmentKind = 'layout' | 'widget'

const LAYOUT_FORBIDDEN: NodeType[] = ['Nav', 'Aside', 'Ui']
const WIDGET_LANDMARKS: NodeType[] = ['Nav', 'Aside', 'Header', 'Footer', 'Main']

const KNOWN_TYPES: NodeType[] = [
  'Row','Column','Grid','Split','Main','Nav','Aside','Section','Header','Footer','Ui','Text',
]

/**
 * Fragment validation — same rules as validatePage but skips the `__root__`
 * reachability check. Used by defineWidget/defineLayout (sub-trees).
 *
 * `kind` 가 주어지면 해당 fragment 의 시맨틱 경계도 함께 검사한다.
 */
export function validateFragment(frag: NormalizedData, kind?: FragmentKind): void {
  if (typeof window === 'undefined') return
  const { entities, relationships } = frag
  const issues: string[] = []
  const types: NodeType[] = []
  for (const [id, e] of Object.entries(entities)) {
    const t = (e?.data as { type?: string } | undefined)?.type
    if (!t) {
      // ROOT 는 type 없음 — fragment 가 페이지 셸일 때 정상.
      if (id !== '__root__') issues.push(`entity "${id}" missing data.type`)
      continue
    }
    if (!KNOWN_TYPES.includes(t as NodeType)) {
      issues.push(`entity "${id}" unknown type "${t}"`)
      continue
    }
    types.push(t as NodeType)
    if (kind === 'layout' && LAYOUT_FORBIDDEN.includes(t as NodeType)) {
      issues.push(`layout fragment must not contain "${t}" (entity "${id}") — Nav/Aside는 widget이, Ui는 component가 소유한다`)
    }
  }
  if (kind === 'widget' && !types.some((t) => WIDGET_LANDMARKS.includes(t))) {
    issues.push('widget fragment requires at least one landmark (Nav/Aside/Header/Footer/Main)')
  }
  // Cycle 검사만 — fragment 의 missing child 는 슬롯 placeholder 라 정상이다 (merge 로 채워짐).
  const seen = new Set<string>()
  const stack = new Set<string>()
  const walk = (id: string): void => {
    if (stack.has(id)) { issues.push(`cycle at "${id}"`); return }
    if (seen.has(id)) return
    seen.add(id); stack.add(id)
    for (const c of relationships[id] ?? []) {
      if (!entities[c]) continue // 슬롯 — merge 로 채워질 외부 id
      walk(c)
    }
    stack.delete(id)
  }
  for (const id of Object.keys(entities)) walk(id)
  if (issues.length) {

    console.warn('[FlatLayout fragment]', issues)
  }
}

/** Dev-time validation — orphans, cycles, unknown node types. Warns, never throws. */
export function validatePage(page: NormalizedData): void {
  if (typeof window === 'undefined') return
  const { entities, relationships } = page
  const issues: string[] = []

  // unknown types
  for (const [id, e] of Object.entries(entities)) {
    const t = (e?.data as { type?: string } | undefined)?.type
    if (!t) {
      if (id !== '__root__') issues.push(`entity "${id}" missing data.type`)
      continue
    }
    if (!KNOWN_TYPES.includes(t as NodeType)) issues.push(`entity "${id}" unknown type "${t}"`)
  }
  // cycle detection
  const seen = new Set<string>()
  const stack = new Set<string>()
  const walk = (id: string): boolean => {
    if (stack.has(id)) { issues.push(`cycle at "${id}"`); return true }
    if (seen.has(id)) return false
    seen.add(id); stack.add(id)
    for (const c of relationships[id] ?? []) {
      if (!entities[c]) { issues.push(`missing child "${c}" (parent "${id}")`); continue }
      walk(c)
    }
    stack.delete(id)
    return false
  }
  for (const id of Object.keys(entities)) walk(id)

  if (issues.length) {

    console.warn('[FlatLayout] validation', issues)
  }
}
