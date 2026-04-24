import { chromeCss } from './chrome'
import { panesCss } from './panes'

export const shell = () => [chromeCss, panesCss].join('\n')
