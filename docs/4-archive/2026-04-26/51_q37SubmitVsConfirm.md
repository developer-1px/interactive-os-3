---
id: q37SubmitVsConfirm
type: inbox
slug: q37SubmitVsConfirm
title: Q37 — form Submit vs dialog Confirm — 같은 컴포넌트?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q37 — form Submit vs dialog Confirm — 같은 컴포넌트?

## 질문

같은 의미("주된 행동 확정")인데 layer가 다르다. form Submit과 dialog Confirm은 같은 컴포넌트인가, 다른 컴포넌트인가?

## 해보니까 알게 된 것

- **다르다.** ARIA·HTML이 둘을 다른 의미로 정의한다. `<button type="submit">`은 폼과 묶인 명시적 의미(implicit submission, Enter 키, formaction 등 브라우저 동작 동반)이고, dialog 안의 Confirm 버튼은 일반 button + 다이얼로그 닫기 의도(`aria-describedby`로 description과 묶이고 `data-autofocus`/initial focus 대상이 되는 게 일반)일 뿐이다.
- "1 role = 1 component"의 role은 시각이 아니라 **의미·계약**이다. Submit과 Confirm은 호출자가 거는 계약이 다르다 — Submit은 form validation 통과, Confirm은 destructive intent 한 단계.
- 이름 분리 결정 룰: (a) **DOM 출력이 다른가**(button type, role, aria-*) → 다르면 분리. (b) **호출자 계약이 다른가**(어디에 위치, 어떤 부모 widget이 요구) → 다르면 분리. Submit은 (a)·(b) 둘 다 다름.
- **시각 동일**은 분리 막는 이유가 안 된다. 시각은 foundations/recipes가 공유. 컴포넌트는 의미별로 갈라도 스타일 비용 안 든다.
- 이게 컴포넌트 폭증 우려(Q15·Q26)와 만나는 지점. 우리는 "이름 폭증을 받아들이고 LLM에게는 의미 disambiguation 이득을 준다"고 답해야 한다.

## 근거

- 헌장 C5: tag + role + aria가 셀렉터. 출력 DOM이 다르면 다른 컴포넌트.
- ARIA APG: dialog의 confirmation button은 별도 패턴, form submission과 분리.
- MEMORY.md `feedback_minimize_choices_for_llm`: 1 role = 1 component, role은 의미 단위.

## 남은 의문

- 그 외 "주된 행동" 슬롯들 — wizard Next·payment Pay·signup Continue 모두 별도? 어느 입자도까지 분해하나.
- 사용자 코드에서 LLM이 "이건 Submit이야 Confirm이야" 결정을 잘 하는지 측정 안 됨.
- 같은 라우트에 폼과 모달이 겹쳤을 때(폼 안에 confirm 모달) 이름 충돌·import 비용은 실측해야 함.
