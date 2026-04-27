---
type: inbox
status: unprocessed
date: 2026-04-27
tags: [design-system, audit, progress, mece]
---

# 우리 ds 프로젝트 진척도 — 갖춘 것 vs 못 갖춘 것 (MECE)

실제 코드베이스를 훑어본 결과를 발전 5단계 + 7가지 시각 어포던스 축에 매핑한다. ✅ 완료 · 🟡 부분 · ❌ 미구현 · ➖ 의도적 제외.

## A. 최소 시각 어포던스 (Stage 0)

| 축 | 항목 | 상태 | 근거 / 위치 |
|----|------|:---:|------|
| 위계 | Type scale | ✅ | `tokens/foundations/typography` |
| 위계 | Spacing 5단(atom→shell) | ✅ | `foundations/layout/hierarchy.ts` |
| 상태 | hover · focus-visible · disabled | ✅ | `foundations/state` |
| 상태 | selected/active 별도 신호 | 🟡 | states.ts 있으나 listbox/tree 위주 — Card·Tag 등 generic selected 약함 |
| 색 | surface · text · status · border semantic | ✅ | `foundations/color` 3-tier |
| 색 | high-contrast · color-pair 규약 | ✅ | memory: color pair primitive |
| 모양 | Radius / Elevation 토큰 | ✅ | `foundations/shape` · `elevation` |
| 아이콘 | `data-icon` 단일 시스템 | ✅ | memory: data-icon canonical |
| 피드백 | Skeleton · EmptyState | ✅ | `parts/Skeleton` · `parts/EmptyState` |
| 피드백 | Toast/Banner | ❌ | overlay에 Toast 없음 |
| 피드백 | 인라인 ErrorText 패턴 | 🟡 | Field에 흡수돼있을 가능성 — 별도 표준 없음 |
| 초점 | focus ring 토큰 1개 | ✅ | state token |

## B. Stage 1 — 폼 · 컬렉션

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Field/Input/Select/Checkbox/Radio/Textarea | ✅ | `ui/3-input` 풀세트 |
| Combobox · NumberInput · Slider · ColorInput · SearchBox | ✅ | 풍부 |
| Form layout (Fieldset · FormGroup) | ❌ | 별도 컴포넌트 없음 — flow="form"으로 대체 |
| Validation 통합 (zod 연동 표준) | ❌ | invariant엔 있지만 폼 차원 wiring 없음 |
| Table (비교) | ✅ | `parts/Table` + `5-display/DataGrid·GridCell` |
| Listbox/Tree (관리) | ✅ | `4-selection` · `5-display/TreeGrid·OrderableList` |
| Card Grid (브라우징) | ✅ | `parts/Card` + `8-layout/Grid` |
| Pagination | ❌ | 없음 |
| Sort/Filter UI 표준 | ❌ | ColumnHeader는 있으나 filter chip 표준 없음 |

## C. Stage 2 — 오버레이 · 내비게이션

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Dialog · Popover · Tooltip · Sheet · Disclosure | ✅ | `6-overlay` 풀 |
| Toast | ❌ | 없음 |
| Sidebar | ✅ | memory: canonical sidebar widget |
| Tabs · Menu · Menubar · Toolbar | ✅ | `4-selection` |
| Breadcrumb | ✅ | `parts/Breadcrumb` |
| Command palette (cmd+k) | ✅ | `6-overlay/command` + staticData.palette |
| Headless layer (Radix급) | ✅ | `headless/` 자체 구현 (axes·feature·flow·gesture·key) |

## D. Stage 3 — 동작 · 비동기

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Motion token (duration · easing) | ✅ | `foundations/motion` 있음 |
| Transition 패턴 표준 (enter/exit) | 🟡 | 토큰만, 컴포넌트 차원 표준 미흡 |
| Skeleton → content 전환 | 🟡 | Skeleton 부품 있지만 Suspense wiring 없음 |
| Optimistic UI · Suspense · Error boundary 표준 | ❌ | data layer는 useResource 있으나 비동기 표준 없음 |
| Layout shift 방지 invariant | 🟡 | keyline-loop는 정렬용, shift 측정은 없음 |

