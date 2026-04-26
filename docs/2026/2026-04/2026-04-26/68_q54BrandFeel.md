---
id: q54BrandFeel
type: inbox
slug: q54BrandFeel
title: Q54 — 데이터로 환원 안 되는 디자인 가치는 어디로
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q54 — 데이터로 환원 안 되는 디자인 가치는 어디로

## 질문

분위기(mood), 브랜드 느낌(brand feel), "왠지 좋은 느낌" — 디자이너가 손에 잡히지 않게 만드는 가치는 ds 안에서 어떻게 표현되나? 데이터로 환원 안 되면 정본이 못 되니, 그냥 사라지는 건가?

## 해보니까 알게 된 것

이건 솔직히 ds의 가장 약한 자리다.

먼저 분해해 보자. "brand feel"은 신비한 단일체가 아니라 **여러 측정 가능한 결정의 누적**이다.

- 색상 관계 (primary·secondary·gray scale·tone curve)
- 타이포 (서체 선택·weight·tracking·line-height·scale ratio)
- 모양 (radius·border·shadow elevation curve)
- 간격 (spacing scale·density)
- 모션 (easing·duration·stagger)
- 레이아웃 (density·whitespace 비율·alignment 일관성)
- 마이크로카피 (어조·길이·격식)

각 항목은 데이터로 환원 가능하다. 즉 brand feel은 **측정 가능한 결정의 조합 + 그 조합의 일관성**이다. 신비하지 않다.

ds는 이 항목들 대부분을 토큰화한다 (palette·typography·shape·motion·spacing). 따라서 brand feel의 **체계적인 부분은 ds 안에서 산다**.

ds가 못 잡는 것:

- **서체 자체의 정서** — Inter vs Söhne vs Tiempos. 토큰 자리는 있지만 서체의 영혼은 토큰 너머
- **일러스트·사진의 분위기** — payload entity로 들어오는 시각 자산
- **마이크로카피의 목소리** — 데이터로 들어오지만 그 데이터를 누가 짜는가의 문제
- **타이밍·여백의 미묘한 직관** — 토큰화돼 있어도 "어느 토큰을 고르나"는 토큰 밖
- **첫 인상의 게슈탈트** — 부분의 합이 아닌, 전체로서의 인상

내 입장: ds는 brand feel을 **만들어주지** 못한다. 그러나 brand feel을 **유지하게** 도와준다. 디자이너가 토큰을 결정하면, ds는 그 결정이 모든 화면에서 일관되게 적용되도록 강제한다. 즉 ds는 brand feel의 **생성 도구가 아니라 보존 도구**다.

이건 약점이라기보다 역할 분담이다. 디자이너의 핵심 직무는 ds 도입 후에도 살아남는다 — 토큰의 첫 결정, 서체 선택, 일러스트 시스템 정립, 모션 큐레이션. ds는 그 결정을 정본화해서 누수 없이 적용한다.

다만 한 가지는 인정한다. ds why 시리즈는 "결정성·재현성"만 강조하고, 이런 보존 가치는 거의 안 다룬다. 이건 보완이 필요하다.

## 근거

- foundations/typography·color·shape·motion 토큰 — brand feel 항목들이 이미 토큰 자리를 갖고 있음
- "color pair primitives" 메모리 — 색을 surface 소유자가 가지고 item은 mute()/emphasize() — 일관된 색 분위기 보존 메커니즘
- "palette vs foundations 2층" — palette(취향) → foundations(의미) 두 층 분리는 brand feel의 결정 자리와 적용 자리를 나눠둠
- ds가 못 잡는 영역 (서체 영혼·일러스트·마이크로카피)은 모두 **사람의 첫 결정** 영역. 자동화 대상이 아님

## 남은 의문

- "brand feel 일관성"을 자동 검증하는 도구가 ds 안에 있어야 하지 않나 (token drift 감사)
- 서체·일러스트는 entity로 들어오는 payload인데, 그 entity 자체의 큐레이션 책임은 어디에
- 모션 토큰이 현재 가장 빈약하다 — brand feel에서 모션이 차지하는 비중을 따라잡아야
- "생성 도구가 아니라 보존 도구"라는 자기 규정을 헌장에 명시할지 (디자이너에게 ds의 역할을 정직하게 알리는 효과)
