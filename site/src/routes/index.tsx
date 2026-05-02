/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Link } from '@tanstack/react-router'

const APPS: { to: string; params?: Record<string, string>; title: string; sub: string }[] = [
  { to: '/patterns', title: 'Patterns', sub: 'APG recipes — listbox, treegrid, menu, dialog, slider …' },
  { to: '/collections', title: 'Collections', sub: 'Wrapper candidates — store, value, onEvent, named slots' },
  { to: '/apps/finder/$', params: { _splat: '' }, title: 'Finder', sub: 'Mac Finder column view — keyboard-first navigation' },
  { to: '/apps/slides/$', params: { _splat: 'docs/slides-sample.md' }, title: 'Slides', sub: 'Markdown deck — ←/→, PageDown, F, ESC' },
  { to: '/apps/admin', title: 'Admin', sub: 'Course/role categories, video CRUD, ordering' },
  { to: '/apps/markdown/$', params: { _splat: 'README.md' }, title: 'Markdown', sub: 'Markdown viewer with file routing' },
]

function Landing() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 p-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">@p/headless</h1>
        <p className="text-base text-neutral-600">
          ARIA-correct headless behavior infra — axes, roving tabindex, gesture/intent split,
          declarative page tree, single resource interface. Visuals via Tailwind. No tokens, no CSS-in-JS.
        </p>
      </header>
      <section aria-labelledby="apps-h" className="flex flex-col gap-3">
        <h2 id="apps-h" className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Real apps built on bare headless
        </h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {APPS.map((a) => (
            <li key={a.to + (a.params?._splat ?? '')}>
              <Link
                to={a.to as never}
                params={a.params as never}
                className="block rounded border border-neutral-200 bg-white p-4 hover:border-neutral-900 hover:shadow-sm"
              >
                <div className="text-sm font-medium text-neutral-900">{a.title}</div>
                <div className="mt-1 text-xs text-neutral-500">{a.sub}</div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export const Route = createFileRoute('/')({
  component: Landing,
})
