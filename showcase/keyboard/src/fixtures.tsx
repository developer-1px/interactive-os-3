/** /keyboard 페이지 — 부품별 라이브 fixture 컴포넌트. APG pattern 망라. */
import { useState } from 'react'
import {
  Menu, Listbox, Tree, Columns, RadioGroup, CheckboxGroup,
  Toolbar, TabList, TabPanel,
  Combobox, Select,
  Accordion, Disclosure, Switch, Slider, NumberInput,
  SegmentedControl, ToggleGroup, Pagination, Stepper,
  Menubar,
  DataGrid, DataGridRow, RowGroup, ColumnHeader, GridCell,
  TreeGrid, TreeRow,
  Dialog, Button,
  fromTree, useControlState, ROOT, FOCUS, type NormalizedData,
} from '@p/ds'
import { sampleList, getId, toData, useListData, useTreeData } from './sample'

export function MenuFixture() {
  const menu: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: { label: '파일' } },
      [FOCUS]: { id: FOCUS, data: { id: 'new' } },
      new:    { id: 'new',    data: { label: '새 파일' } },
      open:   { id: 'open',   data: { label: '열기...' } },
      save:   { id: 'save',   data: { label: '저장' } },
      recent: { id: 'recent', data: { label: '최근 항목' } },
      project:{ id: 'project',data: { label: '프로젝트' } },
      r1:     { id: 'r1',     data: { label: 'README.md' } },
      r2:     { id: 'r2',     data: { label: 'index.ts' } },
      p1:     { id: 'p1',     data: { label: 'admin' } },
      p2:     { id: 'p2',     data: { label: 'showcase' } },
    },
    relationships: {
      [ROOT]: ['new', 'open', 'recent', 'save'],
      recent: ['r1', 'r2'],
      r2: ['project'],
      project: ['p1', 'p2'],
    },
  }
  const [data, onEvent] = useControlState(menu)
  return <Menu data={data} onEvent={onEvent} />
}

export function ListboxFixture() {
  const [data, onEvent] = useListData()
  return <Listbox data={data} onEvent={onEvent} aria-label="과일" />
}

export function TreeFixture() {
  const [data, onEvent] = useTreeData(['eng', 'des'], 'sys')
  return <Tree data={data} onEvent={onEvent} aria-label="조직" />
}

export function ColumnsFixture() {
  const [data, onEvent] = useTreeData(['eng'], 'fe')
  return <Columns data={data} onEvent={onEvent} aria-label="컬럼" />
}

