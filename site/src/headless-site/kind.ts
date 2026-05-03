/**
 * Kind descriptors — order / label / badge co-located. Adding a kind = 1 entry.
 */
export const KINDS = {
  collection:    { order: 0, label: 'Collection',    badge: 'bg-sky-100 text-sky-900 ring-sky-200' },
  'single-value': { order: 1, label: 'Single value', badge: 'bg-emerald-100 text-emerald-900 ring-emerald-200' },
  overlay:       { order: 2, label: 'Overlay',       badge: 'bg-amber-100 text-amber-900 ring-amber-200' },
  custom:        { order: 3, label: 'Custom',        badge: 'bg-violet-100 text-violet-900 ring-violet-200' },
} as const

export type Kind = keyof typeof KINDS

export const KIND_LIST: Kind[] = (Object.keys(KINDS) as Kind[]).sort(
  (a, b) => KINDS[a].order - KINDS[b].order,
)
