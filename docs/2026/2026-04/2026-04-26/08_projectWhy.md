---
id: projectWhy
type: inbox
slug: projectWhy
title: ds 프로젝트 — Why (존재 이유)
tags: [inbox, vision, explain]
created: 2026-04-26
updated: 2026-04-26
---

# ds 프로젝트 — Why (존재 이유)

## 배경

LLM이 UI 코드를 생성하는 시대에 기존 디자인 시스템(MUI·Chakra·Ant)은 사람을 위한 자유도(variant·prop 폭증·className 자유·escape hatch)를 그대로 둔 채 추상화만 더했다. 그 결과 LLM은 매번 "그럴듯하지만 일관되지 않은" 코드를 생성하고, 사람은 그것을 일일이 정정해야 한다. ds는 **LLM이 생성해도 사람이 짠 것과 동일한 결과로 수렴하는 디자인 시스템**을 목표로 한다.

## 내용

### 1. Why — 풀려는 문제

#### 1.1 LLM-friendly가 아닌 디자인 시스템의 한계
- **선택지 폭증**: `<Button variant="contained" color="primary" size="large" startIcon={...} sx={{...}}>` — LLM은 매번 다른 조합을 고른다.
- **자유도 = 비결정성**: `className`·`sx`·`as` prop이 열려있으면 LLM은 동일 의도를 100가지 형태로 표현한다.
- **escape hatch의 누적**: 한 번 raw `role="..."`이 허용되면 시연 코드·예제·실서비스가 모두 그 형태로 미끄러진다.

#### 1.2 사람을 위한 추상화 ≠ 모델을 위한 추상화
사람은 variant prop을 보고 "아, 종류가 있구나" 직관한다. LLM은 variant 목록 전체를 토큰으로 들이마셔 매번 다르게 조합한다. 사람에게 친절한 추상화가 모델에게는 결정 불능 지대가 된다.

### 2. 핵심 원칙 — 어떻게 푸는가

| # | 원칙 | LLM 관점에서의 의미 |
|---|------|---------------------|
| P1 | **1 role = 1 component, variant 금지** | 선택지가 1개면 잘못 고를 수 없다 |
| P2 | **Classless — tag + role + aria + data-part** | 셀렉터 = 의미. 스타일 전용 이름이 없으니 작명 자유도가 0 |
| P3 | **Data-driven rendering (`data, onEvent`)** | children JSX 자유 조립 금지. 입력 형태가 1개로 고정 |
| P4 | **No escape hatches** | raw role·`as` prop·임의 className 0개. 빠져나갈 길이 없으면 정도(正道)로 수렴한다 |
| P5 | **De facto standard 우선** | Radix·Ariakit·RAC 등 2곳 이상 수렴 패턴만 채택. LLM 학습 분포에 이미 존재하는 형태 |
| P6 | **Extreme Declarative Serialization** | 모든 정본은 데이터로 직렬화 가능. JSON round-trip 가능한 표현만 정본 |

### 3. 직렬화 가능성 (C2)이 왜 중요한가

LLM이 생성하는 것은 결국 토큰 시퀀스다. 명령형 절차(`useEffect`, `ref.current.scrollTo`)는 토큰화된 형태로는 검증할 수 없다. 데이터(`{type:'navigate', target:'next'}`)는 다음을 가능케 한다.

- **시간 가로지르기**: 저장·복원
- **공간 가로지르기**: 이관·공유·diff
- **도구 가로지르기**: 정적 검증·자동 생성·테스트

따라서 ds는 모든 정본 형태를 "JSON으로 표현 가능한가"로 1차 필터한다. 못 만족하면 정본이 될 수 없다 (CANONICAL.md C2).

### 4. 결과로서의 아키텍처

- **definePage entities tree**: 레이아웃을 JSX 조립이 아닌 데이터 트리로 선언 → LLM은 트리 노드만 채우면 된다
- **useResource (value, dispatch(event))**: 데이터 read/write 인터페이스 1개. 종류별 훅 0개
- **defineFlow + useFlow**: ui ↔ resource wiring 1조각·한 줄. 이벤트 라우팅을 widget이 알지 못한다
- **gesture/intent 분리**: ui/는 activate 단발 emit, navigate/expand 도출은 ds/core/gesture로 격리 → 컴포넌트 내부 onKeyDown 분기 0개
- **palette → foundations 2층 토큰**: widget은 semantic만 import. raw scale 직접 참조 0개

### 5. 무엇을 포기했는가

- **소비자 자유도**: variant·className·as prop의 자유는 의도적으로 차단된다
- **단기 생산성**: "그냥 inline style로 5분 만에 끝내자"가 불가능하다 — 정본을 먼저 정의해야 한다
- **시각적 다양성**: 1 role = 1 component이므로 같은 역할은 같은 모습이다 (변형은 surface 소유자가 weight·opacity로만)

이 포기는 **LLM·사람·도구가 같은 표현으로 수렴**하는 대가로 받는 것이다.

### 6. ds라는 이름의 함의

`ds` = design system이지만, 이 프로젝트에서는 **decision-shrinking system**으로 읽어야 한다. 모든 정본 갱신의 평가 기준은 "선택지가 줄어드는가"다.

## 다음 행동

- 후속 문서: `whyClassless.md`, `whyNoVariant.md`, `whyDataDriven.md` — 각 원칙별로 반례·대안·기각 사유를 별도 분리
- CANONICAL.md 헌장에 "C7: LLM 결정 가능성" 추가 검토 (선언적·직렬화에 더해 "동일 의도 → 동일 출력 분포" 명문화)
