[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / composeAxes

# Function: composeAxes()

> **composeAxes**(...`axes`): [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/axis.ts:25](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/axis.ts#L25)

composeAxes — 여러 Axis 를 우선순위 순으로 합성. 첫 non-null 반환을 채택, 나머지 axis 는 단락(short-circuit).

같은 키를 두 axis 가 다루면 앞쪽이 이긴다 (예: treeExpand 가 Space 를 흡수해야 activate 가 leaf 에서만 발화).

## Parameters

### axes

...[`Axis`](../type-aliases/Axis.md)[]

## Returns

[`Axis`](../type-aliases/Axis.md)

## Example

```ts
const onKey = composeAxes(treeExpand, treeNavigate, typeahead, activate)
  const events = onKey(data, focusId, { kind: 'key', key: 'ArrowRight' })
```
