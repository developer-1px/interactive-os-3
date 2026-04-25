---
id: projectConcept
type: inbox
slug: projectConcept
title: ds — 프로젝트 컨셉 소개 (배경 + 코어 컨셉)
tags: [inbox, vision, explain]
created: 2026-04-25
updated: 2026-04-25
---

# ds — LLM이 흔들 수 없는 디자인 시스템

## 배경

### 왜 또 디자인 시스템인가

기존 디자인 시스템(Material, Ant, Chakra, shadcn 등)은 *사람 개발자*를 1차 사용자로 가정한다. 사람은 문서를 읽고, 비슷한 컴포넌트 사이에서 적절한 것을 고르고, variant prop을 조합하고, 필요하면 escape hatch로 우회한다. **선택지가 많아도 사람은 맥락으로 거른다.**

LLM은 다르다.

- variant가 5개면 5개 다 시도한다 — 가장 흔한 걸 고르고 그게 맞는지 검증하지 않는다
- escape hatch(`as`, `className`, `style`, raw `role`)가 있으면 어려운 케이스에서 거기로 새어나간다
- 비슷한 컴포넌트(`Button` vs `IconButton` vs `MenuItem`)가 있으면 의미가 아니라 이름의 그럴듯함으로 고른다
- "잘 모르면 wrapper div로 감싸서 해결"하는 평균 패턴을 그대로 출력한다

결과: **LLM이 만든 UI는 동작은 하지만 일관성이 깨지고, 접근성이 빠지고, 토큰을 우회하고, 같은 역할의 컴포넌트가 화면마다 다르게 생긴다.** 디자인 시스템이 있어도 시스템 *밖*으로 새는 게 더 쉬워서, 시스템이 강제력을 잃는다.

ds는 이 문제를 정면으로 받는다. **사람이 아니라 LLM이 1차 사용자**라고 가정하고, 그 가정 위에서 모든 결정을 다시 내린다.

### 설계 원칙의 뒤집기

| 기존 DS | ds |
|---|---|
| 유연성 = 미덕 (variant, prop, slot) | **선택지를 줄이는 것** = 미덕 |
| escape hatch는 안전망 | escape hatch는 누수원, 0개 목표 |
| className으로 스타일 커스터마이즈 | **classless** — tag + ARIA 셀렉터만 |
| 컴포넌트 이름은 브랜드 | 컴포넌트 이름은 **ARIA role 그대로** |
| 사람이 조립 (JSX children) | **데이터 주도** — `data` + `onEvent` |
| wrapper로 문제 해결 | wrapper 금지, **DOM 평탄화 / portal** |

## 코어 컨셉

### 1. 1 role = 1 component

ARIA role 하나에 컴포넌트 하나가 정확히 대응한다. `Listbox`, `Menu`, `Tabs`, `Combobox`, `Dialog`. variant 없음. "어떤 컴포넌트를 써야 하지?"라는 질문이 "이건 어떤 role이지?"로 환원된다 — 그리고 ARIA spec이 답을 가지고 있다.

LLM이 고를 일이 없다.

### 2. Classless — HTML + ARIA만

스타일 전용 class를 쓰지 않는다. CSS 셀렉터는 `tag + role + aria-*`만 허용한다.

```css
[role="listbox"] { ... }
[role="option"][aria-selected="true"] { ... }
button[aria-pressed="true"] { ... }
```

이유: class는 LLM이 자유롭게 만들어낼 수 있는 표면이다. 한 번 허용하면 `card-large`, `btn-primary-rounded` 같은 무한 변종이 생긴다. ARIA 속성은 spec이 닫혀 있어서 무한 증식이 불가능하다. **셀렉터의 어휘를 ARIA로 좁히면, 스타일링도 의미와 동기화된다.**

예외: `data-ds="Row|Column|Grid"` 단 3개의 layout primitive만 허용. 그 외 모든 시각 차이는 tag + ARIA로 표현된다.

### 3. Data-driven rendering

ui/ 컴포넌트는 JSX children을 받지 않는다. `data` + `onEvent` 구조다.

```tsx
// 금지
<Listbox><Option>A</Option><Option>B</Option></Listbox>

// 허용
<Listbox data={items} onActivate={...} />
```

이유: children을 허용하면 LLM이 거기에 임의의 wrapper, 임의의 컴포넌트, escape hatch를 박는다. 데이터로 받으면 렌더링은 ds가 책임지고, 소비자는 *무엇을 표시할지*만 결정한다. 책임 경계가 깨끗하게 잘린다.

