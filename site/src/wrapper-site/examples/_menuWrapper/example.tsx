import { ROOT, activate, fromList, navigate, reduceWithDefaults } from '@p/headless'
import { dedupe, probe } from '../../../headless-site/keys'
import type { MenuSlotProps, MenuSlots } from './slots'

interface MenuItem {
  label: string
  icon?: string
  shortcut?: string
}

const menuItems = fromList([
  { label: 'New file', icon: '+', shortcut: 'N' },
  { label: 'Open', icon: 'O', shortcut: 'O' },
  { label: 'Save', icon: 'S', shortcut: 'S' },
  { label: 'Close', icon: 'X' },
])

export const menuData = {
  ...menuItems,
  entities: {
    ...menuItems.entities,
    [ROOT]: { id: ROOT, data: { label: 'File' } },
  },
}

export const menuReducer = reduceWithDefaults

export const menuWrapperKeys = () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'A-Z'])

export const menuSlots: MenuSlots<MenuItem> = {
  icon: renderIcon,
  shortcut: renderShortcut,
}

function renderIcon({ data }: MenuSlotProps<MenuItem>) {
  if (typeof data.icon !== 'string') return null
  return data.icon
}

function renderShortcut({ data }: MenuSlotProps<MenuItem>) {
  if (typeof data.shortcut !== 'string') return null
  return data.shortcut
}
