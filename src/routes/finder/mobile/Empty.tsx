export function Empty({ note }: { note?: string } = {}) {
  return (
    <section aria-roledescription="finder-empty">
      <p>{note ?? '표시할 항목이 없습니다'}</p>
    </section>
  )
}
