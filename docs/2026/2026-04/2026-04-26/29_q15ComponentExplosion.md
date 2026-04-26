---
id: q15ComponentExplosion
type: inbox
slug: q15ComponentExplosion
title: Q15 — variant 0개·1 role = 1 component이면 컴포넌트 수가 폭발하지 않나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q15 — variant 0개·1 role = 1 component이면 컴포넌트 수가 폭발하지 않나?

## 질문

variant 0개·1 role = 1 component이면 컴포넌트 수가 폭발하지 않나? 몇 개까지 늘어나나?

## 해보니까 알게 된 것

폭발하지 않는다. 막상 ds를 쓰면서 실제로 ui/ 폴더에 쌓인 role 수는 **수십 개 단위**에서 자연 수렴한다. variant N개를 가진 1 컴포넌트가 N개 컴포넌트로 풀리는 게 아니라, **ARIA role 어휘 자체가 유한**하기 때문이다. ds/ui/ 폴더는 ARIA pattern + de facto 수렴(Radix·Ariakit·RAC) 교집합으로만 채워진다.

실제 분포를 보면:
- `0-primitive/` — 3개 (Prose, CodeBlock, Link)
- `1-indicator` ~ `7-pattern` — 카테고리당 5~15개
- `8-layout/` — 5개 (Row, Column, Grid, Split, Carousel)

variant로 풀어 적으면 "Button × 5 variant × 3 size × 2 emphasis = 30가지 출력"이 되지만, ds에서는 그 30가지가 **컴포넌트 30개**가 아니다. 시각 차이는 surface 위계(`atom < section < surface < shell`)로, 강조는 `mute()`/`emphasize()`로 흡수된다. 결국 컴포넌트는 "ARIA role의 수"에 가깝게 수렴한다 — Button, SubmitAction, DangerAction, IconButton, MenuItemRadio처럼 의미가 진짜 다른 경우만 이름을 가진다.

content 부품은 다른 축이다 — `parts/` 폴더에는 Avatar·Badge·Card·Tag 등 18개가 있는데, 이것은 "비즈니스 콘텐츠 어휘"이지 role이 아니다. role과 part는 직교한다.

폭발은 **doubt 스킬 통과 못한 합성 컴포넌트**에서만 생긴다. "사용처 1곳도 entity 승격" 원칙(C 메모리)이 한쪽으로 압력을 주지만 동시에 doubt(존재·적합·분량·효율) 필터가 반대 압력을 준다. 이 둘의 균형이 실제 폭발을 막는다.

## 근거

- /Users/user/Desktop/ds/packages/ds/src/ui/ — 8개 layer × 평균 8개 ≈ 60개 수준
- /Users/user/Desktop/ds/packages/ds/src/parts/index.ts — 18개 content part
- /Users/user/Desktop/ds/CANONICAL.md:79 (Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택)
- /Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md:69-82 (이름이 어휘가 된다)

## 남은 의문

- 큰 도메인(예: 캘린더·차트)이 들어오면 ui/에서 그것을 흡수해야 하나, parts/로 가야 하나, 도메인 패키지(`@p/domain-*`)로 가야 하나의 경계가 아직 코드에 명시 안 됨
- 60개가 100개·200개로 늘어났을 때 LLM이 이름을 잘못 부르는 빈도 변곡점이 어디인지는 측정 안 해봄
