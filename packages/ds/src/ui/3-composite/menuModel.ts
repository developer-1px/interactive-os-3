import type { NormalizedData } from '@p/headless/types'

export type MenuItemRole = 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'separator'

export type MenuApgOptions = {
  case?: 'editor' | 'navigation'
  parentActivation?: 'open' | 'activate'
  selectionActivation?: 'select' | 'activate'
}

export const readMenuRole = (data: NormalizedData, id: string): MenuItemRole => {
  const raw = data.entities[id]?.data?.role ?? data.entities[id]?.data?.kind
  if (raw === 'menuitemcheckbox' || raw === 'checkbox') return 'menuitemcheckbox'
  if (raw === 'menuitemradio' || raw === 'radio') return 'menuitemradio'
  if (raw === 'separator') return 'separator'
  return 'menuitem'
}

export const isMenuChecked = (data: NormalizedData, id: string): boolean =>
  Boolean(data.entities[id]?.data?.checked ?? data.entities[id]?.data?.selected)
