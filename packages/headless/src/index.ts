/**
 * @p/headless — APG-correct headless behavior layer.
 *
 * Owns: axis composition · roving tabindex · gesture/intent split · patterns ·
 * shared data vocabulary (NormalizedData / UiEvent) · middleware.
 *
 * Optional store adapter (resource / feature) at `@p/headless/store`.
 * Demo quick-start helpers at `@p/headless/local`.
 *
 * Knows nothing about: tokens · CSS · component vocabulary.
 */

export * from './types'
export * from './schema'

export { reduce } from './state/reduce'
export { composeReducers, applyGesture, type Reducer } from './state/compose'
export { singleSelect, singleCurrent, multiSelectToggle } from './state/selection'
export { singleExpand } from './state/expansion'
export { setValue } from './state/value'
export { reduceWithDefaults, reduceWithMultiSelect } from './state/defaults'
export { fromTree, fromList, pathAncestors } from './state/fromTree'
export { fromFlatTree } from './state/fromFlatTree'
export { useControlState } from './state/useControlState'
export { useEventBridge } from './state/useEventBridge'
export { useValue } from './state/useValue'

export { useRovingTabIndex } from './roving/useRovingTabIndex'
export { useSpatialNavigation } from './roving/useSpatialNavigation'
export { useActiveDescendant } from './roving/useActiveDescendant'

export {
  composeAxes, parentOf, siblingsOf, enabledSiblings,
  navigate, activate, expand, escape, typeahead, treeNavigate, treeExpand,
  multiSelect, select, numericStep,
  type Axis,
} from './axes'
export {
  navigateOnActivate,
  selectionFollowsFocus,
  expandBranchOnActivate,
  expandOnActivate,
  composeGestures,
  activateProps,
  type GestureHelper,
} from './gesture'

export {
  defineMiddleware,
  type Middleware, type Phase,
  type PreDispatchCtx, type PostDispatchCtx, type ResourceCtx,
} from './middleware'

