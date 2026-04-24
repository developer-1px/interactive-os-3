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
  onEvent: (e: Event) => void
}

export const getChildren = (d: NormalizedData, id: string): string[] =>
  d.relationships[id] ?? []

export const getLabel = (d: NormalizedData, id: string): string =>
  (d.entities[id]?.data?.label as string) ?? id

export const isDisabled = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.data?.disabled)
