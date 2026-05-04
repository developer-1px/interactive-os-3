import { tabsAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../catalog/keys'

export const tabsWrapperKeys = () => dedupe(probe(tabsAxis()))
