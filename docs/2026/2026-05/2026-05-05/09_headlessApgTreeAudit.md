# `@p/headless` APG Pattern Audit Batch 2: Tree + Treegrid

Date: 2026-05-05

Scope: audit artifact only. No production code or test code changed.

Primary sources:
- W3C APG tree view pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
- W3C APG treegrid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/
- Batch seed: `docs/2026/2026-05/2026-05-05/07_headlessApgPatternAudit.md`

Verdict vocabulary follows the pilot schema.

## 1. Tree

External source: W3C APG `/treeview/`.

Implementation source:
- `useTreePattern`: `packages/headless/src/patterns/tree.ts:57`
- APG URL comment: `packages/headless/src/patterns/tree.ts:53`
- Public export: `packages/headless/src/patterns/index.ts:23`
- Existing axe smoke test: `packages/headless/src/patterns/a11y.test.tsx:78`

Pilot verdict: partial/fail candidate. Basic tree/treeitem roles, expanded state, declared level/position metadata, visible traversal, and typeahead are present. The largest APG mismatch is that the recipe exposes no `groupProps`, so hierarchical ownership required by APG is not representable through the pattern surface. Keyboard behavior also includes de facto extensions that contradict APG treeview text for end nodes, and multi-select range/select-all uses sibling semantics instead of visible tree semantics.

### Clause Results

