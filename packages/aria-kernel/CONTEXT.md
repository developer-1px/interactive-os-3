# `@p/aria-kernel` — Context

이 repo의 단 하나의 제품. ARIA 행동 인프라 (axes · roving · gesture · patterns).

## 정본 문서

- `INVARIANTS.md` — 헤드리스 invariant (행동 규약, 데이터 형태, 직렬화)
- `PATTERNS.md` — pattern recipe 시그니처 (use*Pattern · *Pattern 두 종류)
- 루트 `CLAUDE.md` — 추구미·코딩 규칙·import 경로 표

## 어휘 출처

W3C/WHATWG spec에 닫혀있다.
1. WAI-ARIA + APG (role taxonomy)
2. WHATWG HTML Living Standard (semantic element)
3. WCAG

신규 어휘는 spec에서 가져오는 게 아니면 만들지 않는다 — 항상 grep first.

## 핵심 어휘 한눈에

- **Axis** — `(NormalizedData, focusId, Trigger) → UiEvent[] | null` data-driven primitive.
- **KeyMap** — `[KeyChord | KeyChord[], handler][]` 선언 tuple. chord는 항상 `KEYS.X` 또는 `INTENTS.X` 통과.
- **Trigger** — `{ kind: 'key'|'click', ...modifiers }` plain object.
- **UiEvent** — ui ↔ headless 통신 단일 어휘. zod schema gate.
- **NormalizedData** — flat by id + meta. tree/list 무관 통일 표현.
- **Pattern** — `use*Pattern` (내부 React state) vs `*Pattern` (순수 함수). 데이터성 state는 외부 주입, UI 일시 state는 내부.

자세한 의미·invariant는 위 정본 문서.
