import { menu } from './menu'
import { reset } from './reset'
import { states } from './states'
import { seeds } from './tokens'
import { tree } from './tree'
import { widgets } from './widgets'

export const dsCss = [reset, seeds, states(), menu(), tree(), widgets()].join('\n')
