[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / reduce

# Function: reduce()

> **reduce**(`d`, `e`): [`NormalizedData`](../interfaces/NormalizedData.md)

Defined in: [state/reduce.ts:76](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/reduce.ts#L76)

코어 reducer — UiEvent 의 기본 의미(focus/expand/open/typeahead/pan/zoom)를 NormalizedData 에 적용.
activate/select/selectMany/value 는 identity 로 패스 — host reducer 가 도메인 의미(selection/value)를 합성한다.

## Parameters

### d

[`NormalizedData`](../interfaces/NormalizedData.md)

### e

[`UiEvent`](../type-aliases/UiEvent.md)

## Returns

[`NormalizedData`](../interfaces/NormalizedData.md)

## Example

```ts
const myReduce = composeReducers(reduce, singleSelect, setValue)
```
