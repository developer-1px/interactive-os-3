import { accent, accentTint, border, css, hairlineWidth, radius, surface, text } from '../../tokens/foundations'
import { font, pad } from '../../tokens/palette'

export const cssStepper = () => css`
  [data-part="stepper"] {
    list-style: none; margin: 0; padding: 0;
    display: flex; align-items: flex-start; gap: ${pad(2)};
  }
  [data-part="stepper"][data-orientation="vertical"] { flex-direction: column; }
  [data-part="stepper"] > li {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "marker label"
      "marker description";
    column-gap: ${pad(1.5)};
    align-items: center;
    color: ${text('subtle')};
    flex: 1;
  }
  [data-part="stepper"] [data-part="step-marker"] {
    grid-area: marker;
    inline-size: 1.75em; block-size: 1.75em;
    border-radius: ${radius('pill')};
    border: ${hairlineWidth()} solid ${border()};
    background: ${surface('raised')};
    display: inline-flex; align-items: center; justify-content: center;
    font-size: ${font('xs')};
  }
  [data-part="stepper"] [data-part="step-label"] { grid-area: label; }
  [data-part="stepper"] [data-part="step-description"] {
    grid-area: description;
    color: ${text('mute')}; font-size: ${font('xs')};
  }
  [data-part="stepper"] > li[data-state="current"] {
    color: inherit;
  }
  [data-part="stepper"] > li[data-state="current"] [data-part="step-marker"] {
    background: ${accentTint('soft')};
    border-color: ${accent()};
    color: ${accent()};
  }
  [data-part="stepper"] > li[data-state="complete"] [data-part="step-marker"] {
    background: ${accent()};
    border-color: ${accent()};
    color: ${surface('raised')};
  }
`
