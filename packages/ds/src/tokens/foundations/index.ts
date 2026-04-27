/**
 * foundations/ — sys tokens (semantic role).
 *
 * de facto 2층 (Material 3 / Carbon): ref tokens(raw scale) vs sys tokens(semantic).
 *   - ref(raw, 인자=숫자 scale): `ds/palette` (color/space/elev)
 *   - sys(semantic, 인자=named slot/role): 이 폴더
 *
 * 외부 호환을 위해 palette을 여기서 re-export 한다 (점진 마이그레이션).
 * **신규 코드는 raw token이 필요하면 `from 'ds/tokens/palette'`를 직접 import 권장.**
 */
/**
 * palette re-export — 점진 마이그레이션. emStep / insetStep 같이 가장 raw 한 토큰만
 * 의도적으로 제외 (widget 은 proximity/inset semantic 으로 접근).
 *
 * 신규 코드 권장:
 *   - 색은 text() / surface() / border() / accent() / status() 등 semantic 만
 *   - neutral(N) 은 preset 내부·foundations 내부에서만 직접 호출
 *   - dim() 은 box-shadow / border 등 currentColor 알파 다운에만
 */
export { pad, rowPadding, level } from '../palette/space'
export { neutral, tint, mix, dim, type Neutral } from '../palette/color'
export { elev } from '../palette/elev'

export * from './primitives'
export * from './typography'
export * from './spacing'
export * from './shape'
export * from './color'
export * from './state'
export * from './motion'
export * from './elevation'
export * from './control'
export * from './layout'
export * from './iconography'
export * from './recipes'
