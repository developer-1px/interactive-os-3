/**
 * KeyboardLab — /keyboard 라우트 본문(FocusTracker + 10 fixtures) 단일 Ui leaf.
 *
 * G5 원칙: FlatLayout 은 컴포넌트 조립층. 라이브 fixture 검증은 stateful 묶음이라
 * entity tree 1행으로 둔다. 추후 fixture 별 Ui 분리 가능 (G2).
 */
import { Section, FocusTracker } from './Section'
import {
  MENU_KEYS, LISTBOX_KEYS, TREE_KEYS, COLUMNS_KEYS,
  RADIO_KEYS, CHECKBOX_KEYS, TABS_KEYS, TOOLBAR_KEYS,
  COMBOBOX_KEYS, SELECT_KEYS,
} from './shortcuts'
import {
  MenuFixture, ListboxFixture, TreeFixture, ColumnsFixture,
  RadioFixture, CheckboxFixture, TabsFixture, ToolbarFixture,
  ComboboxFixture, SelectFixture,
} from './fixtures'

export function KeyboardLab() {
  return (
    <>
      <FocusTracker />
      <Section title="Menu" shortcuts={MENU_KEYS}><MenuFixture /></Section>
      <Section title="Listbox" shortcuts={LISTBOX_KEYS}><ListboxFixture /></Section>
      <Section title="Tree" shortcuts={TREE_KEYS}><TreeFixture /></Section>
      <Section title="Columns" shortcuts={COLUMNS_KEYS}><ColumnsFixture /></Section>
      <Section title="RadioGroup" shortcuts={RADIO_KEYS}><RadioFixture /></Section>
      <Section title="CheckboxGroup" shortcuts={CHECKBOX_KEYS}><CheckboxFixture /></Section>
      <Section title="Tabs" shortcuts={TABS_KEYS}><TabsFixture /></Section>
      <Section title="Toolbar" shortcuts={TOOLBAR_KEYS}><ToolbarFixture /></Section>
      <Section title="Combobox" shortcuts={COMBOBOX_KEYS}><ComboboxFixture /></Section>
      <Section title="Select" shortcuts={SELECT_KEYS}><SelectFixture /></Section>
    </>
  )
}
