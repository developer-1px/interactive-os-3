/** Foundations 페이지 sidebar/preset toolbar 용 NormalizedData 빌더. */
import { ROOT, type NormalizedData } from '../../ds'
import type { AuditData } from 'virtual:ds-audit'

export const navBase = (
  filter: string,
  fileEntries: [string, AuditData['exports']][],
  totalExports: number,
  totalLeaks: number,
  missing: number,
): NormalizedData => {
  const items: { id: string; label: string; badge: number }[] = [
    { id: 'all', label: 'All', badge: totalExports },
    ...fileEntries.map(([file, list]) => ({
      id: file,
      label: file.replace('/src/ds/foundations/', ''),
      badge: list.length,
    })),
    { id: 'missing', label: 'Missing @demo', badge: missing },
    { id: 'parts', label: 'Parts', badge: 9 },
    { id: 'leaks', label: 'Leak Report', badge: totalLeaks },
  ]
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: filter } },
  }
  for (const it of items) {
    entities[it.id] = { id: it.id, data: { label: it.label, badge: it.badge, selected: it.id === filter } }
  }
  return { entities, relationships: { [ROOT]: items.map((i) => i.id) } }
}

export const presetToolsBase = (
  presets: { id: string; label: string }[],
  presetId: string,
): NormalizedData => {
  const entities: NormalizedData['entities'] = {
    [ROOT]: { id: ROOT, data: {} },
    __focus__: { id: '__focus__', data: { id: presetId } },
  }
  for (const p of presets) {
    entities[p.id] = { id: p.id, data: { label: p.label, selected: p.id === presetId } }
  }
  return { entities, relationships: { [ROOT]: presets.map((p) => p.id) } }
}
