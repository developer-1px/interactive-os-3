# Overview

## 익숙한 풍경

웹앱을 만들 때 우리는 보통 컴포넌트 라이브러리에 손을 내밉니다. Material UI · Ant Design · shadcn/ui · Radix UI · Headless UI — 이름은 다양하지만 약속은 같습니다.

> "리스트, 탭, 메뉴, 드롭다운, 다이얼로그… 자주 쓰는 UI 를 미리 만들어 둘 테니 가져다 쓰세요."

설치 한 줄, import 한 줄, 쓰기만 하면 키보드로 화살표 눌러서 메뉴 항목을 이동하고, Enter 로 선택하고, Escape 로 닫고, 스크린리더가 옳게 읽어 주는 — 이런 **접근성 동작**까지 다 들어 있는 컴포넌트가 화면에 등장합니다. 편합니다.

## 그런데 이런 적이 있지 않으셨나요

이렇게 가져다 쓰다가 어느 순간 **시각**을 다르게 하고 싶어집니다. 디자이너가 "우리 브랜드는 이런 색·간격·radius 로 통일해 주세요" 라고 합니다. 자체 디자인 시스템이 있을 수도, 그냥 미감이 다를 수도 있습니다.

이때부터 묘한 마찰이 시작됩니다.

- 라이브러리 컴포넌트 안에 **이미 들어있는 색·여백·아이콘·border** 와 싸웁니다. CSS 우선순위 전쟁, `!important`, 깊은 selector 가 등장합니다.
- 컴포넌트가 강요하는 **markup 구조**(`<Listbox.Root>` 안에 `<Listbox.Trigger>` 안에 `<Listbox.Items>` …) 를 그대로 받아들여야 합니다. 디자인이 살짝만 어긋나도 분해됩니다.
- 결국 "**그냥 처음부터 직접 만들자**" 결정이 내려집니다.

직접 만들기 시작하면 곧 깨닫습니다.

> "키보드 동작 하나 제대로 만드는 게 이렇게 어려웠나?"

리스트 하나에 이런 것들을 다 챙겨야 합니다 — 위/아래 화살표로 항목 이동, Home/End 로 처음·끝, 글자 입력하면 그 글자로 시작하는 항목으로 점프(typeahead), Tab 키로 빠져나가기, Shift+화살표로 범위 선택, 활성 항목을 스크린리더가 읽도록 `aria-activedescendant` 갱신, 포커스를 한 항목에만 두고 나머지는 `tabindex="-1"` 로 빼는 roving tabindex…

W3C 가 [APG](https://www.w3.org/WAI/ARIA/apg/) 라는 가이드를 만들어 두었지만 이걸 정확히 따라 구현하면 listbox 하나에 보통 200줄이 넘습니다. 그리고 다음 화면에서 tree 가 필요해지면 또 처음부터.

## 그래서 우리가 정말 원하는 것은

이 두 가지입니다.

> **시각은 우리가 직접 그리고 싶다. 행동(키보드·포커스·접근성)은 누가 대신 보증해 줬으면 좋겠다.**

기존 라이브러리들은 "행동 + 시각 + markup" 묶음을 줍니다. 묶음이 잘 맞으면 좋지만, 시각만 떼어내려고 하면 잘 안 떨어집니다.

**행동만**, 그 한 가지만 책임지는 도구가 있다면 — 시각은 자유롭게 (Tailwind 든 자체 CSS 든) 그리고, 동작은 spec 대로 작동한다고 안심할 수 있다면 — 어떨까요?

## 답 — `@p/headless`

`@p/headless` 는 정확히 그 한 가지만 합니다.

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

이게 전부입니다. `useListboxPattern` 이 키보드 동작·포커스·`aria-*` 속성을 다 챙겨 주고, `<ul>`·`<li>`·`className` 은 본인이 결정합니다.

화살표 눌러 보세요 — 항목이 이동합니다. 글자 입력해 보세요 — typeahead 가 작동합니다. Tab 눌러 보세요 — 빠져나갑니다. 스크린리더로 읽어 보세요 — `role="listbox"` · `aria-selected` 다 들어가 있습니다.

**행동은 끝났고**, 이제 시각은 마음껏.

## 라이브러리의 정체성

이 한 줄이 핵심입니다.

> **컴포넌트 라이브러리가 아니라, 행동 인프라입니다.**

세 가지 약속이 따라옵니다.

### 1. markup · 스타일 · 토큰을 만들지 않습니다

- `<ul>` 을 `<ol>` 로 바꿔도 동작합니다 — 라이브러리는 markup 구조를 강요하지 않습니다
- 색·여백·border 어휘 0건 — Tailwind utility class 또는 본인 CSS 로 직접
- 컴포넌트 wrapper(`<Listbox.Root>` 같은 것) 0건 — hook + props getter 만

### 2. 어휘는 W3C ARIA 그대로

라이브러리가 자체 어휘를 만들지 않습니다. role 이름, ARIA 속성, prop 키 모두 [WAI-ARIA spec](https://www.w3.org/TR/wai-aria-1.2/) 그대로입니다.

- `role="listbox"` · `role="option"` · `aria-selected` · `aria-expanded`
- `optionProps`, `tabProps`, `rowProps`, `gridcellProps` (ARIA role 그대로)

함수 식별자(`useListboxPattern`)는 React 컨벤션과 APG slug(`/listbox/`) 를 결합한 것 — 이 정도가 라이브러리가 추가하는 어휘의 전부입니다.

### 3. 데이터 한 곳, 이벤트 한 채널

```
data → 화면 → 이벤트 → reducer → data
```

- 데이터는 `NormalizedData` 한 형태 — `{ entities, relationships, meta }` plain JSON
- 이벤트는 `onEvent(e)` 한 채널 — 11가지 의미 변종(navigate · activate · expand · select …) 한 union
- 양방향 바인딩 ❌ · class · ref · closure 잔재 ❌

이 한 방향 흐름 덕에 직렬화 · 디버깅 · 테스트 · LLM 추론이 쉬워집니다.

## 진입점

| 진입점 | 어디 | 무엇 |
|--------|------|------|
| Pattern recipe (24개) | `@p/headless/patterns` | listbox · tabs · tree · menu · combobox · dialog · slider … |
| Axis primitive | `@p/headless` | navigate · activate · expand · typeahead · multiSelect … (recipe 가 부족할 때 직접 합성) |
| 데이터 빌더 | `@p/headless` | `fromList`, `fromTree`, `pathAncestors` |
| 단일 dispatch 어휘 | `@p/headless` (`UiEvent`) | 11 variant union |
| LLM 컨텍스트 | [/llms.txt](/llms.txt) · [/llms-full.txt](/llms-full.txt) | 226 export 인덱스 + 시그니처 전문 |

라이브 데모: [/patterns](/patterns) · [/axes](/axes) · [/matrix](/matrix) · [/data](/data) · [/uievents](/uievents)

## 다음 단계

- [Getting Started](/docs/getting-started) — 5분 안에 첫 화면
- [Comparison](/docs/comparison) — 다른 라이브러리와의 차이
- [Core Concept](/docs/core-concept) — 데이터 흐름 · 어휘 · 합성 모델
- [FAQ](/docs/faq) — 자주 묻는 질문

## 참조

- [W3C WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/) — 정본 어휘 출처
- [/llms.txt](/llms.txt) — 전체 export 인덱스
