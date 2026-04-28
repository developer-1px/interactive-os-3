import type { ComponentPropsWithoutRef } from 'react'

type PaginationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> & {
  page: number
  pageCount: number
  siblingCount?: number
  onPageChange?: (page: number) => void
  labels?: { previous?: string; next?: string; page?: (n: number) => string; ellipsis?: string }
}

const range = (start: number, end: number): number[] =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i)

function buildPages(page: number, pageCount: number, sib: number): Array<number | 'ellipsis'> {
  if (pageCount <= 1) return [1]
  const first = 1
  const last = pageCount
  const left = Math.max(page - sib, first + 1)
  const right = Math.min(page + sib, last - 1)
  const result: Array<number | 'ellipsis'> = [first]
  if (left > first + 1) result.push('ellipsis')
  result.push(...range(left, right))
  if (right < last - 1) result.push('ellipsis')
  if (last > first) result.push(last)
  return result
}

/**
 * Pagination — Material/Polaris/Ant 수렴 패턴. role="navigation" + aria-current="page".
 */
export function Pagination({
  page, pageCount, siblingCount = 1, onPageChange,
  labels = {}, 'aria-label': ariaLabel = 'Pagination', ...rest
}: PaginationProps) {
  const prev = labels.previous ?? 'Previous'
  const next = labels.next ?? 'Next'
  const ellipsisLabel = labels.ellipsis ?? '…'
  const pageLabel = labels.page ?? ((n: number) => `Page ${n}`)
  const items = buildPages(page, pageCount, siblingCount)
  const go = (n: number) => onPageChange?.(Math.min(Math.max(1, n), pageCount))

  return (
    <nav data-part="pagination" aria-label={ariaLabel} {...rest}>
      <ol>
        <li>
          <button type="button" data-part="page-prev" aria-label={prev} disabled={page <= 1} onClick={() => go(page - 1)}>
            {prev}
          </button>
        </li>
        {items.map((it, i) =>
          it === 'ellipsis' ? (
            <li key={`e${i}`}><span data-part="page-ellipsis" aria-hidden="true">{ellipsisLabel}</span></li>
          ) : (
            <li key={it}>
              <button
                type="button"
                data-part="page-num"
                aria-label={pageLabel(it)}
                aria-current={it === page ? 'page' : undefined}
                onClick={() => go(it)}
              >
                {it}
              </button>
            </li>
          )
        )}
        <li>
          <button type="button" data-part="page-next" aria-label={next} disabled={page >= pageCount} onClick={() => go(page + 1)}>
            {next}
          </button>
        </li>
      </ol>
    </nav>
  )
}
