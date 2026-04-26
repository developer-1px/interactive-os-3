---
id: q55DataPartVsClassName
type: inbox
slug: q55DataPartVsClassName
title: Q55 — data-part가 결국 className의 다른 이름 아닌가?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q55 — data-part가 결국 className의 다른 이름 아닌가?

## 질문

`<article data-part="card">`는 결국 `<article class="card">`와 무엇이 다른가? 토큰을 그대로 두고 attribute 이름만 바꾼 것 아닌가? "classless"라고 부르려면 정말 셀렉터 1개 줄어드는 효과가 있어야 한다.

## 해보니까 알게 된 것

본질 차이는 두 가지다. **(1) 누가 부여하는가**, **(2) 무엇을 가리키는가**.

- `className`은 호출자가 자유롭게 붙인다 — `<article className="card hero featured-2 mb-4">`. 같은 카드에 사용처마다 다른 이름이 붙고, 스타일·레이아웃·상태·variant가 한 문자열에 섞인다.
- `data-part`는 컴포넌트 root가 박아 넣는다 — 호출자가 못 넣는다. `data-part="card"`는 **DS 부품 카탈로그의 ID**다. 1 component = 1 data-part. 호출자가 늘릴 수 없으니 셀렉터 어휘 폭발이 구조적으로 막힌다.
- 상태/variant는 어차피 ARIA로 표현된다. `aria-current`, `aria-selected`, `aria-expanded`가 상태 슬롯이고 `data-part`는 부품 슬롯이다. 둘이 직교한다.

CANONICAL.md 26-27행이 명문화했다 — "셀렉터 어휘: tag + role + aria + data-part", "data-part는 content 부품 어휘 (src/ds/parts/)". `src/ds/parts/Card.tsx:28` 에서 root가 `data-part="card"`를 직접 박는다. 호출자에게 className prop을 받지 않는다.

즉 className은 "스타일을 거는 임의 hook"이고 data-part는 "부품 카탈로그의 정본 namespace"다. 표면상 attribute 1개의 이름 차이지만, **누가 통제권을 갖는가**가 반대다.

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:55-56` — 셀렉터 어휘 정본 / data-part = parts/ 어휘
- `/Users/user/Desktop/ds/src/ds/parts/Card.tsx:11,28` — root가 박는 namespace
- `/Users/user/Desktop/ds/src/ds/parts/Badge.tsx:24` — 동일 패턴
- 메모리: `data-ds는 layout primitive 전용` — `data-ds`는 Row/Column/Grid만, `data-part`는 content 부품만. namespace를 둘로 쪼개 의미를 분리한 것 자체가 className과 다른 점

## 남은 의문

- `data-part` 값이 100개 넘어가면 그 자체가 어휘 폭발 아닌가 (Q26과 연결)
- 시연/카탈로그 라우트의 raw role 예외처럼, `data-part`도 widget 카탈로그에서 노출이 필요한가
- aria-roledescription 금지 메모리와 같은 함정 — `data-part`가 보조기기에 노출되지 않는다는 점은 className과 같음. ARIA 의미 왜곡이 없다는 게 추가 이점
