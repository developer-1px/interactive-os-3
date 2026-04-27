import { useId } from 'react'
import { useRouter } from '@tanstack/react-router'
import { Dialog } from '../Dialog'
import { Combobox } from '../../3-input/Combobox'
import { Listbox } from '../../4-selection/Listbox'
import { RouteGrid } from './RouteGrid'
import { useShortcut } from '../../../headless/hooks/useShortcut'
import { usePaletteController } from './usePaletteController'

export function CommandPalette() {
  const {
    inputRef,
    query, filtered, mode, activeId, listData, dialogData, entries,
    setQuery, toggle, onKeyDown, onListEvent, onDialogEvent, dispatchClose,
  } = usePaletteController()
  const router = useRouter()
  const listId = useId()
  useShortcut('mod+k', toggle)

  return (
    <Dialog data={dialogData} onEvent={onDialogEvent}>
      <Combobox
        ref={inputRef}
        expanded={mode === 'browse' || filtered.length > 0}
        controls={listId}
        activedescendant={mode === 'query' ? activeId : undefined}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        placeholder="Jump to…"
        aria-label="Search routes"
      />
      {mode === 'query' ? (
        filtered.length > 0 && (
          <Listbox id={listId} data={listData} onEvent={onListEvent} />
        )
      ) : (
        <RouteGrid
          entries={entries}
          onSelect={(e) => {
            dispatchClose()
            router.navigate({ to: e.to, params: e.params })
          }}
          aria-label="라우트"
        />
      )}
    </Dialog>
  )
}
