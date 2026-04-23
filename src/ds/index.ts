import { menu } from './css/menu'
import { reset } from './reset'
import { states } from './css/states'
import { seeds } from './tokens'
import { tree } from './css/tree'
import { widgets } from './css/widgets'

export const dsCss = [reset, seeds, states(), menu(), tree(), widgets()].join('\n')
