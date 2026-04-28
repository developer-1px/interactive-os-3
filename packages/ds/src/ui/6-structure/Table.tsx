import type { ComponentPropsWithoutRef, ReactNode } from 'react'

/**
 * Table — 데이터 주도 표 부품.
 *
 * columns + rows 데이터로만 채운다. JSX children/서브파트 ❌.
 * 셀렉터 namespace: `table[]`.
 *
 * - columns: { key, label } — header row 정의
 * - rows: Record<columnKey, ReactNode> — body row 데이터
 * - caption: optional <caption> — a11y 권장
 */
export type TableColumn = { key: string; label: ReactNode; align?: 'start' | 'end' | 'center' }

type TableProps = Omit<ComponentPropsWithoutRef<'table'>, 'children'> & {
  columns: TableColumn[]
  rows: Record<string, ReactNode>[]
  caption?: ReactNode
  empty?: ReactNode
}

export function Table({ columns, rows, caption, empty, ...rest }: TableProps) {
  if (rows.length === 0 && empty != null) {
    return <>{empty}</>
  }
  return (
    <table {...rest}>
      {caption != null && <caption>{caption}</caption>}
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.key} scope="col" data-col={c.key} data-align={c.align}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c.key} data-col={c.key} data-align={c.align}>
                {r[c.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
