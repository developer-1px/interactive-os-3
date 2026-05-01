import { accent, control, css, dur, ease, hairlineWidth, radius, status, statusTint, surface, text } from '../../tokens/semantic'
import { weight, pad } from '../../tokens/scalar'
import { defineStyleContract } from '../../style/contract'

/**
 * Button — 시각 강도는 `data-variant` 로 명시. 위치 기반 자동 분기 ❌.
 *
 *  • default (속성 없음)         : neutral surface + hairline border, hover 시 accent tint
 *  • [data-variant="primary"]    : accent fill, onAccent 텍스트 — 화면당 1 CTA
 *  • [data-variant="destructive"]: status(danger) 색 — 삭제/해지 등
 *
 *  disabled 는 `aria-disabled="true"` 로 hover 약화 (native disabled 와 병행).
 */
export const buttonStyle = defineStyleContract('Button', {
  root: css`
    &:not([data-variant]) {
      background: transparent;
      color: ${text('subtle')};
      border: ${hairlineWidth()} solid transparent;
      border-radius: ${radius('md')};
      padding: 0 ${pad(3)};
      transition: background-color ${dur('fast')} ${ease('out')},
                  color ${dur('fast')} ${ease('out')},
                  border-color ${dur('fast')} ${ease('out')};
    }
    &:not([data-variant]):hover:not([aria-disabled="true"]) {
      background: ${surface('subtle')};
      color: ${text()};
      border-color: ${control('border')};
    }

    &[data-icon]:empty {
      inline-size: ${control('h')};
      padding-inline: 0;
    }
    &[data-icon]:empty::before {
      margin-inline-end: 0;
    }

    &[aria-pressed="true"] {
      background: ${accent('soft')};
      color: ${accent()};
      border-color: ${accent()};
    }
    &[aria-pressed="true"]:hover:not([aria-disabled="true"]) {
      background: ${accent()};
      color: ${text('on-accent')};
    }

    &[data-variant="primary"] {
      background: ${accent()};
      color: ${text('on-accent')};
      border: ${hairlineWidth()} solid ${accent()};
      border-radius: ${radius('md')};
      padding: 0 ${pad(4)};
      font-weight: ${weight('semibold')};
      transition: background-color ${dur('fast')} ${ease('out')};
    }
    &[data-variant="primary"]:hover:not([aria-disabled="true"]) {
      background: ${accent('strong')};
    }

    &[data-variant="destructive"] {
      background: transparent;
      color: ${status('danger')};
      border: ${hairlineWidth()} solid ${statusTint('danger', 'border')};
      border-radius: ${radius('md')};
      padding: 0 ${pad(3)};
      transition: background-color ${dur('fast')} ${ease('out')},
                  color ${dur('fast')} ${ease('out')},
                  border-color ${dur('fast')} ${ease('out')};
    }
    &[data-variant="destructive"]:hover:not([aria-disabled="true"]) {
      background: ${statusTint('danger', 'soft')};
      border-color: ${status('danger')};
    }
  `,
})

export const cssButton = () => buttonStyle.css
