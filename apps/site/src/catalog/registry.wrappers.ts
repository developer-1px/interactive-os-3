import type { ComponentType } from 'react'

export interface WrapperMeta {
  title: string
  apg: string
  blurb: string
  keys?: () => string[]
}

interface WrapperModule {
  default: ComponentType
  meta: WrapperMeta
}

export interface WrapperEntry extends WrapperMeta {
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

const modules = import.meta.glob<WrapperModule>('../examples/*.tsx', { eager: true })
const sources = import.meta.glob<string>('../examples/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

export const WRAPPER_ENTRIES: WrapperEntry[] = Object.entries(modules)
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
