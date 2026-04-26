---
id: q59DefineFlowOneLine
type: inbox
slug: q59DefineFlowOneLine
title: Q59 — defineFlow 한 줄이 진짜 한 줄로 끝나나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q59 — defineFlow 한 줄이 진짜 한 줄로 끝나나? 복잡 사례?

## 질문

"정본: defineFlow 1조각 + useFlow 한 줄"은 마케팅 같다. 실제 finder 같은 복잡 라우트에서도 한 줄이 되나? 안 되면 한 줄이라는 약속은 거짓 아닌가?

## 해보니까 알게 된 것

**소비자 측은 정말 한 줄이다. 복잡도는 `defineFlow` 정의 안으로 흡수된다.**

`src/routes/finder/Columns.tsx:42` 실측:
```
const [data, onEvent] = useFlow(columnsFlow)
```
이게 컴포넌트가 데이터에 닿는 전부다. 분기·if·switch 0.

복잡도가 어디로 갔나? `columnsFlow` 정의 안으로 들어갔다 (`Columns.tsx:16`).

- `source`: `defineResource`로 묶인 URL/store
- `base`: value → NormalizedData (정규화)
- `gestures`: raw event → semantic event 변환
- `metaScope`: ds-meta로 흘릴 event 종류

`packages/ds/src/core/flow.ts:39-62` `useFlow` 본체가 useResource + useControlState + useEventBridge 3개를 합성해 (data, onEvent) 한 쌍으로 내놓는다. 즉 한 줄은 **합성된 인터페이스**의 한 줄이지 "복잡도 0"의 한 줄이 아니다.

복잡 사례 — finder 사이드바에 "방금 클릭한 항목을 recent에 push" 같은 부수 효과가 필요할 때(`src/routes/finder/useSidebarNav.ts:14`): "flow API 확장 대신 useFlow의 onEvent를 wrap"한다. 즉 한 줄 받은 뒤 `(e) => { writeResource(...); onEvent(e) }`로 데코레이트. 라우트 코드가 한 줄에서 두세 줄로 늘 뿐, 분기 트리가 생기지는 않는다.

다중 flow가 필요한 화면도 그냥 한 줄을 N번 호출:
```
const [recentData, recentEvent] = useFlow(recentFlow)
const [favData] = useFlow(favFlow)
```
(`useSidebarNav.ts:48-49`)

따라서 정확한 약속은 **"flow당 한 줄"**이다. flow 개수만큼 줄이 늘어난다. 그 점은 정본도 부정하지 않는다.

## 근거

- `/Users/user/Desktop/ds/packages/ds/src/core/flow.ts:39-62` — useFlow 합성 본체
- `/Users/user/Desktop/ds/src/routes/finder/Columns.tsx:16-42` — 정의 + 사용
- `/Users/user/Desktop/ds/src/routes/finder/useSidebarNav.ts:14,21-49` — 부수 효과 wrap 패턴
- 메모리 `defineFlow + useFlow — 범용 wiring` — resource.onEvent가 intent 라우터 흡수

## 남은 의문

- onEvent wrap이 반복되면 그 자체가 정본에 흡수돼야 함 — middleware phase가 그 자리 (`CANONICAL.md:72`)
- flow 정의 자체의 복잡도 한계 — base/gestures/metaScope가 길어지면 그건 어디서 쪼개나
- 다중 flow가 서로 의존할 때(예: A의 dispatch가 B를 invalidate)의 정본 패턴 미정