export function RadioFixture() {
  const base = fromTree(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <RadioGroup data={data} onEvent={onEvent} aria-label="과일 (단일)" />
}

export function CheckboxFixture() {
  const base = fromTree(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <CheckboxGroup data={data} onEvent={onEvent} aria-label="과일 (복수)" />
}

export function TabsFixture() {
  const [active, setActive] = useState('overview')
  const tabs: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [FOCUS]: { id: FOCUS, data: { id: active } },
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

export function ToolbarFixture() {
  const tb: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [FOCUS]: { id: FOCUS, data: { id: 'bold' } },
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

export function ComboboxFixture() {
  const [value, setValue] = useState('')
  return (
    <Combobox
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      aria-label="과일 검색"
      placeholder="과일 입력 (typeahead 필터)"
    />
  )
}

export function SelectFixture() {
  const [value, setValue] = useState('apple')
  return (
    <Select
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      aria-label="과일 선택"
    >
      {sampleList.map((it) => (
        <option key={it.id} value={it.id}>{it.label}</option>
      ))}
    </Select>
  )
}

export function AccordionFixture() {
  const [open, setOpen] = useState<Record<string, boolean>>({ a: true })
  return (
    <Accordion
      type="single"
      onToggle={((id: string, o: boolean) => setOpen((m) => ({ ...m, [id]: o }))) as never}
      items={[
        { id: 'a', summary: '계정', open: open.a, content: <p>이름·이메일·비밀번호.</p> },
        { id: 'b', summary: '알림', open: open.b, content: <p>이메일·푸시·소리.</p> },
        { id: 'c', summary: '결제', open: open.c, content: <p>카드·청구지·영수증.</p> },
      ]}
      aria-label="설정"
    />
  )
}

export function DisclosureFixture() {
  return (
    <Disclosure summary="고급 옵션 보기">
      <p>여기에 평소엔 숨겨진 추가 설정이 들어간다.</p>
    </Disclosure>
  )
}

export function SwitchFixture() {
  const [on, setOn] = useState(true)
  return (
    <Switch
      checked={on}
      onClick={() => setOn((v) => !v)}
      aria-label={`다크 모드 ${on ? '켜짐' : '꺼짐'}`}
    />
  )
}

export function SliderFixture() {
  const [value, setValue] = useState(40)
  return (
    <Slider
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      aria-label={`볼륨 ${value}`}
    />
  )
}

export function SegmentedFixture() {
  const [active, setActive] = useState('list')
  const tb: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [FOCUS]: { id: FOCUS, data: { id: active } },
      list: { id: 'list', data: { label: '목록', selected: active === 'list' } },
      grid: { id: 'grid', data: { label: '격자', selected: active === 'grid' } },
      board:{ id: 'board',data: { label: '보드', selected: active === 'board' } },
    },
    relationships: { [ROOT]: ['list', 'grid', 'board'] },
  }
  const [data, onEvent] = useControlState(tb)
  return (
    <SegmentedControl
      data={data}
      onEvent={(e) => {
        if (e.type === 'activate' || e.type === 'select') setActive(e.id)
        onEvent(e)
      }}
      aria-label="보기 모드"
    />
  )
}

export function ToggleGroupFixture() {
  const tb: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [FOCUS]: { id: FOCUS, data: { id: 'bold' } },
      bold:   { id: 'bold',   data: { label: 'B', selected: true } },
      italic: { id: 'italic', data: { label: 'I' } },
      under:  { id: 'under',  data: { label: 'U' } },
    },
    relationships: { [ROOT]: ['bold', 'italic', 'under'] },
  }
  const [data, onEvent] = useControlState(tb)
  return <ToggleGroup data={data} onEvent={onEvent} aria-label="텍스트 포맷" />
}

export function PaginationFixture() {
  const [page, setPage] = useState(3)
  return (
    <Pagination
      page={page}
      pageCount={12}
      siblingCount={1}
      onPageChange={setPage}
      aria-label="검색 결과 페이지"
    />
  )
}

export function MenubarFixture() {
  const menubar: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      [FOCUS]: { id: FOCUS, data: { id: 'file' } },
      file: { id: 'file', data: { label: '파일' } },
      edit: { id: 'edit', data: { label: '편집' } },
      view: { id: 'view', data: { label: '보기' } },
      help: { id: 'help', data: { label: '도움말' } },
      new: { id: 'new', data: { label: '새 파일' } },
      open: { id: 'open', data: { label: '열기...' } },
      recent: { id: 'recent', data: { label: '최근 항목' } },
      readme: { id: 'readme', data: { label: 'README.md' } },
      app: { id: 'app', data: { label: 'app.tsx' } },
      section: { id: 'section', data: { label: '섹션' } },
      intro: { id: 'intro', data: { label: '소개' } },
      api: { id: 'api', data: { label: 'API' } },
      undo: { id: 'undo', data: { label: '되돌리기' } },
      redo: { id: 'redo', data: { label: '다시 실행' } },
      sepEdit: { id: 'sepEdit', data: { role: 'separator' } },
      ruler: { id: 'ruler', data: { label: '눈금자 보기', role: 'checkbox', checked: true } },
      theme: { id: 'theme', data: { label: '테마' } },
      light: { id: 'light', data: { label: '밝게', role: 'radio', checked: true } },
      dark: { id: 'dark', data: { label: '어둡게', role: 'radio' } },
      zoom: { id: 'zoom', data: { label: '확대/축소' } },
      z100: { id: 'z100', data: { label: '100%' } },
      z150: { id: 'z150', data: { label: '150%' } },
      docs: { id: 'docs', data: { label: '문서' } },
      shortcuts: { id: 'shortcuts', data: { label: '단축키' } },
    },
    relationships: {
      [ROOT]: ['file', 'edit', 'view', 'help'],
      file: ['new', 'open', 'recent'],
      recent: ['readme', 'app', 'section'],
      section: ['intro', 'api'],
      edit: ['undo', 'redo', 'sepEdit', 'ruler', 'theme'],
      theme: ['light', 'dark'],
      view: ['zoom'],
      zoom: ['z100', 'z150'],
      help: ['docs', 'shortcuts'],
    },
  }
  const [data, onEvent] = useControlState(menubar)
  return <Menubar data={data} onEvent={onEvent} apg={{ case: 'editor' }} aria-label="앱 메뉴" />
}

