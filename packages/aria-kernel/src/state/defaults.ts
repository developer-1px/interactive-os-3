import { checkToggle, singleCheck } from './check'
import { composeReducers, type Reducer } from './compose'
import { reduce } from './reduce'
import { multiSelectToggle, singleSelect } from './selection'
import { setValue } from './value'

/**
 * reduceWithDefaults — drop-in 기본 reducer. select 축은 single-mode, check 축은
 * multi-mode (toggle). 두 축이 다른 이벤트 (`select` vs `check`/`checkMany`) 라
 * 충돌 없이 합성 — listbox-single, tabs, menu, checkbox group 데모가 zero config 로 동작.
 */
export const reduceWithDefaults: Reducer = composeReducers(reduce, singleSelect, checkToggle, setValue)

/**
 * reduceWithMultiSelect — drop-in multi-select 변종. listbox(multi)/tree(multi)/grid(multi).
 * `multiSelectToggle` 가 `select{ids,to?}` (replace/additive/unset) 단일 축을 처리.
 */
export const reduceWithMultiSelect: Reducer = composeReducers(reduce, multiSelectToggle, checkToggle, setValue)

/**
 * reduceWithRadio — radio 데모 전용 변종. check 축이 single-of-group (singleCheck)
 * 으로 동작. radio 는 select 축을 쓰지 않으므로 singleSelect 미포함.
 */
export const reduceWithRadio: Reducer = composeReducers(reduce, singleCheck, setValue)
