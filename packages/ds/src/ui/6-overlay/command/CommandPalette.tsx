import { useId } from 'react'
import { Dialog } from '../Dialog'
import { Combobox } from '../../3-input/Combobox'
import { Listbox } from '../../4-selection/Listbox'
import { Columns } from '../../4-selection/Columns'
import { useShortcut } from '../../../core/hooks/useShortcut'
import { usePaletteController } from './usePaletteController'

export function CommandPalette() {
  const {
    inputRef, columnsHostRef,
    query, filtered, mode, activeId, listData, columnsData, dialogData,
    setQuery, toggle, onKeyDown, onListEvent, onColumnsEvent, onDialogEvent,
  } = usePaletteController()
  const listId = useId()
  useShortcut('mod+k', toggle)

  return (
    <Dialog data={dialogData} onEvent={onDialogEvent}>
      <Combobox
        ref={inputRef}
        expanded={mode === 'columns' || filtered.length > 0}
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
        <div ref={columnsHostRef}>
          <Columns id={listId} data={columnsData} onEvent={onColumnsEvent} aria-label="라우트" />
        </div>
      )}
    </Dialog>
  )
}
