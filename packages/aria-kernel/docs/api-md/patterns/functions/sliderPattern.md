[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / sliderPattern

# Function: sliderPattern()

> **sliderPattern**(`value`, `dispatch?`, `opts?`): `object`

Defined in: [patterns/slider.ts:31](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/slider.ts#L31)

slider — APG `/slider/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/slider/

단일 number 컨트롤 — 키보드: Arrow ±step, Home/End min/max, PageUp/PageDown ±step*10.

## Parameters

### value

`number`

### dispatch?

(`e`) => `void`

### opts?

[`SliderOptions`](../interfaces/SliderOptions.md) = `{}`

## Returns

`object`

### rangeProps

> **rangeProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### thumbProps

> **thumbProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### trackProps

> **trackProps**: [`ItemProps`](../type-aliases/ItemProps.md)

## Example

```ts
const [value, dispatch] = useLocalValue(40)
  const { thumbProps, ... } = sliderPattern(value, dispatch,
    { min: 0, max: 100, step: 5, label: 'Volume' })
```
