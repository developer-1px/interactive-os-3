/** Inbox — Gmail 3열 split. */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  SidebarAdminFloating,
  ROOT,
  type Event, type NormalizedData,
} from '@p/ds'
import { buildInboxPage } from './build'
import { folders, ACTS, type FolderId } from './data'

const folderNavBase = (folder: FolderId): NormalizedData => {
  const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: folder } },
  }
  for (const f of folders) {
    entities[f.id] = {
      id: f.id,
      data: { label: f.label, icon: f.icon, badge: f.count, selected: f.id === folder },
    }
  }
  return { entities, relationships: { [ROOT]: folders.map((f) => f.id) } }
}

const listToolsBase = (): NormalizedData => ({
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'btnFilter' } },
    btnFilter:  { id: 'btnFilter',  data: { label: '필터',   icon: 'filter' } },
    btnCompose: { id: 'btnCompose', data: { label: '새 메일', icon: 'edit' } },
  },
  relationships: { [ROOT]: ['btnFilter', 'btnCompose'] },
})

const detailActionsBase = (): NormalizedData => {
  const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: 'actReply' } },
    sep1: { id: 'sep1', data: { separator: true } },
  }
  for (const [id, label, icon] of ACTS) {
    entities[id] = { id, data: { label, icon } }
  }
  return {
    entities,
    relationships: { [ROOT]: ['actReply', 'actForward', 'sep1', 'actArchive', 'actDelete'] },
  }
}

export function Inbox() {
  const [folder, setFolder] = useState<FolderId>('inbox')
  const [selectedId, setSelected] = useState<string>('m1')

  const folderBase = useMemo(() => folderNavBase(folder), [folder])
  const [navData, navDispatch] = useControlState(folderBase)
  const onFolderEvent = (e: Event) =>
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'activate') setFolder(ev.id as FolderId)
    })

  const [listToolsData, listToolsDispatch] = useControlState(useMemo(() => listToolsBase(), []))
  const onListToolsEvent = (e: Event) => {
    listToolsDispatch(e)
    if (e.type === 'activate' && e.id === 'btnCompose') alert('compose')
  }

  const [detailActionsData, detailActionsDispatch] = useControlState(useMemo(() => detailActionsBase(), []))
  const onDetailActionsEvent = (e: Event) => detailActionsDispatch(e)

  return (
    <>
      <Renderer
        page={definePage(
          buildInboxPage({
            folder, selectedId, setFolder, setSelected,
            folderNav: { data: navData, onEvent: onFolderEvent },
            listTools: { data: listToolsData, onEvent: onListToolsEvent },
            detailActions: { data: detailActionsData, onEvent: onDetailActionsEvent },
          }),
        )}
      />
      <SidebarAdminFloating
        id="inbox-folders-mobile"
        label="폴더"
        tree={navData}
        onEvent={onFolderEvent}
        collection="listbox"
      />
    </>
  )
}
