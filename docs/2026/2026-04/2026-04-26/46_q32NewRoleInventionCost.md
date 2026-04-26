---
id: q32NewRoleInventionCost
type: inbox
slug: q32NewRoleInventionCost
title: Q32 — 1 role = 1 component면 새 role 발명 비용은?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q32 — 1 role = 1 component면 새 role 발명 비용은?

## 질문

1 role = 1 component → 같은 의미·다른 시각이 진짜 필요할 때 새 role을 발명해야 한다. 발명 비용은?

## 해보니까 알게 된 것

먼저 짚자: ds에서 "역할(role)"은 ARIA role이 1차이고, ARIA가 못 잡는 ds 고유 어휘(`SearchBox·CommandPalette·CodeBlock·Prose·ContractCard`)가 2차다. 새 role 발명은 2차 영역에서만 일어난다 — ARIA role은 W3C가 닫힌 집합으로 정의해서 발명할 일이 없다.

발명 비용 항목:
1. **이름 합의** — Radix·Base·Ariakit·RAC 중 2곳 수렴이 있으면 거의 자동, 없으면 토론
2. **위치 결정** — ui/0-primitive ~ 8-layout 중 어느 층, 또는 parts/, 또는 widget인지 (content vs control 분리)
3. **데이터 인터페이스 설계** — ControlProps 모양, dispatch event 종류
4. **catalog 등록** — /content 카탈로그 라우트에 시연

해보니 1·3이 주 비용이고 4는 거의 자동이다. 1번은 de facto 표준 채택 정본 덕에 보통 30분 내 끝난다 — 2곳 수렴이 없으면 발명을 보류하고 임시 표현으로 처리.

진짜 비싼 건 "사용처 1곳이어도 entity 승격" 정본을 따를 때다 — `ContractCard` 같은 widget이 실제 1곳에서만 쓰이지만 entity로 올린다. 처음에는 과해 보이지만 6개월 지나면 다 쓸모를 찾는다 (또는 정본 묘비로 가서 cohesion 감사 때 정리).

발명을 *어렵게* 한 건 의도다. 발명 진입 장벽이 낮으면 어휘가 분기하고, 분기는 LLM 결정성을 깬다. 비용은 어휘 안정성의 보험료다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:79 — "Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택"
- /Users/user/Desktop/ds/CANONICAL.md:50 — "사용처 1곳이어도 entity 승격"
- feedback_minimize_choices_for_llm — 1 role = 1 component
- /Users/user/Desktop/ds/packages/ds/src/ui/ — 9층 분류

## 남은 의문

- 발명 묘비(쓰이지 않는 entity)가 정본 어휘를 오염시키는가 (Q38과 연결)
- 2곳 수렴 부재 시 보류 정책 — 임시 표현 안에서 살다가 영원히 사는 케이스
