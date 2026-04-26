---
type: inbox
status: unconsumed
project: ds
layer: meta
tags: [status, audit, working, blocked, retrospective]
date: 2026-04-26
---

# 프로젝트 현황 — 잘 되는 것 vs 막힌 것

3개 영역(ds 구조 / evolution·커밋 / routes·TODO)을 병렬 조사한 결과를 통합.

## TL;DR

> 핵심 기둥(collection/control/entity, 3-tier 색, FlatLayout 데이터 엔진)은 **수렴 완료**.
> 막힘은 한 곳에 몰려 있다 — **composite-roving 보증 + ui/layout 분류 + 자동화된 원칙 감사**.
> 최근 3주는 "기능 추가"가 아니라 **구조적 재수렴 단계** (모바일 분기 폐기, JS shell 분기 폐기, CSS-only 통합).

---

## 🟢 잘 되는 것 (settled)

### 코드
- **ui/collection 8개** — Listbox/Menu/Tree/Tabs/RadioGroup/CheckboxGroup/Toolbar/Columns. 데이터 주도, useRoving 자체 관리, variant 0.
- **ui/control 15개** — Button/Input/Slider/Switch/Checkbox/Select 등. role 고정, ARIA context로 강도 결정.
- **ui/entity 13개** — domain card(Stat/Course/Contract/Fn). pair() + toneTint() 3-tier.
- **fn/pair + fn/semantic** — surface flip 안전한 opacity 기반 약화.
- **core/{hooks,axes,gesture}** — useRoving/composeAxes 수렴. 1 roving group = 1 tabstop.
- **layout/nodes + Renderer** — FlatLayout 데이터 중심, definePage 검증, children 0.
- **원칙 위반 0** — variant prop 부재, raw role escape 0, data-id 필수.

### 정서
- 최근 50커밋: feat 48% / refactor 26% / fix 8% — "수렴", "통일", "SRP 분리"가 키워드.
- 모바일 별도 라우트 → 통합 라우트 (`mobile.tsx` 삭제).
- ShellSwitch/useShellMode 폐기 → CSS-only 적응으로 이행.
- 합성 위젯(Tabs/Toolbar) → 저수준 primitive 해체.

### 라우트
- **27개 노출** (palette 등록): atlas, catalog, edu-portal-admin 일가, genres 일가, finder/m.finder, markdown, ds-matrix, sidebar-gallery, sound-settings.

---

## 🟡 진행 중 (활발하지만 방향 분명)

- **layout/define* 트리오** — definePage / defineWidget / defineLayout 4월 25-26 신규. 각각 wrapper + validation 수준. registry 관계 다듬는 중.
- **ui/composite** — DataGrid/OrderableList/Menubar/TreeGrid 스캘폴딩. composition-roving(children + useRovingDOM) 계약 정착 중.
- **ui/overlay** — CommandPalette 분리(`5fc5ef9`), scrim 옵션.
- **style/widgets 카탈로그** — control 5 / entity 10 / collection 5 / composite 2 / layout 1 / overlay 3 매핑. shell·grid·sidebar·toolbar는 CSS만 존재.
- **catalog 라우트** (evolution 59 snapshots) — UI 시스템 실험장. 카드 → 프리뷰 pane → 모바일 드로어로 빠른 반복.
- **atlas** (10 snapshots) — 색·반지름·모션 토큰 수렴 진행, "atlas leak 1·2차 수렴" 표현.

---

## 🔴 막힌 것 / 미완

### 코드 막힘
1. **DataGrid 완성도 미보증** — registry 등록만 있고 실제 구현/계약 검증 미확인.
2. **ui/layout 분류 모호** — INVARIANTS.md는 "page 레벨은 ds/layout 흡수, 부품은 일시"라 했는데 ui/layout/ 7개(Row/Column/Grid/Separator/BarChart/Top10List/Carousel) 그대로 남음.
3. **style/widgets/layout.ts 내용 불명** — 반응형 layout을 CSS로 어떻게 다루는지 아직 응답이 모임.
4. **원칙 감사 자동화 부재** — INVARIANTS.md 체크리스트 6개 항목이 lint/audit로 자동화 안 됨. `vite-plugin-ds-contracts.ts`는 참고만, 주기적 실행 없음. 신규 `scripts/audit-ds-css.ts`, `scripts/verify-css-guard.mjs`가 보이는데 wiring 미확인.

### 회귀 신호 (시간축)
- **genres-chat (22 snapshots)** — 버블 → 좌우 정렬 → 모바일 popover 반복 재설계. 정착 못함.
- **edu-portal-admin (15 snapshots)** — 모바일 라우트 → 컨트롤 높이 통일 → 글래스 → 컴팩트 topbar. 같은 곳을 계속 다시 만짐.

### 라우트 막힘
- **부모 라우트 6개 palette 미등록** — index, genres, edu-portal-admin (+ index/videos/$id.edit). 랜딩·인덱스가 비어 있음.
- **`edu-portal-admin.videos.$id.edit`** — 동적 경로 stub. 영상 수정 미구현.
- **`genres/shop/build.tsx:11`** — `@FIXME(srp)` 필터 사이드바 entities가 build에 박혀 있음. filters.tsx 분리 예정 표시.
- **sound-settings Gap** — macOS traffic-lights/Header navigation 미지원, segmented control 없음. Header+Button / Tabs 우회 중 → 부족한 ui/ 부품 신호.

---

## 평가자 코멘트 (회의주의)

- "잘 됨" 8할은 **2026-04 3주간 재수렴의 결과**다. 그 전에는 같은 곳이 🔴였다는 얘기. 회귀가 다시 일어날 가능성을 자동화로 막아야 한다(audit 미완이 가장 큰 부채).
- DataGrid·composite의 "스캘폴딩 완료"는 자평. **계약 검증 통과** 전엔 🟡로도 후한 평가일 수 있음.
- catalog 59 snapshots는 "활발" 보다 **"실험장이 끝나지 않음"** 신호일 수도. 언제 catalog를 닫고 정상 라우트로 만들지 결정 필요.
- 부모 라우트 palette 누락은 단순 누락이 아니라 **"앱의 시작 화면이 정의되지 않음"** 일 수 있음.

---

## 다음 후보 (메인이 결정)

| 후보 | 이유 | 비용 |
|------|------|------|
| audit 자동화 wiring | 회귀의 근본 차단. 부채 1순위 | 중 |
| ui/layout 분류 결정 | INVARIANTS와 코드 불일치 해소 | 소 |
| DataGrid 계약 검증 | composite-roving 첫 사례 굳히기 | 중 |
| genres-chat 한 번에 닫기 | 22번 진동 — /reframe 후보 | 중 |
| 부모 라우트 랜딩 정의 | 앱 시작점 채우기 | 소 |
| sound-settings Gap 부품화 | Header navigation / segmented | 중 |

---

조사: 2026-04-26 / 병렬 3 Explore 에이전트 + 통합 평가.
