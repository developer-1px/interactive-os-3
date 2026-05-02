export type Kind = 'pure' | 'ref' | 'collection' | 'custom'

export const KIND_ORDER: Record<Kind, number> = { pure: 0, ref: 1, collection: 2, custom: 3 }

export const KIND_LABEL: Record<Kind, string> = {
  pure: 'Pure recipe',
  ref: 'Ref-based',
  collection: 'Collection',
  custom: 'Custom (composed)',
}

export const KIND_BADGE: Record<Kind, string> = {
  pure: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  ref: 'bg-amber-100 text-amber-900 ring-amber-200',
  collection: 'bg-sky-100 text-sky-900 ring-sky-200',
  custom: 'bg-violet-100 text-violet-900 ring-violet-200',
}
