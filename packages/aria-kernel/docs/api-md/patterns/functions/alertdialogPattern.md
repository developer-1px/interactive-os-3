[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / alertdialogPattern

# Function: alertdialogPattern()

> **alertdialogPattern**(`opts?`): `object`

Defined in: [patterns/alert.ts:28](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/alert.ts#L28)

alertdialog — APG `/alertdialog/`.
https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/

dialog 변종 — 즉시 주의 필요. role=alertdialog. focus trap 등 동작은 useDialogPattern 사용.
본 함수는 declarative props 만 — 행동까지 필요하면 `useDialogPattern({ alert: true })`.

## Parameters

### opts?

[`AlertdialogOptions`](../interfaces/AlertdialogOptions.md) = `{}`

## Returns

`object`

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)
