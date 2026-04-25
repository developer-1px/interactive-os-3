/** Mobile category — ds 의 viewport/shell/gesture primitive 큐레이션.
 *  ds/ui zone과 직교한다(컴포넌트가 아니라 cross-cutting primitive). 모바일
 *  분기·반응형·터치를 어떻게 처리하는지의 단일 진실 원천 카드 모음.
 */
import type { ReactNode } from 'react'

export type MobileEntry = {
  id: string
  name: string
  layer: 'L0 token' | 'L0 hook' | 'L1 shell' | 'L2 gesture' | 'L3 content'
  file: string
  signature: string
  blurb: string
  example?: string
  demo?: () => ReactNode
}

export const mobileEntries: MobileEntry[] = [
  {
    id: 'shell-mobile-max',
    name: '--ds-shell-mobile-max',
    layer: 'L0 token',
    file: 'src/ds/style/preset/types.ts',
    signature: 'shell.mobileMax: string  // 600px',
    blurb:
      'viewport 단일 출처. L0가 한 번만 읽고 L1이 분기. preset.shell.mobileMax → CSS var. JS는 useShellMode가 동일 토큰을 matchMedia에 주입.',
  },
  {
    id: 'use-shell-mode',
    name: 'useShellMode',
    layer: 'L0 hook',
    file: 'src/ds/core/hooks/useShellMode.ts',
    signature: "() => 'desktop' | 'mobile'",
    blurb:
      'viewport 한 번만 읽는 단일 출처. matchMedia(--ds-shell-mobile-max). 라우트는 window.matchMedia 직접 호출 금지(lint:ds-shell R1).',
    example: `const mode = useShellMode()
return mode === 'mobile' ? <Mobile/> : <Desktop/>`,
  },
  {
    id: 'shell-switch',
    name: 'ShellSwitch',
    layer: 'L1 shell',
    file: 'src/ds/core/ShellSwitch.tsx',
    signature: '<ShellSwitch desktop={...} mobile={...} />',
    blurb:
      'desktop/mobile 분기 진입점. 두 셸은 같은 도메인 훅(useXNav)을 받아 동일 데이터 위에서 렌더한다. 셸은 별도 트리, 도메인은 공유.',
    example: `<ShellSwitch
  desktop={<FinderDesktop path={path} onNavigate={go} />}
  mobile={<FinderMobile path={path} onNavigate={go} />}
/>`,
  },
  {
    id: 'use-swipe',
    name: 'useSwipe',
    layer: 'L2 gesture',
    file: 'src/ds/core/hooks/useSwipe.ts',
    signature: 'useSwipe(ref, { onSwipe, axes, threshold, ratio, timeout })',
    blurb:
      'pointer-type === "touch" 한 방향 swipe 인식. 거리 ≥ 64px AND 가로/세로 비율 ≥ 1.5 AND ≤ 600ms. 단발 emit — activate와 대칭.',
    example: `useSwipe(ref, {
  axes: ['left', 'right'],
  onSwipe: (dir) => dir === 'right' ? goBack() : goForward(),
})`,
  },
  {
    id: 'swipe-axis',
    name: 'swipe(orientation)',
    layer: 'L2 gesture',
    file: 'src/ds/core/axes/swipe.ts',
    signature: "swipe('vertical' | 'horizontal'): Axis",
    blurb:
      'swipe를 keyboard/mouse와 동급의 Axis primitive로 승격. Trigger.swipe → navigate event. vertical: up→next/down→prev, horizontal: left→next/right→prev.',
    example: `const axis = composeAxes(
  navigate('vertical'),
  swipe('vertical'),
  activate, typeahead,
)`,
  },
  {
    id: 'use-swipe-axis',
    name: 'useSwipeAxis',
    layer: 'L2 gesture',
    file: 'src/ds/core/hooks/useSwipeAxis.ts',
    signature: 'useSwipeAxis({ ref, axis, data, onEvent, focusId, axes? })',
    blurb:
      'useSwipe + bindAxis.onSwipe 통합. 컨테이너 ref에서 swipe 인식 → focusId를 anchor로 axis pipeline에 흘림. swipe primitive를 한 줄로 wiring.',
  },
  {
    id: 'container-query',
    name: '@container reflow',
    layer: 'L3 content',
    file: 'src/ds/style/shell/panes.ts',
    signature: 'container-type: inline-size; container-name: <name>;',
    blurb:
      '컨텐츠 reflow는 @container 만 허용 (lint:ds-shell R2). viewport 모름 → 같은 widget이 desktop main/mobile fullwidth/modal 어디서든 부모 크기에 따라 reflow. 예: list-view 컬럼 hiding, preview 코드 soft-wrap.',
    example: `aside[aria-roledescription="preview"] {
  container-type: inline-size;
  container-name: preview;
}
@container preview (max-width: 600px) {
  pre { white-space: pre-wrap; word-break: break-word; }
}`,
  },
  {
    id: 'lint-ds-shell',
    name: 'lint:ds-shell',
    layer: 'L0 hook',
    file: 'scripts/lint-ds-shell.mjs',
    signature: 'R1 / R2 / R3 invariants',
    blurb:
      'viewport 단일 출처 가드. R1 routes에서 window.matchMedia 금지 → useShellMode. R2 ds/ui에서 viewport @media 금지 → @container. R3 shell @media 폭 리터럴 금지 → var(--ds-shell-mobile-max).',
  },
]

export const mobileLayerOrder: MobileEntry['layer'][] = [
  'L0 token', 'L0 hook', 'L1 shell', 'L2 gesture', 'L3 content',
]

export const mobileLayerBlurb: Record<MobileEntry['layer'], string> = {
  'L0 token':   'viewport 단일 출처 — 토큰/훅이 한 번만 읽는다',
  'L0 hook':    'viewport 단일 출처 — 토큰/훅이 한 번만 읽는다',
  'L1 shell':   'mode 분기 — desktop/mobile 별도 컴포넌트 트리',
  'L2 gesture': '터치 입력 — keyboard/mouse와 동급 primitive',
  'L3 content': '컨텐츠 reflow — @container 만, viewport 모름',
}
