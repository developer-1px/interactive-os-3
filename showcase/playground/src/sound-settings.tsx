/**
 * macOS 시스템 환경설정 — 사운드 패널 클론.
 *
 * Gap 분석:
 * - 윈도우 traffic-lights / 앱 뒤·앞 네비는 ds에 없음 → Header + Button(icon)으로 대체.
 * - segmented control(출력/입력) 전용 부품 없음 → Tabs로 충분.
 * - 그 외(Slider/Switch/Select/Checkbox/Tree/Listbox)는 모두 ds 카탈로그로 커버.
 */
import { useMemo, useState, type ChangeEvent, type ReactNode } from 'react'
import {
  ROOT,
  Renderer,
  definePage,
  navigateOnActivate,
  useControlState,
  type UiEvent as DsEvent,
  type NormalizedData,
} from '@p/ds'

type SidebarId =
  | 'sound-root' | 'airplay' | 'alerts' | 'volume' | 'output-device' | 'balance'
  | 'a11y-root' | 'a11y-personal-voice'

const ALERT_OPTS: [string, string][] = [
  ['boop', 'Boop'], ['breeze', 'Breeze'], ['bubble', 'Bubble'],
  ['crystal', 'Crystal'], ['funk', 'Funk'], ['glass', 'Glass'],
  ['hero', 'Hero'], ['ping', 'Ping'], ['pop', 'Pop'],
]

const PLAY_ON: [string, string][] = [
  ['selected', '선택된 사운드 출력 기기'],
  ['internal', 'MacBook Pro 스피커'],
  ['system', '시스템 기본 출력'],
]

const OUTPUT_DEVICES = [
  { id: 'internal', name: 'MacBook Pro 스피커', kind: '내장' },
  { id: 'usb-km',   name: 'KM_B2 Digital Audio', kind: 'USB' },
] as const

const INPUT_DEVICES = [
  { id: 'mac-mic', name: 'MacBook Pro 마이크', kind: '내장' },
] as const

const SIDEBAR_LABELS: Record<SidebarId, string> = {
  'sound-root': '사운드',
  airplay: 'AirPlay 오디오 스트리밍',
  alerts: '경고음 및 사운드 효과',
  volume: '사운드 음량',
  'output-device': '사운드 출력',
  balance: '출력 균형',
  'a11y-root': '손쉬운 사용',
  'a11y-personal-voice': '응용 프로그램이 개인 음성을 사용하는 것을 허용',
}

// data-icon 토큰은 src/tokens/semantic/iconography/icon.ts 에 등록된 lucide-static 이름만 사용 가능하다.
// volume-high / accessibility 는 등록돼있지 않아 settings / users 로 대체했다.
const SIDEBAR_ICONS: Partial<Record<SidebarId, string>> = {
  'sound-root': 'settings',
  'a11y-root': 'users',
}

const SIDEBAR_TREE: { root: SidebarId; children: SidebarId[] }[] = [
  { root: 'sound-root', children: ['airplay', 'alerts', 'volume', 'output-device', 'balance'] },
  { root: 'a11y-root',  children: ['a11y-personal-voice'] },
]

function buildSidebarTree(active: SidebarId): NormalizedData {
  const items: NormalizedData['entities'] = { [ROOT]: { id: ROOT, data: {} } }
  const rels: NormalizedData['relationships'] = { [ROOT]: SIDEBAR_TREE.map((b) => b.root) }
  for (const b of SIDEBAR_TREE) {
    items[b.root] = { id: b.root, data: {
      label: SIDEBAR_LABELS[b.root], icon: SIDEBAR_ICONS[b.root],
      current: b.root === active, selected: b.root === active,
    } }
    rels[b.root] = b.children
    for (const id of b.children) {
      items[id] = { id, data: {
        label: SIDEBAR_LABELS[id],
        current: id === active, selected: id === active,
      } }
    }
  }
  return { entities: items, relationships: rels }
}

