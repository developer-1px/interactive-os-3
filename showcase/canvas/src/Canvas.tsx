/**
 * Canvas — DS 자산 SSOT viewer 의 최상위 React 컴포넌트.
 *
 * 시퀀스 7 column (좌→우):
 *   L0    Palette            raw scale (수치)
 *   L1    Foundations        semantic tokens
 *   L1.5  Component tokens   intentionally empty (Radix/Base 노선)
 *   L2    Primitives         1 role = 1 component
 *   L3    Patterns           합성 컴포넌트 + content widgets
 *   L4    Templates          layout recipes
 *   L5    Devices            mock frames
 *
 * 분류 SSoT — fs 폴더 위치/이름. lanes.ts 의 bucketOf/labelOf/orderOf 가 자동 도출.
 * 손글씨 카피는 dividerCopy.ts 한 곳에 격리.
 */
import { Component, memo, useMemo, useReducer, type ErrorInfo, type ReactNode } from 'react'
import { getSelected, setSelected, useIsSelected, useSelected } from './selectedStore'
import { ZoomPanCanvas } from '@p/ds/ui/9-layout/ZoomPanCanvas'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { Card, Heading, KeyValue, Code } from '@p/ds/ui/6-structure'
import { TokenCard, TokenRow, TypeSpecimen } from './TokenCard'
import { SectionFrame, SubGroup } from './SectionFrame'
import { PaletteSection, paletteTotal } from './PaletteSection'
import { ColumnBanner } from './ColumnBanner'
import { CanvasTokensToc, type TocItem } from './CanvasTokensToc'
import { CanvasTokensColor } from './CanvasTokensColor'
import { CanvasTokensDivider } from './CanvasTokensDivider'
import { CanvasTokensRadius } from './CanvasTokensRadius'
import { CanvasTokensIndicators } from './CanvasTokensIndicators'
import { ComponentTokenEmptySection } from './ComponentTokenEmptySection'
import { DIVIDER } from './dividerCopy'
import { labelOf, type Bucket } from './lanes'
import { tokenGroups, CATEGORY_LABEL, type TokenGroup } from './tokenGroups'
import { StateShowcase } from './StateShowcase'
import { StateContextMatrix } from './StateContextMatrix'
import { lanesByBucket, compIndex, totalCompCount, type CompLane, type CompNode } from './collect'

// ── 렌더 헬퍼 ──────────────────────────────────────────────────────────

/** color/icon 은 visual 우선 → 카드 grid. typography·spacing·state 는 special.
 *  그 외 value-primary 카테고리는 table(row-list) 로 표시 — Tailwind/Open Props/M3 디팩토. */
const TABLE_CATEGORIES = new Set([
  'border', 'breakpoint', 'control', 'elevation', 'focus',
  'layout', 'motion', 'opacity', 'shape', 'sizing', 'zIndex',
])

function renderTokenGroup(g: TokenGroup, num?: string): ReactNode {
  const byFile = new Map<string, typeof g.exports>()
  for (const e of g.exports) {
    const sub = e.file.match(/\/([^/]+)\.ts$/)?.[1] ?? 'misc'
    if (!byFile.has(sub)) byFile.set(sub, [])
    byFile.get(sub)!.push(e)
  }
  const subs = [...byFile.keys()].sort()
  const gridPart =
    g.category === 'color' || g.category === 'iconography'
      ? 'canvas-color-grid'
      : 'canvas-grid-value'
  const useTable = TABLE_CATEGORIES.has(g.category)
  return (
    <SectionFrame
      key={g.category}
      num={num}
      id={g.category}
      title={CATEGORY_LABEL[g.category]?.label ?? g.category}
      subtitle={`foundations/${g.category}`}
      count={g.exports.length}
    >
      {g.category === 'typography' ? (
        /* role bundle (e.demo ❌) 도 TypeSpecimen 이 row 로 처리 — 정사각 카드 그리드 폐기.
           디팩토: M3 type scale · Apple HIG · Tailwind type docs 모두 horizontal row 리스트. */
        <div data-part="canvas-type-stack">
          {g.exports.map((e) => (
            <TypeSpecimen key={e.name + e.file} e={e} />
          ))}
        </div>
      ) : g.category === 'state' ? (
        <>
          <SubGroup title="base 어휘 (foundations/state)">
            <StateShowcase exports={g.exports} />
          </SubGroup>
          <SubGroup title="role / context — 전수 (selectors.ts SSoT)">
            <StateContextMatrix />
          </SubGroup>
        </>
      ) : useTable ? (
        subs.length > 1 ? (
          subs.map((sub) => (
            <SubGroup key={sub} title={sub}>
              <div data-part="canvas-token-table">
                {byFile.get(sub)!.map((e) => (
                  <TokenRow key={e.name + e.file} e={e} />
                ))}
              </div>
            </SubGroup>
          ))
        ) : (
          <div data-part="canvas-token-table">
            {g.exports.map((e) => (
              <TokenRow key={e.name + e.file} e={e} />
            ))}
          </div>
        )
      ) : subs.length > 1 ? (
        subs.map((sub) => (
          <SubGroup key={sub} title={sub}>
            <div data-part={gridPart}>
              {byFile.get(sub)!.map((e) => (
                <TokenCard key={e.name + e.file} e={e} category={g.category} />
              ))}
            </div>
          </SubGroup>
        ))
      ) : (
        <div data-part={gridPart}>
          {g.exports.map((e) => (
            <TokenCard key={e.name + e.file} e={e} category={g.category} />
          ))}
        </div>
      )}
    </SectionFrame>
  )
}

