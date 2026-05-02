import { composeReducers, type Reducer } from './compose'
import { reduce } from './reduce'
import { singleSelect } from './selection'
import { setValue } from './value'

/**
 * reduceWithDefaults — drop-in complete reducer.
 *
 * Composes `reduce` (focus / expand / typeahead / pan / zoom) +
 * `singleSelect` + `setValue`. Use for APG-default semantics out of the box.
 *
 * For multi-select or custom selection, compose your own:
 *   composeReducers(reduce, multiSelectToggle, setValue, ...)
 */
export const reduceWithDefaults: Reducer = composeReducers(reduce, singleSelect, setValue)
