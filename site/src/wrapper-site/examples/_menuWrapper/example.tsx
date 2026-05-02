import { activate, fromList, navigate, reduceWithDefaults } from '@p/headless'
import { dedupe, probe } from '../../../headless-site/keys'
import type { MenuSlotProps, MenuSlots } from './slots'

export const menuStore = fromList([
  { label: 'New file', icon: '+', shortcut: 'N' },
  { label: 'Open', icon: 'O', shortcut: 'O' },
  { label: 'Save', icon: 'S', shortcut: 'S' },
  { label: 'Close', icon: 'X' },
])

export const menuReducer = reduceWithDefaults

export const menuWrapperKeys = () => dedupe([...probe(navigate('vertical')), ...probe(activate), 'A-Z'])

export const menuSlots: MenuSlots = {
  icon: renderIcon,
  shortcut: renderShortcut,
}

function renderIcon({ data }: MenuSlotProps) {
  if (typeof data.icon !== 'string') return null
  return data.icon
}

function renderShortcut({ data }: MenuSlotProps) {
  if (typeof data.shortcut !== 'string') return null
  return data.shortcut
}
