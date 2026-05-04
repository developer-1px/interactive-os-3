/**
 * Axis SSOT — `packages/headless/src/patterns/*.ts` 의 raw 소스를 그대로 분석한다.
 *
 * - 각 pattern 파일의 `composeAxes(...)` 호출에서 axis identifier 를 추출
 * - axis → 그 axis 를 쓰는 patterns 의 [{ name, source }] 매핑을 빌드
 *
 * 새 pattern 추가 / axis 합성 변경 → pattern 파일만 고치면 자동 반영. 별도 메타 선언 ❌.
 */

const sources = import.meta.glob<string>(
  '../../../../packages/headless/src/patterns/*.ts',
  { eager: true, query: '?raw', import: 'default' },
)

const SKIP = new Set(['index', 'types', 'spinbutton.test'])

export interface PatternSource {
  /** 파일 basename, e.g. 'listbox' */
  name: string
  /** APG slug for link, e.g. 'listbox' (default: 동일) */
  apg: string
  source: string
}

/** `composeAxes( navigate, activate, typeahead )` → ['navigate','activate','typeahead'] (괄호 호출/options 무시). */
function extractAxesFromCompose(src: string): string[] {
  const out = new Set<string>()
  const re = /composeAxes\s*\(([^)]*)\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    for (const token of m[1].split(',')) {
      const id = token.trim().match(/^([a-zA-Z_$][\w$]*)/)?.[1]
      if (id) out.add(id)
    }
  }
  return [...out]
}

/** Pattern 파일이 직접 axis 를 사용한 경우(`numericStep('horizontal')` 같은 단축 호출) 도 회수. */
function extractDirectAxisCalls(src: string): string[] {
  // `something = numericStep(...)` 형태. axes/index.ts export 명단으로 한정.
  const KNOWN = [
    'navigate', 'activate', 'typeahead', 'multiSelect', 'select',
    'treeNavigate', 'treeExpand', 'expand', 'numericStep',
    'gridNavigate', 'gridMultiSelect', 'pageNavigate', 'escape',
  ]
  const out = new Set<string>()
  for (const ax of KNOWN) {
    if (new RegExp(`\\b${ax}\\s*\\(`).test(src)) out.add(ax)
  }
  return [...out]
}

interface Pattern {
  name: string
  source: string
  axes: string[]
}

const patterns: Pattern[] = Object.entries(sources)
  .map(([path, source]) => ({ path, source }))
  .map(({ path, source }) => {
    const name = path.split('/').pop()!.replace(/\.ts$/, '')
    return { name, source, axes: [] as string[] }
  })
  .filter((p) => !SKIP.has(p.name))
  .map((p) => ({
    ...p,
    axes: dedupe([...extractAxesFromCompose(p.source), ...extractDirectAxisCalls(p.source)]),
  }))
  .filter((p) => p.axes.length > 0)

function dedupe<T>(xs: T[]) { return [...new Set(xs)] }

export interface AxisEntry {
  axis: string
  patterns: Pattern[]
}

/** axis → patterns. 알파벳 순. */
export const AXES: AxisEntry[] = (() => {
  const map = new Map<string, Pattern[]>()
  for (const p of patterns) {
    for (const ax of p.axes) {
      const arr = map.get(ax) ?? []
      arr.push(p)
      map.set(ax, arr)
    }
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([axis, ps]) => ({
      axis,
      patterns: ps.sort((a, b) => a.name.localeCompare(b.name)),
    }))
})()

export const slugForAxis = (axis: string) => axis.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
