---
id: q38EntityTombstones
type: inbox
slug: q38EntityTombstones
title: Q38 — 사용처 1곳도 entity 승격 — 묘비가 어휘 오염?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q38 — 사용처 1곳도 entity 승격 — 묘비가 어휘 오염?

## 질문

"사용처 1곳도 entity 승격" 룰을 따르면, 라우트가 사라진 뒤에도 entity는 src/ds에 남는다. 안 쓰는 entity가 쌓여 어휘를 오염시키지 않나?

## 해보니까 알게 된 것

- 위험은 진짜다. 헌장 C6("정본 ≠ 이상형")이 정확히 이걸 막으려는 조항이다 — **쓰지 않는 entity는 정본이 아니다.**
- 룰의 정확한 표현은 "사용처 1곳이라도 **있을 때** entity로 승격"이지 "한 번 entity가 되면 영원"이 아니다. 사용처가 0이 되면 **entity 묘비는 즉시 제거** 또는 `4-archive/`로 이동.
- 자동화: import graph에서 사용처 0인 entity를 찾는 lint/hook이 정본 라인에 있어야 한다. 사람이 PR에서 잡는 건 늦다.
- 어휘 오염의 더 큰 원인은 묘비가 아니라 **임시·유산이 만료 조건 없이 쌓이는 것**이다. 묘비는 검출이 쉬운(=import 0) 반면 임시·유산은 사람이 의도를 적어둬야 한다.
- 1곳 승격 룰의 진짜 효용: route 인라인 JSX의 콘텐츠 vs 컨트롤 분리를 강제. "재사용성"을 entity 승격 기준으로 두면 콘텐츠가 라우트 안에 묶여 LLM이 "비즈니스 콘텐츠 = 라우트의 일부"로 학습한다 — 이걸 막는 게 1곳 룰의 본의.

## 근거

- CANONICAL.md "콘텐츠 vs 컨트롤": 사용처 1곳이어도 entity 승격.
- 헌장 C6: 정본 ≠ 이상형.
- MEMORY.md `feedback_content_control_split`: 재사용은 결과지 기준 아님.

## 남은 의문

- 자동화된 "사용처 0 entity" 검출기는 아직 없다 (lint·hook 미구현). 누가 만드나.
- "사용처 0이면 즉시 제거"의 grace period — 라우트가 일시적으로 비활성화된 동안 entity가 사라지면 복구 비용 큼. archive로 옮기는 정책이 안전한가.
- entity 묘비와 임시 컴포넌트(Q36)가 동시에 쌓일 때 우선순위는 — 임시는 보존, 묘비는 정리?
