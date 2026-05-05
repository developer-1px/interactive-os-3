---
id: kanbanTask
type: plan
project: ds
slug: kanbanTask
title: Kanban 예시 완성 — 갭 닫기
tags: [plan, kanban, headless, zod-crud]
created: 2026-05-05
updated: 2026-05-05
---

# Kanban 예시 완성

zod-crud × @p/headless 두번째 example. Outliner 와 다른 ARIA 패턴(Listbox 다중 인스턴스 + 컬럼간 cut+paste). 1차 구현 완료, 검증 중 발견된 갭 닫기.

## 1차 검증 결과

- ✅ init: 3 컬럼 / 6 카드 렌더링
- ✅ Enter (insertAfter): 카드 추가, focus 이동
- ✅ Backspace (remove): 카드 삭제, focus 이웃 이동
- ✅ Cut (Cmd+X): 카드 제거
- ❌ **Cross-column Paste (Cmd+V)**: stale focus 로 paste 실패 — col1 카드 수 변화 없음
- ⚠️ **Undo**: paste 가 적용 안됐으니 undo 도 의미 없음

## 갭

### G1 — Focus 추적: meta.focus 가 DOM focus 와 분리됨
- `meta.focus` 는 zod-crud subscribe 의 focusNodeId 만 반영 (편집 직후)
- 사용자가 manual focus / Tab / Arrow 로 이동하면 meta.focus 안 바뀜
- clipboard 는 `activeId` 를 `meta.focus` 에서 읽음 → stale
- **결정 필요**: (a) DOM focusin 추적 추가 / (b) listbox selectionFollowsFocus → meta.selected 로 통일

### G2 — Paste mode 의미
- 현재 `routeUiEventToCrud` 는 `paste(targetId, { mode: 'auto' })` 호출
- zod-crud auto = type-aware (같은 shape 면 overwrite, 다르면 sibling insert?)
- Kanban 기대: **항상 sibling insert** (or insertAfter target)
- **결정 필요**: (a) widget 에서 `mode: 'child'` 또는 sibling 명시 / (b) auto 가 sibling 으로 동작하는지 zod-crud 확인

### G3 — 빈 컬럼에 Cmd+V
- 빈 컬럼은 listbox option 0개 → focus 둘 곳 없음
- 컬럼 헤더에 focus 두고 Cmd+V → targetId = 컬럼 id → `appendChild` 가 맞음
- 현재 paste 만으로 처리 가능한지 검증

### G4 — Cross-column move 검증 시나리오
체크리스트:
1. col0 첫 카드 focus → Cmd+X → col0 카드 -1
2. col1 두번째 카드 focus → Cmd+V → col1 카드 +1, 위치는 두번째 다음
3. Cmd+Z → col0 +1 복원, col1 -1 복원, focus 원위치
4. Cmd+Shift+Z → 다시 이동된 상태

## 작업 항목

### B1 (단일 배치)
1. **G2 먼저** — paste mode 동작 확인 (zod-crud test 또는 코드 읽기)
   - sibling insert 가 default 가 아니면 widget 에서 `mode: 'child'` 명시 또는 명시적 mode 전달
2. **G1 결정 + 적용** — DOM focusin 추적 (이미 patch 적용됨, 검증만)
3. **G3 검증** — 빈 컬럼 paste
4. **G4 시나리오 재실행** — 브라우저 자동화로 4 steps 통과 확인
5. **typecheck** 0
6. **commit**

## 변경 파일
- `apps/kanban/src/widgets/Kanban.tsx`
- (필요 시) `apps/kanban/src/features/boardCrud.ts`
- 없으면 추가 안 함

## 평가 기준 (평가자에게 전달)
- G4 4-step 시나리오 모두 통과
- 컬럼 사이 Tab 이동 시 focus 잃지 않음
- Cmd+Z 후 focus 가 합리적 위치
- DOM focusin 추적이 정말 필요했는지 (코드 스멜 헌터 시점)
- 시각: 컬럼 카드 카운트 표시, 빈 컬럼 명확
