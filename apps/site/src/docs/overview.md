# Overview

`@p/headless` 가 무엇이고, 무엇이 아닌지. Radix/Headless UI 와 어디에 위치하는지.

## What it is

**Behavior infrastructure for WAI-ARIA.** 컴포넌트 래퍼가 아니라 한 단 아래의 행동 인프라 — axis 합성, roving tabindex, gesture/intent 변환, APG pattern recipe.

핵심 4 layer:

```
┌───────────────────────────────────────┐
│ pattern recipe (24 APG patterns)      │  useListboxPattern, useTabsPattern, ...
├───────────────────────────────────────┤
│ axis (navigate, activate, expand,     │  composeAxes — 우선순위 합성
│       typeahead, multiSelect, ...)    │
├───────────────────────────────────────┤
│ roving (useRovingTabIndex,            │  APG roving tabindex 메커니즘
│         useSpatialNavigation,         │
│         useActiveDescendant)          │
├───────────────────────────────────────┤
│ data (NormalizedData, UiEvent)        │  3-store + discriminated union
└───────────────────────────────────────┘
```

지표:
- **24 APG patterns** — `useListboxPattern` · `useTabsPattern` · `useTreePattern` · `useTreeGridPattern` · `useMenuPattern` · `useMenubarPattern` · `useComboboxPattern` · `useRadioGroupPattern` · `useToolbarPattern` · `useAccordionPattern` · `useDialogPattern` · `useTooltipPattern` · `useFeedPattern` · `useGridPattern` · `useCarouselPattern` · `disclosurePattern` · `sliderPattern` · `splitterPattern` · `switchPattern` · `spinbuttonPattern` · `navigationListPattern` · `alertPattern` · `alertdialogPattern`
- **zero markup vocabulary** — `<ul>`/`<li>` 결정은 소비자
- **zero CSS** — Tailwind utility class 는 소비자가 직접

## What it isn't

| 아님 | 이유 |
|---|---|
| 컴포넌트 라이브러리 | recipe = 함수 / hook. JSX 0건. compound 컴포넌트 거부 |
| markup 어휘 | `<ul>`/`<li>`/`<button>` 결정은 소비자. 새 어휘 만들지 않는다 |
| 스타일 시스템 | 토큰·CSS-in-JS·classless 어휘 0건 |
| 토큰 시스템 | 색·간격·radius 어휘 0건. Tailwind 가 이미 한다 |

## Identity

- **W3C ARIA/APG 어휘 그대로** — `role="listbox"` + `role="option"`, `aria-selected`, `aria-expanded` 그대로 부여
- **Vocabulary closed** — props 이름은 ARIA `role` 그대로 (`optionProps`, `tabProps`, `rowProps`, `gridcellProps`). 라이브러리·DS 어휘(`itemProps`·`triggerProps`) 차용 금지 (INVARIANT 23~26)
- **24 APG patterns** — [W3C WAI-ARIA APG `/patterns/`](https://www.w3.org/WAI/ARIA/apg/patterns/) URL slug 와 1:1
- **Single data interface** — `(data, onEvent)` 단일 채널. 모든 변화는 `UiEvent` 11 variant 로 통과
- **One direction** — `data → axes → patterns → ui → reducer → data`. 양방향 바인딩 없음

## Comparison

같은 축(컴포넌트)에서 비교하지 않는다. `@p/headless` 는 한 단 아래에 있다.

```
                     visual
                       │
   shadcn / Material   │
        Radix UI       │ component
        Base UI        │ wrappers
        Ariakit        │
        React Aria     │
                       │
   ────────────────────┼──────────────
                       │
   @p/headless         │ behavior infra
   (axes · roving ·    │ (APG recipe 24)
    gesture · pattern) │
                       │
                       │
   WAI-ARIA / APG      │ spec
                       │
                     vocab
```

| 라이브러리 | 층 | 특징 |
|---|---|---|
| Radix UI / Base UI | component wrapper | compound `<Listbox.Root>` + 내장 markup |
| Ariakit / React Aria | component + hook | 컴포넌트 + 일부 hook 노출 |
| `@p/headless` | **behavior infra** | hook + props getter. JSX 0건, markup 결정은 소비자 |

행동(키보드·포커스·접근성)의 de facto 는 Radix/Base/Ariakit/RAC 최소 2곳 수렴한 것을 따른다. *이름·구조* 는 W3C 만 — 라이브러리 어휘 차용 금지 (CLAUDE.md "기본 자세").

## When to use

- ARIA 행동을 정확히 보증해야 하는 컬렉션 UI (listbox·tree·grid·tabs·menu·combobox)
- 시각은 Tailwind v3 로 직접 그리되 키보드/스크린리더 invariant 는 보증하고 싶음
- 데이터 주도 렌더 — `(data, onEvent)` 인터페이스로 한 방향 흐름
- W3C/WHATWG 어휘에 닫혀있는 codebase

## When not to use

- 즉시 시각 컴포넌트(`<Button variant="primary">` 같은 것)가 필요. → shadcn/Radix Themes 가 맞다
- 디자인 시스템 토큰을 라이브러리가 정의해주길 바람. → 정체성 위반
- markup·스타일까지 묶은 한 줄 import 를 원함. → compound 컴포넌트 라이브러리(Radix/Base) 가 맞다

## 참조

- [llms.txt](../../../../llms.txt) — 전체 export 인덱스
- [INVARIANTS.md](../../../../packages/headless/INVARIANTS.md) — 22 invariants
- [PATTERNS.md](../../../../packages/headless/PATTERNS.md) — 24 recipe 시그니처
- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — 정본 어휘 출처
