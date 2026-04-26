---
id: q31PrototypingSpeed
type: inbox
slug: q31PrototypingSpeed
title: Q31 — escape hatch 0개면 프로토타이핑 속도가 떨어지지 않나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q31 — escape hatch 0개면 프로토타이핑 속도가 떨어지지 않나?

## 질문

escape hatch 0개 → "잠깐만 빨리" 코드가 불가능. 프로토타이핑 속도는 떨어지지 않나?

## 해보니까 알게 된 것

처음에는 떨어진다. 익숙해지면 더 빨라진다. 이유는 escape hatch가 만드는 *판단 비용*이 사라지기 때문이다.

raw `role="button"`을 허용하면 매번 "여기서 컴포넌트 만들까, 그냥 div+role 박을까"를 결정해야 한다. 이 판단이 모든 라인마다 발생한다. ds는 그 판단을 0회로 만든다 — 항상 ds/ui 컴포넌트를 쓴다, 끝.

LLM 관점에서는 결정적이다. escape hatch가 있는 시스템에서 LLM은 매번 "정도(正道)로 갈까 빠른 길로 갈까"를 분포에서 뽑아야 한다. 결과: 한 코드베이스 안에 두 가지 표현이 공존하고, 다음 LLM이 그걸 보고 흔들린다. ds는 분포의 중심을 1곳으로 강제한다.

진짜로 빠른 프로토타이핑이 필요할 때:
1. **시연/카탈로그 라우트**는 raw role 허용이 정본 임시 (showcase route exception)
2. 정본에 없는 role은 일단 ds/ui에 컴포넌트로 만들고 쓴다 — "발명"은 비용이 들지만 한 번 발명하면 다음부터는 0초

오히려 escape hatch 시스템에서 진짜 손해는 "잠깐만 빨리" 코드가 절대 정리되지 않고 6개월 후에 그게 패턴이 되는 것이다. ds는 임시·유산을 명시적 분류로 두고 만료 조건을 박아서 이걸 막는다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:81 — "escape hatch: raw role='...' 0개"
- /Users/user/Desktop/ds/CANONICAL.md:55 — "임시: 시연/카탈로그 라우트 본문의 raw role"
- feedback_no_escape_hatches — `as` prop은 최후 수단
- feedback_showcase_route_role_exception — /content 카탈로그 본문 예외

## 남은 의문

- 신입이 정본에 없는 role을 발명할 권한이 있나, 아니면 항상 합의 절차?
- "한 번 만들면 0초"가 실제 측정값으로 얼마인지 — 컴포넌트 발명 평균 시간
