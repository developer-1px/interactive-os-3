import { kpi } from '../entities/data'

const ITEMS: { key: keyof typeof kpi; label: string }[] = [
  { key: 'totalVideos', label: '전체 영상' },
  { key: 'enrolled',    label: '수강 신청' },
  { key: 'completion',  label: '평균 완료율' },
  { key: 'rating',      label: '평균 별점' },
  { key: 'dropout',     label: '평균 이탈율' },
]

export function Dashboard() {
  return (
    <section aria-labelledby="dashboard-h" className="flex flex-col gap-6">
      <h2 id="dashboard-h" className="text-lg font-semibold text-neutral-900">대시보드</h2>
      <div role="list" aria-label="주요 지표" className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {ITEMS.map((it) => {
          const v = kpi[it.key]
          return (
            <div key={it.key} role="listitem" className="rounded border border-neutral-200 bg-white p-4">
              <dt className="text-xs text-neutral-500">{it.label}</dt>
              <dd className="mt-1 text-xl font-semibold text-neutral-900">{v.value}</dd>
              <dd className="text-xs text-neutral-500">{v.sub}</dd>
              <dd className="mt-1 text-xs text-emerald-600">{v.change}</dd>
            </div>
          )
        })}
      </div>
    </section>
  )
}
