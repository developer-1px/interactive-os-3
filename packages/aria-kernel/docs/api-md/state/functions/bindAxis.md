[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [state](../README.md) / bindAxis

# Function: bindAxis()

> **bindAxis**(`axis`, `d`, `onEvent`): `AxisBindings`

Defined in: [state/bind.ts:22](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/bind.ts#L22)

axis(논리 네비게이션 함수) 를 React DOM 이벤트에 연결하는 어댑터.
keyboard/mouse → axis trigger → UiEvent[] → onEvent 로 흘린다. axis 가 이벤트를 소비했으면
`preventDefault` + `true` 반환 (브라우저 기본 동작 차단).

## Parameters

### axis

[`Axis`](../../index/type-aliases/Axis.md)

### d

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### onEvent

(`e`) => `void`

## Returns

`AxisBindings`

## Example

```ts
const { onKey, onClick } = bindAxis(rovingAxis, data, dispatch)
<li onKeyDown={(e) => onKey(e, item.id)} onClick={(e) => onClick(e, item.id)} />
```
