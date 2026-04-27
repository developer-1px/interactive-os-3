import { ROOT, type NormalizedData } from '../../../headless/types'
import type { PaletteEntry } from './usePaletteEntries'

/** filtered entries → Listbox 용 NormalizedData. active index의 항목만 selected. */
export function toListData(filtered: PaletteEntry[], active: number): NormalizedData {
  const entities: NormalizedData['entities'] = { [ROOT]: { id: ROOT } }
  filtered.forEach((e, i) => {
    entities[e.id] = { id: e.id, data: { label: e.label, selected: i === active } }
  })
  return { entities, relationships: { [ROOT]: filtered.map((e) => e.id) } }
}

/** open 상태 → Dialog 용 NormalizedData. */
export function toDialogData(open: boolean): NormalizedData {
  return {
    entities: { [ROOT]: { id: ROOT, data: { open, label: 'Command palette' } } },
    relationships: { [ROOT]: [] },
  }
}
