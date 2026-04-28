/**
 * tokens.categorize — varName → foundation `_category.ts` 키. SSOT 정렬.
 *
 * **SSoT 단일화 (2025 정렬)**: prefix 매핑은 이 파일이 아니라 각 foundation
 *   `packages/ds/src/tokens/semantic/<cat>/_category.ts` 의 `prefixes` 가 SSOT.
 *   `import.meta.glob` 으로 자동 수집 → 신규 카테고리 추가 시 _category.ts 한 곳만.
 *
 * **Longest-first 매칭**: 짧은 prefix 가 긴 prefix 를 가로채지 않도록 길이 내림차순.
 *   예: `--ds-text-` (typography) 가 `--ds-tone` (color) 보다 먼저 매칭.
 */
import type { CategoryMeta } from '@p/ds/tokens/category-meta'

export type CategoryKey =
  | 'color' | 'typography' | 'spacing' | 'shape' | 'state'
  | 'motion' | 'elevation' | 'control' | 'layout' | 'iconography'
  | 'zIndex' | 'opacity' | 'focus' | 'sizing' | 'breakpoint'
  | 'preset' | 'etc'

/** foundation lane 디스플레이 순서 SSOT — TokenTable 그룹 순서. */
export const FOUNDATION_ORDER: ReadonlyArray<CategoryKey> = [
  'color', 'typography', 'spacing', 'shape', 'state', 'motion', 'elevation',
  'control', 'layout', 'iconography', 'zIndex', 'opacity', 'focus', 'sizing', 'breakpoint',
  'preset', 'etc',
] as const

/* preset seed knobs — apply.ts 가 emit 하지만 어떤 foundation 에도 속하지 않음. */
const PRESET_PREFIXES: ReadonlyArray<string> = ['--ds-hue', '--ds-density', '--ds-depth', '--ds-step']

/* foundations/<cat>/_category.ts 자동 수집. CategoryKey 는 폴더명. */
const modules = import.meta.glob<{ default: CategoryMeta }>(
  '/packages/ds/src/tokens/semantic/*/_category.ts',
  { eager: true },
)

const PREFIX_TABLE: Array<readonly [string, CategoryKey]> = []
for (const [path, mod] of Object.entries(modules)) {
  const cat = path.match(/foundations\/([^/]+)\/_category\.ts$/)?.[1] as CategoryKey | undefined
  if (!cat) continue
  for (const pre of mod.default.prefixes ?? []) PREFIX_TABLE.push([pre, cat])
}
for (const pre of PRESET_PREFIXES) PREFIX_TABLE.push([pre, 'preset'])

/* 충돌 검증 — 동일 prefix 가 두 카테고리 ❌ */
{
  const seen = new Map<string, CategoryKey>()
  for (const [pre, cat] of PREFIX_TABLE) {
    const prev = seen.get(pre)
    if (prev && prev !== cat) {
      throw new Error(`[tokens.categorize] prefix 충돌 — '${pre}': ${prev} vs ${cat}`)
    }
    seen.set(pre, cat)
  }
}

const SORTED_PREFIX = [...PREFIX_TABLE].sort(([a], [b]) => b.length - a.length)

/** varName → CategoryKey. 매칭 안 되면 'etc'. */
export function categorize(name: string): CategoryKey {
  for (const [prefix, cat] of SORTED_PREFIX) if (name.startsWith(prefix)) return cat
  if (/^--ds-h[1-6]-/.test(name)) return 'typography'
  return 'etc'
}

/** lint 스크립트용 — 자동 수집된 표를 직접 노출. */
export const PREFIX_TABLE_DERIVED: ReadonlyArray<readonly [string, CategoryKey]> = PREFIX_TABLE
