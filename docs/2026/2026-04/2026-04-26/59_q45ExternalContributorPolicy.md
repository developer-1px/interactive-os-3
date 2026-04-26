---
id: q45ExternalContributorPolicy
type: inbox
slug: q45ExternalContributorPolicy
title: Q45 — 외부 contributor가 정본 흔들 때 정책?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q45 — 외부 contributor가 정본 흔들 때 정책?

## 질문

ds가 오픈소스로 나가면 외부 PR이 들어온다. 정본을 모르거나, 정본에 동의하지 않거나, 정본을 흔드는 PR이 올 때 어떻게 처리하나? "안 받습니다"는 BDFL 독재로 보일 수 있다.

## 해보니까 알게 된 것

- 정본은 거부의 사유가 아니라 **거부의 형식**이다. PR을 거부할 때 "내가 싫어서"가 아니라 "C2 직렬화 위반"이라고 말할 수 있어야 하고, 그 위반은 자동 lint로 객관화된다.
- 따라서 외부 PR 정책은 다음 3트랙으로 갈린다:
  1. **정본 안 PR** (lint 통과 + 정본 행 안 바꿈): 일반 리뷰. 빠르게 머지.
  2. **정본 일탈 PR** (lint 실패): 자동 거부. "정본 X행 위반 — 수정하거나 정본 갱신 제안 PR로 분리하라" 봇 코멘트.
  3. **정본 갱신 제안 PR** (CANONICAL.md 행을 직접 수정): RFC 트랙. 갱신 절차 4단계 통과 필요. 반례 + 후보 평가(de facto·직렬화·선언성·단순성·확장) + 합의.
- 이 3트랙이 있으면 외부 contributor가 정본을 "흔드는" 행위가 정상 흐름의 한 종류로 흡수된다. 흔드는 게 문제가 아니라 흔드는 형식이 갖춰졌느냐가 문제.
- 동의 안 하는 contributor는 (a) 정본 갱신 PR을 시도하거나 (b) fork한다. 두 길 다 정본의 권위와 자율성을 동시에 지킨다.
- 솔직: 지금 ds는 외부에 나갈 단계가 아니다. 외부 정책은 가설.

## 근거

- CANONICAL.md L92-97 갱신 절차가 이미 RFC와 등가의 4단계 (반례 → 후보 평가 → 합의 → 갱신·감사)
- Q43 lint 자동화율 60-90%가 1·2 트랙의 자동 분류를 가능케 함
- 메모리 [Prefer de facto standard] — 외부 PR이 de facto와 충돌하면 de facto 쪽으로 자동 가는 경향

## 남은 의문

- 정본 갱신 PR 템플릿(`.github/ISSUE_TEMPLATE/canonical-update.md`)을 만들지
- 동의 안 하는 contributor의 fork가 ds 이름으로 유통될 때 trademark 정책
- "정본 갱신 권한"을 외부에 위임하는 메커니즘(maintainer 승급) 필요 시점
