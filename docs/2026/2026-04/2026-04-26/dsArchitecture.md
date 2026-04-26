---
id: dsArchitecture
type: inbox
slug: dsArchitecture
title: ds 아키텍처 — 좁은 정본을 가능하게 하는 메커니즘
tags: [inbox, technical, architecture, ds]
created: 2026-04-26
updated: 2026-04-26
---

# ds 아키텍처 명세 — 좁은 정본을 가능하게 하는 메커니즘

## 1. 개요

ds는 LLM이 화면을 생성할 때 같은 의미가 같은 형태로 환원되도록 설계된 디자인 시스템이다. 전통 디자인 시스템이 어휘(컴포넌트 카탈로그)를 늘리는 방향이라면, ds는 통사(결합 규칙)를 좁히는 방향으로 설계되었다. 본 문서는 그 좁힘을 코드 수준에서 강제하는 다섯 가지 메커니즘을 명세한다.

대상 독자: ds 위에서 코드를 생성·소비하는 개발자 및 LLM. 본 문서를 컨텍스트로 사용하면 출력 분산이 줄어든다.

## 2. 패키지 토폴로지

```
src/ds/
├── core/         타입·이벤트·정규화 데이터 계약 (NormalizedData, Event, ControlProps)
├── data.ts       NormalizedData 헬퍼
├── palette/      raw scale (gray·pad·elev) — 수치 토큰
├── foundations/  semantic role·slot·mixin
│   ├── color/        text·surface·border·tone
│   ├── typography/   heading·body·muted·small
│   ├── shape/        radius·corner
│   ├── spacing/      pad·gap·hierarchy(atom→shell 5단)
│   ├── layout/       container(환경 폭 토큰)·square·listReset
│   ├── state/        focus·hover·disabled mixin
│   ├── elevation/    surface·shadow
│   ├── iconography/  iconVars·iconIndicator
│   ├── motion/       transition tokens
│   ├── control/      button·field shape recipes
│   ├── primitives/   tag+role primitives
│   └── recipes/      도메인 특화 조합
├── parts/        content 부품 (Card, Tag, Avatar, Badge…) — data-part="<name>"
├── ui/           role 부품 (zone별 0~8 layer)
│   ├── 0-primitive   Box, VisuallyHidden
│   ├── 1-indicator   Spinner, Progress, Status
│   ├── 2-action      Button, Link
│   ├── 3-input       Field, Checkbox, Switch
│   ├── 4-collection  Menu, Listbox, Tree, Tabs, TreeGrid
│   ├── 5-composite   Combobox, DatePicker
│   ├── 6-overlay     Dialog, Popover, Tooltip
│   ├── 7-pattern     ContractCard, AuthCard…
│   └── 8-layout      Row, Column, Grid, Aside…
├── layout/       FlatLayout 엔진 (definePage, Renderer, nodes)
└── style/        CSS 생성기 (cascade layers, widgets, parts, shell)
```

각 layer는 한 방향으로만 의존한다. core ← foundations ← parts ← ui ← layout. 역방향 import는 빌드 타임에 차단된다.

## 3. 메커니즘 1 — 정규화 데이터 계약 (NormalizedData)

ui/4-collection 이상의 모든 부품은 children prop을 받지 않는다. 대신 단일 데이터 형태를 받는다.

```ts
// src/ds/core/types.ts
export interface Entity {
  id: string
  data?: Record<string, unknown>
}

export interface NormalizedData {
  entities: Record<string, Entity>
  relationships: Record<string, string[]>
}

export interface ControlProps {
  data: NormalizedData
  onEvent?: (e: Event) => void
}

export type Event =
  | { type: 'navigate'; id: string }
  | { type: 'activate'; id: string }
  | { type: 'expand'; id: string; open: boolean }
  | { type: 'select'; id: string }
  | { type: 'value'; id: string; value: unknown }
  | { type: 'open'; id: string; open: boolean }
  | { type: 'typeahead'; buf: string; deadline: number }
```

정본 효과:

- **JSX children 금지**: `<Menu>{...children...}</Menu>` 같은 자유 조립 불가능. 항목은 `data.entities`에서만 파생된다.
- **단일 인터페이스**: Menu·Listbox·Tree·Tabs 모두 `(data, onEvent)` 시그니처. LLM이 호출할 때 매번 같은 형태.
- **이벤트는 7개로 닫혀 있다**: 새 인터랙션이 필요해도 새 prop을 만들지 않고 기존 Event 중 하나로 환원한다.

