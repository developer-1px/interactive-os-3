import { accent, accentTint, border, css, dur, ease, focusRingWidth, hairlineWidth, radius, text } from '../../tokens/foundations'
import { dim, pad, tint } from '../../tokens/palette'
/**
 * Tabs — 보편적 탭 어포던스.
 *
 * 탭은 "리본 + 선택 지시자 + 패널 연결선"이라는 읽히는 형태가 필요하다.
 * ds states base는 tab을 일반 roving flexItem으로 취급해 hover/selected 상태만
 * 공유한다. 여기에 탭만의 추가 정체성을 더한다:
 *
 * - tablist 하단(또는 측면)의 baseline border
 * - 선택된 tab의 accent indicator (baseline을 끊어내며 panel과 시각적으로 연결)
 * - hover 시 indicator 반투명 미리보기
 * - tabpanel 기본 padding + focus ring
 * - aria-orientation="vertical" 분기 (border가 하단 → 우측으로 이동)
 */
export const cssTabs = () => css`
  /* --- horizontal (default) --- */
  [role="tablist"]:not([aria-orientation="vertical"]) {
    gap: 0;
    border-bottom: ${hairlineWidth()} solid ${border()};
    align-items: stretch;
  }
  [role="tablist"]:not([aria-orientation="vertical"]) > [role="tab"] {
    padding: ${pad(1.5)} ${pad(3)};
    border-bottom: ${focusRingWidth()} solid transparent;
    margin-bottom: -1px;
    color: ${text('subtle')};
    background: transparent;
    border-radius: ${radius('sm')} ${radius('sm')} 0 0;
    user-select: none;
    transition: color ${dur('base')} ${ease('out')},
                border-bottom-color ${dur('base')} ${ease('out')},
                border-inline-end-color ${dur('base')} ${ease('out')};
  }
  [role="tablist"]:not([aria-orientation="vertical"]) > [role="tab"]:hover:not([aria-disabled="true"]) {
    color: inherit;
    border-bottom-color: ${accentTint('border')};
  }
  [role="tablist"]:not([aria-orientation="vertical"]) > [role="tab"][aria-selected="true"] {
    color: ${accent()};
    border-bottom-color: ${accent()};
  }

  /* --- vertical --- */
  [role="tablist"][aria-orientation="vertical"] {
    flex-direction: column;
    gap: 0;
    border-inline-end: ${hairlineWidth()} solid ${border()};
    align-items: stretch;
  }
  [role="tablist"][aria-orientation="vertical"] > [role="tab"] {
    padding: ${pad(1.5)} ${pad(3)};
    border-inline-end: ${focusRingWidth()} solid transparent;
    margin-inline-end: -1px;
    color: ${text('subtle')};
    background: transparent;
    border-radius: ${radius('sm')} 0 0 ${radius('sm')};
    text-align: start;
    user-select: none;
  }
  [role="tablist"][aria-orientation="vertical"] > [role="tab"]:hover:not([aria-disabled="true"]) {
    color: inherit;
    border-inline-end-color: ${accentTint('border')};
  }
  [role="tablist"][aria-orientation="vertical"] > [role="tab"][aria-selected="true"] {
    color: ${accent()};
    border-inline-end-color: ${accent()};
  }

  /* --- disabled --- */
  [role="tab"][aria-disabled="true"] {
    opacity: 0.4;
    pointer-events: none;
  }

  /* --- tabpanel --- */
  [role="tabpanel"] {
    padding: ${pad(3)} 0;
  }
  [role="tabpanel"]:focus-visible {
    outline: ${focusRingWidth()} solid ${accent()};
    outline-offset: 2px;
    border-radius: ${radius('sm')};
  }
`
