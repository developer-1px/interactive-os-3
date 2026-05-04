import { accordionAxis } from '@p/headless/patterns'
import { dedupe, probe } from '../../catalog/keys'

export const accordionWrapperKeys = () => dedupe(probe(accordionAxis()))
