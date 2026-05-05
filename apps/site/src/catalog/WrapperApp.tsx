import { CatalogSidebar } from './CatalogSidebar'
import { Intro } from './Intro'
import { WrapperScreen } from './WrapperScreen'
import { WRAPPER_ENTRIES } from './registry.wrappers'
import { useHashNavigation } from './useHashNavigation'

export function WrapperApp() {
  const activeHash = useHashNavigation()

  return (
    <div className="md:h-screen md:snap-y md:snap-mandatory md:overflow-y-scroll">
      <Intro />
      {WRAPPER_ENTRIES.map((entry, index) => (
        <WrapperScreen
          key={entry.slug}
          entry={entry}
          index={index}
          total={WRAPPER_ENTRIES.length}
        />
      ))}
      <CatalogSidebar
        ariaLabel="Wrapper index"
        buttonLabel="Wrappers"
        groups={[{ label: 'Wrappers', items: WRAPPER_ENTRIES }]}
        activeSlug={activeHash}
      />
    </div>
  )
}
