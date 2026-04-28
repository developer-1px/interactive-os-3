// SSoT 는 scalar/font.ts. semantic 내부(role.ts) 에서만 쓰는 호환 shim.
// 외부(widget) 는 scalar 직접 import 또는 typography(role) 사용.
export { font, weight } from '../../scalar/font'
