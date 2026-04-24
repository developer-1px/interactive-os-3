import { accent, css, fg, onAccent, pad, radius, tint } from '../../../fn'

// Badge vs Button 시각 계약 단서:
//  - Badge: 작음(xs, height auto), pill, 얕은 tint, cursor default, 경계 없음
//  - Button: 체크기(29.5px control-h), radius md, gray-2 서피스, 1px hairline 경계, cursor pointer
// 두 축(크기 × 경계)으로 한눈에 구분되도록 button에 keyline을 부여한다.

/**
 * Button 시각 계약 — variant prop 없이 **문맥**으로 강도 결정.
 *
 * 계층 (강→약):
 * 1. Primary — `[aria-roledescription="actions"] > button` (페이지 top-level CTA 영역)
 *    → accent fill, onAccent 텍스트. "이 화면에서 해야 할 주된 행동" 신호.
 * 2. Default — 일반 <button> (grid 셀, 폼, 툴바 등)
 *    → gray-2 서피스 + 경계 없음 + accent hover. "눌릴 수 있음"은 알지만 첫 눈길은 아님.
 * 3. Ghost — 이미 state.ts base가 주는 기본 (transparent bg + controlBox).
 *    variant로 옵트인 없음 — 모든 button은 2번에 기본 해당.
 *
 * 메모: Primary 분기를 data-tone이나 variant prop이 아닌 ARIA context로 결정 →
 * "페이지의 주 행동은 actions 영역에 둔다"는 IA 규약이 자연스레 강제된다.
 */
export const buttonCss = css`
  /* ── 기본 (= secondary/default) ───────────────────────────────
     base.ts의 controlBox 위에 얕은 서피스와 경계 없는 hover 신호만 얹는다. */
  :where(button):not([aria-roledescription="actions"] > button) {
    background: ${fg(2)};
    color: inherit;
    border: 1px solid ${fg(3)};
    border-radius: ${radius('md')};
    padding: 0 ${pad(3)};
    transition: background-color var(--ds-dur-fast) var(--ds-ease-out),
                color var(--ds-dur-fast) var(--ds-ease-out),
                border-color var(--ds-dur-fast) var(--ds-ease-out);
  }
  :where(button):not([aria-roledescription="actions"] > button):hover:not([aria-disabled="true"]) {
    background: ${tint(accent(), 12)};
    color: ${accent()};
    border-color: ${tint(accent(), 40)};
  }

  /* ── Primary (actions 영역) ───────────────────────────────────
     topbar의 "+ 영상 등록", Dialog의 "저장" 등 페이지 주 행동. */
  [aria-roledescription="actions"] > button {
    background: ${accent()};
    color: ${onAccent()};
    border-radius: ${radius('md')};
    padding: 0 ${pad(4)};
    font-weight: 600;
    transition: background-color var(--ds-dur-fast) var(--ds-ease-out),
                transform var(--ds-dur-fast) var(--ds-ease-out);
  }
  [aria-roledescription="actions"] > button:hover:not([aria-disabled="true"]) {
    background: ${tint(accent(), 85)};
  }
  [aria-roledescription="actions"] > button:active:not([aria-disabled="true"]) {
    transform: translateY(1px);
  }

  /* ── 예외: columnheader 안의 sort 토글 버튼은 텍스트 링크처럼 처리
          (grid.ts가 all: unset + 인라인 styling 부여) — 기본 Button 스타일에서 빼낸다. */
  [role="columnheader"] > button {
    background: transparent;
    padding: 0;
  }
`
