import { certCategories } from '../entities/data'

export function CourseCategory() {
  return (
    <section aria-labelledby="cc-h" className="flex flex-col gap-3">
      <h2 id="cc-h" className="text-lg font-semibold text-neutral-900">과정 카테고리</h2>
      <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
        {certCategories.map((c) => (
          <li key={c.id} className="rounded border border-neutral-200 bg-white p-3">
            <div className="font-medium text-neutral-900">{c.name}</div>
            <div className="text-xs text-neutral-500">{c.desc}</div>
          </li>
        ))}
      </ul>
    </section>
  )
}
