[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / useControlState

# Function: useControlState()

> **useControlState**(`base`): \[[`NormalizedData`](../interfaces/NormalizedData.md), (`e`) => `void`\]

Defined in: [state/useControlState.ts:37](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/state/useControlState.ts#L37)

`useControlState` — 외부 base 데이터 위에 로컬 control meta(focus/expanded/typeahead)를 얹는 SSOT hook.
base 가 갱신되면 사용자가 아직 건드리지 않은 키만 base 시드로 갱신, 사용자가 dispatch 한 키는 local 우선.
반환은 `[merged data, dispatch]` — ui/ 의 (data, onEvent) 인터페이스에 그대로 꽂힌다.

## Parameters

### base

[`NormalizedData`](../interfaces/NormalizedData.md)

## Returns

\[[`NormalizedData`](../interfaces/NormalizedData.md), (`e`) => `void`\]

## Example

```ts
const [data, dispatch] = useControlState(fromTree(roots, { focusId: ROOT }))
<ListView data={data} onEvent={dispatch} />
```
