import { KIND_LABEL, type Kind } from './kind'
import { ENTRIES } from './registry'

const GROUPS: Kind[] = ['pure', 'ref', 'collection', 'custom']

export function Intro() {
  return (
    <section id="intro" className="snap-start min-h-screen flex items-center">
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
        </div>

        <div className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            Patterns · click to jump
          </h2>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            {GROUPS.map((kind) => (
              <div key={kind}>
                <h3 className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  {KIND_LABEL[kind]}
                </h3>
                <ul className="space-y-0.5">
                  {ENTRIES.filter((e) => e.kind === kind).map((e) => (
                    <li key={e.slug}>
                      <a
                        href={`#${e.slug}`}
                        className="flex items-center justify-between rounded px-2 py-1 text-sm text-stone-700 hover:bg-stone-100"
                      >
                        <span>{e.title}</span>
                        <code className="text-[10px] font-mono text-stone-400">#{e.slug}</code>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
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
