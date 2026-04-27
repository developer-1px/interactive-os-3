import { pad } from '../../palette/space'

/**
 * slot — 컴포넌트 슬롯별 padding/gap. **role-scoped semantic**.
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
 * 수치 자체는 palette/space 의 pad() 를 통한다 — preset 스왑 안전성 유지.
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
  sidebar: { pad: pad(2), gap: pad(4), headerPad: pad(2), itemPadY: pad(1.25), itemPadX: pad(2) },
  /** auth card — focused container, 일반 카드보다 큰 호흡. */
  auth:    { pad: pad(8), slotGap: pad(6), formGap: pad(5), buttonPadY: pad(2.5), otpGap: pad(1.5) },
  /** form 슬롯 — field·fieldset·section 간격. */
  form:    { gap: pad(3), fieldGap: pad(1), fieldDescGap: pad(0.5), fieldsetGap: pad(1.5) },
  /** details/disclosure (summary + content). */
  details: { pad: pad(2), summaryPadY: pad(1.5), summaryPadX: pad(2) },
  /** highlightMark — HTML <mark>. */
  mark:    { padX: pad(1.25), gap: pad(0.5) },
  /** floating action button (FAB). 위치 offset. */
  fab:     { inset: pad(4) },
  /** app shell chrome (titlebar). */
  chrome:  { pad: pad(2), gap: pad(2) },
} as const
