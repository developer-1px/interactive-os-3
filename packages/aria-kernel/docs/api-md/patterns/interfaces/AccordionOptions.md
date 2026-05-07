[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / AccordionOptions

# Interface: AccordionOptions

Defined in: [patterns/accordion.ts:7](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L7)

Options for [useAccordionPattern](../functions/useAccordionPattern.md).

## Properties

### autoFocus?

> `optional` **autoFocus?**: `boolean`

Defined in: [patterns/accordion.ts:10](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L10)

***

### idPrefix?

> `optional` **idPrefix?**: `string`

Defined in: [patterns/accordion.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L11)

***

### level?

> `optional` **level?**: `number`

Defined in: [patterns/accordion.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L13)

heading 의 aria-level. 문서 위계에 맞춰 host 가 결정. 기본 3.

***

### mode?

> `optional` **mode?**: `"multiple"` \| `"single"`

Defined in: [patterns/accordion.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/accordion.ts#L9)

'multiple' (default): 여러 패널 동시 열림. 'single': APG single-mode — 한 항목만 열림 (형제 자동 collapse).
