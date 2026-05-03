import { activate, navigate } from '@p/headless'
import { dedupe, probe } from '../../../headless-site/keys'

/**
 * menuWrapperKeys — 이 wrapper 가 직렬 박제하는 키 매핑 (SSOT).
 * INTENTS 에서 axis 별 키를 probe 로 추출 후 dedupe.
 * 데이터·슬롯 inline 은 examples/menuWrapper.tsx 에 노출 — 이 파일은 wrapper 내부 메타.
 */
export const menuWrapperKeys = () =>
  dedupe([...probe(navigate('vertical')), ...probe(activate), 'A-Z'])