| Clause | Classification | Verdict | Evidence |
|---|---|---|---|
| Tree container has `role="tree"` | required | pass | `rootProps.role = 'tree'` at `packages/headless/src/patterns/tree.ts:157` |
| Each tree node has `role="treeitem"` | required | pass | `itemProps` returns `role: 'treeitem'` at `packages/headless/src/patterns/tree.ts:167` |
| Tree has accessible name by `aria-label` or `aria-labelledby` | required | partial | API exposes `label`/`labelledBy` at `packages/headless/src/patterns/tree.ts:23`; root forwards both at `packages/headless/src/patterns/tree.ts:161`. No runtime enforcement. |
| Parent nodes contain or own a `group`; child nodes are contained in a parent-owned `group` | required | fail | `useTreePattern` returns only `rootProps`, `itemProps`, and `items` at `packages/headless/src/patterns/tree.ts:61`; there is no `groupProps` or `aria-owns` contract for nested children. |
| Parent nodes expose `aria-expanded`; end nodes omit it | required | pass | `itemProps` sets `aria-expanded` only when `it?.hasChildren` at `packages/headless/src/patterns/tree.ts:178` |
| Multi-select tree sets `aria-multiselectable=true` | required | pass | `multiSelectable` option at `packages/headless/src/patterns/tree.ts:18`; root prop at `packages/headless/src/patterns/tree.ts:159` |
| Selection state uses `aria-selected` or `aria-checked`, not both | required | pass | tree items set `aria-selected` at `packages/headless/src/patterns/tree.ts:175`; tree pattern does not emit `aria-checked` |
| Single-select tree does not expose multiple selected nodes | required | partial | item selected state mirrors host entities at `packages/headless/src/patterns/tree.ts:95`; pattern does not guard invalid host data when `multiSelectable` is false. |
| Unselected selectable nodes expose false state | required | pass | `aria-selected` falls back to `false` at `packages/headless/src/patterns/tree.ts:175` |
| Non-selectable nodes omit selection state | required | partial | recipe has no selectable/non-selectable item flag, so every rendered item receives `aria-selected=false` when not selected at `packages/headless/src/patterns/tree.ts:175` |
| Dynamic/declared tree position metadata is present | required | pass | `items` compute `level`, `posinset`, and `setsize` at `packages/headless/src/patterns/tree.ts:100`; `itemProps` forwards them at `packages/headless/src/patterns/tree.ts:179` |
| Focus enters single-select tree on selected node, otherwise first node | required | pass | roving default picks selected item or first enabled item at `packages/headless/src/roving/useRovingTabIndex.ts:21`; tree uses roving hook at `packages/headless/src/patterns/tree.ts:81` |
| Focus enters multi-select tree on first selected node, otherwise first node | required | pass | same roving evidence: `packages/headless/src/roving/useRovingTabIndex.ts:21`, `packages/headless/src/patterns/tree.ts:81` |
| Right Arrow on closed parent opens it without moving focus | required | pass | `treeExpand` maps closed branch to `{ type: 'expand', open: true }` at `packages/headless/src/axes/treeExpand.ts:47` |
| Right Arrow on open parent moves focus to first child | required | pass | `treeExpand` maps open branch to first enabled child navigation at `packages/headless/src/axes/treeExpand.ts:49` |
| Right Arrow on end node does nothing | required | fail | `treeExpand` explicitly maps leaf Right Arrow to next visible item at `packages/headless/src/axes/treeExpand.ts:53` |
| Left Arrow on open parent closes it | required | pass | `treeExpand` maps open branch close to `{ type: 'expand', open: false }` at `packages/headless/src/axes/treeExpand.ts:56` |
| Left Arrow on child end/closed node moves to parent | required | pass | `treeExpand` maps closed branch and leaf close to parent navigation at `packages/headless/src/axes/treeExpand.ts:56`; root parent is guarded at `packages/headless/src/axes/treeExpand.ts:18` |
| Down/Up move through visible focusable nodes without opening/closing | required | pass | `treeNavigate` uses `visibleEnabled` and clamps previous/next at `packages/headless/src/axes/treeNavigate.ts:18`; tests cover visible order at `packages/headless/src/axes/treeNavigate.test.ts:23` |
| Home/End move to first/last visible focusable node | required | pass | `treeNavigate` maps start/end at `packages/headless/src/axes/treeNavigate.ts:21`; tests cover Home/End at `packages/headless/src/axes/treeNavigate.test.ts:39` |
| Enter activates a node/default action | required | partial | axis composes `treeExpand` before `activate` at `packages/headless/src/patterns/tree.ts:46`; Enter toggles branch expansion at `packages/headless/src/axes/treeExpand.ts:61`; leaf activation falls through to `activate` at `packages/headless/src/axes/activate.ts:14` |
| Typeahead single and rapid multi-character search | recommended | pass | tree axis includes `typeahead` at `packages/headless/src/patterns/tree.ts:48`; typeahead implementation at `packages/headless/src/axes/typeahead.ts:18` |
| `*` expands all siblings at same level | optional | not-applicable | no star-key axis exists in `treeAxis` at `packages/headless/src/patterns/tree.ts:46` |
| Multi-select Space toggles focused node | recommended | pass | `treeAxis` includes `multiSelect` before tree navigation when multi-selectable at `packages/headless/src/patterns/tree.ts:46`; Space toggle is implemented at `packages/headless/src/axes/multiSelect.ts:44` |
| Multi-select Shift+Arrow extends/toggles next visible node | optional | fail | shared `multiSelect` range uses `enabledSiblings`, not visible tree order, at `packages/headless/src/axes/multiSelect.ts:35`; tree axis places it before `treeNavigate` at `packages/headless/src/patterns/tree.ts:46` |
| Multi-select Control+A selects all nodes | optional | fail | shared `multiSelect` select-all uses `enabledSiblings` at `packages/headless/src/axes/multiSelect.ts:46`; APG tree select-all applies to all nodes in the tree. |
| Single-select selection follows focus is optional | optional | pass | default `sff = !multiSelectable` at `packages/headless/src/patterns/tree.ts:70`; helper emits activate after navigate at `packages/headless/src/gesture/index.ts:18` |
| Horizontal tree remaps arrow directions | required | fail | `TreeOptions` exposes horizontal orientation at `packages/headless/src/patterns/tree.ts:14` and root forwards it at `packages/headless/src/patterns/tree.ts:160`, but `treeAxis` ignores orientation at `packages/headless/src/patterns/tree.ts:46` |

### Tree Gaps

1. Add or explicitly reject a `groupProps(parentId)` contract. Without it, APG hierarchical ownership is not expressible.
2. Decide whether leaf Right Arrow next-visible behavior should be removed, gated, or documented as non-APG de facto extension.
3. Split tree multi-select from listbox multi-select. Tree ranges/select-all must operate on visible tree order or all tree nodes, not same-parent siblings.
4. Remove horizontal orientation support or implement APG horizontal arrow remapping.
5. Add executable tree contract tests for hierarchy markup, leaf Right Arrow, visible traversal, and multi-select semantics.

## 2. Treegrid

External source: W3C APG `/treegrid/`.

