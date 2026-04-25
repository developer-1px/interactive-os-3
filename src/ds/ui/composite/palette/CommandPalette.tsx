import { useId } from 'react'
import { Dialog } from '../../overlay/Dialog'
import { Combobox } from '../../control/Combobox'
import { Listbox } from '../../collection/Listbox'
import { useShortcut } from '../../../core/hooks/useShortcut'
import { usePaletteController } from './usePaletteController'

export function CommandPalette() {
  const {
    inputRef, query, filtered, activeId, listData, dialogData,
    setQuery, toggle, onKeyDown, onListEvent, onDialogEvent,
  } = usePaletteController()
  const listId = useId()
  useShortcut('mod+k', toggle)

  return (
    <Dialog data={dialogData} onEvent={onDialogEvent}>
      <Combobox
        ref={inputRef}
        expanded={filtered.length > 0}
        controls={listId}
        activedescendant={activeId}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        onKeyDown={onKeyDown}
        placeholder="Jump to…"
        aria-label="Search routes"
      />
      {filtered.length > 0 && (
        <Listbox id={listId} data={listData} onEvent={onListEvent} />
      )}
    </Dialog>
  )
}
