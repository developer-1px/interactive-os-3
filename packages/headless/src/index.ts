/**
 * @p/headless — APG-correct headless behavior layer.
 *
 * Owns: axis composition · roving tabindex · gesture/intent split ·
 * declarative page tree (FlatLayout) · resource (single data interface) ·
 * feature (effects+queries) · middleware.
 *
 * Knows nothing about: tokens · CSS · component vocabulary.
 * Consumers (e.g. @p/ds) augment `Register` interface in `./layout/nodes` to
 * inject their UI component name set into `UiNode.component` typing.
 */

export * from './types'
export * from './data'

export { reduce } from './state/reduce'
export {
  composeReducers, singleSelect, multiSelectToggle, setValue,
  reduceWithDefaults,
  type Reducer,
} from './state/selection'
export { fromTree, fromList, pathAncestors } from './state/fromTree'
export { useControlState } from './state/useControlState'
export { useEventBridge } from './state/useEventBridge'

export { defineFlow, useFlow, type FlowDef } from './flow'

export {
  defineFeature, useFeature,
  type FeatureSpec, type CommandBase,
  type Effect, type QuerySpec, type QueryResult,
  invalidateQuery,
} from './feature'

export { useRovingTabIndex } from './roving/useRovingTabIndex'
export { useSpatialNavigation } from './roving/useSpatialNavigation'
export { useActiveDescendant } from './roving/useActiveDescendant'

export {
  composeAxes, parentOf, siblingsOf, enabledSiblings,
  navigate, activate, expand, typeahead, treeNavigate, treeExpand,
  multiSelect, numericStep,
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

export {
  definePage, defineWidget, defineLayout, merge,
  placementAttrs, validatePage, validateFragment, node,
  type AnyNode, type NodeType,
  type RowNode as LayoutRowNode, type ColumnNode as LayoutColumnNode,
  type GridNode as LayoutGridNode, type AsideNode, type SectionNode,
  type HeaderNode, type FooterNode, type UiNode, type TextNode,
  type LayoutFlow, type Emphasis, type GridCols, type TextVariant, type Align,
  type ItemPlacement, type CommonNodeData, type TypedEntity,
  type Register, type UiComponentName,
} from './layout'
