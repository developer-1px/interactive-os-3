import { menu } from './css/menu'
import { reset } from './reset'
import { shell } from './css/shell'
import { states } from './css/states'
import { seeds } from './tokens'
import { tree } from './css/tree'
import { widgets } from './css/widgets'
import { iconVars, iconIndicator } from './fn/icon'

export const dsCss = [
  reset,
  seeds,
  iconVars(),
  states(),
  menu(),
  tree(),
  widgets(),
  iconIndicator(),
  shell(),
].join('\n')
