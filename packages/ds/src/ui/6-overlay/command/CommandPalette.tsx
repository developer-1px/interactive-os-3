import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Dialog } from '../Dialog'
import { Renderer } from '../../Renderer'
import { definePage } from '../../../headless/layout/definePage'
import { ROOT } from '../../../headless/types'
import { useShortcut } from '../../../headless/hooks/useShortcut'
import { usePaletteController } from './usePaletteController'

const INPUT_DOM_ID = 'palette-input'

/**
 * CommandPalette — Dialog + (Combobox · RouteGrid) FlatLayout.
 * mode 분기 없음 — query 는 RouteGrid 가 내부 필터.
 */
export function CommandPalette() {
  const ctrl = usePaletteController()
  const router = useRouter()
  useShortcut('mod+k', ctrl.toggle)

  useEffect(() => {
    if (!ctrl.open) return
    queueMicrotask(() => document.getElementById(INPUT_DOM_ID)?.focus())
  }, [ctrl.open])

  const page = definePage({
    entities: {
      [ROOT]: { id: ROOT, data: {} },
      page: { id: 'page', data: { type: 'Column', flow: 'prose' } },
      input: {
        id: 'input',
        data: {
          type: 'Ui',
          component: 'Combobox',
          props: {
            id: INPUT_DOM_ID,
            value: ctrl.query,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => ctrl.setQuery(e.currentTarget.value),
            onKeyDown: ctrl.onKeyDown,
            placeholder: 'Jump to…',
            'aria-label': 'Search routes',
          },
        },
      },
      grid: {
        id: 'grid',
        data: {
          type: 'Ui',
          component: 'RouteGrid',
          props: {
            entries: ctrl.entries,
            query: ctrl.query,
            onSelect: (e: { to: string; params?: Record<string, string> }) => {
              ctrl.close()
              router.navigate({ to: e.to, params: e.params })
            },
            'aria-label': '라우트',
          },
        },
      },
    },
    relationships: { [ROOT]: ['page'], page: ['input', 'grid'] },
  })

  return (
    <Dialog data={ctrl.dialogData} onEvent={ctrl.onDialogEvent}>
      <Renderer page={page} />
    </Dialog>
  )
}
