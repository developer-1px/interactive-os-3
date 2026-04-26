---
id: q28DeFactoLag
type: inbox
slug: q28DeFactoLag
title: Q28 — de facto 표준 채택은 ds를 후행하게 만들지 않나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q28 — de facto 표준 채택은 ds를 후행하게 만들지 않나?

## 질문

de facto 표준 채택 → ds가 후행. 새로운 패턴이 나오기 전까지 ds도 못 채택한다는 한계는?

## 해보니까 알게 된 것

맞다, 후행한다. 그게 의도다. 디자인 시스템은 실험장이 아니다 — 안정성·일관성을 파는 자리다.

"Radix·Base·Ariakit·RAC 중 최소 2곳 수렴 시 채택"을 정본으로 박은 이유는, 1곳만 채택한 패턴은 90% 확률로 1년 안에 흔들리기 때문이다. 직접 겪었다 — Radix가 `Trigger`를 굳히기 전 헤드리스 라이브러리들이 `Activator·Anchor·Reference·Trigger`를 다 다르게 썼다. 그때 1곳만 보고 채택했으면 명세 전체를 다시 갈아엎었을 것이다.

후행의 진짜 비용은 "신상 패턴을 못 쓴다"가 아니라 "신상 패턴이 필요한 화면을 정본 외 임시로 만들어야 한다"이다. CANONICAL.md가 *임시*·*유산* 분류를 따로 둔 이유다 — 정본이 못 따라가는 동안 임시는 산다, 단 만료 조건을 명기해야 한다. 무한정 임시는 금지.

후행 전략의 장점도 분명하다. ds는 4개 라이브러리가 도달한 ARIA 패턴의 공통 분모를 흡수하므로, LLM이 학습한 분포의 중심에 위치한다 — 결정성이 자동으로 따라온다. 신상 패턴은 분포의 꼬리에 있어서 LLM이 어차피 못 짠다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:79 — "Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택"
- /Users/user/Desktop/ds/CANONICAL.md:30 — "임시: <만료 조건> · 유산: <마이그레이션 대상>"
- 13_whyDeclarativeSerialization.md — 직렬화 가능성을 우선하면 후행이 비용이 아니라 안전망

## 남은 의문

- 4개 라이브러리가 모두 안 다루는 신생 ARIA pattern (treegrid 다중선택 같은) 채택 정책
- "수렴 시 채택"이 메이저 브랜드 영향권 외 일본·중국·한국 라이브러리에 무지하지 않은가
