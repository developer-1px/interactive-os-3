[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / switchPattern

# Function: switchPattern()

> **switchPattern**(`checked`, `dispatch?`, `opts?`): `object`

Defined in: [patterns/switch.ts:25](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/switch.ts#L25)

switch — WAI-ARIA `switch` role.
https://www.w3.org/TR/wai-aria-1.2/#switch

단일 boolean 컨트롤 — activate 시 `{type:'value', value:!checked}` 직렬 emit.

## Parameters

### checked

`boolean`

### dispatch?

(`e`) => `void`

### opts?

[`SwitchOptions`](../interfaces/SwitchOptions.md) = `{}`

## Returns

`object`

### switchProps

> **switchProps**: [`ItemProps`](../type-aliases/ItemProps.md)

## Example

```ts
const [on, dispatch] = useLocalValue(false)
  const { switchProps } = switchPattern(on, dispatch, { label: 'Mute' })
```
