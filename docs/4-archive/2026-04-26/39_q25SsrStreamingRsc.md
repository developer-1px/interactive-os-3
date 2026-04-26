---
id: q25SsrStreamingRsc
type: inbox
slug: q25SsrStreamingRsc
title: Q25 — SSR·streaming·RSC 환경에서 정본 그대로?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q25 — SSR·streaming·RSC 환경에서 정본 그대로?

## 질문

SSR·streaming·React Server Component 환경에서 정본은 그대로인가?

## 해보니까 알게 된 것

**ds 코드베이스는 현재 CSR(Vite + TanStack Router)이다.** SSR·RSC는 안 돌려봤다. 원칙 차원의 답만 적는다.

### 정본이 그대로 통할 가능성이 높은 이유

ds 정본은 **직렬화 가능 + 선언적**이 메타-필터다. SSR·RSC가 본질적으로 요구하는 것도 같다 — 서버에서 직렬화한 data가 클라이언트로 hydration된다. ds 정본은 이미 그 형태에 맞춰져 있다:

- **definePage entities tree** — 서버에서 트리만 그려서 보내면 끝. JSX 함수 prop 없음.
- **useResource (value, dispatch)** — value는 직렬화 가능. RSC에서 서버 컴포넌트가 value 생성 → 클라이언트 컴포넌트가 dispatch 받음. 자연스러운 분할.
- **컴포넌트 children에 비즈니스 콘텐츠 JSX 금지(C1)** — RSC에서 가장 골치 아픈 "이게 server인가 client인가" 분기 자체가 ds에서는 entity data로 풀려 있다.
- **상태는 직렬화 가능(C2)** — DOM ref·함수·Promise 보관 금지 → SSR hydration mismatch 원천 차단.
- **useMemo·useCallback 추방** — RSC 친화적.

### 부딪힐 가능성이 있는 부분

- **ds/core가 self-attach하는 명령형 부작용** (focus·roving·gesture) — 이건 client 전용이다. RSC에서 이 컴포넌트들은 "use client" boundary로 격리될 자리.
- **dispatch(event)의 함수 자체** — 함수는 직렬화 안 되지만, 컴포넌트 prop 경계로만 흐르고 상태에 보관 안 됨. RSC에서 server action으로 자연스럽게 옮길 수 있음.
- **CSS-only 분기 원칙** — SSR에서도 그대로 통함. JS matchMedia 의존이 없어서 hydration 안전.

### 솔직히 모르는 것

- streaming Suspense boundary를 ds 어휘 어디로 흡수할지 — `useResource`가 Promise 친화적이긴 한데 본격 구현 안 됨
- @p/app boot가 SSR entry를 가질 수 있는 구조인지, plugin manifest 합산이 server·client 양쪽 OK인지 미검증

### 결론

"정본 그대로"가 가능성으로는 높지만, 검증되진 않았다. ds가 SSR을 고려해서 설계되었다기보다, **직렬화 필터가 우연히 SSR 친화적**인 형태를 만들어냈다는 게 정확하다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:20-21 (C1·C2 직렬화 필터)
- /Users/user/Desktop/ds/packages/ds/src/core/ (명령형 부작용 격리 layer)
- /Users/user/Desktop/ds/src/main.tsx (현재 CSR 부팅)
- /Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/13_whyDeclarativeSerialization.md:42-66 (4가지 가로지르기 — 시간·공간·도구·LLM)

## 남은 의문

- 실제 RSC 라우트 1개를 만들어 검증 필요 — "use client" boundary가 ds/core 단위로 깔끔하게 떨어지는지
- streaming Suspense + useResource 정합성 — Promise 보관 금지 원칙과 Suspense throw 패턴의 충돌 여부
- SSR 환경에서 plugin manifest 정적 합산(`composeRegistry`)이 그대로 통할지
