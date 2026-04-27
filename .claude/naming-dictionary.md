---
last_commit: a9fa0d97e712a4ce2b93bea36f52a0ec4a297885
last_updated: 2026-04-28
scope: packages/ds/src
total_idents: 377
---

## Verbs

| fragment | count | role | notes |
|----------|-------|------|-------|
| use | 15 | React hooks | 각자 다른 반환 — false positive 면제 |
| define | 10 | metadata factory | `create`/`build`/`make` 의 단일 대체 — 신규 factory 도입 시 이 prefix 만 |
| get | 5 | node/state property accessor | getChildren · getExpanded · getFocus · getLabel · getTypeahead — *lookup* 단일 역할 |
| is | 3 | boolean predicate | isDisabled · isMetaId · isPrintable |
| resolve | 2 | name → record lookup | resolveQueries · resolveUi |

## Postfixes

| fragment | count | rule | notes |
|----------|-------|------|-------|
| Css | 23 | CSS template string 반환 함수 | `<name>Css` = `() => string` |
| Card | 13 | 컴포넌트(PascalCase) + 매칭 style(camelCase) | cross-boundary 컨벤션 |
| Score | 6 | 시각/공간 numeric metric | proximityScore · weightStepScore |
| Item | 6 | ARIA composite item | ARIA 표준 |
| Group | 5 | ARIA group | RadioGroup · CheckboxGroup · RowGroup |
| Tint | 5 | 색 변형자 | accentTint · statusTint · toneTint |
| Resource | 4 | data abstraction | defineResource · useResource · readResource · writeResource |

## Synonym Map

| canonical | known synonyms | notes |
|-----------|---------------|-------|
| define | — | 단일 factory 동사. create/build/make 진입 ❌ |
| get | find (scan), resolve (name lookup) | 경계 정의됨 |
| to / from | — | converter pair (toCss · fromTree · fromList) |

## Role Map

| fragment | role | verb | examples |
|----------|------|------|----------|
| define | metadata factory | define | defineCategory, defineFeature, definePage |
| use | React hook | use | useResource, useFlow, useRoving |
| get | property accessor | get | getChildren, getFocus |
| resolve | name lookup | resolve | resolveUi (componentName → component) |
| find | scan/search | find | findDuplicateSelectors |

## Conventions

- **카드 짝**: `PostCard.tsx` (component) ↔ `PostCard.style.ts` 안 `postCard()` (CSS) — 대소문자가 boundary 신호.
- **새 부품 추가**: parts 단일어 우선 (Card · Tag · Avatar). 동명이의 충돌 시 *복합어*로 disambiguate (CountBadge · ProgressBar · RouterLink).
- **`*Css` postfix**: 1:1 component 의 CSS export. `partsStyles()` aggregator 가 모음.
- **Resource lifecycle**: `define`(선언) → `use`(React 소비) / `read`(snapshot) / `write`(mutate).

## Verdict (last audit 2026-04-28)

- Consistency: ✅ CLEAN
- Aptness: ✅ CLEAN
- 0 issues at count ≥ 5
