import type { ComponentPropsWithoutRef } from 'react'

/**
 * LeakTable — ds raw-value 누수 보고서.
 * 비즈니스 콘텐츠: 파일별 그룹 + (line, kind, snippet) 행. atlas 라우트의 leaks 데이터 시각화.
 */

export type LeakRow = { file: string; line: number; kind: string; snippet: string }

type LeakTableProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  leaks: LeakRow[]
  /** 파일 경로에서 제거할 prefix */
  stripPrefix?: string
}

export function LeakTable({ leaks, stripPrefix = '/src/ds/style/widgets/', ...rest }: LeakTableProps) {
  if (leaks.length === 0) return <p data-tone="good">누수 없음.</p>
  const byFile: Record<string, LeakRow[]> = {}
  for (const l of leaks) (byFile[l.file] ??= []).push(l)
  return (
    <div className="leak-table" {...rest}>
      {Object.entries(byFile).map(([file, list]) => (
        <details key={file}>
          <summary>
            <code>{file.replace(stripPrefix, '')}</code>{' '}
            <small>({list.length})</small>
          </summary>
          <table>
            <thead>
              <tr>
                <th data-col="line">line</th>
                <th data-col="kind">kind</th>
                <th data-col="snippet">snippet</th>
              </tr>
            </thead>
            <tbody>
              {list.map((l, i) => (
                <tr key={i}>
                  <td data-col="line">{l.line}</td>
                  <td data-col="kind">{l.kind}</td>
                  <td data-col="snippet">{l.snippet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  )
}
