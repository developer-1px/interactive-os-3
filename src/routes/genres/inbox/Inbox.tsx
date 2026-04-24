/** Inbox — Gmail 3열 split. */
import { useMemo, useState } from 'react'
import {
  Renderer, definePage, useControlState, navigateOnActivate,
  type Event, type NormalizedData,
} from '../../../ds'
import { buildInboxPage } from './build'
import { folders, type FolderId } from './data'

export function Inbox() {
  const [folder, setFolder] = useState<FolderId>('inbox')
  const [selectedId, setSelected] = useState<string>('m1')

  const base = useMemo<NormalizedData>(() => {
    const entities: Record<string, { id: string; data: Record<string, unknown> }> = {
      __root__: { id: '__root__', data: {} },
      __focus__: { id: '__focus__', data: { id: folder } },
    }
    for (const f of folders) {
      entities[f.id] = {
        id: f.id,
        data: { label: f.label, icon: f.icon, badge: f.count, selected: f.id === folder },
      }
    }
    return { entities, relationships: { __root__: folders.map((f) => f.id) } }
  }, [folder])

  const [navData, navDispatch] = useControlState(base)
  const onFolderEvent = (e: Event) =>
    navigateOnActivate(navData, e).forEach((ev) => {
      navDispatch(ev)
      if (ev.type === 'activate') setFolder(ev.id as FolderId)
    })

  return (
    <Renderer
      page={definePage(
        buildInboxPage({
          folder, selectedId, setFolder, setSelected,
          folderNav: { data: navData, onEvent: onFolderEvent },
        }),
      )}
    />
  )
}
