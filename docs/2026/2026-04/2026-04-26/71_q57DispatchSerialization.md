---
id: q57DispatchSerialization
type: inbox
slug: q57DispatchSerialization
title: Q57 — useResource dispatch 함수 = 직렬화 불가, C2 위반?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q57 — useResource dispatch 함수 = 직렬화 불가, C2 위반?

## 질문

CANONICAL C2: "상태는 직렬화 가능. 함수·Promise·DOM ref 보관 금지." 그런데 `useResource(R) → [value, dispatch]`에서 `dispatch`는 함수다. 함수를 prop으로 자식에게 넘기면 그 자체가 비-직렬화 값이 된다. C2 위반 아닌가?

## 해보니까 알게 된 것

C2는 **상태(state)** 의 직렬화를 말하는 것이지 **이벤트 채널**의 직렬화가 아니다. 두 층을 구분해야 한다.

- **상태 층** — `value`. JSON 가능해야 한다. `src/ds/data.ts:138` `getEntry(key).value`가 store에 저장되는 값으로 직렬화 round-trip 대상.
- **이벤트 층** — `dispatch(e)`의 `e: ResourceEvent<T>`. `{ type:'set', value }`, `{ type:'patch', partial }`, `{ type:'refetch' }`, `{ type:'invalidate' }` — 모두 데이터 객체다 (`src/ds/data.ts:13-19`). 이게 직렬화 가능해야 한다. **dispatch 함수 자체는 채널이지 상태가 아니다**.

같은 구분이 React redux/elm/Flux 전통에 있다. `store.dispatch`는 함수지만 `action`은 plain object. 직렬화·diff·재생(replay)·time-travel은 action에 대해 일어난다.

ds도 정확히 그 모델이다. 메모리 `defineFlow + useFlow`가 명시: "resource.onEvent가 intent 라우터 흡수" — `e`는 `Event`(plain object), router는 `(e, ctx) => nextValue` 순수 함수에 가깝게 정의된다 (`flow.ts:55`). 함수 prop은 흐르지만, 흐르는 것은 **그 함수가 호출될 때 전달될 직렬화 가능한 event**다.

따라서 C2 위반이 아니다. 위반은 "`useState({ ref: domNode })`" 같은 케이스다 — 값에 함수·DOM이 박힌 경우. dispatch는 useState 값이 아니다.

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:20` — C2: "useState 값은 JSON.stringify 가능해야"
- `/Users/user/Desktop/ds/src/ds/data.ts:13-19` — ResourceEvent = plain discriminated union
- `/Users/user/Desktop/ds/src/ds/data.ts:142-160` — dispatch가 받는 `e`만이 핵심. `entry.value`만 store
- `/Users/user/Desktop/ds/src/ds/core/flow.ts:43,49-58` — useFlow도 동일 패턴: value 직렬화 + event(plain) 흐름

## 남은 의문

- Event payload에 `Date`·`Map`·함수가 끼어들면? — 현재 타입은 이를 막지 않는다. zod 검증 도입 가능
- Time-travel debugging이 정말 가능한가 — middleware phase(`pre-dispatch` 등)에서 event 로그 → 재생 가능성을 실험해본 적 없음
- C2 문구를 "**state 값**은 직렬화 가능"으로 명시화하면 오해 줄 듯
