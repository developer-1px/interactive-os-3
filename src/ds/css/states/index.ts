import { active, disabled, focus, highlighted, hover, selected } from '../../fn'
import { base } from './base'
import { control, rovingItem } from './selectors'

export const states = () =>
  [
    base,
    highlighted(rovingItem),
    selected(rovingItem),
    hover(rovingItem),
    active(rovingItem),
    disabled(rovingItem),
    focus(control),
    selected(control),
    hover(control),
    active(control),
    disabled(control),
  ].join('\n')
