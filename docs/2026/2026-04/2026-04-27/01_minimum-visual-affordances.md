---
type: inbox
status: unprocessed
date: 2026-04-27
tags: [design-system, affordance, foundations]
---

# 디자인 시스템에서 없어서는 안 될 최소한의 시각적 어포던스

디자인 시스템을 중심으로 서비스를 만들 때 **없으면 시스템이 무너지는** 최소한의 시각적 어포던스만 추리면 다음 7가지다. 이보다 적으면 위계·상태·피드백 중 하나가 깨진다.

## 1. 위계 (Hierarchy)
- **Type scale** — 최소 3단(heading · body · caption). 같은 의미는 같은 크기.
- **Spacing scale** — 최소 5단(atom < group < section < surface < shell). gap 하나로 그룹 소속을 읽게 한다. *(이 프로젝트의 `foundations/spacing/hierarchy.ts`)*

> 이 둘이 Gestalt의 Proximity·Similarity를 담당. 빠지면 "어디서 어디까지가 한 덩어리"인지 못 읽는다.

## 2. 상태 (State)
- **Interactive state 4종** — default · hover · focus-visible · disabled. focus-visible은 a11y 법적 최소.
- **Selection state** — selected/active를 hover와 다른 신호로. (보통 surface tint + border).

> 빠지면 "지금 뭐가 선택돼 있고, 뭘 누를 수 있는지" 못 읽는다.

## 3. 의미 색 (Semantic color)
- **Surface 2단** — surface · surfaceMuted (배경 분리).
- **Text 3단** — text · textSubtle · textOnEmphasis (대비).
- **Status 3색** — success · warning · danger. info는 옵션.
- **Border 2단** — borderLevel(분리) · borderEmphasis(focus).

> 빠지면 "이게 정상인지 경고인지" 못 읽는다. opacity로 약화하면 disabled로 오독 — semantic 색이 필수.

## 4. 모양 (Shape)
- **Radius 2단** — small(컨트롤) · medium(surface). 0 또는 full(pill)은 옵션.
- **Elevation/Border 택1** — 평면이면 border, 입체면 shadow. 둘 다 쓰면 위계 충돌.

## 5. 아이콘 (Iconography)
- **단일 아이콘 시스템 + 토큰** — `data-icon="<token>"` 한 어휘. 이모지·특수기호 금지(접근성·OS 차이로 깨짐).
- 최소 셋: navigation · status · action(close/more/check).

## 6. 피드백 (Feedback)
- **Loading** — skeleton 또는 spinner 1종.
- **Empty** — 빈 상태 메시지 + 다음 행동.
- **Error** — 인라인(필드) + 글로벌(toast/banner).

> 이 셋은 "데이터 없음 = 화면 빈칸"이 되는 순간 시스템이 무너진다.

## 7. 초점·키보드 (Focus)
- **focus ring 토큰 1개** — 모든 인터랙티브 요소가 동일 ring. 자체 outline 다 끄지 말 것.
- **focus 가시 영역(scroll-margin)** — 키보드 이동 시 잘리지 않게.

---

## 한 줄 요약

| 축 | 최소 토큰 수 |
|----|------|
| Type scale | 3 |
| Spacing hierarchy | 5 |
| Color (surface · text · status · border) | 약 10 |
| Radius | 2 |
| State (hover · focus · disabled · selected) | 4 |
| Icon set | 1 시스템 |
| Feedback (loading · empty · error) | 3 |

> **합쳐서 약 30개 토큰 + 컴포넌트 7~8개**(Button · Input · Select · Checkbox · Card · Heading · Icon · Feedback)면 거의 모든 서비스 화면을 위계·상태·피드백 깨짐 없이 그릴 수 있다. 이보다 적으면 도메인 화면에서 임시 스타일이 새기 시작한다.