### 4. Gesture / Intent 분리

ui/ 컴포넌트는 **gesture**(클릭, 키 입력)만 단발 emit한다 — `onActivate`. expand/navigate/select 같은 **intent**로의 도출은 `ds/core/gesture` 헬퍼가 담당한다. 소비자는 reducer 직전에 헬퍼를 통과시키는 것 외에 키보드 처리에 손대지 않는다.

이유: 각 컴포넌트가 자기 키보드 정책을 들고 있으면 같은 role끼리도 동작이 어긋난다. roving tabindex, Home/End, Type-ahead 같은 정책은 한 곳에 있어야 한다.

### 5. Unified Roving — self-attach

roving 제어가 필요한 모든 role(listbox, menu, tabs, grid, ...)은 `composeAxes`를 **컴포넌트 내부에서** 자가 결합한다. 소비자가 `onKeyDown`을 직접 쓰는 순간 그 컴포넌트는 미완성이다.

### 6. Color pair primitives

색은 *surface 소유자*만 owns한다. 자식 item은 색을 직접 지정하지 않고 `mute()` / `emphasize()`로 weight·opacity만 조정한다. cell 레벨에서 `color: dim(N)` 같은 코드는 안티패턴이다.

토큰 계층은 3단:
- **palette** — `gray(N)` 같은 원시 척도
- **semantic** — `text`, `surfaceMuted`, `borderLevel`
- **pair / component** — surface 단위 묶음

widget은 semantic만 import한다. 화면 어디서든 같은 의미는 같은 색이 나오도록 강제된다.

### 7. FlatLayout — definePage + Renderer

레이아웃은 JSX 조립이 아니라 **선언형 entities tree**다.

```tsx
definePage({
  topbar: ...,
  main: { type: "Grid", entities: [...] },
  ...
})
```

Row/Column/Grid를 JSX로 짜는 건 임시 형태이고, canonical 형태는 `definePage` + `Renderer`다. 화면 구조가 데이터로 표현되면 검증 가능하고, LLM이 만들어내는 화면을 정적으로 감사할 수 있다.

### 8. Content widget = DS 부품의 이름 붙은 조합

content widget(예: `ProductCard`, `ConversationListItem`)은 root 1곳에만 카탈로그용 className을 갖고, **내부는 DS 어휘로만** 조립된다. 서브파트에 이름을 붙이지 않는다 — 서브파트는 ds 컴포넌트 그 자체로 식별된다.

### 9. 반응형은 컨텐츠만

Grid 같은 *컨텐츠* 영역만 reflow한다. shell(topbar, sidebar, drawer)과 control(button, input)은 desktop·mobile을 별도로 구현한다. CSS로 shell의 DOM 구조를 reshape하지 않는다.

이유: 같은 DOM이 두 모드에서 다른 트리처럼 행동하면 접근성·포커스·스크롤이 모두 깨진다. shell은 "다른 화면"으로 취급한다.

### 10. List / Table / Card Grid 3패턴

컬렉션을 표시하는 방식은 셋 중 하나로 수렴한다 — Shopify, Ant, Material에서 공통 수렴되는 분류:

- **Table** — 비교 (행 간 동일 속성 비교가 목적)
- **List** — 관리 (행 단위 액션이 주)
- **Card Grid** — 시각 브라우징 (이미지·시각 식별이 주)

"어떤 컬렉션 컴포넌트?"라는 LLM의 질문이 "사용자가 여기서 *비교/관리/브라우징* 중 무엇을 하나?"로 환원된다.

## 한 줄 요약

> **ds는 LLM이 escape hatch 없이도 일관된 UI를 만들 수 있도록, 어휘를 ARIA로 좁히고 선택지를 0에 가깝게 줄인 디자인 시스템이다.**

de facto 표준(Radix, Base UI, Ariakit, RAC) 중 최소 2곳에서 수렴하는 패턴만 채택한다. ds 자체가 발명을 하지 않는다 — 업계가 이미 합의한 곳을 더 좁게 다시 그릴 뿐이다.

## 다음 행동

- 이 문서를 공식 README/docs로 승격할 때는 `type: explain` 또는 `type: vision`으로 재분류
- 코어 원칙 각각에 대한 별도 explain 문서로 드릴다운 가능 (특히 1·2·3·4가 인용 빈도가 높을 듯)