/** 0-prop 자동 mount 데모가 throw 하면 'no demo' 로 폴백. */
class DemoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(_e: Error, _i: ErrorInfo) {}
  render() { return this.state.failed ? 'no demo' : this.props.children }
}

/** Card — selected 구독만. demo render 지연은 CSS content-visibility:auto 가 paint 단계에서 처리. */
const CompCard = memo(function CompCard({ node }: { node: CompNode }) {
  const isSelected = useIsSelected(node.name)
  return (
    <figure
      data-part="canvas-comp-card"
      data-selected={isSelected || undefined}
      onClick={() => setSelected(getSelected() === node.name ? null : node.name)}
    >
      <div data-stage {...(node.demo ? {} : { 'data-empty': true })}>
        {node.demo ? <DemoBoundary>{node.demo()}</DemoBoundary> : 'no demo'}
      </div>
      <figcaption>{node.name}</figcaption>
    </figure>
  )
})

const CompCardGrid = memo(function CompCardGrid({ nodes }: { nodes: CompNode[] }) {
  return (
    <div data-part="canvas-grid-comp">
      {nodes.map((node) => (
        <CompCard key={node.name} node={node} />
      ))}
    </div>
  )
})

function renderLane(laneObj: CompLane): ReactNode {
  const { lane, nodes } = laneObj
  const title = labelOf(lane)

  // fs 계층 반영 — subgroup 있으면 SubGroup 으로 분기.
  const direct = nodes.filter((n) => !n.subgroup)
  const grouped = new Map<string, CompNode[]>()
  for (const n of nodes) {
    if (!n.subgroup) continue
    if (!grouped.has(n.subgroup)) grouped.set(n.subgroup, [])
    grouped.get(n.subgroup)!.push(n)
  }
  const subKeys = [...grouped.keys()].sort()

  return (
    <SectionFrame key={lane} title={title} subtitle={lane} count={nodes.length}>
      {direct.length > 0 && <CompCardGrid nodes={direct} />}
      {subKeys.map((sub) => (
        <SubGroup key={sub} title={`${sub}/`}>
          <CompCardGrid nodes={grouped.get(sub)!} />
        </SubGroup>
      ))}
    </SectionFrame>
  )
}

// ── 페이지 섹션 ─────────────────────────────────────────────────────────

// Atlas 큐레이션 frame 이 커버하는 카테고리 — auto tokenGroups 에서 제외.
//   color → CanvasTokensColor (Brand/Neutrals/Text/Borders/Status)
//   shape → CanvasTokensRadius (radius 부분)
//   iconography → CanvasTokensIndicators (data-icon)
const CURATED_CATEGORIES = new Set(['color', 'shape', 'iconography'])

