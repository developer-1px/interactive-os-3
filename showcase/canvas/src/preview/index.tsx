/**
 * preview/ — CSS 속성 축 별 단일 cell 렌더러 + scale aggregator.
 *
 * 진입점: `<TokenPreview kind="X" value=... name=... call=... />`
 *        `<TokenScale kind="X" values={[...]} />`  (복수 표현 정본)
 *
 * 새 axis 추가 절차:
 *   1. kinds.ts 의 TokenKind 에 등재
 *   2. <X>Preview.tsx 신설 (PreviewProps 인터페이스)
 *   3. 본 파일 REGISTRY 에 등재
 *   4. (선택) SCALE_LAYOUT 매핑 — 복수 표현이 cell 단순 반복이 아닐 때
 */
import type { ReactNode } from 'react'
import type { TokenKind } from './kinds'
import type { PreviewProps } from './types'

import { ColorPreview } from './ColorPreview'
import { PairPreview } from './PairPreview'
import { IconPreview } from './IconPreview'
import { FontSizePreview } from './FontSizePreview'
import { FontWeightPreview } from './FontWeightPreview'
import { FontFamilyPreview } from './FontFamilyPreview'
import { LineHeightPreview } from './LineHeightPreview'
import { LetterSpacingPreview } from './LetterSpacingPreview'
import { LengthPreview } from './LengthPreview'
import { GapPreview } from './GapPreview'
import { PadPreview } from './PadPreview'
import { RadiusPreview } from './RadiusPreview'
import { ShadowPreview } from './ShadowPreview'
import { BorderWidthPreview } from './BorderWidthPreview'
import { BorderStylePreview } from './BorderStylePreview'
import { OutlinePreview } from './OutlinePreview'
import { OpacityPreview } from './OpacityPreview'
import { ZIndexPreview } from './ZIndexPreview'
import { DurationPreview } from './DurationPreview'
import { EasingPreview } from './EasingPreview'
import { BreakpointPreview } from './BreakpointPreview'
import { RecipePreview } from './RecipePreview'

type PreviewFC = (p: PreviewProps) => ReactNode

const REGISTRY: Record<TokenKind, PreviewFC> = {
  color:         ColorPreview,
  pair:          PairPreview,
  icon:          IconPreview,
  fontSize:      FontSizePreview,
  fontWeight:    FontWeightPreview,
  fontFamily:    FontFamilyPreview,
  lineHeight:    LineHeightPreview,
  letterSpacing: LetterSpacingPreview,
  length:        LengthPreview,
  gap:           GapPreview,
  pad:           PadPreview,
  radius:        RadiusPreview,
  shadow:        ShadowPreview,
  borderWidth:   BorderWidthPreview,
  borderStyle:   BorderStylePreview,
  outline:       OutlinePreview,
  opacity:       OpacityPreview,
  zIndex:        ZIndexPreview,
  duration:      DurationPreview,
  easing:        EasingPreview,
  breakpoint:    BreakpointPreview,
  recipe:        RecipePreview,
  selector:      RecipePreview, // 동일 시각 — selector hint 도 mono text
}

export type { TokenKind } from './kinds'
export { inferKind } from './kinds'
export type { PreviewProps } from './types'

export function TokenPreview({ kind, ...p }: { kind: TokenKind } & PreviewProps) {
  const C = REGISTRY[kind]
  return C(p)
}

/**
 * TokenScale — 같은 kind 의 N 개 value 를 한 묶음으로.
 *
 * scale 시각 정본 (kind → layout):
 *   color    → flush strip ramp (Tailwind/Carbon 디팩토)
 *   fontSize → row list (M3/Tailwind type docs)
 *   pad/length → bar stack (Linear/Vercel spacing)
 *   shadow   → tile row on muted bg
 *   그 외    → cell grid 반복 (기본)
 */
export function TokenScale({
  kind,
  values,
  names,
  calls,
}: {
  kind: TokenKind
  values: string[]
  /** 각 value 의 라벨 — values 와 동일 길이. 없으면 index */
  names?: string[]
  /** 각 value 의 함수 호출 표기. 없으면 빈칸. */
  calls?: string[]
}) {
  // 기본 — cell grid 반복. kind-specific 복수 layout 은 후속 phase 에서 추가.
  return (
    <div data-part="canvas-scale" data-kind={kind}>
      {values.map((v, i) => (
        <TokenPreview
          key={i}
          kind={kind}
          value={v}
          name={names?.[i]}
          call={calls?.[i]}
        />
      ))}
    </div>
  )
}
