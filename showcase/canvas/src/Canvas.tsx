/**
 * Canvas — DS 자산 SSOT viewer 의 최상위 React 컴포넌트.
 *
 * 시퀀스 4 페이지 (좌→우):
 *   L0  Palette     raw scale (수치)            ← PaletteSection.tsx
 *   L1  Semantic    foundations 토큰 그룹       ← tokenGroups.ts
 *   L2  Atoms       1 role = 1 component        ← collect.tsx (atomLanes)
 *   L3  Composed    합성 컴포넌트 + devices     ← collect.tsx (composedLanes)
 *
 * Canvas 자신의 책임: state · 레이아웃 조립 · detail panel.
 * 데이터 빌드는 lanes.ts · tokenGroups.ts · collect.tsx 가 담당.
 */
import { useMemo, useReducer, useState, type ReactNode } from 'react'
import { ZoomPanCanvas } from '@p/ds/ui/8-layout/ZoomPanCanvas'
import { ROOT, reduce, type NormalizedData } from '@p/ds'
import { Card, Heading, KeyValue, Code } from '@p/ds/ui/parts'
import { TokenCard, TypeSpecimen } from './TokenCard'
import { SectionFrame, SubGroup } from './SectionFrame'
import { PaletteSection, paletteTotal } from './PaletteSection'
import { PageDivider } from './PageDivider'
import { laneMetaMap } from './lanes'
import { tokenGroups, CATEGORY_LABEL, type TokenGroup } from './tokenGroups'
import { atomLanes, composedLanes, compIndex, totalCompCount, type CompLane } from './collect'

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
      standard={CATEGORY_LABEL[g.category]?.standard}
      count={g.exports.length}
    >
      {g.category === 'typography' ? (
        <div data-part="canvas-type-stack">
          {g.exports.map((e) => (
            <TypeSpecimen key={e.name + e.file} e={e} />
          ))}
        </div>
      ) : subs.length > 1 ? (
        subs.map((sub) => (
          <SubGroup key={sub} title={sub}>
            <div data-part={gridPart}>
              {byFile.get(sub)!.map((e) => (
                <TokenCard key={e.name + e.file} e={e} />
              ))}
            </div>
          </SubGroup>
        ))
      ) : (
        <div data-part={gridPart}>
          {g.exports.map((e) => (
            <TokenCard key={e.name + e.file} e={e} />
          ))}
        </div>
      )}
    </SectionFrame>
  )
}

function renderLane(
  laneObj: CompLane,
  selected: string | null,
  setSelected: (s: string | null) => void,
): ReactNode {
  const { lane, nodes } = laneObj
  const meta = laneMetaMap.get(lane)
  const title = meta?.label ?? lane.replace(/^ui\//, '')
  return (
    <SectionFrame key={lane} title={title} subtitle={lane} standard={meta?.standard} count={nodes.length}>
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
    </SectionFrame>
  )
}

// ── 페이지 섹션 ─────────────────────────────────────────────────────────

function SemanticSection() {
  return (
    <section data-part="canvas-semantic-page" data-tone="blue">
      <PageDivider
        level="L1"
        tone="blue"
        title="Foundations"
        subtitle="token names"
        hint="palette 위 의미 레이어. text·surface·border·accent·state 등 role 별 토큰. widget 은 여기까지만 import."
      />
      {tokenGroups.map(renderTokenGroup)}
    </section>
  )
}

function AtomsSection({
  selected, setSelected,
}: {
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  return (
    <section data-part="canvas-atoms-page" data-tone="green">
      <PageDivider
        level="L2"
        tone="green"
        title="Atoms"
        subtitle="UI · 1 role = 1 component"
        hint="단일 인터랙션 · 합성·roving·focus 없음. primitives · status · action · 단순 input · 단순 layout."
      />
      {atomLanes.map((lane) => renderLane(lane, selected, setSelected))}
    </section>
  )
}

function ComposedSection({
  selected, setSelected,
}: {
  selected: string | null
  setSelected: (s: string | null) => void
}) {
  return (
    <section data-part="canvas-composed-page" data-tone="amber">
      <PageDivider
        level="L3"
        tone="amber"
        title="Composed"
        subtitle="UI · parts · molecules · organisms · patterns · devices"
        hint="atoms + tokens 합성. roving·focus·gesture 가 핵심. content parts · selection · display · overlay · patterns · 합성 layout · devices."
      />
      {composedLanes.map((lane) => renderLane(lane, selected, setSelected))}
    </section>
  )
}

// ── render ──────────────────────────────────────────────────────────────

export function Canvas() {
  const totalTokens = tokenGroups.reduce((n, g) => n + g.exports.length, 0)
  const [selected, setSelected] = useState<string | null>(null)
  const selectedMeta = selected ? compIndex.get(selected) : null
  const selectedLaneLabel = selectedMeta ? laneMetaMap.get(selectedMeta.lane) ?? null : null

  const initial = useMemo<NormalizedData>(() => ({
    entities: { [ROOT]: { id: ROOT, data: { x: 0, y: 0, s: 0.4, bounds: { minS: 0.1, maxS: 4 } } } },
    relationships: { [ROOT]: [] },
  }), [])
  const [viewData, viewDispatch] = useReducer(reduce, initial)

  return (
    <div data-part="canvas-app">
      <ZoomPanCanvas id={ROOT} data={viewData} onEvent={viewDispatch}>
        <div data-part="canvas-page">
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
            <AtomsSection selected={selected} setSelected={setSelected} />
            <ComposedSection selected={selected} setSelected={setSelected} />
          </div>
        </div>
      </ZoomPanCanvas>

      {selectedMeta && (
        <aside data-part="canvas-detail" aria-label={`${selectedMeta.name} 상세`}>
          <Card
            slots={{
              title: <Heading level={3}>{selectedMeta.name}</Heading>,
              meta: (
                <span>
                  {selectedLaneLabel?.label ?? selectedMeta.lane}
                  {selectedLaneLabel?.standard && <> · ≈ {selectedLaneLabel.standard}</>}
                </span>
              ),
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
