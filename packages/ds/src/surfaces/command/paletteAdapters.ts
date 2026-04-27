import { ROOT, type NormalizedData } from '../../headless/types'

export function toDialogData(open: boolean): NormalizedData {
  return {
    entities: { [ROOT]: { id: ROOT, data: { open, label: 'Command palette' } } },
    relationships: { [ROOT]: [] },
  }
}