## 4. 메커니즘 2 — FlatLayout definePage

페이지는 컴포넌트 트리(JSX 조립)가 아니라 `NormalizedData`로 선언된다.

```ts
// src/ds/layout/nodes.ts (발췌)
export type NodeType =
  | 'Row' | 'Column' | 'Grid' | 'Split'
  | 'Main' | 'Nav' | 'Aside' | 'Section' | 'Header' | 'Footer'
  | 'Ui' | 'Text'

export interface ItemPlacement {
  grow?: boolean
  width?: number | string
  maxWidth?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  aspect?: 'square' | number
}
```

페이지 정의:

```ts
import { definePage } from '@/ds'

export default definePage({
  entities: {
    root:   { id: 'root',   data: { type: 'Column', flow: 'list' } },
    header: { id: 'header', data: { type: 'Header' } },
    body:   { id: 'body',   data: { type: 'Row', grow: true } },
    aside:  { id: 'aside',  data: { type: 'Aside', width: 240 } },
    main:   { id: 'main',   data: { type: 'Main', grow: true } },
    title:  { id: 'title',  data: { type: 'Text', variant: 'h1', text: 'Inbox' } },
  },
  relationships: {
    root:   ['header', 'body'],
    body:   ['aside', 'main'],
    main:   ['title'],
  },
})
```

정본 효과:

- **레이아웃 어휘는 12개**: Row·Column·Grid·Split·Main·Nav·Aside·Section·Header·Footer·Ui·Text. 그 외는 Ui로 위임.
- **placement는 4개 prop**: grow·width·maxWidth·align. CSS 클래스·인라인 스타일·custom flex 트릭은 막혀 있다.
- **Renderer가 단일 진입**: `<Renderer page={page} />`가 트리를 순회해 DOM을 만든다. 소비자는 트리 모양만 결정한다.

## 5. 메커니즘 3 — CSS Cascade Layers (specificity 제거)

CSS 우선순위는 selector specificity가 아니라 layer 순서로만 결정된다.

```ts
// src/ds/index.ts
export const APPS_LAYER_DECL =
  '@layer reset, states, widgets, parts, content, shell, apps;\n'
```

| Layer    | 책임                                    |
|----------|-----------------------------------------|
| reset    | `:where()` 0-spec HTML 기본             |
| states   | focus·hover·disabled mixin              |
| widgets  | control·collection·composite·pattern    |
| parts    | content 부품 (Card, Tag, Avatar…)       |
| content  | data-card="*" 변형 (parts override)     |
| shell    | chrome·sidebar·골격                     |
| apps     | 라우트별 override (마지막 결정권)        |

정본 효과:

- **specificity 카운팅 불필요**: `!important`·`#id`·중첩 selector로 우선순위 싸움 안 함. 어느 layer에 속하는지만 본다.
- **assertUniqueSelectors**: 부팅 시 selector 중복을 throw로 차단한다 (`src/ds/style/assertUnique.ts`). Cascade race는 영구 부채라 새 중복 자체가 금지된다.
- **classless**: 스타일 전용 class는 만들지 않는다. selector는 tag + role + aria + data-* 만.

## 6. 메커니즘 4 — Token 3-tier (palette · foundations · component)

토큰은 세 층으로만 흐른다. widget이 raw 수치를 직접 import하는 것은 금지된다.

```
palette/  →  foundations/  →  ui·parts·widget
(수치)        (semantic)       (소비)
```

```ts
// src/ds/foundations/layout/container.ts
export const container = {
  cell:    '240px',  // 카드 그리드 셀 (Pinterest·Dribbble·Shopify)
  card:    '320px',  // 단일 카드 (Apple App Store)
  chat:    '360px',  // 모바일 메신저 (KakaoTalk·iMessage·Slack)
  form:    '420px',  // 단일 폼 (Auth0·Stripe Elements)
  panel:   '480px',  // 사이드 패널 (Linear·Slack right pane)
  feed:    '600px',  // Feed 메인 (Twitter·Threads·Mastodon)
  reading: '680px',  // 본문 (Notion·Medium·Substack)
  list:    '720px',  // Inbox·List (Gmail·GitHub Issues)
} as const
```

정본 효과:

