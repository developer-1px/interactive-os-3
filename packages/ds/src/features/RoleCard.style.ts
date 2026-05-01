import { border, css, hairlineWidth, surface, text, typography } from '../tokens/semantic'
import { font, pad } from '../tokens/scalar'
import { defineStyleContract } from '../style/contract'
import { roleCardContract } from './RoleCard.contract'

/**
 * RoleCard generated class contract.
 *
 * root class가 component boundary를 소유하고, tag/slot selector는 그 아래에서만
 * anatomy를 고른다. 전역 `article[data-card="role"]` selector는 쓰지 않는다.
 */
export const roleCardStyle = defineStyleContract(roleCardContract.name, {
  root: css`
    &[data-part="card"] {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      align-items: start;
      column-gap: ${pad(2)};
      row-gap: ${pad(1)};
    }
    &[data-part="card"] > [data-slot="preview"] {
      grid-column: 1;
      grid-row: 1 / span 2;
      min-block-size: 0;
      padding: 0;
      border: 0;
      background: transparent;
      align-self: start;
    }
    &[data-part="card"] > [data-slot="title"] {
      grid-column: 2;
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="body"] {
      grid-column: 2;
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="footer"] {
      grid-column: 2;
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="preview"] > figure {
      margin: 0;
      display: inline-grid;
      grid-template-columns: auto auto;
      align-items: center;
      gap: ${pad(1)};
    }
    &[data-part="card"] [data-slot="drag"] {
      padding: ${pad(0.5)};
      background: transparent;
      border: 0;
      color: ${text('mute')};
      cursor: grab;
    }
    &[data-part="card"] [data-slot="drag"]::before {
      margin-inline-end: 0;
    }
    &[data-part="card"] [data-slot="drag"]:hover {
      color: ${text('subtle')};
    }
    &[data-part="card"] [data-slot="drag"]:active {
      cursor: grabbing;
    }
    &[data-part="card"] [data-slot="icon"] {
      display: inline-grid;
      place-items: center;
      inline-size: 2rem;
      block-size: 2rem;
      color: ${text('subtle')};
      font-size: ${font('xl')};
    }
    &[data-part="card"] [data-slot="icon"]::before {
      margin-inline-end: 0;
    }
    &[data-part="card"] > [data-slot="title"] > header {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: ${pad(1)};
      min-inline-size: 0;
    }
    &[data-part="card"] > [data-slot="title"] > header > mark {
      flex: none;
      background: ${surface('subtle')};
      color: ${text('subtle')};
      border: ${hairlineWidth()} solid ${border()};
    }
    &[data-part="card"] > [data-slot="title"] [data-part="heading"][data-level="h3"] {
      margin: 0;
      ${typography('bodyStrong')}
    }
    &[data-part="card"] > [data-slot="footer"] > footer {
      display: flex;
      justify-content: flex-end;
    }
    &[data-part="card"] [data-slot="actions"] {
      display: inline-flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: ${pad(1)};
      inline-size: 100%;
    }
    &[data-part="card"] > [data-slot="body"] > p {
      margin: 0;
      font-size: ${font('sm')};
      color: ${text('mute')};
      line-height: 1.5;
    }
  `,
})

export const cssRoleCard = () => roleCardStyle.css
