import { useState } from 'react'

export const meta = {
  title: 'Table · Sortable',
  apg: 'sortable-table',
  kind: 'collection' as const,
  blurb: 'Native <table> with aria-sort on <th> + <button> header — APG /sortable-table/ 1:1.',
  keys: () => [],
}

type Row = { name: string; role: string; dept: string }
type Col = keyof Row
type Sort = { col: Col; dir: 'ascending' | 'descending' }

const ROWS: Row[] = [
  { name: 'Ada Lovelace', role: 'Engineer', dept: 'Platform' },
  { name: 'Linus Torvalds', role: 'Architect', dept: 'Kernel' },
  { name: 'Grace Hopper', role: 'Director', dept: 'Compilers' },
  { name: 'Alan Turing', role: 'Researcher', dept: 'Theory' },
]

const COLS: { key: Col; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'dept', label: 'Department' },
]

export default function TableSortableDemo() {
  const [sort, setSort] = useState<Sort | null>(null)

  const onHeaderClick = (key: Col) => {
    setSort((s) =>
      s?.col !== key
        ? { col: key, dir: 'ascending' }
        : { col: key, dir: s.dir === 'ascending' ? 'descending' : 'ascending' },
    )
  }

  const sorted = sort
    ? [...ROWS].sort((a, b) => {
        const cmp = a[sort.col].localeCompare(b[sort.col])
        return sort.dir === 'ascending' ? cmp : -cmp
      })
    : ROWS

  return (
    <table className="w-full border-collapse border border-stone-200 text-sm">
      <caption className="caption-top pb-2 text-left text-xs text-stone-500">Employees — click a header to sort</caption>
      <thead className="bg-stone-50">
        <tr>
          {COLS.map((c) => {
            const dir = sort?.col === c.key ? sort.dir : 'none'
            const indicator = dir === 'ascending' ? ' ▲' : dir === 'descending' ? ' ▼' : ''
            return (
              <th
                key={c.key}
                scope="col"
                aria-sort={dir}
                className="border border-stone-200 p-0 text-left font-medium text-stone-700"
              >
                <button
                  type="button"
                  onClick={() => onHeaderClick(c.key)}
                  className="w-full px-3 py-1.5 text-left hover:bg-stone-200"
                >
                  {c.label}
                  <span aria-hidden className="text-stone-400">{indicator}</span>
                </button>
              </th>
            )
          })}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, i) => (
          <tr key={r.name} className={i % 2 === 1 ? 'bg-stone-50/50' : ''}>
            <td className="border border-stone-200 px-3 py-1.5 text-stone-900">{r.name}</td>
            <td className="border border-stone-200 px-3 py-1.5 text-stone-700">{r.role}</td>
            <td className="border border-stone-200 px-3 py-1.5 text-stone-700">{r.dept}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
