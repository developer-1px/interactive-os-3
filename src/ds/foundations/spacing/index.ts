/**
 * spacing/ — 모든 간격 시맨틱이 한 도메인에.
 *
 * proximity   — 블록 간 vertical rhythm (Gestalt 7단)
 * inset       — 컴포넌트 *내부* padding 4단
 * hierarchy   — UI shell 위계 (atom/group/section/surface/shell)
 *
 * 모두 raw 수치는 palette/space (emStep, insetStep, pad). 여기는 의미 매핑만.
 */
export * from './proximity'
export * from './hierarchy'
export * from './score'
