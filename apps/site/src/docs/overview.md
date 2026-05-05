# Overview

> Why → How → What.
> "왜 만들었는지" 부터 시작합니다. 이 라이브러리가 본인에게 맞는지 5분 안에 판단하실 수 있게 친절하게 설명합니다.

## Why — 왜 이 프로젝트가 필요했나

ARIA 패턴을 직접 구현해 보신 적이 있다면 이런 경험이 익숙하실 겁니다.

- **listbox 하나** 만드는데 `aria-selected`, `aria-activedescendant`, roving tabindex, Home/End, typeahead, multi-select range chord… 까지 챙기다 보면 어느새 200줄.
- 다음 화면에서 **tree** 가 필요해서 또 비슷한 코드를 처음부터.
- 기존 라이브러리(Radix UI, Base UI, Headless UI, Ariakit, React Aria)로 가 보면 **JSX·markup·스타일·토큰까지 전부 들고** 옵니다. 시각은 직접 디자인하고 싶은데 컴포넌트가 옷을 다 입고 와 버립니다.
- 떼어 내려고 하면 — `<Listbox.Root>` 같은 compound 컴포넌트 어휘가 ARIA spec에 없는 새 어휘를 추가합니다. spec 의 `role="listbox"` 와 라이브러리의 `<Root>` 둘 사이에서 정신적 통역이 발생합니다.

`@p/headless` 의 출발 질문은 단순합니다.

> **"ARIA 행동만 가져오고, 시각은 Tailwind 로 직접 그리고 싶다."**

이 한 줄을 그대로 만족하는 도구가 우리에게 없었습니다. 그래서 만들었습니다.

## How — 어떻게 풀고 있나

세 가지 약속을 일관되게 지킵니다.

### 1. **한 단 아래에 자리 잡습니다 (컴포넌트가 아니라 행동 인프라)**

```
                     visual ↑
                            │
   shadcn / Material        │
        Radix UI / Base     │   component wrappers
        Ariakit / RAC       │   (markup + style 포함)
                            │
   ─────────────────────────┼──────────────
                            │
   @p/headless              │   behavior infra
   axes · roving · gesture  │   (행동만, markup 0건)
   · pattern recipe         │
                            │
   WAI-ARIA / APG           │   spec
                            │
                     vocab ↓
```

기존 라이브러리들은 `visual ↔ vocab` 사이의 **wrapper** 층에 있고, `@p/headless` 는 그 한 단 아래 **behavior infra** 층에 있습니다. 정확히는 spec 위, 컴포넌트 아래 — 행동(action)만 다루는 자리입니다.

### 2. **W3C 어휘를 그대로 씁니다 (정본에 닫힙니다)**

