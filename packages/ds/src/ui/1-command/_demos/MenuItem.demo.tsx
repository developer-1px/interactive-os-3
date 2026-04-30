import { useRovingDOM } from '@p/headless/roving/useRovingDOM'
import { MenuItem, MenuItemCheckbox, MenuItemRadio } from '../MenuItem'

export default function MenuItemDemo() {
  const ref = useRovingDOM<HTMLUListElement>(null, {
    orientation: 'vertical',
    itemSelector: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
  })
  return (
    <ul ref={ref} role="menu" aria-label="File">
      <MenuItem icon="file" shortcut="⌘N">New</MenuItem>
      <MenuItem icon="dir" shortcut="⌘O" indicator="chevronRight" selected>Open Recent</MenuItem>
      <MenuItem disabled>Save</MenuItem>
      <MenuItemCheckbox checked>Show ruler</MenuItemCheckbox>
      <MenuItemRadio checked>Light theme</MenuItemRadio>
      <MenuItemRadio checked={false}>Dark theme</MenuItemRadio>
    </ul>
  )
}
