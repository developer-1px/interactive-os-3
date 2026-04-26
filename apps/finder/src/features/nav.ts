/** finder navigation 추상화 — 셸의 router 인스턴스를 직접 import 하지 않는다.
 *  부팅 시 packages/app/src/boot 가 setFinderNav 로 구체 구현을 주입.
 *  미주입 상태에서 호출되면 no-op (route 진입 전 단계의 안전장치). */
type NavFn = (splat: string) => void

let nav: NavFn = () => {}

export const setFinderNav = (fn: NavFn): void => { nav = fn }
export const finderNavigate = (splat: string): void => nav(splat)
