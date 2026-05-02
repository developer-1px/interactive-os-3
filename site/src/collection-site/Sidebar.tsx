import { useState } from 'react'
import { COLLECTION_ENTRIES } from './registry'

export function Sidebar({ activeSlug }: { activeSlug: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed left-4 top-4 z-50 rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow hover:bg-stone-50"
      >
        {open ? 'Close' : `Collections (${COLLECTION_ENTRIES.length})`}
      </button>
      {open && (
        <nav
          aria-label="Collection index"
          className="fixed left-4 top-14 z-50 max-h-[80vh] w-72 overflow-auto rounded-lg border border-stone-200 bg-white p-3 shadow-xl"
        >
          <a
            href="#intro"
            onClick={() => setOpen(false)}
            className="mb-3 block rounded px-2 py-1 text-xs font-medium text-stone-600 hover:bg-stone-100"
          >
            Intro
          </a>
          <ul>
            {COLLECTION_ENTRIES.map((entry) => {
              const isActive = activeSlug === entry.slug
              return (
                <li key={entry.slug}>
                  <a
                    href={`#${entry.slug}`}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
                      isActive ? 'bg-stone-900 text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{entry.title}</span>
                    <code
                      className={`text-[10px] font-mono ${isActive ? 'text-stone-300' : 'text-stone-400'}`}
                    >
                      #{entry.slug}
                    </code>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}
