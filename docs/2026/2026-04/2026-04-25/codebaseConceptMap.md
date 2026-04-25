---
id: codebaseConceptMap
type: inbox
slug: codebaseConceptMap
title: 코드베이스 전수 컨셉맵 (ASCII tree)
tags: [inbox, explain, audit]
created: 2026-04-25
updated: 2026-04-25
---

# 코드베이스 전수 컨셉맵 (ASCII tree)

## 배경

`/inbox` 호출. `src/` 전수 스캔 결과를 컨셉(개념·역할·계약) 단위로 묶어 ASCII tree 1장으로 남겨, 추후 PRD/리팩토링/온보딩 시 항상 펼쳐볼 수 있는 지도로 사용.

스캔 범위: `src/ds/**`, `src/routes/**` (203개 ts/tsx). 분류 기준은 `src/ds/core/INVARIANTS.md` 의 폴더=zone 규약.

## 컨셉맵

```
ds — Headless DS for LLM (1 role = 1 component, classless, data-driven)
│
├─ core/ ─────────────────────── 영속 불변식·키계약 (APG 외부 권위)
│   ├─ INVARIANTS.md             A·B·C·D 4 카테고리 22 불변식
│   ├─ axis.ts                   axis 추상 (parent.siblings = scope)
│   ├─ trigger.ts                Trigger = key | click (touch=click)
│   ├─ key.ts                    key 정규화·매칭
│   ├─ types.ts                  Node·Trigger·Intent 공통 타입
│   ├─ gesture.ts                activate → expand/navigate/select 변환 헬퍼
│   ├─ axes/                     role별 키매핑 계약 (단발 emit)
│   │   ├─ activate.ts            Enter/Space/click → activate
│   │   ├─ navigate.ts            Arrow → focus 이동 (wrap=true 강제)
│   │   ├─ expand.ts              Right/Left → expand toggle 도출
│   │   ├─ typeahead.ts           label prefix 매칭
│   │   ├─ treeNavigate.ts        tree 구조 nav
│   │   └─ treeExpand.ts          tree expand
│   ├─ state/                    focus·data 결합층
│   │   ├─ bind.ts                useControlState ↔ data
│   │   ├─ fromTree.ts            tree → flat node list
│   │   └─ reduce.ts              intent reducer
│   └─ hooks/                    React 결합
│       ├─ useRoving.ts           data-driven roving (collection/)
│       ├─ useRovingDOM.ts        composition roving (composite/)
│       ├─ useControlState.ts     controlled/uncontrolled 통합
│       ├─ useShortcut.ts         global > local 우선순위 (B14)
│       └─ focus.ts               focusId ↔ DOM focus bridge (B11/D21)
│
├─ ui/ ─────────────────────── role-first 부품. 폴더 = zone.
│   ├─ collection/               data-driven (CollectionProps, leaf variants)
│   │   ├─ Listbox + ListboxGroup + Option
│   │   ├─ Menu + MenuGroup + MenuItems + MenuPopover
│   │   ├─ RadioGroup · CheckboxGroup
│   │   ├─ Tree
│   │   └─ Columns                (Finder column-list)
│   ├─ composite/                composition roving (children + useRovingDOM)
│   │   ├─ DataGrid · DataGridRow · GridCell · ColumnHeader · RowHeader · RowGroup
│   │   ├─ TreeGrid · TreeRow
│   │   ├─ Tabs · Toolbar · Menubar · MenuList
│   │   └─ OrderableList
│   ├─ control/                  atomic native (1 tabbable element)
│   │   ├─ Button · ToolbarButton
│   │   ├─ Input · NumberInput · ColorInput · Textarea
│   │   ├─ Checkbox · Radio · Switch
│   │   ├─ Select · Combobox      (Combobox = aria-activedescendant 예외 B11)
│   │   ├─ Slider · Progress
│   │   └─ Field                  (label/help/error 결합)
│   ├─ overlay/                  surface (native dialog/details/popover)
│   │   ├─ Dialog · Disclosure · Tooltip
│   │   └─ CommandPalette
│   ├─ entity/                   domain card (≥2 도메인 힌트)
│   │   ├─ Badge
│   │   ├─ CourseCard · RoleCard · StatCard
│   │   └─ Feed · FeedArticle
│   └─ layout/                   primitive · decoration (roving 무관)
│       ├─ Row · Column · Grid    (data-ds primitive 전용)
│       ├─ Separator · Carousel
│       └─ BarChart · Top10List · LegendDot
│
├─ layout/ ─────────────── FlatLayout — definePage entities tree + Renderer
│   ├─ definePage.ts              선언형 페이지 DSL (canonical)
│   ├─ nodes.ts                   node 종류
│   ├─ registry.ts                widget 카탈로그 등록
│   ├─ Renderer.tsx               tree → React
│   └─ index.ts
│
├─ style/ ─────────────── classless CSS-in-JS (tag + role + aria 만)
│   ├─ seed/                     base layer
│   │   ├─ tokens.ts              palette/semantic/pair 3-tier
│   │   ├─ reset.ts               normalize
│   │   └─ keyline.ts             border/divider primitive
│   ├─ preset/                    apply/default/hairline 프리셋 진입
│   ├─ shell/                    chrome · panes (앱 외곽)
│   ├─ states/                   :focus-visible / [aria-*] / disabled
│   │                            base = flex+align-items:center 일괄 (rovingItem)
│   └─ widgets/                  role family별 스타일 모듈
│       ├─ bar/toolbar
│       ├─ display/  badge · chip · feed · barChart · legendDot ·
│       │            statCard · roleCard · courseCard · top10 · bar · display
│       ├─ form/     button · form · progress · slider · switch · toggle
│       ├─ grid/     grid                (DataGrid/TreeGrid)
│       ├─ layout/   layout              (Row/Column/Grid primitive)
│       ├─ list/     listbox · orderable · tabs
│       ├─ menu/     menu
│       ├─ overlay/  details · overlay
│       └─ tree/     tree
│
└─ fn/ ─────────────── 공통 함수 (color pair · state · structural)
    ├─ pair.ts                   surface↔text pair primitive (소유자만 색)
    ├─ palette.ts                palette N-tier 접근자
    ├─ semantic.ts               text/surfaceMuted/borderLevel 등 semantic
    ├─ state.ts                  mute/emphasize (item weight·opacity)
    ├─ structural.ts             구조 셀렉터 헬퍼
    ├─ recipes.ts · values.ts    조합·값 변환
    ├─ icon.ts                   icon resolver
    └─ index.ts

routes/ ─────────────────────── ds 적용 데모·앱
├─ catalog/                     Catalog · demos · virtual-ds-contracts.d.ts
├─ atlas/                       전체 데모 인덱스 (virtual-ds-audit)
├─ matrix/                      role × widget 매트릭스
├─ inspector/                   디자인 인스펙터 (Canvas + 7 sections)
├─ finder/                      macOS Finder 풍 데모 (Columns/ListView/Preview)
├─ debug/                       guides
├─ edu-portal-admin/            관리자 콘솔 (pages 6 · dialogs 4)
└─ genres/                      장르별 앱 8종
   ├─ analytics · chat · crm · editor
   ├─ feed · inbox · settings · shop
   ├─ GenresHub.tsx · GAPS.md
   └─ 각 폴더: build.tsx (definePage) + data.ts + <Genre>.tsx
```

