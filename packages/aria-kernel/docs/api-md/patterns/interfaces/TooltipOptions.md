[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / TooltipOptions

# Interface: TooltipOptions

Defined in: [patterns/tooltip.ts:9](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L9)

Options for [useTooltipPattern](../functions/useTooltipPattern.md).

## Properties

### delayHide?

> `optional` **delayHide?**: `number`

Defined in: [patterns/tooltip.ts:13](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L13)

숨기기 delay (ms).

***

### delayShow?

> `optional` **delayShow?**: `number`

Defined in: [patterns/tooltip.ts:11](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L11)

보이기 delay (ms). APG 권장 ~400ms.

***

### idPrefix?

> `optional` **idPrefix?**: `string`

Defined in: [patterns/tooltip.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L14)

***

### triggerRef?

> `optional` **triggerRef?**: `RefObject`\<`HTMLElement` \| `null`\>

Defined in: [patterns/tooltip.ts:16](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/tooltip.ts#L16)

외부에서 trigger ref 를 제어해야 할 때 주입. 미주입 시 내부 ref 생성.
