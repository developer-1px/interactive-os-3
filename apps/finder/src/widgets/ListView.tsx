import type { ComponentPropsWithoutRef } from 'react'
import { useTreeGridPattern } from '@p/headless/patterns'
import { fromList } from '@p/headless'
import { formatDate, formatSize } from '../features/data'
import type { FsNode } from '../entities/types'

export function ListView({
  node,
  items,
  currentPath,
  onNavigate,
}: {
  node: FsNode | null
  items?: FsNode[]
  currentPath: string
  onNavigate: (path: string) => void
}) {
  const kids = items ?? node?.children ?? []
  const data = fromList(kids.map((n) => ({
    id: n.path,
    label: n.name,
    selected: n.path === currentPath,
  })))
  const onEvent = (e: { type: string; id?: string }) => {
    if (e.type === 'activate' && e.id) onNavigate(e.id)
  }
  const { rootProps, rowProps, cellProps, items: rows } = useTreeGridPattern(data, onEvent)

  return (
    <section aria-label="목록뷰" className="overflow-auto">
      <table
        {...(rootProps as ComponentPropsWithoutRef<'table'>)}
        aria-rowcount={kids.length}
        className="w-full table-fixed border-collapse text-sm"
      >
        <colgroup>
          <col style={{ width: '40%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '25%' }} />
        </colgroup>
        <thead>
          <tr className="border-b border-neutral-200 text-xs text-neutral-500">
            <th className="px-2 py-1 text-left font-medium">이름</th>
            <th className="px-2 py-1 text-left font-medium">수정일</th>
            <th className="px-2 py-1 text-left font-medium">크기</th>
            <th className="px-2 py-1 text-left font-medium">종류</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((it, i) => {
            const n = kids[i]
            const selected = n?.path === currentPath
            const kind = n?.type === 'dir' ? '폴더' : (n?.ext ?? '파일').toUpperCase()
            return (
              <tr
                key={it.id}
                {...(rowProps(it.id) as ComponentPropsWithoutRef<'tr'>)}
                aria-selected={selected || undefined}
                className={
                  'cursor-pointer ' +
                  'focus-within:outline-none ' +
                  (selected ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-50')
                }
              >
                <td {...(cellProps(it.id, 0) as ComponentPropsWithoutRef<'td'>)} className="truncate px-2 py-1">
                  <span className="mr-1" aria-hidden>{n?.type === 'dir' ? '📁' : '📄'}</span>
                  {n?.name}
                </td>
                <td {...(cellProps(it.id, 1) as ComponentPropsWithoutRef<'td'>)} className="truncate px-2 py-1">{formatDate(n?.mtime)}</td>
                <td {...(cellProps(it.id, 2) as ComponentPropsWithoutRef<'td'>)} className="truncate px-2 py-1">{n?.type === 'dir' ? '—' : formatSize(n?.size)}</td>
                <td {...(cellProps(it.id, 3) as ComponentPropsWithoutRef<'td'>)} className="truncate px-2 py-1">{kind}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
