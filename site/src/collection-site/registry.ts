import type { ComponentType } from 'react'

export interface CollectionMeta {
  title: string
  apg: string
  blurb: string
  keys?: () => string[]
}

interface CollectionModule {
  default: ComponentType
  meta: CollectionMeta
}

export interface CollectionEntry extends CollectionMeta {
  filename: string
  slug: string
  Component: ComponentType
  source: string
}

const slugFor = (filename: string) =>
  filename
    .replace(/\.tsx$/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()

const modules = import.meta.glob<CollectionModule>('./examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./examples/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const COLLECTION_ENTRIES: CollectionEntry[] = Object.entries(modules)
  .map(([path, mod]) => {
    const filename = path.split('/').pop()!
    return {
      ...mod.meta,
      Component: mod.default,
      source: sources[path] ?? '',
      filename,
      slug: slugFor(filename),
    }
  })
  .sort((a, b) => a.title.localeCompare(b.title))
