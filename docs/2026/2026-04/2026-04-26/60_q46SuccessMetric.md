---
id: q46SuccessMetric
type: inbox
slug: q46SuccessMetric
title: Q46 — ds 성공 지표는? "LLM 코드 = 사람 코드" 어떻게 측정?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q46 — ds 성공 지표는? "LLM 코드 = 사람 코드" 어떻게 측정?

## 질문

ds의 핵심 가설은 "LLM이 짠 코드와 사람이 짠 코드가 구별 불가"다. 이걸 어떻게 측정하나? 수치 없는 가설은 신앙이다.

## 해보니까 알게 된 것

측정 가능한 지표는 4층으로 나뉜다.

### L1 — 정본 lint 통과율 (구조)
- 같은 요구사항을 LLM 5회·사람 5회 구현 → lint(scripts/) 통과율 비교
- 목표: **양쪽 모두 100%**. 차이가 있으면 정본이 LLM에 미적용.
- 가장 측정 쉬움. 이미 도구 있음.

### L2 — 출력 분포 수렴도 (결정성)
- 같은 prompt를 LLM에 N회 → AST 거리 평균
- 같은 명세를 사람 M명에게 → AST 거리 평균
- 목표: **LLM 분산 ≤ 사람 분산**. ds가 효과 있으면 LLM 분산이 사람보다 낮아야 한다(어휘가 좁기 때문).
- 측정 도구: AST diff + import-graph diff. 부분적으로 구현 가능.

### L3 — Blind A/B (구별 불가)
- 코드 샘플을 사람 리뷰어에게 보여 "사람/LLM" 판별 — 정확도 50%면 구별 불가
- ds 도입 전후 정확도 변화가 진짜 지표
- 측정 비용 큼. 외부 평가자 필요.

### L4 — Job 완수율 (효용)
- 같은 사용자 Job을 LLM이 ds 위에서 vs Tailwind+shadcn 위에서 구현 → 완수율·시간·수정 횟수 비교
- 목표: ds 위에서 1-shot 완수율 더 높음
- `/use` 스킬이 이걸 자동화하는 방향

### 부수 지표
- escape hatch(`role="..."` raw, className 자유) 0건 유지율
- variant prop 0건, render prop 0건 유지율
- 정본 갱신 빈도가 안정 곡선(초기 폭증 → 수렴)을 그리는지

### 솔직한 현실
- 현재 ds는 **L1만 측정 중**. L2·L3·L4는 도구 없음.
- "LLM 코드 = 사람 코드" 주장의 증거는 아직 직관 + 사례 + lint 통과. 가설을 가설로 인정하는 게 정직.

## 근거

- scripts/ lint 12종이 L1 자동화 도구 풀
- `/use` 스킬 — L4 자동화의 씨앗
- 메모리 [Minimize choices for LLM] — L2 가설의 출처
- whyDeclarativeSerialization L57 "정적 검증·자동 생성·diff·테스트" — 측정 가능성이 정본 필터 자체

## 남은 의문

- L2 AST 거리 메트릭 도구를 ds에 내장할지(scripts/measure-llm-variance.mjs)
- L3 blind A/B를 외부 베타 테스터로 모집할지
- "사람 분산"의 baseline을 어디서 구하나(공개 코드베이스 샘플?)
- 1-shot 완수율 측정 시 "Job"의 표준 세트가 필요 — Story map의 사용자 스토리를 그대로 쓸지
