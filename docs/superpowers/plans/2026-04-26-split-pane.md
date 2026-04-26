# Split — N-pane resize primitive Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `data-ds="Split"` layout primitive — N-pane resize via separator drag, uncontrolled with `id`-based localStorage persistence, full-height by default.

**Architecture:** CSS Grid 단일 트랙축. 자식 사이에 `role="separator"` 자동 삽입. Pointer drag로 인접 두 panel의 fr 비율 갱신. `id` 있으면 localStorage 영속화. Wrapper class 없음(classless 원칙). Row/Column/Grid와 형제 layer.

**Tech Stack:** React 19, TypeScript, Vite. 검증 수단: `pnpm build` (tsc + vite), `pnpm lint:ds:all`, 데모 라우트 시각 확인.

**Spec:** `docs/superpowers/specs/2026-04-26-split-pane-design.md`

---

## File Structure

- **Create** `src/ds/style/widgets/layout/split.ts` — Split CSS (data-ds="Split", separator hover, axis 분기)
- **Create** `src/ds/ui/8-layout/Split.tsx` — Split 컴포넌트 (드래그 로직, separator 삽입, localStorage)
- **Create** `src/ds/ui/8-layout/Split.demo.tsx` — 카탈로그 데모
- **Modify** `src/ds/style/widgets/index.ts` — splitCss 등록
- **Modify** `src/ds/style/widgets/layout/layout.ts` — `data-ds="Row|Column"` 셀렉터 주석에 Split 추가 (선택)

---

### Task 1: Split CSS — minimal grid structure

**Files:**
- Create: `src/ds/style/widgets/layout/split.ts`

- [ ] **Step 1: Create split.ts with grid-based base styles**

```ts
// src/ds/style/widgets/layout/split.ts
import { css, control, hairlineWidth } from '../../../foundations'

/**
 * Split — N-pane resize layout primitive.
 *
 * - data-ds="Split" + data-axis="row|column" — only structural identifier.
 * - 항상 full-height (min-block-size: 100%).
 * - 자식 panel 사이에 [role="separator"][data-ds-handle]가 Split.tsx에서 자동 삽입된다.
 *   grid-template-{cols|rows}는 panel/separator 트랙을 인라인 style로 주입(Split.tsx).
 * - separator는 평소 invisible, hover/active 시 1px hairline. hit area는 separator 트랙(8px).
 * - Tab 흐름 미오염: separator는 tabIndex=-1 (Split.tsx에서 부여).
 */
export const splitCss = () => css`
  [data-ds="Split"] {
    display: grid;
    min-block-size: 100%;
    min-inline-size: 0;
  }

  [data-ds="Split"][data-axis="row"]    { grid-auto-flow: column; }
  [data-ds="Split"][data-axis="column"] { grid-auto-flow: row; }

  /* separator — 자동 삽입, classless: role + data-ds-handle만으로 식별 */
  [data-ds="Split"] > [role="separator"][data-ds-handle] {
    position: relative;
    background: transparent;
    touch-action: none;
    user-select: none;
  }
  [data-ds="Split"][data-axis="row"]    > [role="separator"][data-ds-handle] { cursor: col-resize; }
  [data-ds="Split"][data-axis="column"] > [role="separator"][data-ds-handle] { cursor: row-resize; }

  /* hairline — separator 중앙 1px, 평소 투명 */
  [data-ds="Split"] > [role="separator"][data-ds-handle]::before {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    background: ${control('border')};
    opacity: 0;
    transition: opacity 120ms;
  }
  [data-ds="Split"][data-axis="row"]    > [role="separator"][data-ds-handle]::before {
    inline-size: ${hairlineWidth()};
    block-size: 100%;
  }
  [data-ds="Split"][data-axis="column"] > [role="separator"][data-ds-handle]::before {
    block-size: ${hairlineWidth()};
    inline-size: 100%;
  }
  [data-ds="Split"] > [role="separator"][data-ds-handle]:hover::before,
  [data-ds="Split"] > [role="separator"][data-ds-handle][data-active="true"]::before {
    opacity: 1;
  }

  /* 드래그 중: 전역 cursor 강제 (페이지 어디든 col/row-resize) */
  [data-ds="Split"][data-dragging="row"]    * { cursor: col-resize !important; }
  [data-ds="Split"][data-dragging="column"] * { cursor: row-resize !important; }
