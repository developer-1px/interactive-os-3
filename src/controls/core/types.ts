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

export interface ControlProps {
  data: NormalizedData
  onEvent: (e: Event) => void
}

export const ROOT = '__root__'
export const FOCUS = '__focus__'
export const EXPANDED = '__expanded__'

export const getFocus = (d: NormalizedData): string | undefined =>
  d.entities[FOCUS]?.data?.id as string | undefined

export const getExpanded = (d: NormalizedData): Set<string> =>
  new Set((d.entities[EXPANDED]?.data?.ids as string[]) ?? [])

export const getChildren = (d: NormalizedData, id: string): string[] =>
  d.relationships[id] ?? []

export const getLabel = (d: NormalizedData, id: string): string =>
  (d.entities[id]?.data?.label as string) ?? id

export const isDisabled = (d: NormalizedData, id: string): boolean =>
  Boolean(d.entities[id]?.data?.disabled)
