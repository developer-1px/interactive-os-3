import { fromKeyMap, type Axis } from './axis'
import { INTENTS } from './keys'

/**
 * treeNavigate — DFS visible 순회 (collapse 반영). 단일 부모 prev/next 는 navigate.
 *
 * Intent-form (PRD #38 phase 3): chord → `{type:'navigate', dir}` 만 emit.
 * 다음 id 산수 (visible-flat) 는 reducer (`resolveNavigate`) 가 담당.
 */
export const treeNavigate: Axis = fromKeyMap([
  [INTENTS.treeNavigate.next,  { type: 'navigate', dir: 'visibleNext' }],
  [INTENTS.treeNavigate.prev,  { type: 'navigate', dir: 'visiblePrev' }],
  [INTENTS.navigate.start,     { type: 'navigate', dir: 'start' }],
  [INTENTS.navigate.end,       { type: 'navigate', dir: 'end' }],
])
