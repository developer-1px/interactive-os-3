import type { ComponentType } from 'react'

type Kind = 'pure' | 'ref' | 'collection'

interface DemoMeta {
  title: string
  apg: string
  kind: Kind
  blurb: string
}

interface DemoModule {
  default: ComponentType
  meta: DemoMeta
}

const modules = import.meta.glob<DemoModule>('./demos/*.tsx', { eager: true })
const sources = import.meta.glob<string>('./demos/*.tsx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

interface Entry extends DemoMeta {
  filename: string
  Component: ComponentType
  source: string
}

const KIND_ORDER: Record<Kind, number> = { pure: 0, ref: 1, collection: 2 }

const ENTRIES: Entry[] = Object.entries(modules)
  .filter(([path]) => !path.includes('/_'))
  .map(([path, mod]) => ({
    ...mod.meta,
    Component: mod.default,
    source: sources[path] ?? '',
    filename: path.split('/').pop()!,
  }))
  .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind] || a.title.localeCompare(b.title))

const KIND_LABEL: Record<Kind, string> = {
  pure: 'Pure recipe',
  ref: 'Ref-based',
  collection: 'Collection',
}

const KIND_BADGE: Record<Kind, string> = {
  pure: 'bg-emerald-100 text-emerald-900 ring-emerald-200',
  ref: 'bg-amber-100 text-amber-900 ring-amber-200',
  collection: 'bg-sky-100 text-sky-900 ring-sky-200',
}

export function App() {
  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      <Intro />
      {ENTRIES.map((entry, i) => (
        <PatternScreen key={entry.filename} entry={entry} index={i} total={ENTRIES.length} />
      ))}
    </div>
  )
}

function Intro() {
  return (
    <section className="snap-start min-h-screen flex items-center">
      <div className="mx-auto max-w-5xl px-8 py-12 w-full">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          v0.0.1 · MIT · {ENTRIES.length} APG patterns
        </div>
        <h1 className="text-6xl font-bold tracking-tight text-stone-900">@p/headless</h1>
        <p className="mt-4 max-w-2xl text-xl text-stone-600">
          Behavior infrastructure for WAI-ARIA. Roving tabindex, axis composition,{' '}
          <span className="font-medium text-stone-900">{ENTRIES.length} APG patterns</span> — zero
          markup vocabulary, zero CSS.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Pillar
            title="W3C-faithful"
            body="Names, roles and structure follow WAI-ARIA + APG verbatim. File names mirror APG URL slugs."
          />
          <Pillar
            title="Behavior, not chrome"
            body="One layer below Radix-class libraries. Ships axes, roving tabindex, gesture/intent — no components, markup, or styles."
          />
          <Pillar
            title="LLM-workable"
            body="Each recipe = (data, onEvent, opts) → { rootProps, partProps(id), items }. One shape across all patterns."
          />
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <code className="rounded-md bg-stone-900 px-3 py-2 text-sm font-mono text-white">
            pnpm add @p/headless
          </code>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/"
            className="text-sm text-stone-600 underline underline-offset-4 hover:text-stone-900"
          >
            W3C APG ↗
          </a>
          <span className="ml-auto text-xs text-stone-500">scroll ↓ to browse {ENTRIES.length} patterns</span>
        </div>
      </div>
    </section>
  )
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">{body}</p>
    </div>
  )
}

function PatternScreen({
  entry,
  index,
  total,
}: {
  entry: Entry
  index: number
  total: number
}) {
  const { Component, title, apg, kind, blurb, source, filename } = entry

  return (
    <section className="snap-start h-screen flex flex-col">
      <header className="flex items-baseline gap-3 border-b border-stone-200 bg-white px-8 py-4">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${KIND_BADGE[kind]}`}
        >
          {KIND_LABEL[kind]}
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
        <span className="text-xs font-mono text-stone-400">
          {index + 1} / {total}
        </span>
      </header>

      <div className="grid flex-1 grid-cols-2 overflow-hidden">
        <div className="grid place-items-center overflow-auto bg-stone-50 p-8">
          <div className="rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
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
    } catch {}
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
