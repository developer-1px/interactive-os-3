---
id: q47WhySeriesItself
type: inbox
slug: q47WhySeriesItself
title: Q47 — why 시리즈 자체가 정본인가? 갱신되나?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q47 — why 시리즈 자체가 정본인가? 갱신되나?

## 질문

08~13의 why 문서는 ds의 사상을 적은 글이다. 이게 정본인가? 정본이라면 갱신되나? 정본이 아니라면 어디에 위치하나?

## 해보니까 알게 된 것

- why 시리즈는 정본 **아니다**. 정본은 CANONICAL.md 한 곳. why는 정본을 **설명하는 회고**다.
- 구분:
  - **CANONICAL.md** — 무엇을 따를 것인가(현재형, 단언). 갱신 시 변경 이력에 일자 박제.
  - **why 시리즈** — 왜 그렇게 정했는가(서사, 회고). 갱신은 새 문서 추가로 (`14_whyReaderQuestions` 처럼).
- why를 정본으로 못 박는 순간 두 가지 문제가 생긴다:
  1. why가 자기 모순될 때 "정본 갱신 절차"를 밟아야 함 → 사상 글에 RFC가 붙는 부조리
  2. why가 다국어/관점/톤이 다를 자유를 잃음 — 정본은 1형태여야 하지만 why는 다중 관점을 허용
- 즉 why는 **inbox 문서**(type=inbox, frontmatter)다. 14_whyReaderQuestions 자체가 그 증거 — 외부 독자 시뮬레이션도 inbox로 들어감.
- 갱신 방식:
  - 새 반례·새 인사이트 → 새 why 문서 (번호 증가)
  - 기존 why가 정본과 어긋나면 → 정본을 따름. why 문서 상단에 "이 문서는 X 시점 기준이며 현재 정본은 Y" 노트
  - why를 통째로 폐기하는 일은 없음 — 화석으로도 가치 있음 (왜 그 시점에 그렇게 생각했는지의 기록)

## 근거

- 14_whyReaderQuestions L1-9 frontmatter `type: inbox` — why 메타 문서 자체도 inbox
- CANONICAL.md L1-2 "이 문서는 /canonical 스킬이 Phase 0에서 자동 로드한다" — 자동 로드 대상은 CANONICAL.md만
- 메모리 [inbox 날짜 폴더] — inbox는 사건 발생일 박제. why도 작성일 폴더에 들어감
- 변경 이력은 CANONICAL.md만 가짐. why에는 변경 이력이 없음

## 남은 의문

- why가 정본과 어긋날 때 노트를 자동 삽입할지(스크립트로 검출)
- why 시리즈에 "Status: Active / Superseded / Historical" frontmatter를 넣을지
- why 시리즈를 별도 디렉터리(`docs/why/`)로 모을지, 날짜 폴더에 흩어 둘지 — 지금은 후자
