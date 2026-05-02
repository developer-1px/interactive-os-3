import { Intro } from './Intro'
import { CollectionScreen } from './CollectionScreen'
import { Sidebar } from './Sidebar'
import { COLLECTION_ENTRIES } from './registry'
import { useHashNavigation } from '../headless-site/useHashNavigation'

export function CollectionApp() {
  const activeHash = useHashNavigation()

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      <Intro />
      {COLLECTION_ENTRIES.map((entry, index) => (
        <CollectionScreen
          key={entry.slug}
          entry={entry}
          index={index}
          total={COLLECTION_ENTRIES.length}
        />
      ))}
      <Sidebar activeSlug={activeHash} />
    </div>
  )
}
