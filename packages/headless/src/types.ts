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
export interface NormalizedData<
  E extends Record<string, unknown> = Record<string, unknown>,
  M extends Meta = Meta,
> {
  entities: Record<string, E>
  relationships: Record<string, string[]>
  meta?: M
}

/**
 * Meta — 라이브러리 base 키(focus/expanded/open/typeahead/...)는 라이브러리가 읽고 쓴다.
 * 사용자가 `interface MyMeta extends Meta { window?: ... }` 로 키를 추가하면
 * 라이브러리는 추가 키를 읽지 않고 그대로 보존한다. invariant 안 깨짐.
 */
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
  /**
   * Edit / Clipboard / History 어휘 — 정본 = zod-crud `JsonCrud` op 1:1.
   * 의도적으로 시그니처가 zod-crud 와 동일 (insertAfter / appendChild / update / delete / copy / cut / paste / undo / redo).
   * 추상화 0, 옵션 0 — opinionated.
   */
  | { type: 'insertAfter'; siblingId: string; value?: unknown }
  | { type: 'appendChild'; parentId: string; value?: unknown }
  | { type: 'update'; id: string; value: unknown }
  | { type: 'remove'; id: string }
  | { type: 'copy'; id: string }
  | { type: 'cut'; id: string }
  | { type: 'paste'; targetId: string; mode?: 'auto' | 'child' | 'overwrite'; index?: number }
  | { type: 'undo' }
  | { type: 'redo' }

/**
 * UiEvent 의 `value` 변종에서 id 가 빠진 단일값 dispatch shape — slider/switch/spinbutton/splitter.
 * Note: id-bound `update` 는 `UiEvent` 본체에. `ValueEvent<T>` 는 id 없는 단일값 컨트롤 전용.
 */
export type ValueEvent<T> = { type: 'value'; value: T }

/** meta.root (top-level id 배열) read. */
export const getRoot = (d: NormalizedData): string[] =>
  d.meta?.root ?? []

/** 현재 focus id read (없으면 null). */
export const getFocus = (d: NormalizedData): string | null =>
  d.meta?.focus ?? null

/** expanded id 집합 read. */
export const getExpanded = (d: NormalizedData): Set<string> =>
  new Set(d.meta?.expanded ?? [])

/** open id 집합 read (popover/menu/dialog). */
export const getOpen = (d: NormalizedData): Set<string> =>
  new Set(d.meta?.open ?? [])

/** typeahead 버퍼 read (`{buf, deadline}`). */
export const getTypeahead = (d: NormalizedData): { buf: string; deadline: number } =>
  d.meta?.typeahead ?? { buf: '', deadline: 0 }

/** range-select 의 anchor id read. */
export const getSelectAnchor = (d: NormalizedData): string | null =>
  d.meta?.selectAnchor ?? null

/**
 * ROOT — sentinel "container id" used by axes/patterns to mean "top-level".
 * Not a real entity. `getChildren(d, ROOT)` returns `meta.root`.
 * Users do NOT write this in literals; they set `meta.root` instead.
 */
export const ROOT = '__root__'

/** id 의 자식 id 배열. id===ROOT 면 meta.root 반환. */
export const getChildren = (d: NormalizedData, id: string): string[] => {
  if (id === ROOT) return d.meta?.root ?? []
  return d.relationships[id] ?? []
}

/** entity.label read (없으면 id). typeahead 매칭용. */
export const getLabel = (d: NormalizedData, id: string): string => {
  const v = d.entities[id]?.label
  return typeof v === 'string' ? v : id
}

/** entity.disabled flag read. */
export const isDisabled = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.disabled)

/** entity.selected flag read. */
export const isSelected = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.selected)

/** id 가 현재 focus 와 일치하는지. */
export const isFocused = (d: NormalizedData, id: string): boolean =>
  d.meta?.focus === id

/** id 가 `meta.open` 집합에 포함되는지 (popover/menu/dialog/combobox popup). */
export const isOpen = (d: NormalizedData, id: string): boolean =>
  d.meta?.open?.includes(id) ?? false

/** id 가 `meta.expanded` 집합에 포함되는지 (accordion/tree branch). */
export const isExpanded = (d: NormalizedData, id: string): boolean =>
  d.meta?.expanded?.includes(id) ?? false

/** ControlProps — data + onEvent. 상호작용 컴포넌트의 공용 prop shape. */
export interface ControlProps<
  E extends Record<string, unknown> = Record<string, unknown>,
  M extends Meta = Meta,
> {
  data: NormalizedData<E, M>
  /** 상호작용 컴포넌트는 필수. Display-only Collection은 생략 가능. */
  onEvent?: (e: UiEvent) => void
}

/**
 * CollectionProps<Extra, E, M> — 집합/계층 렌더 ui의 공용 루트 타입.
 * data 기반 컴포넌트는 반드시 이 타입을 props 시그니처로 써야 한다.
 */
export type CollectionProps<
  Extra = {},
  E extends Record<string, unknown> = Record<string, unknown>,
  M extends Meta = Meta,
> = ControlProps<E, M> & Extra

/** Tone — 의미 색 토큰 (default/info/success/warning/danger/primary). */
export type Tone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'primary'
