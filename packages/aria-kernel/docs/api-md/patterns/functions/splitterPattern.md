[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / splitterPattern

# Function: splitterPattern()

> **splitterPattern**(`value`, `dispatch?`, `opts?`): `object`

Defined in: [patterns/splitter.ts:32](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/splitter.ts#L32)

splitter — APG `Window Splitter`.
https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

단일 number 컨트롤 — slider 와 axis 공유 (numericStep), role=separator 만 다름.

## Parameters

### value

`number`

### dispatch?

(`e`) => `void`

### opts?

[`SplitterOptions`](../interfaces/SplitterOptions.md) = `{}`

## Returns

`object`

### handleProps

> **handleProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

## Example

```ts
const [pos, dispatch] = useLocalValue(40)
  const { handleProps, ... } = splitterPattern(pos, dispatch, { min: 10, max: 90 })
```
