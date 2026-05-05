# 0001. axis helpers stay in axes/

- Status: accepted
- Date: 2026-05-05

## Context

`improve-codebase-architecture` 리뷰에서 `_visibleFlat` 와 `gridCoord` 가 axis 파일 사이에 흩어져 있어 `state/helpers/` 같은 공용 디렉토리로 통합할지 검토.

- `_visibleFlat` (`axes/_visibleFlat.ts`) — `treeNavigate` · `treeExpand` 두 곳에서 사용.
- `gridCoord` (`axes/gridNavigate.ts` 내 export) — `gridNavigate` · `gridMultiSelect` 두 곳에서 사용.

## Decision

두 helper 모두 `axes/` 안에 그대로 둔다.

## Consequences

- 컨슈머가 모두 같은 디렉토리(`axes/`) 안에 있다. 이동시 단순 import 경로 churn 만 발생하고, **deletion test** 결과 leverage 가 새로 생기지 않는다.
- `state/helpers/` 는 axis 행동과 무관한 데이터 변환 helper(예: tree flatten 만 따로 쓰는 곳이 생기면) 가 등장할 때 만든다.
- 후속 항목: `_visibleFlat` 를 axes 외부 패턴(tree/treeGrid pattern 의 visibleFlat 기반 ids 도출)이 직접 import 하기 시작하면 이 ADR 을 superseded 로 표시하고 재배치 ADR 작성.
