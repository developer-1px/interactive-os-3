/* eslint-disable react-refresh/only-export-components */
import { useLocalData } from '@p/headless/local'
import { Menu, menuData, menuReducer, menuSlots, menuWrapperKeys } from './_menuWrapper'

export const meta = {
  title: 'Menu Wrapper',
  apg: 'menu',
  blurb: 'Wrapper owns trigger, popup, focus return, Escape, and close-on-activate from one normalized data graph.',
  keys: menuWrapperKeys,
}

export default function Demo() {
  const [data, onEvent] = useLocalData(() => menuData, menuReducer)

  return (
    <Menu
      data={data}
      onEvent={onEvent}
      slots={menuSlots}
    />
  )
}
