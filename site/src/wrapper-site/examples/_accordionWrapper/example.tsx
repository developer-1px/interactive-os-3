import { accordionAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../../headless-site/keys'

export const accordionWrapperKeys = () => dedupe(probe(accordionAxis()))
