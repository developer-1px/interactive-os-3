---
id: outlinerPrd
type: prd
slug: outlinerPrd
title: Outliner — zod-crud × @p/headless 콜라보 example PRD
tags: [inbox, prd, idea]
created: 2026-05-05
updated: 2026-05-05
---

## 부록 — 실제 문법으로 본 ASCII tree

```
Outliner
├── entities/outlineNode.ts ─────────────────────── zod schema
│   ├── const OutlineNode: z.ZodType<OutlineNode> = z.object({
│   │     id: z.string(),
│   │     text: z.string(),
│   │     collapsed: z.boolean().optional(),
│   │     children: z.array(z.lazy(() => OutlineNode)),
│   │   })
│   └── export const OutlineRoot = z.object({
│         rootId: z.string(),
│         nodes: z.record(z.string(), OutlineNode),
│       })
│
├── features/outlineCrud.ts ─────────────────────── zod-crud 인스턴스
│   ├── import { createJsonCrud } from 'zod-crud'
│   ├── import { OutlineRoot } from '@/entities/outlineNode'
│   └── export const crud = createJsonCrud(OutlineRoot, {
│         rootId: 'n1',
│         nodes: { n1: { id: 'n1', text: '', children: [] } },
│       })
│       │
│       ├── crud.snapshot()     → JsonDoc
│       ├── crud.read(id)       → JsonNode
│       ├── crud.create(parentId, key, value) → OperationResult
│       ├── crud.update(id, value)            → OperationResult
│       ├── crud.delete(id)                   → OperationResult
│       ├── crud.copy(id) / crud.cut(id)      → OperationResult
│       ├── crud.paste(id, { mode })          → OperationResult
│       ├── crud.canPaste(id, { mode })       → boolean (dry run)
│       ├── crud.undo() / crud.redo()         → OperationResult
│       └── OperationResult
│           ├── ok: true
│           ├── nodeId: NodeId
│           ├── focusNodeId: NodeId
│           └── changes: JsonChange[]   (insert | update | delete)
│
├── features/outlineResource.ts ─────────────────── @p/headless/store 어댑터
│   ├── import { defineResource } from '@p/headless/store'
│   ├── import { crud } from './outlineCrud'
│   └── export const outlineResource = defineResource({
│         key: () => 'outline',
│         initial: () => crud.snapshot(),
│         subscribe: (_k, notify) => {
│           const id = setInterval(notify, 0); return () => clearInterval(id)
│         },
│         onEvent: (e, { value }) => {
│           switch (e.type) {
│             case 'activate':
│               if (e.intent === 'copy')   { crud.copy(e.id);   return crud.snapshot() }
│               if (e.intent === 'cut')    { crud.cut(e.id);    return crud.snapshot() }
│               if (e.intent === 'paste')  { crud.paste(e.id, { mode: 'sibling' }); return crud.snapshot() }
│               if (e.intent === 'delete') { crud.delete(e.id); return crud.snapshot() }
│               if (e.intent === 'undo')   { crud.undo();       return crud.snapshot() }
│               if (e.intent === 'redo')   { crud.redo();       return crud.snapshot() }
│             case 'expand':
│             case 'collapse':
│               crud.update(e.id, { ...crud.read(e.id), collapsed: e.type === 'collapse' })
│               return crud.snapshot()
│           }
│         },
│       })
│
├── widgets/Outliner.tsx ────────────────────────── view
│   ├── import { useResource } from '@p/headless/store'
│   ├── import { useTreePattern } from '@p/headless/patterns'
│   ├── import { fromFlatTree } from '@p/headless'
│   ├── import { useShortcut } from '@p/headless/key/useShortcut'
│   └── export function Outliner() {
│         const [doc, dispatch] = useResource(outlineResource)
│         const data = useMemo(
│           () => fromFlatTree(doc.nodes, doc.rootId, {
│             children: (n) => n.children,
│             id: (n) => n.id,
│           }),
│           [doc],
│         )
│         const tree = useTreePattern(data, dispatch)
│
│         useShortcut('mod+z',       () => dispatch({ type: 'activate', intent: 'undo'  }))
│         useShortcut('mod+shift+z', () => dispatch({ type: 'activate', intent: 'redo'  }))
│         useShortcut('mod+c',       () => dispatch({ type: 'activate', intent: 'copy',  id: tree.activeId }))
│         useShortcut('mod+x',       () => dispatch({ type: 'activate', intent: 'cut',   id: tree.activeId }))
│         useShortcut('mod+v',       () => dispatch({ type: 'activate', intent: 'paste', id: tree.activeId }))
│
│         return (
│           <ul {...tree.rootProps} className="p-4 font-mono text-sm">
│             {data.flat.map((node) => (
│               <li
│                 key={node.id}
│                 {...tree.itemProps(node.id)}
│                 className="pl-[calc(var(--lvl)*1rem)] outline-none focus:bg-blue-50"
│                 style={{ '--lvl': node.depth } as CSSProperties}
│               >
│                 <span aria-hidden>•</span> {crud.read(node.id).value ?? ''}
│               </li>
│             ))}
│           </ul>
│         )
│       }
│
├── routes/index.tsx ────────────────────────────── TanStack file-based
│   └── export const Route = createFileRoute('/')({
│         component: Outliner,
│       })
│
└── ARIA surface (런타임 출력) ──────────────────── useTreePattern 이 자동 emit
    ├── <ul role="tree" aria-label="outline" tabindex="0">
    ├──   <li role="treeitem"
    │         aria-level="1"
    │         aria-expanded="true"
    │         aria-selected="true"
    │         aria-posinset="1"
    │         aria-setsize="3"
    │         id="...">
    └── (소비자 코드에는 role/aria-* 직접 없음 — 패턴이 emit)
```


