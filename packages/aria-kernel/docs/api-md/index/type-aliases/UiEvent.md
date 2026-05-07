[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [index](../README.md) / UiEvent

# Type Alias: UiEvent

> **UiEvent** = \{ `id`: `string`; `type`: `"navigate"`; \} \| \{ `id`: `string`; `type`: `"activate"`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"expand"`; \} \| \{ `id`: `string`; `type`: `"select"`; \} \| \{ `ids`: `string`[]; `to?`: `boolean`; `type`: `"selectMany"`; \} \| \{ `id`: `string`; `type`: `"value"`; `value`: `unknown`; \} \| \{ `id`: `string`; `open`: `boolean`; `type`: `"open"`; \} \| \{ `buf`: `string`; `deadline`: `number`; `type`: `"typeahead"`; \} \| \{ `dx`: `number`; `dy`: `number`; `id`: `string`; `type`: `"pan"`; \} \| \{ `cx`: `number`; `cy`: `number`; `id`: `string`; `k`: `number`; `type`: `"zoom"`; \}

Defined in: [types.ts:32](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/types.ts#L32)

UiEvent — ui ↔ headless 통신의 단일 어휘. DOM `Event` global과 충돌 방지를 위해
`Ui` prefix 명시.

## Union Members

### Type Literal

\{ `id`: `string`; `type`: `"navigate"`; \}

***

### Type Literal

\{ `id`: `string`; `type`: `"activate"`; \}

***

### Type Literal

\{ `id`: `string`; `open`: `boolean`; `type`: `"expand"`; \}

***

### Type Literal

\{ `id`: `string`; `type`: `"select"`; \}

***

### Type Literal

\{ `ids`: `string`[]; `to?`: `boolean`; `type`: `"selectMany"`; \}

Batch select for multi-mode all/range/none — O(N) instead of N×O(N²) per-event spread. `to` undefined ⇒ toggle.

***

### Type Literal

\{ `id`: `string`; `type`: `"value"`; `value`: `unknown`; \}

***

### Type Literal

\{ `id`: `string`; `open`: `boolean`; `type`: `"open"`; \}

***

### Type Literal

\{ `buf`: `string`; `deadline`: `number`; `type`: `"typeahead"`; \}

***

### Type Literal

\{ `dx`: `number`; `dy`: `number`; `id`: `string`; `type`: `"pan"`; \}

pan: target entity의 (x, y)를 (dx, dy)만큼 이동 — gesture 어댑터가 wheel/pointer를 번역

***

### Type Literal

\{ `cx`: `number`; `cy`: `number`; `id`: `string`; `k`: `number`; `type`: `"zoom"`; \}

zoom: cursor (cx, cy)를 고정점으로 scale을 k 배 — Figma/Miro 식 cursor-anchored zoom
