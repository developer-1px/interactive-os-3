export function TitleBar({ path, onBack, canBack }: {
  path: string; onBack: () => void; canBack: boolean
}) {
  const name = path.split('/').filter(Boolean).pop() ?? 'root'
  return (
    <header>
      <div aria-roledescription="window-controls" aria-label="창 컨트롤">
        <span /><span /><span />
      </div>
      <button type="button" onClick={onBack} aria-disabled={!canBack || undefined} aria-label="뒤로">‹</button>
      <button type="button" aria-disabled aria-label="앞으로">›</button>
      <h1>{name}</h1>
    </header>
  )
}
