import { useMemo } from 'react'
import { ROOT, type Event, type NormalizedData } from '../../../ds'

export function useDialog(
  open: boolean,
  label: string,
  onClose: () => void,
  opts?: { alert?: boolean; deps?: unknown[] },
) {
  const data = useMemo<NormalizedData>(
    () => ({
      entities: { [ROOT]: { id: ROOT, data: { open, label, ...(opts?.alert && { alert: true }) } } },
      relationships: {},
    }),
    [open, label, opts?.alert, ...(opts?.deps ?? [])],
  )
  const onEvent = (e: Event) => {
    if (e.type === 'open' && !e.open) onClose()
  }
  return { data, onEvent }
}