- **환경 이름 토큰**: t-shirt size(sm·md·lg)가 아니라 environment 이름(chat·feed·reading). 폭이 가독·UX에 의해 외부 수렴된다.
- **단조 증가 invariant**: cell < card < chat < form < panel < feed < reading < list. 새 환경이 들어오려면 이 순서를 깨지 않아야 한다.
- **벤더 수렴 채택 기준**: Radix·Base·Ariakit·React Aria 중 최소 2곳에서 같은 패턴이 채택될 때만 도입. 임의 추가 차단.

## 7. 메커니즘 5 — Roving·Gesture·Intent 분리

키보드 인터랙션은 ui/ 부품 내부에 매몰된다. 소비자가 `onKeyDown`을 만질 일이 없다.

```
useRovingDOM (composeAxes 내장)  →  ui/ 부품
        ↓ activate 단발 emit
ds/core/gesture (expand·navigate 도출)
        ↓
useFlow → resource.onEvent (intent router)
```

정본 효과:

- **ui/는 gesture만 emit**: `onEvent({ type: 'activate', id })` 한 줄. expand·navigate는 ds/core/gesture 헬퍼가 도출한다.
- **소비자는 intent만 받는다**: useFlow 한 줄로 ui ↔ resource를 잇는다. raw 키 핸들러 작성은 미완 신호.
- **itemSelector 명시**: TreeGrid·Listbox류는 `itemSelector='[role="row"]'`. 기본 TABBABLE은 자연 tabbable 그룹용.

## 8. 정적 검증 하네스

원칙은 메모가 아니라 빌드 타임 훅으로 강제된다.

| 훅 / 스크립트                       | 차단 대상                                        |
|-------------------------------------|--------------------------------------------------|
| `assertUniqueSelectors`             | CSS layer 간 selector 중복                       |
| `lint:ds:flat-layout`               | 페이지 라우트의 JSX 레이아웃 조립                |
| `guardOsPatterns.mjs`               | raw `role="..."` 사용, as prop 남용              |
| `vite-plugin-ds-audit`              | 토큰 우회·palette 직접 import·classless 위반     |
| `scripts/namingReport.ts`           | 동의어 드리프트·형식 불일치·역할 분산            |

원칙이 사람의 기억에 의존하면 마모된다. 훅은 마모되지 않는다.

## 9. 사용 예 — 카드 그리드 1화면

```tsx
// src/routes/products.tsx
import { definePage, Renderer } from '@/ds'

export default function ProductsRoute() {
  const page = definePage({
    entities: {
      root: { id: 'root', data: { type: 'Column', flow: 'list' } },
      head: { id: 'head', data: { type: 'Text', variant: 'h1', text: 'Products' } },
      grid: { id: 'grid', data: { type: 'Grid', cols: 3, cardGrid: true } },
      // 카드 항목들은 useResource로 주입
      ...productEntities,
    },
    relationships: {
      root: ['head', 'grid'],
      grid: productIds,
    },
  })
  return <Renderer page={page} />
}
```

여기서 LLM이 만질 수 있는 자유도는 다음으로 한정된다:

- entity의 `type` (12개 NodeType 중 하나)
- placement 4개 prop (grow·width·maxWidth·align)
- relationships 트리 모양

색·간격·typography·shape는 토큰이 결정한다. CSS 클래스·인라인 스타일·자유 JSX는 닫혀 있다. 같은 화면을 LLM이 100번 다시 생성해도 출력은 거의 동일하다. 이것이 좁은 정본이 작동한다는 의미다.

## 10. 적용 체크리스트

새 ui/ 부품을 추가할 때:

- [ ] children prop 없이 `ControlProps` 시그니처
- [ ] Event 7종 안에서만 emit
- [ ] tag + role + aria selector만 (data-part는 content 부품 namespace)
- [ ] foundations 토큰만 import (palette 직접 X)
- [ ] Radix·Ariakit·RAC 중 2곳 이상의 수렴 패턴 인용
- [ ] CSS는 widgets 또는 parts layer에 등록 (assertUniqueSelectors 통과)
- [ ] 키보드 인터랙션은 useRovingDOM 내장 (소비자 onKeyDown 금지)

새 라우트를 추가할 때:

- [ ] `definePage` 단일 export
- [ ] Row/Column/Grid JSX 조립 금지 (lint:ds:flat-layout)
- [ ] staticData.palette로 cmd+k 자동 등록
- [ ] 라우트 owner 스타일은 apps layer

체크리스트가 통과하면 정본 안이다. 통과하지 못하면 빌드가 깨진다.