`
```

- [ ] **Step 2: Register in widgets index**

Modify `src/ds/style/widgets/index.ts`:
1. After `import { layout } from './layout/layout'` add: `import { splitCss } from './layout/split'`
2. In the `widgets()` array, near `layout`, add `splitCss,` (call form: layout is `layout` not `layout()`, match the surrounding pattern — check the file and follow it).

Read `src/ds/style/widgets/index.ts` end of file first to see whether entries are written as bare names or with `()`. Mirror the existing pattern.

- [ ] **Step 3: Verify typecheck**

Run: `pnpm build`
Expected: builds without TS errors. (Lint warnings unrelated to Split are OK — pre-existing.)

- [ ] **Step 4: Commit**

```bash
git add src/ds/style/widgets/layout/split.ts src/ds/style/widgets/index.ts
git commit -m "feat(ds/style): Split CSS — grid-based N-pane layout + separator hover"
```

---

### Task 2: Split.tsx — minimal static render (no drag yet)

Goal: Render `data-ds="Split"` with separators between children, fixed equal fr distribution. No drag, no localStorage.

**Files:**
- Create: `src/ds/ui/8-layout/Split.tsx`

- [ ] **Step 1: Write Split.tsx with static rendering**

```tsx
// src/ds/ui/8-layout/Split.tsx
import { Children, Fragment, type ComponentPropsWithoutRef, type ReactNode } from 'react'

export type SplitAxis = 'row' | 'column'

export type SplitProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  /** localStorage 영속화 키. 생략 시 메모리 전용. */
  id?: string
  /** 분배 축. 기본 'row'. */
  axis?: SplitAxis
  /** fr 비율 배열. 자식 수와 길이가 다르면 1로 채움. */
  defaultSizes?: number[]
  /** px 단위 최소 폭. number면 모든 panel에 동일 적용. */
  minSizes?: number | number[]
  children?: ReactNode
}

const SEPARATOR_TRACK = '8px'

/** N개 자식 사이에 separator(N-1개)를 삽입한다. */
function withSeparators(children: ReactNode, axis: SplitAxis): ReactNode[] {
  const arr = Children.toArray(children).filter(Boolean)
  const out: ReactNode[] = []
  arr.forEach((child, i) => {
    out.push(<Fragment key={`p-${i}`}>{child}</Fragment>)
    if (i < arr.length - 1) {
      out.push(
        <div
          key={`s-${i}`}
          role="separator"
          aria-orientation={axis === 'row' ? 'vertical' : 'horizontal'}
          tabIndex={-1}
          data-ds-handle
          data-index={i}
        />
      )
    }
  })
  return out
}

function trackTemplate(sizes: number[], axis: SplitAxis): string {
  // panel | separator | panel | separator | ... | panel
  const tracks: string[] = []
  sizes.forEach((s, i) => {
    tracks.push(`${s}fr`)
    if (i < sizes.length - 1) tracks.push(SEPARATOR_TRACK)
  })
  return tracks.join(' ')
}

export function Split({
  id,
  axis = 'row',
  defaultSizes,
  minSizes,
  children,
  style,
  ...rest
}: SplitProps) {
  const arr = Children.toArray(children).filter(Boolean)
  const n = arr.length

  // fr 비율 — 자식 수와 길이 정합 (부족하면 1로 채움, 남으면 잘라냄)
  const sizes: number[] =
    n === 0
      ? []
      : Array.from({ length: n }, (_, i) => defaultSizes?.[i] ?? 1)

  const template = trackTemplate(sizes, axis)
  const templateProp =
    axis === 'row' ? { gridTemplateColumns: template } : { gridTemplateRows: template }

  return (
    <div
      data-ds="Split"
      data-axis={axis}
      style={{ ...templateProp, ...style }}
      {...rest}
    >
      {withSeparators(children, axis)}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: TypeScript compile passes.

- [ ] **Step 3: Commit**

```bash
git add src/ds/ui/8-layout/Split.tsx
git commit -m "feat(ds/ui): Split static render — N-pane grid + auto-inserted separators"
```

---

### Task 3: Split.demo.tsx — visual sanity check

**Files:**
- Create: `src/ds/ui/8-layout/Split.demo.tsx`

- [ ] **Step 1: Write demo**

```tsx
// src/ds/ui/8-layout/Split.demo.tsx
import { Split } from './Split'

