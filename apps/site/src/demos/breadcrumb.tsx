import { Fragment } from 'react'

export const meta = {
  title: 'Breadcrumb',
  apg: 'breadcrumb',
  kind: 'collection' as const,
  blurb: 'Native <nav aria-label="Breadcrumb"><ol> with aria-current="page" on the leaf.',
  keys: () => [],
}

const TRAIL = [
  { label: 'Home', href: '#home' },
  { label: 'Documentation', href: '#docs' },
  { label: 'Patterns', href: '#patterns' },
  { label: 'Breadcrumb', href: '#breadcrumb' },
]

export default function Demo() {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {TRAIL.map((crumb, i) => {
          const isLast = i === TRAIL.length - 1
          return (
            <Fragment key={crumb.href}>
              <li>
                {isLast ? (
                  <span aria-current="page" className="font-medium text-stone-900">
                    {crumb.label}
                  </span>
                ) : (
                  <a href={crumb.href} className="text-stone-600 underline-offset-4 hover:underline">
                    {crumb.label}
                  </a>
                )}
              </li>
              {!isLast && <li aria-hidden className="text-stone-400">/</li>}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
