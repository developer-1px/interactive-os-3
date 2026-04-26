---
id: q35DeFactoVsPrinciple
type: inbox
slug: q35DeFactoVsPrinciple
title: Q35 — de facto 표준이 ds 원칙과 충돌할 때
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q35 — de facto 표준이 ds 원칙과 충돌할 때

## 질문

모든 라이브러리가 `variant="primary|secondary"`를 쓰는데 ds는 P1(variant 금지)이다. 어디로 가나?

## 해보니까 알게 된 것

- 원칙이 이긴다. **de facto는 어휘(이름·prop 시그니처) 결정자, 헌장(C1~C6)은 형태 결정자.** 둘은 다른 layer다.
- variant라는 prop 이름이 다수라 해서 ds가 variant **prop**을 받지는 않는다. 대신 **각 variant를 독립 컴포넌트로 분해**(`Button` → `PrimaryButton`/`SecondaryButton` 또는 의미 기반 이름)한 뒤, 그 컴포넌트의 *내부* prop 시그니처는 de facto와 맞춘다.
- de facto가 원칙을 위반할 때 우리는 "그 라이브러리들이 풀고 있는 문제"가 무엇이었는지를 거꾸로 묻는다. variant prop의 진짜 효용은 **선택지 그룹화**(런타임 분기 가능)였는데, ds는 이걸 컴파일 타임 컴포넌트 분해로 풀어낸다 — 같은 효용·다른 형태.
- 충돌을 발견하면 그것은 **why 문서의 입력**이다. `whyNoVariant`처럼 "왜 우리는 이 표준을 따르지 않는가"가 정본 부속 문서가 된다.
- 단, 헌장 자체가 흔들리는 빈도 높은 충돌(예: 모든 라이브러리가 직렬화 깨는 패턴으로 수렴)은 헌장 재검토 압력으로 본다 — 그때는 `/conflict`로 전제를 다시 본다.

## 근거

- CANONICAL.md 헌장 C1~C6은 de facto보다 상위.
- MEMORY.md `feedback_minimize_choices_for_llm`: variant 금지는 ds의 핵심 원칙.
- 08_projectWhy / 12_whyDeFactoStandard: de facto는 "표현의 어휘", 헌장은 "표현의 형태".

## 남은 의문

- "어휘는 따르되 형태는 안 따른다"는 분리가 실제로 깔끔한가? prop 이름과 형태가 얽혀있는 케이스(`asChild`, `render` prop)는 어떻게.
- 헌장 재검토 트리거 — "빈도 높은 충돌"의 정량 기준은 없다. 몇 개 라이브러리가, 몇 년 동안, 같은 위반을 해야 압력으로 인정하나.
- 컴파일 타임 분해(컴포넌트 폭증)의 비용을 LLM 결정성 이득이 정말 압도하는지 측정 안 됨 (Q4·Q15와 연결).
