/**
 * @p/headless/patterns — W3C APG `/patterns/` recipe layer.
 *
 * 정체성: 컴포넌트 0건, markup 어휘 0건, 토큰/CSS 0건.
 * 각 recipe = `(data, onEvent, opts?) → { rootProps, <part>Props(id), items }` 통일 시그니처.
 *
 * 네이밍 규약:
 *   - hook 호출(useCallback/useRovingTabIndex 등)을 내장하면 `useXPattern` (React Rules of Hooks)
 *   - pure (props 만 반환, hook 미호출) 이면 `xPattern`
 *   - subpath/파일명은 W3C APG URL slug 미러 (변경 ❌)
 *
 * 사용:
 *   import { useListboxPattern, useTabsPattern, useTreePattern } from '@p/headless/patterns'
 *
 * primitive 직접 조립 (escape hatch):
 *   import { useRovingTabIndex, composeAxes } from '@p/headless'
 *
 * 자세한 명세는 packages/headless/PATTERNS.md
 */

export { useAriaListbox, useListboxPattern, type ListboxOptions } from './listbox'
export { useTabsPattern, type TabsOptions } from './tabs'
export { useTreePattern, type TreeOptions } from './tree'
export { useRadioGroupPattern, type RadioGroupOptions } from './radioGroup'
export { useToolbarPattern, type ToolbarOptions } from './toolbar'

export { useMenuPattern, type MenuOptions } from './menu'
export { useMenubarPattern, type MenubarOptions } from './menubar'
export { useComboboxPattern, type ComboboxOptions } from './combobox'
export { useTreeGridPattern, type TreeGridOptions } from './treeGrid'
export { useAccordionPattern, type AccordionOptions } from './accordion'
export { useDialogPattern, type DialogOptions } from './dialog'
export { useTooltipPattern, type TooltipOptions } from './tooltip'

export { disclosurePattern, type DisclosureOptions } from './disclosure'
export { sliderPattern, type SliderOptions } from './slider'
export { splitterPattern, type SplitterOptions } from './splitter'
export { toggleSwitchPattern, type SwitchOptions } from './switch'
export { navigationListPattern, type NavigationListOptions } from './navigationList'
export { alertPattern, alertdialogPattern } from './alert'

export type { BaseItem, TreeItem, ToolbarItem, RootProps, ItemProps } from './types'
