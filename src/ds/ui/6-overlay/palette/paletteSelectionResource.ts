import { defineResource } from '../../../data/resource'

/** CommandPalette columns의 focus id(=URL path). 화살표 navigate/expand는
 *  여기로 흡수되어 base가 expandedIds=pathAncestors(focusId)로 재시드한다.
 *  activate(leaf)는 controller가 가로채 router.navigate로 처리하므로
 *  이 자원의 onEvent에서는 단순 focus 이동만 흡수한다. */
export const paletteSelectionResource = defineResource<string>({
  key: () => 'palette/selection',
  initial: '',
  onEvent: (e) => {
    if (e.type === 'activate' || e.type === 'navigate') return e.id
    if (e.type === 'expand') return e.id
    return undefined
  },
})