라이브러리·디자인시스템이 만든 어휘를 도입하지 않습니다. 이름·역할·구조는 모두 [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/) + [APG](https://www.w3.org/WAI/ARIA/apg/) 명세 그대로입니다.

- `role="listbox"` · `role="option"` · `aria-selected` · `aria-expanded` 그대로
- props 이름도 ARIA role 그대로 — `optionProps`, `tabProps`, `rowProps`, `gridcellProps`
- 라이브러리 어휘(`<Item>`, `triggerProps`, `<Root>` 같은 것)는 **만들지 않습니다**

이렇게 하면 LLM·새 합류자·검색 모두 한 어휘로 통일됩니다. spec 를 읽으면 그대로 코드가 됩니다.

### 3. **시각은 소비자 책임입니다 (Tailwind 와 직교)**

행동과 시각을 절대 섞지 않습니다.

- 행동 = `useListboxPattern(data, onEvent)` 가 반환하는 props · items
- 시각 = 그 props 를 spread 한 `<ul className="...">`. utility class 는 본인이 직접

토큰 시스템·CSS-in-JS·classless 어휘를 라이브러리가 강요하지 않습니다. Tailwind v3 가 이미 시각 어휘를 제공하므로 우리는 거기에 손을 안 댑니다.

### 4. **단일 데이터 인터페이스 (한 방향, 한 어휘)**

```
data → axes → patterns → ui → reducer → data
```

- `data: NormalizedData` — `{entities, relationships, meta}` 3-store
- `onEvent(e: UiEvent)` — 모든 dispatch는 11 variant `UiEvent` discriminated union 한 채널로
- 양방향 바인딩 없음. side-channel 없음. class·ref·closure 잔재 없음 (직렬화 가능)

이 한 방향 흐름이 LLM·디버거·테스트에게 가장 친절한 invariant 입니다.

## What — 그래서 무엇을 쓰면 되나

지금 바로 쓸 수 있는 것은 다음과 같습니다.

### **24 APG patterns** — recipe hook

각 recipe = `(data, onEvent, opts?) → { rootProps, partProps(id), items }` 통일 시그니처.

```ts
import { useListboxPattern } from '@p/headless/patterns'

const { rootProps, optionProps, items } = useListboxPattern(data, onEvent)
return (
  <ul {...rootProps} className="rounded border ...">
    {items.map((it) => (
      <li key={it.id} {...optionProps(it.id)} className="...">
        {it.label}
      </li>
    ))}
  </ul>
)
```

24 패턴 전수: `useListboxPattern` · `useTabsPattern` · `useTreePattern` · `useTreeGridPattern` · `useMenuPattern` · `useMenubarPattern` · `useComboboxPattern` · `useRadioGroupPattern` · `useToolbarPattern` · `useAccordionPattern` · `useDialogPattern` · `useTooltipPattern` · `useFeedPattern` · `useGridPattern` · `useCarouselPattern` · `disclosurePattern` · `sliderPattern` · `splitterPattern` · `switchPattern` · `spinbuttonPattern` · `navigationListPattern` · `alertPattern` · `alertdialogPattern`

→ [/patterns](/patterns) 에서 각 패턴 라이브 데모 + 코드.

### **Axis primitive** — 직접 합성

패턴이 부족하면 axis primitive 로 직접 조립합니다 (escape hatch).

```ts
import { composeAxes, navigate, activate, typeahead, useRovingTabIndex } from '@p/headless'

const axis = composeAxes(navigate('vertical'), activate, typeahead)
```

→ [/axes](/axes) · [/matrix](/matrix) 에서 axis ↔ pattern 매핑.

### **데이터 빌더**

`fromList` · `fromTree` · `pathAncestors` 가 `NormalizedData` 진입점.

→ [/data](/data) 에서 live preview.

### **단일 dispatch 어휘 — UiEvent**

`navigate`·`activate`·`expand`·`select`·`selectMany`·`value`·`open`·`typeahead`·`pan`·`zoom` (11 variant).

→ [/uievents](/uievents) 카탈로그.

### **LLM 컨텍스트**

- [/llms.txt](/llms.txt) — 226 export 인덱스 (23kB)
- [/llms-full.txt](/llms-full.txt) — 시그니처 + TSDoc + @example 전문 (47kB)

## 누가 써야 하나

**Yes — 이 라이브러리가 맞는 분**:
- ARIA 행동(키보드·포커스·스크린리더)을 정확히 보증해야 하는 컬렉션 UI 를 만든다 (listbox·tree·grid·tabs·menu·combobox)
- 시각은 Tailwind v3 로 직접 그린다
- 데이터 주도 렌더(`data → onEvent`)에 익숙하다
- W3C/WHATWG 어휘에 코드베이스를 닫고 싶다

**No — 다른 도구가 맞는 분**:
- 즉시 입을 수 있는 시각 컴포넌트(`<Button variant="primary">`)가 필요 → **shadcn/ui · Radix Themes · Material**
- 디자인 시스템 토큰을 라이브러리가 정의해 주길 바람 → **MUI · Chakra**
- markup·스타일까지 묶은 한 줄 import 를 원함 → **Radix UI · Base UI · Ariakit**

## 다음 단계

- [Getting Started](/docs/getting-started) — 5분 안에 첫 화면 띄우기
- [Core Concept](/docs/core-concept) — 데이터 흐름 · 어휘 · 합성 모델 깊게

## 참조 (정본 SSOT)

- [llms.txt](/llms.txt) — 전체 export 인덱스
- [INVARIANTS.md](https://github.com/anthropics/claude-code) — 22 invariants
- [PATTERNS.md](https://github.com/anthropics/claude-code) — 24 recipe 시그니처
- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — 정본 어휘 출처
