import { useState, useRef, useEffect } from 'react'
import {
  Menu, Listbox, Tree, Columns, RadioGroup, CheckboxGroup,
  Toolbar, TabList, TabPanel,
  Combobox, Select,
  fromTree, fromList, useControlState, ROOT, type NormalizedData,
} from '../../ds'

/**
 * /keyboard — ds 부품의 키보드 인터랙션만 모아 보는 검증 페이지.
 *
 * ds 원칙: ui/ 부품은 키보드+ARIA를 self-attach로 내장 (onKeyDown prop 노출 금지).
 * 이 페이지는 각 roving 부품에 (a) 라이브 인스턴스, (b) 키 매핑 표,
 * (c) 라이브 포커스 추적기를 한 자리에 둔다.
 */
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

function FocusTracker() {
  const [info, setInfo] = useState({ tag: '—', role: '—', label: '—', activeId: '—' })
  useEffect(() => {
    const update = () => {
      const el = document.activeElement as HTMLElement | null
      if (!el) return
      setInfo({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role') ?? '—',
        label: el.getAttribute('aria-label') ?? el.textContent?.trim().slice(0, 40) ?? '—',
        activeId: el.getAttribute('aria-activedescendant') ?? el.id ?? '—',
      })
    }
    document.addEventListener('focusin', update)
    document.addEventListener('keyup', update)
    update()
    return () => {
      document.removeEventListener('focusin', update)
      document.removeEventListener('keyup', update)
    }
  }, [])
  return (
    <dl data-part="focus-tracker" aria-label="현재 포커스">
      <dt>tag</dt><dd>{info.tag}</dd>
      <dt>role</dt><dd>{info.role}</dd>
      <dt>label</dt><dd>{info.label}</dd>
      <dt>active id</dt><dd>{info.activeId}</dd>
    </dl>
  )
}

function Section({ title, shortcuts, children }: {
  title: string
  shortcuts: ReadonlyArray<readonly [string, string]>
  children: React.ReactNode
}) {
  return (
    <section aria-labelledby={`kb-${title}`}>
      <h2 id={`kb-${title}`}>{title}</h2>
      <div data-ds="Row">
        <FixtureFrame>{children}</FixtureFrame>
        <ShortcutTable rows={shortcuts} />
      </div>
    </section>
  )
}

function FixtureFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasFocus, setHasFocus] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onIn = () => setHasFocus(true)
    const onOut = () => setHasFocus(el.contains(document.activeElement))
    el.addEventListener('focusin', onIn)
    el.addEventListener('focusout', onOut)
    return () => {
      el.removeEventListener('focusin', onIn)
      el.removeEventListener('focusout', onOut)
    }
  }, [])
  return <div ref={ref} data-part="fixture" data-focused={hasFocus || undefined}>{children}</div>
}

function ShortcutTable({ rows }: { rows: ReadonlyArray<readonly [string, string]> }) {
  return (
    <table data-part="key-map">
      <thead><tr><th scope="col">key</th><th scope="col">action</th></tr></thead>
      <tbody>
        {rows.map(([k, a]) => (
          <tr key={k}><th scope="row"><kbd>{k}</kbd></th><td>{a}</td></tr>
        ))}
      </tbody>
    </table>
  )
}

const ARROW_VERT = [
  ['↓', '다음 항목'],
  ['↑', '이전 항목'],
  ['Home', '첫 항목'],
  ['End', '마지막 항목'],
  ['a-z', 'typeahead — 타이핑한 문자로 시작하는 항목으로 점프'],
] as const
const ARROW_HORI = [
  ['→', '다음 항목'],
  ['←', '이전 항목'],
  ['Home', '첫 항목'],
  ['End', '마지막 항목'],
] as const
const MENU_KEYS = [...ARROW_VERT, ['Enter / Space', 'activate'], ['Esc', '메뉴 닫기']] as const
const LISTBOX_KEYS = [...ARROW_VERT, ['Enter / Space', 'select']] as const
const TREE_KEYS = [
  ...ARROW_VERT,
  ['→', '확장 / 자식으로 이동'],
  ['←', '축소 / 부모로 이동'],
  ['Enter', 'activate'],
] as const
const COLUMNS_KEYS = [
  ['↓ ↑', '같은 컬럼 내 이동'],
  ['→', '자식 컬럼으로 진입'],
  ['←', '부모 컬럼으로 복귀'],
  ['Enter', 'activate (파일 열기)'],
  ['a-z', 'typeahead'],
] as const
const RADIO_KEYS = [
  ...ARROW_VERT,
  ...ARROW_HORI,
  ['Space', 'select'],
] as const
const CHECKBOX_KEYS = [
  ...ARROW_VERT,
  ['Space', 'toggle'],
] as const
const TABS_KEYS = [
  ...ARROW_HORI,
  ['Enter / Space', '탭 활성화'],
] as const
const TOOLBAR_KEYS = [
  ...ARROW_HORI,
  ['Enter / Space', '버튼 실행'],
] as const
const COMBOBOX_KEYS = [
  ['↓', '리스트 열기 / 다음'],
  ['↑', '이전'],
  ['Esc', '리스트 닫기'],
  ['Enter', '선택'],
  ['타이핑', '필터링'],
] as const
const SELECT_KEYS = [
  ...ARROW_VERT,
  ['Enter / Space', '리스트 열기 / 선택'],
  ['Esc', '닫기'],
] as const