# Outliner — zod-crud × @p/headless 콜라보 example PRD

## 배경

zod-crud(데이터·검증·history·clipboard)와 @p/headless(ARIA 행동·키보드·roving)는
서로의 정체성을 지키면서 콜라보가 가능한지 *살아있는 증거*가 필요하다.
JSON treegrid 편집기는 이미 zod-crud 자체 showcase가 가지고 있어 중복.
Workflowy/Roam 스타일 키보드-only outliner가 가장 적은 표면적으로 양쪽 spec을 동시에 시연한다.

## 제품 PRD (ASCII tree)

```
Outliner (apps/outliner)
├── 1. Identity ─────────────── 키보드-only 중첩 노트 에디터
│   ├── Vision ─────────────── "마우스 안 쓰는 Workflowy clone, 100줄대 코드"
│   ├── Why ────────────────── zod-crud × @p/headless 콜라보를 정직하게 증명
│   └── Non-goal
│       ├── 마크다운 렌더링·rich text
│       ├── 멀티유저·동기화
│       ├── 드래그앤드롭
│       └── 자체 디자인 시스템
│
├── 2. Stack ─────────────────── 의존성 위계 (아래 → 위)
│   ├── zod ────────────────── schema 정의
│   ├── zod-crud ───────────── npm dep, 데이터 엔진
│   ├── @p/headless ────────── monorepo, 행동 엔진
│   │   ├── /patterns ──────── useTreePattern (또는 useTreeGridPattern)
│   │   ├── /store ─────────── useResource + defineResource
│   │   └── /key ───────────── useShortcut
│   ├── Tailwind v3 ────────── 시각 (utility class 직접)
│   └── App adapter ────────── ~30줄 (defineResource(jsonCrud))
│
├── 3. Data Model ────────────── Zod schema 1개
│   ├── OutlineNode
│   │   ├── id: string
│   │   ├── text: string
│   │   ├── collapsed?: boolean
│   │   └── children: OutlineNode[] (z.lazy 재귀)
│   ├── OutlineDoc
│   │   ├── rootId: string
│   │   └── nodes: Record<id, OutlineNode>
│   └── Note ───────────────── zod-crud JsonDoc과 isomorphic → 어댑터 거의 0
│
├── 4. UX — Keyboard Spec ───── 모든 인터랙션은 키보드만
│   ├── Navigation
│   │   ├── ArrowUp ────────── 이전 가시 행
│   │   ├── ArrowDown ──────── 다음 가시 행
│   │   ├── ArrowLeft ──────── collapse / 부모로
│   │   ├── ArrowRight ─────── expand / 첫 자식으로
│   │   ├── Home ───────────── 첫 행
│   │   └── End ────────────── 마지막 가시 행
│   ├── Edit
│   │   ├── Enter ──────────── 같은 레벨 형제 추가
│   │   ├── Tab ────────────── 들여쓰기 (이전 형제의 자식으로)
│   │   ├── Shift+Tab ──────── 내어쓰기 (조부모의 자식으로)
│   │   ├── Backspace(빈) ──── 노드 삭제
│   │   └── Space ──────────── collapse/expand 토글
│   ├── Clipboard
│   │   ├── Cmd+C ──────────── 서브트리 copy
│   │   ├── Cmd+X ──────────── 서브트리 cut
│   │   ├── Cmd+V ──────────── paste-as-sibling
│   │   └── Cmd+Shift+V ────── paste-as-child
│   └── History
│       ├── Cmd+Z ──────────── undo
│       └── Cmd+Shift+Z ────── redo
│
├── 5. ARIA Surface ──────────── W3C APG 어휘 그대로
│   ├── role="tree" ────────── 루트
│   ├── role="treeitem" ────── 각 노드
│   ├── aria-level ─────────── 깊이
│   ├── aria-expanded ──────── collapsed 반대
│   ├── aria-selected ──────── 현재 active
│   └── aria-posinset/setsize  형제 위치/총수
│
├── 6. Architecture ──────────── 한 화면, 한 위젯, 한 어댑터
│   ├── apps/outliner/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   └── index.tsx ──── 진입점
│   │   │   ├── widgets/
│   │   │   │   └── Outliner.tsx ─ ~80줄
│   │   │   ├── features/
│   │   │   │   └── outlineResource.ts ─ defineResource ~30줄
│   │   │   └── entities/
│   │   │       └── outlineNode.ts ───── zod schema
│   │   └── index.html
│   └── Data flow ───────────── data → ui → event → reducer → data (1방향)
│
├── 7. Adapter Contract ──────── 양쪽 어휘 매핑 (앱 내부)
│   ├── Read: JsonDoc → NormalizedData
│   │   └── fromFlatTree(doc.nodes, doc.rootId, accessors)
│   ├── Write: UiEvent → JsonCrud op
│   │   ├── activate{intent:'copy'}   → crud.copy(id)
│   │   ├── activate{intent:'cut'}    → crud.cut(id)
│   │   ├── activate{intent:'paste'}  → crud.paste(id, mode)
│   │   ├── activate{intent:'delete'} → crud.delete(id)
│   │   ├── activate{intent:'undo'}   → crud.undo()
│   │   ├── activate{intent:'redo'}   → crud.redo()
│   │   ├── update{id, text}          → crud.update(id, {...node, text})
│   │   ├── activate{intent:'indent'} → crud.cut + crud.paste
│   │   └── activate{intent:'outdent'}→ crud.cut + crud.paste
│   └── Focus: OperationResult.focusNodeId → roving active
│
├── 8. Acceptance Criteria ───── 어떻게 끝났음을 안다
│   ├── 키보드만으로 100% 인터랙션 가능 (마우스 0)
│   ├── tsc --noEmit 통과
│   ├── vite dev 콘솔 에러 0
│   ├── Cmd+Z 로 마지막 op 되돌림 (10단계 깊이까지)
│   ├── Cmd+X → Cmd+V 로 서브트리 이동, focus가 옮긴 노드에 있음
│   ├── Round-trip exactness — 모든 commit이 schema validate 통과
│   ├── HMR 후 state 보존 (localStorage serialize)
│   └── ARIA tree role 전 노드에 적용, axe 검사 위반 0
│
├── 9. Out of Scope ─────────── 명시적 비스코프
│   ├── 자체 treegrid 구현 ──── @p/headless 패턴 외 키보드 코드 ❌
│   ├── 새 어휘 도입 ────────── ARIA + zod-crud op 어휘만 사용
│   ├── 어댑터 패키지화 ─────── 코드는 app 안에만, 별도 npm 패키지 ❌
│   └── 시각 wrapper ────────── Tailwind utility 직접만, 컴포넌트 wrap ❌
│
└── 10. Bonus (거의 공짜) ────── 따라오는 시연 효과
    ├── localStorage persist ── state가 plain JSON
    ├── Markdown export ─────── deserialize → 재귀 string join
    ├── Replay ──────────────── undo stack 플레이백
    └── Public/private subtree  schema에 visibility 필드 추가만
```

## 거주지

`apps/outliner/` — ds repo 안. zod-crud는 npm dep으로 추가.
ds 쪽이 통합의 동기를 보여주는 자리(거버넌스 합의에 따름).
zod-crud는 자기 spec을 건드리지 않고 *피호출*만 받는다.