function buildTabsData(active: 'output' | 'input'): NormalizedData {
  return {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      output: { id: 'output', data: { label: '출력', selected: active === 'output' } },
      input:  { id: 'input',  data: { label: '입력', selected: active === 'input' } },
    },
    relationships: { [ROOT]: ['output', 'input'] },
  }
}

function devicesFor(io: 'output' | 'input'): readonly { id: string; name: string; kind: string }[] {
  return io === 'output' ? OUTPUT_DEVICES : INPUT_DEVICES
}

function renderOptions(opts: [string, string][]): ReactNode {
  return opts.map(([v, l]) => (
    <option key={v} value={v}>{l}</option>
  ))
}

export function SoundSettings() {
  const [active, setActive] = useState<SidebarId>('output-device')
  const [io, setIo] = useState<'output' | 'input'>('output')
  const [device, setDevice] = useState<string>('usb-km')
  const [query, setQuery] = useState('스피커')
  const [alertSound, setAlertSound] = useState('boop')
  const [playOn, setPlayOn] = useState('selected')
  const [alertVol, setAlertVol] = useState(85)
  const [outVol, setOutVol] = useState(35)
  const [startupSound, setStartupSound] = useState(true)
  const [uiSound, setUiSound] = useState(true)
  const [volFeedback, setVolFeedback] = useState(false)
  const [muted, setMuted] = useState(false)

  const sidebarBase = useMemo(() => buildSidebarTree(active), [active])
  const [sidebarData, dispatchSidebar] = useControlState(sidebarBase)
  const onSidebar = (e: DsEvent): void => {
    navigateOnActivate(sidebarData, e).forEach((ev) => {
      dispatchSidebar(ev)
      if (ev.type === 'activate') setActive(ev.id as SidebarId)
    })
  }

  const tabsBase = useMemo(() => buildTabsData(io), [io])
  const [tabsData, dispatchTabs] = useControlState(tabsBase)
  const onTabs = (e: DsEvent): void => {
    navigateOnActivate(tabsData, e).forEach((ev) => {
      dispatchTabs(ev)
      if (ev.type === 'activate') setIo(ev.id as 'output' | 'input')
    })
  }

  const devices = devicesFor(io)
  const onPickDevice = (id: string) => (): void => setDevice(id)

  const onQuery = (e: ChangeEvent<HTMLInputElement>): void => setQuery(e.target.value)
  const onAlertChange = (e: ChangeEvent<HTMLSelectElement>): void => setAlertSound(e.target.value)
  const onPlayOn = (e: ChangeEvent<HTMLSelectElement>): void => setPlayOn(e.target.value)
  const onAlertVol = (e: ChangeEvent<HTMLInputElement>): void => setAlertVol(Number(e.target.value))
  const onOutVol = (e: ChangeEvent<HTMLInputElement>): void => setOutVol(Number(e.target.value))
  const toggleStartup = (): void => setStartupSound((v) => !v)
  const toggleUi = (): void => setUiSound((v) => !v)
  const toggleFeedback = (): void => setVolFeedback((v) => !v)
  const toggleMute = (): void => setMuted((v) => !v)
  const noop = (): void => {}

  const alertOptionsContent = renderOptions(ALERT_OPTS)
  const playOnOptionsContent = renderOptions(PLAY_ON)

  const page: NormalizedData = {
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      shell: { id: 'shell', data: { type: 'Row', flow: 'split', emphasis: 'sunk', roledescription: 'sound-settings', label: '사운드 설정' } },

      // ── Sidebar
      side: { id: 'side', data: { type: 'Aside', flow: 'list', width: 260, label: '설정 카테고리' } },
      sideHdr: { id: 'sideHdr', data: { type: 'Row', flow: 'cluster' } },
      sBack: { id: 'sBack', data: { type: 'Ui', component: 'Button',
        props: { 'aria-label': '뒤로', 'data-icon': 'chevron-left', onClick: noop }, content: '' } },
      sFwd:  { id: 'sFwd',  data: { type: 'Ui', component: 'Button',
        props: { 'aria-label': '앞으로', 'data-icon': 'chevronRight', onClick: noop }, content: '' } },
      sSearch: { id: 'sSearch', data: { type: 'Ui', component: 'SearchBox',
        props: { value: query, onChange: onQuery, 'aria-label': '설정 검색', placeholder: '검색' } } },
      sTree: { id: 'sTree', data: { type: 'Ui', component: 'Tree',
        props: { data: sidebarData, onEvent: onSidebar, 'aria-label': '사운드 설정 카테고리' } } },

      // ── Main
      main: { id: 'main', data: { type: 'Main', flow: 'form', grow: true, label: '사운드' } },
      title: { id: 'title', data: { type: 'Text', variant: 'h1', content: '사운드' } },

      fxSec: { id: 'fxSec', data: { type: 'Section', heading: { variant: 'h2', content: '사운드 효과' }, emphasis: 'raised', flow: 'form' } },

      r_alert: { id: 'r_alert', data: { type: 'Row', flow: 'split' } },
      l_alert: { id: 'l_alert', data: { type: 'Text', variant: 'body', content: '경고음', grow: true } },
      sel_alert: { id: 'sel_alert', data: { type: 'Ui', component: 'Select',
        props: { value: alertSound, onChange: onAlertChange, 'aria-label': '경고음 종류' },
        content: alertOptionsContent } },
      btn_play: { id: 'btn_play', data: { type: 'Ui', component: 'Button',
        props: { onClick: noop, 'aria-label': '경고음 미리듣기', 'data-icon': 'arrow-right' }, content: '' } },

      r_playOn: { id: 'r_playOn', data: { type: 'Row', flow: 'split' } },
      l_playOn: { id: 'l_playOn', data: { type: 'Text', variant: 'body', content: '사운드 효과를 다음으로 재생', grow: true } },
      sel_playOn: { id: 'sel_playOn', data: { type: 'Ui', component: 'Select',
        props: { value: playOn, onChange: onPlayOn, 'aria-label': '사운드 효과 출력 기기' },
        content: playOnOptionsContent } },

      r_alertVol: { id: 'r_alertVol', data: { type: 'Row', flow: 'split' } },
      l_alertVol: { id: 'l_alertVol', data: { type: 'Text', variant: 'body', content: '알림 음량', grow: true } },
      sl_alert: { id: 'sl_alert', data: { type: 'Ui', component: 'Slider',
        props: { value: alertVol, min: 0, max: 100, onChange: onAlertVol, 'aria-label': '알림 음량', width: 320 } } },

      r_startup: { id: 'r_startup', data: { type: 'Row', flow: 'split' } },
      l_startup: { id: 'l_startup', data: { type: 'Text', variant: 'body', content: '시작 시 사운드 재생', grow: true } },
      sw_startup: { id: 'sw_startup', data: { type: 'Ui', component: 'Switch',
        props: { checked: startupSound, onChange: toggleStartup, 'aria-label': '시작 시 사운드 재생' } } },

      r_uiSound: { id: 'r_uiSound', data: { type: 'Row', flow: 'split' } },
      l_uiSound: { id: 'l_uiSound', data: { type: 'Text', variant: 'body', content: '사용자 인터페이스 사운드 효과 재생', grow: true } },
      sw_uiSound: { id: 'sw_uiSound', data: { type: 'Ui', component: 'Switch',
        props: { checked: uiSound, onChange: toggleUi, 'aria-label': '사용자 인터페이스 사운드 효과 재생' } } },

      r_feedback: { id: 'r_feedback', data: { type: 'Row', flow: 'split' } },
      l_feedback: { id: 'l_feedback', data: { type: 'Text', variant: 'body', content: '음량이 변경되면 피드백 재생', grow: true } },
      sw_feedback: { id: 'sw_feedback', data: { type: 'Ui', component: 'Switch',
        props: { checked: volFeedback, onChange: toggleFeedback, 'aria-label': '음량이 변경되면 피드백 재생' } } },

      ioSec: { id: 'ioSec', data: { type: 'Section', heading: { variant: 'h2', content: '출력 및 입력' }, emphasis: 'raised', flow: 'form' } },
      tabs: { id: 'tabs', data: { type: 'Ui', component: 'TabList',
        props: { data: tabsData, onEvent: onTabs, 'aria-label': '출력 또는 입력 선택' } } },

      devGrid: { id: 'devGrid', data: { type: 'Ui', component: 'DataGrid',
        props: { 'aria-label': io === 'output' ? '출력 기기' : '입력 기기' } } },
      devHead: { id: 'devHead', data: { type: 'Ui', component: 'RowGroup' } },
      devHeadRow: { id: 'devHeadRow', data: { type: 'Ui', component: 'DataGridRow' } },
      devHeadName: { id: 'devHeadName', data: { type: 'Ui', component: 'ColumnHeader', content: '이름' } },
      devHeadKind: { id: 'devHeadKind', data: { type: 'Ui', component: 'ColumnHeader', content: '종류' } },
      devBody: { id: 'devBody', data: { type: 'Ui', component: 'RowGroup' } },
      ...Object.fromEntries(devices.flatMap((d) => [
        [`row-${d.id}`,  { id: `row-${d.id}`,  data: { type: 'Ui', component: 'DataGridRow',
          props: { 'aria-selected': d.id === device, onClick: onPickDevice(d.id) } } }],
        [`cell-${d.id}-name`, { id: `cell-${d.id}-name`, data: { type: 'Ui', component: 'GridCell', content: d.name } }],
        [`cell-${d.id}-kind`, { id: `cell-${d.id}-kind`, data: { type: 'Ui', component: 'GridCell', content: d.kind } }],
      ])),

      r_outVol: { id: 'r_outVol', data: { type: 'Row', flow: 'split' } },
      l_outVol: { id: 'l_outVol', data: { type: 'Text', variant: 'body', content: '출력 음량', grow: true } },
      sl_out: { id: 'sl_out', data: { type: 'Ui', component: 'Slider',
        props: { value: outVol, min: 0, max: 100, onChange: onOutVol, 'aria-label': '출력 음량', width: 320 } } },

      r_mute: { id: 'r_mute', data: { type: 'Row', flow: 'cluster' } },
      cb_mute: { id: 'cb_mute', data: { type: 'Ui', component: 'Checkbox',
        props: { checked: muted, onChange: toggleMute, 'aria-label': '소리 끔' } } },
      l_mute: { id: 'l_mute', data: { type: 'Text', variant: 'body', content: '소리 끔' } },

      footer: { id: 'footer', data: { type: 'Footer', flow: 'cluster' } },
      help: { id: 'help', data: { type: 'Ui', component: 'Button',
        props: { onClick: noop, 'aria-label': '도움말', 'data-icon': 'info' }, content: '' } },
    },
    relationships: {
      [ROOT]: ['shell'],
      shell: ['side', 'main'],
      side: ['sideHdr', 'sSearch', 'sTree'],
      sideHdr: ['sBack', 'sFwd'],
      main: ['title', 'fxSec', 'ioSec', 'footer'],
      fxSec: ['r_alert', 'r_playOn', 'r_alertVol', 'r_startup', 'r_uiSound', 'r_feedback'],
      r_alert: ['l_alert', 'sel_alert', 'btn_play'],
      r_playOn: ['l_playOn', 'sel_playOn'],
      r_alertVol: ['l_alertVol', 'sl_alert'],
      r_startup: ['l_startup', 'sw_startup'],
      r_uiSound: ['l_uiSound', 'sw_uiSound'],
      r_feedback: ['l_feedback', 'sw_feedback'],
      ioSec: ['tabs', 'devGrid', 'r_outVol', 'r_mute'],
      devGrid: ['devHead', 'devBody'],
      devHead: ['devHeadRow'],
      devHeadRow: ['devHeadName', 'devHeadKind'],
      devBody: devices.map((d) => `row-${d.id}`),
      ...Object.fromEntries(devices.map((d) => [`row-${d.id}`, [`cell-${d.id}-name`, `cell-${d.id}-kind`]])),
      r_outVol: ['l_outVol', 'sl_out'],
      r_mute: ['cb_mute', 'l_mute'],
      footer: ['help'],
    },
  }

  return <Renderer page={definePage(page)} />
}


