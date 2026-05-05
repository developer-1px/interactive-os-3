# 0002. check 와 select 는 별개의 축

- Status: accepted
- Date: 2026-05-05
- PRD: #37
- Supersedes: #23 / #24 (이슈 본문 부분 흡수)

## Context

`@p/headless` 가 한때 `entity.selected` 한 필드 + `select`/`selectMany` 한 어휘로 두 가지 의미를 통합 표현했다:

- 독립 boolean (체크박스, 라디오, 스위치 — `aria-checked`)
- 관계적 selection 멤버십 (리스트박스 옵션, 탭, 그리드 셀 — `aria-selected`)

이 통합으로 `select` 이벤트의 의미가 reducer 에 따라 뒤집혔고 (`singleSelect` → single-replace, `multiSelectToggle` → toggle), 하이브리드 UI (Gmail row 처럼 한 항목이 selected + checked 둘 다 가지는 케이스) 표현 불가, CLAUDE.md invariant #6 "Vocabulary closed (ARIA)" 위반.

W3C/WAI-ARIA spec 은 `aria-checked` 와 `aria-selected` 를 명시적 별개 attribute 로 분리. memory `feedback_when_ambiguous_follow_aria.md` 정합.

## Decision

ARIA spec 자구 그대로 두 축으로 분리.

### 데이터 모델
- `entity.checked: boolean | 'mixed' | undefined` — `aria-checked` 정본 (4값 1:1)
- `entity.selected: boolean | undefined` — `aria-selected` 정본
- 두 필드 직교 — 한 entity 가 동시 보유 가능 (Gmail-style row)

### 이벤트 어휘
- **check 축**:
  - `check { id; to?: boolean | 'mixed' }` — 단일 토글 (to 생략) 또는 명시 set
  - `checkMany { ids; to?: boolean | 'mixed' }` — batch
- **select 축**:
  - `select { id }` — **항상 single-replace** (de facto Finder/Gmail). reducer 가 의미 뒤집을 수 없음
  - `selectMany { ids; to? }` — multi-mode 의 modifier (Shift/Ctrl/Cmd) 합성 결과만
- **anchor**: `setAnchor { id }` — Shift+click range 기준점 갱신. axis 가 사용자-의도 토글에서 emit. core reduce 의 단일 책임 (`select` 의 부수 효과 아님)

### reducer fragment
- `singleSelect` — `select` / `activate` → entity.selected single-replace + focus
- `multiSelectToggle` — `select` → single-replace, `selectMany` → batch
- `singleCheck` — `check` / `activate` → entity.checked single-replace (radio)
- `checkToggle` — `check` / `checkMany` → entity.checked toggle/batch (checkbox group)

### default 합성
- `reduceWithDefaults` = `reduce + singleSelect + checkToggle + setValue` — listbox-single + tabs + menu + checkbox group
- `reduceWithMultiSelect` = `reduce + multiSelectToggle + checkToggle + setValue` — listbox/tree/grid multi
- `reduceWithRadio` = `reduce + singleCheck + setValue` — radio (select 축 미사용)

### hook 분리 정책
ARIA spec 의 role 분리를 따른다:
- 같은 role + 다른 attribute 모드 → 한 hook + 옵션 (예: `useListboxPattern({multiSelectable})`).
- 별개 role → 별개 hook (예: `useRadioGroupPattern` ≠ `useCheckboxGroupPattern`).

### 라디오 click 처리
패턴이 compound emit 안 함. `singleCheck` reducer 가 atomic single-of-group 처리. `select` 축의 `singleSelect` 와 동일 모양.

## Consequences

- **invariant 회복**: CLAUDE.md #6 "Vocabulary closed (ARIA)" 정합. `aria-checked` ≠ `aria-selected` spec 분리가 데이터·이벤트·reducer 까지 일관.
- **하이브리드 UI 표현 가능**: Gmail row 가 `aria-selected` (행 포커스) + 자식 checkbox 의 `aria-checked` (배치 작업) 동시 보유 — nesting 으로 표현.
- **어휘 = 의미 1:1**: `select` 는 single-replace, `selectMany` 는 batch, `check` 는 toggle, `setAnchor` 는 anchor. reducer 가 의미를 뒤집을 수 없음. memory `feedback_minimize_choices_for_llm` 정합.
- **`useLocalData` 통합 유지**: 두 축이 다른 이벤트라 reducer 합성 시 충돌 없음. 사용자가 별도 reducer 인자 없이 zero-config 작동 (radio 만 `reduceWithRadio` 명시).
- **마이그레이션 비용**: `entity.selected` → `entity.checked` 는 checkbox/radio/switch 패턴에 한정. listbox/tree/grid/option/treeitem 은 그대로.
- **3번째 축 (`aria-pressed`)** 도입 시 — 같은 패턴 (`pressed`/`pressMany` 이벤트, `togglePressed` reducer) 으로 확장. 이 시점에서 4 reducer 의 factory 추출 검토.

## Rejected alternatives

- **A. 단일 축 유지 + reducer 정책으로 분기** — 어휘=의미 1:1 위반. ARIA invariant 위반.
- **B. 패턴별 권장 reducer 노출** (`useCheckboxGroupPattern.recommendedReducer`) — 새 어휘 도입, 강제 아님, LLM 선택 지점 ↑.
- **C. radio 가 select 축 + 출력만 `aria-checked`** — 데이터 필드 (selected) 와 출력 attribute (aria-checked) 어긋남, invariant #6 위반.
