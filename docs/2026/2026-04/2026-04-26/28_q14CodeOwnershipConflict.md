---
id: q14CodeOwnershipConflict
type: inbox
slug: q14CodeOwnershipConflict
title: Q14 — shadcn-style 코드 소유 모델이 ds와 충돌?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q14 — shadcn처럼 사용자가 컴포넌트 코드를 소유하는 모델이 ds와 충돌하나?

## 질문

shadcn처럼 사용자가 컴포넌트 코드를 소유하는 모델이 ds와 충돌하나?

## 해보니까 알게 된 것

소유 모델 자체는 충돌하지 않는다 — ds도 사용자 레포에 코드가 들어 있다 (`src/ds/ui/`). 충돌하는 것은 "소유했으니 자유롭게 변형하라"는 **소유의 함의**다.

shadcn의 소유 함의:
- 컴포넌트 소스는 사용자 코드다 → 사용자가 패치·variant 추가·className 확장을 자유롭게 한다
- "프레임워크의 의견을 빌려 시작하되 결국 너의 시스템으로 진화시켜라"
- 그래서 cva variant·Tailwind class를 코드 안에 직접 만지는 게 권장 사용법이다

ds의 소유 함의:
- 컴포넌트 소스는 사용자 레포에 있지만 **정본**이다 — `packages/ds`는 워크스페이스 패키지로 분리(CANONICAL.md:69)
- 변형은 정본 갱신 절차로만 (CANONICAL.md:92-97). 1인 합의·Phase 1 회귀·매뉴얼 1행 갱신
- 변형이 정본화되지 않으면 임시·유산으로 분류

두 모델 모두 "벤더 락인 거부"라는 점에서 같지만, 락인 거부의 이유가 다르다. shadcn은 "사용자의 자유를 위해", ds는 "정본을 사용자가 audit·patch·통제하기 위해". 결과적으로 ds 사용자에게 코드 소유는 권한이라기보다 **책임**이다.

따라서 충돌하는 것:
- shadcn의 "내가 owner니까 cva variant 추가할게" — ds 정본 위반 (P1)
- shadcn의 "Tailwind class로 살짝 다르게" — ds 정본 위반 (P2 classless)
- shadcn의 "이 컴포넌트는 내 프로젝트 specific" — ds의 "사용처 1곳도 entity 승격, 정본은 공용" (CANONICAL.md:50)과 마찰

충돌하지 않는 것:
- "코드가 사용자 레포에 있다"는 모델 자체
- "벤더 버전 강제 업그레이드 없음"
- "코드 audit·debug 가능"

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:69` — `@p/ds` 워크스페이스 패키지 분리
- `/Users/user/Desktop/ds/CANONICAL.md:92-97` — 정본 갱신 절차
- `/Users/user/Desktop/ds/CANONICAL.md:50` — 사용처 1곳 entity 승격
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/22_q08ShadcnDiff.md` — Q8 비교

## 남은 의문

- 정본 갱신 권한자가 누구인지(Q41·Q49)에 따라 "소유=책임"의 무게가 달라진다. 1인 합의 모델이면 다른 사용자에게는 사실상 락인이다.
- 오픈소스로 ds를 풀었을 때 외부 contributor의 PR이 정본을 흔드는 문제(Q45)와 같은 축의 질문.
