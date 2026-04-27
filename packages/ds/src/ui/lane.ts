/**
 * Lane meta — co-located SSOT.
 *
 * 각 lane 폴더(ui/<n>-<name>/, devices/)에 `_lane.ts` 를 두고 `defineLane`
 * default export 한다. canvas 등 소비자는 `import.meta.glob` 으로 자동 수집
 * — lane 추가/수정 시 canvas 코드 수정 0곳.
 *
 * tier:   'atom' | 'composed' | 'system'    (canvas 의 Atoms/Composed 분류)
 * layer:  'ui' | 'devices'                  (CANONICAL V축 layer)
 * order:  화면 순서 (작은 값이 위)
 */
export type LaneTier = 'atom' | 'composed' | 'system'
export type LaneLayer = 'ui' | 'devices'

export type LaneMeta = {
  label: string
  standard: string
  tier: LaneTier
  layer: LaneLayer
  order: number
}

export function defineLane(meta: LaneMeta): LaneMeta {
  return meta
}
