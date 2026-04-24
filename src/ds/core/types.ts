export interface Entity {
  id: string
  data?: Record<string, unknown>
}

export interface NormalizedData {
  entities: Record<string, Entity>
  relationships: Record<string, string[]>
}

export type Event =
  | { type: 'navigate'; id: string }
  | { type: 'activate'; id: string }
  | { type: 'expand'; id: string; open: boolean }
  | { type: 'select'; id: string }
  | { type: 'value'; id: string; value: unknown }
  | { type: 'open'; id: string; open: boolean }
  | { type: 'typeahead'; buf: string; deadline: number }

const metaId = (name: string) => `__${name}__`
export const isMetaId = (id: string) => id.startsWith('__') && id.endsWith('__')

export const ROOT = metaId('root')
export const FOCUS = metaId('focus')
export const EXPANDED = metaId('expanded')
export const TYPEAHEAD = metaId('typeahead')

const readMeta = <T>(d: NormalizedData, id: string, key: string, fallback: T): T =>
  (d.entities[id]?.data?.[key] as T) ?? fallback

export const getFocus = (d: NormalizedData): string | null =>
  readMeta<string | null>(d, FOCUS, 'id', null)

export const getExpanded = (d: NormalizedData): Set<string> =>
  new Set(readMeta<string[]>(d, EXPANDED, 'ids', []))

export const getTypeahead = (d: NormalizedData): { buf: string; deadline: number } => ({
  buf: readMeta<string>(d, TYPEAHEAD, 'buf', ''),
  deadline: readMeta<number>(d, TYPEAHEAD, 'deadline', 0),
})

export interface ControlProps {
  data: NormalizedData
  /** 상호작용 컴포넌트는 필수. Display-only Collection(Top10List/BarChart 류)은 생략 가능. */
  onEvent?: (e: Event) => void
}

/**
 * CollectionProps<Extra> — 집합/계층 렌더 ui의 공용 루트 타입.
 *
 * data 기반 컴포넌트(Menu/Listbox/Tree/Columns 등)는 반드시 이 타입을 props
 * 시그니처로 써야 한다. `Extra`로 aria-label 같은 추가 prop만 확장 허용.
 *
 * Radix/Ariakit/React-Aria 의 Collection root 컨벤션과 동일:
 *   - data 는 NormalizedData (트리 + focus/expanded meta)
 *   - onEvent 는 단발 emit (gesture 분리 원칙)
 *   - children 금지 — 항목은 data 에서만 파생
 *
 * 예) export function Menu(props: CollectionProps) { ... }
 *     export function Listbox(props: CollectionProps<{ 'aria-label'?: string }>) { ... }
 */
export type CollectionProps<Extra = {}> = ControlProps & Extra

export const getChildren = (d: NormalizedData, id: string): string[] =>
  d.relationships[id] ?? []

export const getLabel = (d: NormalizedData, id: string): string =>
  (d.entities[id]?.data?.label as string) ?? id

export const isDisabled = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.data?.disabled)
