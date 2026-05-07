[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / parseUiEvent

# Function: parseUiEvent()

> **parseUiEvent**(`value`): \{ `id`: `string`; `type`: `"navigate"`; \} \| \{ `id`: `string`; `type`: `"activate"`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"expand"`; \} \| \{ `id`: `string`; `type`: `"select"`; \} \| \{ `id`: `string`; `type`: `"value"`; `value`: `unknown`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"open"`; \} \| \{ `buf`: `string`; `deadline`: `number`; `type`: `"typeahead"`; \} \| \{ `dx`: `number`; `dy`: `number`; `id`: `string`; `type`: `"pan"`; \} \| \{ `cx`: `number`; `cy`: `number`; `id`: `string`; `k`: `number`; `type`: `"zoom"`; \}

Defined in: [schema.ts:57](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/schema.ts#L57)

unknown → UiEvent 검증. 실패 시 ZodError throw.

## Parameters

### value

`unknown`

## Returns

\{ `id`: `string`; `type`: `"navigate"`; \} \| \{ `id`: `string`; `type`: `"activate"`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"expand"`; \} \| \{ `id`: `string`; `type`: `"select"`; \} \| \{ `id`: `string`; `type`: `"value"`; `value`: `unknown`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"open"`; \} \| \{ `buf`: `string`; `deadline`: `number`; `type`: `"typeahead"`; \} \| \{ `dx`: `number`; `dy`: `number`; `id`: `string`; `type`: `"pan"`; \} \| \{ `cx`: `number`; `cy`: `number`; `id`: `string`; `k`: `number`; `type`: `"zoom"`; \}
