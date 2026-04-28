import { pad } from '../../scalar/space'
import { hierarchy } from './hierarchy'

/**
 * slot — 컴포넌트 슬롯별 spacing. **role-scoped semantic**.
 *
 * **CSS property 무관** — 같은 slot 토큰을 padding·gap·margin 어디든 쓴다.
 * "card 의 안쪽 호흡" 이라는 *역할* 이 본질이지, padding 인지 gap 인지는 구현 선택.
 * 한 곳에서 padding 으로, 다른 곳에서 gap 으로 같은 토큰을 써도 의미가 같음.
 *
 * Material 3 `comp.spacing.*` 패턴. spacing scale (pad(N)) 자체를 영어로
 * rename ("cluster"·"region") 하는 건 수치를 다시 쓴 것뿐 — 우리는 그 길을
 * 거부했다 (Tailwind/Radix/Carbon 다수 수렴 결론).
 *
 * 대신 **컴포넌트 슬롯이 자기 패딩/갭을 자기 어휘로 선언** 한다:
 *   `slot.card.pad` — card 가 자기 padding 이 얼마인지를 안다.
 *   `slot.dialog.pad` — dialog 가 자기 padding 이 얼마인지를 안다.
 *
 * 같은 수치(pad(2))가 여러 슬롯(card.pad·sidebar.pad·chrome.pad)에 등장해도
 * 의미는 다르다 — 각자 자기 컴포넌트의 결정. 한쪽이 바뀌면 한쪽만 바꾸면 된다.
 *
 * widget 은 자기 슬롯 토큰만 import. 다른 컴포넌트의 슬롯은 보지 않는다.
 *
 * 수치 자체는 scalar/space 의 pad() 를 통한다 — preset 스왑 안전성 유지.
 *
 * @demo type=spacing fn=slot
 */
export const slot = {
  /** card primitive — content 부품 (parts/Card). */
  card:    { pad: pad(2), gap: pad(1.5), colGap: pad(2), rowGap: pad(0.25) },
  /** modal dialog. centered, max-width 약속. */
  dialog:  { pad: pad(4) },
  /** popover (non-modal, light-dismiss). */
  popover: { pad: pad(3) },
  /** edge-anchored sheet (모바일 drawer). */
  sheet:   { pad: pad(3) },
  /** tooltip — small, 마우스 hover. */
  tooltip: { pad: pad(1) },
  /** sidebar nav surface. */
  sidebar: { pad: pad(2), gap: pad(4), headerPad: pad(2), itemPadY: pad(1.25), itemPadX: pad(2), avatarSize: pad(8) },
  /** auth card — focused container, 일반 카드보다 큰 호흡. */
  auth:    { pad: pad(8), slotGap: pad(6), formGap: pad(5), buttonPadY: pad(2.5), otpGap: pad(1.5) },
  /**
   * form 슬롯 — field·fieldset·section 간격.
   *
   *  pad           : form screen 의 outer padding. iOS Settings · Material Forms 16dp 수렴.
   *                  Mobile keyline guide 'form' 의 SSoT — phone-body 가 cascade 로 읽음.
   *  gap           : section 간 gap.
   *  headingMargin : h2/h3 하단 (margin 자리).
   */
  form:    { pad: hierarchy.shell, gap: pad(3), fieldGap: pad(1), fieldDescGap: pad(0.5), fieldsetGap: pad(1.5),
             headingMargin: pad(2), fieldsetMargin: pad(2) },
  /** details/disclosure (summary + content). */
  details: { pad: pad(2), summaryPadY: pad(1.5), summaryPadX: pad(2) },
  /** highlightMark — HTML <mark>. */
  mark:    { padX: pad(1.25), gap: pad(0.5) },
  /** floating action button (FAB). 위치 offset + 박스 치수. */
  fab:     { inset: pad(4), size: pad(14) },
  /** app shell chrome (titlebar). */
  chrome:  { pad: pad(2), gap: pad(2) },

  // ── Mobile layout guide slots — 화면이 따르는 디자인 가이드별 spacing recipe.
  //    각 guide 가 자기 padding/gap/sectionGap 을 자기 어휘로 선언한다.
  //    수치는 모두 hierarchy.* 컴포지션 (scale → role 단방향 의존). raw pad() ❌.
  //
  //    8 guide → 4 grid overlay 로 수렴 (list·thread → list, feed → feed,
  //    grid → 4col, article·hero·state → content). LayoutGuide 타입(showcase)이 entry key.

  /** list — iOS Settings · Material List. row 동질 반복, similarity 분리. */
  list:    { pad: hierarchy.shell, gap: hierarchy.group, sectionGap: hierarchy.shell },
  /** thread — iMessage · WhatsApp. 메시지 bubble 흐름. */
  thread:  { pad: hierarchy.shell, gap: hierarchy.section },
  /** feed — Instagram · Twitter · Reddit. full-bleed timeline. */
  feed:    { pad: hierarchy.group, gap: hierarchy.shell },
  /** grid — Pinterest · Dashboard · Calendar. 균일 타일/카드. */
  grid:    { pad: hierarchy.shell, gap: hierarchy.surface },
  /** article — Medium · NYTimes. 장문 prose 본문. */
  article: { pad: hierarchy.shell, gap: hierarchy.shell, sectionGap: hierarchy.shell },
  /** hero — App Store · Profile · Pricing. banner edge-to-edge + section. */
  hero:    { pad: hierarchy.group, gap: hierarchy.shell },
  /** state — empty · error · loading. 중앙 정렬 fallback. */
  state:   { pad: pad(8), gap: hierarchy.surface },
} as const
