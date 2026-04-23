import { Listbox, ListboxGroup, Option } from '../controls'
import { sidebar } from './data'

export function Sidebar({ current, onPick }: { current: string; onPick: (p: string) => void }) {
  return (
    <nav aria-roledescription="sidebar" aria-label="사이드바">
      <Listbox aria-label="즐겨찾기">
        <ListboxGroup label="즐겨찾기">
          {sidebar.map((s) => (
            <Option key={s.id} selected={current === s.path} onClick={() => onPick(s.path)} data-icon={s.icon}>
              {s.label}
            </Option>
          ))}
        </ListboxGroup>
      </Listbox>
    </nav>
  )
}
