/**
 * wireframe-screens — ScreenDef · LayoutGuide 타입 SSOT.
 *
 * 화면 정의의 canonical 진입은 `wireframe-registry.ts` 의 `defineScreen` /
 * `defineGroup`. 각 화면은 `screens/<X>-<name>.tsx` 에서 `defineScreen({...})`
 * 으로 self-register 한다. SCREENS 거대 Record / WireframeScreen / 거기서
 * 도출하던 byApp·byFlow·byPattern·byPart 는 wireframe-registry 로 이주 완료
 * (occam: 같은 derived view 가 두 곳에 공존하던 위반 해소).
 *
 * Mobbin 식 다축 메타데이터 (app · flow · patterns · parts) 는 ScreenDef 의
 * field 로 그대로 유지 — derived view 는 registry 가 도출.
 */
import type { ReactNode } from 'react'

/**
 * LayoutGuide — 모바일 화면이 따르는 디자인 가이드 (de facto 수렴 8종).
 *
 *  list    : 동질 row 반복 (iOS Settings · Mail · Material 3 List)
 *  thread  : 메시지 bubble thread (iMessage · WhatsApp)
 *  feed    : timeline 카드 (Twitter · Instagram · Reddit)
 *  grid    : 균일 타일/카드 grid (Pinterest · Dashboard · Calendar)
 *  article : 장문 prose 본문 (Medium · NYTimes)
 *  form    : 폼 스택 (Material Form · iOS Forms · Auth · Settings)
 *  hero    : banner + sections (App Store · Profile · Pricing)
 *  state   : empty · error · loading fallback
 *
 * 1차 분류 축 — 같은 guide 면 같은 형태. category(앱 도메인)는 catalog 그룹핑용.
 */
export type LayoutGuide =
  | 'list' | 'thread' | 'feed' | 'grid' | 'article' | 'form' | 'hero' | 'state'

export type ScreenDef = {
  readonly id: string
  readonly app: string
  readonly flow: string
  readonly category: string
  /** 화면이 따르는 디자인 가이드. 미지정 시 카테고리 default 가 적용됨. */
  readonly guide?: LayoutGuide
  readonly patterns: readonly string[]
  readonly parts: readonly string[]
  readonly render: () => ReactNode
}
