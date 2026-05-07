[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useTooltipPattern

# Function: useTooltipPattern()

> **useTooltipPattern**(`opts?`): `object`

Defined in: [patterns/tooltip.ts:28](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L28)

tooltip — APG `/tooltip/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

hover/focus 로 열림, blur/Escape 로 닫힘. `aria-describedby` 로 trigger ↔ tip 연결.

## Parameters

### opts?

[`TooltipOptions`](../interfaces/TooltipOptions.md) = `{}`

## Returns

`object`

### open

> **open**: `boolean`

### tipProps

> **tipProps**: [`RootProps`](../type-aliases/RootProps.md)

### triggerProps

> **triggerProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### triggerRef

> **triggerRef**: `RefObject`\<`HTMLElement` \| `null`\>

## Example

```ts
const { triggerProps, tipProps, open } = useTooltipPattern({ idPrefix: 'save' })
```
