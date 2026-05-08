/**
 * implChords — SPEC pattern key → 패턴 axis advertise chord set 라우팅.
 *
 * Issue #123/#124 (EPIC #121). 본 모듈은 두 소비자가 공유:
 *   - apgCoverage.test.ts (drift 게이트)
 *   - site /coverage 라우트 (시각화)
 *
 * 패턴마다 multiSelectable·orientation 등 옵션은 'maximum advertise' 측면 채택 —
 * 어떤 옵션 조합으로도 advertise 안 되는 chord 만 매트릭스 gap 으로 잡는다.
 */

import { accordionAxis } from '../patterns/accordion'
import { comboboxAxis } from '../patterns/combobox'
import { comboboxGridAxis } from '../patterns/comboboxGrid'
import { disclosureAxis } from '../patterns/disclosure'
import { feedAxis } from '../patterns/feed'
import { gridAxis } from '../patterns/grid'
import { listboxAxis } from '../patterns/listbox'
import { menuAxis } from '../patterns/menu'
import { menuButtonAxis } from '../patterns/menuButton'
import { menubarAxis } from '../patterns/menubar'
import { radioGroupAxis } from '../patterns/radioGroup'
import { sliderAxis } from '../patterns/slider'
import { sliderRangeAxis } from '../patterns/sliderRange'
import { spinbuttonAxis } from '../patterns/spinbutton'
import { splitterAxis } from '../patterns/splitter'
import { switchAxis } from '../patterns/switch'
import { tabsAxis } from '../patterns/tabs'
import { toolbarAxis } from '../patterns/toolbar'
import { treeAxis } from '../patterns/tree'
import { treeGridAxis } from '../patterns/treeGrid'
import { toggle, activate, escape } from '../axes'

export const IMPL_CHORDS: Record<string, () => readonly string[]> = {
  accordion: () => accordionAxis().spec.chords,
  combobox: () => comboboxAxis().spec.chords,
  comboboxGrid: () => comboboxGridAxis().spec.chords,
  disclosure: () => disclosureAxis().spec.chords,
  feed: () => feedAxis().spec.chords,
  grid: () => gridAxis({ multiSelectable: true }).spec.chords,
  listbox: () => listboxAxis({ multiSelectable: true }).spec.chords,
  menu: () => menuAxis({}).spec.chords,
  menuButton: () => menuButtonAxis().spec.chords,
  menubar: () => menubarAxis().spec.chords,
  radioGroup: () => radioGroupAxis().spec.chords,
  slider: () => sliderAxis({}).spec.chords,
  sliderRange: () => sliderRangeAxis({}).spec.chords,
  spinbutton: () => spinbuttonAxis().spec.chords,
  splitter: () => splitterAxis({}).spec.chords,
  switch: () => switchAxis().spec.chords,
  // tabs/toolbar: orientation 별로 chord 가 다르다 — 양 orientation union (max advertise).
  tabs: () => [
    ...tabsAxis({ orientation: 'horizontal' }).spec.chords,
    ...tabsAxis({ orientation: 'vertical' }).spec.chords,
  ],
  toolbar: () => [
    ...toolbarAxis({ orientation: 'horizontal' }).spec.chords,
    ...toolbarAxis({ orientation: 'vertical' }).spec.chords,
  ],
  tree: () => treeAxis({ multiSelectable: true }).spec.chords,
  treeGrid: () => treeGridAxis({ multiSelectable: true }).spec.chords,

  // 단순 axis 직접 사용
  checkbox: () => toggle.spec.chords,

  // pattern hook 이 escape axis 사용 (Tab 은 focusTrap 명령형 mechanic — 별도 정책)
  dialog: () => escape.spec.chords,
  alertDialog: () => escape.spec.chords,
  tooltip: () => escape.spec.chords,

  // pattern hook 없는 단순 HTML 요소
  button: () => activate.spec.chords,
  link: () => activate.spec.chords,
  alert: () => [],
  meter: () => [],
  breadcrumb: () => [],
  navigationList: () => [],
  carousel: () => [],
}
