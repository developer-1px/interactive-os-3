[**@p/aria-kernel v0.0.2**](../../README.md)

***

[@p/aria-kernel](../../modules.md) / [axes](../README.md) / KEYS

# Variable: KEYS

> `const` **KEYS**: `object`

Defined in: [axes/keys.ts:14](https://github.com/developer-1px/interactive-os-3/blob/df2fd60ab01d60b9b40970c0425e92e7e2956ce8/packages/aria-kernel/src/axes/keys.ts#L14)

keys.ts — `@p/aria-kernel/axes` SSOT.

모든 axis 가 사용하는 키 ↔ intent 매핑을 단일 모듈에서 박제. 직렬화 가능한 plain
데이터 — 다음 용도로 사용:
  - axis 구현체가 import 해서 동작 결정
  - 소비자가 import 해서 키맵 cheatsheet/단축키 표 자동 렌더
  - lint/test 가 도큐먼트와 구현 정합 검증

키 문자열은 KeyboardEvent.key 표기 (W3C UIEvents key values).
  https://www.w3.org/TR/uievents-key/

## Type Declaration

### ArrowDown

> `readonly` **ArrowDown**: `"ArrowDown"` = `'ArrowDown'`

### ArrowLeft

> `readonly` **ArrowLeft**: `"ArrowLeft"` = `'ArrowLeft'`

### ArrowRight

> `readonly` **ArrowRight**: `"ArrowRight"` = `'ArrowRight'`

### ArrowUp

> `readonly` **ArrowUp**: `"ArrowUp"` = `'ArrowUp'`

### End

> `readonly` **End**: `"End"` = `'End'`

### Enter

> `readonly` **Enter**: `"Enter"` = `'Enter'`

### Escape

> `readonly` **Escape**: `"Escape"` = `'Escape'`

### Home

> `readonly` **Home**: `"Home"` = `'Home'`

### PageDown

> `readonly` **PageDown**: `"PageDown"` = `'PageDown'`

### PageUp

> `readonly` **PageUp**: `"PageUp"` = `'PageUp'`

### Space

> `readonly` **Space**: `" "` = `' '`

### Tab

> `readonly` **Tab**: `"Tab"` = `'Tab'`
