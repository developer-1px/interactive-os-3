import { composeReducers, type Reducer } from './compose'
import { reduce } from './reduce'
import { multiSelectToggle, singleSelect } from './selection'
import { setValue } from './value'

/**
 * reduceWithDefaults — drop-in single-select reducer.
 * `reduce` (focus / expand / typeahead / pan / zoom) + `singleSelect` + `setValue`.
 */
export const reduceWithDefaults: Reducer = composeReducers(reduce, singleSelect, setValue)

/**
 * reduceWithMultiSelect — drop-in multi-select reducer.
 * Same as `reduceWithDefaults` but with `multiSelectToggle` instead of `singleSelect`.
 */
export const reduceWithMultiSelect: Reducer = composeReducers(reduce, multiSelectToggle, setValue)
