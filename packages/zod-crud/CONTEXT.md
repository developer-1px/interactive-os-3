# `@p/zod-crud` — Context

JsonCrud op의 정본. edit / clipboard / history 어휘를 zod schema로 박제한다.

## 정본 문서

- `README.md` — 사용법
- `spec.md` — op 정의 (insertAfter / appendChild / update / delete / copy / cut / paste / undo / redo)

## 역할

- `@p/aria-kernel`의 `UiEvent` 중 edit 계열은 본 패키지의 op과 1:1 동형.
- 추상화 0, 옵션 0 — opinionated. 새 op 추가는 spec.md를 먼저 갱신.

## 어휘 출처

JSON Patch (RFC 6902) + 일반 CRUD 표준 어휘. 새 어휘 만들지 않는다.
