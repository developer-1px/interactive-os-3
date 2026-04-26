---
id: q61WhySeriesConsistency
type: inbox
slug: q61WhySeriesConsistency
title: Q61 — why 시리즈 6개 일관성 — "발명 안 함" vs "ds 고유 어휘"?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q61 — why 시리즈 6개 일관성 — 모순? "발명 안 함" vs "ds 고유 어휘"?

## 질문

`12_whyDeFactoStandard`는 "발명하지 않는다, 2곳 수렴 어휘만 채택"이라 한다. 그런데 ds에는 `definePage`, `defineFlow`, `useFlow`, `useResource`, `data-part`, `ControlProps(data, onEvent)`처럼 어디에도 없는 자체 어휘가 가득하다. 모순 아닌가?

## 해보니까 알게 된 것

층을 분리해 보면 모순이 아니다. **"발명 안 함" 룰은 컴포넌트 이름 층에만 적용된다.**

- **컴포넌트 이름 층** — `Trigger`, `GroupLabel`, `TabPanel`, `Listbox` 같은 이름. 여기는 LLM 학습 분포가 두꺼워 발명 비용이 크다 → de facto 2곳 수렴 룰 적용.
- **메타 어휘 층** — `definePage`, `defineFlow`, `data-part` 같은 ds 자체 골격 이름. 이건 컴포넌트가 아니라 컴포넌트들을 **조립하는 메타 framework**다. 같은 자리에 있는 외부 표준이 없다(Radix는 framework가 아니라 컴포넌트 모음).

이 구분은 `12_whyDeFactoStandard.md:24-27`이 암묵적으로 깔고 있다 — "Radix·Ariakit·RAC가 공유하는 어휘"는 컴포넌트 이름이지, "Radix가 어떻게 build되는가의 메타 어휘"가 아니다.

다만 메타 층에서도 ds는 **인접 표준에 어휘를 빌린다**.

- `(data, onEvent)` ← Elm/Redux/MVU의 `(model, dispatch)`. ARIA pattern을 React에 풀어내는 정형.
- `useResource(R) → [value, dispatch]` ← React-Query/Apollo의 hook 시그니처와 React reducer의 합성.
- `define*` 함수 컨벤션 ← TanStack(`createRouter`, `defineConfig`), Pinia(`defineStore`), Vite(`defineConfig`).
- `data-part`만이 비교적 ds 고유 — 그러나 `data-state="open"`(Radix), `data-orientation`(Radix) 같은 selector data attribute 관행의 특수화.

따라서 정확한 룰은: **외부 표준이 있는 자리에서는 발명하지 않는다. 외부 표준이 없는 자리(메타 framework)에서만 인접 어휘를 빌려 최소 발명한다.** 6개 why가 서로 모순 없이 이 룰을 공유한다.

## 근거

- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/12_whyDeFactoStandard.md:21-27` — 컴포넌트 이름 층의 학습 분포 논리
- `/Users/user/Desktop/ds/docs/2026/2026-04/2026-04-26/13_whyDeclarativeSerialization.md` — 메타 어휘(define*, data·onEvent)가 직렬화 원칙에서 유도됨
- `/Users/user/Desktop/ds/src/ds/core/flow.ts:31-35` — `defineFlow` identity wrapper (외부 표준 없는 자리)
- `/Users/user/Desktop/ds/src/ds/layout/definePage.ts:12` — `definePage` identity wrapper

## 남은 의문

- 메타 층의 "최소 발명" 기준이 정본에 명시 안 됨 — Q60처럼 후보 집합 갱신 절차 부재와 같은 결
- `data-part`는 정말 발명인가, 아니면 Radix `data-state` 패턴의 일반화인가 — 후자로 분류하는 정당화 글 필요
- 메타 어휘가 늘면 그 자체가 LLM 결정성을 해친다 — 메타 어휘 inflation 한계는?
