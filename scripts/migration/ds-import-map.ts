// PRD: prd-immutable-anchor.md — ds 3-layer reorg
// 외부 deep import 경로 매핑 (Phase 3 codemod 입력)
//
// 현재 외부(apps/* + showcase/*) deep import 80건. 그 중 co-location만으로 경로가
// 보존되는 것은 unchanged로 표기 — codemod 대상 아님.
//
// 검증 방법:
//   pnpm tsx scripts/migration/inventory.mjs
//
// 분류:
// - "rewrite": 경로 prefix 교체 필요 (Phase 3 codemod 적용)
// - "preserved": 폴더명 동일 + co-location은 index.ts(x) 해석으로 흡수 — codemod 불필요
// - "moved": 다른 레이어로 이동 (codemod 필요)

export type MigrationKind = 'rewrite' | 'preserved' | 'moved'

export interface MigrationRule {
  from: string
  to: string
  kind: MigrationKind
  reason: string
}

export const MIGRATION_RULES: MigrationRule[] = [
  // ─── L1 Tokens ──────────────────────────────────────────────────────────
  {
    from: '@p/ds/foundations',
    to: '@p/ds/tokens/foundations',
    kind: 'rewrite',
    reason: 'foundations → tokens/foundations (L1)',
  },
  {
    from: '@p/ds/foundations/iconography/icon',
    to: '@p/ds/tokens/foundations/iconography/icon',
    kind: 'rewrite',
    reason: 'foundations 하위는 모두 tokens/ 아래로',
  },
  {
    from: '@p/ds/style/preset',
    to: '@p/ds/tokens/internal/preset',
    kind: 'rewrite',
    reason: 'style/{seed,preset,shell,states} → tokens/internal/*',
  },
  {
    from: '@p/ds/style/preset/breakpoints',
    to: '@p/ds/tokens/internal/preset/breakpoints',
    kind: 'rewrite',
    reason: 'style/preset 하위',
  },

  // ─── L2 Headless ────────────────────────────────────────────────────────
  {
    from: '@p/ds/core/hooks/useShortcut',
    to: '@p/ds/headless/hooks/useShortcut',
    kind: 'rewrite',
    reason: 'core/* → headless/* (L2)',
  },
  {
    from: '@p/ds/layout/recipes',
    to: '@p/ds/ui/recipes',
    kind: 'moved',
    reason: 'layout 엔진은 headless로, recipes는 L3 ui/recipes로 분리',
  },
  {
    from: '@p/ds/layout/recipes/sidebar',
    to: '@p/ds/ui/recipes/sidebar',
    kind: 'moved',
    reason: 'layout/recipes/* → ui/recipes/*',
  },

  // ─── L3 UI parts ────────────────────────────────────────────────────────
  {
    from: '@p/ds/parts',
    to: '@p/ds/ui/6-structure',
    kind: 'rewrite',
    reason: 'parts/ → ui/6-structure/ (data-part namespace 보존, ui/ 하위로 흡수)',
  },
  {
    from: '@p/ds/parts/Table',
    to: '@p/ds/ui/6-structure/Table',
    kind: 'rewrite',
    reason: 'parts/<Name> → ui/6-structure/<Name>/(index.tsx)',
  },
  {
    from: '@p/ds/parts/Card',
    to: '@p/ds/ui/6-structure/Card',
    kind: 'rewrite',
    reason: 'parts/<Name> → ui/6-structure/<Name>/(index.tsx)',
  },

  // ─── L3 UI tier (co-location 흡수, 경로 보존) ─────────────────────────────
  // ui/<tier>/<Name>.tsx → ui/<tier>/<Name>/index.tsx + style.ts
  // 외부 import `@p/ds/ui/<tier>/<Name>`는 그대로 동작
  {
    from: '@p/ds/ui/6-structure/CodeBlock',
    to: '@p/ds/ui/6-structure/CodeBlock',
    kind: 'preserved',
    reason: 'co-location: 파일 → 폴더+index.tsx, import 경로 보존',
  },
  {
    from: '@p/ds/ui/6-structure/Prose',
    to: '@p/ds/ui/6-structure/Prose',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/1-command/Button',
    to: '@p/ds/ui/1-command/Button',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Switch',
    to: '@p/ds/ui/2-input/Switch',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-input/Field',
    to: '@p/ds/ui/3-input/Field',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Input',
    to: '@p/ds/ui/2-input/Input',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Textarea',
    to: '@p/ds/ui/2-input/Textarea',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Slider',
    to: '@p/ds/ui/2-input/Slider',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Select',
    to: '@p/ds/ui/2-input/Select',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/SearchBox',
    to: '@p/ds/ui/2-input/SearchBox',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/2-input/Option',
    to: '@p/ds/ui/2-input/Option',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/Menubar',
    to: '@p/ds/ui/3-composite/Menubar',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/MenuList',
    to: '@p/ds/ui/3-composite/MenuList',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/MenuGroup',
    to: '@p/ds/ui/3-composite/MenuGroup',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/ListboxGroup',
    to: '@p/ds/ui/3-composite/ListboxGroup',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/DataGrid',
    to: '@p/ds/ui/3-composite/DataGrid',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/DataGridRow',
    to: '@p/ds/ui/3-composite/DataGridRow',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/TreeGrid',
    to: '@p/ds/ui/3-composite/TreeGrid',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/TreeRow',
    to: '@p/ds/ui/3-composite/TreeRow',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/RowGroup',
    to: '@p/ds/ui/3-composite/RowGroup',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/RowHeader',
    to: '@p/ds/ui/3-composite/RowHeader',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/ColumnHeader',
    to: '@p/ds/ui/3-composite/ColumnHeader',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/GridCell',
    to: '@p/ds/ui/3-composite/GridCell',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/3-composite/OrderableList',
    to: '@p/ds/ui/3-composite/OrderableList',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/4-window/Dialog',
    to: '@p/ds/ui/4-window/Dialog',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/6-structure/Disclosure',
    to: '@p/ds/ui/6-structure/Disclosure',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/4-window/Sheet',
    to: '@p/ds/ui/4-window/Sheet',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/4-window/MenuPopover',
    to: '@p/ds/ui/4-window/MenuPopover',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/4-window/FloatingNav',
    to: '@p/ds/ui/4-window/FloatingNav',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/6-overlay/command/CommandPalette',
    to: '@p/ds/ui/6-overlay/command/CommandPalette',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/8-layout/Split',
    to: '@p/ds/ui/8-layout/Split',
    kind: 'preserved',
    reason: 'co-location 보존',
  },
  {
    from: '@p/ds/ui/8-layout/ZoomPanCanvas',
    to: '@p/ds/ui/8-layout/ZoomPanCanvas',
    kind: 'preserved',
    reason: 'co-location 보존',
  },

  // ─── L3 비즈니스 → content ──────────────────────────────────────────────
  {
    from: '@p/ds/ui/7-patterns/FeedPost',
    to: '@p/ds/content/FeedPost',
    kind: 'moved',
    reason: '비즈니스 콘텐츠 (도메인 객체 props) → content/',
  },
  {
    from: '@p/ds/ui/7-patterns/ContractCard',
    to: '@p/ds/content/ContractCard',
    kind: 'moved',
    reason: '비즈니스 콘텐츠 → content/',
  },

  // ─── L3 도메인 중립 patterns → ui/patterns ────────────────────────────────
  {
    from: '@p/ds/ui/7-patterns/FeedArticle',
    to: '@p/ds/ui/patterns/FeedArticle',
    kind: 'moved',
    reason: '도메인 중립 wrapper → ui/patterns/',
  },

  // ─── devices (변경 없음) ─────────────────────────────────────────────────
  {
    from: '@p/ds/devices/MobileFrame',
    to: '@p/ds/devices/MobileFrame',
    kind: 'preserved',
    reason: 'devices/ 위치 유지',
  },
]

// Phase 3 codemod 실행 시 사용할 prefix-rewrite 룰.
export const REWRITE_PREFIXES = MIGRATION_RULES
  .filter((r) => r.kind === 'rewrite' || r.kind === 'moved')
  .filter((r) => r.from !== r.to)
  // 더 긴 경로(prefix가 더 구체)가 먼저 매칭되도록 내림차순 정렬
  .sort((a, b) => b.from.length - a.from.length)
  .map((r) => ({ from: r.from, to: r.to, reason: r.reason }))
