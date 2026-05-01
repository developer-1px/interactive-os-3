/** Settings — 섹션 내비 + 폼 + danger zone. */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  SidebarAdminFloating,
  type UiEvent, type NormalizedData,
} from '@p/ds'
import { SECTIONS, type Digest, type SectionId } from './data'
import { buildSettingsPage } from './build'

function useSectionNav(active: SectionId, setActive: (id: SectionId) => void) {
  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: active } },
    }
    for (const [id, label] of SECTIONS) {
      entities[id] = { id, data: { label, selected: id === active } }
    }
    return { entities, relationships: { __root__: SECTIONS.map(([id]) => id) } }
  }, [active])
  const [data, dispatch] = useControlState(base)
  const onEvent = (e: UiEvent) =>
    navigateOnActivate(data, e).forEach((ev) => {
      dispatch(ev)
      if (ev.type === 'activate') setActive(ev.id as SectionId)
    })
  return { data, onEvent }
}

export function Settings() {
  const [section, setSection] = useState<SectionId>('profile')
  const [name, setName] = useState('유용태')
  const [email, setEmail] = useState('developer.1px@gmail.com')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifDigest, setNotifDigest] = useState<Digest>('weekly')
  const sectionNav = useSectionNav(section, setSection)
  return (
    <>
      <Renderer page={definePage(buildSettingsPage({
        section, name, email, notifEmail, notifPush, notifDigest,
        setSection, setName, setEmail, setNotifEmail, setNotifPush, setNotifDigest,
        sectionNav,
      }))} />
      <SidebarAdminFloating
        id="settings-nav-mobile"
        label="설정 내비게이션"
        tree={sectionNav.data}
        onEvent={sectionNav.onEvent}
        collection="listbox"
      />
    </>
  )
}