export function SpinButtonFixture() {
  const [value, setValue] = useState(10)
  return (
    <NumberInput
      value={value}
      onChange={setValue}
      min={0}
      max={100}
      step={1}
      aria-label="수량"
    />
  )
}

export function DataGridFixture() {
  type Row = { id: string; name: string; price: number; stock: number }
  const rows: Row[] = [
    { id: 'r1', name: '사과',   price: 2500, stock: 12 },
    { id: 'r2', name: '바나나', price: 1800, stock: 30 },
    { id: 'r3', name: '체리',   price: 9000, stock:  4 },
  ]
  return (
    <DataGrid aria-label="재고">
      <RowGroup>
        <DataGridRow>
          <ColumnHeader>상품</ColumnHeader>
          <ColumnHeader>가격</ColumnHeader>
          <ColumnHeader>재고</ColumnHeader>
        </DataGridRow>
      </RowGroup>
      <RowGroup>
        {rows.map((r, i) => (
          <DataGridRow key={r.id} aria-rowindex={i + 2} tabIndex={i === 0 ? 0 : -1}>
            <GridCell>{r.name}</GridCell>
            <GridCell>{r.price.toLocaleString()}</GridCell>
            <GridCell>{r.stock}</GridCell>
          </DataGridRow>
        ))}
      </RowGroup>
    </DataGrid>
  )
}

export function TreeGridFixture() {
  type Row = { id: string; level: number; label: string; expanded?: boolean; size: string }
  const rows: Row[] = [
    { id: 'src',   level: 1, label: 'src',   expanded: true, size: '—' },
    { id: 'app',   level: 2, label: 'app',   expanded: true, size: '—' },
    { id: 'main',  level: 3, label: 'main.tsx',                size: '4.2 KB' },
    { id: 'index', level: 3, label: 'index.html',              size: '0.8 KB' },
    { id: 'lib',   level: 2, label: 'lib',                     size: '—' },
  ]
  return (
    <TreeGrid aria-label="파일 트리">
      <RowGroup>
        <DataGridRow>
          <ColumnHeader>이름</ColumnHeader>
          <ColumnHeader>크기</ColumnHeader>
        </DataGridRow>
      </RowGroup>
      <RowGroup>
        {rows.map((r, i) => (
          <TreeRow
            key={r.id}
            data-id={r.id}
            level={r.level}
            posinset={i + 1}
            setsize={rows.length}
            expanded={r.expanded}
            selected={i === 0}
          >
            <GridCell>{'  '.repeat(r.level - 1)}{r.label}</GridCell>
            <GridCell>{r.size}</GridCell>
          </TreeRow>
        ))}
      </RowGroup>
    </TreeGrid>
  )
}

export function DialogFixture() {
  const [open, setOpen] = useState(false)
  const data: NormalizedData = {
    entities: { [ROOT]: { id: ROOT, data: { open, label: '확인' } } },
    relationships: { [ROOT]: [] },
  }
  return (
    <>
      <Button onClick={() => setOpen(true)}>다이얼로그 열기</Button>
      <Dialog data={data} onEvent={(e) => e.type === 'open' && setOpen(e.open)}>
        <h4 style={{ margin: 0 }}>정말 삭제할까요?</h4>
        <p>되돌릴 수 없습니다. Esc 또는 닫기를 눌러 취소.</p>
        <div data-ds="Row">
          <Button onClick={() => setOpen(false)}>취소</Button>
          <Button onClick={() => setOpen(false)} data-variant="primary">삭제</Button>
        </div>
      </Dialog>
    </>
  )
}

export function StepperFixture() {
  return (
    <Stepper
      aria-label="가입 단계"
      steps={[
        { id: 'a', label: '계정',  description: '이메일·비밀번호', state: 'complete' },
        { id: 'b', label: '프로필', description: '이름·아바타',    state: 'current' },
        { id: 'c', label: '결제',  description: '카드 등록',      state: 'upcoming' },
      ]}
    />
  )
}
