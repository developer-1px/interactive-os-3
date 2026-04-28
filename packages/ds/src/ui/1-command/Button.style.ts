import { accent, control, css, dur, ease, hairlineWidth, radius, square, status, statusTint, surface, text } from '../../tokens/semantic'
import { weight, pad } from '../../tokens/scalar'

/**
 * Button — 시각 강도는 `data-variant` 로 명시. 위치 기반 자동 분기 ❌.
 *
 *  • default (속성 없음)         : neutral surface + hairline border, hover 시 accent tint
 *  • [data-variant="primary"]    : accent fill, onAccent 텍스트 — 화면당 1 CTA
 *  • [data-variant="destructive"]: status(danger) 색 — 삭제/해지 등
 *
 *  disabled 는 `aria-disabled="true"` 로 hover 약화 (native disabled 와 병행).
 */
export const cssButton = () => css`
  /* ── default ─────────────────────────────────────────────── */
  :where(button:not([data-variant])) {
    background: ${surface('subtle')};
    color: inherit;
    border: ${hairlineWidth()} solid ${control('border')};
    border-radius: ${radius('md')};
    padding: 0 ${pad(3)};
    transition: background-color ${dur('fast')} ${ease('out')},
                color ${dur('fast')} ${ease('out')},
                border-color ${dur('fast')} ${ease('out')};
  }
  :where(button:not([data-variant])):hover:not([aria-disabled="true"]) {
    background: ${accent('soft')};
    color: ${accent()};
    border-color: ${accent('border')};
  }

  /* icon-only — children 비어있고 data-icon 만 있는 버튼은 정사각형 */
  ${square('button[data-icon]:empty')}
  :where(button[data-icon]:empty)::before {
    margin-inline-end: 0;
  }

  /* ── pressed (toggle) — aria-pressed=true 표명 시 accent tint ── */
  button[aria-pressed="true"] {
    background: ${accent('soft')};
    color: ${accent()};
    border-color: ${accent()};
  }
  button[aria-pressed="true"]:hover:not([aria-disabled="true"]) {
    background: ${accent()};
    color: ${text('on-accent')};
  }

  /* ── primary ─────────────────────────────────────────────── */
  button[data-variant="primary"] {
    background: ${accent()};
    color: ${text('on-accent')};
    border: ${hairlineWidth()} solid ${accent()};
    border-radius: ${radius('md')};
    padding: 0 ${pad(4)};
    font-weight: ${weight('semibold')};
    transition: background-color ${dur('fast')} ${ease('out')};
  }
  button[data-variant="primary"]:hover:not([aria-disabled="true"]) {
    background: ${accent('strong')};
  }

  /* ── destructive ─────────────────────────────────────────── */
  button[data-variant="destructive"] {
    background: ${statusTint('danger', 'soft')};
    color: ${status('danger')};
    border: ${hairlineWidth()} solid ${statusTint('danger', 'border')};
    border-radius: ${radius('md')};
    padding: 0 ${pad(3)};
    transition: background-color ${dur('fast')} ${ease('out')},
                color ${dur('fast')} ${ease('out')},
                border-color ${dur('fast')} ${ease('out')};
  }
  button[data-variant="destructive"]:hover:not([aria-disabled="true"]) {
    background: ${status('danger')};
    color: ${text('on-accent')};
    border-color: ${status('danger')};
  }
`
