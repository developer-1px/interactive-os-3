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
import { useMemo, useReducer, useState, type ReactNode } from 'react'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { Card, Heading, KeyValue, Code } from '@p/ds/ui/parts'
import { TokenCard, TypeSpecimen } from './TokenCard'
import { SectionFrame, SubGroup } from './SectionFrame'
import { PaletteSection, paletteTotal } from './PaletteSection'
import { ColumnBanner } from './ColumnBanner'
import { ComponentTokenEmptySection } from './ComponentTokenEmptySection'
import { DIVIDER } from './dividerCopy'
import { labelOf, type Bucket } from './lanes'
import { tokenGroups, CATEGORY_LABEL, type TokenGroup } from './tokenGroups'
import { StateShowcase } from './StateShowcase'
import { StateContextMatrix } from './StateContextMatrix'
import { lanesByBucket, compIndex, totalCompCount, type CompLane, type CompNode } from './collect'

// ── 렌더 헬퍼 ──────────────────────────────────────────────────────────

function renderTokenGroup(g: TokenGroup): ReactNode {
  const byFile = new Map<string, typeof g.exports>()
  for (const e of g.exports) {
    const sub = e.file.match(/\/([^/]+)\.ts$/)?.[1] ?? 'misc'
    if (!byFile.has(sub)) byFile.set(sub, [])
    byFile.get(sub)!.push(e)
  }
  const subs = [...byFile.keys()].sort()
  const gridPart =
    g.category === 'color' || g.category === 'iconography'
      ? 'canvas-grid-color'
      : 'canvas-grid-value'
  return (
    <SectionFrame
      key={g.category}
      title={CATEGORY_LABEL[g.category]?.label ?? g.category}
      subtitle={`foundations/${g.category}`}
      count={g.exports.length}
    >
      {g.category === 'typography' ? (
        <>
          <div data-part="canvas-type-stack">
            {g.exports.filter((e) => e.demo).map((e) => (
              <TypeSpecimen key={e.name + e.file} e={e} />
            ))}
          </div>
          {g.exports.some((e) => !e.demo) && (
            <SubGroup title="role bundles (semantic)">
              <div data-part="canvas-grid-value">
                {g.exports.filter((e) => !e.demo).map((e) => (
                  <TokenCard key={e.name + e.file} e={e} category={g.category} />
                ))}
              </div>
            </SubGroup>
          )}
        </>
      ) : g.category === 'state' ? (
        <>
          <SubGroup title="base 어휘 (foundations/state)">
            <StateShowcase exports={g.exports} />
          </SubGroup>
          <SubGroup title="role / context — 전수 (selectors.ts SSoT)">
            <StateContextMatrix />
          </SubGroup>
        </>
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

function CompCardGrid({
  nodes, selected, setSelected,
}: {
  nodes: CompNode[]
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  return (
    <div data-part="canvas-grid-comp">
      {nodes.map((node) => (
        <figure
          key={node.name}
          data-part="canvas-comp-card"
          data-selected={selected === node.name || undefined}
          onClick={() => setSelected(selected === node.name ? null : node.name)}
        >
          <div data-stage {...(node.demo ? {} : { 'data-empty': true })}>
            {node.demo ? node.demo() : 'no demo'}
          </div>
          <figcaption>{node.name}</figcaption>
        </figure>
      ))}
    </div>
  )
}

function renderLane(
  laneObj: CompLane,
  selected: string | null,
  setSelected: (s: string | null) => void,
): ReactNode {
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
      {direct.length > 0 && (
        <CompCardGrid nodes={direct} selected={selected} setSelected={setSelected} />
      )}
      {subKeys.map((sub) => (
        <SubGroup key={sub} title={`${sub}/`}>
          <CompCardGrid nodes={grouped.get(sub)!} selected={selected} setSelected={setSelected} />
        </SubGroup>
      ))}
    </SectionFrame>
  )
}

// ── 페이지 섹션 ─────────────────────────────────────────────────────────

function SemanticSection() {
  const c = DIVIDER.foundations
  return (
    <section data-part="canvas-semantic-column" data-tone={c.tone}>
      <ColumnBanner tier={c.tier} tone={c.tone} title={c.title} hint={c.hint} />
      {tokenGroups.map(renderTokenGroup)}
    </section>
  )
}

function BucketSection({
  bucket, selected, setSelected,
}: {
  bucket: Bucket
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  const c = DIVIDER[bucket]
  const lanes = lanesByBucket[bucket]
  return (
    <section data-part={`canvas-bucket-${bucket.toLowerCase()}-column`} data-tone={c.tone}>
      <ColumnBanner tier={c.tier} tone={c.tone} title={c.title} hint={c.hint} />
      {lanes.map((lane) => renderLane(lane, selected, setSelected))}
    </section>
  )
}

// ── render ──────────────────────────────────────────────────────────────

export function Canvas() {
  const totalTokens = tokenGroups.reduce((n, g) => n + g.exports.length, 0)
  const [selected, setSelected] = useState<string | null>(null)
  const selectedMeta = selected ? compIndex.get(selected) : null

  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 0.4, bounds: { minS: 0.1, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [viewData, viewDispatch] = useReducer(reduce, initial)

  return (
    <div data-part="canvas-app">
      <ZoomPanCanvas id={ROOT} data={viewData} onEvent={viewDispatch}>
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
            <BucketSection bucket="L2" selected={selected} setSelected={setSelected} />
            <BucketSection bucket="L3" selected={selected} setSelected={setSelected} />
            <BucketSection bucket="L4" selected={selected} setSelected={setSelected} />
            <BucketSection bucket="L5" selected={selected} setSelected={setSelected} />
          </div>
        </div>
      </ZoomPanCanvas>

      {selectedMeta && (
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
      )}
    </div>
  )
}
