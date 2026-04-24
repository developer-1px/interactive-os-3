import { useState, type ReactNode } from 'react'
import {
  Menu, Listbox, Tree, Columns, Top10List, BarChart, StatCard, CourseCard, RoleCard,
  Badge, LegendDot, Button, Switch, Progress, Field,
  TabList, Tab, TabPanel, Feed, FeedArticle, Disclosure,
  Toolbar, ToolbarButton, Separator,
  Input, Textarea, Select, NumberInput, Slider, ColorInput,
  Checkbox, RadioGroup, CheckboxGroup, Combobox,
  Carousel, Slide,
  fromTree, fromList, useControlState, ROOT, FOCUS, EXPANDED, type NormalizedData,
} from '../../ds'

/**
 * Catalog demos — data 기반 ui 컴포넌트의 시각 검증용 라이브 예시.
 *
 * 각 데모는 최소 sample data 1벌로 렌더. ControlProps 분파는
 * useControlState로 focus/expand 상태까지 연결.
 */

const tree = [
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

const toData = (n: { id: string; label: string }) => ({ label: n.label })
const getId = (n: { id: string }) => n.id
const getKids = (n: { kids?: unknown[] }) => n.kids as never

function useTreeData(expandedIds: string[] = ['eng'], focusId: string | null = 'fe') {
  const base = fromTree(tree, { getId, getKids, toData, expandedIds, focusId })
  return useControlState(base)
}

// ─────────────────────────────────────────────────────────────
// ControlProps 분파
// ─────────────────────────────────────────────────────────────
function MenuDemo() {
  const menu: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: { label: '파일' } },
      new:   { id: 'new',   data: { label: '새 파일' } },
      open:  { id: 'open',  data: { label: '열기...' } },
      save:  { id: 'save',  data: { label: '저장' } },
      recent:{ id: 'recent',data: { label: '최근 항목' } },
      r1:    { id: 'r1',    data: { label: 'README.md' } },
      r2:    { id: 'r2',    data: { label: 'index.ts' } },
    },
    relationships: {
      [ROOT]: ['new', 'open', 'recent', 'save'],
      recent: ['r1', 'r2'],
    },
  }
  const [data, onEvent] = useControlState(menu)
  return <Menu data={data} onEvent={onEvent} />
}

function ListboxDemo() {
  const [data, onEvent] = useTreeData([], 'fe')
  return <Listbox data={data} onEvent={onEvent} aria-label="카테고리" />
}

function TreeDemo() {
  const [data, onEvent] = useTreeData(['eng', 'des'], 'sys')
  return <Tree data={data} onEvent={onEvent} aria-label="트리" />
}

function ColumnsDemo() {
  const [data, onEvent] = useTreeData(['eng'], 'fe')
  return <Columns data={data} onEvent={onEvent} aria-label="컬럼" />
}

// ─────────────────────────────────────────────────────────────
// customArray 분파
// ─────────────────────────────────────────────────────────────
function Top10Demo() {
  return (
    <Top10List data={fromList([
      { label: '홈', count: '12,480' },
      { label: '검색', count: '8,210' },
      { label: '영상 상세', count: '5,640' },
      { label: '설정', count: '2,110' },
    ])} />
  )
}

function BarChartDemo() {
  return (
    <BarChart
      caption="전체 수강"
      data={fromList([
        { label: 'NCA', value: '48%', pct: 48, tone: 'success' },
        { label: 'NCP', value: '30%', pct: 30, tone: 'info' },
        { label: 'NCE', value: '15%', pct: 15, tone: 'warning' },
        { label: 'ETC', value: '7%',  pct:  7, tone: 'neutral' },
      ])}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// fieldDriven 분파 (content widget)
// ─────────────────────────────────────────────────────────────
function StatCardDemo() {
  return (
    <StatCard
      label="오늘 가입"
      value="1,284"
      icon={<span data-icon="users" />}
      sub="어제 대비"
      change="+12%"
      changeDir="up"
    />
  )
}

function CourseCardDemo() {
  return (
    <CourseCard
      abbr="NCA"
      name="Naver Cloud Associate"
      desc="입문자를 위한 클라우드 기초"
      tone="success"
      meta={<Badge tone="info">입문 · 영상 24개</Badge>}
      footer="최종 수정 2일 전"
    />
  )
}

function RoleCardDemo() {
  return (
    <RoleCard
      icon="💻"
      name="프론트엔드 엔지니어"
      desc="UI 구현 + 시스템 설계"
      meta={<Badge tone="success">활성</Badge>}
      draggable={false}
    />
  )
}

function BadgeDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="info">info</Badge>
      <Badge tone="success">success</Badge>
      <Badge tone="warning">warning</Badge>
      <Badge tone="danger">danger</Badge>
      <Badge tone="neutral">neutral</Badge>
    </div>
  )
}

