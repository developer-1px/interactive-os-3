---
id: q56AriaInsufficient
type: inbox
slug: q56AriaInsufficient
title: Q56 — ARIA 부족한 경우(drag preview)는?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q56 — ARIA 부족한 경우(drag preview)는?

## 질문

ds는 "ARIA로 모든 상태를 표현"한다고 선언한다. 그런데 ARIA 명세에는 drag preview, hover-only tooltip의 visible 여부, virtualized list의 off-screen item, drop indicator 위치 같은 게 없다. 이런 비-ARIA 상태는 어디로 가나?

## 해보니까 알게 된 것

세 갈래로 갈라진다.

1. **그 상태가 진짜 사용자 상태인가** — drag 중인 source는 `aria-grabbed`(deprecated)가 아닌 application-defined 상태로 분류된다. 정본은 `data-dragging` 같은 widget-local data attribute 신설이 아니라, **gesture를 ds/core/gesture로 격리하고 컴포넌트는 활성/비활성 같은 ARIA로 재투영**한다. 즉 "drag preview"는 별도 컴포넌트(엔티티)로 떠올라 그 자체가 root role을 갖는다.
2. **임시 표현이면 임시 attribute** — `data-state="open"`처럼 Radix가 채택해 사실상 표준이 된 attribute는 채택 가능. CANONICAL.md C5는 "tag + role + aria + data-part"를 명시하지만 임시 칸이 비어 있지 않다 — `data-ds`(layout)·`data-part`(content)·`data-slot`(Card)이 이미 namespace를 분점한다. 새 namespace가 필요하면 정본 갱신 절차로.
3. **ARIA가 없는 곳은 ARIA Authoring Practices 정찰 후 결정** — 메모리 `prefer de facto`처럼, drag/drop은 react-aria의 `useDrag`/`useDrop`이 이미 어휘를 정해뒀다. 그쪽 형태로 수렴.

`src/ds/core/gesture.ts`가 raw event → semantic event 변환 자리다. drag preview의 위치/내용은 `useResource` 상태로 직렬화되고(C2), preview entity가 그 상태를 `data` prop으로 받아 그린다. ARIA가 부족한 게 아니라, 부족한 영역은 entity로 분리해 그 안에서 ARIA-적합하게 다시 표현하는 것이다.

## 근거

- `/Users/user/Desktop/ds/CANONICAL.md:39-40` — gesture/intent 분리, activate 단발
- `/Users/user/Desktop/ds/src/ds/core/gesture.ts` — raw → semantic 변환 자리
- 메모리 `Gesture/Intent 분리` — expand/navigate 도출은 ds/core/gesture 헬퍼가 담당
- Q34와 연결 — Trigger vs Activator처럼 어휘는 de facto 수렴 후 채택

## 남은 의문

- WCAG·ARIA 1.3에서 표준화될 때까지 임시 `data-*`를 어디까지 허용?
- drag preview entity 자체의 정본 위치는 ui/0-primitive? 아직 미정
- `aria-grabbed` deprecated 후의 공식 권고는 "application-defined" — 이건 표준의 부재 아니라 의도된 위임이라는 점
