import { ReproRecorderOverlay } from '@p/devtools'
import { CatalogSidebar } from './CatalogSidebar'
import { Intro } from './Intro'
import { PatternScreen } from './PatternScreen'
import { KINDS, KIND_LIST } from './kind'
import { ENTRIES } from './registry.patterns'
import { SnapPage, useActiveHash } from '../layout/SnapPage'

export function App() {
  const activeHash = useActiveHash()

  return (
    <SnapPage>
      <Intro />
      {ENTRIES.map((entry, i) => (
        <PatternScreen key={entry.slug} entry={entry} index={i} total={ENTRIES.length} />
      ))}
      <CatalogSidebar
        ariaLabel="Pattern index"
        buttonLabel="Index"
        groups={KIND_LIST.map((kind) => ({
          label: KINDS[kind].label,
          items: ENTRIES.filter((e) => e.kind === kind),
        }))}
        activeSlug={activeHash}
      />
      <ReproRecorderOverlay />
    </SnapPage>
  )
}
