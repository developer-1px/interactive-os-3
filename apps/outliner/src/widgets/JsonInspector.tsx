/** JsonInspector — 임의 값 JSON 으로 직렬화해서 pre 로 표시. debug/inspector. */
export function JsonInspector({ value, title }: { value: unknown; title: string }) {
  return (
    <section className="flex-1 overflow-auto p-6">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{title}</h2>
      <pre className="whitespace-pre font-mono text-xs leading-relaxed text-neutral-800">{JSON.stringify(value, null, 2)}</pre>
    </section>
  )
}
