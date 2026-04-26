/**
 * foundations/ — sys tokens (semantic role).
 *
 * de facto 2층 (Material 3 / Carbon): ref tokens(raw scale) vs sys tokens(semantic).
 *   - ref(raw, 인자=숫자 scale): `ds/palette` (color/space/elev)
 *   - sys(semantic, 인자=named slot/role): 이 폴더
 *
 * 외부 호환을 위해 palette을 여기서 re-export 한다 (점진 마이그레이션).
 * **신규 코드는 raw token이 필요하면 `from 'ds/palette'`를 직접 import 권장.**
 */
export * from '../palette'
export * from './primitives'
export * from './typography'
export * from './shape'
export * from './color'
export * from './state'
export * from './motion'
export * from './elevation'
export * from './control'
export * from './layout'
export * from './iconography'
export * from './recipes'
