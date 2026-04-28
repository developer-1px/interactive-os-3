import { accent, accentTint, css, onAccent } from '../../tokens/foundations'

/**
 * ToggleButton — pressed=true 시 accent fill 로 시각 강조.
 * Button 기본(neutral)은 그대로 두고, [aria-pressed="true"] 만 덮어쓴다.
 */
export const cssToggleButton = () => css`
  button[data-part="toggle"][aria-pressed="true"] {
    background: ${accentTint('soft')};
    color: ${accent()};
    border-color: ${accent()};
  }
  button[data-part="toggle"][aria-pressed="true"]:hover {
    background: ${accent()};
    color: ${onAccent()};
  }
`