Implementation source:
- `useTreeGridPattern`: `packages/headless/src/patterns/treeGrid.ts:65`
- APG URL comment: `packages/headless/src/patterns/treeGrid.ts:59`
- Public export: `packages/headless/src/patterns/index.ts:39`
- Existing axe smoke test: `packages/headless/src/patterns/a11y.test.tsx:93`

Pilot verdict: fail candidate for keyboard behavior. Role and structural props are largely present, but row-focus keyboard behavior is implemented through treeview axes. APG treegrid expects Right/Left to bridge row focus and cell focus; current row mode treats Right/Left as tree expand/collapse/descend. Cell mode covers basic 2D movement but omits several APG grid navigation keys and does not connect first-cell expansion.

### Clause Results

| Clause | Classification | Verdict | Evidence |
|---|---|---|---|
| Container has `role="treegrid"` | required | pass | `treegridProps.role = 'treegrid'` at `packages/headless/src/patterns/treeGrid.ts:187` |
| Each row container has `role="row"` | required | pass | `headerRowProps.role = 'row'` at `packages/headless/src/patterns/treeGrid.ts:204`; data rows return `role: 'row'` at `packages/headless/src/patterns/treeGrid.ts:209` |
| Cells use `columnheader`, `rowheader`, or `gridcell` roles | required | pass | column header at `packages/headless/src/patterns/treeGrid.ts:240`; row header at `packages/headless/src/patterns/treeGrid.ts:246`; grid cell at `packages/headless/src/patterns/treeGrid.ts:253` |
| Parent rows expose `aria-expanded`; leaf rows omit it | required | pass | row props set `aria-expanded` only when `it?.hasChildren` at `packages/headless/src/patterns/treeGrid.ts:219` and `packages/headless/src/patterns/treeGrid.ts:233` |
| Multi-select treegrid sets `aria-multiselectable=true` | required | pass | `multiSelectable` option at `packages/headless/src/patterns/treeGrid.ts:15`; root prop at `packages/headless/src/patterns/treeGrid.ts:189` |
| Single-select selected row/cell has `aria-selected=true`; others omit it | required | partial | row mode always emits `aria-selected` as true/false at `packages/headless/src/patterns/treeGrid.ts:232`; APG says single-select non-selected rows/cells should not have the attribute. |
| Multi-select selected rows/cells true and unselected false | required | pass | row mode emits true/false selected state at `packages/headless/src/patterns/treeGrid.ts:232`; cell mode row selection branch at `packages/headless/src/patterns/treeGrid.ts:218` |
| Treegrid has accessible name by `aria-label` or `aria-labelledby` | required | partial | API exposes `label`/`labelledBy` at `packages/headless/src/patterns/treeGrid.ts:20`; root forwards both at `packages/headless/src/patterns/treeGrid.ts:191`. No runtime enforcement. |
| Caption/description can be referenced with `aria-describedby` | host-responsibility | not-applicable | no described-by option exists in `TreeGridOptions` at `packages/headless/src/patterns/treeGrid.ts:9`; host can add/override ARIA when composing markup. |
| Sortable headers expose `aria-sort` | host-responsibility | not-applicable | sort is not represented in `TreeGridOptions` at `packages/headless/src/patterns/treeGrid.ts:9`; host owns sort headers. |
| Read-only/editability state is represented when editing exists | optional | partial | `editable` controls key handling at `packages/headless/src/patterns/treeGrid.ts:32`; no `aria-readonly` is emitted on root or cells. |
| Dynamic row/column counts and indexes are present | required | pass | root emits `aria-rowcount`/`aria-colcount` at `packages/headless/src/patterns/treeGrid.ts:193`; rows/cells emit indexes at `packages/headless/src/patterns/treeGrid.ts:217` and `packages/headless/src/patterns/treeGrid.ts:240` |
| Row mode Down/Up moves row focus without wrapping | required | pass | row mode delegates to `treeNavigate`, which clamps visible order at `packages/headless/src/axes/treeNavigate.ts:18`; treegrid row mode installs delegate at `packages/headless/src/patterns/treeGrid.ts:195` |
| Row mode Right on collapsed row expands it | required | pass | row mode axis uses `treeExpand` at `packages/headless/src/patterns/treeGrid.ts:51`; closed branch expands at `packages/headless/src/axes/treeExpand.ts:47` |
| Row mode Right on expanded/leaf row moves focus to first cell | required | fail | row mode uses treeview `treeExpand`; open branch moves to first child row at `packages/headless/src/axes/treeExpand.ts:49`, and leaf moves to next visible row at `packages/headless/src/axes/treeExpand.ts:53` |
| Row mode Left on expanded row collapses it | required | pass | row mode uses `treeExpand`; open branch close at `packages/headless/src/axes/treeExpand.ts:56` |
| Row mode Left on collapsed/leaf row does not move | required | fail | treeview `treeExpand` moves closed/leaf child rows to parent at `packages/headless/src/axes/treeExpand.ts:56`; APG treegrid says collapsed or childless row focus should not move. |
| Cell mode Right/Left moves horizontally and clamps at row ends | required | pass | cell keydown handles left/right and clamps via `moveCell` at `packages/headless/src/patterns/treeGrid.ts:140` and `packages/headless/src/patterns/treeGrid.ts:171` |
| Cell mode Up/Down moves vertically and clamps at grid edges | required | pass | cell keydown handles up/down at `packages/headless/src/patterns/treeGrid.ts:171`; `moveCell` clamps row index at `packages/headless/src/patterns/treeGrid.ts:140` |
| Cell mode Home/End move to first/last cell in row | required | pass | cell keydown maps rowStart/rowEnd at `packages/headless/src/patterns/treeGrid.ts:177` |
| Control+Home/Control+End move to first/last row or cell | required | fail | `cellModeKeyDown` does not handle `INTENTS.gridNavigate.gridStart` or `gridEnd` at `packages/headless/src/patterns/treeGrid.ts:171`; row mode uses treeNavigate Home/End only, not Control+Home/End. |
| PageUp/PageDown row/cell navigation | required | fail | `treeGridAxis` does not include `pageNavigate` at `packages/headless/src/patterns/treeGrid.ts:51`; `cellModeKeyDown` has no PageUp/PageDown branch at `packages/headless/src/patterns/treeGrid.ts:171` |
| Tab moves through focusable elements in row or exits treegrid | required | partial | non-edit mode does not intercept Tab, so browser default applies; editable mode intercepts Tab and emits activate at `packages/headless/src/patterns/treeGrid.ts:163`, which conflicts with APG editing/navigation guidance. |
| Cell-only Enter on first expandable cell opens/closes child rows | required | fail | cell mode Enter always emits activate for row id at `packages/headless/src/patterns/treeGrid.ts:179`; no first-cell `aria-expanded`/expand branch exists. |
| Selection shortcuts for treegrid cells/rows are supported | optional | partial | row mode multi-select reuses tree/list `multiSelect` at `packages/headless/src/patterns/treeGrid.ts:52`; cell mode has no grid multi-select axis despite `gridMultiSelect` existing elsewhere. |
| Row/cell focus strategy variants are declared | optional | pass | `navigationMode?: 'row' | 'cell' | 'cellOnly'` is documented at `packages/headless/src/patterns/treeGrid.ts:25` |

### Treegrid Gaps

1. Separate treegrid row-focus keyboard behavior from treeview behavior. Reusing `treeExpand` makes Right/Left rules wrong for open/leaf/collapsed child rows.
2. Add Control+Home, Control+End, PageUp, and PageDown support or classify them as intentionally out of scope.
3. Implement first-cell expansion for `cellOnly` mode if that mode is kept.
4. Clarify single-select `aria-selected` contract: APG treegrid differs from tree/listbox by saying non-selected rows/cells omit the attribute in single-select mode.
5. Add executable treegrid contract tests for row-focus Right/Left, cell-focus 2D movement, Control+Home/End, PageUp/PageDown, and selection shortcut semantics.

## 3. Batch Result

| Pattern | Verdict | Main risk |
|---|---|---|
| `useTreePattern` | partial/fail candidate | missing group ownership contract; APG leaf Right Arrow mismatch; tree multi-select reuses sibling semantics |
| `useTreeGridPattern` | fail candidate | row-focus keyboard behavior reuses treeview semantics instead of treegrid row/cell semantics |

Recommended next batch: `useMenuPattern`, `useMenuButtonPattern`, and `useMenubarPattern`, because popup/open/close ownership and submenu navigation need their own APG mapping.

