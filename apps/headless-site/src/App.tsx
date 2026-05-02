import { useState } from 'react'
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

// SSoT — both the executed component AND its source come from the same file.
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

const ENTRIES: Entry[] = Object.entries(modules)
  .filter(([path]) => !path.includes('/_'))
  .map(([path, mod]) => ({
    ...mod.meta,
    Component: mod.default,
    source: sources[path] ?? '',
    filename: path.split('/').pop()!,
  }))

const KIND_ORDER: Kind[] = ['pure', 'ref', 'collection']

const KIND_INFO: Record<Kind, { label: string; sig: string; desc: string }> = {
  pure: {
    label: 'Pure recipe',
    sig: '(opts) → { props }',
    desc: '단순 boolean / 단일 메시지. 데이터 모델 불필요.',
  },
  ref: {
    label: 'Ref-based',
    sig: '(domRef, opts) → { props }',
    desc: 'DOM 측정·focus 관리에 ref 필요. open/close 상태는 controlled.',
  },
  collection: {
    label: 'Collection',
    sig: '(data, onEvent, opts) → { props, items }',
    desc: 'NormalizedData + UiEvent 표준 인터페이스. roving·typeahead·expand 합성.',
  },
}

export function App() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Hero />
      <Pillars />
      <Anatomy />
      <PatternsByKind />
      <Footer />
    </div>
  )
}

function Hero() {
  return (
    <header className="mb-16">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        v0.0.1 · MIT · {ENTRIES.length} APG patterns
      </div>
      <h1 className="text-5xl font-bold tracking-tight text-stone-900">@p/headless</h1>
      <p className="mt-3 max-w-2xl text-lg text-stone-600">
        Behavior infrastructure for WAI-ARIA. Roving tabindex, axis composition,{' '}
        <span className="font-medium text-stone-900">{ENTRIES.length} APG patterns</span> — zero markup
        vocabulary, zero CSS.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <code className="rounded-md bg-stone-900 px-3 py-2 text-sm font-mono text-white">
          pnpm add @p/headless
        </code>
        <a
          href="https://www.w3.org/WAI/ARIA/apg/"
          className="text-sm text-stone-600 underline underline-offset-4 hover:text-stone-900"
        >
          W3C APG ↗
        </a>
      </div>
    </header>
  )
}

function Pillars() {
  const items: Array<{ title: string; body: string }> = [
    {
      title: 'W3C-faithful',
      body: 'Names, roles and structure follow WAI-ARIA + APG verbatim. File names mirror APG URL slugs.',
    },
    {
      title: 'Behavior, not chrome',
      body: 'One layer below Radix-class libraries. Ships axes, roving tabindex, gesture/intent — no components, markup, or styles.',
    },
    {
      title: 'LLM-workable',
      body: 'Each recipe = (data, onEvent, opts) → { rootProps, partProps(id), items }. One shape across all 19 patterns.',
    },
  ]
  return (
    <section className="mb-16 grid gap-6 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.title} className="rounded-xl border border-stone-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-stone-900">{p.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.body}</p>
        </div>
      ))}
    </section>
  )
}

function Anatomy() {
  return (
    <section className="mb-16 rounded-xl border border-stone-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-stone-900">Three signature shapes</h2>
      <p className="mt-2 text-sm text-stone-600">
        Patterns split by data needs. Pick the smallest shape that fits.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {KIND_ORDER.map((k) => {
          const info = KIND_INFO[k]
          const count = ENTRIES.filter((e) => e.kind === k).length
          return (
            <div key={k} className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-stone-900">{info.label}</h3>
                <span className="text-xs text-stone-500">{count}</span>
              </div>
              <code className="mt-2 block text-xs font-mono text-stone-700">{info.sig}</code>
              <p className="mt-2 text-xs text-stone-600">{info.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PatternsByKind() {
  return (
    <section className="mb-16">
      <div className="mb-6 flex items-baseline justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-stone-900">All {ENTRIES.length} patterns</h2>
        <span className="text-sm text-stone-500">live · sources from disk</span>
      </div>
      <div className="space-y-12">
        {KIND_ORDER.map((kind) => {
          const list = ENTRIES.filter((e) => e.kind === kind)
          if (!list.length) return null
          return (
            <div key={kind}>
              <header className="mb-4 flex items-baseline gap-3 border-b border-stone-300 pb-2">
                <h3 className="text-lg font-semibold text-stone-900">{KIND_INFO[kind].label}</h3>
                <code className="text-xs font-mono text-stone-500">{KIND_INFO[kind].sig}</code>
                <span className="ml-auto text-xs text-stone-500">{list.length} patterns</span>
              </header>
              <div className="grid gap-6 md:grid-cols-2">
                {list.map((entry) => (
                  <PatternCard key={entry.filename} entry={entry} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PatternCard({ entry }: { entry: Entry }) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)
  const { Component, title, apg, blurb, source, filename } = entry

  const copy = async () => {
    await navigator.clipboard.writeText(source)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  return (
    <article className="flex flex-col rounded-xl border border-stone-200 bg-white p-5">
      <header className="mb-3 flex items-baseline justify-between gap-2">
        <h4 className="text-base font-semibold text-stone-900">{title}</h4>
        <a
          href={`https://www.w3.org/WAI/ARIA/apg/patterns/${apg}/`}
          className="text-xs text-stone-500 underline underline-offset-4 hover:text-stone-900"
          target="_blank"
          rel="noreferrer"
        >
          APG ↗
        </a>
      </header>
      <p className="mb-4 text-xs text-stone-600">{blurb}</p>

      <div className="mb-3 rounded-lg bg-stone-50 p-4 ring-1 ring-stone-200">
        <Component />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-stone-100 pt-3">
        <code className="text-xs font-mono text-stone-500">demos/{filename}</code>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={() => setShowCode((v) => !v)}
            className="rounded-md border border-stone-200 px-2 py-1 text-xs text-stone-700 hover:bg-stone-50"
          >
            {showCode ? 'Hide source' : 'View source'}
          </button>
        </div>
      </div>

      {showCode && (
        <pre className="mt-3 max-h-96 overflow-auto rounded-lg bg-stone-950 p-4 text-xs leading-relaxed text-stone-100 font-mono">
          <code>{source}</code>
        </pre>
      )}
    </article>
  )
}

function Footer() {
  return (
    <footer className="border-t border-stone-200 pt-8 text-sm text-stone-500">
      <p>
        All sources displayed above are loaded directly from{' '}
        <code className="font-mono text-stone-700">apps/headless-site/src/demos/*.tsx</code> via Vite{' '}
        <code className="font-mono text-stone-700">?raw</code> imports — what you see is what runs.
      </p>
    </footer>
  )
}
