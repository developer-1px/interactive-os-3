/** Inbox — Gmail 3열 split. */
import { useState } from 'react'
import { Renderer, definePage } from '../../../ds'
import { buildInboxPage } from './build'
import type { FolderId } from './data'

export function Inbox() {
  const [folder, setFolder] = useState<FolderId>('inbox')
  const [selectedId, setSelected] = useState<string>('m1')
  return <Renderer page={definePage(buildInboxPage({ folder, selectedId, setFolder, setSelected }))} />
}
