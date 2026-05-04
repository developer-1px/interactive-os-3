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

export { useListboxPattern, listboxAxis, type ListboxOptions } from './listbox'
export { useTabsPattern, tabsAxis, type TabsOptions } from './tabs'
export { useTreePattern, treeAxis, type TreeOptions } from './tree'
export { useRadioGroupPattern, radioGroupAxis, type RadioGroupOptions } from './radioGroup'
export { useToolbarPattern, toolbarAxis, type ToolbarOptions } from './toolbar'

export { useMenuPattern, menuAxis, type MenuOptions } from './menu'
export { useMenubarPattern, menubarAxis, type MenubarOptions } from './menubar'
export { useComboboxPattern, comboboxAxis, type ComboboxOptions } from './combobox'
export { useTreeGridPattern, treeGridAxis, type TreeGridOptions } from './treeGrid'
export { useAccordionPattern, accordionAxis, type AccordionOptions } from './accordion'
export { useDialogPattern, dialogKeys, type DialogOptions } from './dialog'
export { useTooltipPattern, tooltipKeys, type TooltipOptions } from './tooltip'

export {
  useFeedPattern, feedAxis,
  type FeedItem, type FeedEvent, type FeedOptions,
} from './feed'
export { useGridPattern, gridAxis, type GridOptions, type GridCell } from './grid'
export { useCarouselPattern, type CarouselOptions, type CarouselSlide } from './carousel'
export { spinbuttonPattern, spinbuttonAxis, type SpinbuttonOptions } from './spinbutton'

export { disclosurePattern, disclosureAxis, type DisclosureOptions } from './disclosure'
export { sliderPattern, sliderAxis, type SliderOptions } from './slider'
export { splitterPattern, splitterAxis, type SplitterOptions } from './splitter'
export { switchPattern, switchAxis, type SwitchOptions } from './switch'
export { navigationListPattern, type NavigationListOptions } from './navigationList'
export { alertPattern, alertdialogPattern, type AlertdialogOptions } from './alert'

export type {
  BaseItem, TreeItem, RootProps, ItemProps,
  PatternProps, ValuedPatternProps,
} from './types'
