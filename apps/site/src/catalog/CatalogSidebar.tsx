import { useState } from 'react'

export type CatalogGroup = {
  label: string
  items: { slug: string; title: string }[]
}

export function CatalogSidebar({
  ariaLabel,
  buttonLabel,
  groups,
  activeSlug,
}: {
  ariaLabel: string
  buttonLabel: string
  groups: CatalogGroup[]
  activeSlug: string
}) {
  const [open, setOpen] = useState(false)
  const total = groups.reduce((n, g) => n + g.items.length, 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed left-4 top-4 z-50 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow hover:bg-stone-50"
      >
        {open ? 'Close' : `${buttonLabel} (${total})`}
      </button>
      {open && (
        <nav
          aria-label={ariaLabel}
          className="fixed left-4 top-14 z-50 max-h-[80vh] w-72 overflow-auto rounded-lg border border-stone-200 bg-white p-3 shadow-xl"
        >
          <a
            href="#intro"
            onClick={() => setOpen(false)}
            className="mb-3 block rounded px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            ← Intro
          </a>
          {groups.map((group) => {
            if (!group.items.length) return null
            return (
              <div key={group.label} className="mb-3">
                <h3 className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  {group.label} · {group.items.length}
                </h3>
                <ul>
                  {group.items.map((e) => {
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
