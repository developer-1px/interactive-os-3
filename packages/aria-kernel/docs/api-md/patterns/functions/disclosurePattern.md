[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / disclosurePattern

# Function: disclosurePattern()

> **disclosurePattern**(`data`, `id`, `onEvent?`, `opts?`): `object`

Defined in: [patterns/disclosure.ts:32](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/disclosure.ts#L32)

disclosure — APG `/disclosure/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

데이터 차원 — `EXPANDED` meta set 에 id 가 있으면 open. activate 시
`{type:'expand', id, open:!current}` 직렬 emit. host reducer 흡수 또는 옆구리 콜백.

## Parameters

### data

[`NormalizedData`](../../index/interfaces/NormalizedData.md)

### id

`string`

### onEvent?

(`e`) => `void`

### opts?

[`DisclosureOptions`](../interfaces/DisclosureOptions.md) = `{}`

## Returns

`object`

### panelProps

> **panelProps**: [`RootProps`](../type-aliases/RootProps.md)

### triggerProps

> **triggerProps**: [`ItemProps`](../type-aliases/ItemProps.md)

## Example

```ts
const data = fromTree([{ id: 'faq1', label: 'How to use?' }], { ... })
  // open 상태는 EXPANDED meta set 에 'faq1' 추가/제거로 표현 (reduce.ts 가 자동 처리)
  const { triggerProps, panelProps } = disclosurePattern(data, 'faq1', dispatch)
  return <>
    <button {...triggerProps}>FAQ</button>
    <div {...panelProps}>...answer...</div>
  </>
```
