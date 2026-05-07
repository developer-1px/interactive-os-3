[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / applyGesture

# Function: applyGesture()

> **applyGesture**(`gesture`, `reducer`): [`Reducer`](../type-aliases/Reducer.md)

Defined in: [state/compose.ts:30](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/compose.ts#L30)

applyGesture — gesture + reducer 합성. gesture가 활성 이벤트를 의도 이벤트
스트림으로 변환한 뒤, reducer가 각 이벤트를 적용해 최종 state로 reduce.

예시:
  // accordion: activate → expand 토글
  const accReducer = applyGesture(expandOnActivate, composeReducers(reduce, setValue))

  // tree: branch click → expand, leaf click → select
  const treeReducer = applyGesture(expandBranchOnActivate, reduceWithDefaults)

## Parameters

### gesture

[`GestureHelper`](../../gesture/type-aliases/GestureHelper.md)

### reducer

[`Reducer`](../type-aliases/Reducer.md)

## Returns

[`Reducer`](../type-aliases/Reducer.md)