function LegendDotDemo() {
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <LegendDot tone="info">조회</LegendDot>
      <LegendDot tone="success">완료</LegendDot>
      <LegendDot tone="warning">대기</LegendDot>
      <LegendDot tone="danger">오류</LegendDot>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// childrenDriven 분파 (form / overlay / bar)
// ─────────────────────────────────────────────────────────────
function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button>기본</Button>
      <Button data-icon="plus">등록</Button>
      <Button disabled>비활성</Button>
    </div>
  )
}

function SwitchDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Switch checked={a} onClick={() => setA((v) => !v)} aria-label="A" />
      <Switch checked={b} onClick={() => setB((v) => !v)} aria-label="B" />
      <Switch checked={false} disabled aria-label="disabled" />
    </div>
  )
}

function ProgressDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Progress value={30} max={100} aria-label="업로드" />
      <Progress value={72} max={100} aria-label="처리" />
    </div>
  )
}

function FieldDemo() {
  return (
    <Field>
      <label>이메일<input type="email" placeholder="you@example.com" /></label>
    </Field>
  )
}

function TabsDemo() {
  return (
    <div>
      <TabList>
        <Tab selected controls="p1">개요</Tab>
        <Tab controls="p2">통계</Tab>
        <Tab controls="p3">설정</Tab>
      </TabList>
      <TabPanel id="p1" labelledBy="t1" style={{ padding: 12 }}>
        <p style={{ margin: 0 }}>개요 패널</p>
      </TabPanel>
    </div>
  )
}

function FeedDemo() {
  return (
    <Feed aria-label="활동">
      <FeedArticle posinset={1} setsize={2}>
        <h4 style={{ margin: 0 }}>업데이트</h4>
        <p style={{ margin: '4px 0 0' }}>새 영상 3개 추가</p>
      </FeedArticle>
      <FeedArticle posinset={2} setsize={2}>
        <h4 style={{ margin: 0 }}>공지</h4>
        <p style={{ margin: '4px 0 0' }}>월간 점검 안내</p>
      </FeedArticle>
    </Feed>
  )
}

function DisclosureDemo() {
  return (
    <Disclosure summary="세부 정보 보기">
      <p style={{ margin: 0 }}>펼쳐진 내부 콘텐츠.</p>
    </Disclosure>
  )
}

function ToolbarDemo() {
  return (
    <Toolbar aria-label="편집" orientation="horizontal">
      <ToolbarButton data-icon="bold" aria-label="굵게" />
      <ToolbarButton data-icon="italic" aria-label="기울임" />
      <Separator />
      <ToolbarButton data-icon="link" aria-label="링크" />
    </Toolbar>
  )
}

function ToolbarButtonDemo() {
  const [b, setB] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <ToolbarButton data-icon="bold" aria-label="굵게"
        pressed={b} onClick={() => setB((v) => !v)} />
      <ToolbarButton data-icon="italic" aria-label="기울임" />
    </div>
  )
}

function SeparatorDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 24 }}>
      <span>왼쪽</span><Separator /><span>오른쪽</span>
    </div>
  )
}

function CarouselDemo() {
  return (
    <Carousel label="슬라이드">
      <Slide label="1" posinset={1} setsize={2}>
        <div style={{ padding: 16, minWidth: 120 }}>첫 슬라이드</div>
      </Slide>
      <Slide label="2" posinset={2} setsize={2}>
        <div style={{ padding: 16, minWidth: 120 }}>두 번째</div>
      </Slide>
    </Carousel>
  )
}

