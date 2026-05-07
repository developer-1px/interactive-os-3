[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / spinbuttonPattern

# Function: spinbuttonPattern()

> **spinbuttonPattern**(`value`, `dispatch?`, `opts?`): `object`

Defined in: [patterns/spinbutton.ts:42](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/spinbutton.ts#L42)

spinbutton — APG `/spinbutton/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

단일 number 컨트롤. 키보드 (numericStep 재사용):
  ArrowUp/ArrowRight = +step
  ArrowDown/ArrowLeft = -step
  Home / End = min / max
  PageUp / PageDown = ±step * 10  (APG: "Optional. Larger step")

native `<input type="number">` 가 충분할 때는 그쪽이 우선. custom widget
(예: 시:분 picker, 통화 입력 등) 일 때 본 recipe 사용.

## Parameters

### value

`number`

### dispatch?

(`e`) => `void`

### opts?

[`SpinbuttonOptions`](../interfaces/SpinbuttonOptions.md) = `{}`

## Returns

`object`

### spinbuttonProps

> **spinbuttonProps**: [`ItemProps`](../type-aliases/ItemProps.md)

## Example

```ts
const [n, dispatch] = useLocalValue(5)
  const { spinbuttonProps } = spinbuttonPattern(n, dispatch,
    { min: 0, max: 10, step: 1, label: 'Quantity' })
```
