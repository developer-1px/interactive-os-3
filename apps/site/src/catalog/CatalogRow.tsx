import { type ReactNode } from 'react'
import { fmtKey } from './keys'
import { CopyButton } from './CopyButton'
import { HighlightedCode } from './HighlightedCode'
import type { AppTab } from './buildAppTabs'
import { fromList } from '@p/headless'
import { useTabsPattern } from '@p/headless/patterns'
import { useLocalData } from '@p/headless/local'

function SourceTabs({ tabs, filenamePrefix }: { tabs: AppTab[]; filenamePrefix?: string }) {
  const [data, onEvent] = useLocalData(() =>
    fromList(tabs.map((t, i) => ({ id: t.key, label: t.label, selected: i === 0 }))),
  )
  const { rootProps, tabProps, panelProps, items } = useTabsPattern(data, onEvent)
  const activeId = items.find((i) => i.selected)?.id ?? items[0]?.id
  const active = tabs.find((t) => t.key === activeId) ?? tabs[0]
  return (
    <>
      <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2">
        <div {...rootProps} className="flex items-center gap-1 overflow-x-auto">
          {items.map((item) => (
            <button
              key={item.id}
              {...tabProps(item.id)}
              className="rounded px-2 py-0.5 text-[11px] font-mono text-stone-400 hover:text-stone-200 aria-selected:bg-stone-800 aria-selected:text-stone-100"
            >
              {item.label}
            </button>
          ))}
          <code className="ml-2 whitespace-nowrap text-xs font-mono text-stone-500">
            {(filenamePrefix ?? '') + active.filename}
          </code>
        </div>
        <CopyButton text={active.source} />
      </div>
      <div {...panelProps(active.key)} className="flex flex-1 flex-col md:overflow-hidden">
        <HighlightedCode
          source={active.source}
          filename={active.filename}
          highlightSymbols={active.symbols}
        />
      </div>
    </>
  )
}

/**
 * 모든 카탈로그 surface 가 공유하는 풀스크린 row.
 * 헤더(배지·타이틀·blurb·링크·카운터·keys) + 2-col body(좌 preview · 우 source) 한 골격.
 */
export function CatalogRow({
  slug,
  index,
  total,
  badge,
  title,
  titleMono,
  blurb,
  apg,
  keys,
  preview,
  tabs,
  filenamePrefix,
}: {
  slug: string
  index: number
  total: number
  badge: { label: string; className: string }
  title: string
  titleMono?: boolean
  blurb?: ReactNode
  apg?: string
  keys?: string[]
  preview: ReactNode
  tabs: AppTab[]
  /** filename UI prefix (e.g. 'demos/'). 표시용. */
  filenamePrefix?: string
}) {
  return (
    <section id={slug} tabIndex={-1} className="flex flex-col md:snap-start md:h-screen">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-stone-200 bg-white px-8 py-4 pr-32">
        <h2
          className={`w-full text-xl font-bold text-stone-900 ${titleMono ? 'font-mono' : ''}`}
        >
          {title}
        </h2>
        <p className="flex flex-wrap items-baseline gap-2 text-sm text-stone-600">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badge.className}`}
          >
            {badge.label}
          </span>
          {blurb}
        </p>
        {apg && (
          <a
            href={`https://www.w3.org/WAI/ARIA/apg/patterns/${apg}/`}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-xs text-stone-500 underline underline-offset-4 hover:text-stone-900"
          >
            APG ↗
          </a>
        )}
        <a
          href={`#${slug}`}
          className={`${apg ? '' : 'ml-auto'} text-xs font-mono text-stone-400 hover:text-stone-700`}
          title="Permalink"
        >
          #{slug}
        </a>
        <span className="text-xs font-mono text-stone-400">
          {index + 1} / {total}
        </span>
        {keys && keys.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400">Keys</span>
            <kbd
              className="rounded border border-dashed border-stone-300 bg-white px-1.5 py-0.5 text-[11px] font-mono text-stone-400 shadow-[0_1px_0_0_#e7e5e4]"
              title="Browser native focus traversal"
            >
              Tab
            </kbd>
            {keys.map((k) => (
              <kbd
                key={k}
                className="rounded border border-stone-300 bg-stone-50 px-1.5 py-0.5 text-[11px] font-mono text-stone-700 shadow-[0_1px_0_0_#d6d3d1]"
              >
                {fmtKey(k)}
              </kbd>
            ))}
          </div>
        )}
      </header>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-2 md:overflow-hidden">
        <div className="bg-stone-50 md:overflow-auto">{preview}</div>

        <div className="flex flex-col bg-stone-950 border-t md:border-t-0 md:border-l border-stone-200 md:overflow-hidden">
          <SourceTabs tabs={tabs} filenamePrefix={filenamePrefix} />
        </div>
      </div>
    </section>
  )
}

export function PreviewCenter({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-full place-items-center p-8">
      <div className="w-full max-w-[420px]">{children}</div>
    </div>
  )
}
