---
id: q16MinorVisualVariation
type: inbox
slug: q16MinorVisualVariation
title: Q16 — 마케팅 hero CTA만 살짝 다른 변형은?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q16 — 마케팅 hero CTA만 살짝 다른 변형은?

## 질문

design 마이너 변경(예: 마케팅 페이지 hero CTA만 살짝 다르게)을 어떻게 처리하나?

## 해보니까 알게 된 것

세 가지 갈래 중 하나로 결정한다. **버튼 자체에 prop을 더하는 길은 없다.**

1. **surface로 흡수** — hero 영역이 자기 surface(=자기 색·자기 hierarchy level)을 가지면, 그 안의 button은 hero surface가 결정한 emphasis를 자동으로 받는다. CTA가 "더 강해 보이는" 이유는 hero surface가 elevated · brand pair을 들고 있어서지, button이 variant를 받아서가 아니다.
2. **새 role 발명** — 진짜 의미가 다르면(예: "primary marketing CTA" vs 일반 "submit") 새 컴포넌트를 만든다. doubt 스킬을 먼저 통과해야 하고, de facto 수렴 2곳이 없으면 임시 분류로만 살아 있는다(CANONICAL C6).
3. **레시피 재조합** — `foundations/recipes/`에 hero CTA에 어울리는 토큰 묶음을 정의한다. 컴포넌트가 아닌 토큰 레벨에서 "마케팅 강조"를 표현. recipes는 직렬화된 토큰 매핑이라 정본 필터 통과.

실전에서는 1번이 압도적으로 자주 답이다. "hero CTA가 다르다"고 느끼는 본질은 button이 아니라 그것이 놓인 영역이 다르다는 것이다(10_whyNoVariant 4절: 결정 위치를 옮긴다).

2번은 비싸지만 가능하다 — `DangerAction`이 그렇게 태어났다. 표준에 없지만 ds가 정의했고 이름이 어휘가 됐다.

## 근거

- /Users/user/Desktop/ds/src/ds/foundations/color/pair.ts — surface별 색 1쌍
- /Users/user/Desktop/ds/src/ds/foundations/recipes/ — recipe 묶음 패턴
- /Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md:60-67 (4절. surface 소유자 책임)
- /Users/user/Desktop/ds/CANONICAL.md:58 (color weight·opacity. surface 소유자만 색 보유)

## 남은 의문

- 마케팅 라우트가 ds 내부 라우트로 들어왔을 때 hero surface를 정의하는 정본 위치(`8-layout/`? `7-pattern/`? domain 패키지?)가 아직 합의 안 됨
- recipe 레벨에서 정의한 "marketing emphasis"가 결국 variant prop의 다른 형태로 미끄러질 위험 — recipe 이름 폭증을 막는 룰이 없다