const sampleTree = [
  { id: 'eng', label: '엔지니어링', kids: [
    { id: 'fe', label: '프론트엔드' },
    { id: 'be', label: '백엔드' },
    { id: 'ops', label: 'DevOps' },
  ]},
  { id: 'des', label: '디자인', kids: [
    { id: 'sys', label: '디자인 시스템' },
    { id: 'prod', label: '프로덕트' },
  ]},
]
const sampleList = [
  { id: 'apple', label: '사과' },
  { id: 'banana', label: '바나나' },
  { id: 'cherry', label: '체리' },
  { id: 'durian', label: '두리안' },
  { id: 'elderberry', label: '엘더베리' },
]

const toData = (n: { id: string; label: string }) => ({ label: n.label })
const getId = (n: { id: string }) => n.id
const getKids = (n: { kids?: unknown[] }) => n.kids as never

function useTreeData(expandedIds: string[] = ['eng'], focusId: string | null = 'fe') {
  const base = fromTree(sampleTree, { getId, getKids, toData, expandedIds, focusId })
  return useControlState(base)
}
function useListData(focusId: string | null = 'apple') {
  const base = fromList(sampleList, { getId, toData, focusId })
  return useControlState(base)
}

function MenuFixture() {
  const menu: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: { label: '파일' } },
      new:    { id: 'new',    data: { label: '새 파일' } },
      open:   { id: 'open',   data: { label: '열기...' } },
      save:   { id: 'save',   data: { label: '저장' } },
      recent: { id: 'recent', data: { label: '최근 항목' } },
      r1:     { id: 'r1',     data: { label: 'README.md' } },
      r2:     { id: 'r2',     data: { label: 'index.ts' } },
    },
    relationships: { [ROOT]: ['new', 'open', 'recent', 'save'], recent: ['r1', 'r2'] },
  }
  const [data, onEvent] = useControlState(menu)
  return <Menu data={data} onEvent={onEvent} />
}
function ListboxFixture() {
  const [data, onEvent] = useListData()
  return <Listbox data={data} onEvent={onEvent} aria-label="과일" />
}
function TreeFixture() {
  const [data, onEvent] = useTreeData(['eng', 'des'], 'sys')
  return <Tree data={data} onEvent={onEvent} aria-label="조직" />
}
function ColumnsFixture() {
  const [data, onEvent] = useTreeData(['eng'], 'fe')
  return <Columns data={data} onEvent={onEvent} aria-label="컬럼" />
}
function RadioFixture() {
  const base = fromList(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <RadioGroup data={data} onEvent={onEvent} aria-label="과일 (단일)" />
}
function CheckboxFixture() {
  const base = fromList(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <CheckboxGroup data={data} onEvent={onEvent} aria-label="과일 (복수)" />
}
function TabsFixture() {
  const [active, setActive] = useState('overview')
  const tabs: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      overview: { id: 'overview', data: { label: '개요', selected: active === 'overview' } },
      details:  { id: 'details',  data: { label: '상세', selected: active === 'details' } },
      logs:     { id: 'logs',     data: { label: '로그', selected: active === 'logs' } },
    },
    relationships: { [ROOT]: ['overview', 'details', 'logs'] },
  }
  const [data, onEvent] = useControlState(tabs)
  return (
    <>
      <TabList
        data={data}
        onEvent={(e) => {
          if (e.type === 'activate' || e.type === 'navigate') setActive(e.id)
          onEvent(e)
        }}
        aria-label="섹션"
      />
      <TabPanel id={`tab-panel-${active}`}>
        <p>현재 탭: <strong>{active}</strong></p>
      </TabPanel>
    </>
  )
}
function ToolbarFixture() {
  const tb: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      bold:      { id: 'bold',      data: { label: 'B' } },
      italic:    { id: 'italic',    data: { label: 'I' } },
      underline: { id: 'underline', data: { label: 'U' } },
      strike:    { id: 'strike',    data: { label: 'S' } },
    },
    relationships: { [ROOT]: ['bold', 'italic', 'underline', 'strike'] },
  }
  const [data, onEvent] = useControlState(tb)
  return <Toolbar data={data} onEvent={onEvent} aria-label="포맷" />
}
function ComboboxFixture() {
  const [value, setValue] = useState('')
  const items = sampleList.filter((i) => i.label.includes(value))
  const base = fromList(items, { getId, toData, focusId: items[0]?.id ?? null })
  const [data, onEvent] = useControlState(base)
  return (
    <Combobox
      data={data}
      onEvent={onEvent}
      value={value}
      onValueChange={setValue}
      aria-label="과일 검색"
    />
  )
}
function SelectFixture() {
  const [value, setValue] = useState('apple')
  const base = fromList(sampleList, { getId, toData, focusId: value })
  const [data, onEvent] = useControlState(base)
  return (
    <Select
      data={data}
      onEvent={(e) => {
        if (e.type === 'activate' || e.type === 'select') setValue(e.id)
        onEvent(e)
      }}
      value={value}
      aria-label="과일 선택"
    />
  )
}
