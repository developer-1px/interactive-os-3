/** /keyboard 페이지 — 부품별 라이브 fixture 컴포넌트 10종. */
import { useState } from 'react'
import {
  Menu, Listbox, Tree, Columns, RadioGroup, CheckboxGroup,
  Toolbar, TabList, TabPanel,
  Combobox, Select,
  fromList, useControlState, ROOT, type NormalizedData,
} from '@p/ds'
import { sampleList, getId, toData, useListData, useTreeData } from './sample'

export function MenuFixture() {
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
  const base = fromList(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <RadioGroup data={data} onEvent={onEvent} aria-label="과일 (단일)" />
}

export function CheckboxFixture() {
  const base = fromList(sampleList, { getId, toData, focusId: 'apple' })
  const [data, onEvent] = useControlState(base)
  return <CheckboxGroup data={data} onEvent={onEvent} aria-label="과일 (복수)" />
}

export function TabsFixture() {
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

export function ToolbarFixture() {
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

export function ComboboxFixture() {
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

export function SelectFixture() {
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
