import type { ComponentType } from 'react'
import { KIND_ORDER, type Kind } from './kind'

export interface DemoMeta {
  title: string
  apg: string
  kind: Kind
  blurb: string
}

interface DemoModule {
  default: ComponentType
  meta: DemoMeta
}

export interface Entry extends DemoMeta {
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

const modules = import.meta.glob<DemoModule>('./demos/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./demos/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const ENTRIES: Entry[] = Object.entries(modules)
  .filter(([path]) => !path.includes('/_'))
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
  .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.title.localeCompare(b.title))