## 컨셉 축 요약

```
zone (ui/)                 ──  collection(data) | composite(children) | control(atomic)
                               | overlay(surface) | entity(domain) | layout(primitive)

emit 계약                  ──  ui/ = activate 단발 / 소비자 = expand·navigate·select 도출
                               (core/gesture.ts 헬퍼 경유)

style 계층 (classless)     ──  seed → preset → shell/states → widgets/<family>
색 토큰                    ──  palette(gray N) → semantic → pair → component
DOM 선택자                 ──  tag + role + aria-* 만 (class 금지)
data-ds                    ──  Row/Column/Grid 3개 primitive 전용

focus 모델                 ──  focusId 1개 (data 전체) → DOM focus 1개 (B11)
                               예외: Combobox 의 aria-activedescendant

페이지 선언                ──  definePage(entities tree) → Renderer → registry 위젯
                               (Row/Column JSX 조립은 임시)
```

## 다음 행동

- 이 컨셉맵을 `/explain` 또는 Living Documentation 의 루트 인덱스로 승격할지 검토
- `style/widgets/` family 와 `ui/` zone 매핑표를 별도 문서로 추출 (현재 implicit)
- `routes/genres/*/build.tsx` definePage 사용 일관성 감사 (FlatLayout direction 메모리와 정합)
