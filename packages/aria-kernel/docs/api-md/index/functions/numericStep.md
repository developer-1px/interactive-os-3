[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / numericStep

# Function: numericStep()

> **numericStep**(`orientation?`): [`Axis`](../type-aliases/Axis.md)

Defined in: [axes/numericStep.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/numericStep.ts#L14)

numericStep — Slider/Splitter/Spinbutton Arrow/Page/Home/End → value step.

키 매핑은 `INTENTS.numericStep` (orientation 별 inc/dec, min/max, pageInc/Dec) 에서 import (SSOT).

APG: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
     https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
     https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

## Parameters

### orientation?

`"vertical"` \| `"horizontal"`

## Returns

[`Axis`](../type-aliases/Axis.md)
