import { useState } from 'react'
import { videos } from '../entities/data'

type SortKey = 'title' | 'enrolled' | 'completion' | 'createdAt'

export function VideoList() {
  const [sort, setSort] = useState<SortKey>('createdAt')
  const sorted = [...videos].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title)
    if (sort === 'enrolled') return b.enrolled - a.enrolled
    if (sort === 'completion') return (b.completion ?? 0) - (a.completion ?? 0)
    return a.createdAt < b.createdAt ? 1 : -1
  })
  return (
    <section aria-labelledby="videos-h" className="flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <h2 id="videos-h" className="text-lg font-semibold text-neutral-900">비디오</h2>
        <label className="flex items-center gap-2 text-sm">
          정렬
          <select
            value={sort}
            onChange={(e) => setSort(e.currentTarget.value as SortKey)}
            className="rounded border border-neutral-200 px-2 py-1"
          >
            <option value="createdAt">최신순</option>
            <option value="title">제목순</option>
            <option value="enrolled">수강 많은 순</option>
            <option value="completion">완료율 높은 순</option>
          </select>
        </label>
      </header>
      <table aria-label="비디오 목록" className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-xs text-neutral-500">
            <th className="px-2 py-2 text-left font-medium">제목</th>
            <th className="px-2 py-2 text-left font-medium">레벨</th>
            <th className="px-2 py-2 text-left font-medium">수강</th>
            <th className="px-2 py-2 text-left font-medium">완료율</th>
            <th className="px-2 py-2 text-left font-medium">상태</th>
            <th className="px-2 py-2 text-left font-medium">등록일</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((v) => (
            <tr key={v.id} className="border-b border-neutral-100 hover:bg-neutral-50">
              <td className="px-2 py-2">{v.title}</td>
              <td className="px-2 py-2">{v.level}</td>
              <td className="px-2 py-2">{v.enrolled}</td>
              <td className="px-2 py-2">{v.completion == null ? '—' : `${v.completion}%`}</td>
              <td className="px-2 py-2">{v.status}</td>
              <td className="px-2 py-2">{v.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
