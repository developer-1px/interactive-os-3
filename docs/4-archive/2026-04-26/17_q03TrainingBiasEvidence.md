---
id: q03TrainingBiasEvidence
type: inbox
slug: q03TrainingBiasEvidence
title: Q3 — 학습 분포 편향 단언 근거는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q3 — 학습 분포 편향 단언 근거는?

## 질문

학습 분포가 편향됐다고 단언하는 근거는? Anthropic·OpenAI 모델이 같은 분포를 학습했다고 어떻게 아나?

## 해보니까 알게 된 것

**단언 못한다.** ds why 시리즈가 "학습 분포가 편향됐다"는 식으로 강하게 쓴 부분이 있다면 그건 과장이다. 실제 우리가 아는 건 약한 형태의 두 사실뿐이다.

**1. Anthropic·OpenAI는 학습 데이터를 공개하지 않는다**

GPT-4·Claude의 학습 corpus는 공식적으로 공개돼 있지 않다. "같은 분포를 학습했다"고 단언할 근거는 없다. 다만 두 모델 모두 GitHub 공개 코드·Stack Overflow·MDN을 포함했을 가능성이 매우 높다는 게 업계 통념이다. 그 결과 **두 모델이 비슷한 React/Tailwind/MUI 표현을 익숙하게 다룬다**는 건 사용자 경험상 관찰된다. 분포 동일성이 아니라 **분포 교집합이 크다**가 정확한 표현이다.

**2. de facto 채택 기준은 모델 분포의 proxy**

ds의 "Radix·Ariakit·RAC·Base 중 2곳 이상 수렴" 기준 (CANONICAL.md "네이밍·구조" 섹션, packages/ds/src/ 컴포넌트 명명)은 사실 학습 분포에 대한 **간접 베팅**이다. 이 라이브러리들은 npm download가 많고 GitHub stars가 많다 → 학습 corpus에 자주 등장했을 확률이 높다 → 모델이 그 어휘를 안정적으로 호출한다. 이건 단언이 아니라 **휴리스틱**이다. de facto 라이브러리 4개라는 숫자도 임의(arbitrary)다 — Headless UI·Reach UI는 왜 빠졌나 (Q60)에 깔끔한 답이 없다.

**3. 본 프로젝트에서 본 일화 증거**

세션 로그상 "Trigger" 같은 ds 어휘는 모델이 첫 시도에 거의 정확히 호출한다 (Radix 어휘). 반대로 "GroupLabel" 같은 비교적 덜 표준화된 어휘는 가끔 "Label" "GroupHeader" 등으로 흔들린다. 이게 **학습 분포 두께의 차이를 시사**하지만 확정 못한다 — 모델 내부 표현을 들여다본 게 아니라 출력만 본 것이라.

**그럼 ds why 시리즈는 어떻게 보정해야 하나**

"학습 분포가 편향됐다" → "**우리는 모델 학습 분포를 모른다. 그래서 가장 안전한 베팅은 npm·GitHub에서 두꺼운 라이브러리의 어휘를 따르는 것이다**"로 약화하는 게 정직하다. ds의 P5 (de facto standard 우선)는 "편향에 맞춘다"가 아니라 **"편향이 어디인지 모르므로 통계적으로 두꺼운 곳을 택한다"** 가 맞다.

## 근거 (코드/문서 인용)

- `/Users/user/Desktop/ds/CANONICAL.md:79` — "Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택" — de facto 채택 기준
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:37` — "P5 De facto standard 우선 — LLM 학습 분포에 이미 존재하는 형태" — 본 프로젝트에서 학습 분포에 대해 가장 강한 단언이 있는 줄. 약화 후보.
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md` (참조 — 같은 라인 강도 검토 필요)

## 남은 의문

- 모델 사로 학습 분포를 추정하는 더 직접적 방법(예: 같은 어휘의 logit 비교)이 가능한지 미조사
- 4개 라이브러리(Radix/Base/Ariakit/RAC) 외 후보 라이브러리(Headless UI·Reach UI·Mantine)를 명시적으로 기각한 근거가 코드에 없다 — 의사결정 흔적 부재
- "분포가 두꺼운 어휘 = 결정성 높음"이 정말 성립하는지 — 두껍지만 변형도 많은 어휘(예: Tailwind class명)는 오히려 결정성을 떨어뜨릴 수 있다
