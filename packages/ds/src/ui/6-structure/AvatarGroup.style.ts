import { border, css, hairlineWidth, surface, text } from '../../tokens/semantic'
import { pad } from '../../tokens/scalar'

/**
 * AvatarGroup — overlap stack. 각 자식 avatar 뒤에 surface 색 ring 으로 분리.
 */
export const cssAvatarGroup = () => css`
  [data-part="avatar-group"] {
    display: inline-flex;
    isolation: isolate;
  }
  [data-part="avatar-group"] > [data-part="avatar"] {
    box-shadow: 0 0 0 ${hairlineWidth()} ${surface('raised')};
    margin-inline-start: calc(${pad(1)} * -1);
  }
  [data-part="avatar-group"] > [data-part="avatar"]:first-child { margin-inline-start: 0; }
  [data-part="avatar-group"] > [data-part="avatar"][data-overflow] {
    background: ${surface('muted')};
    color: ${text('subtle')};
    border: ${hairlineWidth()} solid ${border()};
    display: inline-flex; align-items: center; justify-content: center;
    font-size: .75em;
  }
`
