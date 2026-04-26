---
id: q17AbTestVariants
type: inbox
slug: q17AbTestVariants
title: Q17 — A/B 테스트로 두 시각 변형이 필요할 때는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q17 — A/B 테스트로 두 시각 변형이 필요할 때는?

## 질문

A/B 테스트로 두 시각 변형이 필요할 때는?

## 해보니까 알게 된 것

솔직히, 이 케이스는 ds 안에서 **본격적으로 해본 적 없다**. 아래는 원칙에서 도출한 답이다.

A/B는 본질적으로 "런타임에 두 표현 중 하나를 고른다"인데 ds 정본은 "분기는 데이터 룩업"(C3) + "직렬화 가능"(C2)을 요구한다. 따라서 가능한 길:

1. **page entity tree 분기** — `definePage`가 데이터다. variant A/B는 두 개의 entity tree가 되고, A/B 라우터는 `experiment.bucket`을 키로 트리를 골라 Renderer에 넘긴다. 컴포넌트는 한 종류, 트리만 다르다.
2. **token 레이어 분기** — 시각 차이가 색·간격·typography 수준이면 foundations semantic token을 bucket별로 swap. 컴포넌트도 트리도 동일.
3. **페이지 자체 두 라우트** — TanStack file-based 라우팅에 `/landing.a.tsx`·`/landing.b.tsx`를 두고 router가 bucket으로 redirect. 가장 거친 분기지만 가장 정직하다(섞이지 않음).

variant prop으로 푸는 길은 없다. "Button A/B" 같은 컴포넌트 레벨 분기는 ds 어휘에 없다 — A/B는 **사용처(트리)의 차이**이지 부품의 차이가 아니라는 게 ds 입장.

bucket 자체는 직렬화된 string ("a"|"b"|"control")이므로 useResource value에 들어갈 수 있고, definePage 트리 선택 함수는 분기 대신 데이터 map으로 짠다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:21 (C3 분기는 데이터 룩업)
- /Users/user/Desktop/ds/CANONICAL.md:33 (definePage entities tree 정본)
- /Users/user/Desktop/ds/src/ds/foundations/color/semantic.ts (semantic token swap 가능 지점)

## 남은 의문

- 실제로 A/B 실험을 ds 내부에서 돌려본 적이 없다 — bucket 라우팅·메트릭 수집을 어디(@p/app? @p/domain-experiment?)에 두는지 미정
- "페이지 두 라우트"가 코드 중복을 만드는데, definePage tree diff로 표현하는 게 더 정직한지 미해결
