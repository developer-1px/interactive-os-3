import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import {
  ROOT,
  Renderer,
  definePage,
  merge,
  sampleSidebarTree,
  sidebarAdmin,
  sidebarBrainwave,
  sidebarRail,
  useControlState,
  type Event as DsEvent,
  type NormalizedData,
} from '../ds'

function SidebarGallery() {
  const adminTree = useMemo(() => sampleSidebarTree({ seed: 7 }), [])
  const brainwaveTree = useMemo(() => sampleSidebarTree({ seed: 21, sections: 3 }), [])
  const railTree = useMemo(() => sampleSidebarTree({ seed: 42, sections: 2, withSubmenus: false }), [])

  const [admin, dispatchAdmin] = useControlState(adminTree)
  const [brainwave, dispatchBrainwave] = useControlState(brainwaveTree)
  const [rail, dispatchRail] = useControlState(railTree)

  const onEvent = (dispatch: (e: DsEvent) => void) => (e: DsEvent) => dispatch(e)

  const page = useMemo<NormalizedData>(() => {
    const shell: NormalizedData = {
      entities: {
        [ROOT]:        { id: ROOT, data: {} },
        page:          { id: 'page', data: { type: 'Row', flow: 'list', emphasis: 'sunk', label: 'Sidebar Gallery' } },
        col_admin:     { id: 'col_admin',     data: { type: 'Column', flow: 'list' } },
        cap_admin:     { id: 'cap_admin',     data: { type: 'Text', variant: 'small', content: 'admin · 240px · tree only' } },
        col_brainwave: { id: 'col_brainwave', data: { type: 'Column', flow: 'list' } },
        cap_brainwave: { id: 'cap_brainwave', data: { type: 'Text', variant: 'small', content: 'brainwave · brand + tree' } },
        col_rail:      { id: 'col_rail',      data: { type: 'Column', flow: 'list' } },
        cap_rail:      { id: 'cap_rail',      data: { type: 'Text', variant: 'small', content: 'rail · 56px · icons' } },
      },
      relationships: {
        [ROOT]: ['page'],
        page: ['col_admin', 'col_brainwave', 'col_rail'],
        col_admin:     ['cap_admin', 'sb_admin'],
        col_brainwave: ['cap_brainwave', 'sb_brainwave'],
        col_rail:      ['cap_rail', 'sb_rail'],
      },
    }
    return definePage(merge(
      shell,
      sidebarAdmin({ id: 'sb_admin', label: '관리도구', tree: admin, onEvent: onEvent(dispatchAdmin) }),
      sidebarBrainwave({ id: 'sb_brainwave', label: 'Brainwave', brand: 'Brainwave', tree: brainwave, onEvent: onEvent(dispatchBrainwave) }),
      sidebarRail({ id: 'sb_rail', label: 'Rail', tree: rail, onEvent: onEvent(dispatchRail) }),
    ))
  }, [admin, brainwave, rail, dispatchAdmin, dispatchBrainwave, dispatchRail])

  return <Renderer page={page} />
}

export const Route = createFileRoute('/sidebar-gallery')({
  component: SidebarGallery,
  staticData: { palette: { label: 'Sidebar Gallery', to: '/sidebar-gallery' } },
})
