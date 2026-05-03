import { tabsAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../../headless-site/keys'

export const tabsWrapperKeys = () => dedupe(probe(tabsAxis()))
