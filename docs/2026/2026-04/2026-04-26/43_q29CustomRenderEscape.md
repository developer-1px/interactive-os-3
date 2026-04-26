---
id: q29CustomRenderEscape
type: inbox
slug: q29CustomRenderEscape
title: Q29 — 직렬화 가능 원칙 아래 custom render는 어떻게 우회하나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q29 — 직렬화 가능 원칙 아래 custom render는 어떻게 우회하나?

## 질문

직렬화 가능 → 함수 prop 추방. 진짜로 함수가 필요한 곳(custom render)은 어떻게 우회하나?

## 해보니까 알게 된 것

핵심 통찰: `renderItem={(item) => <Custom>{item.x}</Custom>}` 같은 함수 prop의 99%는 *분기 데이터*를 위장한 것이다. 직렬화 가능한 형태로 풀면 거의 항상 데이터 룩업으로 환원된다.

실제 패턴 3가지로 정리됐다:

1. **Discriminated kind** — 셀이 `text·badge·avatar·timestamp` 중 어느 종류인지를 데이터에 박는다. ui/Table은 `kind`로 룩업해서 ds/parts의 부품을 고른다. 함수 0개.
2. **신뢰된 HTML payload entity** — 마크다운·코드 하이라이트처럼 외부 라이브러리가 HTML 문자열을 만들어내는 건 `Prose`·`CodeBlock` entity 안에서만 dangerouslySetInnerHTML을 쓴다. 콜사이트는 데이터(string)만 넘긴다 — 함수가 아니라 string.
3. **진짜 한 화면에서만 쓰이는 표시 형태** — entity로 승격한다 (사용처 1곳도 entity 승격이 정본). content widget 1개 만들어서 root 1곳에 className 붙이고, 콜사이트는 그 widget을 데이터로 가리킨다.

남는 1%는 어쩌나 — 인터랙티브 캔버스, 실시간 차트의 path 함수 같은 것. 이건 ds/core 또는 명령형 경계로 떨어뜨려서 widget·route는 선언적으로 data만 넘기게 한다. C4 명령형은 경계로.

## 근거

- /Users/user/Desktop/ds/CANONICAL.md:20 — "C2 상태는 직렬화 가능 · DOM·함수·Promise를 상태에 두지 않는다"
- /Users/user/Desktop/ds/CANONICAL.md:22 — "C4 명령형은 경계로"
- /Users/user/Desktop/ds/CANONICAL.md:52 — "신뢰된 HTML payload entity: Prose·CodeBlock"
- /Users/user/Desktop/ds/CANONICAL.md:50 — "사용처 1곳이어도 entity 승격"

## 남은 의문

- useResource의 dispatch는 함수인데 C2 위반 아닌가 (Q57과 연결)
- 차트 path generator처럼 데이터로 환원 시 payload가 너무 커지는 케이스
