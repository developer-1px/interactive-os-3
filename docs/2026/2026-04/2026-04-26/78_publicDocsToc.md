---
id: publicDocsToc
type: inbox
slug: publicDocsToc
title: 공식 홈페이지 docs 목차 (제안)
tags: [inbox, ia, prd]
created: 2026-04-26
updated: 2026-04-26
---

# 공식 홈페이지 docs 목차 (제안)

## 배경

84개 inbox 문서가 누적됨 (why 시리즈·Q&A 62개·아키텍처·컨셉맵·회고·디자인 think 등). 모두 사고 흔적이지만 외부 독자 기준 절반 이상은 의미가 약하다. 공식 docs 사이트에 노출할 정보 구조(IA)부터 정한다. 이후 단계에서 (1) 각 섹션을 채우고 (2) 외부 독자에게 의미 없는 inbox는 삭제한다.

## 독자 페르소나

| 페르소나 | 첫 5분에 답을 얻고 싶은 것 | 가장 먼저 읽을 곳 |
|---------|-------------------------|------------------|
| **평가자** (DS 도입 검토 시니어 FE) | 이거 우리 팀에 맞나? 기존 시스템과 뭐가 다른가? | 1. Why · 2. Comparison |
| **빌더** (라우트 1개 만들 엔지니어) | 화면 하나 만들려면 뭐부터 봐야 하나? | 4. Getting Started · 5. Components |
| **LLM 통합자** (codegen 도구 빌더) | 어떤 형태로 입력·출력하면 lint 통과하나? | 8. LLM Authoring · 9. Canonical |
| **디자이너** | 토큰·시각 어휘는 어디 있나? Figma와 매핑되나? | 6. Foundations · 7. Patterns |
| **기여자** (PR 올리려는 사람) | 정본 갱신은 어떻게? lint 위반 어떻게 막나? | 9. Canonical · 10. Contributing |

## 목차 (8 + 부록 2)

```
ds — Decision-shrinking Design System
│
├─ 1. Introduction
│   ├─ 1.1 What is ds              (한 줄 정의 + 30초 데모 GIF)
│   ├─ 1.2 Why ds                  (LLM 친화 DS의 필요성, 짧게)
│   └─ 1.3 When NOT to use ds      (적합하지 않은 상황 — 솔직하게)
│
├─ 2. Why — 6편 시리즈
│   ├─ 2.1 Project Why             (전체 why 개관)
│   ├─ 2.2 Classless                (className 금지)
│   ├─ 2.3 No Variant               (1 role = 1 component)
│   ├─ 2.4 Data-Driven              (children 대신 data prop)
│   ├─ 2.5 De Facto Standard        (2곳 수렴 룰)
│   └─ 2.6 Declarative Serialization (메타-원칙)
│
├─ 3. Comparison
│   ├─ 3.1 vs shadcn/ui             (도착점 반대)
│   ├─ 3.2 vs Radix (그대로 쓰면?)   (ds는 그 위 한 층)
│   ├─ 3.3 vs Material 3·Polaris·Carbon (직교 axis)
│   ├─ 3.4 vs Tailwind + shadcn     (LLM 결정성 — 측정 부재 인정)
│   └─ 3.5 vs Storybook · Figma Token (직교 도구)
│
├─ 4. Getting Started
│   ├─ 4.1 Install
│   ├─ 4.2 First Page (definePage)
│   ├─ 4.3 First Widget
│   ├─ 4.4 Hooking Data (useResource + useFlow)
│   └─ 4.5 Verifying with Lint
│
├─ 5. Components
│   ├─ 5.1 Layout primitives (Row · Column · Grid · Split)
│   ├─ 5.2 0-primitive (Prose · CodeBlock)
│   ├─ 5.3 1-indicator
│   ├─ 5.4 2-action
│   ├─ 5.5 3-input
│   ├─ 5.6 4-collection (Listbox · Menu · Tree · Columns · Grid · Table)
│   ├─ 5.7 5-composite (Toolbar · Tabs · Accordion)
│   ├─ 5.8 6-overlay (Dialog · Popover · Tooltip)
│   ├─ 5.9 7-pattern
│   └─ 5.10 8-layout (Split, …)
│
├─ 6. Foundations
│   ├─ 6.1 Tokens — palette · semantic · component (3-tier)
│   ├─ 6.2 Color (pair · semantic · code)
│   ├─ 6.3 Typography (scale · rhythm · heading)
│   ├─ 6.4 Spacing (hierarchy 5단 · proximity)
│   ├─ 6.5 Shape (radius · hairline)
│   ├─ 6.6 Elevation (grouping · shadow)
│   ├─ 6.7 Motion (duration · easing)
│   ├─ 6.8 Iconography
│   ├─ 6.9 State (interactive · selection — ARIA로 셀렉트)
│   └─ 6.10 Recipes (microLabel · holyGrail · masterDetail · …)
│
├─ 7. Patterns (실전 화면)
│   ├─ 7.1 List · Table · Card Grid 3패턴
│   ├─ 7.2 Card primitive + subgrid slots
│   ├─ 7.3 Sidebar (canonical sidebar widget)
│   ├─ 7.4 Master-Detail (Finder pattern)
│   ├─ 7.5 Form
│   └─ 7.6 Empty / Loading / Error
│
├─ 8. LLM Authoring
│   ├─ 8.1 Why this section exists  (모델이 ds 코드를 생성하는 시나리오)
│   ├─ 8.2 Component selection guide (의도 → 컴포넌트 1:1 표)
│   ├─ 8.3 data shape cheatsheet
│   ├─ 8.4 Event union vocabulary
│   ├─ 8.5 Common mistakes lint catches
│   └─ 8.6 Prompt templates (선택)
│
├─ 9. Canonical (정본 헌장)
│   ├─ 9.1 Charter (C1~C6)
│   ├─ 9.2 Devices map (5층 어휘·형태·시각·셀렉터·강제)
│   ├─ 9.3 Lint rules (1:1 매핑표)
│   ├─ 9.4 Update procedure (정본 갱신 절차)
│   └─ 9.5 Temporary · Legacy index
│
├─ 10. Contributing
│   ├─ 10.1 Workflow (PR 3트랙: 통과·일탈·갱신제안)
│   ├─ 10.2 Lint locally
│   ├─ 10.3 Adding a component (de facto 2곳 수렴 검사)
│   ├─ 10.4 RFC for canonical change
│   └─ 10.5 Code of canonical
│
├─ 11. FAQ                         (Q&A 62개에서 외부 의미 있는 것만 발췌)
│   ├─ 11.1 Adoption (Q22 마이그레이션 · Q23 서드파티 · Q33 온보딩)
│   ├─ 11.2 Customization (Q16 마케팅 변형 · Q21 multi-tenant · Q24 Figma sync)
│   ├─ 11.3 Trade-offs (Q15 컴포넌트 폭증 · Q26 이름 폭증 · Q31 프로토타이핑)
│   ├─ 11.4 Comparison nuance (Q9 Radix · Q11 shadcn · Q14 코드 소유)
│   └─ 11.5 Philosophy (Q49 권력 · Q51 LLM·인간 · Q53 표현)
│
└─ 12. Reference
    ├─ 12.1 API (defineFeature · defineFlow · definePage · useResource …)
    ├─ 12.2 Tokens listing
    ├─ 12.3 Component props
    └─ 12.4 ARIA matrix

부록
├─ A. Roadmap
├─ B. Changelog
└─ C. Appendix — 측정·실험 (Q4·Q11·Q46 후속)
```

