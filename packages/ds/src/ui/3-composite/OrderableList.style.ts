import { accent, border, control, css, dur, ease, hairlineWidth, radius, surface, text } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'
import { defineStyleContract } from '../../style/contract'

/**
 * OrderableList — drag-to-reorder list.
 *
 * The generated root class owns the component boundary. Slots are structural
 * anatomy inside that boundary, not external styling hooks.
 */
export const orderableListStyle = defineStyleContract('OrderableList', {
  root: css`
    list-style: none;
    margin: 0;
    display: flex;
    flex-direction: column;
    padding: ${pad(1)};
    border: ${hairlineWidth()} solid ${border()};
    border-radius: ${radius('lg')};
    background: ${surface()};

    & > li {
      display: grid;
      grid-template-columns: ${control('h')} 3ch auto minmax(0, 1fr) auto;
      grid-template-areas:
        "drag index badge primary meta"
        "drag index . secondary meta";
      column-gap: ${pad(1.5)};
      row-gap: ${pad(0.5)};
      align-items: center;
      padding: ${pad(1.5)} ${pad(2)};
      border-radius: ${radius('md')};
      transition: background-color ${dur('base')} ${ease('out')},
                  box-shadow ${dur('base')} ${ease('out')};
    }
    & > li + li {
      box-shadow: inset 0 ${hairlineWidth()} 0 0 ${border()};
    }
    & > li:hover {
      background: ${surface('subtle')};
    }

    & > li > [data-slot="drag"] {
      grid-area: drag;
      display: grid;
      place-items: center;
      inline-size: ${control('h')};
      block-size: ${control('h')};
      padding: 0;
      border: ${hairlineWidth()} solid transparent;
      border-radius: ${radius('md')};
      background: transparent;
      color: ${text('mute')};
      cursor: grab;
    }
    & > li > [data-slot="drag"]::before {
      margin-inline-end: 0;
    }
    & > li > [data-slot="drag"]:hover {
      color: ${text('subtle')};
      border-color: ${border()};
      background: ${surface()};
    }

    & > li > [data-slot="index"] {
      grid-area: index;
      color: ${text('mute')};
      font-variant-numeric: tabular-nums;
      text-align: end;
    }
    & > li > [data-slot="badge"] {
      grid-area: badge;
      display: inline-flex;
      align-items: center;
    }
    & > li > [data-slot="primary"] {
      grid-area: primary;
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > li > [data-slot="secondary"] {
      grid-area: secondary;
      color: ${text('mute')};
      font-variant-numeric: tabular-nums;
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > li > [data-slot="meta"] {
      grid-area: meta;
      justify-self: end;
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: ${pad(1)};
    }
    & > li > [data-slot="badge"] > mark,
    & > li > [data-slot="meta"] > mark {
      flex: none;
    }

    & > li[data-dragging] {
      background: ${surface('subtle')};
      color: ${text('subtle')};
    }
    & > li[data-dragging] > [data-slot="drag"] {
      cursor: grabbing;
      color: ${accent()};
      border-color: ${accent('border')};
    }
    & > li[data-drop-over] {
      box-shadow: inset 0 2px 0 0 ${accent()};
    }

  `,
})

export const cssOrderableList = () => orderableListStyle.css
