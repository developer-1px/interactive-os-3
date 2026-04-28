// SSoT 는 palette/font.ts. foundations 내부(role.ts) 에서만 쓰는 호환 shim.
// 외부(widget) 는 palette 직접 import 또는 typography(role) 사용.
export { font, weight } from '../../palette/font'
