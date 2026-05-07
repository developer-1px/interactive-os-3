import { CatalogRow, PreviewCenter } from './CatalogRow'
import { KINDS } from './kind'
import type { Entry } from './registry.patterns'

export function PatternScreen({
  entry,
  index,
  total,
}: {
  entry: Entry
  index: number
  total: number
}) {
  const { Component, title, apg, kind, blurb, slug, tabs, wide } = entry
  return (
    <CatalogRow
      slug={slug}
      index={index}
      total={total}
      badge={{ label: KINDS[kind].label, className: KINDS[kind].badge }}
      title={title}
      blurb={blurb}
      apg={apg}
      keys={entry.keys?.()}
      preview={
        <PreviewCenter wide={wide}>
          <Component />
        </PreviewCenter>
      }
      tabs={tabs}
      filenamePrefix="demos/"
    />
  )
}
