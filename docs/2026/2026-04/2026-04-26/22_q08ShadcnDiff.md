---
id: q08ShadcnDiff
type: inbox
slug: q08ShadcnDiff
title: Q8 — shadcn/ui와 ds의 차이?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q8 — shadcn/ui는 copy-paste 기반인데 ds와 무엇이 다른가?

## 질문

shadcn/ui는 copy-paste 기반인데 ds와 무엇이 다른가?

## 해보니까 알게 된 것

핵심 차이는 "복제 단위"가 아니라 "결정 단위"다. shadcn은 Radix를 wrap한 컴포넌트 소스를 사용자 레포에 떨어뜨리고 그 다음의 모든 결정 — variant·className·composition 형태 — 을 사용자에게 넘긴다. ds는 그 결정 자체를 정본으로 미리 닫아놓는다.

표면적 유사성:
- 둘 다 Radix·Ariakit 등 de facto headless를 base로 본다 (CANONICAL.md 79행 "Radix·Base·Ariakit·RAC 최소 2곳 수렴 시 채택")
- 둘 다 사용자 레포에 코드가 들어간다 (ds는 monorepo `packages/ds`, shadcn은 `components/ui/*`)

실제 다른 것:
1. **shadcn은 variant가 정상**. `cva({variants:{size, variant}})` 패턴이 표준 사용법이다. ds는 P1 "1 role = 1 component, variant 금지" (08_projectWhy.md:33).
2. **shadcn은 className이 인터페이스**. 사용자가 Tailwind class로 자유롭게 변형한다. ds는 C5 "이름이 곧 셀렉터" — 스타일 전용 className 금지 (CANONICAL.md:23).
3. **shadcn의 children은 JSX 자유 조립**. ds는 P3 "Data-driven rendering — `data, onEvent`" (08_projectWhy.md:35).
4. **shadcn은 escape hatch가 풍부** — `asChild`, `as`, `className`. ds는 P4 "No escape hatches" (08_projectWhy.md:36).

즉 shadcn은 "Radix를 사용자 코드로 owning"이지만 owning한 후에 무엇을 하느냐는 자유다. ds는 "owning한 후의 모든 변형을 정본 1개로 수렴"이다. 같은 출발점·반대 도착점.

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:23` — C5 className 금지
- `/Users/user/Desktop/ds/CANONICAL.md:79` — de facto 2곳 수렴
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/08_projectWhy.md:33-37` — P1~P4
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/10_whyNoVariant.md` — variant 금지 why
- `/Users/user/Desktop/ds/src/ds/ui/` — ds 컴포넌트가 사용자 레포에 들어 있는 형태 (shadcn과 동형이지만 정본 강제)

## 남은 의문

- shadcn 사용자가 실제로 variant·className을 얼마나 쓰는지의 분포는 모름. 개인 프로젝트는 ds처럼 빈약하게 쓸 수도 있다.
- "사용자 레포에 들어간다"는 점에서 두 모델은 동형이지만, 정본이 사용자 손에 의해 흔들릴 위험은 ds도 똑같이 있다 (`packages/ds`에서 사용자가 cva를 새로 추가한다면). 이를 구조적으로 막는 메커니즘은 lint·hook 외에 아직 없다.
