import { roleCategories } from '../entities/data'

export function RoleCategory() {
  return (
    <section aria-labelledby="rc-h" className="flex flex-col gap-3">
      <h2 id="rc-h" className="text-lg font-semibold text-neutral-900">직무 카테고리</h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
        {roleCategories.map((r) => (
          <li key={r.id} className="rounded border border-neutral-200 bg-white p-3">
            <div className="font-medium text-neutral-900">{r.name}</div>
            <div className="text-xs text-neutral-500">{r.desc}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
