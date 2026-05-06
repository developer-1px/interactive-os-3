---
id: chordDescriptorDup
type: inbox
slug: chordDescriptorDup
title: Backspaceremove — 정박-곤조-하네스 강연 슬라이드 2 라이브 사례
tags: [inbox, talk, retro]
created: 2026-05-06
updated: 2026-05-06
---

# Backspaceremove — 정박-곤조-하네스 강연 슬라이드 2 라이브 사례

## 배경

"LLM이 UI를 만드는 세상, 나는 FE로서 뭘 만들지?" 강연 그릴링 중,
실제 칸반 데모 콘솔에 React duplicate-key 경고와 Column TypeError가 떠서 박제.

강연 3막 구조(정박 → 곤조 → 하네스)의 **슬라이드 2(곤조) 라이브 사례** 그 자체.

## 사건

### Console

```
Encountered two children with the same key, `Backspaceremove`.
TypeError: Cannot read properties of undefined (reading 'n4') at Column (Kanban.tsx:123)
```

### 근원

`packages/headless/src/patterns/listbox.ts` `listboxBuiltinChords` 배열:

- 80행: `{ chord: 'Backspace', uiEvent: 'remove', description: 'Remove focused option', scope: 'item' }`
- 85행 (수정 전): `{ chord: LISTBOX_EDIT_REMOVE[0], uiEvent: 'remove', description: '... — editable mode', scope: 'item' }`
  - `LISTBOX_EDIT_REMOVE[0] === 'Backspace'`

같은 `(chord, uiEvent)` 쌍이 두 번 등록 → 어딘가의 list rendering 에서 `${chord}${uiEvent}` 형태 키 collision.

## 강연 메시지

이 한 사건이 강연 3막을 한 슬라이드에 압축한다:

1. **정박**: `LISTBOX_EDIT_INSERT/REMOVE` 상수로 어휘를 분리해 두고 ARIA 의미 그대로 노출.
2. **곤조**: 분리한 의도와 무관하게 같은 배열에 unconditional push — 정본(80행)과 충돌. LLM/관성이 비집고 들어옴.
3. **하네스 부재**: TypeScript 는 같은 shape 객체 두 개를 한 배열에 두는 걸 막지 않음. `(chord, uiEvent)` unique invariant 정적 검사가 없어서 **런타임에서 터짐**.

→ 처방: **추상화 1개당 invariant 검사 1개**. `listboxBuiltinChords` (와 형제들) 에 대해
`(chord, uiEvent)` 또는 `chord` 단독 unique 정적 검사 훅을 추가해야 한다.

## 수정

- `packages/headless/src/patterns/listbox.ts` 85행 중복 descriptor 제거.
- `LISTBOX_EDIT_REMOVE` 상수는 line 187 의 editable 모드 runtime routing 에서 여전히 사용 → 보존.
- editable 모드에서 Backspace=remove 의 runtime emit 은 base 의 clipboard 라우팅과 동치이므로 별도 descriptor 불필요.

## 후속 (TODO)

- [x] 모든 `*BuiltinChords` 배열에 대한 `(chord, uiEvent)` unique 정적 검사 훅 추가 → `scripts/guardChordRegistry.mjs` + `pnpm guard:chords`.
- [x] **하네스 추가 직후 즉시 두 번째 곤조 발견** — `tree.ts:82` 의 `TREE_EDIT_REMOVE[0]=Backspace, uiEvent=remove` 가 76행과 중복. listbox 와 정확히 같은 패턴(LLM 생성 의심). 수정 완료.
- [ ] 강연 슬라이드 2 자료로 console 캡처 + diff 박제.
- [ ] 칸반 Column TypeError(`reading 'n4'`)가 이 수정으로 해소되는지 확인 — 안 되면 별도 진단.

## 강연 메타-사례

이 사건은 강연이 **자기 자신을 증명한 순간**:

1. 정박-곤조-하네스 3막을 한 슬라이드에 압축한 사례를 우연히 발견
2. 처방(하네스)을 실제로 만들어 돌렸더니
3. **두 번째 곤조가 즉시 잡혔다** — 인간 눈으로는 못 본 것

→ 슬라이드 3(하네스)의 라이브 demo 로 그대로 사용 가능. "처방대로 했더니 처방이 두 번째 환자를 발견했다."
