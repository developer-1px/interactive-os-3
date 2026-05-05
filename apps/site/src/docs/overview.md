# Overview

`@p/headless` 는 WAI-ARIA 행동 인프라입니다. axis 합성 · roving tabindex · 24 APG recipe 를 hook 으로 제공하고, 시각·markup·토큰은 다루지 않습니다.

> **Status.** v0.0.2 · 1인 OSS · production 사례 없음. 본 문서는 라이브러리가 무엇을 약속하고 무엇을 약속하지 않는지 명확히 합니다.

## Why

ARIA 패턴을 정확히 구현하려면 다음을 모두 챙겨야 합니다 — `aria-selected` · `aria-activedescendant` · roving tabindex · Home/End · typeahead · multi-select range chord · APG focus model. listbox 하나에 200줄 이상이 일반적입니다.

기존 라이브러리는 이 부담을 흡수하지만 동시에 **markup · 스타일 · 컴포넌트 어휘**를 함께 제공합니다 (Radix UI · Headless UI · Ariakit · React Aria). 그 묶음이 자기 디자인 시스템과 맞으면 최선의 선택이지만, **행동만 가져오고 시각은 직접 그리고 싶은** 팀에게는 과합니다.

`@p/headless` 의 목적은 단순합니다.

> ARIA spec 을 그대로 코드로 옮긴 행동 인프라.
> spec 을 읽으면 코드 의미가 그대로 보이고, LLM 도 한 어휘로 추론할 수 있도록.

## How — 4가지 약속

### 1. 행동 인프라 층에 자리잡습니다

```
                     visual ↑
                            │
   shadcn / Material        │
   Radix UI / Base UI       │   component wrappers
   Ariakit / React Aria     │   (markup + style 포함)
                            │
   ─────────────────────────┼──────────────
                            │
   @p/headless              │   behavior infrastructure
   axes · roving · gesture  │   (행동만, markup/style 0건)
   · pattern recipe         │
                            │
   WAI-ARIA / APG           │   spec
                            │
                     vocab ↓
```

기존 라이브러리들은 spec ↔ visual 사이의 wrapper 층에 있고, 이 라이브러리는 그 한 단 아래 — spec 바로 위, 컴포넌트 아래입니다.

### 2. ARIA 값 어휘를 그대로 사용합니다

