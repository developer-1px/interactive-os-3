import { border, css, hairlineWidth, radius } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'

export const cssAccordion = () => css`
  [data-part="accordion"] {
    display: flex; flex-direction: column;
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('md')};
    overflow: hidden;
  }
  [data-part="accordion"] > details {
    border-block-end: ${hairlineWidth()} solid ${border()};
  }
  [data-part="accordion"] > details:last-child { border-block-end: 0; }
  [data-part="accordion"] > details > summary {
    list-style: none;
    cursor: pointer;
    padding: ${pad(2)} ${pad(2.5)};
    user-select: none;
  }
  [data-part="accordion"] > details > summary::-webkit-details-marker { display: none; }
  [data-part="accordion"] [data-part="accordion-content"] {
    padding: ${pad(2)} ${pad(2.5)};
  }
`
