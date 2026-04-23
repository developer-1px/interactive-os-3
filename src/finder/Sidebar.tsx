import type { CSSProperties } from 'react'
import { Listbox, ListboxGroup, Option } from '../controls'
import { sidebar } from './data'

const wrap: CSSProperties = {
  width: 200, flex: 'none', overflow: 'auto',
  borderInlineEnd: '1px solid var(--ds-border)',
  background: 'color-mix(in oklch, Canvas 97%, CanvasText 3%)',
  fontSize: 13,
}

export function Sidebar({ current, onPick }: { current: string; onPick: (p: string) => void }) {
  return (
    <nav style={wrap} aria-label="사이드바">
      <Listbox aria-label="즐겨찾기">
        <ListboxGroup label="즐겨찾기">
          {sidebar.map((s) => (
            <Option key={s.id} selected={current === s.path} onClick={() => onPick(s.path)}>
              <span aria-hidden>{s.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            </Option>
          ))}
        </ListboxGroup>
      </Listbox>
    </nav>
  )
}
