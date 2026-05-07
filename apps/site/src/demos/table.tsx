export const meta = {
  title: 'Table',
  apg: 'table',
  kind: 'collection' as const,
  blurb: 'Native <table> with <thead>/<tbody>, <th scope="col"> column headers — APG /table/ 1:1.',
  keys: () => [],
}

const ROWS = [
  { name: 'Ada Lovelace', role: 'Engineer', dept: 'Platform' },
  { name: 'Linus Torvalds', role: 'Architect', dept: 'Kernel' },
  { name: 'Grace Hopper', role: 'Director', dept: 'Compilers' },
  { name: 'Alan Turing', role: 'Researcher', dept: 'Theory' },
]

export default function TableDemo() {
  return (
    <table className="w-full border-collapse border border-stone-200 text-sm">
      <caption className="caption-top pb-2 text-left text-xs text-stone-500">Employees</caption>
      <thead className="bg-stone-50">
        <tr>
          <th scope="col" className="border border-stone-200 px-3 py-1.5 text-left font-medium text-stone-700">Name</th>
          <th scope="col" className="border border-stone-200 px-3 py-1.5 text-left font-medium text-stone-700">Role</th>
          <th scope="col" className="border border-stone-200 px-3 py-1.5 text-left font-medium text-stone-700">Department</th>
        </tr>
      </thead>
      <tbody>
        {ROWS.map((r, i) => (
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
