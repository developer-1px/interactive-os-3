import type { ReactNode } from 'react'

/** /headless 페이지 — 카테고리 섹션. title + 1줄 요약 + API 표 + (선택) 라이브 데모. */
export function Section({
  title, oneLiner, api, demo,
}: {
  title: string
  oneLiner: string
  api: ReadonlyArray<readonly [string, string]>
  demo?: ReactNode
}) {
  return (
    <section aria-labelledby={`hl-${title}`}>
      <h2 id={`hl-${title}`}>{title}</h2>
      <p>{oneLiner}</p>
      <table data-part="api-table">
        <thead><tr><th scope="col">export</th><th scope="col">signature</th></tr></thead>
        <tbody>
          {api.map(([sym, sig]) => (
            <tr key={sym}>
              <th scope="row"><code>{sym}</code></th>
              <td><code>{sig}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      {demo}
    </section>
  )
}
