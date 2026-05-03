import { activate, treeExpand, treeNavigate } from '@p/headless'
import { dedupe, probe } from '../../../headless-site/keys'

/**
 * treeWrapperKeys — 이 wrapper 가 직렬 박제하는 키 매핑 (SSOT).
 * INTENTS 에서 axis 별 키를 probe 로 추출 후 dedupe.
 * 데이터·슬롯·reducer inline 은 examples/treeWrapper.tsx 에 노출.
 */
export const treeWrapperKeys = () =>
  dedupe([...probe(treeNavigate), ...probe(treeExpand), ...probe(activate), 'A-Z'])
