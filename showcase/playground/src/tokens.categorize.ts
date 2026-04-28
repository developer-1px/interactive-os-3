/**
 * tokens.categorize — varName → foundation `_category.ts` 키. SSOT 정렬.
 *
 * 16 lane (color · typography · spacing · shape · state · motion · elevation
 * · control · layout · iconography · zIndex · opacity · focus · sizing
 * · breakpoint) + preset(seed knobs) + etc(미분류).
 *
 * **SSoT 단일성**: prefix 표는 이 파일이 SSOT. 신규 lane 추가 시
 *   1) `packages/ds/src/tokens/foundations/<cat>/_category.ts` (라벨·표준)
 *   2) `PREFIX_TABLE` 한 줄 추가 (분류 규칙)
 *   두 곳만 건드린다. /tokens 본체 수정 ❌ (OCP).
 *
 * **Longest-first 매칭**: 짧은 prefix 가 긴 prefix 를 가로채지 않도록 길이 내림차순 정렬.
 *   예: `--ds-text-` (typography) 가 `--ds-tone` (color) 보다 먼저 매칭되어야 함.
 */

export type CategoryKey =
  | 'color' | 'typography' | 'spacing' | 'shape' | 'state'
  | 'motion' | 'elevation' | 'control' | 'layout' | 'iconography'
  | 'zIndex' | 'opacity' | 'focus' | 'sizing' | 'breakpoint'
  | 'preset' | 'etc'

/** foundation lane 디스플레이 순서 SSOT — TokenTable 의 그룹 순서. */
export const FOUNDATION_ORDER: ReadonlyArray<CategoryKey> = [
  'color', 'typography', 'spacing', 'shape', 'state', 'motion', 'elevation',
  'control', 'layout', 'iconography', 'zIndex', 'opacity', 'focus', 'sizing', 'breakpoint',
  'preset', 'etc',
] as const

const PREFIX_TABLE: ReadonlyArray<readonly [string, CategoryKey]> = [
  // typography (longest first)
  ['--ds-tracking',  'typography'],
  ['--ds-leading',   'typography'],
  ['--ds-weight-',   'typography'],
  ['--ds-text-',     'typography'],
  ['--ds-font-',     'typography'],
  // shape
  ['--ds-radius',    'shape'],
  ['--ds-hairline',  'shape'],
  // spacing
  ['--ds-space',     'spacing'],
  ['--ds-hierarchy', 'spacing'],
  // motion
  ['--ds-dur',       'motion'],
  ['--ds-ease',      'motion'],
  // elevation
  ['--ds-elev',      'elevation'],
  ['--ds-shadow',    'elevation'],
  // 신규 6 lane
  ['--ds-z',         'zIndex'],
  ['--ds-opacity',   'opacity'],
  ['--ds-alpha',     'opacity'],
  ['--ds-focus',     'focus'],
  ['--ds-size-',     'sizing'],
  ['--ds-bp-',       'breakpoint'],
  // iconography
  ['--ds-icon-',     'iconography'],
  // control
  ['--ds-control',   'control'],
  ['--ds-chrome',    'control'],
  ['--ds-avatar',    'control'],
  // layout
  ['--ds-column',    'layout'],
  ['--ds-shell',     'layout'],
  ['--ds-sidebar',   'layout'],
  ['--ds-preview',   'layout'],
  ['--ds-container', 'layout'],
  ['--ds-stage',     'layout'],
  // color (광범위 prefix — 가장 마지막에 fallthrough)
  ['--ds-neutral',   'color'],
  ['--ds-accent',    'color'],
  ['--ds-tone',      'color'],
  ['--ds-success',   'color'],
  ['--ds-warning',   'color'],
  ['--ds-danger',    'color'],
  ['--ds-traffic',   'color'],
  ['--ds-border',    'color'],
  ['--ds-muted',     'color'],
  ['--ds-base',      'color'],
  ['--ds-on-',       'color'],
  ['--ds-bg',        'color'],
  ['--ds-fg',        'color'],
  // preset seed
  ['--ds-hue',       'preset'],
  ['--ds-density',   'preset'],
  ['--ds-depth',     'preset'],
  ['--ds-step',      'preset'],
] as const

const SORTED_PREFIX = [...PREFIX_TABLE].sort(([a], [b]) => b.length - a.length)

/**
 * varName → CategoryKey. 매칭 안 되면 'etc'.
 *
 * @invariant 동일 var 가 두 카테고리에 동시에 속하지 않는다 (단일 분류).
 */
export function categorize(name: string): CategoryKey {
  for (const [prefix, cat] of SORTED_PREFIX) if (name.startsWith(prefix)) return cat
  // h1~h6 ladder
  if (/^--ds-h[1-6]-/.test(name)) return 'typography'
  return 'etc'
}
