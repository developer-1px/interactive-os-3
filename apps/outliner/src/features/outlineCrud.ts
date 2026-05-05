import { createJsonCrud } from 'zod-crud'
import { OutlineNode, SAMPLE } from '../entities/outlineNode'

export const crud = createJsonCrud(OutlineNode, SAMPLE)
