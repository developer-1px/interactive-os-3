[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / pageNavigate

# Function: pageNavigate()

> **pageNavigate**(`_orientation?`, `step?`): [`Axis`](../../index/type-aliases/Axis.md)

Defined in: [axes/pageNavigate.ts:12](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/pageNavigate.ts#L12)

pageNavigate — PageUp/PageDown 키로 sibling 단위 N 칸 이동.

키는 `INTENTS.pageNavigate` (prev/next) 에서 import — SSOT.
step=1 이면 feed 식 "다음 article", step>1 이면 grid/list 식 page 점프.

## Parameters

### \_orientation?

`"vertical"` \| `"horizontal"`

### step?

`number` = `1`

## Returns

[`Axis`](../../index/type-aliases/Axis.md)
