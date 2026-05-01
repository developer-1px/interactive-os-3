/**
 * KeyboardLab — /keyboard 라우트 본문 (FocusTracker + APG fixture 그룹) 단일 Ui leaf.
 *
 * G5 원칙: FlatLayout 은 컴포넌트 조립층. 라이브 fixture 검증은 stateful 묶음이라
 * entity tree 1행으로 둔다. fixture 는 APG pattern 카테고리(roving·toggle·disclosure·input·navigation)
 * 별로 묶어 시각·키보드 분류가 같이 읽히게 한다.
 */
import { Section, FocusTracker, Group } from './Section'
import {
  MENU_KEYS, LISTBOX_KEYS, TREE_KEYS, COLUMNS_KEYS,
  RADIO_KEYS, CHECKBOX_KEYS, TABS_KEYS, TOOLBAR_KEYS,
  COMBOBOX_KEYS, SELECT_KEYS,
  ACCORDION_KEYS, DISCLOSURE_KEYS, SWITCH_KEYS, SLIDER_KEYS,
  SEGMENTED_KEYS, TOGGLEGROUP_KEYS, PAGINATION_KEYS, STEPPER_KEYS,
  MENUBAR_KEYS, SPINBUTTON_KEYS, DATAGRID_KEYS, TREEGRID_KEYS, DIALOG_KEYS,
} from './shortcuts'
import {
  MenuFixture, ListboxFixture, TreeFixture, ColumnsFixture,
  RadioFixture, CheckboxFixture, TabsFixture, ToolbarFixture,
  ComboboxFixture, SelectFixture,
  AccordionFixture, DisclosureFixture, SwitchFixture, SliderFixture,
  SegmentedFixture, ToggleGroupFixture, PaginationFixture, StepperFixture,
  MenubarFixture, SpinButtonFixture, DataGridFixture, TreeGridFixture, DialogFixture,
} from './fixtures'

export function KeyboardLab() {
  return (
    <>
      <FocusTracker />

      <Group title="Roving · single-select" caption="화살표로 이동, 한 항목만 활성">
        <Section title="Listbox"      shortcuts={LISTBOX_KEYS}><ListboxFixture /></Section>
        <Section title="RadioGroup"   shortcuts={RADIO_KEYS}><RadioFixture /></Section>
        <Section title="Select"       shortcuts={SELECT_KEYS}><SelectFixture /></Section>
        <Section title="Combobox"     shortcuts={COMBOBOX_KEYS}><ComboboxFixture /></Section>
        <Section title="Segmented"    shortcuts={SEGMENTED_KEYS}><SegmentedFixture /></Section>
      </Group>

      <Group title="Roving · multi-select / action" caption="화살표 + Space/Enter — 여러 항목 토글">
        <Section title="CheckboxGroup" shortcuts={CHECKBOX_KEYS}><CheckboxFixture /></Section>
        <Section title="ToggleGroup"   shortcuts={TOGGLEGROUP_KEYS}><ToggleGroupFixture /></Section>
        <Section title="Toolbar"       shortcuts={TOOLBAR_KEYS}><ToolbarFixture /></Section>
        <Section title="Menu"          shortcuts={MENU_KEYS}><MenuFixture /></Section>
        <Section title="Menubar"       shortcuts={MENUBAR_KEYS}><MenubarFixture /></Section>
      </Group>

      <Group title="Hierarchical · 2축" caption="↓↑은 형제, →← 은 부모/자식">
        <Section title="Tree"     shortcuts={TREE_KEYS}><TreeFixture /></Section>
        <Section title="Columns"  shortcuts={COLUMNS_KEYS}><ColumnsFixture /></Section>
        <Section title="Tabs"     shortcuts={TABS_KEYS}><TabsFixture /></Section>
        <Section title="DataGrid" shortcuts={DATAGRID_KEYS}><DataGridFixture /></Section>
        <Section title="TreeGrid" shortcuts={TREEGRID_KEYS}><TreeGridFixture /></Section>
      </Group>

      <Group title="Disclosure · expand/collapse" caption="네이티브 details + role=group">
        <Section title="Disclosure" shortcuts={DISCLOSURE_KEYS}><DisclosureFixture /></Section>
        <Section title="Accordion"  shortcuts={ACCORDION_KEYS}><AccordionFixture /></Section>
      </Group>

      <Group title="단일 입력 · 값 컨트롤" caption="키보드는 native 위임 — 안전·일관">
        <Section title="Switch"     shortcuts={SWITCH_KEYS}><SwitchFixture /></Section>
        <Section title="Slider"     shortcuts={SLIDER_KEYS}><SliderFixture /></Section>
        <Section title="SpinButton" shortcuts={SPINBUTTON_KEYS}><SpinButtonFixture /></Section>
      </Group>

      <Group title="Overlay · focus trap" caption="modal lifecycle — Esc·Tab 순환은 native">
        <Section title="Dialog" shortcuts={DIALOG_KEYS}><DialogFixture /></Section>
      </Group>

      <Group title="Navigation · landmark" caption="자연 tab order — roving 없음">
        <Section title="Pagination" shortcuts={PAGINATION_KEYS}><PaginationFixture /></Section>
        <Section title="Stepper"    shortcuts={STEPPER_KEYS}><StepperFixture /></Section>
      </Group>
    </>
  )
}