// ─────────────────────────────────────────────────────────────
// form inputs (native 기반)
// ─────────────────────────────────────────────────────────────
function InputDemo() {
  return <Input defaultValue="hello" placeholder="텍스트" />
}

function TextareaDemo() {
  return <Textarea defaultValue={'멀티라인\n텍스트'} rows={3} />
}

function SelectDemo() {
  return (
    <Select defaultValue="b">
      <option value="a">옵션 A</option>
      <option value="b">옵션 B</option>
      <option value="c">옵션 C</option>
    </Select>
  )
}

function NumberInputDemo() {
  const [v, setV] = useState(5)
  return <NumberInput value={v} onChange={setV} min={0} max={100} />
}

function SliderDemo() {
  const [v, setV] = useState(40)
  return <Slider value={v} onChange={setV} min={0} max={100} aria-label="볼륨" />
}

function ColorInputDemo() {
  const [v, setV] = useState('#4f46e5')
  return <ColorInput value={v} onChange={setV} />
}

function CheckboxDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState<boolean | 'mixed'>('mixed')
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Checkbox checked={a} onClick={() => setA((v) => !v)} aria-label="A" />
      <Checkbox checked={b} onClick={() => setB((v) => v === 'mixed' ? true : v === true ? false : 'mixed')} aria-label="삼상" />
      <Checkbox checked={false} disabled aria-label="disabled" />
    </div>
  )
}

const radioBase: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    a: { id: 'a', data: { label: '옵션 A' } },
    b: { id: 'b', data: { label: '옵션 B' } },
    c: { id: 'c', data: { label: '옵션 C' } },
    [FOCUS]: { id: FOCUS, data: { id: 'b' } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'] },
}

const checkboxBase: NormalizedData = {
  entities: {
    [ROOT]: { id: ROOT, data: {} },
    a: { id: 'a', data: { label: '알림' } },
    b: { id: 'b', data: { label: '이메일' } },
    c: { id: 'c', data: { label: '푸시' } },
    [EXPANDED]: { id: EXPANDED, data: { ids: ['a'] } },
  },
  relationships: { [ROOT]: ['a', 'b', 'c'] },
}

function RadioGroupDemo() {
  const [data, onEvent] = useControlState(radioBase)
  return <RadioGroup data={data} onEvent={onEvent} aria-label="옵션" orientation="horizontal" />
}

function CheckboxGroupDemo() {
  const [data, onEvent] = useControlState(checkboxBase)
  return <CheckboxGroup data={data} onEvent={onEvent} aria-label="알림 설정" orientation="horizontal" />
}

function ComboboxDemo() {
  const [open, setOpen] = useState(false)
  return <Combobox expanded={open} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
    placeholder="검색" defaultValue="" />
}

// ─────────────────────────────────────────────────────────────
// registry
// ─────────────────────────────────────────────────────────────
export const demos: Record<string, () => ReactNode> = {
  Menu: MenuDemo,
  Listbox: ListboxDemo,
  Tree: TreeDemo,
  Columns: ColumnsDemo,
  Top10List: Top10Demo,
  BarChart: BarChartDemo,
  StatCard: StatCardDemo,
  CourseCard: CourseCardDemo,
  RoleCard: RoleCardDemo,
  Badge: BadgeDemo,
  LegendDot: LegendDotDemo,
  Button: ButtonDemo,
  Switch: SwitchDemo,
  Progress: ProgressDemo,
  Field: FieldDemo,
  Tabs: TabsDemo,
  Feed: FeedDemo,
  Disclosure: DisclosureDemo,
  Toolbar: ToolbarDemo,
  ToolbarButton: ToolbarButtonDemo,
  Separator: SeparatorDemo,
  Carousel: CarouselDemo,
  Input: InputDemo,
  Textarea: TextareaDemo,
  Select: SelectDemo,
  NumberInput: NumberInputDemo,
  Slider: SliderDemo,
  ColorInput: ColorInputDemo,
  Checkbox: CheckboxDemo,
  RadioGroup: RadioGroupDemo,
  CheckboxGroup: CheckboxGroupDemo,
  Combobox: ComboboxDemo,
}
