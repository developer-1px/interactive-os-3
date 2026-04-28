import { css, text } from '../../tokens/semantic'
import { font, pad } from '../../tokens/scalar'

/**
 * MediaObject — 좌측 media 고정폭 + 우측 (title/body/meta) 스택. grid-template-areas.
 * media 영역은 inherit auto-size — Avatar/Thumbnail 자체 크기를 따름.
 */
export const cssMedia = () => css`
  [data-part="media"] {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "media title"
      "media body"
      "media meta";
    grid-template-rows: auto auto auto;
    column-gap: ${pad(2)};
    row-gap: ${pad(0.25)};
    align-items: start;
  }
  [data-part="media"] > [data-slot="media"] { grid-area: media; }
  [data-part="media"] > [data-slot="title"] { grid-area: title; }
  [data-part="media"] > [data-slot="body"]  { grid-area: body; color: ${text('subtle')}; }
  [data-part="media"] > [data-slot="meta"]  { grid-area: meta; color: ${text('mute')}; font-size: ${font('xs')}; }
`
