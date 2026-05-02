import { Intro } from './Intro'
import { WrapperScreen } from './WrapperScreen'
import { Sidebar } from './Sidebar'
import { WRAPPER_ENTRIES } from './registry'
import { useHashNavigation } from '../headless-site/useHashNavigation'

export function WrapperApp() {
  const activeHash = useHashNavigation()

  return (
    <div className="h-screen snap-y snap-mandatory overflow-y-scroll">
      <Intro />
      {WRAPPER_ENTRIES.map((entry, index) => (
        <WrapperScreen
          key={entry.slug}
          entry={entry}
          index={index}
          total={WRAPPER_ENTRIES.length}
        />
      ))}
      <Sidebar activeSlug={activeHash} />
    </div>
  )
}
