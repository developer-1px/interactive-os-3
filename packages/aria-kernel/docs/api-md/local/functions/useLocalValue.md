[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [local](../README.md) / useLocalValue

# Function: useLocalValue()

> **useLocalValue**\<`T`\>(`initial`): readonly \[`T`, (`e`) => `void`\]

Defined in: [local/index.ts:51](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/local/index.ts#L51)

단일값 컨트롤 (slider/switch/spinbutton/splitter) 의 quick-start state.

## Type Parameters

### T

`T`

## Parameters

### initial

`T` \| (() => `T`)

## Returns

readonly \[`T`, (`e`) => `void`\]

## Example

```ts
const [on, dispatch] = useLocalValue(false)
  const { switchProps } = switchPattern(on, dispatch, { label: 'Mute' })
```
