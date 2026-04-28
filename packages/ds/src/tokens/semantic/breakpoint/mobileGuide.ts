/**
 * mobileGuide — 모바일 화면 layout guide 별 outer margin SSoT (`pad()` step 단위).
 *
 * SSoT 단위는 절대 px 가 아니라 **ds-space step** (`pad(N)` 의 N). 이렇게 해야
 * iframe viewer 가 ds-space 를 1.5× 로 zoom 해도 (desktop catalog 가독성용) 토큰
 * 컴퓨티드 px 와 자연스럽게 함께 scale — false-positive 0.
 *
 * 8 LayoutGuide 와 1:1. 각 step 은 같은 guide 의 `slot.<guide>.pad` 와 일치해야
 * 한다 (현재는 수동 동기 — 별도 /occam 후보).
 *
 *   list   · thread · grid · article — pad(4) (= hierarchy.shell)
 *   feed   · hero                     — pad(0) (= hierarchy.group, full-bleed)
 *   state                             — pad(8) (centered fallback, 큰 호흡)
 *   form                              — pad(4) (field 자체가 inner pad)
 *
 * audit (showcase/playground/keyline-audit.ts) 가 phone-body 의 `--ds-space` 를
 * 읽어 동적으로 expected px 를 계산한다.
 *
 * @demo type=spacing fn=mobileGuide
 */
export const mobileGuide = {
  list:    { outerMarginSteps: 4 },
  thread:  { outerMarginSteps: 4 },
  feed:    { outerMarginSteps: 0 },
  grid:    { outerMarginSteps: 4 },
  article: { outerMarginSteps: 4 },
  hero:    { outerMarginSteps: 0 },
  state:   { outerMarginSteps: 8 },
  form:    { outerMarginSteps: 4 },
} as const

export type MobileGuideName = keyof typeof mobileGuide
