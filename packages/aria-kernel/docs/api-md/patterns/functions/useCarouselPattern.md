[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [patterns](../README.md) / useCarouselPattern

# Function: useCarouselPattern()

> **useCarouselPattern**(`opts`): `object`

Defined in: [patterns/carousel.ts:40](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/patterns/carousel.ts#L40)

carousel — APG `/carousel/` recipe.
https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

자동 회전 정지 규칙 (APG):
  1. carousel 내 어떤 요소든 키보드 focus → 정지 (사용자가 rotation control 활성화 전엔 재개 안 함)
  2. mouse hover 중 → 정지
  3. rotation control 토글 → 명시적 재개/정지

roleDescription="carousel"·"slide" 는 APG 권장 — 스크린리더가 "carousel"·"slide" 로 읽음.

## Parameters

### opts

[`CarouselOptions`](../interfaces/CarouselOptions.md)

## Returns

`object`

### goTo

> **goTo**: (`i`) => `void`

#### Parameters

##### i

`number`

#### Returns

`void`

### index

> **index**: `number`

### liveRegionProps

> **liveRegionProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### next

> **next**: () => `void`

#### Returns

`void`

### nextButtonProps

> **nextButtonProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### playing

> **playing**: `boolean`

### prev

> **prev**: () => `void`

#### Returns

`void`

### prevButtonProps

> **prevButtonProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### rootProps

> **rootProps**: [`RootProps`](../type-aliases/RootProps.md)

### rotationButtonProps

> **rotationButtonProps**: [`ItemProps`](../type-aliases/ItemProps.md)

### slideProps

> **slideProps**: (`slideIndex`) => [`ItemProps`](../type-aliases/ItemProps.md)

#### Parameters

##### slideIndex

`number`

#### Returns

[`ItemProps`](../type-aliases/ItemProps.md)

### toggleRotation

> **toggleRotation**: () => `void`

#### Returns

`void`
