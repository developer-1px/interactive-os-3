import { comboboxAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../../headless-site/keys'

export const comboboxWrapperKeys = () => dedupe(probe(comboboxAxis()))
