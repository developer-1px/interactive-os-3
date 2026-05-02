import { KINDS } from './kind'
import { fmtKey } from './keys'
import type { Entry } from './registry'

export function PatternScreen({
  entry,
  index,
  total,
}: {
  entry: Entry
  index: number
  total: number
}) {
  const { Component, title, apg, kind, blurb, source, filename, slug } = entry
  const keys = entry.keys?.() ?? []

  return (
    <section id={slug} className="snap-start h-screen flex flex-col">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-2 border-b border-stone-200 bg-white px-8 py-4 pr-32">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${KINDS[kind].badge}`}
        >
          {KINDS[kind].label}
        </span>
        <h2 className="text-xl font-bold text-stone-900">{title}</h2>
        <p className="text-sm text-stone-600">{blurb}</p>
        <a
          href={`https://www.w3.org/WAI/ARIA/apg/patterns/${apg}/`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs text-stone-500 underline underline-offset-4 hover:text-stone-900"
        >
          APG ↗
        </a>
        <a
          href={`#${slug}`}
          className="text-xs font-mono text-stone-400 hover:text-stone-700"
          title="Permalink"
        >
          #{slug}
        </a>
        <span className="text-xs font-mono text-stone-400">
          {index + 1} / {total}
        </span>
        {keys.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-stone-400">Keys</span>
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

      <div className="grid flex-1 grid-cols-2 overflow-hidden">
        <div className="grid place-items-center overflow-auto bg-stone-50 p-8">
          <div className="w-[420px]">
            <Component />
          </div>
        </div>

        <div className="flex flex-col overflow-hidden border-l border-stone-200 bg-stone-950">
          <div className="flex items-center justify-between border-b border-stone-800 px-4 py-2">
            <code className="text-xs font-mono text-stone-400">demos/{filename}</code>
            <CopyButton text={source} />
          </div>
          <pre className="flex-1 overflow-auto p-4 text-xs leading-relaxed text-stone-100 font-mono">
            <code>{source}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

function CopyButton({ text }: { text: string }) {
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* clipboard rejection (no user gesture, etc.) — silently fail */
    }
  }
  return (
    <button
      onClick={handle}
      className="rounded border border-stone-700 bg-stone-800 px-2 py-0.5 text-xs text-stone-300 hover:bg-stone-700"
    >
      Copy
    </button>
  )
}
