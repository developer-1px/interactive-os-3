import { MenuItem, MenuItemCheckbox, MenuItemRadio } from '../MenuItem'

export default function MenuItemDemo() {
  return (
    <ul role="menu" aria-label="File">
      <MenuItem icon="file" shortcut="⌘N">New</MenuItem>
      <MenuItem icon="dir" shortcut="⌘O" indicator="chevronRight" selected>Open Recent</MenuItem>
      <MenuItem disabled>Save</MenuItem>
      <MenuItemCheckbox checked>Show ruler</MenuItemCheckbox>
      <MenuItemRadio checked>Light theme</MenuItemRadio>
      <MenuItemRadio checked={false}>Dark theme</MenuItemRadio>
    </ul>
  )
}