값 어휘 — `role`, `aria-*`, prop 키 — 는 [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/) + [APG](https://www.w3.org/WAI/ARIA/apg/) spec 그대로입니다.

- `role="listbox"` · `role="option"` · `aria-selected` · `aria-expanded` 그대로
- part-getter 이름은 ARIA role 그대로 — `optionProps`, `tabProps`, `rowProps`, `gridcellProps`

함수 식별자는 React 컨벤션과 APG slug 를 결합합니다. 예: `useListboxPattern` (Rules of Hooks 컨벤션 + APG `/listbox/` slug). `Pattern` suffix · `rootProps` · `useResource` 등은 라이브러리 어휘이며, 이는 React 호환성과 가독성을 위한 최소한의 추가입니다.

### 3. 시각은 소비자가 직접 표현합니다

- 행동 = `useListboxPattern(data, onEvent)` 가 반환하는 props · items
- 시각 = 그 props 를 spread 한 `<ul className="...">`. utility class 는 직접

라이브러리는 토큰 시스템 · CSS-in-JS · classless 어휘를 제공하지 않습니다. focus ring · dark mode · 모션 대응도 시각 책임이므로 소비자가 챙겨야 합니다 — Tailwind v3 의 `focus-visible:`, `dark:`, `motion-reduce:` modifier 로 표현 가능.

이 거래(trade)가 본 라이브러리의 핵심입니다.
- **얻는 것**: 시각 자유도 100%, 어떤 디자인 시스템에도 행동 인프라가 맞춰짐
- **잃는 것**: utility class 작성 부담, 시각 invariant 직접 챙겨야 함

### 4. 단일 데이터 인터페이스 + 단방향 흐름

```
data → axes → patterns → ui → reducer → data
```

- `data: NormalizedData` — `{entities, relationships, meta}` 3-store, plain JSON
- `onEvent(e: UiEvent)` — 모든 dispatch 는 11 variant `UiEvent` discriminated union 한 채널로
- 양방향 바인딩 · side-channel · class · ref · closure 잔재 없음

이 invariant 가 직렬화 · replay · HMR · LLM 추론을 가능하게 합니다.

## What — 진입점

### Pattern recipe (24개)

각 recipe = `(data, onEvent, opts?) → { rootProps, partProps(id), items }` 통일 시그니처.

```ts
import { fromList } from '@p/headless'
import { useListboxPattern } from '@p/headless/patterns'

const data = fromList([
  { id: 'a', label: 'Apple' },
  { id: 'b', label: 'Banana' },
])

const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)
return (
  <ul {...rootProps} className="rounded border bg-white">
    {items.map((it) => (
      <li key={it.id} {...optionProps(it.id)} className="px-3 py-1.5 hover:bg-stone-100">
        {it.label}
      </li>
    ))}
  </ul>
)
```

24 recipe 는 [APG `/patterns/`](https://www.w3.org/WAI/ARIA/apg/patterns/) 카테고리 + 일부 ARIA role(`alert` · `switch`) 를 미러합니다.

→ [/patterns](/patterns) — 라이브 데모.

### Axis primitive (escape hatch)

24 recipe 가 부족하면 axis primitive 로 직접 합성합니다.

```ts
import { composeAxes, navigate, activate, typeahead } from '@p/headless'

const axis = composeAxes(navigate('vertical'), activate, typeahead)
```

→ [/axes](/axes) · [/matrix](/matrix) — axis ↔ pattern 매핑.

### 데이터 빌더

`fromList` · `fromTree` · `pathAncestors` 가 `NormalizedData` 진입점.

→ [/data](/data) — live preview.

### 단일 dispatch 어휘 — UiEvent

`navigate` · `activate` · `expand` · `select` · `selectMany` · `value` · `open` · `typeahead` · `pan` · `zoom` (11 variant).

→ [/uievents](/uievents) — variant 카탈로그.

### LLM 컨텍스트

- [/llms.txt](/llms.txt) — 226 export 인덱스 (23kB)
- [/llms-full.txt](/llms-full.txt) — 시그니처 + TSDoc + `@example` 전문 (47kB)

## 비교

| 축 | React Aria | Radix UI / Base UI | Ariakit | @p/headless |
|---|---|---|---|---|
| 어휘 | 자체 (`<ListBox>`, `Item`) | compound (`<Listbox.Root>`) | 자체 + 일부 ARIA | W3C ARIA 그대로 |
| markup | RAC 가 제공 | 라이브러리가 결정 | 라이브러리가 결정 | 소비자가 결정 |
| style | 시작 스타일 제공 | 무스타일 | 시작 스타일 제공 | 0건 |
| 데이터 | Collection iterator | uncontrolled/controlled | controlled | NormalizedData (3-store) |
| 이벤트 | `onAction`, `onSelectionChange` 등 | callback per part | callback per part | 단일 `onEvent(UiEvent)` |
| 저자 | Adobe (풀타임 팀) | WorkOS (회사 backed) | Ariakit | 1인 OSS |
| Production | 다수 | 다수 | 다수 | 없음 |
| 번들 | 큰 편 | 중간 | 중간 | 작음 |

본 라이브러리의 강점은 (a) 작고 (b) 합성 가능하고 (c) 어휘가 W3C 그대로입니다. 약점은 (a) 1인 OSS, (b) production 사례 없음, (c) v0.x unstable.

행동(키보드·포커스·접근성 동작)의 de facto 는 Radix · Base · Ariakit · RAC 최소 2곳 수렴한 것을 따릅니다. **이름·구조** 는 W3C 만 — 라이브러리 어휘 차용 ❌.

## When to use

- 자체 디자인 시스템을 가진 팀이 행동 인프라만 빌리려는 경우
- LLM 친화 codebase — W3C 어휘 통일, 단일 dispatch 어휘로 LLM 추론이 쉬움
- 다른 라이브러리에서 행동만 떼어내려다 실패한 경우
- ARIA 행동을 정확히 보증해야 하는 컬렉션 UI (listbox · tree · grid · tabs · menu · combobox)

## When not to use

- **즉시 입을 수 있는 시각 컴포넌트가 필요** → shadcn/ui · Radix Themes · Material UI
- **디자인 시스템 토큰까지 라이브러리가 정의해 주길 바람** → MUI · Chakra
- **markup · 스타일 · 행동 묶음 한 줄 import 를 원함** → Radix UI · Base UI · Ariakit
- **production 안정성이 최우선** → React Aria (Adobe 팀 + 다수 production)

## 알려진 한계

- **버전**: v0.0.2 — breaking change 가능, semver 보장은 1.0 이후
- **React 19 only** — `peer: react@^19`. 18 사용자는 호환되지 않음
- **테스트 커버리지**: axes/patterns/state 단위 테스트는 있으나 axe-core 통합 · screen-reader matrix · APG spec compliance 자동 테스트는 미완
- **시각 invariant**: focus ring · dark mode · motion 대응은 소비자 책임 (라이브러리가 다루지 않음)

## 다음 단계

- [Getting Started](/docs/getting-started) — 5분 안에 첫 화면
- [Core Concept](/docs/core-concept) — 데이터 흐름 · 어휘 · 합성 모델
- [FAQ](/docs/faq) — 27가지 의문에 대한 정직한 답변

## 참조

- [/llms.txt](/llms.txt) — 전체 export 인덱스
- [/patterns](/patterns) · [/axes](/axes) · [/matrix](/matrix) · [/data](/data) · [/uievents](/uievents) — live reference
- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — 정본 어휘 출처
