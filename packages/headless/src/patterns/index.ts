/**
 * @p/headless/patterns — W3C APG `/patterns/` recipe layer.
 *
 * 정체성: 컴포넌트 0건, markup 어휘 0건, 토큰/CSS 0건.
 * 각 recipe = `(data, onEvent, opts?) → { rootProps, <part>Props(id), items }` 통일 시그니처.
 *
 * 사용:
 *   import { listbox, tabs, tree } from '@p/headless/patterns'
 *
 * primitive 직접 조립 (escape hatch):
 *   import { useRovingTabIndex, composeAxes } from '@p/headless'
 *
 * 자세한 명세는 packages/headless/PATTERNS.md
 */

export { listbox, type ListboxOptions } from './listbox'
export { tabs, type TabsOptions } from './tabs'
export { tree, type TreeOptions } from './tree'
export { radioGroup, type RadioGroupOptions } from './radioGroup'
export { toolbar, type ToolbarOptions } from './toolbar'

export { menu, type MenuOptions } from './menu'
export { menubar, type MenubarOptions } from './menubar'
export { combobox, type ComboboxOptions } from './combobox'
export { treeGrid, type TreeGridOptions } from './treeGrid'
export { disclosure, type DisclosureOptions } from './disclosure'
export { accordion, type AccordionOptions } from './accordion'
export { slider, type SliderOptions } from './slider'
export { splitter, type SplitterOptions } from './splitter'
export { toggleSwitch, type SwitchOptions } from './switch'

export { navigationList, type NavigationListOptions } from './navigationList'
export { dialog, type DialogOptions } from './dialog'
export { tooltip, type TooltipOptions } from './tooltip'
export { alert, alertdialog } from './alert'

export type { BaseItem, TreeItem, ToolbarItem, RootProps, ItemProps } from './types'
