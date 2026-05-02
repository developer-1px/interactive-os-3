import { useState } from 'react'
import { KINDS, KIND_LIST } from './kind'
import { ENTRIES } from './registry'

/**
 * Fixed top-right index button + popover. Lets the user (or an LLM tester) jump
 * to any pattern by hash. Closes on selection so the click doesn't double as
 * scroll-snap interception.
 */
export function Sidebar({ activeSlug }: { activeSlug: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow hover:bg-stone-50"
      >
        {open ? 'Close' : `Index (${ENTRIES.length})`}
      </button>
      {open && (
        <nav
          aria-label="Pattern index"
          className="fixed left-4 top-14 z-50 max-h-[80vh] w-72 overflow-auto rounded-lg border border-stone-200 bg-white p-3 shadow-xl"
        >
          <a
            href="#intro"
            onClick={() => setOpen(false)}
            className="mb-3 block rounded px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            ← Intro
          </a>
          {KIND_LIST.map((kind) => {
            const list = ENTRIES.filter((e) => e.kind === kind)
            if (!list.length) return null
            return (
              <div key={kind} className="mb-3">
                <h3 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  {KINDS[kind].label} · {list.length}
                </h3>
                <ul>
                  {list.map((e) => {
                    const isActive = activeSlug === e.slug
                    return (
                      <li key={e.slug}>
                        <a
                          href={`#${e.slug}`}
                          onClick={() => setOpen(false)}
                          className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
                            isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{e.title}</span>
                          <code
                            className={`text-[10px] font-mono ${isActive ? 'text-stone-300' : 'text-stone-400'}`}
                          >
                            #{e.slug}
                          </code>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </nav>
      )}
    </>
  )
}