export function SemanticSection() {
  const c = DIVIDER.foundations
  // 큐레이션 외 카테고리만 자동 도출 — typography/spacing/state/motion/focus/layout/control/opacity/sizing/breakpoint/zIndex/elevation
  const restGroups = tokenGroups.filter((g) => !CURATED_CATEGORIES.has(g.category))
  // Atlas 큐레이션 frame: 01 Color · 02 Divider · 03 Border Radius · 04 Indicators.
  // 그 다음 자동 카테고리. Indicators 는 dictionary 라 맨 아래로.
  const headFrames = [
    { id: 'color',   label: 'Color' },
    { id: 'divider', label: 'Divider' },
    { id: 'radius',  label: 'Border Radius' },
  ]
  const tailFrames = [{ id: 'indicators', label: 'Indicators' }]
  const tocItems: TocItem[] = [
    ...headFrames.map((f, i) => ({ num: String(i + 1).padStart(2, '0'), label: f.label, href: `#${f.id}` })),
    ...restGroups.map((g, i) => ({
      num: String(headFrames.length + i + 1).padStart(2, '0'),
      label: CATEGORY_LABEL[g.category]?.label ?? g.category,
      href: `#${g.category}`,
    })),
    ...tailFrames.map((f, i) => ({
      num: String(headFrames.length + restGroups.length + i + 1).padStart(2, '0'),
      label: f.label,
      href: `#${f.id}`,
    })),
  ]
  const tailNumStart = headFrames.length + restGroups.length + 1
  return (
    <section data-part="canvas-semantic-column" data-tone={c.tone}>
      <ColumnBanner tier={c.tier} tone={c.tone} title={c.title} hint={c.hint} />
      <CanvasTokensToc items={tocItems} />
      <SectionFrame num="01" id="color" title="Color" subtitle="foundations/color">
        <CanvasTokensColor />
      </SectionFrame>
      <SectionFrame num="02" id="divider" title="Divider" subtitle="foundations/color/border">
        <CanvasTokensDivider />
      </SectionFrame>
      <SectionFrame num="03" id="radius" title="Border Radius" subtitle="foundations/shape/radius">
        <CanvasTokensRadius />
      </SectionFrame>
      {restGroups.map((g, i) => renderTokenGroup(g, String(headFrames.length + i + 1).padStart(2, '0')))}
      <SectionFrame
        num={String(tailNumStart).padStart(2, '0')}
        id="indicators"
        title="Indicators"
        subtitle="foundations/iconography"
      >
        <CanvasTokensIndicators />
      </SectionFrame>
    </section>
  )
}

export const BucketSection = memo(function BucketSection({ bucket }: { bucket: Bucket }) {
  const c = DIVIDER[bucket]
  const lanes = lanesByBucket[bucket]
  return (
    <section data-part={`canvas-bucket-${bucket.toLowerCase()}-column`} data-tone={c.tone}>
      <ColumnBanner tier={c.tier} tone={c.tone} title={c.title} hint={c.hint} />
      {lanes.map((lane) => renderLane(lane))}
    </section>
  )
})

// ── render ──────────────────────────────────────────────────────────────

/** ZoomPanCanvas children — view state 변경에 무관. board 트리는 한 번만 mount. */
const CanvasBoard = memo(function CanvasBoard({ totalTokens }: { totalTokens: number }) {
  return (
    <div data-part="canvas-board">
      <header data-part="canvas-header">
        <div data-meta>Design System · Library</div>
        <h1>Product UI Styleguide</h1>
        <div data-stats>
          {paletteTotal} palette · {totalTokens} semantic · {totalCompCount} components
        </div>
      </header>

      <div data-part="canvas-layers">
        <PaletteSection />
        <SemanticSection />
        <ComponentTokenEmptySection />
        <BucketSection bucket="L2" />
        <BucketSection bucket="L3" />
        <BucketSection bucket="L4" />
        <BucketSection bucket="L5" />
      </div>
    </div>
  )
})

function DetailAside() {
  const selected = useSelected()
  const selectedMeta = selected ? compIndex.get(selected) : null
  if (!selectedMeta) return null
  return (
    <aside data-part="canvas-detail" aria-label={`${selectedMeta.name} 상세`}>
      <Card
        slots={{
          title: <Heading level={3}>{selectedMeta.name}</Heading>,
          meta: <span>{labelOf(selectedMeta.lane)}</span>,
          body: (
            <KeyValue
              items={[
                { key: 'Lane', value: selectedMeta.lane },
                {
                  key: 'Import',
                  value: <Code>{`import { ${selectedMeta.name} } from '${selectedMeta.importPath}'`}</Code>,
                },
              ]}
            />
          ),
          footer: (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); setSelected(null) }}
              aria-label="닫기"
            >
              닫기
            </a>
          ),
        }}
      />
    </aside>
  )
}

export function Canvas() {
  const totalTokens = useMemo(() => tokenGroups.reduce((n, g) => n + g.exports.length, 0), [])

  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 0.4, bounds: { minS: 0.1, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [viewData, viewDispatch] = useReducer(reduce, initial)

  return (
    <div data-part="canvas-app">
      <ZoomPanCanvas id={ROOT} data={viewData} onEvent={viewDispatch}>
        <CanvasBoard totalTokens={totalTokens} />
      </ZoomPanCanvas>
      <DetailAside />
    </div>
  )
}