## E. Stage 4 — 밀도 · 다중 모드

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Light · Dark theme | 🟡 | semantic 토큰 구조는 준비됨 — 실제 dark 테마 시연 미확인 |
| High-contrast | ❌ | |
| Density (compact/comfortable) | ❌ | hierarchy 토큰은 한 세트 |
| Responsive shell 분리 (desktop/mobile 별도) | ✅ | memory: 모바일 분기 경계, devices/ layer |
| RTL · i18n | ❌ | 흔적 없음 |
| Brand variant (white-label) | ➖ | 토큰 구조상 가능 — 사용 사례 없음 |

## F. Stage 5 — 자율 검증

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Lint 정적 규약 | ✅ | `lint:ds:all` (raw role · data-ds · 인라인 style) |
| TypeScript 게이트 | ✅ | `tsc -b --noEmit` |
| zod 런타임 게이트 | ✅ | invariant 1번 |
| HMI invariant (위계 단조) | ✅ | `audit-hmi` · hmi-loop 스킬 |
| Keyline invariant (정렬 단조) | ✅ | keyline-loop 스킬 — **업계 거의 없음** |
| Visual regression (Chromatic류) | ❌ | preview는 있으나 diff 자동화 없음 |
| A11y 자동검증 (axe CI) | ❌ | a11y는 컴포넌트 책임, 글로벌 게이트 없음 |
| Storybook/Zeroheight 류 doc | 🟡 | `/canvas` 자체 카탈로그 (Storybook 대용) — auto-publish 없음 |

## G. Stage ∞ — 선언형 · 생성형

| 항목 | 상태 | 비고 |
|------|:---:|------|
| Page-as-data (`definePage`) | ✅ | FlatLayout canonical — **업계 선행** |
| Flow-as-data (`defineFlow`) | ✅ | memory: flow universal wiring |
| Single data interface (`useResource`) | ✅ | invariant |
| Content widget 분리 (entity 승격) | ✅ | `content/` · `patterns/` |
| Cross-platform token (iOS/Android/email) | ❌ | web 전용 |
| Figma ↔ code 양방향 sync | ❌ | Tokens Studio류 미연결 |
| LLM-driven page generation 표준 | 🟡 | 어휘는 닫힘 — generator 미구축 |

## H. 도구·운영 레이어

| 항목 | 상태 |
|------|:---:|
| 모노레포 빌드 (Turborepo/Nx) | ✅ (pnpm + tsc -b) |
| DS package versioning (Changesets) | ❌ |
| Preview deploy per PR | ❌ |
| Token build pipeline (Style Dictionary) | ❌ (자체 ts 토큰) |

---

## 한 장 요약

| 발전 단계 | 평균 충족도 | 갭 핵심 |
|----------|:---:|--------|
| Stage 0 최소 어포던스 | 🟢 95% | Toast · 인라인 Error 표준 |
| Stage 1 폼·컬렉션 | 🟢 80% | Pagination · Form layout · Validation wiring |
| Stage 2 오버레이·내비 | 🟢 95% | Toast |
| Stage 3 시간·비동기 | 🟡 40% | Suspense·Optimistic·Transition 표준 |
| Stage 4 밀도·테마·i18n | 🔴 25% | Dark · Density · RTL 전부 |
| Stage 5 자율 검증 | 🟡 60% | Visual regression · a11y CI · doc auto-publish |
| Stage ∞ 선언·생성형 | 🟢 70% | **이 영역이 업계 선행** — 부족한 건 Figma·multi-platform |
| 운영 도구 | 🔴 20% | versioning · preview deploy · token build |

> **강점**: 어휘 폐쇄(invariant 1·6·7), 선언형 page/flow(invariant 5·2), 위계·정렬 자가 수렴 루프 — 이건 업계 평균보다 앞서있다.
>
> **결정적 갭**: ① 비동기 상태 표준(Suspense/Toast/Optimistic) ② 다중 모드(dark/density/i18n) ③ 시각 회귀·a11y CI 자동화 ④ Figma 양방향 sync.
>
> 다음 손댈 곳을 한 군데만 꼽으면 **Stage 3 비동기 표준** — Stage 0~2가 거의 다 차서 다음 화면을 만들 때 가장 먼저 무너질 자리다.
