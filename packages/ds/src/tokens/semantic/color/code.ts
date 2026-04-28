import { mix } from '../../scalar/color'

/**
 * Code/inline-code/pre/blockquote 배경 surface scale.
 * Canvas/CanvasText 간 mix percent를 의미 토큰으로 흡수.
 *
 * inline=96, block=97, kbd=94 (살짝 진하게), zebra=98, hover=95, sticky=99
 *
 * @demo type=color fn=codeSurface args=["inline"]
 */
export const codeSurface = (
  t: 'inline' | 'block' | 'kbd' | 'zebra' | 'subtle' | 'hover' | 'sticky' | 'field',
) => {
  const map = {
    inline: 96,
    block: 97,
    kbd: 94,
    zebra: 98,
    subtle: 98,
    hover: 92,
    sticky: 99,
    field: 99,
  }
  return mix('Canvas', map[t], 'CanvasText')
}
