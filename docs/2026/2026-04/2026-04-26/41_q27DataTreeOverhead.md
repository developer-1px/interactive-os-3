---
id: q27DataTreeOverhead
type: inbox
slug: q27DataTreeOverhead
title: Q27 — children 금지로 data 트리가 폭증하면 메모리·런타임 오버헤드는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q27 — children 금지로 data 트리가 폭증하면 메모리·런타임 오버헤드는?

## 질문

children 금지 → data 트리 폭증. 큰 데이터 트리를 매번 만드는 메모리·런타임 오버헤드는?

## 해보니까 알게 된 것

먼저 사실 확인 — JSX children도 결국 React element 객체 트리다. 메모리 측면에서 "children JSX vs data 객체"는 본질 차이가 없다. JSX `<Button>저장</Button>`이 `{ type: Button, props: { children: '저장' } }`로 디섀가 되는 것과, `{ kind: 'button', label: '저장' }` 데이터를 ui/Button이 받아 React element를 만드는 것의 메모리 비용은 같은 자릿수다.

런타임은 오히려 data-driven 쪽이 안정적이다. children prop은 매 렌더 새 React element를 생성해서 자식 reconcile을 무효화하기 쉬운데, data 객체는 reference equality로 메모이즈가 자연스럽다. resource가 같은 reference를 돌려주면 ui/는 skip한다.

진짜 우려할 만한 곳은 트리의 *깊이*가 아니라 *직렬화 비용*이다 — definePage entities를 매번 만들면 JSON 크기가 커진다. 실제로 finder 쪽에서 200~300 노드 트리는 무리 없이 동작하지만, 1만+ 행 그리드를 트리로 통째 넘기면 죽는다. 그건 children이든 data든 같은 문제고, 해법은 가상화(window) — ui/4-collection의 컬렉션 컴포넌트가 처리한다.

useMemo·useCallback 메모리는 없다. 메모화가 필요한 시점은 SRP가 깨진 신호로 잡고 컴포넌트를 쪼개는 쪽이 ds 정본이다.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:19 — "C1 데이터가 곧 UI · UI = f(data)"
- /Users/user/Desktop/ds/CANONICAL.md:38 — "ui/ role 인터페이스: ControlProps(data, onEvent) 데이터 주도"
- 메모리: feedback_usememo_usecallback_is_srp_failure (메모화 = 책임 경계 실패 신호)
- /Users/user/Desktop/ds/src/ds/ui/4-collection/ — 큰 컬렉션은 가상화

## 남은 의문

- 깊은 entity tree의 partial update — 일부 노드만 바뀔 때 dispatch immutability 비용
- SSR 시 data 트리 직렬화 payload가 children JSX HTML보다 클 가능성 — 측정 필요
