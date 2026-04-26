/**
 * /keyboard — ds 부품의 키보드 인터랙션만 모아 보는 검증 페이지.
 *
 * ds 원칙: ui/ 부품은 키보드+ARIA를 self-attach로 내장 (onKeyDown prop 노출 금지).
 * 이 페이지는 각 roving 부품에 (a) 라이브 인스턴스, (b) 키 매핑 표,
 * (c) 라이브 포커스 추적기를 한 자리에 둔다.
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

export function Keyboard() {
  return (
    <main data-part="keyboard-test" aria-label="키보드 인터랙션 검증">
      <header>
        <h1>키보드 테스트</h1>
        <p>각 ds 부품에 포커스를 주고 화살표·Enter·Space·Esc·Home/End·문자 입력(typeahead)을 시도하세요.
        focus-within 표시와 활성 옵션 id가 라이브로 나타납니다.</p>
        <FocusTracker />
      </header>

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
    </main>
  )
}