export default function SplitDemo() {
  const cellStyle = {
    padding: 12,
    background: 'color-mix(in oklch, Canvas 92%, CanvasText)',
    minBlockSize: 120,
  } as const
  return (
    <Split id="demo-split-3" axis="row" defaultSizes={[1, 2, 3]} minSizes={120}>
      <div style={cellStyle}>A (1fr)</div>
      <div style={cellStyle}>B (2fr)</div>
      <div style={cellStyle}>C (3fr)</div>
    </Split>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/ds/ui/8-layout/Split.demo.tsx
git commit -m "feat(ds/ui): Split.demo — 3-pane row example"
```

---

### Task 4: Drag logic — pointer events update sizes

Goal: pointer drag on separator updates the two adjacent panels' fr ratios. No localStorage yet.

**Files:**
- Modify: `src/ds/ui/8-layout/Split.tsx`

- [ ] **Step 1: Add drag state + pointer handlers**

Replace the entire body of `Split.tsx` with:

```tsx
import {
  Children,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

export type SplitAxis = 'row' | 'column'

export type SplitProps = Omit<ComponentPropsWithoutRef<'div'>, 'role'> & {
  id?: string
  axis?: SplitAxis
  defaultSizes?: number[]
  minSizes?: number | number[]
  children?: ReactNode
}

const SEPARATOR_TRACK_PX = 8

function normalizeSizes(n: number, defaults?: number[]): number[] {
  if (n <= 0) return []
  return Array.from({ length: n }, (_, i) => {
    const v = defaults?.[i]
    return typeof v === 'number' && v > 0 ? v : 1
  })
}

function normalizeMins(n: number, mins?: number | number[]): number[] {
  if (typeof mins === 'number') return Array.from({ length: n }, () => mins)
  if (Array.isArray(mins)) return Array.from({ length: n }, (_, i) => mins[i] ?? 120)
  return Array.from({ length: n }, () => 120)
}

function trackTemplate(sizes: number[]): string {
  const tracks: string[] = []
  sizes.forEach((s, i) => {
    tracks.push(`${s}fr`)
    if (i < sizes.length - 1) tracks.push(`${SEPARATOR_TRACK_PX}px`)
  })
  return tracks.join(' ')
}

export function Split({
  id,
  axis = 'row',
  defaultSizes,
  minSizes,
  children,
  style,
  ...rest
}: SplitProps) {
  const arr = Children.toArray(children).filter(Boolean)
  const n = arr.length
  const mins = useMemo(() => normalizeMins(n, minSizes), [n, minSizes])

  const [sizes, setSizes] = useState<number[]>(() => normalizeSizes(n, defaultSizes))
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)

  // 자식 수 변화 시 sizes 길이 재정합
  useEffect(() => {
    setSizes(prev => {
      if (prev.length === n) return prev
      if (n === 0) return []
      return Array.from({ length: n }, (_, i) => prev[i] ?? defaultSizes?.[i] ?? 1)
    })
    // defaultSizes는 의도적으로 deps에서 제외 — 자식 수 변화에만 반응
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n])

  const rootRef = useRef<HTMLDivElement | null>(null)

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>, sepIndex: number) => {
      // sepIndex: 좌측 panel index (= sepIndex), 우측 panel index = sepIndex + 1
      const root = rootRef.current
      if (!root) return
      e.preventDefault()
      ;(e.target as Element).setPointerCapture?.(e.pointerId)
      setDraggingIndex(sepIndex)

      const rect = root.getBoundingClientRect()
      const totalPx = axis === 'row' ? rect.width : rect.height
      // separator 트랙들 제외한 실제 panel 영역의 합
      const panelsPx = totalPx - SEPARATOR_TRACK_PX * Math.max(0, n - 1)
      const startSizes = sizes.slice()
      const sumFr = startSizes.reduce((a, b) => a + b, 0) || 1
      const startPx = startSizes.map(s => (s / sumFr) * panelsPx)
      const startCoord = axis === 'row' ? e.clientX : e.clientY

      const onMove = (ev: PointerEvent) => {
        const coord = axis === 'row' ? ev.clientX : ev.clientY
        const delta = coord - startCoord
        const left = sepIndex
        const right = sepIndex + 1

        let leftPx = startPx[left] + delta
        let rightPx = startPx[right] - delta

        // clamp by min sizes — 양쪽 인접 panel만 영향
        const minLeft = mins[left] ?? 120
        const minRight = mins[right] ?? 120
        if (leftPx < minLeft) {
          rightPx -= minLeft - leftPx
          leftPx = minLeft
        }
        if (rightPx < minRight) {
          leftPx -= minRight - rightPx
          rightPx = minRight
        }

        const nextPx = startPx.slice()
        nextPx[left] = leftPx
        nextPx[right] = rightPx

        // px → fr (총합 보존)
        const total = nextPx.reduce((a, b) => a + b, 0) || 1
        const next = nextPx.map(px => (px / total) * sumFr)
        setSizes(next)
      }
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
        setDraggingIndex(null)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [axis, mins, n, sizes]
  )

  const template = trackTemplate(sizes)
  const templateProp =
    axis === 'row' ? { gridTemplateColumns: template } : { gridTemplateRows: template }

  // Render panels with auto-inserted separators
  const out: ReactNode[] = []
  arr.forEach((child, i) => {
    out.push(<Fragment key={`p-${i}`}>{child}</Fragment>)
    if (i < arr.length - 1) {
      const sumFr = sizes.reduce((a, b) => a + b, 0) || 1
      const valueNow = Math.round(((sizes.slice(0, i + 1).reduce((a, b) => a + b, 0)) / sumFr) * 100)
      out.push(
        <div
          key={`s-${i}`}
          role="separator"
          aria-orientation={axis === 'row' ? 'vertical' : 'horizontal'}
          aria-valuenow={valueNow}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={-1}
          data-ds-handle
          data-index={i}
          data-active={draggingIndex === i ? 'true' : undefined}
          onPointerDown={e => onPointerDown(e, i)}
        />
      )
    }
  })

  return (
    <div
      ref={rootRef}
      data-ds="Split"
      data-axis={axis}
      data-dragging={draggingIndex !== null ? axis : undefined}
      style={{ ...templateProp, ...style }}
      {...rest}
    >
      {out}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 3: Manual visual check (run dev server)**

Run: `pnpm dev` (background) and open the demo route that exposes Split.demo (carousel/foundations 데모 라우트, 또는 Split.demo를 직접 import하는 임시 라우트). Confirm: drag separator → adjacent panels resize, others fixed, min-width clamp works, page-wide cursor change during drag.

If no demo route renders Split.demo automatically, add one in next task.

- [ ] **Step 4: Commit**

```bash
git add src/ds/ui/8-layout/Split.tsx
git commit -m "feat(ds/ui): Split drag — pointer drag updates adjacent panels with min clamp"
```

---

### Task 5: localStorage persistence

Goal: when `id` is set, persist sizes across reloads.

**Files:**
- Modify: `src/ds/ui/8-layout/Split.tsx`

- [ ] **Step 1: Add storage helpers + wire useEffect**

In `Split.tsx`, add the following helpers above the `Split` function:

```tsx
const STORAGE_PREFIX = 'ds:split:'

function loadSizes(id: string | undefined, n: number): number[] | null {
  if (!id || typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + id)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length !== n) return null
    if (!parsed.every(v => typeof v === 'number' && v > 0 && Number.isFinite(v))) return null
    return parsed as number[]
  } catch {
    return null
  }
}

function saveSizes(id: string | undefined, sizes: number[]): void {
  if (!id || typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(sizes))
  } catch {
    /* quota / private mode — silent */
  }
}
```

Then change the `useState` initializer to read from storage first:

```tsx
const [sizes, setSizes] = useState<number[]>(() => {
  const stored = loadSizes(id, n)
  if (stored) return stored
  return normalizeSizes(n, defaultSizes)
})
```

And persist on `pointerup` — replace the `onUp` handler inside `onPointerDown` to commit:

```tsx
const onUp = () => {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
  window.removeEventListener('pointercancel', onUp)
  setDraggingIndex(null)
  // commit current sizes to storage
  setSizes(curr => {
    saveSizes(id, curr)
    return curr
  })
}
```

Note: `setSizes` inside `onUp` is used as a getter — pass-through callback returns `curr` unchanged but lets us read latest state.

- [ ] **Step 2: Verify build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 3: Manual check**

Drag separator, reload page → sizes persist. Different `id`s store independently.

- [ ] **Step 4: Commit**

```bash
git add src/ds/ui/8-layout/Split.tsx
git commit -m "feat(ds/ui): Split persistence — id-based localStorage save/load"
```

---

### Task 6: Demo route + final lint check

Goal: ensure Split.demo is rendered somewhere viewable, run lint:ds:all to confirm no new violations.

**Files:**
- Possibly modify: a demo registry, or rely on existing convention

- [ ] **Step 1: Find how other layout demos are exposed**

Run: `grep -rn "Grid.demo\|Row.demo\|Column.demo" src/routes/ | head`
Expected: locate the demo registry/route. Mirror that pattern for `Split.demo`.

If no auto-discovery, add an entry in the catalog/foundations demo route in the same way Row.demo/Column.demo/Grid.demo are added.

- [ ] **Step 2: Register Split.demo in the same place(s)**

Edit the file(s) found in step 1, adding the same kind of entry for `Split.demo` as Grid.demo has. (Code differs per registry — reuse the existing pattern verbatim, just with Split.)

- [ ] **Step 3: Run full lint suite**

Run: `pnpm lint:ds:all`
Expected: no NEW 🔴 hatch errors mentioning Split. (Pre-existing warnings/drift in other files are OK — those were present before this work.)

- [ ] **Step 4: Run build**

Run: `pnpm build`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(ds/ui): Split — register demo in catalog"
```

---

### Task 7: Verification — adopt in one route as smoke test

Goal: prove Split works in a real 3-panel route. Pick **Inbox** (smaller surface area than Finder) for the smoke test.

**Files:**
- Modify: `src/routes/genres/inbox/Inbox.tsx` (or its definePage)

- [ ] **Step 1: Locate the 3-panel layout in Inbox**

Run: `grep -n "data-ds\|panel\|aside\|main" src/routes/genres/inbox/Inbox.tsx | head -20`
Identify the outer container that arranges sidebar | list | preview.

- [ ] **Step 2: Wrap that 3-panel arrangement with Split**

Replace the outermost container that arranges the three panels with:

```tsx
<Split id="inbox" axis="row" defaultSizes={[1, 2, 3]} minSizes={[200, 280, 320]}>
  {/* the existing three panel children, in order */}
</Split>
```

Import: `import { Split } from '@/ds/ui/8-layout/Split'` (match existing import alias style in this file).

If Inbox uses definePage entities tree (FlatLayout) rather than JSX assembly, **skip this task and document in the commit** — Split is JSX layout primitive; FlatLayout integration is out of scope for this plan.

- [ ] **Step 3: Run dev, verify**

Run: `pnpm dev`
Open inbox route, drag separators between panels, reload, confirm persistence.

- [ ] **Step 4: Run build + lint**

Run: `pnpm build && pnpm lint:ds:all`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(routes/inbox): adopt Split for sidebar|list|preview resize"
```

---

## Verification Checklist

After all tasks done, manually verify:

1. ✅ 3-panel `<Split>`에서 separator 드래그 시 인접 두 panel만 폭 변화, 나머지 고정
2. ✅ minSizes clamp 동작
3. ✅ `id` 부여 시 새로고침해도 폭 유지
4. ✅ panel 1개를 `null`로 빼면 남은 panel이 100% 차지, separator 1개 줄어듦
5. ✅ nested Split (`<Split axis="row"><Split axis="column">...</Split>...</Split>`) 정상 동작
6. ✅ separator hover 시 1px hairline 표시, 평소 invisible
7. ✅ Tab 키로 separator에 포커스 이동 안 됨
8. ✅ 드래그 중 페이지 어디든 col-resize/row-resize 커서
9. ✅ `pnpm build` 통과
10. ✅ `pnpm lint:ds:all` 신규 🔴 hatch 없음
