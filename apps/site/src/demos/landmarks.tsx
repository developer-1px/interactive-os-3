export const meta = {
  title: 'Landmarks',
  apg: 'landmarks',
  kind: 'collection' as const,
  blurb: 'All 8 landmark regions in one page — semantic HTML covers everything.',
  keys: () => [],
}

export default function LandmarksDemo() {
  return (
    <div className="grid w-full grid-cols-[160px_1fr_140px] grid-rows-[auto_1fr_auto] gap-2 text-xs">
      <header className="col-span-3 rounded border-2 border-dashed border-stone-300 bg-amber-50 p-2">
        <span className="rounded bg-amber-200 px-1 font-mono">&lt;header&gt;</span>
        <span className="ml-2 text-stone-600">banner</span>
      </header>

      <nav aria-label="Primary" className="rounded border-2 border-dashed border-stone-300 bg-sky-50 p-2">
        <span className="rounded bg-sky-200 px-1 font-mono">&lt;nav&gt;</span>
        <span className="ml-2 text-stone-600">navigation</span>
        <ul className="mt-2 space-y-0.5 text-stone-500">
          <li>Home</li><li>Docs</li><li>Blog</li>
        </ul>
      </nav>

      <main className="space-y-2 rounded border-2 border-dashed border-stone-300 bg-emerald-50 p-2">
        <div>
          <span className="rounded bg-emerald-200 px-1 font-mono">&lt;main&gt;</span>
          <span className="ml-2 text-stone-600">main</span>
        </div>
        <div role="search" className="rounded border border-stone-300 bg-white p-2">
          <span className="rounded bg-violet-200 px-1 font-mono">role="search"</span>
          <span className="ml-2 text-stone-600">search</span>
          <input type="search" placeholder="Search…" className="mt-1 w-full rounded border border-stone-200 px-2 py-0.5" />
        </div>
        <form className="rounded border border-stone-300 bg-white p-2" aria-label="Subscribe">
          <span className="rounded bg-rose-200 px-1 font-mono">&lt;form&gt;</span>
          <span className="ml-2 text-stone-600">form (with name)</span>
        </form>
        <section aria-label="Latest" className="rounded border border-stone-300 bg-white p-2">
          <span className="rounded bg-stone-200 px-1 font-mono">&lt;section aria-label&gt;</span>
          <span className="ml-2 text-stone-600">region</span>
        </section>
      </main>

      <aside className="rounded border-2 border-dashed border-stone-300 bg-fuchsia-50 p-2">
        <span className="rounded bg-fuchsia-200 px-1 font-mono">&lt;aside&gt;</span>
        <span className="ml-2 text-stone-600">complementary</span>
      </aside>

      <footer className="col-span-3 rounded border-2 border-dashed border-stone-300 bg-orange-50 p-2">
        <span className="rounded bg-orange-200 px-1 font-mono">&lt;footer&gt;</span>
        <span className="ml-2 text-stone-600">contentinfo</span>
      </footer>
    </div>
  )
}
