/**
 * NormalizedData — three separated stores:
 *   entities      = id → user data (id is the key, value IS the data)
 *   relationships = id → child ids (entity-keyed only; top-level lives in meta.root)
 *   meta          = library-owned auxiliary state (focus/expanded/open/typeahead/...)
 *
 * Invariants:
 *   - Object.keys(relationships) ⊆ Object.keys(entities)
 *   - meta is library-owned; entities are user-owned (modulo reserved per-item flags
 *     `selected` / `disabled` / `value` that the library reads)
 */
export interface NormalizedData {
  entities: Record<string, Record<string, unknown>>
  relationships: Record<string, string[]>
  meta?: Meta
}

export interface Meta {
  root?: string[]
  focus?: string | null
  expanded?: string[]
  open?: string[]
  typeahead?: { buf: string; deadline: number }
  selectAnchor?: string | null
}

/**
 * UiEvent — ui ↔ headless 통신의 단일 어휘. DOM `Event` global과 충돌 방지를 위해
 * `Ui` prefix 명시.
 */
export type UiEvent =
  | { type: 'navigate'; id: string }
  | { type: 'activate'; id: string }
  | { type: 'expand'; id: string; open: boolean }
  | { type: 'select'; id: string }
  /** Batch select for multi-mode all/range/none — O(N) instead of N×O(N²) per-event spread. `to` undefined ⇒ toggle. */
  | { type: 'selectMany'; ids: string[]; to?: boolean }
  | { type: 'value'; id: string; value: unknown }
  | { type: 'open'; id: string; open: boolean }
  | { type: 'typeahead'; buf: string; deadline: number }
  /** pan: target entity의 (x, y)를 (dx, dy)만큼 이동 — gesture 어댑터가 wheel/pointer를 번역 */
  | { type: 'pan'; id: string; dx: number; dy: number }
  /** zoom: cursor (cx, cy)를 고정점으로 scale을 k 배 — Figma/Miro 식 cursor-anchored zoom */
  | { type: 'zoom'; id: string; cx: number; cy: number; k: number }

/** UiEvent 의 `value` 변종에서 id 가 빠진 단일값 dispatch shape — slider/switch/spinbutton/splitter. */
export type ValueEvent<T> = { type: 'value'; value: T }

export const getRoot = (d: NormalizedData): string[] =>
  d.meta?.root ?? []

export const getFocus = (d: NormalizedData): string | null =>
  d.meta?.focus ?? null

export const getExpanded = (d: NormalizedData): Set<string> =>
  new Set(d.meta?.expanded ?? [])

export const getOpen = (d: NormalizedData): Set<string> =>
  new Set(d.meta?.open ?? [])

export const getTypeahead = (d: NormalizedData): { buf: string; deadline: number } =>
  d.meta?.typeahead ?? { buf: '', deadline: 0 }

export const getSelectAnchor = (d: NormalizedData): string | null =>
  d.meta?.selectAnchor ?? null

/**
 * ROOT — sentinel "container id" used by axes/patterns to mean "top-level".
 * Not a real entity. `getChildren(d, ROOT)` returns `meta.root`.
 * Users do NOT write this in literals; they set `meta.root` instead.
 */
export const ROOT = '__root__'

export const getChildren = (d: NormalizedData, id: string): string[] => {
  if (id === ROOT) return d.meta?.root ?? []
  return d.relationships[id] ?? []
}

export const getLabel = (d: NormalizedData, id: string): string =>
  (d.entities[id]?.label as string) ?? id

export const isDisabled = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.disabled)

export const isSelected = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.selected)

export const isFocused = (d: NormalizedData, id: string): boolean =>
  d.meta?.focus === id

export interface ControlProps {
  data: NormalizedData
  /** 상호작용 컴포넌트는 필수. Display-only Collection은 생략 가능. */
  onEvent?: (e: UiEvent) => void
}

/**
 * CollectionProps<Extra> — 집합/계층 렌더 ui의 공용 루트 타입.
 * data 기반 컴포넌트는 반드시 이 타입을 props 시그니처로 써야 한다.
 */
export type CollectionProps<Extra = unknown> = ControlProps & Extra

// 의미 색 토큰
export type Tone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'primary'
