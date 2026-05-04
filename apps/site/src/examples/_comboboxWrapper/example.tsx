import { comboboxAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../catalog/keys'

export const comboboxWrapperKeys = () => dedupe(probe(comboboxAxis()))
