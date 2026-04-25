import { type ReactNode } from 'react'
import { useShellMode } from './hooks/useShellMode'

/** L1 진입점 — 데스크톱/모바일 셸을 viewport 한 번만 보고 분기한다.
 *  라우트는 useShellMode 직접 호출 대신 이걸 쓰는 것이 권장 — 분기가 한 줄로 보임.
 *  주의: 두 셸은 같은 도메인 훅(useXNav 등)을 받아 동일 데이터 위에서 렌더해야 한다. */
export function ShellSwitch({
  desktop,
  mobile,
}: {
  desktop: ReactNode
  mobile: ReactNode
}): ReactNode {
  const mode = useShellMode()
  return mode === 'mobile' ? mobile : desktop
}