## 섹션별 inbox 매핑

| 공식 docs 섹션 | 흡수할 inbox | 비고 |
|--------------|------------|------|
| 1.2 Why ds | `08_projectWhy` | 압축 |
| 2.1~2.6 | `08`~`13` 6편 | 거의 그대로 (분량 다듬기) |
| 3.1~3.5 | `22_q08` `23_q09` `24_q10` `25_q11` `26_q12` `27_q13` | Q&A에서 narrative로 재작성 |
| 4 Getting Started | (신규 작성 필요) | inbox에 없음 |
| 5 Components | `74_q60` 라이브러리 후보 + 코드 | 현재 ui/ 폴더 자동 카탈로그 |
| 6 Foundations | `01_hairline-shadow` (04-24) `05_ds-fn-hierarchy-industry` `05_foundation-showcase-patterns` | recipe 포함 |
| 7 Patterns | `06_canonicalNarrowForm` `03_a2ui-layout-adoption` (04-24) | 사용 예제 |
| 8 LLM Authoring | (대부분 신규) | Q&A에서 추출 |
| 9 Canonical | `CANONICAL.md` `06_canonicalNarrowForm` `77_devicesConceptTree` | 합본 |
| 10 Contributing | `55_q41` `58_q44` `59_q45` | 절차 정리 |
| 11 FAQ | Q&A 62개 중 외부 의미 있는 ~25개 | 나머지는 aborted/내부 회고 |
| 12 Reference | (자동 생성 후보) | tsdoc·script |

## 외부 독자에게 무의미할 가능성 ↑ (삭제 후보)

내부 사고 흔적·일회성 회고로 외부 docs에는 안 들어갈 후보:

- 04-24: `02_edu-portal-admin-gaps` `04_edu-portal-admin-gaps-research` (다른 도메인 외부 리서치)
- 04-25: `02_selfConvergingLoopConceptMap` `03_codebaseConceptMap` `06_finderMobileTikTokDesignThink` (내부 사고)
- 04-26: `01_project-status-working-vs-blocked` `02_atlasFnTacitKnowledge` `03_flow-wiring-introduction-retro` (회고)
- 04-26 Q&A 중: 메타·철학 일부 (`56_q42` `61_q47` `64_q50` `65_q51` `66_q52` 등 — 외부 docs보다는 essay)
- 04-26 Q&A 중: 측정 부재 자인하는 것들 (`16_q02` `17_q03` `18_q04` `25_q11` 등 — Appendix C로만)

총 ~30~40개가 삭제 또는 archive 후보. 실제 삭제는 다음 단계에서 1개씩 확인 후 결정.

## 다음 행동

1. 위 목차에 사용자 합의 받기 (수정·재배치 가능)
2. 합의된 후 섹션별로 합본 작성 시작 (병렬 에이전트 분담)
3. 작성 끝난 inbox는 archive 폴더로 이동 (삭제 대신 4-archive/로)
4. 의미 없는 일회성 inbox는 삭제 (또는 4-archive/dead/)
