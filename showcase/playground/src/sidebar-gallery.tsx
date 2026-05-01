import { useMemo, useState } from 'react'
import {
  ROOT,
  Renderer,
  definePage,
  merge,
  sampleSidebarTree,
  sidebarAdmin,
  useControlState,
  type UiEvent as DsEvent,
  type NormalizedData,
} from '@p/ds'


export function SidebarGallery() {
  const adminTree = useMemo(() => sampleSidebarTree({ seed: 7 }), [])
  const brainwaveTree = useMemo(() => sampleSidebarTree({ seed: 21, sections: 3 }), [])
  const railTree = useMemo(() => sampleSidebarTree({ seed: 42, sections: 2, withSubmenus: false }), [])
  const collapseTree = useMemo(() => sampleSidebarTree({ seed: 11, sections: 2 }), [])

  const [admin, dispatchAdmin] = useControlState(adminTree)
  const [brainwave, dispatchBrainwave] = useControlState(brainwaveTree)
  const [rail, dispatchRail] = useControlState(railTree)
  const [collapse, dispatchCollapse] = useControlState(collapseTree)
  const [collapsed, setCollapsed] = useState(false)

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
        cap_rail:      { id: 'cap_rail',      data: { type: 'Text', variant: 'small', content: 'rail · 56px · icons (static)' } },
        col_collapse:  { id: 'col_collapse',  data: { type: 'Column', flow: 'list' } },
        cap_collapse:  { id: 'cap_collapse',  data: { type: 'Text', variant: 'small', content: 'collapsible · 토글로 rail ↔ expanded' } },
      },
      relationships: {
        [ROOT]: ['page'],
        page: ['col_admin', 'col_brainwave', 'col_rail', 'col_collapse'],
        col_admin:     ['cap_admin', 'sb_admin'],
        col_brainwave: ['cap_brainwave', 'sb_brainwave'],
        col_rail:      ['cap_rail', 'sb_rail'],
        col_collapse:  ['cap_collapse', 'sb_collapse'],
      },
    }
    return definePage(merge(
      shell,
      sidebarAdmin({ id: 'sb_admin', label: '관리도구', tree: admin, onEvent: onEvent(dispatchAdmin) }),
      sidebarAdmin({ id: 'sb_brainwave', label: 'Brainwave', brand: 'Brainwave', tree: brainwave, onEvent: onEvent(dispatchBrainwave) }),
      sidebarAdmin({ id: 'sb_rail', label: 'Rail', tree: rail, onEvent: onEvent(dispatchRail), rail: true }),
      sidebarAdmin({ id: 'sb_collapse', label: 'Collapsible', tree: collapse, onEvent: onEvent(dispatchCollapse), rail: collapsed }),
    ))
  }, [admin, brainwave, rail, collapse, collapsed, dispatchAdmin, dispatchBrainwave, dispatchRail, dispatchCollapse])

  return (
    <>
      <button
        type="button"
        aria-pressed={collapsed}
        onClick={() => setCollapsed((v) => !v)}
        // eslint-disable-next-line no-restricted-syntax -- showcase 라우트 inline 토글
        style={{ position: 'fixed', insetBlockEnd: 16, insetInlineEnd: 16, zIndex: 10 }}
      >
        {collapsed ? '↔ Expand' : '↤ Collapse'} (4번째 sidebar)
      </button>
      <Renderer page={page} />
    </>
  )
}


