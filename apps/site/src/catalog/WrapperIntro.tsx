export function Intro() {
  return (
    <section id="intro" tabIndex={-1} className="snap-start h-screen grid place-items-center bg-white">
      <div className="max-w-3xl px-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-700">
          Wrapper layer
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-950">
          Closed structure, open content slots.
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Wrappers keep ARIA structure, roving focus, and reducer events inside the
          component. Examples on this route show the intended usage surface: normalized data,
          onEvent, and item-data slots.
        </p>
      </div>
    </section>
  )
}
