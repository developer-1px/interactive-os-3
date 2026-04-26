---
id: q43LintHookCoverage
type: inbox
slug: q43LintHookCoverage
title: Q43 — 정본 위반 자동 lint·hook 커버 비율은?
tags: [inbox, qa, vision]
created: 2026-04-26
updated: 2026-04-26
---

# Q43 — 정본 위반 자동 lint·hook 커버 비율은?

## 질문

정본 위반을 사람이 PR에서 잡는 비율이 높다면 정본은 결국 사회적 합의에 머문다. 자동 검출이 어디까지 커버하나? 어느 정본이 자동, 어느 정본이 수동인가?

## 해보니까 알게 된 것

scripts/ 아래에 정본별 lint가 1:1로 매핑되어 있다.

| 정본 영역 | 자동 검출 | 위치 |
|---|---|---|
| 셀렉터 어휘(tag+role+aria+data-part) | O | `lint-ds-css.ts`, `role-css-audit.ts`, `noRawAriaRole.js`(aria/) |
| data-ds layout primitive only | O | `lint-flat-layout.mjs` |
| ARIA 키보드 contract | O | `lint-ds-keyboard.mjs` |
| 직렬화 가능 상태 | O | `lint-ds-serializable.mjs`, `guard-serializable.mjs` |
| 컴포넌트 contract(prop·event) | O | `lint-ds-contracts.mjs` |
| 토큰 직접 import 금지 | O | `lint-ds-values.mjs`, `guard-style-values.mjs`, `audit-ds-css.ts` |
| 셸 DOM reshape 금지 | O | `lint-ds-shell.mjs` |
| classless invariant | O | `lint-ds-invariants.mjs` |
| CSS orphan | O | `lint-ds-css-orphans.mjs` |
| **content vs control 분리** | X | 의미 판단 필요 — PR 리뷰 |
| **콘텐츠 widget root 1곳 className** | 부분 | parts/ 어휘는 검출, 책임 경계는 사람 |
| **de facto 수렴 채택 여부** | X | 외부 라이브러리 비교 — 사람 |
| **사용처 1곳도 entity 승격** | X | 의미 판단 |
| **명명 규칙(Trigger/GroupLabel/...)** | 부분 | 이름 패턴은 검출, 적절성은 사람 |

- 구조적 위반(셀렉터·토큰·키보드·직렬화·contract)은 거의 100% 자동.
- 의미적 위반(책임 경계·이름 적절성·승격 판단)은 자동 0%, 사람이 PR/리뷰/스킬(`/cohesion`·`/srp`·`/canonical`)로 잡는다.
- pre-commit hook(`scripts/pre-commit`)이 위 자동 lint를 한 번에 돌린다.

대략적 체감: **구조적 정본 90% 자동 / 의미적 정본 10% 자동**. 정본 행 수로 보면 자동 커버 60% 내외.

## 근거

- `/Users/user/Desktop/ds/scripts/` 아래 lint-ds-*.mjs 9종 + guard-*.mjs 2종 + audit-*.ts 2종
- `/Users/user/Desktop/ds/scripts/install-git-hook.sh`가 pre-commit 심볼릭 링크 자동 설치
- `/Users/user/Desktop/aria/eslint-rules/noRawAriaRole.js` — escape hatch 0개 강제
- 메모리 [antipattern 스킬] — 발견 시 훅으로 박제하는 워크플로우 자체가 정본의 일부

## 남은 의문

- 의미적 정본을 LLM 리뷰어로 자동화 가능한가(예: data-driven 위반을 LLM이 PR 리뷰)
- 자동 lint 실패율 통계 — 어떤 정본이 가장 자주 위반되나
- 신규 정본을 추가할 때 lint 작성을 강제하는 메타-정본이 필요한가 ("정본은 lint 없이 머지 안 된다")
