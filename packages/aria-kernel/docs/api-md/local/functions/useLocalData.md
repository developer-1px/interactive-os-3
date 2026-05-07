[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [local](../README.md) / useLocalData

# Function: useLocalData()

> **useLocalData**(`initial`, `reducer?`): readonly \[[`NormalizedData`](../../index/interfaces/NormalizedData.md), (`e`) => `void`\]

Defined in: [local/index.ts:35](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/local/index.ts#L35)

컬렉션(NormalizedData) quick-start state — `[data, onEvent]` 한 줄.

## Parameters

### initial

[`NormalizedData`](../../index/interfaces/NormalizedData.md) \| (() => [`NormalizedData`](../../index/interfaces/NormalizedData.md))

초기 NormalizedData (값 또는 lazy 초기자)

### reducer?

[`Reducer`](../../index/type-aliases/Reducer.md) = `reduceWithDefaults`

reducer (기본 reduceWithDefaults). multi-select 등 변형은 명시 주입

## Returns

readonly \[[`NormalizedData`](../../index/interfaces/NormalizedData.md), (`e`) => `void`\]

## Example

```ts
const [data, onEvent] = useLocalData(() => fromList(items))
  const { rootProps } = useListboxPattern(data, onEvent, { label: 'Mute' })
```
