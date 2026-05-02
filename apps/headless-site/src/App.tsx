import {
  AccordionDemo,
  DialogDemo,
  DisclosureDemo,
  ListboxDemo,
  RadioGroupDemo,
  SwitchDemo,
  TabsDemo,
  TooltipDemo,
} from './demos'

const PATTERNS: Array<{
  id: string
  title: string
  apg: string
  blurb: string
  demo: React.ComponentType
}> = [
  { id: 'tabs', title: 'Tabs', apg: 'tabs', blurb: 'Roving tabindex · automatic activation · Arrow/Home/End', demo: TabsDemo },
  { id: 'listbox', title: 'Listbox', apg: 'listbox', blurb: 'Single-select · typeahead · APG selection-follows-focus', demo: ListboxDemo },
  { id: 'accordion', title: 'Accordion', apg: 'accordion', blurb: 'Roving + expand axis · single/multiple · proper header/button nesting', demo: AccordionDemo },
  { id: 'radiogroup', title: 'Radio Group', apg: 'radio', blurb: 'Two-axis Arrow nav · APG selection-follows-focus enforced', demo: RadioGroupDemo },
  { id: 'disclosure', title: 'Disclosure', apg: 'disclosure', blurb: 'Pure recipe · controlled boolean · aria-expanded/controls auto', demo: DisclosureDemo },
  { id: 'switch', title: 'Switch', apg: 'switch', blurb: 'role="switch" · Space/Enter activate · distinct from checkbox', demo: SwitchDemo },
  { id: 'tooltip', title: 'Tooltip', apg: 'tooltip', blurb: 'Hover/focus delays · Escape close · aria-describedby', demo: TooltipDemo },
  { id: 'dialog', title: 'Dialog (modal)', apg: 'dialog-modal', blurb: 'First-focusable on open · Escape close · returnFocus on close', demo: DialogDemo },
]

const ALL_PATTERNS = [
  'tabs', 'listbox', 'tree', 'treegrid', 'menu', 'menubar', 'combobox',
  'accordion', 'radio', 'toolbar', 'navigation', 'disclosure', 'switch',
  'tooltip', 'dialog', 'alertdialog', 'alert', 'slider', 'splitter',
]

export function App() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <header className="mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          v0.0.1 · MIT
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-stone-900">
          @p/headless
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-stone-600">
          Behavior infrastructure for WAI-ARIA. Roving tabindex, axis composition,{' '}
          <span className="text-stone-900 font-medium">19 APG patterns</span> — zero markup vocabulary, zero CSS.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <code className="rounded-md bg-stone-900 px-3 py-2 text-sm text-white font-mono">
            pnpm add @p/headless
          </code>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/"
            className="text-sm text-stone-600 hover:text-stone-900 underline underline-offset-4"
          >
            W3C APG ↗
          </a>
        </div>
      </header>

      {/* Identity */}
      <section className="mb-16 grid gap-6 md:grid-cols-3">
        <Pillar
          title="W3C-faithful"
          body="Names, roles and structure follow WAI-ARIA + APG verbatim. No DS or library taxonomy mixed in. File names mirror the APG URL slugs."
        />
        <Pillar
          title="Behavior, not chrome"
          body="One layer below Radix-class libraries. Ships axis composition, roving tabindex, gesture/intent translation — not components, markup or styles."
        />
        <Pillar
          title="LLM-workable"
          body="Each recipe = (data, onEvent, opts) → { rootProps, partProps(id), items }. Single shape across all 19 patterns. No assembly choices to memorize."
        />
      </section>

      {/* Anatomy */}
      <section className="mb-16 rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Anatomy of a recipe</h2>
        <p className="mt-2 text-sm text-stone-600">
          Every pattern follows the same shape. Bring your own markup and styles.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-stone-950 p-4 text-xs text-stone-100 font-mono leading-relaxed">
{`import { fromList, reduce } from '@p/headless'
import { useTabsPattern } from '@p/headless/patterns'

const [data, setData] = useState(() => fromList([
  { label: 'Overview', selected: true },
  { label: 'Behavior' },
]))

const { rootProps, tabProps, panelProps, items } = useTabsPattern(
  data,
  (e) => setData((d) => reduce(d, e)),
)

// then spread props onto your own markup`}
        </pre>
      </section>

      {/* Pattern demos */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-stone-900">Patterns</h2>
          <span className="text-sm text-stone-500">8 of 19 shown</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {PATTERNS.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-stone-200 bg-white p-5"
            >
              <header className="mb-4 flex items-baseline justify-between">
                <h3 className="text-base font-semibold text-stone-900">{p.title}</h3>
                <a
                  href={`https://www.w3.org/WAI/ARIA/apg/patterns/${p.apg}/`}
                  className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  APG ↗
                </a>
              </header>
              <p className="mb-4 text-xs text-stone-600">{p.blurb}</p>
              <div className="rounded-lg bg-stone-50 p-4 ring-1 ring-stone-200">
                <p.demo />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Full inventory */}
      <section className="mb-16">
        <h2 className="text-xl font-semibold text-stone-900">All 19 patterns</h2>
        <p className="mt-2 text-sm text-stone-600">
          File names mirror W3C APG URL slugs verbatim — never re-named.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {ALL_PATTERNS.map((slug) => (
            <a
              key={slug}
              href={`https://www.w3.org/WAI/ARIA/apg/patterns/${slug === 'navigation' ? 'navigation-list' : slug}/`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-stone-200 bg-white px-2.5 py-1 text-xs font-mono text-stone-700 hover:border-stone-400"
            >
              {slug}
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 pt-8 text-sm text-stone-500">
        <p>
          Carved out of a larger design system. Behavior layer ships independently —
          bring your own tokens, styles, and components.
        </p>
      </footer>
    </div>
  )
}

function Pillar({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <p className="mt-2 text-sm text-stone-600 leading-relaxed">{body}</p>
    </div>
  )
}
