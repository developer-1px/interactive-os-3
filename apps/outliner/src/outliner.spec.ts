/**
 * outliner.spec — 앱 전체의 declarative SSOT (Feature-shaped).
 *
 * 4 영역 (domain · pattern · commands · view) 으로 구획. 다른 모든 파일은 이 spec 만 read.
 * commands 는 ARIA tree 패턴이 emit 하는 chord registry 를 그대로 재노출 — 앱 SSOT 가
 * 사용자 어휘 전체를 보여준다 (재선언 없음, 패턴 ↔ 앱 경계 명시).
 */
import { z } from 'zod'
import type { TreeCommandDescriptor } from '@p/headless/patterns'

export type OutlineNode = { text: string; children: OutlineNode[] }

const OutlineNodeSchema: z.ZodType<OutlineNode> = z.object({
  text: z.string(),
  get children() {
    return z.array(OutlineNodeSchema)
  },
})

const SAMPLE: OutlineNode = {
  text: 'Welcome to the outliner',
  children: [
    { text: 'Press Enter to add a sibling', children: [] },
    { text: 'Press Tab to indent, Shift+Tab to outdent', children: [] },
    {
      text: 'Cmd+C / Cmd+X / Cmd+V — clipboard',
      children: [
        { text: 'paste-as-sibling: Cmd+V', children: [] },
        { text: 'paste-as-child:   Cmd+Shift+V', children: [] },
      ],
    },
    { text: 'Cmd+Z / Cmd+Shift+Z — undo / redo', children: [] },
    { text: 'Backspace — delete', children: [] },
  ],
}

export const outlinerSpec = {
  // ── ① Domain ──────────────────────────────────────────────────────────
  /** 재귀 outline node ({text, children[]}). zod-crud 가 schema 로 CRUD 자동 생성. */
  entity: OutlineNodeSchema,
  /** 초기 상태 — 세션 시작 시 보이는 SAMPLE outline. */
  initial: SAMPLE,
  /** 인라인 편집 시 update target — entity 의 child 노드 key. */
  labelField: 'text' as const,
  /** insertAfter/appendChild 가 value 없이 올 때의 schema-aware 기본값. */
  emptyValue: { text: '', children: [] } as OutlineNode,
  /** Persistence policy — 메모리 only (세션 종료 시 SAMPLE 복귀). */
  persistence: 'memory' as const,

  // ── ② ARIA Pattern ────────────────────────────────────────────────────
  /** 따르는 W3C APG recipe. */
  ariaPattern: 'tree' as const,
  /** Pattern 옵션 — useTreePattern 에 그대로 패스 (commands 는 별도 필드). */
  patternOptions: {
    label: 'outline',
  },

  // ── ③ Commands (사용자 어휘) — Outliner 가 정의하는 keymap SSOT ──────
  /** chord ↔ tree command 매핑. Outliner 의 정체. KeymapPanel 도 이걸 표시. */
  commands: [
    { chord: 'Enter',       command: 'editStart',     description: 'Rename — enter inline edit' },
    { chord: 'Shift+Enter', command: 'insertAfter',   description: 'Insert sibling (or child if root)' },
    { chord: 'Backspace',   command: 'remove',        description: 'Remove focused item' },
    { chord: 'Delete',      command: 'remove',        description: 'Remove focused item' },
    { chord: 'Tab',         command: 'demote',        description: 'Demote — move under previous sibling' },
    { chord: 'Shift+Tab',   command: 'promote',       description: 'Promote — move out of parent' },
    { chord: 'mod+z',       command: 'undo',          description: 'Undo last operation' },
    { chord: 'mod+shift+z', command: 'redo',          description: 'Redo' },
    { chord: 'mod+y',       command: 'redo',          description: 'Redo (Windows fallback)' },
    { chord: 'mod+shift+v', command: 'paste-as-child', description: 'Paste as child of focused item' },
  ] as readonly TreeCommandDescriptor[],
} as const
