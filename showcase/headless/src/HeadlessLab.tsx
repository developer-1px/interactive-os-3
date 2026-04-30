/**
 * HeadlessLab — @p/headless 어휘를 8개 카테고리로 묶어 보여주는 본문.
 *
 * 각 카테고리: 한 줄 설명 + export 시그니처 목록 + (선택) 라이브 데모.
 * 카탈로그 기능 우선 — 코드 예시는 시그니처 한 줄로 충분.
 */
import { Section } from './Section'
import { RovingDemo } from './demos/RovingDemo'
import { FlowDemo } from './demos/FlowDemo'
import { LayoutDemo } from './demos/LayoutDemo'

export function HeadlessLab() {
  return (
    <>
      <Section
        title="Types"
        oneLiner="모든 헤드리스 모듈의 데이터 표현 — Entity tree + Event union."
        api={[
          ['interface Entity', '{ id: string; data?: Record<string, unknown> }'],
          ['interface NormalizedData', '{ entities: Record<string, Entity>; relationships: Record<string, string[]> }'],
          ['type Event', '{ navigate | activate | expand | typeahead | ... }'],
          ['const ROOT', '"__root__"'],
          ['interface CollectionProps', '{ data, onEvent, autoFocus?, "aria-label"? }'],
          ['interface ControlProps', '{ data, onEvent, children? }'],
        ]}
      />
      <Section
        title="Axes"
        oneLiner="키 → Event 변환 분기. composeAxes로 축을 합성."
        api={[
          ['composeAxes(...axes)', 'Axis'],
          ['navigate(orientation)', 'Axis — Arrow/Home/End'],
          ['activate', 'Axis — Enter/Space'],
          ['expand', 'Axis — Right/Left → toggle'],
          ['treeNavigate / treeExpand', '트리 전용 axes (level/parent/child 인지)'],
          ['typeahead(getLabel)', 'Axis — 문자 입력 → 다음 일치 항목'],
          ['parentOf(d, id)', '부모 id (axis scope 계산용)'],
        ]}
      />
      <Section
        title="Roving"
        oneLiner="그룹당 Tab stop = 1개. APG roving tabindex 자동."
        api={[
          ['useRoving(axis, data, onEvent, opts)', '{ focusId, bindFocus, delegate }'],
          ['useRovingDOM(ref?, opts)', '{ ref, onKeyDown } — JSX-children 컴포넌트용'],
        ]}
        demo={<RovingDemo />}
      />
      <Section
        title="Gesture"
        oneLiner="activate 단발 → 의도(navigate/expand) 변환 헬퍼."
        api={[
          ['composeGestures(...fns)', 'GestureHelper'],
          ['navigateOnActivate', '활성화 시 focus도 같이'],
          ['activateOnNavigate', 'focus 이동 시 activate도 발행 (selection-follows-focus)'],
          ['expandBranchOnActivate', '자식 있으면 expand, 없으면 navigate'],
          ['activateProps(onActivate)', '{ onClick, onKeyDown } — 클릭+Enter/Space 합류'],
        ]}
      />
      <Section
        title="State"
        oneLiner="Entity tree state — reducer + DOM/event 다리."
        api={[
          ['reduce(d, e)', 'NormalizedData — pure reducer (focus/expanded/typeahead)'],
          ['fromTree(spec)', 'NormalizedData — flat spec → tree'],
          ['fromList(items, opts)', 'NormalizedData — list spec → flat tree'],
          ['pathAncestors(d, id)', 'string[] — root까지 조상 id 체인'],
          ['useControlState(initial)', '[data, dispatch] — reducer hook'],
          ['useEventBridge(data, onEvent, ...)', 'event router 다리'],
        ]}
      />
      <Section
        title="Flow"
        oneLiner="ui ↔ Resource 1줄 wiring. ui event → resource 다음 값 매핑."
        api={[
          ['defineFlow({ resource, args, onEvent })', 'FlowDef'],
          ['useFlow(flow)', '[value, dispatch]'],
          ['Resource<T, Args>', '{ key, load?, initial?, subscribe?, serialize?, onEvent? }'],
          ['useResource(r, ...args)', '[value, dispatch]'],
          ['defineResource(spec)', 'Resource passthrough'],
          ['readResource(r, ...args)', '컴포넌트 외부 read'],
          ['writeResource(r, value, ...args)', '컴포넌트 외부 write'],
        ]}
        demo={<FlowDemo />}
      />
      <Section
        title="Feature"
        oneLiner="effect + query + command 묶음. react-query/redux 슬림 대안."
        api={[
          ['defineFeature({ commands, effects, queries })', 'FeatureSpec'],
          ['useFeature(feature)', '{ run(command), useQuery(name, ...args) }'],
          ['invalidateQuery(feature, name, ...args)', '쿼리 무효화'],
        ]}
      />
      <Section
        title="Layout (FlatLayout)"
        oneLiner="페이지 트리를 plain object로 선언 — 직렬화 가능, JSX 조립 0줄."
        api={[
          ['definePage({ entities, relationships })', 'NormalizedData'],
          ['defineLayout(spec)', 'LayoutBuilder — 페이지 시각 골격 fragment'],
          ['defineWidget(spec)', 'WidgetBuilder — landmark 가진 fragment'],
          ['merge(layout, ...widgets)', '최종 page'],
          ['node(id, data)', 'TypedEntity'],
          ['placementAttrs(d)', '{ style, data-ds-grow, data-ds-align, ... }'],
          ['validatePage(page) / validateFragment(frag, kind?)', 'dev 검증 (cycle/orphan/시맨틱)'],
        ]}
        demo={<LayoutDemo />}
      />
      <Section
        title="Middleware"
        oneLiner="defineFlow의 gestures를 일반화한 파이프라인."
        api={[
          ['defineMiddleware({ pre, post, resource })', 'Middleware'],
          ['Phase: PreDispatchCtx | PostDispatchCtx | ResourceCtx', '훅 진입 시점'],
        ]}
      />
    </>
  )
}
