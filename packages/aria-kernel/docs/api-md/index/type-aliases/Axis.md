[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / Axis

# Type Alias: Axis

> **Axis** = (`d`, `id`, `t`) => [`UiEvent`](UiEvent.md)[] \| `null`

Defined in: [axes/axis.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/axis.ts#L14)

Axis — data 기반 APG 키/포인터 처리 primitive.

입력: data + focus id + Trigger (key 또는 click)
출력: 적용할 UiEvent[] 또는 null(무반응).

activate 는 Enter/Space 와 click 모두 반응. 나머지(navigate/expand/typeahead
/treeNavigate/treeExpand)는 key 만 반응하고 click 은 바로 null 반환 — 컴포넌트
쪽에서 click 의 focus 이동은 별도 처리한다.

## Parameters

### d

[`NormalizedData`](../interfaces/NormalizedData.md)

### id

`string`

### t

`Trigger`

## Returns

[`UiEvent`](UiEvent.md)[] \| `null`
