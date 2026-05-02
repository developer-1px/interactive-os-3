import { ReproRecorderOverlay } from '@p/devtools'
import { Intro } from './Intro'
import { PatternScreen } from './PatternScreen'
import { Sidebar } from './Sidebar'
import { ENTRIES } from './registry'
import { useHashNavigation } from './useHashNavigation'

export function App() {
  const activeHash = useHashNavigation()

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      <Intro />
      {ENTRIES.map((entry, i) => (
        <PatternScreen key={entry.slug} entry={entry} index={i} total={ENTRIES.length} />
      ))}
      <Sidebar activeSlug={activeHash} />
      <ReproRecorderOverlay />
    </div>
  )
}
