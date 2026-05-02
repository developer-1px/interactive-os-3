/* eslint-disable react-refresh/only-export-components */
import { useLocalData } from '@p/headless/local'
import { Menu, menuReducer, menuSlots, menuStore, menuWrapperKeys } from './_menuWrapper'

export const meta = {
  title: 'Menu Wrapper',
  apg: 'menu',
  blurb: 'Wrapper surface owns trigger, popup, focus return, Escape, and close-on-activate.',
  keys: menuWrapperKeys,
}

export default function Demo() {
  const [value, onEvent] = useLocalData(() => menuStore, menuReducer)

  return (
    <Menu
      label="File"
      store={menuStore}
      value={value}
      onEvent={onEvent}
      slots={menuSlots}
    />
  )
}
